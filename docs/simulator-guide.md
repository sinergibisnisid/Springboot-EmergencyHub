# Simulator Guide
## Cara Menjalankan Simulator untuk Development

---

## Overview

Simulator menyediakan device virtual yang bisa digunakan untuk development dan testing tanpa hardware fisik. Ada 2 simulator:

1. **Modbus TCP Simulator** — mensimulasikan panel fire alarm (server/slave)
2. **MQTT Publisher Simulator** — mensimulasikan IoT gateway yang kirim data sensor

---

## Prerequisites

- Java 21+
- Maven 3.9+
- Mosquitto MQTT broker (hanya jika pakai MQTT simulator)

### Install Mosquitto (Windows)

```powershell
# Download dari https://mosquitto.org/download/
# Atau via Chocolatey:
choco install mosquitto

# Start service
net start mosquitto
```

---

## Quick Start

### Run Semua Simulator
```bash
cd backend
mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=all"
```

### Run Modbus Saja
```bash
cd backend
mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=modbus"
```

### Run MQTT Saja
```bash
cd backend
mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=mqtt"
```

---

## Modbus TCP Simulator

### Konfigurasi Default

| Parameter | Default | Keterangan |
|-----------|---------|------------|
| Port | 5020 | Port TCP Modbus slave |
| Unit ID | 1 | Slave address |
| Mode | Dynamic | Random fault injection |
| Fault Interval | 10 detik | Interval injeksi fault |

### Register Map

| Register | Description | Values |
|----------|-------------|--------|
| 0 | Zone 1 Fire Alarm | 0=Normal, 1=Fire |
| 1 | Zone 2 Fire Alarm | 0=Normal, 1=Fire |
| 2 | Zone 3 Fire Alarm | 0=Normal, 1=Fire |
| 3 | Zone 4 Fire Alarm | 0=Normal, 1=Fire |
| 4 | Smoke Detector | 0=Normal, 1=Smoke |
| 5 | Heat/Temperature | °C (20-60) |
| 6 | Manual Call Point | 0=Normal, 1=Active |
| 7 | Sprinkler Flow | 0=Normal, 1=Flow |
| 8 | Panel Status | 0=Normal, 1=Fault |
| 9 | Power Status | 0=Mains, 1=Battery |

### Cara Connect dari Integration Service

Tambahkan device config di database:
```json
{
  "name": "SIM-PANEL-01",
  "protocol": "MODBUS",
  "ipAddress": "127.0.0.1",
  "port": 5020,
  "unitId": 1,
  "config": {
    "registerStart": 0,
    "registerCount": 10,
    "pollingIntervalMs": 2000,
    "registerMap": {
      "0": "ZONE_1_FIRE",
      "1": "ZONE_2_FIRE",
      "2": "ZONE_3_FIRE",
      "3": "ZONE_4_FIRE",
      "4": "SMOKE",
      "5": "TEMPERATURE",
      "6": "MANUAL_CALL",
      "7": "SPRINKLER",
      "8": "PANEL_STATUS",
      "9": "POWER_STATUS"
    }
  }
}
```

### Test Manual (dengan modpoll atau tool Modbus lain)
```bash
# Read 10 holding registers dari simulator
modpoll -m tcp -a 1 -r 1 -c 10 127.0.0.1:5020
```

---

## MQTT Publisher Simulator

### Konfigurasi Default

| Parameter | Default | Keterangan |
|-----------|---------|------------|
| Broker URL | tcp://localhost:1883 | Mosquitto lokal |
| Interval | 5 detik | Publish rate |

### Virtual Devices

| Device ID | Topic | Data | Zone |
|-----------|-------|------|------|
| gas-sensor-01 | devices/gas-sensor-01/data | Gas concentration (ppm) | ZONE-B |
| gas-sensor-02 | devices/gas-sensor-02/data | Gas concentration (ppm) | ZONE-C |
| wind-sensor-01 | devices/wind-sensor-01/data | Wind speed (km/h) & direction | ZONE-E |
| temp-sensor-01 | devices/temp-sensor-01/data | Temperature (°C) & humidity (%) | ZONE-A |

### Monitor MQTT Messages
```bash
# Subscribe ke semua device topics
mosquitto_sub -h localhost -t "devices/+/data" -v
```

---

## Custom Konfigurasi

Edit `simulator/src/main/resources/application.yml`:

```yaml
simulator:
  modbus:
    port: 5020          # Ubah port jika bentrok
    unit-id: 1
    dynamic: true       # false = static values
    fault-interval-seconds: 10

  mqtt:
    enabled: true       # false = skip MQTT
    broker-url: tcp://localhost:1883
    publish-interval-seconds: 5
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5020 already in use | Ganti port di application.yml |
| MQTT connection refused | Pastikan Mosquitto running: `net start mosquitto` |
| Java not found | Install JDK 21 & tambahkan ke PATH |
| Build error | Run `mvn clean install` dari root `backend/` dulu |
