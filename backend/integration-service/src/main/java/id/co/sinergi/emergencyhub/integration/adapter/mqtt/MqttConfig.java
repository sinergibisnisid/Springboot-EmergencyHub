package id.co.sinergi.emergencyhub.integration.adapter.mqtt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

/**
 * Konfigurasi Spring Integration MQTT.
 *
 * <p>Setup koneksi ke MQTT broker (Mosquitto), subscribe ke topic pattern,
 * dan route pesan ke {@link MqttConnector#handleMessage}.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class MqttConfig {

    private final MqttConnector mqttConnector;

    @Value("${emergencyhub.mqtt.broker-url:tcp://localhost:1883}")
    private String brokerUrl;

    @Value("${emergencyhub.mqtt.client-id:emergency-hub-integration}")
    private String clientId;

    @Value("${emergencyhub.mqtt.topic:devices/+/data}")
    private String defaultTopic;

    @Value("${emergencyhub.mqtt.qos:1}")
    private int qos;

    @Value("${emergencyhub.mqtt.enabled:false}")
    private boolean mqttEnabled;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);
        options.setKeepAliveInterval(30);
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoMessageDrivenChannelAdapter mqttInboundAdapter() {
        if (!mqttEnabled) {
            log.info("MQTT is disabled. Skipping MQTT adapter setup.");
            // Return a minimal adapter that won't try to connect
            MqttPahoMessageDrivenChannelAdapter adapter =
                    new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(), defaultTopic);
            adapter.setAutoStartup(false);
            adapter.setOutputChannel(mqttInputChannel());
            return adapter;
        }

        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(), defaultTopic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(qos);
        adapter.setOutputChannel(mqttInputChannel());
        log.info("MQTT adapter configured: broker={}, topic={}", brokerUrl, defaultTopic);
        return adapter;
    }

    @Bean
    public MessageHandler mqttMessageHandler() {
        return (Message<?> message) -> {
            String topic = (String) message.getHeaders().get("mqtt_receivedTopic");
            String payload = message.getPayload().toString();
            mqttConnector.handleMessage(topic, payload);
        };
    }
}
