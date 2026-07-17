import { useState } from 'react';
import { Bell, Search, Filter } from 'lucide-react';
import AlarmCard from '../components/ui/AlarmCard';
import { mockAlarms } from '../services/mockData';
import type { Alarm, AlarmSeverity, AlarmStatus } from '../types';

export default function AlarmList() {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [filterStatus, setFilterStatus] = useState<AlarmStatus | 'ALL'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<AlarmSeverity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = alarms
    .filter(a => filterStatus === 'ALL' || a.status === filterStatus)
    .filter(a => filterSeverity === 'ALL' || a.severity === filterSeverity)
    .filter(a =>
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.deviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const statusOrder = { ACTIVE: 0, ACKNOWLEDGED: 1, RESOLVED: 2, CLOSED: 3 };
      const sevOrder = { CRITICAL: 0, EMERGENCY: 1, WARNING: 2, INFO: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    });

  const handleAcknowledge = (id: string) => {
    setAlarms(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: 'operator', acknowledgedAt: new Date().toISOString() } : a
    ));
  };

  const handleResolve = (id: string) => {
    setAlarms(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a
    ));
  };

  const statusCounts = {
    ALL: alarms.length,
    ACTIVE: alarms.filter(a => a.status === 'ACTIVE').length,
    ACKNOWLEDGED: alarms.filter(a => a.status === 'ACKNOWLEDGED').length,
    RESOLVED: alarms.filter(a => a.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Alarm Management</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Monitor, acknowledge, dan resolve alarm</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-critical-dim)]">
          <Bell className="w-4 h-4 text-[var(--color-critical)]" />
          <span className="tabular text-sm font-bold text-[var(--color-critical)]">{statusCounts.ACTIVE}</span>
          <span className="text-xs text-[var(--color-text-muted)]">active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Cari alarm, device, atau zona..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)]
              text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
              focus:outline-none focus:border-[var(--color-brand)] transition-colors"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-bg-card)]">
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer
                ${filterStatus === status
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                }`}
            >
              {status} ({statusCounts[status] ?? 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value as AlarmSeverity | 'ALL')}
            className="text-sm rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)]
              text-[var(--color-text-primary)] px-3 py-1.5 focus:outline-none focus:border-[var(--color-brand)]"
          >
            <option value="ALL">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Alarm list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Tidak ada alarm yang sesuai filter</p>
          </div>
        ) : (
          filtered.map(alarm => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onAcknowledge={alarm.status === 'ACTIVE' ? handleAcknowledge : undefined}
              onResolve={alarm.status === 'ACTIVE' || alarm.status === 'ACKNOWLEDGED' ? handleResolve : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
