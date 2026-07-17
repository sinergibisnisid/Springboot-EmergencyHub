package id.co.sinergi.emergencyhub.integration.entity;

import id.co.sinergi.emergencyhub.common.enums.DeviceProtocol;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Master data konfigurasi device/panel/sensor.
 *
 * <p>Field {@code config} menggunakan JSONB untuk menyimpan
 * konfigurasi spesifik per-protokol (register map untuk Modbus,
 * topic untuk MQTT, dll).
 */
@Entity
@Table(name = "devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeviceProtocol protocol;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    private Integer port;

    @Column(name = "unit_id")
    private Integer unitId;

    @Column(name = "zone_id")
    private UUID zoneId;

    /**
     * Protocol-specific configuration stored as JSONB.
     *
     * <p>Modbus example:
     * <pre>
     * {
     *   "registerStart": 40001,
     *   "registerCount": 10,
     *   "pollingIntervalMs": 1000,
     *   "registerMap": {
     *     "40001": "ZONE_1_FIRE",
     *     "40002": "ZONE_2_FIRE"
     *   }
     * }
     * </pre>
     *
     * <p>MQTT example:
     * <pre>
     * {
     *   "topic": "devices/gas-sensor-01/data",
     *   "qos": 1
     * }
     * </pre>
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> config;

    @Column(length = 20)
    @Builder.Default
    private String status = "OFFLINE";

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt;
}
