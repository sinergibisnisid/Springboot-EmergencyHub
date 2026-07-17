# API Contract
## Emergency Hub Platform

**Base URL:** `http://localhost:8080`  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`  
**Auth:** Basic Auth (operator/operator123, admin/admin123)

---

## REST Endpoints

### Alarms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/alarms` | List all alarms (optional `?status=ACTIVE`) |
| GET | `/api/v1/alarms/{id}` | Get alarm by ID |
| GET | `/api/v1/alarms/active/count` | Count active alarms |
| POST | `/api/v1/alarms/{id}/acknowledge?userId={uuid}` | Acknowledge alarm |
| POST | `/api/v1/alarms/{id}/resolve` | Resolve alarm |

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/devices` | List all devices |
| GET | `/api/v1/devices/{id}` | Get device by ID |
| POST | `/api/v1/devices` | Create new device |
| PUT | `/api/v1/devices/{id}` | Update device |
| DELETE | `/api/v1/devices/{id}` | Delete device |

### Zones

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/zones` | List all zones |
| GET | `/api/v1/zones/{id}` | Get zone by ID |
| POST | `/api/v1/zones` | Create zone |
| PUT | `/api/v1/zones/{id}` | Update zone |
| DELETE | `/api/v1/zones/{id}` | Delete zone |

---

## WebSocket (STOMP)

### Connection

```
Endpoint: ws://localhost:8080/ws-alarms
Protocol: STOMP over WebSocket (SockJS fallback)
```

### Topics (Subscribe)

| Topic | Description | Payload |
|-------|-------------|---------|
| `/topic/alarms` | Real-time alarm updates (new, ack, resolve) | Alarm JSON |
| `/topic/events` | Raw device events | NormalizedEvent JSON |
| `/topic/device-status` | Device online/offline changes | DeviceStatus JSON |

### Alarm JSON Format

```json
{
  "id": "uuid",
  "severity": "CRITICAL",
  "status": "ACTIVE",
  "title": "[CRITICAL] FIRE_ALARM — Device: FA-PANEL-01",
  "description": "Event type: FIRE_ALARM\nProtocol: MODBUS\nZone: ZONE-A",
  "deviceId": "uuid",
  "zoneId": "uuid",
  "acknowledgedBy": null,
  "acknowledgedAt": null,
  "resolvedAt": null,
  "createdAt": "2026-07-17T10:30:00Z"
}
```

### NormalizedEvent JSON Format

```json
{
  "deviceId": "FA-PANEL-01",
  "protocol": "MODBUS",
  "eventType": "FIRE_ALARM",
  "severity": "CRITICAL",
  "payload": {
    "zone": "A1",
    "register": 40001,
    "value": 1
  },
  "rawData": "[1, 0, 0, 0, 0, 25, 0, 0, 0, 0]",
  "timestamp": "2026-07-17T10:30:00.000Z",
  "zoneId": "ZONE-A",
  "sourceAddress": "192.168.1.10:502"
}
```

---

## Error Response Format

```json
{
  "timestamp": "2026-07-17T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Alarm not found: {id}",
  "path": "/api/v1/alarms/{id}"
}
```

---

*Detail API lengkap tersedia di Swagger UI setelah aplikasi running.*
