package id.co.sinergi.emergencyhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main entry point untuk Emergency Hub Platform.
 *
 * <p>Scan packages: {@code id.co.sinergi.emergencyhub.*}
 * sehingga semua bean dari modul internal (common, integration-service,
 * alarm-engine, notification-service) otomatis ter-detect.
 */
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class EmergencyHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmergencyHubApplication.class, args);
    }
}
