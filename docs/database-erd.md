# Database ERD
## Emergency Hub Platform

---

## Entity Relationship Diagram

```mermaid
erDiagram
    ZONES {
        UUID id PK
        VARCHAR name
        TEXT description
        VARCHAR location
        TIMESTAMP created_at
    }

    DEVICES {
        UUID id PK
        VARCHAR name
        VARCHAR protocol
        VARCHAR ip_address
        INTEGER port
        INTEGER unit_id
        UUID zone_id FK
        JSONB config
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    EVENTS {
        UUID id PK
        UUID device_id FK
        VARCHAR event_type
        VARCHAR severity
        JSONB payload
        TEXT raw_data
        TIMESTAMP timestamp
        TIMESTAMP created_at
    }

    ALARM_RULES {
        UUID id PK
        VARCHAR name
        TEXT description
        JSONB condition_json
        VARCHAR result_severity
        BOOLEAN enabled
        INTEGER priority
        UUID zone_id FK
        TIMESTAMP created_at
    }

    ALARMS {
        UUID id PK
        UUID event_id FK
        UUID zone_id FK
        UUID device_id FK
        VARCHAR severity
        VARCHAR status
        VARCHAR title
        TEXT description
        UUID acknowledged_by FK
        TIMESTAMP acknowledged_at
        TIMESTAMP resolved_at
        TIMESTAMP created_at
    }

    USERS {
        UUID id PK
        VARCHAR username
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR role
        VARCHAR email
        VARCHAR phone
        TIMESTAMP created_at
    }

    NOTIFICATION_LOG {
        UUID id PK
        UUID alarm_id FK
        UUID user_id FK
        VARCHAR channel
        VARCHAR recipient
        TEXT message
        VARCHAR status
        TIMESTAMP sent_at
        TEXT error_message
        TIMESTAMP created_at
    }

    ZONES ||--o{ DEVICES : "has"
    ZONES ||--o{ ALARMS : "located in"
    ZONES ||--o{ ALARM_RULES : "scoped to"
    DEVICES ||--o{ EVENTS : "generates"
    DEVICES ||--o{ ALARMS : "triggers"
    EVENTS ||--o{ ALARMS : "triggers"
    ALARMS ||--o{ NOTIFICATION_LOG : "notifies"
    USERS ||--o{ NOTIFICATION_LOG : "receives"
    USERS ||--o{ ALARMS : "acknowledges"
```

---

## Table Descriptions

### zones
Area/zona di pabrik PT Pupuk Kujang. Seed data: ZONE-A (Produksi), ZONE-B (Gudang Ammonia), ZONE-C (Utilitas), ZONE-D (Kantor/Command Center), ZONE-E (Loading/Unloading).

### devices
Master data device/panel/sensor. Field `config` (JSONB) menyimpan konfigurasi spesifik per-protokol (register map untuk Modbus, topic untuk MQTT, dll).

### events
Log semua raw event yang masuk dari device. High-volume table — pertimbangkan partitioning by timestamp atau migrasi ke TimescaleDB jika diperlukan.

### alarm_rules
Definisi rule untuk alarm engine. Menggunakan JSONB `condition_json` untuk fleksibilitas mendefinisikan kondisi tanpa perlu mengubah kode. Rules dievaluasi berdasarkan `priority` (ascending).

### alarms
Alarm instance yang dihasilkan oleh alarm engine. Lifecycle: ACTIVE → ACKNOWLEDGED → RESOLVED/CLOSED.

### users
Operator dan admin yang menggunakan platform. Fase 1 menggunakan in-memory users, migrasi ke database di fase 2.

### notification_log
Audit trail semua notifikasi yang pernah dikirim. Mencatat channel, recipient, status delivery, dan error message jika gagal.

---

## Indexes

| Table | Index | Columns |
|-------|-------|---------|
| devices | idx_devices_protocol | protocol |
| devices | idx_devices_status | status |
| devices | idx_devices_zone_id | zone_id |
| events | idx_events_device_id | device_id |
| events | idx_events_event_type | event_type |
| events | idx_events_timestamp | timestamp |
| alarms | idx_alarms_status | status |
| alarms | idx_alarms_severity | severity |
| alarms | idx_alarms_zone_id | zone_id |
| alarms | idx_alarms_created_at | created_at |
| notification_log | idx_notification_log_alarm_id | alarm_id |
| notification_log | idx_notification_log_status | status |
