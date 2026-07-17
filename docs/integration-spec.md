# Integration Specification Document
## Untuk Tim Hardware & Vendor

**Version:** 0.1.0  
**Date:** 2026-07-17  
**Purpose:** Spesifikasi teknis yang dibutuhkan software dari hardware/vendor

---

## 1. Template Register Map (Modbus TCP)

Setiap device Modbus TCP harus menyediakan register map berikut:

| Field | Keterangan | Contoh |
|-------|-----------|--------|
| Device Name | Nama/model panel | Notifier NFS-320 |
| Manufacturer | Vendor/pabrikan | Honeywell |
| Protocol | Protokol komunikasi | Modbus TCP |
| IP Address | IP address device | 192.168.1.10 |
| Port | TCP port | 502 |
| Unit ID | Modbus slave ID | 1 |
| Register Type | Holding/Input/Coil | Holding Register |
| Register Start | Alamat awal | 40001 |
| Register Count | Jumlah register | 10 |

### Detail Register Map

| Register Address | Data Type | Size | Description | Values | Unit |
|-----------------|-----------|------|-------------|--------|------|
| 40001 | UINT16 | 1 | Zone 1 Fire Alarm | 0=Normal, 1=Alarm | - |
| 40002 | UINT16 | 1 | Zone 2 Fire Alarm | 0=Normal, 1=Alarm | - |
| 40003 | UINT16 | 1 | Smoke Detector | 0=Normal, 1=Detected | - |
| 40004 | UINT16 | 1 | Temperature | 0-100 | °C |
| 40005 | UINT16 | 1 | Panel Status | 0=OK, 1=Fault | - |

> **PENTING:** Register map ini adalah template. Tim hardware wajib mengisi register map aktual per-device dari hasil survey lapangan.

---

## 2. Spesifikasi Format Payload MQTT

### 2.1 Topic Naming Convention

```
devices/{device-id}/data
```

Contoh:
- `devices/gas-sensor-01/data`
- `devices/wind-sensor-01/data`
- `devices/temp-sensor-01/data`

### 2.2 JSON Schema Payload

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Device Data Payload",
  "type": "object",
  "required": ["deviceId", "eventType", "timestamp"],
  "properties": {
    "deviceId": {
      "type": "string",
      "description": "Unique identifier device (sama dengan topic)"
    },
    "eventType": {
      "type": "string",
      "description": "Jenis event",
      "enum": [
        "FIRE_ALARM", "SMOKE_DETECTED", "HEAT_DETECTED",
        "GAS_LEAK", "GAS_LEVEL_HIGH",
        "WIND_SPEED", "TEMPERATURE",
        "DEVICE_ONLINE", "DEVICE_OFFLINE", "HEARTBEAT"
      ]
    },
    "severity": {
      "type": "string",
      "enum": ["INFO", "WARNING", "CRITICAL", "EMERGENCY"],
      "default": "INFO"
    },
    "zoneId": {
      "type": "string",
      "description": "Zone ID tempat device berada"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    }
  },
  "additionalProperties": true
}
```

### 2.3 Contoh Payload

**Gas Sensor:**
```json
{
  "deviceId": "gas-sensor-01",
  "eventType": "GAS_LEVEL_HIGH",
  "severity": "WARNING",
  "zoneId": "ZONE-B",
  "timestamp": "2026-07-17T10:30:00Z",
  "concentration": 35.5,
  "unit": "ppm",
  "gasType": "H2S"
}
```

**Wind Sensor:**
```json
{
  "deviceId": "wind-sensor-01",
  "eventType": "WIND_SPEED",
  "severity": "WARNING",
  "zoneId": "ZONE-E",
  "timestamp": "2026-07-17T10:30:00Z",
  "speed": 32.5,
  "direction": "NW",
  "unit": "km/h"
}
```

### 2.4 MQTT Broker Config

| Parameter | Value |
|-----------|-------|
| Broker | Mosquitto (Eclipse) |
| Port | 1883 (unencrypted) / 8883 (TLS) |
| Protocol | MQTT v3.1.1 |
| QoS | 1 (At least once) |
| Retain | false |

---

## 3. Checklist Survey Vendor/Lapangan

### Wajib Diisi Per-Device:

- [ ] Nama & model device
- [ ] Manufacturer / vendor
- [ ] Protokol komunikasi (Modbus TCP, Modbus RTU, MQTT, dry contact, dll)
- [ ] IP Address & Port (jika TCP/IP)
- [ ] Baud rate, parity, stop bits (jika Modbus RTU)
- [ ] Unit ID / Slave ID (Modbus)
- [ ] Register map lengkap (alamat, tipe data, meaning, unit)
- [ ] Kondisi kabel & konektivitas existing
- [ ] Apakah ada converter RS485-to-TCP yang perlu dipasang?
- [ ] Power supply: AC/DC, apakah ada UPS?
- [ ] Dokumentasi teknis / datasheet tersedia?
- [ ] Firmware version
- [ ] Apakah device support read-only atau juga write?

### Pertanyaan Tambahan:

1. Apakah semua 8 panel fire alarm sudah support Modbus TCP, atau ada yang masih RS485/dry contact?
2. Apakah sudah ada IoT gateway yang convert sensor data ke MQTT?
3. Apakah CCTV existing sudah support ONVIF Profile S/T?
4. Apakah ada firewall/VLAN yang memisahkan network OT dan IT?
5. Berapa expected polling rate maksimum yang aman untuk tiap device?
6. Apakah vendor menyediakan test certificate / commissioning tool?

---

## 4. Network Requirements

| Connection | Protocol | Port | Direction |
|-----------|----------|------|-----------|
| Panel → Server | Modbus TCP | 502 | Server polls Panel |
| IoT GW → MQTT Broker | MQTT | 1883/8883 | Gateway publishes |
| CCTV → Server | ONVIF/RTSP | 554/80 | Server connects |
| Server → Frontend | HTTP/WS | 8080 | Bidirectional |

---

*Dokumen ini harus diupdate setelah survey lapangan di Minggu 1.*
