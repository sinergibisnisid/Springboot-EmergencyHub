/* ============================================================
   TypeScript Types — Emergency Hub Platform
   ============================================================ */

export type AlarmSeverity = 'CRITICAL' | 'EMERGENCY' | 'WARNING' | 'INFO';
export type AlarmStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CLOSED';
export type DeviceProtocol = 'MODBUS' | 'MQTT' | 'ONVIF';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'FAULT';

export interface Zone {
  id: string;
  name: string;
  description: string;
  location: string;
  createdAt: string;
}

export interface Device {
  id: string;
  name: string;
  protocol: DeviceProtocol;
  ipAddress: string;
  port: number;
  unitId?: number;
  zoneId: string;
  zoneName?: string;
  config?: Record<string, unknown>;
  status: DeviceStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Alarm {
  id: string;
  eventId?: string;
  zoneId?: string;
  zoneName?: string;
  deviceId?: string;
  deviceName?: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  title: string;
  description: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface NormalizedEvent {
  id?: string;
  deviceId: string;
  deviceName?: string;
  protocol: DeviceProtocol;
  eventType: string;
  severity: AlarmSeverity;
  payload: Record<string, unknown>;
  rawData?: string;
  timestamp: string;
  zoneId?: string;
  zoneName?: string;
  sourceAddress?: string;
}

export interface DashboardStats {
  activeAlarms: number;
  criticalCount: number;
  warningCount: number;
  devicesOnline: number;
  devicesTotal: number;
  eventsToday: number;
}

export interface WindData {
  speed: number;
  direction: string;
  unit: string;
}
