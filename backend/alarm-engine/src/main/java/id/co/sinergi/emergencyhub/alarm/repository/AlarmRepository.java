package id.co.sinergi.emergencyhub.alarm.repository;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
import id.co.sinergi.emergencyhub.common.enums.AlarmStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, UUID> {

    List<Alarm> findByStatus(AlarmStatus status);

    List<Alarm> findByStatusIn(List<AlarmStatus> statuses);

    List<Alarm> findBySeverity(AlarmSeverity severity);

    List<Alarm> findByZoneId(UUID zoneId);

    List<Alarm> findByDeviceId(UUID deviceId);

    List<Alarm> findByCreatedAtBetween(Instant start, Instant end);

    List<Alarm> findByStatusAndSeverity(AlarmStatus status, AlarmSeverity severity);

    long countByStatus(AlarmStatus status);
}
