import type { ReactNode } from 'react';
import type { AlarmSeverity } from '../../types';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  severity?: AlarmSeverity;
  subtitle?: string;
  breakdown?: { label: string; value: number; color: string }[];
}

export default function StatCard({ label, value, icon, severity, subtitle, breakdown }: StatCardProps) {
  const accentColor = severity === 'CRITICAL' || severity === 'EMERGENCY'
    ? 'var(--color-critical)'
    : severity === 'WARNING'
      ? 'var(--color-warning)'
      : severity === 'INFO'
        ? 'var(--color-normal)'
        : 'var(--color-brand)';

  return (
    <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 hover:bg-[var(--color-bg-elevated)] transition-colors duration-200">
      {/* Top: icon + label */}
      <div className="flex items-center justify-between mb-4">
        <span className="section-label">{label}</span>
        <div className="p-2 rounded-lg" style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>

      {/* Value */}
      <p className="tabular text-4xl font-bold leading-none mb-1" style={{ color: accentColor }}>
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>
      )}

      {/* Breakdown bars */}
      {breakdown && breakdown.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] space-y-2">
          {breakdown.map(item => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-[var(--color-text-secondary)]">{item.label}</span>
              </div>
              <span className="tabular font-semibold text-[var(--color-text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
