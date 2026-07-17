package id.co.sinergi.emergencyhub.alarm.repository;

import id.co.sinergi.emergencyhub.alarm.entity.AlarmRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlarmRuleRepository extends JpaRepository<AlarmRule, UUID> {

    List<AlarmRule> findByEnabledTrueOrderByPriorityAsc();

    List<AlarmRule> findByZoneIdAndEnabledTrue(UUID zoneId);
}
