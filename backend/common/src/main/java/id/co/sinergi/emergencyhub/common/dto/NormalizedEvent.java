package id.co.sinergi.emergencyhub.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

/**
 * Format event ter-normalisasi yang digunakan di seluruh platform.
 * Semua protokol (Modbus, MQTT, ONVIF) di-convert ke format ini
 * sebelum masuk ke Alarm Engine.
 *
 * <p>Contoh:
 * <pre>
 * NormalizedEvent.builder()
 *     .deviceId("FA-PANEL-01")
 *     .protocol("MODBUS")
 *     .eventType("FIRE_ALARM")
 *     .severity("CRITICAL")
 *     .payload(Map.of("zone", "A1", "register", 40001, "value", 1))
 *     .timestamp(Instant.now())
 *     .zoneId("ZONE-A")
 *     .build();
 * </pre>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NormalizedEvent {

    /** Unique identifier of the source device */
    private String deviceId;

    /** Protocol used: MODBUS, MQTT, ONVIF */
    private String protocol;

    /** Type of event: FIRE_ALARM, GAS_LEAK, WIND_SPEED, HEARTBEAT, etc. */
    private String eventType;

    /** Severity level: INFO, WARNING, CRITICAL, EMERGENCY */
    private String severity;

    /** Protocol-specific payload data (register values, sensor readings, etc.) */
    private Map<String, Object> payload;

    /** Raw data string from the device (for audit/debugging) */
    private String rawData;

    /** Timestamp when the event occurred at the device */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;

    /** Zone identifier where the device is located */
    private String zoneId;

    /** Source IP address of the device */
    private String sourceAddress;
}
