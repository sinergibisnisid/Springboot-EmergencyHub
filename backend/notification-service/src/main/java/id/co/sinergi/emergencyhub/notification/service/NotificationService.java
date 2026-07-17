package id.co.sinergi.emergencyhub.notification.service;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
import id.co.sinergi.emergencyhub.notification.dispatcher.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service yang mendengarkan alarm events dan mendispatch notifikasi
 * ke semua channel yang aktif.
 *
 * <p>Dispatch dilakukan secara async agar tidak blocking alarm pipeline.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final List<NotificationDispatcher> dispatchers;

    /**
     * Handle alarm event — kirim notifikasi ke semua enabled channels.
     * Hanya kirim untuk alarm ACTIVE (bukan acknowledge/resolve events).
     */
    @Async
    @EventListener
    public void onAlarmCreated(Alarm alarm) {
        // Only notify on new active alarms with severity >= WARNING
        if (alarm.getStatus() != id.co.sinergi.emergencyhub.common.enums.AlarmStatus.ACTIVE) {
            return;
        }
        if (alarm.getSeverity() == AlarmSeverity.INFO) {
            return;
        }

        log.info("Dispatching notifications for alarm [{}] severity={}",
                alarm.getId(), alarm.getSeverity());

        for (NotificationDispatcher dispatcher : dispatchers) {
            if (dispatcher.isEnabled()) {
                try {
                    dispatcher.dispatch(alarm);
                } catch (Exception e) {
                    log.error("Failed to dispatch via [{}] for alarm [{}]: {}",
                            dispatcher.getChannelName(), alarm.getId(), e.getMessage(), e);
                }
            }
        }
    }
}
