import type { ReactNode } from 'react';
import type { AlarmSeverity } from '../../types';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  severity?: AlarmSeverity;
  subtitle?: string;
}

const severityBorder: Record<string, string> = {
  CRITICAL: 'border-l-[var(--color-critical)]',
  EMERGENCY: 'border-l-[var(--color-critical)]',
  WARNING: 'border-l-[var(--color-warning)]',
  INFO: 'border-l-[var(--color-normal)]',
};

const severityText: Record<string, string> = {
  CRITICAL: 'text-[var(--color-critical)]',
  EMERGENCY: 'text-[var(--color-critical)]',
  WARNING: 'text-[var(--color-warning)]',
  INFO: 'text-[var(--color-normal)]',
};

export default function StatCard({ label, value, icon, severity, subtitle }: StatCardProps) {
  const isCritical = severity === 'CRITICAL' || severity === 'EMERGENCY';

  return (
    <div
      className={`rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] border-l-4 p-5
        ${severity ? severityBorder[severity] : 'border-l-[var(--color-brand)]'}
        ${isCritical ? 'animate-pulse-glow' : ''}
        hover:bg-[var(--color-bg-tertiary)] transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`tabular text-3xl font-bold ${severity ? severityText[severity] : 'text-[var(--color-text-primary)]'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-[var(--color-bg-tertiary)] ${severity ? severityText[severity] : 'text-[var(--color-brand-light)]'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
