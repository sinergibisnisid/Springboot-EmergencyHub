package id.co.sinergi.emergencyhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Konfigurasi WebSocket STOMP untuk real-time alarm push ke frontend.
 *
 * <p>Topics yang tersedia:
 * <ul>
 *   <li>{@code /topic/alarms} — alarm baru, acknowledge, resolve</li>
 *   <li>{@code /topic/events} — raw events dari device</li>
 *   <li>{@code /topic/device-status} — perubahan status device (online/offline)</li>
 * </ul>
 *
 * <p>Frontend connect ke: {@code ws://host:port/ws-alarms}
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefix untuk messages dari server ke client (subscribe)
        config.enableSimpleBroker("/topic");
        // Prefix untuk messages dari client ke server (send)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-alarms")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
