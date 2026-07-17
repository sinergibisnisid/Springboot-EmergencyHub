package id.co.sinergi.emergencyhub.integration.adapter.mqtt;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.integration.adapter.ProtocolAdapter;
import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;
import id.co.sinergi.emergencyhub.integration.event.IntegrationEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MQTT protocol adapter.
 *
 * <p>Berbeda dari Modbus yang pull-based (polling), MQTT bersifat push-based.
 * Device/IoT gateway publish data ke broker, dan adapter ini subscribe
 * ke topic yang relevan.
 *
 * <p>Konfigurasi koneksi MQTT broker ada di {@link MqttConfig}.
 * Adapter ini bertanggung jawab mem-parse JSON payload yang diterima
 * dan mengonversinya ke {@link NormalizedEvent}.
 *
 * <p>Connect/disconnect per-device di sini lebih ke topic subscription
 * management, karena koneksi ke broker dihandle secara global oleh
 * Spring Integration MQTT.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MqttConnector implements ProtocolAdapter {

    private final ObjectMapper objectMapper;
    private final IntegrationEventPublisher eventPublisher;

    /** Tracked subscriptions: deviceId → topic */
    private final ConcurrentHashMap<String, String> subscriptions = new ConcurrentHashMap<>();

    @Override
    public String getProtocolName() {
        return "MQTT";
    }

    @Override
    public void connect(DeviceConfig config) {
        String deviceId = config.getId().toString();
        String topic = extractTopic(config);
        subscriptions.put(deviceId, topic);
        log.info("MQTT subscription registered for device [{}] on topic [{}]", config.getName(), topic);
    }

    @Override
    public void disconnect(DeviceConfig config) {
        String deviceId = config.getId().toString();
        String topic = subscriptions.remove(deviceId);
        if (topic != null) {
            log.info("MQTT subscription removed for device [{}] on topic [{}]", config.getName(), topic);
        }
    }

    @Override
    public boolean isConnected(DeviceConfig config) {
        return subscriptions.containsKey(config.getId().toString());
    }

    @Override
    public NormalizedEvent read(DeviceConfig config) {
        // MQTT is push-based — data comes via handleMessage(), not polling.
        // This method returns null for MQTT adapter.
        return null;
    }

    /**
     * Handler yang dipanggil oleh Spring Integration MQTT saat pesan diterima.
     *
     * @param topic   MQTT topic
     * @param payload JSON string dari IoT gateway
     */
    public void handleMessage(String topic, String payload) {
        log.debug("MQTT message received on topic [{}]: {}", topic, payload);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);

            String deviceId = (String) data.getOrDefault("deviceId", extractDeviceIdFromTopic(topic));
            String eventType = (String) data.getOrDefault("eventType", "SENSOR_DATA");
            String severity = (String) data.getOrDefault("severity", "INFO");
            String zoneId = (String) data.get("zoneId");

            NormalizedEvent event = NormalizedEvent.builder()
                    .deviceId(deviceId)
                    .protocol("MQTT")
                    .eventType(eventType)
                    .severity(severity)
                    .payload(data)
                    .rawData(payload)
                    .timestamp(Instant.now())
                    .zoneId(zoneId)
                    .build();

            eventPublisher.publish(event);

        } catch (Exception e) {
            log.error("Failed to parse MQTT message on topic [{}]: {}", topic, e.getMessage(), e);
        }
    }

    private String extractTopic(DeviceConfig config) {
        if (config.getConfig() != null && config.getConfig().containsKey("topic")) {
            return config.getConfig().get("topic").toString();
        }
        return "devices/" + config.getName() + "/data";
    }

    /**
     * Extract device ID from MQTT topic.
     * Expected pattern: devices/{deviceId}/data
     */
    private String extractDeviceIdFromTopic(String topic) {
        String[] parts = topic.split("/");
        if (parts.length >= 2) {
            return parts[1];
        }
        return "UNKNOWN";
    }
}
