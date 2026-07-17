import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ScrollText } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { mockEvents } from '../services/mockData';

export default function EventLog() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Event Log</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Riwayat semua event dari device</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-info-dim)]">
          <ScrollText className="w-4 h-4 text-[var(--color-info)]" />
          <span className="tabular text-sm font-bold text-[var(--color-info)]">{mockEvents.length}</span>
          <span className="text-xs text-[var(--color-text-muted)]">events</span>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3.5 section-label">Time</th>
              <th className="text-left px-5 py-3.5 section-label">Severity</th>
              <th className="text-left px-5 py-3.5 section-label">Device</th>
              <th className="text-left px-5 py-3.5 section-label">Protocol</th>
              <th className="text-left px-5 py-3.5 section-label">Event Type</th>
              <th className="text-left px-5 py-3.5 section-label hidden md:table-cell">Zone</th>
              <th className="text-left px-5 py-3.5 section-label hidden lg:table-cell">Payload</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents.map(event => (
              <tr key={event.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-hover)] transition-colors">
                <td className="px-5 py-3.5 tabular text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: localeId })}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge severity={event.severity} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--color-text-primary)]">{event.deviceName}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    event.protocol === 'MODBUS' ? 'bg-blue-500/10 text-blue-400' :
                    event.protocol === 'MQTT' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-teal-500/10 text-teal-400'
                  }`}>
                    {event.protocol}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--color-text-secondary)]">{event.eventType}</td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--color-text-muted)] hidden md:table-cell">{event.zoneName}</td>
                <td className="px-5 py-3.5 tabular text-[11px] text-[var(--color-text-muted)] max-w-[200px] truncate hidden lg:table-cell">
                  {JSON.stringify(event.payload)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
