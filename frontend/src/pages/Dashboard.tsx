import { useState } from 'react';
import { Bell, Cpu, AlertTriangle, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import StatCard from '../components/ui/StatCard';
import AlarmCard from '../components/ui/AlarmCard';
import ZoneCard from '../components/ui/ZoneCard';
import WindCompass from '../components/ui/WindCompass';
import StatusBadge from '../components/ui/StatusBadge';
import { mockAlarms, mockDevices, mockZones, mockEvents, mockWindData, computeStats } from '../services/mockData';
import type { Alarm, NormalizedEvent } from '../types';

export default function Dashboard() {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const stats = computeStats(alarms, mockDevices);

  const activeAlarms = alarms
    .filter(a => a.status === 'ACTIVE')
    .sort((a, b) => {
      const order = { CRITICAL: 0, EMERGENCY: 1, WARNING: 2, INFO: 3 };
      return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Command Center — PT Pupuk Kujang</p>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Alarms"
          value={stats.activeAlarms}
          icon={<Bell className="w-5 h-5" />}
          severity={stats.criticalCount > 0 ? 'CRITICAL' : stats.activeAlarms > 0 ? 'WARNING' : 'INFO'}
          subtitle={`${stats.criticalCount} critical`}
        />
        <StatCard
          label="Critical"
          value={stats.criticalCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          severity={stats.criticalCount > 0 ? 'CRITICAL' : 'INFO'}
        />
        <StatCard
          label="Devices Online"
          value={`${stats.devicesOnline}/${stats.devicesTotal}`}
          icon={<Cpu className="w-5 h-5" />}
          severity={stats.devicesOnline < stats.devicesTotal ? 'WARNING' : 'INFO'}
          subtitle={`${stats.devicesTotal - stats.devicesOnline} offline`}
        />
        <StatCard
          label="Events Today"
          value={stats.eventsToday}
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* Main content: Zones + Active Alarms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Zone Status Grid — 2 cols */}
        <div className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Zone Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockZones.map(zone => {
              const zoneDevices = mockDevices.filter(d => d.zoneId === zone.id);
              const zoneAlarms = alarms.filter(a => a.zoneId === zone.id);
              return (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  deviceCount={zoneDevices.length}
                  alarms={zoneAlarms}
                />
              );
            })}
          </div>
        </div>

        {/* Active Alarms Panel — 1 col */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Active Alarms ({activeAlarms.length})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {activeAlarms.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada alarm aktif</p>
              </div>
            ) : (
              activeAlarms.map(alarm => (
                <AlarmCard
                  key={alarm.id}
                  alarm={alarm}
                  compact
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Wind + Recent Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Wind */}
        <WindCompass data={mockWindData} />

        {/* Recent Events */}
        <div className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Recent Events
          </h2>
          <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Time</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Severity</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Device</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Event</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Zone</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.slice(0, 8).map((event: NormalizedEvent) => (
                  <tr key={event.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                    <td className="px-4 py-2.5 tabular text-xs text-[var(--color-text-muted)]">
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: localeId })}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge severity={event.severity} size="sm" />
                    </td>
                    <td className="px-4 py-2.5 text-[var(--color-text-primary)] font-medium">{event.deviceName}</td>
                    <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{event.eventType}</td>
                    <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{event.zoneName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
