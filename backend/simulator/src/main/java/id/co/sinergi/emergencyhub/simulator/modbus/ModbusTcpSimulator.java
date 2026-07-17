package id.co.sinergi.emergencyhub.simulator.modbus;

import com.ghgande.j2mod.modbus.procimg.SimpleDigitalIn;
import com.ghgande.j2mod.modbus.procimg.SimpleDigitalOut;
import com.ghgande.j2mod.modbus.procimg.SimpleInputRegister;
import com.ghgande.j2mod.modbus.procimg.SimpleProcessImage;
import com.ghgande.j2mod.modbus.procimg.SimpleRegister;
import com.ghgande.j2mod.modbus.slave.ModbusSlave;
import com.ghgande.j2mod.modbus.slave.ModbusSlaveFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Modbus TCP Server Simulator.
 *
 * <p>Mensimulasikan panel fire alarm sebagai Modbus slave/server.
 * Integration service bisa connect ke simulator ini sebagai Modbus master/client.
 *
 * <h3>Register Map (Holding Registers):</h3>
 * <table>
 *   <tr><th>Address</th><th>Description</th><th>Values</th></tr>
 *   <tr><td>0</td><td>Zone 1 Fire Alarm</td><td>0=Normal, 1=Fire</td></tr>
 *   <tr><td>1</td><td>Zone 2 Fire Alarm</td><td>0=Normal, 1=Fire</td></tr>
 *   <tr><td>2</td><td>Zone 3 Fire Alarm</td><td>0=Normal, 1=Fire</td></tr>
 *   <tr><td>3</td><td>Zone 4 Fire Alarm</td><td>0=Normal, 1=Fire</td></tr>
 *   <tr><td>4</td><td>Smoke Detector</td><td>0=Normal, 1=Smoke</td></tr>
 *   <tr><td>5</td><td>Heat Detector</td><td>Temperature in °C</td></tr>
 *   <tr><td>6</td><td>Manual Call Point</td><td>0=Normal, 1=Activated</td></tr>
 *   <tr><td>7</td><td>Sprinkler Flow</td><td>0=Normal, 1=Flow</td></tr>
 *   <tr><td>8</td><td>Panel Status</td><td>0=Normal, 1=Fault</td></tr>
 *   <tr><td>9</td><td>Power Status</td><td>0=Mains, 1=Battery</td></tr>
 * </table>
 */
@Slf4j
@Component
public class ModbusTcpSimulator {

    @Value("${simulator.modbus.port:5020}")
    private int port;

    @Value("${simulator.modbus.unit-id:1}")
    private int unitId;

    @Value("${simulator.modbus.dynamic:true}")
    private boolean dynamicMode;

    @Value("${simulator.modbus.fault-interval-seconds:30}")
    private int faultIntervalSeconds;

    private ModbusSlave slave;
    private SimpleProcessImage processImage;
    private ScheduledExecutorService scheduler;
    private final Random random = new Random();

    public void start() {
        try {
            // Create process image with registers
            processImage = new SimpleProcessImage(unitId);

            // Add 10 holding registers (all start at 0 = normal)
            for (int i = 0; i < 10; i++) {
                processImage.addRegister(new SimpleRegister(0));
            }

            // Add 4 digital inputs (zone status summary)
            for (int i = 0; i < 4; i++) {
                processImage.addDigitalIn(new SimpleDigitalIn(false));
            }

            // Add 2 digital outputs (alarm siren, evacuation signal)
            for (int i = 0; i < 2; i++) {
                processImage.addDigitalOut(new SimpleDigitalOut(false));
            }

            // Add 10 input registers (read-only sensor data)
            for (int i = 0; i < 10; i++) {
                processImage.addInputRegister(new SimpleInputRegister(0));
            }

            // Set initial temperature to 25°C
            processImage.getRegister(5).setValue(25);

            // Create Modbus TCP slave
            slave = ModbusSlaveFactory.createTCPSlave(port, 5);
            slave.addProcessImage(unitId, processImage);
            slave.open();

            log.info("═══════════════════════════════════════════");
            log.info("  MODBUS TCP SIMULATOR STARTED");
            log.info("  Port     : {}", port);
            log.info("  Unit ID  : {}", unitId);
            log.info("  Mode     : {}", dynamicMode ? "DYNAMIC (random faults)" : "STATIC");
            log.info("  Registers: 10 holding, 10 input, 4 DI, 2 DO");
            log.info("═══════════════════════════════════════════");

            // Start dynamic fault injection if enabled
            if (dynamicMode) {
                startDynamicSimulation();
            }

        } catch (Exception e) {
            log.error("Failed to start Modbus simulator: {}", e.getMessage(), e);
        }
    }

    public void stop() {
        if (scheduler != null) {
            scheduler.shutdown();
        }
        if (slave != null) {
            slave.close();
            log.info("Modbus simulator stopped");
        }
    }

    /**
     * Dynamic simulation — randomly trigger alarms at configured intervals.
     */
    private void startDynamicSimulation() {
        scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(() -> {
            try {
                // Random fire alarm on zone 1-4 (registers 0-3)
                int zone = random.nextInt(4);
                boolean fireAlarm = random.nextInt(100) < 15; // 15% chance of fire
                processImage.getRegister(zone).setValue(fireAlarm ? 1 : 0);

                // Random smoke detector (register 4)
                boolean smoke = random.nextInt(100) < 10; // 10% chance
                processImage.getRegister(4).setValue(smoke ? 1 : 0);

                // Fluctuating temperature (register 5)
                int temp = 20 + random.nextInt(40); // 20-60°C
                processImage.getRegister(5).setValue(temp);

                // Panel status (register 8)
                boolean fault = random.nextInt(100) < 5; // 5% chance of fault
                processImage.getRegister(8).setValue(fault ? 1 : 0);

                if (fireAlarm || smoke) {
                    log.warn("🔥 SIMULATED EVENT — Zone {} fire={}, smoke={}, temp={}°C",
                            zone + 1, fireAlarm, smoke, temp);
                } else {
                    log.debug("Simulation tick — all normal, temp={}°C", temp);
                }

            } catch (Exception e) {
                log.error("Simulation error: {}", e.getMessage());
            }
        }, 5, faultIntervalSeconds, TimeUnit.SECONDS);

        log.info("Dynamic simulation started — fault injection every {} seconds", faultIntervalSeconds);
    }
}
