package id.co.sinergi.emergencyhub.notification.repository;

import id.co.sinergi.emergencyhub.common.enums.NotificationType;
import id.co.sinergi.emergencyhub.notification.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {

    List<NotificationLog> findByAlarmId(UUID alarmId);

    List<NotificationLog> findByChannel(NotificationType channel);

    List<NotificationLog> findByStatus(String status);
}
