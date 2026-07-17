package id.co.sinergi.emergencyhub.integration.service;

import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.common.enums.DeviceProtocol;
import id.co.sinergi.emergencyhub.integration.adapter.ProtocolAdapter;
import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;
import id.co.sinergi.emergencyhub.integration.event.IntegrationEventPublisher;
import id.co.sinergi.emergencyhub.integration.repository.DeviceConfigRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service utama yang mengelola koneksi ke semua device.
 *
 * <p>Pada startup, membaca semua device config dari database,
 * menghubungkan via protocol adapter yang sesuai, dan mulai polling
 * untuk device yang bersifat pull-based (Modbus).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DevicePollingService {

    private final DeviceConfigRepository deviceConfigRepository;
    private final List<ProtocolAdapter> protocolAdapters;
    private final IntegrationEventPublisher eventPublisher;

    private Map<String, ProtocolAdapter> adapterMap;

    @PostConstruct
    public void init() {
        // Build adapter lookup map: protocol name → adapter instance
        adapterMap = protocolAdapters.stream()
                .collect(Collectors.toMap(ProtocolAdapter::getProtocolName, Function.identity()));
        log.info("Loaded {} protocol adapters: {}", adapterMap.size(), adapterMap.keySet());

        // Auto-connect configured devices
        connectAllDevices();
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down device connections...");
        List<DeviceConfig> devices = deviceConfigRepository.findAll();
        for (DeviceConfig device : devices) {
            ProtocolAdapter adapter = adapterMap.get(device.getProtocol().name());
            if (adapter != null && adapter.isConnected(device)) {
                try {
                    adapter.disconnect(device);
                } catch (Exception e) {
                    log.error("Error disconnecting device [{}]: {}", device.getName(), e.getMessage());
                }
            }
        }
    }

    /**
     * Polling untuk device Modbus — dijalankan setiap 2 detik.
     * MQTT device tidak di-poll karena push-based.
     */
    @Scheduled(fixedDelayString = "${emergencyhub.polling.interval-ms:2000}")
    public void pollModbusDevices() {
        List<DeviceConfig> modbusDevices = deviceConfigRepository
                .findByProtocolAndStatus(DeviceProtocol.MODBUS, "ONLINE");

        for (DeviceConfig device : modbusDevices) {
            try {
                ProtocolAdapter adapter = adapterMap.get("MODBUS");
                if (adapter != null && adapter.isConnected(device)) {
                    NormalizedEvent event = adapter.read(device);
                    if (event != null) {
                        eventPublisher.publish(event);
                    }
                }
            } catch (Exception e) {
                log.error("Error polling device [{}]: {}", device.getName(), e.getMessage());
                // Update device status to FAULT
                device.setStatus("FAULT");
                deviceConfigRepository.save(device);
            }
        }
    }

    private void connectAllDevices() {
        List<DeviceConfig> devices = deviceConfigRepository.findAll();
        log.info("Connecting to {} configured devices...", devices.size());

        for (DeviceConfig device : devices) {
            ProtocolAdapter adapter = adapterMap.get(device.getProtocol().name());
            if (adapter == null) {
                log.warn("No adapter found for protocol [{}] — device [{}] skipped",
                        device.getProtocol(), device.getName());
                continue;
            }

            try {
                adapter.connect(device);
                device.setStatus("ONLINE");
                deviceConfigRepository.save(device);
            } catch (Exception e) {
                log.error("Failed to connect device [{}] ({}): {}",
                        device.getName(), device.getProtocol(), e.getMessage());
                device.setStatus("FAULT");
                deviceConfigRepository.save(device);
            }
        }
    }
}
