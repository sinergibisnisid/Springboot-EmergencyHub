package id.co.sinergi.emergencyhub.simulator;

import id.co.sinergi.emergencyhub.simulator.modbus.ModbusTcpSimulator;
import id.co.sinergi.emergencyhub.simulator.mqtt.MqttPublisherSimulator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Simulator Application — standalone Spring Boot app untuk simulasi device.
 *
 * <p>Usage:
 * <pre>
 * # Run all simulators
 * mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=all"
 *
 * # Run Modbus only
 * mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=modbus"
 *
 * # Run MQTT only
 * mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=mqtt"
 * </pre>
 */
@Slf4j
@SpringBootApplication
@RequiredArgsConstructor
public class SimulatorApplication implements CommandLineRunner {

    private final ModbusTcpSimulator modbusSimulator;
    private final MqttPublisherSimulator mqttSimulator;

    public static void main(String[] args) {
        SpringApplication.run(SimulatorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String mode = "all";
        for (String arg : args) {
            if (arg.startsWith("--mode=")) {
                mode = arg.substring("--mode=".length()).toLowerCase();
            }
        }

        log.info("╔══════════════════════════════════════════╗");
        log.info("║   EMERGENCY HUB — DEVICE SIMULATOR      ║");
        log.info("║   Mode: {}{}", mode.toUpperCase(), " ".repeat(33 - mode.length()) + "║");
        log.info("╚══════════════════════════════════════════╝");

        switch (mode) {
            case "modbus" -> {
                modbusSimulator.start();
            }
            case "mqtt" -> {
                mqttSimulator.start();
            }
            case "all" -> {
                modbusSimulator.start();
                mqttSimulator.start();
            }
            default -> {
                log.error("Unknown mode: {}. Use: all, modbus, mqtt", mode);
                System.exit(1);
            }
        }

        log.info("Simulator running. Press Ctrl+C to stop.");

        // Keep alive
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("Shutting down simulators...");
            modbusSimulator.stop();
            mqttSimulator.stop();
        }));
    }
}
