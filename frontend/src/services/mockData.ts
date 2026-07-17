import type { Zone, Device, Alarm, NormalizedEvent, DashboardStats, WindData } from '../types';

/* ============================================================
   Mock Data — Simulator-first development
   Data dummy untuk frontend tanpa backend running
   ============================================================ */

// ---- Zones (PT Pupuk Kujang) ----
export const mockZones: Zone[] = [
  { id: 'z1', name: 'ZONE-A', description: 'Area Produksi Utama', location: 'Gedung Produksi Lt. 1', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'z2', name: 'ZONE-B', description: 'Gudang Ammonia', location: 'Area Gudang Selatan', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'z3', name: 'ZONE-C', description: 'Area Utilitas', location: 'Bangunan Utilitas', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'z4', name: 'ZONE-D', description: 'Kantor & Command Center', location: 'Gedung Administrasi', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'z5', name: 'ZONE-E', description: 'Area Loading/Unloading', location: 'Dermaga & Jalur Loading', createdAt: '2026-07-17T10:00:00Z' },
];

// ---- Devices ----
export const mockDevices: Device[] = [
  { id: 'd1', name: 'FA-PANEL-01', protocol: 'MODBUS', ipAddress: '192.168.1.10', port: 502, unitId: 1, zoneId: 'z1', zoneName: 'ZONE-A', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd2', name: 'FA-PANEL-02', protocol: 'MODBUS', ipAddress: '192.168.1.11', port: 502, unitId: 2, zoneId: 'z1', zoneName: 'ZONE-A', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd3', name: 'FA-PANEL-03', protocol: 'MODBUS', ipAddress: '192.168.1.12', port: 502, unitId: 1, zoneId: 'z2', zoneName: 'ZONE-B', status: 'OFFLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd4', name: 'GAS-SENSOR-01', protocol: 'MQTT', ipAddress: '192.168.2.10', port: 1883, zoneId: 'z2', zoneName: 'ZONE-B', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd5', name: 'GAS-SENSOR-02', protocol: 'MQTT', ipAddress: '192.168.2.11', port: 1883, zoneId: 'z3', zoneName: 'ZONE-C', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd6', name: 'WIND-SENSOR-01', protocol: 'MQTT', ipAddress: '192.168.2.20', port: 1883, zoneId: 'z5', zoneName: 'ZONE-E', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd7', name: 'TEMP-SENSOR-01', protocol: 'MQTT', ipAddress: '192.168.2.30', port: 1883, zoneId: 'z1', zoneName: 'ZONE-A', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd8', name: 'FA-PANEL-04', protocol: 'MODBUS', ipAddress: '192.168.1.13', port: 502, unitId: 1, zoneId: 'z3', zoneName: 'ZONE-C', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'd9', name: 'SIM-PANEL-01', protocol: 'MODBUS', ipAddress: '127.0.0.1', port: 5020, unitId: 1, zoneId: 'z1', zoneName: 'ZONE-A', status: 'ONLINE', createdAt: '2026-07-17T10:00:00Z', config: { registerStart: 0, registerCount: 10 } },
  { id: 'd10', name: 'FA-PANEL-05', protocol: 'MODBUS', ipAddress: '192.168.1.14', port: 502, unitId: 1, zoneId: 'z4', zoneName: 'ZONE-D', status: 'FAULT', createdAt: '2026-07-17T10:00:00Z' },
];

// ---- Alarms ----
const now = new Date();
function minsAgo(m: number) { return new Date(now.getTime() - m * 60000).toISOString(); }

export const mockAlarms: Alarm[] = [
  { id: 'a1', zoneId: 'z2', zoneName: 'ZONE-B', deviceId: 'd4', deviceName: 'GAS-SENSOR-01', severity: 'CRITICAL', status: 'ACTIVE', title: '🔴 GAS LEAK — Gudang Ammonia', description: 'H2S concentration 72.3 ppm (threshold: 50 ppm)', createdAt: minsAgo(2) },
  { id: 'a2', zoneId: 'z1', zoneName: 'ZONE-A', deviceId: 'd1', deviceName: 'FA-PANEL-01', severity: 'CRITICAL', status: 'ACTIVE', title: '🔴 FIRE ALARM — Zone 1 Produksi', description: 'Fire alarm activation on Zone 1, Register 0 = 1', createdAt: minsAgo(5) },
  { id: 'a3', zoneId: 'z5', zoneName: 'ZONE-E', deviceId: 'd6', deviceName: 'WIND-SENSOR-01', severity: 'WARNING', status: 'ACTIVE', title: '🟡 HIGH WIND — Area Loading', description: 'Wind speed 38.2 km/h NW (threshold: 25 km/h)', createdAt: minsAgo(8) },
  { id: 'a4', zoneId: 'z3', zoneName: 'ZONE-C', deviceId: 'd3', deviceName: 'FA-PANEL-03', severity: 'WARNING', status: 'ACTIVE', title: '🟡 DEVICE OFFLINE — FA-PANEL-03', description: 'Panel disconnected, last seen 12 minutes ago', createdAt: minsAgo(12) },
  { id: 'a5', zoneId: 'z1', zoneName: 'ZONE-A', deviceId: 'd9', deviceName: 'SIM-PANEL-01', severity: 'WARNING', status: 'ACKNOWLEDGED', title: '🟡 SMOKE DETECTED — Simulator Panel', description: 'Smoke detector register = 1', acknowledgedBy: 'operator', acknowledgedAt: minsAgo(3), createdAt: minsAgo(15) },
  { id: 'a6', zoneId: 'z1', zoneName: 'ZONE-A', deviceId: 'd7', deviceName: 'TEMP-SENSOR-01', severity: 'INFO', status: 'RESOLVED', title: '🟢 HIGH TEMP — Area Produksi', description: 'Temperature 48°C (threshold: 45°C), returned to normal', resolvedAt: minsAgo(1), createdAt: minsAgo(30) },
  { id: 'a7', zoneId: 'z4', zoneName: 'ZONE-D', deviceId: 'd10', deviceName: 'FA-PANEL-05', severity: 'WARNING', status: 'ACTIVE', title: '🟡 PANEL FAULT — Kantor', description: 'Panel status register indicates fault condition', createdAt: minsAgo(20) },
  { id: 'a8', zoneId: 'z3', zoneName: 'ZONE-C', deviceId: 'd5', deviceName: 'GAS-SENSOR-02', severity: 'INFO', status: 'RESOLVED', title: '🟢 GAS LEVEL — Utilitas', description: 'Gas concentration 22 ppm (elevated but below threshold)', resolvedAt: minsAgo(5), createdAt: minsAgo(45) },
];

