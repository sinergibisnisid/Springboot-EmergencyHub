# Software Design Document (SDD)
## Interkoneksi Sarana Proteksi Kedaruratan — PT Pupuk Kujang

**Version:** 0.1.0 (Draft)  
**Date:** 2026-07-17  
**Author:** Software Team — PT Sinergi Bisnis Indonesia

---

## 1. Overview

### 1.1 Tujuan
Membangun platform terpusat untuk mengintegrasikan semua sarana proteksi kedaruratan di PT Pupuk Kujang, termasuk panel fire alarm, sensor gas, sensor cuaca, dan CCTV, ke dalam satu command center.

### 1.2 Scope
- Integrasi 8+ panel fire alarm (multi-vendor, multi-protocol)
- Integrasi sensor gas, wind, dan temperature via IoT gateway
- Alarm engine untuk korelasi event dan pengambilan keputusan
- Multi-channel notification (Email, SMS, WhatsApp)
- Real-time dashboard untuk operator command center
- Simulasi device untuk development tanpa hardware fisik

### 1.3 Asumsi
- AI Decision Engine di fase 1 menggunakan **rule-based** approach. ML-based akan dievaluasi di fase berikutnya.
- CCTV integration (ONVIF) bersifat opsional di fase 1.
- Database menggunakan PostgreSQL; TimescaleDB akan dievaluasi jika volume time-series data besar.

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FIELD DEVICES                      │
├──────────┬──────────┬──────────┬───────────┬────────┤
│ Fire     │ Gas      │ Wind     │ Temp      │ CCTV   │
│ Alarm    │ Sensor   │ Sensor   │ Sensor    │ Camera │
│ Panel    │          │          │           │        │
└────┬─────┴────┬─────┴────┬─────┴─────┬─────┴───┬────┘
     │Modbus    │ MQTT     │ MQTT      │ MQTT    │ONVIF
     ▼          ▼          ▼           ▼         ▼
┌─────────────────────────────────────────────────────┐
│            INTEGRATION SERVICE                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Modbus   │ │  MQTT    │ │  ONVIF   │            │
│  │ Adapter  │ │  Adapter │ │  Adapter │            │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘            │
│       └─────────┬───┴────────────┘                   │
│                 ▼                                     │
│         NormalizedEvent                              │
│    (format internal standar)                         │
└────────────────┬────────────────────────────────────┘
                 │ Spring ApplicationEvent
                 ▼
┌─────────────────────────────────────────────────────┐
│              ALARM ENGINE                            │
│  ┌────────────┐  ┌───────────────┐                  │
│  │ Rule       │  │ Alarm         │                  │
│  │ Engine     │  │ Correlator    │                  │
│  └──────┬─────┘  └───────┬───────┘                  │
│         └───────┬────────┘                           │
│                 ▼                                     │
│          Alarm Entity                                │
└────────────────┬────────────────────────────────────┘
                 │ Spring ApplicationEvent
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌───────────────┐
│ NOTIFICATION │  │  API GATEWAY  │
│   SERVICE    │  │               │
│ ┌──────────┐ │  │ REST + WS     │
│ │ Email    │ │  │ Swagger UI    │
│ │ SMS      │ │  │ Security      │
│ │ WhatsApp │ │  └───────┬───────┘
│ └──────────┘ │          │
└──────────────┘          ▼
                  ┌──────────────┐
                  │  FRONTEND    │
                  │  React SPA   │
                  │  Dashboard   │
                  └──────────────┘
