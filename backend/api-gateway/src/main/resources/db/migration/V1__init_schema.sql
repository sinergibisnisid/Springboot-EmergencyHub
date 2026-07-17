-- ============================================================
-- Emergency Hub Platform — Initial Schema
-- Database: PostgreSQL 16+
-- ============================================================

-- Zones: Area/zona di pabrik
CREATE TABLE IF NOT EXISTS zones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    location        VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices: Master data panel/sensor/kamera
CREATE TABLE IF NOT EXISTS devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    protocol        VARCHAR(20) NOT NULL,
    ip_address      VARCHAR(45),
    port            INTEGER,
    unit_id         INTEGER,
    zone_id         UUID REFERENCES zones(id) ON DELETE SET NULL,
    config          JSONB,
    status          VARCHAR(20) DEFAULT 'OFFLINE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE
);

-- Events: Log semua event dari device
CREATE TABLE IF NOT EXISTS events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       UUID REFERENCES devices(id) ON DELETE SET NULL,
    event_type      VARCHAR(50) NOT NULL,
    severity        VARCHAR(20) NOT NULL,
    payload         JSONB,
    raw_data        TEXT,
    timestamp       TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alarm Rules: Definisi rule untuk alarm engine
CREATE TABLE IF NOT EXISTS alarm_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    condition_json  JSONB,
    result_severity VARCHAR(20) NOT NULL,
    enabled         BOOLEAN DEFAULT TRUE,
    priority        INTEGER DEFAULT 100,
    zone_id         UUID REFERENCES zones(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alarms: Alarm yang dihasilkan oleh alarm engine
CREATE TABLE IF NOT EXISTS alarms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID REFERENCES events(id) ON DELETE SET NULL,
    zone_id         UUID REFERENCES zones(id) ON DELETE SET NULL,
    device_id       UUID REFERENCES devices(id) ON DELETE SET NULL,
    severity        VARCHAR(20) NOT NULL,
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    title           VARCHAR(255),
    description     TEXT,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users: Operator & admin
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100),
    role            VARCHAR(20) NOT NULL,
    email           VARCHAR(100),
    phone           VARCHAR(20),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Log: Audit trail notifikasi
CREATE TABLE IF NOT EXISTS notification_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alarm_id        UUID REFERENCES alarms(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    channel         VARCHAR(20) NOT NULL,
    recipient       VARCHAR(255),
    message         TEXT,
    status          VARCHAR(20) DEFAULT 'PENDING',
    sent_at         TIMESTAMP WITH TIME ZONE,
    error_message   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_devices_protocol ON devices(protocol);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_zone_id ON devices(zone_id);
CREATE INDEX idx_events_device_id ON events(device_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_alarms_status ON alarms(status);
CREATE INDEX idx_alarms_severity ON alarms(severity);
CREATE INDEX idx_alarms_zone_id ON alarms(zone_id);
CREATE INDEX idx_alarms_created_at ON alarms(created_at);
CREATE INDEX idx_notification_log_alarm_id ON notification_log(alarm_id);
CREATE INDEX idx_notification_log_status ON notification_log(status);

-- ============================================================
-- Seed Data: Default zones for PT Pupuk Kujang
-- ============================================================
INSERT INTO zones (name, description, location) VALUES
    ('ZONE-A', 'Area Produksi Utama', 'Gedung Produksi Lt. 1'),
    ('ZONE-B', 'Gudang Ammonia', 'Area Gudang Selatan'),
    ('ZONE-C', 'Area Utilitas', 'Bangunan Utilitas'),
    ('ZONE-D', 'Kantor & Command Center', 'Gedung Administrasi'),
    ('ZONE-E', 'Area Loading/Unloading', 'Dermaga & Jalur Loading');

-- Seed Data: Default alarm rules
INSERT INTO alarm_rules (name, description, condition_json, result_severity, priority) VALUES
    ('Fire Alarm - Critical',
     'Any fire alarm activation triggers CRITICAL alarm',
     '{"eventType": "FIRE_ALARM", "field": "value", "operator": "GT", "threshold": 0}',
     'CRITICAL', 10),
    ('Gas Leak - Emergency',
     'Gas leak detection triggers EMERGENCY alarm',
     '{"eventType": "GAS_LEAK", "field": "concentration", "operator": "GT", "threshold": 50}',
     'EMERGENCY', 5),
    ('High Wind Speed - Warning',
     'Wind speed above 25 km/h triggers WARNING',
     '{"eventType": "WIND_SPEED", "field": "speed", "operator": "GT", "threshold": 25}',
     'WARNING', 50),
    ('Device Offline - Warning',
     'Device goes offline triggers WARNING',
     '{"eventType": "DEVICE_OFFLINE"}',
     'WARNING', 80);
