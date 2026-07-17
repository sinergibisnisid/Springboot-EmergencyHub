import { Cpu, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { mockDevices } from '../services/mockData';
import type { DeviceStatus, DeviceProtocol } from '../types';

const statusConfig: Record<DeviceStatus, { color: string; icon: typeof Wifi; label: string }> = {
  ONLINE: { color: 'text-[var(--color-normal)]', icon: Wifi, label: 'Online' },
  OFFLINE: { color: 'text-[var(--color-offline)]', icon: WifiOff, label: 'Offline' },
  FAULT: { color: 'text-[var(--color-warning)]', icon: AlertTriangle, label: 'Fault' },
};

const protocolBadge: Record<DeviceProtocol, string> = {
  MODBUS: 'bg-blue-500/15 text-blue-400',
  MQTT: 'bg-purple-500/15 text-purple-400',
  ONVIF: 'bg-teal-500/15 text-teal-400',
};

export default function DeviceManagement() {
  const onlineCount = mockDevices.filter(d => d.status === 'ONLINE').length;
  const offlineCount = mockDevices.filter(d => d.status !== 'ONLINE').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Device Management</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Panel, sensor, dan perangkat terhubung</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-normal-bg)]">
            <Wifi className="w-4 h-4 text-[var(--color-normal)]" />
            <span className="tabular text-sm font-bold text-[var(--color-normal)]">{onlineCount}</span>
            <span className="text-xs text-[var(--color-text-muted)]">online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-offline-bg)]">
            <WifiOff className="w-4 h-4 text-[var(--color-offline)]" />
            <span className="tabular text-sm font-bold text-[var(--color-offline)]">{offlineCount}</span>
            <span className="text-xs text-[var(--color-text-muted)]">offline</span>
          </div>
        </div>
      </div>

      {/* Device table */}
      <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Device Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Protocol</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">IP Address</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Port</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Zone</th>
            </tr>
          </thead>
          <tbody>
            {mockDevices.map(device => {
              const statusCfg = statusConfig[device.status];
              const StatusIcon = statusCfg.icon;
              return (
                <tr
                  key={device.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                      <span className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <span className="font-medium text-[var(--color-text-primary)]">{device.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${protocolBadge[device.protocol]}`}>
                      {device.protocol}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular text-[var(--color-text-secondary)]">{device.ipAddress}</td>
                  <td className="px-4 py-3 tabular text-[var(--color-text-secondary)]">{device.port}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{device.zoneName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
