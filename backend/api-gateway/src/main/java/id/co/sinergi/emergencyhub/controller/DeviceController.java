package id.co.sinergi.emergencyhub.controller;

import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;
import id.co.sinergi.emergencyhub.integration.repository.DeviceConfigRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/devices")
@Tag(name = "Devices", description = "Device configuration management")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceConfigRepository deviceConfigRepository;

    @GetMapping
    @Operation(summary = "List all devices")
    public ResponseEntity<List<DeviceConfig>> listDevices() {
        return ResponseEntity.ok(deviceConfigRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get device by ID")
    public ResponseEntity<DeviceConfig> getDevice(@PathVariable UUID id) {
        return deviceConfigRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new device", description = "Register a new device/panel/sensor")
    public ResponseEntity<DeviceConfig> createDevice(@RequestBody DeviceConfig device) {
        device.setCreatedAt(Instant.now());
        DeviceConfig saved = deviceConfigRepository.save(device);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update device configuration")
    public ResponseEntity<DeviceConfig> updateDevice(@PathVariable UUID id, @RequestBody DeviceConfig device) {
        return deviceConfigRepository.findById(id)
                .map(existing -> {
                    existing.setName(device.getName());
                    existing.setProtocol(device.getProtocol());
                    existing.setIpAddress(device.getIpAddress());
                    existing.setPort(device.getPort());
                    existing.setUnitId(device.getUnitId());
                    existing.setZoneId(device.getZoneId());
                    existing.setConfig(device.getConfig());
                    existing.setUpdatedAt(Instant.now());
                    return ResponseEntity.ok(deviceConfigRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete device")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        if (deviceConfigRepository.existsById(id)) {
            deviceConfigRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
