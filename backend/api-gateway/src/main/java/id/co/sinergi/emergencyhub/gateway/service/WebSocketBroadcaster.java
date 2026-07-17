package id.co.sinergi.emergencyhub.gateway.service;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * WebSocket broadcaster — pushes real-time updates to connected frontend clients.
 *
 * <p>Listens for Spring ApplicationEvents (NormalizedEvent, Alarm) and
 * broadcasts them to STOMP topics.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast new/updated alarm to frontend.
     */
    @EventListener
    public void onAlarm(Alarm alarm) {
        log.debug("Broadcasting alarm [{}] to /topic/alarms", alarm.getId());
        messagingTemplate.convertAndSend("/topic/alarms", alarm);
    }

    /**
     * Broadcast raw device events to frontend (for live event log).
     */
    @EventListener
    public void onEvent(NormalizedEvent event) {
        messagingTemplate.convertAndSend("/topic/events", event);
    }
}
