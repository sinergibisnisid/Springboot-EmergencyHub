import { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import type { Alarm } from '../../types';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';

interface AlarmCardProps {
  alarm: Alarm;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

const statusIcon = {
  ACTIVE: null,
  ACKNOWLEDGED: Clock,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
};

export default function AlarmCard({ alarm, onAcknowledge, onResolve, compact = false }: AlarmCardProps) {
  const [showAckDialog, setShowAckDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);

  const isCritical = alarm.severity === 'CRITICAL' || alarm.severity === 'EMERGENCY';
  const isActive = alarm.status === 'ACTIVE';
  const StatusIcon = statusIcon[alarm.status];

  const severityBorder: Record<string, string> = {
    CRITICAL: 'border-l-[var(--color-critical)]',
    EMERGENCY: 'border-l-[var(--color-critical)]',
    WARNING: 'border-l-[var(--color-warning)]',
    INFO: 'border-l-[var(--color-normal)]',
  };

  return (
    <>
      <div
        className={`rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] border-l-4 
          ${severityBorder[alarm.severity] || 'border-l-[var(--color-info)]'}
          ${isCritical && isActive ? 'animate-pulse-glow' : ''}
          hover:bg-[var(--color-bg-tertiary)] transition-all duration-200 animate-slide-up`}
      >
        <div className={compact ? 'p-3' : 'p-4'}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-[var(--color-text-primary)] leading-tight ${compact ? 'text-sm' : 'text-base'}`}>
                {alarm.title}
              </h3>
            </div>
            <StatusBadge severity={alarm.severity} size={compact ? 'sm' : 'md'} />
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
              {alarm.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
            {alarm.zoneName && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]"></span>
                {alarm.zoneName}
              </span>
            )}
            {alarm.deviceName && (
              <span>{alarm.deviceName}</span>
            )}
            <span className="tabular">
              {formatDistanceToNow(new Date(alarm.createdAt), { addSuffix: true, locale: localeId })}
            </span>
            {StatusIcon && (
              <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                <StatusIcon className="w-3 h-3" />
                {alarm.status}
              </span>
            )}
          </div>

          {/* Actions */}
          {isActive && (onAcknowledge || onResolve) && (
            <div className="flex gap-2">
              {onAcknowledge && (
                <button
                  onClick={() => setShowAckDialog(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--color-warning)] text-[var(--color-text-inverse)]
                    hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Acknowledge
                </button>
              )}
              {onResolve && (
                <button
                  onClick={() => setShowResolveDialog(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--color-brand)] text-white
                    hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={showAckDialog}
        title="Acknowledge Alarm?"
        description={`Anda akan meng-acknowledge alarm: "${alarm.title}". Aksi ini menandakan operator sudah mengetahui alarm ini.`}
        confirmLabel="Ya, Acknowledge"
        confirmColor="warning"
        onConfirm={() => { onAcknowledge?.(alarm.id); setShowAckDialog(false); }}
        onCancel={() => setShowAckDialog(false)}
      />
      <ConfirmDialog
        open={showResolveDialog}
        title="Resolve Alarm?"
        description={`Anda akan menyelesaikan alarm: "${alarm.title}". Pastikan kondisi sudah aman sebelum resolve.`}
        confirmLabel="Ya, Resolve"
        confirmColor="success"
        onConfirm={() => { onResolve?.(alarm.id); setShowResolveDialog(false); }}
        onCancel={() => setShowResolveDialog(false)}
      />
    </>
  );
}
