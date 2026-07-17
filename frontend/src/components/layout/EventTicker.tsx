import type { NormalizedEvent } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Radio } from 'lucide-react';

interface EventTickerProps {
  events: NormalizedEvent[];
}

const severityColor: Record<string, string> = {
  CRITICAL: 'text-[var(--color-critical)]',
  EMERGENCY: 'text-[var(--color-critical)]',
  WARNING: 'text-[var(--color-warning)]',
  INFO: 'text-[var(--color-text-muted)]',
};

export default function EventTicker({ events }: EventTickerProps) {
  const recentEvents = events.slice(0, 20);

  return (
    <div className="h-8 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] flex items-center overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 shrink-0 border-r border-[var(--color-border)]">
        <Radio className="w-3 h-3 text-[var(--color-brand)]" />
        <span className="text-[10px] font-semibold text-[var(--color-brand)] uppercase tracking-wider">Live</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex gap-8 animate-ticker whitespace-nowrap px-4">
          {[...recentEvents, ...recentEvents].map((event, i) => (
            <span key={`${event.id}-${i}`} className="flex items-center gap-2 text-[11px]">
              <span className={`font-semibold ${severityColor[event.severity] || 'text-[var(--color-text-muted)]'}`}>
                {event.severity === 'CRITICAL' ? '●' : event.severity === 'WARNING' ? '●' : '○'}
              </span>
              <span className="text-[var(--color-text-secondary)]">{event.deviceName}</span>
              <span className="text-[var(--color-text-muted)]">{event.eventType}</span>
              <span className="text-[var(--color-text-muted)] opacity-60">
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: localeId })}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
