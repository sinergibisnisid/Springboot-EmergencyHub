import type { Zone, Alarm } from '../../types';
import { MapPin, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ZoneCardProps {
  zone: Zone;
  deviceCount: number;
  alarms: Alarm[];
}

export default function ZoneCard({ zone, deviceCount, alarms }: ZoneCardProps) {
  const activeAlarms = alarms.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlarms.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY').length;
  const warningCount = activeAlarms.filter(a => a.severity === 'WARNING').length;

  const worstSeverity = criticalCount > 0 ? 'CRITICAL' : warningCount > 0 ? 'WARNING' : 'NORMAL';

  const borderColor: Record<string, string> = {
    CRITICAL: 'border-[var(--color-critical)] shadow-[0_0_15px_rgba(255,23,68,0.15)]',
    WARNING: 'border-[var(--color-warning)]',
    NORMAL: 'border-[var(--color-border)]',
  };

  const glowClass = worstSeverity === 'CRITICAL' ? 'animate-pulse-glow' : '';

  return (
    <div
      className={`rounded-xl bg-[var(--color-bg-secondary)] border-2 p-4
        ${borderColor[worstSeverity]} ${glowClass}
        hover:bg-[var(--color-bg-tertiary)] transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${
          worstSeverity === 'CRITICAL' ? 'bg-[var(--color-critical-bg)]' :
          worstSeverity === 'WARNING' ? 'bg-[var(--color-warning-bg)]' :
          'bg-[var(--color-normal-bg)]'
        }`}>
          <MapPin className={`w-4 h-4 ${
            worstSeverity === 'CRITICAL' ? 'text-[var(--color-critical)]' :
            worstSeverity === 'WARNING' ? 'text-[var(--color-warning)]' :
            'text-[var(--color-normal)]'
          }`} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{zone.name}</h3>
          <p className="text-[10px] text-[var(--color-text-muted)]">{zone.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="text-center p-2 rounded-lg bg-[var(--color-bg-primary)]">
          <p className="tabular text-lg font-bold text-[var(--color-text-primary)]">{deviceCount}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">Devices</p>
        </div>
        <div className={`text-center p-2 rounded-lg ${criticalCount > 0 ? 'bg-[var(--color-critical-bg)]' : 'bg-[var(--color-bg-primary)]'}`}>
          <p className={`tabular text-lg font-bold ${criticalCount > 0 ? 'text-[var(--color-critical)]' : 'text-[var(--color-text-muted)]'}`}>
            {criticalCount}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] flex items-center justify-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" /> Critical
          </p>
        </div>
        <div className={`text-center p-2 rounded-lg ${warningCount > 0 ? 'bg-[var(--color-warning-bg)]' : 'bg-[var(--color-bg-primary)]'}`}>
          <p className={`tabular text-lg font-bold ${warningCount > 0 ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]'}`}>
            {warningCount}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] flex items-center justify-center gap-0.5">
            <AlertCircle className="w-2.5 h-2.5" /> Warning
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        {worstSeverity === 'NORMAL' ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-normal)]" />
            <span className="text-xs text-[var(--color-normal)]">All Normal</span>
          </>
        ) : (
          <>
            <AlertTriangle className={`w-3.5 h-3.5 ${worstSeverity === 'CRITICAL' ? 'text-[var(--color-critical)]' : 'text-[var(--color-warning)]'}`} />
            <span className={`text-xs font-semibold ${worstSeverity === 'CRITICAL' ? 'text-[var(--color-critical)]' : 'text-[var(--color-warning)]'}`}>
              {activeAlarms.length} Active Alarm{activeAlarms.length > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
