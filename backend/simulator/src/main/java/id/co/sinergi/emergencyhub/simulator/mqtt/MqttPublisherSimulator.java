package id.co.sinergi.emergencyhub.simulator.mqtt;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * MQTT Publisher Simulator.
 *
 * <p>Mensimulasikan IoT gateway yang mengirim data sensor ke MQTT broker.
 * Publish JSON payload ke topics sesuai convention yang didefinisikan
 * di integration spec.
 *
 * <h3>Simulated Devices:</h3>
 * <ul>
 *   <li>{@code devices/gas-sensor-01/data} — Gas concentration (ppm)</li>
 *   <li>{@code devices/gas-sensor-02/data} — Gas concentration (ppm)</li>
 *   <li>{@code devices/wind-sensor-01/data} — Wind speed (km/h) & direction</li>
 *   <li>{@code devices/temp-sensor-01/data} — Temperature (°C) & humidity (%)</li>
 * </ul>
 *
 * <h3>JSON Payload Format:</h3>
 * <pre>
 * {
 *   "deviceId": "gas-sensor-01",
 *   "eventType": "GAS_LEVEL",
 *   "severity": "INFO",
 *   "zoneId": "ZONE-B",
 *   "timestamp": "2024-01-01T00:00:00Z",
 *   "concentration": 12.5,
 *   "unit": "ppm"
 * }
 * </pre>
 */
@Slf4j
@Component
public class MqttPublisherSimulator {

    @Value("${simulator.mqtt.broker-url:tcp://localhost:1883}")
    private String brokerUrl;

    @Value("${simulator.mqtt.publish-interval-seconds:5}")
    private int publishIntervalSeconds;

    @Value("${simulator.mqtt.enabled:true}")
    private boolean enabled;

    private MqttClient client;
    private ScheduledExecutorService scheduler;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    public void start() {
        if (!enabled) {
            log.info("MQTT simulator disabled");
            return;
        }

        try {
            String clientId = "ehub-simulator-" + UUID.randomUUID().toString().substring(0, 8);
            client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());

            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(10);

            client.connect(options);

            log.info("═══════════════════════════════════════════");
            log.info("  MQTT PUBLISHER SIMULATOR STARTED");
            log.info("  Broker   : {}", brokerUrl);
            log.info("  Client ID: {}", clientId);
            log.info("  Interval : {} seconds", publishIntervalSeconds);
            log.info("  Devices  : gas-sensor-01, gas-sensor-02,");
            log.info("             wind-sensor-01, temp-sensor-01");
            log.info("═══════════════════════════════════════════");

            startPublishing();

        } catch (Exception e) {
            log.error("Failed to start MQTT simulator: {}", e.getMessage());
            log.warn("Make sure Mosquitto broker is running on {}", brokerUrl);
            log.warn("MQTT simulator will be skipped. Modbus simulator can still run.");
        }
    }

    public void stop() {
        if (scheduler != null) {
            scheduler.shutdown();
        }
        if (client != null && client.isConnected()) {
            try {
                client.disconnect();
                log.info("MQTT simulator stopped");
            } catch (Exception e) {
                log.error("Error disconnecting MQTT: {}", e.getMessage());
            }
        }
    }

    private void startPublishing() {
        scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(() -> {
            try {
                publishGasSensor("gas-sensor-01", "ZONE-B");
                publishGasSensor("gas-sensor-02", "ZONE-C");
                publishWindSensor("wind-sensor-01", "ZONE-E");
                publishTempSensor("temp-sensor-01", "ZONE-A");
            } catch (Exception e) {
                log.error("MQTT publish error: {}", e.getMessage());
            }
        }, 2, publishIntervalSeconds, TimeUnit.SECONDS);
    }

    private void publishGasSensor(String deviceId, String zoneId) throws Exception {
        // Normal: 0-20 ppm, Elevated: 20-50, Dangerous: 50-100+
        double concentration = random.nextGaussian() * 8 + 15; // Mean 15, SD 8
        concentration = Math.max(0, Math.min(concentration, 120));

        String severity = concentration > 50 ? "CRITICAL"
                : concentration > 30 ? "WARNING" : "INFO";
        String eventType = concentration > 50 ? "GAS_LEAK" : "GAS_LEVEL_HIGH";
        if (concentration <= 30) eventType = "HEARTBEAT";

        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", deviceId);
        payload.put("eventType", eventType);
        payload.put("severity", severity);
        payload.put("zoneId", zoneId);
        payload.put("timestamp", Instant.now().toString());
        payload.put("concentration", Math.round(concentration * 10.0) / 10.0);
        payload.put("unit", "ppm");

        publish("devices/" + deviceId + "/data", payload);

        if (!"HEARTBEAT".equals(eventType)) {
            log.warn("⚠️  Gas [{}]: {:.1f} ppm — {}", deviceId, concentration, severity);
        }
    }

    private void publishWindSensor(String deviceId, String zoneId) throws Exception {
        double speed = random.nextGaussian() * 10 + 15; // Mean 15 km/h, SD 10
        speed = Math.max(0, Math.min(speed, 80));
        String[] directions = {"N", "NE", "E", "SE", "S", "SW", "W", "NW"};
        String direction = directions[random.nextInt(directions.length)];

        String severity = speed > 40 ? "CRITICAL" : speed > 25 ? "WARNING" : "INFO";
        String eventType = speed > 25 ? "WIND_SPEED" : "HEARTBEAT";

        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", deviceId);
        payload.put("eventType", eventType);
        payload.put("severity", severity);
        payload.put("zoneId", zoneId);
        payload.put("timestamp", Instant.now().toString());
        payload.put("speed", Math.round(speed * 10.0) / 10.0);
        payload.put("direction", direction);
        payload.put("unit", "km/h");

        publish("devices/" + deviceId + "/data", payload);

        if (speed > 25) {
            log.warn("💨 Wind [{}]: {} km/h {} — {}", deviceId, Math.round(speed), direction, severity);
        }
    }

    private void publishTempSensor(String deviceId, String zoneId) throws Exception {
        double temperature = random.nextGaussian() * 5 + 35; // Mean 35°C
        temperature = Math.max(15, Math.min(temperature, 80));
        double humidity = random.nextGaussian() * 10 + 60; // Mean 60%
        humidity = Math.max(20, Math.min(humidity, 100));

        String severity = temperature > 55 ? "CRITICAL" : temperature > 45 ? "WARNING" : "INFO";
        String eventType = temperature > 45 ? "TEMPERATURE" : "HEARTBEAT";

        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", deviceId);
        payload.put("eventType", eventType);
        payload.put("severity", severity);
        payload.put("zoneId", zoneId);
        payload.put("timestamp", Instant.now().toString());
        payload.put("temperature", Math.round(temperature * 10.0) / 10.0);
        payload.put("humidity", Math.round(humidity * 10.0) / 10.0);

        publish("devices/" + deviceId + "/data", payload);
    }

    private void publish(String topic, Map<String, Object> data) throws Exception {
        if (client == null || !client.isConnected()) return;

        String json = objectMapper.writeValueAsString(data);
        MqttMessage message = new MqttMessage(json.getBytes());
        message.setQos(1);
        message.setRetained(false);
        client.publish(topic, message);

        log.debug("Published to [{}]: {}", topic, json);
    }
}
