package id.co.sinergi.emergencyhub.integration.repository;

import id.co.sinergi.emergencyhub.common.enums.DeviceProtocol;
import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceConfigRepository extends JpaRepository<DeviceConfig, UUID> {

    List<DeviceConfig> findByProtocol(DeviceProtocol protocol);

    List<DeviceConfig> findByStatus(String status);

    List<DeviceConfig> findByZoneId(UUID zoneId);

    List<DeviceConfig> findByProtocolAndStatus(DeviceProtocol protocol, String status);
}
