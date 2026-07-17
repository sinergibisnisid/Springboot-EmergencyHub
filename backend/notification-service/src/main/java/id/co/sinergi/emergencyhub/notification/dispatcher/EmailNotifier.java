package id.co.sinergi.emergencyhub.notification.dispatcher;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.common.enums.NotificationType;
import id.co.sinergi.emergencyhub.notification.entity.NotificationLog;
import id.co.sinergi.emergencyhub.notification.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Dispatch notifikasi via Email (SMTP).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EmailNotifier implements NotificationDispatcher {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository logRepository;

    @Value("${emergencyhub.notification.email.enabled:false}")
    private boolean enabled;

    @Value("${emergencyhub.notification.email.from:noreply@emergencyhub.local}")
    private String fromAddress;

    @Value("${emergencyhub.notification.email.to:operator@emergencyhub.local}")
    private String defaultRecipient;

    @Override
    public String getChannelName() {
        return "EMAIL";
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public void dispatch(Alarm alarm) {
        if (!enabled) {
            log.debug("Email notification disabled, skipping alarm [{}]", alarm.getId());
            return;
        }

        String subject = String.format("🚨 [%s] Alarm: %s", alarm.getSeverity(), alarm.getTitle());
        String body = buildEmailBody(alarm);

        NotificationLog notifLog = NotificationLog.builder()
                .alarmId(alarm.getId())
                .channel(NotificationType.EMAIL)
                .recipient(defaultRecipient)
                .message(body)
                .status("PENDING")
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(defaultRecipient);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            notifLog.setStatus("SENT");
            notifLog.setSentAt(Instant.now());
            log.info("Email sent to [{}] for alarm [{}]", defaultRecipient, alarm.getId());
        } catch (Exception e) {
            notifLog.setStatus("FAILED");
            notifLog.setErrorMessage(e.getMessage());
            log.error("Failed to send email for alarm [{}]: {}", alarm.getId(), e.getMessage());
        }

        logRepository.save(notifLog);
    }

    private String buildEmailBody(Alarm alarm) {
        return """
                ═══════════════════════════════════
                  EMERGENCY HUB — ALARM NOTIFICATION
                ═══════════════════════════════════
                
                Severity : %s
                Status   : %s
                Title    : %s
                
                Description:
                %s
                
                Time     : %s
                Alarm ID : %s
                
                ───────────────────────────────────
                This is an automated notification from
                Emergency Hub Platform — PT Pupuk Kujang
                """.formatted(
                alarm.getSeverity(),
                alarm.getStatus(),
                alarm.getTitle(),
                alarm.getDescription() != null ? alarm.getDescription() : "(no description)",
                alarm.getCreatedAt(),
                alarm.getId()
        );
    }
}
