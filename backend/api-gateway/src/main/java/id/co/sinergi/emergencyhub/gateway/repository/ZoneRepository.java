package id.co.sinergi.emergencyhub.gateway.repository;

import id.co.sinergi.emergencyhub.gateway.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, UUID> {
}
