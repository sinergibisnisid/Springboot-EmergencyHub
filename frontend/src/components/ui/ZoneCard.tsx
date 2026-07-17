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
  const onlinePercent = totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 0;

  const hasCritical = criticalCount > 0;
  const hasWarning = warningCount > 0 && !hasCritical;
  const borderClass = hasCritical
    ? 'border-l-[var(--color-critical)]'
    : hasWarning
      ? 'border-l-[var(--color-warning)]'
      : 'border-l-[var(--color-border)]';

  return (
    <div className={`rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] border-l-[3px] ${borderClass} p-4 hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer`}>
      {/* Row 1: Name + status icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
          <span className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{zone.name}</span>
          <span className="text-[11px] text-[var(--color-text-muted)] truncate hidden sm:inline">
            {zone.description}
          </span>
        </div>
        {activeAlarms.length === 0 && (
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-normal)] shrink-0" />
        )}
      </div>

      {/* Row 2: Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Devices</span>
          <span className="tabular text-[11px] font-medium text-[var(--color-text-secondary)]">
            {onlineCount}/{totalDevices} Online · {onlinePercent}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-[var(--color-bg-primary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${onlinePercent}%`,
              background: onlinePercent === 100 ? 'var(--color-normal)' : 'var(--color-warning)',
            }}
          />
        </div>
      </div>

      {/* Row 3: Alarm summary (compact) */}
      <div className="flex items-center gap-3 text-[11px]">
        {criticalCount > 0 && (
          <span className="flex items-center gap-1 text-[var(--color-critical)] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {criticalCount} Critical
          </span>
        )}
        {warningCount > 0 && (
          <span className="flex items-center gap-1 text-[var(--color-warning)] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {warningCount} Warning
          </span>
        )}
        {activeAlarms.length === 0 && (
          <span className="flex items-center gap-1 text-[var(--color-normal)]">
            <CheckCircle2 className="w-3 h-3" />
            All Normal
          </span>
        )}
      </div>
    </div>
  );
}