```

### 2.2 Data Flow

1. **Device → Integration Service:** Modbus polling (pull) atau MQTT subscribe (push)
2. **Integration Service → Alarm Engine:** NormalizedEvent via Spring ApplicationEvent
3. **Alarm Engine → Alarm DB:** Persist alarm ke PostgreSQL
4. **Alarm Engine → Notification Service:** Alarm event trigger notifikasi
5. **Alarm Engine → API Gateway → Frontend:** WebSocket push real-time alarm
6. **Frontend → API Gateway:** REST API untuk CRUD, acknowledge, resolve

### 2.3 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Spring Boot | 3.4.5 |
| Language | Java | 21 (LTS) |
| Database | PostgreSQL | 16+ |
| Migration | Flyway | (managed by Spring Boot) |
| Modbus | j2mod | 3.2.1 |
| MQTT | Eclipse Paho + Spring Integration | 1.2.5 |
| WebSocket | Spring WebSocket + STOMP | (managed by Spring Boot) |
| API Docs | SpringDoc OpenAPI (Swagger) | 2.8.6 |
| Frontend | React + TypeScript + Vite | (separate repo) |
| CI/CD | GitHub Actions | - |

---

## 3. Module Design

### 3.1 Common Module
- **NormalizedEvent DTO** — format universal untuk semua event dari device
- **Enums** — DeviceProtocol, AlarmSeverity, AlarmStatus, EventType, NotificationType
- **Exceptions** — DeviceConnectionException, AlarmProcessingException

### 3.2 Integration Service
- **ProtocolAdapter interface** — contract modular per-protokol
- **ModbusConnector** — j2mod master, polling holding registers
- **MqttConnector** — Spring Integration MQTT, subscribe topics
- **DeviceConfig entity** — master data device (IP, port, register map)
- **DevicePollingService** — orchestrator: connect, poll, publish events

### 3.3 Alarm Engine
- **RuleEngine** — evaluasi NormalizedEvent terhadap AlarmRule (JSON conditions)
- **AlarmProcessor** — listener NormalizedEvent, create/update Alarm
- **Alarm entity** — lifecycle: ACTIVE → ACKNOWLEDGED → RESOLVED
- **AlarmRule entity** — configurable rules dengan priority ordering

### 3.4 Notification Service
- **NotificationDispatcher interface** — contract per-channel
- **EmailNotifier** — Spring Mail (SMTP)
- **WhatsAppNotifier** — stub (pending vendor API)
- **SmsNotifier** — stub (pending vendor API)
- **NotificationLog entity** — audit trail

### 3.5 API Gateway
- REST controllers (Alarm, Device, Zone)
- WebSocket STOMP (/topic/alarms, /topic/events)
- Spring Security (Basic Auth fase 1, JWT fase 2)
- Swagger UI auto-generated

### 3.6 Simulator
- ModbusTcpSimulator — j2mod slave, 10 holding registers
- MqttPublisherSimulator — 4 virtual sensors (gas, wind, temp)
- Standalone Spring Boot app

---

## 4. Database Schema

See [database-erd.md](database-erd.md) for detailed ERD.

### Tables
| Table | Description | Records (est.) |
|-------|-------------|---------------|
| zones | Area pabrik | 5-20 |
| devices | Master data device | 20-50 |
| events | Event log (raw) | High volume |
| alarm_rules | Rule definitions | 10-50 |
| alarms | Alarm instances | Medium volume |
| users | Operator & admin | 5-20 |
| notification_log | Notif audit trail | High volume |

---

## 5. Security

### Fase 1 (Starter Pack)
- Basic HTTP authentication
- In-memory user store (operator, admin)
- CORS enabled for frontend
- Swagger UI public access

### Fase 2 (Production)
- JWT token-based authentication
- Database-backed user management
- Role-based access control (OPERATOR, ADMIN, SUPERVISOR)
- WebSocket authentication via STOMP interceptor
- SSL/TLS termination

---

## 6. Deployment

### Development
- Local PostgreSQL + Mosquitto
- `mvn spring-boot:run -pl api-gateway`
- Simulator terpisah: `mvn spring-boot:run -pl simulator`

### Staging / Production
- Docker Compose (planned)
- On-premise command center server
- Environment configs: application-{dev,staging,prod}.yml

---

## 7. Open Items

| # | Item | Status | Owner |
|---|------|--------|-------|
| 1 | AI Decision Engine: rule-based vs ML | Assumed rule-based, pending PM confirmation | PM |
| 2 | WA API vendor selection | Pending | PM |
| 3 | CCTV ONVIF integration detail | Deferred to phase 2 | Software Lead |
| 4 | Register map dari vendor panel | Pending survey lapangan | Hardware Team |
| 5 | TimescaleDB evaluation | Pending volume estimate | Software Lead |
