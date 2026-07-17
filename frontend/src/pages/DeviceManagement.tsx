import { Cpu, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { mockDevices } from '../services/mockData';
import type { DeviceStatus, DeviceProtocol } from '../types';

const statusConfig: Record<DeviceStatus, { color: string; icon: typeof Wifi; label: string }> = {
  ONLINE: { color: 'text-[var(--color-normal)]', icon: Wifi, label: 'Online' },
  OFFLINE: { color: 'text-[var(--color-offline)]', icon: WifiOff, label: 'Offline' },
  FAULT: { color: 'text-[var(--color-warning)]', icon: AlertTriangle, label: 'Fault' },
};

const protocolBadge: Record<DeviceProtocol, string> = {
  MODBUS: 'bg-blue-500/10 text-blue-400',
  MQTT: 'bg-purple-500/10 text-purple-400',
  ONVIF: 'bg-teal-500/10 text-teal-400',
};

export default function DeviceManagement() {
  const onlineCount = mockDevices.filter(d => d.status === 'ONLINE').length;
  const offlineCount = mockDevices.filter(d => d.status !== 'ONLINE').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Device Management</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Panel, sensor, dan perangkat terhubung</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-normal-dim)]">
            <Wifi className="w-4 h-4 text-[var(--color-normal)]" />
            <span className="tabular text-sm font-bold text-[var(--color-normal)]">{onlineCount}</span>
            <span className="text-xs text-[var(--color-text-muted)]">online</span>
          </div>
          {offlineCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-offline-dim)]">
              <WifiOff className="w-4 h-4 text-[var(--color-offline)]" />
              <span className="tabular text-sm font-bold text-[var(--color-offline)]">{offlineCount}</span>
              <span className="text-xs text-[var(--color-text-muted)]">offline</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3.5 section-label">Status</th>
              <th className="text-left px-5 py-3.5 section-label">Device Name</th>
              <th className="text-left px-5 py-3.5 section-label">Protocol</th>
              <th className="text-left px-5 py-3.5 section-label">IP Address</th>
              <th className="text-left px-5 py-3.5 section-label">Port</th>
              <th className="text-left px-5 py-3.5 section-label">Zone</th>
            </tr>
          </thead>
          <tbody>
            {mockDevices.map(device => {
              const statusCfg = statusConfig[device.status];
              const StatusIcon = statusCfg.icon;
              return (
                <tr key={device.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                      <span className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{device.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${protocolBadge[device.protocol]}`}>
                      {device.protocol}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 tabular text-[13px] text-[var(--color-text-secondary)]">{device.ipAddress}</td>
                  <td className="px-5 py-3.5 tabular text-[13px] text-[var(--color-text-secondary)]">{device.port}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[var(--color-text-muted)]">{device.zoneName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
