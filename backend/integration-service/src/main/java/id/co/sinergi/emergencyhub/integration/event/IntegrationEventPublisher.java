package id.co.sinergi.emergencyhub.integration.event;

import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Publisher event dari integration layer ke alarm engine.
 *
 * <p>Menggunakan Spring {@link ApplicationEventPublisher} sehingga
 * alarm-engine bisa subscribe via {@code @EventListener} tanpa
 * coupling langsung antar modul.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IntegrationEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    /**
     * Publish NormalizedEvent sebagai Spring ApplicationEvent.
     * Alarm Engine dan modul lain bisa listen ke event ini.
     *
     * @param event normalized event dari protocol adapter
     */
    public void publish(NormalizedEvent event) {
        log.debug("Publishing event: device={}, type={}, severity={}",
                event.getDeviceId(), event.getEventType(), event.getSeverity());
        applicationEventPublisher.publishEvent(event);
    }
}
