import type { NormalizedEvent } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Activity } from 'lucide-react';

interface EventTickerProps {
  events: NormalizedEvent[];
}

const severityColor: Record<string, string> = {
  CRITICAL: 'text-[var(--color-critical)]',
  EMERGENCY: 'text-[var(--color-critical)]',
  WARNING: 'text-[var(--color-warning)]',
  INFO: 'text-[var(--color-normal)]',
};

export default function EventTicker({ events }: EventTickerProps) {
  const recentEvents = events.slice(0, 20);

  return (
    <div className="h-9 glass-light border-t border-[var(--color-border)] flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-3 shrink-0 border-r border-[var(--color-border)]">
        <Activity className="w-3.5 h-3.5 text-[var(--color-brand-light)]" />
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">LIVE</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {[...recentEvents, ...recentEvents].map((event, i) => (
            <span key={`${event.id}-${i}`} className="flex items-center gap-2 text-xs">
              <span className={`font-bold ${severityColor[event.severity] || 'text-[var(--color-text-muted)]'}`}>
                {event.severity}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {event.deviceName || event.deviceId}
              </span>
              <span className="text-[var(--color-text-muted)]">
                {event.eventType}
              </span>
              <span className="text-[var(--color-text-muted)]">
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: localeId })}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
