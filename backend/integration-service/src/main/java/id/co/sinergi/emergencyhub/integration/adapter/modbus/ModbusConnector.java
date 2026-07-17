package id.co.sinergi.emergencyhub.integration.adapter.modbus;

import com.ghgande.j2mod.modbus.facade.ModbusTCPMaster;
import com.ghgande.j2mod.modbus.procimg.Register;
import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.common.exception.DeviceConnectionException;
import id.co.sinergi.emergencyhub.integration.adapter.ProtocolAdapter;
import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Modbus TCP protocol adapter.
 *
 * <p>Menghubungkan ke panel fire alarm dan PLC via Modbus TCP,
 * membaca holding registers, dan mengonversi nilainya ke
 * {@link NormalizedEvent}.
 *
 * <p>Satu instance {@link ModbusTCPMaster} per device disimpan di
 * connection pool (ConcurrentHashMap) untuk reuse.
 *
 * <p><b>Thread Safety:</b> j2mod ModbusTCPMaster bukan thread-safe.
 * Akses ke setiap master disinkronisasi per-device via
 * synchronized block pada entry map.
 */
@Slf4j
@Component
public class ModbusConnector implements ProtocolAdapter {

    /** Connection pool: deviceId → ModbusTCPMaster */
    private final ConcurrentHashMap<String, ModbusTCPMaster> connections = new ConcurrentHashMap<>();

    @Override
    public String getProtocolName() {
        return "MODBUS";
    }

    @Override
    public void connect(DeviceConfig config) {
        String deviceId = config.getId().toString();
        if (connections.containsKey(deviceId)) {
            log.warn("Modbus device [{}] already connected", config.getName());
            return;
        }

        try {
            ModbusTCPMaster master = new ModbusTCPMaster(
                    config.getIpAddress(),
                    config.getPort() != null ? config.getPort() : 502
            );
            master.connect();
            connections.put(deviceId, master);
            log.info("Connected to Modbus device [{}] at {}:{}",
                    config.getName(), config.getIpAddress(), config.getPort());
        } catch (Exception e) {
            throw new DeviceConnectionException(
                    deviceId, "MODBUS",
                    "Failed to connect to " + config.getIpAddress() + ":" + config.getPort(),
                    e
            );
        }
    }

    @Override
    public void disconnect(DeviceConfig config) {
        String deviceId = config.getId().toString();
        ModbusTCPMaster master = connections.remove(deviceId);
        if (master != null) {
            master.disconnect();
            log.info("Disconnected from Modbus device [{}]", config.getName());
        }
    }

    @Override
    public boolean isConnected(DeviceConfig config) {
        String deviceId = config.getId().toString();
        ModbusTCPMaster master = connections.get(deviceId);
        return master != null;
    }

    @Override
    public NormalizedEvent read(DeviceConfig config) {
        String deviceId = config.getId().toString();
        ModbusTCPMaster master = connections.get(deviceId);

        if (master == null) {
            throw new DeviceConnectionException(deviceId, "MODBUS", "Not connected");
        }

        try {
            Map<String, Object> deviceConfig = config.getConfig();
            int unitId = config.getUnitId() != null ? config.getUnitId() : 1;
            int registerStart = getIntConfig(deviceConfig, "registerStart", 0);
            int registerCount = getIntConfig(deviceConfig, "registerCount", 10);

            // Read holding registers
            Register[] registers;
            synchronized (master) {
                registers = master.readMultipleRegisters(unitId, registerStart, registerCount);
            }

            // Build payload from register values
            Map<String, Object> payload = new HashMap<>();
            @SuppressWarnings("unchecked")
            Map<String, String> registerMap = (Map<String, String>) deviceConfig.get("registerMap");

            for (int i = 0; i < registers.length; i++) {
                int address = registerStart + i;
                String label = (registerMap != null)
                        ? registerMap.getOrDefault(String.valueOf(address), "REG_" + address)
                        : "REG_" + address;
                payload.put(label, registers[i].getValue());
            }

            // Determine event type & severity based on register values
            String eventType = determineEventType(payload);
            String severity = determineSeverity(payload);

            return NormalizedEvent.builder()
                    .deviceId(deviceId)
                    .protocol("MODBUS")
                    .eventType(eventType)
                    .severity(severity)
                    .payload(payload)
                    .rawData(registersToString(registers))
                    .timestamp(Instant.now())
                    .zoneId(config.getZoneId() != null ? config.getZoneId().toString() : null)
                    .sourceAddress(config.getIpAddress() + ":" + config.getPort())
                    .build();

        } catch (DeviceConnectionException e) {
            throw e;
        } catch (Exception e) {
            throw new DeviceConnectionException(deviceId, "MODBUS", "Error reading registers", e);
        }
    }

    /**
     * Determine event type from register values.
     * Placeholder logic — will be refined when actual register maps are available from vendors.
     */
    private String determineEventType(Map<String, Object> payload) {
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (entry.getKey().contains("FIRE") && ((int) entry.getValue()) > 0) {
                return "FIRE_ALARM";
            }
            if (entry.getKey().contains("SMOKE") && ((int) entry.getValue()) > 0) {
                return "SMOKE_DETECTED";
            }
        }
        return "HEARTBEAT";
    }

    /**
     * Determine severity based on register values.
     * Placeholder logic — will be refined with actual alarm logic.
     */
    private String determineSeverity(Map<String, Object> payload) {
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (entry.getKey().contains("FIRE") && ((int) entry.getValue()) > 0) {
                return "CRITICAL";
            }
        }
        return "INFO";
    }

    private int getIntConfig(Map<String, Object> config, String key, int defaultValue) {
        if (config == null || !config.containsKey(key)) return defaultValue;
        Object val = config.get(key);
        if (val instanceof Number) return ((Number) val).intValue();
        return Integer.parseInt(val.toString());
    }

    private String registersToString(Register[] registers) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < registers.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(registers[i].getValue());
        }
        sb.append("]");
        return sb.toString();
    }
}
