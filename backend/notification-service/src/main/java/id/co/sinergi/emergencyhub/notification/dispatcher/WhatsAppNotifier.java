package id.co.sinergi.emergencyhub.notification.dispatcher;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.common.enums.NotificationType;
import id.co.sinergi.emergencyhub.notification.entity.NotificationLog;
import id.co.sinergi.emergencyhub.notification.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Stub dispatcher untuk WhatsApp.
 *
 * <p>TODO: Integrasi dengan WA API (Twilio/Fonnte/dll) akan dilakukan
 * setelah vendor API ditentukan oleh PM/klien.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WhatsAppNotifier implements NotificationDispatcher {

    private final NotificationLogRepository logRepository;

    @Value("${emergencyhub.notification.whatsapp.enabled:false}")
    private boolean enabled;

    @Override
    public String getChannelName() {
        return "WHATSAPP";
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public void dispatch(Alarm alarm) {
        if (!enabled) {
            log.debug("WhatsApp notification disabled, skipping alarm [{}]", alarm.getId());
            return;
        }

        // TODO: Implement actual WA API call here
        log.warn("WhatsApp notification is a STUB — alarm [{}] not actually sent", alarm.getId());

        NotificationLog notifLog = NotificationLog.builder()
                .alarmId(alarm.getId())
                .channel(NotificationType.WHATSAPP)
                .recipient("stub-recipient")
                .message("STUB: " + alarm.getTitle())
                .status("STUB")
                .build();

        logRepository.save(notifLog);
    }
}
