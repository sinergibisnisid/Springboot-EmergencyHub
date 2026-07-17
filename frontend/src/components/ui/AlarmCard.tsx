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

  return (
    <>
      <div
        className={`rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] 
          ${isCritical && isActive ? 'border-l-[3px] border-l-[var(--color-critical)]' : ''}
          ${!isCritical && isActive ? 'border-l-[3px] border-l-[var(--color-warning)]' : ''}
          hover:bg-[var(--color-bg-elevated)] transition-colors duration-200`}
      >
        <div className={compact ? 'p-3.5' : 'p-5'}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`font-semibold text-[var(--color-text-primary)] leading-snug ${compact ? 'text-[13px]' : 'text-sm'}`}>
              {alarm.title}
            </h3>
            <StatusBadge severity={alarm.severity} size={compact ? 'sm' : 'md'} />
          </div>

          {/* Description */}
          {!compact && alarm.description && (
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-3 leading-relaxed">
              {alarm.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-text-muted)] mb-3">
            {alarm.zoneName && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
                {alarm.zoneName}
              </span>
            )}
            {alarm.deviceName && <span>{alarm.deviceName}</span>}
            <span className="tabular">
              {formatDistanceToNow(new Date(alarm.createdAt), { addSuffix: true, locale: localeId })}
            </span>
            {StatusIcon && (
              <span className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {alarm.status}
              </span>
            )}
          </div>

          {/* Actions */}
          {isActive && (onAcknowledge || onResolve) && (
            <div className="flex gap-2 pt-2">
              {onAcknowledge && (
                <button
                  onClick={() => setShowAckDialog(true)}
                  className="px-3.5 py-1.5 text-[12px] font-semibold rounded-lg border border-[var(--color-warning)] text-[var(--color-warning)]
                    hover:bg-[var(--color-warning-dim)] transition-colors cursor-pointer"
                >
                  Acknowledge
                </button>
              )}
              {onResolve && (
                <button
                  onClick={() => setShowResolveDialog(true)}
                  className="px-3.5 py-1.5 text-[12px] font-semibold rounded-lg border border-[var(--color-brand)] text-[var(--color-brand)]
                    hover:bg-[var(--color-brand-dim)] transition-colors cursor-pointer"
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showAckDialog}
        title="Acknowledge Alarm?"
        description={`Anda akan meng-acknowledge alarm: "${alarm.title}".`}
        confirmLabel="Ya, Acknowledge"
        confirmColor="warning"
        onConfirm={() => { onAcknowledge?.(alarm.id); setShowAckDialog(false); }}
        onCancel={() => setShowAckDialog(false)}
      />
      <ConfirmDialog
        open={showResolveDialog}
        title="Resolve Alarm?"
        description={`Anda akan menyelesaikan alarm: "${alarm.title}". Pastikan kondisi sudah aman.`}
        confirmLabel="Ya, Resolve"
        confirmColor="success"
        onConfirm={() => { onResolve?.(alarm.id); setShowResolveDialog(false); }}
        onCancel={() => setShowResolveDialog(false)}
      />
    </>
  );
}
