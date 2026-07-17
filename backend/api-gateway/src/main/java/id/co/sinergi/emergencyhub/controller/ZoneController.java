package id.co.sinergi.emergencyhub.controller;

import id.co.sinergi.emergencyhub.gateway.entity.Zone;
import id.co.sinergi.emergencyhub.gateway.repository.ZoneRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/zones")
@Tag(name = "Zones", description = "Zone/area management")
@RequiredArgsConstructor
public class ZoneController {

    private final ZoneRepository zoneRepository;

    @GetMapping
    @Operation(summary = "List all zones")
    public ResponseEntity<List<Zone>> listZones() {
        return ResponseEntity.ok(zoneRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get zone by ID")
    public ResponseEntity<Zone> getZone(@PathVariable UUID id) {
        return zoneRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new zone")
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) {
        Zone saved = zoneRepository.save(zone);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update zone")
    public ResponseEntity<Zone> updateZone(@PathVariable UUID id, @RequestBody Zone zone) {
        return zoneRepository.findById(id)
                .map(existing -> {
                    existing.setName(zone.getName());
                    existing.setDescription(zone.getDescription());
                    existing.setLocation(zone.getLocation());
                    return ResponseEntity.ok(zoneRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete zone")
    public ResponseEntity<Void> deleteZone(@PathVariable UUID id) {
        if (zoneRepository.existsById(id)) {
            zoneRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
