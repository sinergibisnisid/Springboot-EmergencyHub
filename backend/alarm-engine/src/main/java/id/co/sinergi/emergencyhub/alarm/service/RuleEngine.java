package id.co.sinergi.emergencyhub.alarm.service;

import id.co.sinergi.emergencyhub.alarm.entity.AlarmRule;
import id.co.sinergi.emergencyhub.alarm.repository.AlarmRuleRepository;
import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.common.enums.AlarmSeverity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Rule engine untuk evaluasi alarm.
 *
 * <p>Fase 1: Rule-based sederhana — evaluasi kondisi dari JSON rule definition.
 * Fase 2: Bisa di-extend ke ML-based decision engine.
 *
 * <p>Rules dievaluasi berdasarkan priority (ascending).
 * Rule pertama yang match menentukan severity alarm.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RuleEngine {

    private final AlarmRuleRepository ruleRepository;

    /**
     * Evaluasi event terhadap semua active rules.
     *
     * @param event normalized event dari integration layer
     * @return severity dari rule yang match, atau empty jika tidak ada match
     */
    public Optional<AlarmSeverity> evaluate(NormalizedEvent event) {
        List<AlarmRule> rules = ruleRepository.findByEnabledTrueOrderByPriorityAsc();

        for (AlarmRule rule : rules) {
            if (matchesRule(event, rule)) {
                log.info("Rule [{}] matched for event type={}, device={}",
                        rule.getName(), event.getEventType(), event.getDeviceId());
                return Optional.of(rule.getResultSeverity());
            }
        }

        // Default: derive severity from event severity string
        return deriveSeverityFromEvent(event);
    }

    /**
     * Evaluasi apakah event cocok dengan rule condition.
     *
     * <p>Format condition JSON:
     * <pre>
     * {
     *   "eventType": "FIRE_ALARM",
     *   "field": "value",
     *   "operator": "GT",
     *   "threshold": 0
     * }
     * </pre>
     */
    private boolean matchesRule(NormalizedEvent event, AlarmRule rule) {
        Map<String, Object> condition = rule.getConditionJson();
        if (condition == null || condition.isEmpty()) {
            return false;
        }

        // Check zone filter
        if (rule.getZoneId() != null && event.getZoneId() != null
                && !rule.getZoneId().toString().equals(event.getZoneId())) {
            return false;
        }

        // Check event type match
        String ruleEventType = (String) condition.get("eventType");
        if (ruleEventType != null && !ruleEventType.equals(event.getEventType())) {
            return false;
        }

        // Check field condition
        String field = (String) condition.get("field");
        String operator = (String) condition.get("operator");
        Object threshold = condition.get("threshold");

        if (field != null && operator != null && threshold != null && event.getPayload() != null) {
            Object actualValue = event.getPayload().get(field);
            if (actualValue == null) return false;
            return evaluateCondition(actualValue, operator, threshold);
        }

        // If no field condition specified, event type match is sufficient
        return ruleEventType != null;
    }

    private boolean evaluateCondition(Object actual, String operator, Object threshold) {
        try {
            double actualNum = toDouble(actual);
            double thresholdNum = toDouble(threshold);

            return switch (operator.toUpperCase()) {
                case "GT", ">" -> actualNum > thresholdNum;
                case "GTE", ">=" -> actualNum >= thresholdNum;
                case "LT", "<" -> actualNum < thresholdNum;
                case "LTE", "<=" -> actualNum <= thresholdNum;
                case "EQ", "==" -> actualNum == thresholdNum;
                case "NEQ", "!=" -> actualNum != thresholdNum;
                default -> {
                    log.warn("Unknown operator: {}", operator);
                    yield false;
                }
            };
        } catch (NumberFormatException e) {
            // Fall back to string comparison
            return "EQ".equalsIgnoreCase(operator) && actual.toString().equals(threshold.toString());
        }
    }

    private double toDouble(Object val) {
        if (val instanceof Number n) return n.doubleValue();
        return Double.parseDouble(val.toString());
    }

    private Optional<AlarmSeverity> deriveSeverityFromEvent(NormalizedEvent event) {
        if (event.getSeverity() == null) return Optional.empty();
        try {
            return Optional.of(AlarmSeverity.valueOf(event.getSeverity().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
