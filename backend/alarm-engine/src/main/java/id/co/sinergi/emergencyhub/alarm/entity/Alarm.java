package id.co.sinergi.emergencyhub.alarm.entity;

import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
import id.co.sinergi.emergencyhub.common.enums.AlarmStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Entitas alarm yang dihasilkan oleh alarm engine.
 *
 * <p>Setiap alarm memiliki lifecycle:
 * ACTIVE → ACKNOWLEDGED → RESOLVED/CLOSED
 */
@Entity
@Table(name = "alarms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "zone_id")
    private UUID zoneId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlarmSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AlarmStatus status = AlarmStatus.ACTIVE;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** ID device yang mentrigger alarm */
    @Column(name = "device_id")
    private UUID deviceId;

    /** User yang acknowledge alarm */
    @Column(name = "acknowledged_by")
    private UUID acknowledgedBy;

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
