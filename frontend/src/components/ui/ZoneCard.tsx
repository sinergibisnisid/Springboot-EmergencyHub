import type { Zone, Alarm, Device } from '../../types';
import { MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ZoneCardProps {
  zone: Zone;
  devices: Device[];
  alarms: Alarm[];
}

export default function ZoneCard({ zone, devices, alarms }: ZoneCardProps) {
  const activeAlarms = alarms.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlarms.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY').length;
  const warningCount = activeAlarms.filter(a => a.severity === 'WARNING').length;
  const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
  const totalDevices = devices.length;
  const onlinePercent = totalDevices > 0 ? (onlineCount / totalDevices) * 100 : 0;

  const hasCritical = criticalCount > 0;
  const hasWarning = warningCount > 0;

  return (
    <div
      className={`rounded-xl bg-[var(--color-bg-card)] border p-5 hover:bg-[var(--color-bg-elevated)] transition-all duration-200
        ${hasCritical
          ? 'border-l-[3px] border-l-[var(--color-critical)] border-t-[var(--color-border)] border-r-[var(--color-border)] border-b-[var(--color-border)]'
          : hasWarning
            ? 'border-l-[3px] border-l-[var(--color-warning)] border-t-[var(--color-border)] border-r-[var(--color-border)] border-b-[var(--color-border)]'
            : 'border-[var(--color-border)]'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{zone.name}</h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">{zone.description}</p>
          </div>
        </div>
        {activeAlarms.length === 0 && (
          <CheckCircle2 className="w-4 h-4 text-[var(--color-normal)]" />
        )}
      </div>

      {/* Device progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-[var(--color-text-muted)]">Devices</span>
          <span className="tabular text-[11px] font-medium text-[var(--color-text-secondary)]">
            {onlineCount} / {totalDevices} Online
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-bg-primary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${onlinePercent}%`,
              background: onlinePercent === 100 ? 'var(--color-normal)' : 'var(--color-warning)',
            }}
          />
        </div>
      </div>

      {/* Device dots */}
      <div className="flex items-center gap-1 mb-4">
        {devices.map(d => (
          <span
            key={d.id}
            className="w-2 h-2 rounded-full"
            title={`${d.name}: ${d.status}`}
            style={{
              background: d.status === 'ONLINE'
                ? 'var(--color-normal)'
                : d.status === 'FAULT'
                  ? 'var(--color-warning)'
                  : 'var(--color-offline)',
            }}
          />
        ))}
      </div>

      {/* Alarm summary */}
      {activeAlarms.length > 0 ? (
        <div className="pt-3 border-t border-[var(--color-border)] space-y-1.5">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3 h-3 text-[var(--color-critical)]" />
              <span className="text-[var(--color-critical)] font-medium">
                {criticalCount} Critical
              </span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3 h-3 text-[var(--color-warning)]" />
              <span className="text-[var(--color-warning)] font-medium">
                {warningCount} Warning
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-normal)]">
            <CheckCircle2 className="w-3 h-3" />
            All Normal
          </div>
        </div>
      )}
    </div>
  );
}
