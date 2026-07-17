package id.co.sinergi.emergencyhub.controller;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;
import id.co.sinergi.emergencyhub.alarm.repository.AlarmRepository;
import id.co.sinergi.emergencyhub.alarm.service.AlarmProcessor;
import id.co.sinergi.emergencyhub.common.enums.AlarmStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alarms")
@Tag(name = "Alarms", description = "Alarm management — view, acknowledge, resolve")
@RequiredArgsConstructor
public class AlarmController {

    private final AlarmRepository alarmRepository;
    private final AlarmProcessor alarmProcessor;

    @GetMapping
    @Operation(summary = "List all alarms", description = "Returns all alarms, optionally filtered by status")
    public ResponseEntity<List<Alarm>> listAlarms(
            @RequestParam(required = false) AlarmStatus status) {
        List<Alarm> alarms = (status != null)
                ? alarmRepository.findByStatus(status)
                : alarmRepository.findAll();
        return ResponseEntity.ok(alarms);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alarm by ID")
    public ResponseEntity<Alarm> getAlarm(@PathVariable UUID id) {
        return alarmRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active/count")
    @Operation(summary = "Count active alarms")
    public ResponseEntity<Long> countActive() {
        return ResponseEntity.ok(alarmRepository.countByStatus(AlarmStatus.ACTIVE));
    }

    @PostMapping("/{id}/acknowledge")
    @Operation(summary = "Acknowledge alarm", description = "Operator acknowledges an active alarm")
    public ResponseEntity<Alarm> acknowledge(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        Alarm alarm = alarmProcessor.acknowledge(id, userId);
        return ResponseEntity.ok(alarm);
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Resolve alarm", description = "Mark alarm as resolved")
    public ResponseEntity<Alarm> resolve(@PathVariable UUID id) {
        Alarm alarm = alarmProcessor.resolve(id);
        return ResponseEntity.ok(alarm);
    }
}
