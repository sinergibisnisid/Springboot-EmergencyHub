package id.co.sinergi.emergencyhub.alarm.entity;

import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
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
 * Rule untuk evaluasi alarm.
 *
 * <p>Contoh rule:
 * <pre>
 * {
 *   "name": "Fire + High Wind",
 *   "description": "Eskalasi ke EMERGENCY jika fire alarm aktif dan wind > 30 km/h",
 *   "condition": {
 *     "operator": "AND",
 *     "rules": [
 *       { "eventType": "FIRE_ALARM", "field": "value", "operator": "GT", "threshold": 0 },
 *       { "eventType": "WIND_SPEED", "field": "speed", "operator": "GT", "threshold": 30 }
 *     ]
 *   },
 *   "resultSeverity": "EMERGENCY"
 * }
 * </pre>
 */
@Entity
@Table(name = "alarm_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * JSON condition definition.
     * Evaluated by RuleEngine against incoming NormalizedEvents.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "condition_json", columnDefinition = "jsonb")
    private Map<String, Object> conditionJson;

    /** Severity to assign if this rule matches */
    @Enumerated(EnumType.STRING)
    @Column(name = "result_severity", nullable = false, length = 20)
    private AlarmSeverity resultSeverity;

    /** Whether this rule is currently active */
    @Builder.Default
    private boolean enabled = true;

    /** Priority — lower number = higher priority */
    @Builder.Default
    private int priority = 100;

    /** Zone filter — null means applies to all zones */
    @Column(name = "zone_id")
    private UUID zoneId;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
