package id.co.sinergi.emergencyhub.gateway.repository;

import id.co.sinergi.emergencyhub.gateway.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByDeviceId(UUID deviceId);

    List<Event> findByEventType(String eventType);

    List<Event> findByTimestampBetween(Instant start, Instant end);

    List<Event> findTop100ByOrderByCreatedAtDesc();
}
