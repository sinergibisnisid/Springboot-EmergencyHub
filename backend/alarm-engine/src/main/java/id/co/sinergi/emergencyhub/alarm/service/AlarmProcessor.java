package id.co.sinergi.emergencyhub.alarm.service;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.alarm.repository.AlarmRepository;
import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
import id.co.sinergi.emergencyhub.common.enums.AlarmStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Processor utama alarm.
 *
 * <p>Menerima {@link NormalizedEvent} dari integration layer (via Spring ApplicationEvent),
 * mengevaluasi terhadap rule engine, dan membuat alarm jika rule match.
 *
 * <p>Alarm yang dibuat di-publish kembali sebagai event agar:
 * <ul>
 *   <li>Notification service bisa kirim notifikasi</li>
 *   <li>API gateway bisa push ke frontend via WebSocket</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmProcessor {

    private final RuleEngine ruleEngine;
    private final AlarmRepository alarmRepository;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Handler untuk NormalizedEvent dari integration layer.
     * Evaluasi rule → buat alarm jika match → publish alarm event.
     */
    @EventListener
    @Transactional
    public void processEvent(NormalizedEvent event) {
        log.debug("Processing event: device={}, type={}", event.getDeviceId(), event.getEventType());

        // Skip heartbeat events (no alarm needed)
        if ("HEARTBEAT".equals(event.getEventType())) {
            return;
        }

        // Evaluate against rules
        Optional<AlarmSeverity> severity = ruleEngine.evaluate(event);

        if (severity.isEmpty()) {
            log.debug("No alarm rule matched for event type={}", event.getEventType());
            return;
        }

        // Only create alarm for WARNING and above
        if (severity.get() == AlarmSeverity.INFO) {
            return;
        }

        // Create alarm
        Alarm alarm = Alarm.builder()
                .severity(severity.get())
                .status(AlarmStatus.ACTIVE)
                .title(buildAlarmTitle(event))
                .description(buildAlarmDescription(event))
                .deviceId(parseUuid(event.getDeviceId()))
                .zoneId(parseUuid(event.getZoneId()))
                .createdAt(Instant.now())
                .build();

        alarm = alarmRepository.save(alarm);
        log.info("🚨 Alarm created: id={}, severity={}, title={}",
                alarm.getId(), alarm.getSeverity(), alarm.getTitle());

        // Publish alarm event for notification service & WebSocket
        eventPublisher.publishEvent(alarm);
    }

    /**
     * Acknowledge alarm oleh operator.
     */
    @Transactional
    public Alarm acknowledge(UUID alarmId, UUID userId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new IllegalArgumentException("Alarm not found: " + alarmId));

        alarm.setStatus(AlarmStatus.ACKNOWLEDGED);
        alarm.setAcknowledgedBy(userId);
        alarm.setAcknowledgedAt(Instant.now());

        alarm = alarmRepository.save(alarm);
        log.info("Alarm [{}] acknowledged by user [{}]", alarmId, userId);

        eventPublisher.publishEvent(alarm);
        return alarm;
    }

    /**
     * Resolve alarm (kondisi kembali normal).
     */
    @Transactional
    public Alarm resolve(UUID alarmId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new IllegalArgumentException("Alarm not found: " + alarmId));

        alarm.setStatus(AlarmStatus.RESOLVED);
        alarm.setResolvedAt(Instant.now());

        alarm = alarmRepository.save(alarm);
        log.info("Alarm [{}] resolved", alarmId);

        eventPublisher.publishEvent(alarm);
        return alarm;
    }

    private String buildAlarmTitle(NormalizedEvent event) {
        return String.format("[%s] %s — Device: %s",
                event.getSeverity(), event.getEventType(), event.getDeviceId());
    }

    private String buildAlarmDescription(NormalizedEvent event) {
        return String.format("Event type: %s\nProtocol: %s\nZone: %s\nPayload: %s",
                event.getEventType(), event.getProtocol(),
                event.getZoneId(), event.getPayload());
    }

    private UUID parseUuid(String value) {
        if (value == null) return null;
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
