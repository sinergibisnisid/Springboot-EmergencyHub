import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { AlarmSeverity } from '../../types';

interface StatusBadgeProps {
  severity: AlarmSeverity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const config: Record<AlarmSeverity, { bg: string; text: string; icon: typeof AlertTriangle; label: string }> = {
  CRITICAL: { bg: 'bg-[var(--color-critical-dim)]', text: 'text-[var(--color-critical)]', icon: AlertTriangle, label: 'CRITICAL' },
  EMERGENCY: { bg: 'bg-[var(--color-critical-dim)]', text: 'text-[var(--color-critical)]', icon: AlertTriangle, label: 'EMERGENCY' },
  WARNING: { bg: 'bg-[var(--color-warning-dim)]', text: 'text-[var(--color-warning)]', icon: AlertCircle, label: 'WARNING' },
  INFO: { bg: 'bg-[var(--color-normal-dim)]', text: 'text-[var(--color-normal)]', icon: CheckCircle2, label: 'NORMAL' },
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1',
  md: 'px-2 py-1 text-[11px] gap-1.5',
  lg: 'px-3 py-1.5 text-xs gap-2',
};

const iconSizes = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' };

export default function StatusBadge({ severity, size = 'md', showLabel = true }: StatusBadgeProps) {
  const { bg, text, icon: Icon, label } = config[severity] || config.INFO;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md ${bg} ${text} ${sizeClasses[size]}`}
      role="status"
      aria-label={label}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
