# 🚨 Emergency Hub Platform

**Interkoneksi Sarana Proteksi Kedaruratan — PT Pupuk Kujang**

Platform integrasi multi-protocol (Modbus TCP, MQTT, ONVIF) untuk monitoring dan manajemen alarm kedaruratan di command center.

---

## 📐 Architecture

```
┌─────────────┐    ┌─────────────┐    ┌──────────────┐
│  Fire Alarm  │    │  Gas Sensor  │    │  Wind Sensor │
│  Panel (8x)  │    │   (MQTT)     │    │   (MQTT)     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │ Modbus TCP        │ MQTT              │ MQTT
       ▼                   ▼                   ▼
┌──────────────────────────────────────────────────────┐
│              INTEGRATION SERVICE                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Modbus   │  │  MQTT    │  │  ONVIF   │           │
│  │  Adapter  │  │  Adapter │  │  Adapter │           │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘           │
│       └───────┬───────┴─────────────┘                 │
│               ▼                                       │
│       NormalizedEvent                                 │
└───────────────┬──────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────┐
│                ALARM ENGINE                           │
│  Rule-based correlation & decision engine             │
│  (extensible to ML in future phases)                  │
└───────────────┬──────────────────────────────────────┘
                ▼
     ┌──────────┴──────────┐
     ▼                     ▼
┌──────────┐      ┌───────────────┐
│ Notif.   │      │  API Gateway  │
│ Service  │      │  REST + WS    │
│ WA/SMS/  │      │  (WebSocket)  │
│ Email    │      └───────┬───────┘
└──────────┘              ▼
                   ┌──────────────┐
                   │   Frontend   │
                   │  React SPA   │
                   └──────────────┘
```

## 🏗️ Module Structure

| Module | Description |
|--------|-------------|
| `common` | Shared DTOs, enums, exceptions, utilities |
| `integration-service` | Protocol adapters (Modbus, MQTT, ONVIF) |
| `alarm-engine` | Rule-based alarm correlation & processing |
| `notification-service` | Multi-channel notification dispatch |
| `api-gateway` | REST API + WebSocket + Main Spring Boot app |
| `simulator` | Modbus TCP & MQTT dummy data generators |

## 🚀 Quick Start

### Prerequisites
- Java 21 (LTS)
- Maven 3.9+
- PostgreSQL 16+
- Mosquitto MQTT Broker (for MQTT testing)

### Build & Run

```bash
# Build all modules
cd backend
mvn clean install

# Run the main application
mvn spring-boot:run -pl api-gateway

# Run simulator (in separate terminal)
mvn spring-boot:run -pl simulator -Dspring-boot.run.arguments="--mode=all"
```

### Access
- **API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **WebSocket:** ws://localhost:8080/ws-alarms

## 📚 Documentation

- [Software Design Document](docs/SDD.md)
- [Integration Spec](docs/integration-spec.md)
- [API Contract](docs/api-contract.md)
- [Simulator Guide](docs/simulator-guide.md)
- [Database ERD](docs/database-erd.md)

## 🔧 Tech Stack

- **Backend:** Spring Boot 3.4.5 / Java 21
- **Database:** PostgreSQL 16 + Flyway migrations
- **Protocols:** Modbus TCP (j2mod), MQTT (Eclipse Paho), ONVIF
- **Real-time:** WebSocket (STOMP)
- **Docs:** SpringDoc OpenAPI (Swagger)
- **CI:** GitHub Actions

## 📦 Related Repositories

- **Frontend:** [React-EmergencyHub](https://github.com/sinergibisnisid/React-EmergencyHub)

---

*PT Pupuk Kujang — Sistem Proteksi Kedaruratan Terintegrasi*