// ---- Events ----
export const mockEvents: NormalizedEvent[] = [
  { id: 'e1', deviceId: 'GAS-SENSOR-01', deviceName: 'GAS-SENSOR-01', protocol: 'MQTT', eventType: 'GAS_LEAK', severity: 'CRITICAL', payload: { concentration: 72.3, unit: 'ppm', gasType: 'H2S' }, timestamp: minsAgo(2), zoneId: 'z2', zoneName: 'ZONE-B' },
  { id: 'e2', deviceId: 'FA-PANEL-01', deviceName: 'FA-PANEL-01', protocol: 'MODBUS', eventType: 'FIRE_ALARM', severity: 'CRITICAL', payload: { register: 0, value: 1, zone: 'A1' }, rawData: '[1,0,0,0,0,25,0,0,0,0]', timestamp: minsAgo(5), zoneId: 'z1', zoneName: 'ZONE-A' },
  { id: 'e3', deviceId: 'WIND-SENSOR-01', deviceName: 'WIND-SENSOR-01', protocol: 'MQTT', eventType: 'WIND_SPEED', severity: 'WARNING', payload: { speed: 38.2, direction: 'NW', unit: 'km/h' }, timestamp: minsAgo(8), zoneId: 'z5', zoneName: 'ZONE-E' },
  { id: 'e4', deviceId: 'FA-PANEL-03', deviceName: 'FA-PANEL-03', protocol: 'MODBUS', eventType: 'DEVICE_OFFLINE', severity: 'WARNING', payload: { lastSeen: minsAgo(12) }, timestamp: minsAgo(12), zoneId: 'z3', zoneName: 'ZONE-C' },
  { id: 'e5', deviceId: 'SIM-PANEL-01', deviceName: 'SIM-PANEL-01', protocol: 'MODBUS', eventType: 'SMOKE_DETECTED', severity: 'WARNING', payload: { register: 4, value: 1 }, rawData: '[0,0,0,0,1,32,0,0,0,0]', timestamp: minsAgo(15), zoneId: 'z1', zoneName: 'ZONE-A' },
  { id: 'e6', deviceId: 'TEMP-SENSOR-01', deviceName: 'TEMP-SENSOR-01', protocol: 'MQTT', eventType: 'TEMPERATURE', severity: 'WARNING', payload: { temperature: 48.2, humidity: 65 }, timestamp: minsAgo(30), zoneId: 'z1', zoneName: 'ZONE-A' },
  { id: 'e7', deviceId: 'GAS-SENSOR-02', deviceName: 'GAS-SENSOR-02', protocol: 'MQTT', eventType: 'GAS_LEVEL_HIGH', severity: 'INFO', payload: { concentration: 22.1, unit: 'ppm' }, timestamp: minsAgo(45), zoneId: 'z3', zoneName: 'ZONE-C' },
  { id: 'e8', deviceId: 'FA-PANEL-02', deviceName: 'FA-PANEL-02', protocol: 'MODBUS', eventType: 'HEARTBEAT', severity: 'INFO', payload: { register: 8, value: 0 }, rawData: '[0,0,0,0,0,26,0,0,0,0]', timestamp: minsAgo(1), zoneId: 'z1', zoneName: 'ZONE-A' },
  { id: 'e9', deviceId: 'WIND-SENSOR-01', deviceName: 'WIND-SENSOR-01', protocol: 'MQTT', eventType: 'HEARTBEAT', severity: 'INFO', payload: { speed: 12.5, direction: 'N', unit: 'km/h' }, timestamp: minsAgo(0.5), zoneId: 'z5', zoneName: 'ZONE-E' },
  { id: 'e10', deviceId: 'FA-PANEL-04', deviceName: 'FA-PANEL-04', protocol: 'MODBUS', eventType: 'HEARTBEAT', severity: 'INFO', payload: { allNormal: true }, timestamp: minsAgo(0.2), zoneId: 'z3', zoneName: 'ZONE-C' },
];

// ---- Dashboard Stats (computed) ----
export function computeStats(alarms: Alarm[], devices: Device[]): DashboardStats {
  const active = alarms.filter(a => a.status === 'ACTIVE');
  return {
    activeAlarms: active.length,
    criticalCount: active.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY').length,
    warningCount: active.filter(a => a.severity === 'WARNING').length,
    devicesOnline: devices.filter(d => d.status === 'ONLINE').length,
    devicesTotal: devices.length,
    eventsToday: mockEvents.length,
  };
}

// ---- Wind Data ----
export const mockWindData: WindData = {
  speed: 38.2,
  direction: 'NW',
  unit: 'km/h',
};
