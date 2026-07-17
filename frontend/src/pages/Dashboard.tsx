import { useState } from 'react';
import { Bell, Cpu, AlertTriangle, Activity, Clock, Wifi } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import StatCard from '../components/ui/StatCard';
import AlarmCard from '../components/ui/AlarmCard';
import ZoneCard from '../components/ui/ZoneCard';
import WindCompass from '../components/ui/WindCompass';
import AlarmTrendChart from '../components/ui/AlarmTrendChart';
import StatusBadge from '../components/ui/StatusBadge';
import { mockAlarms, mockDevices, mockZones, mockEvents, mockWindData, computeStats } from '../services/mockData';
import type { Alarm, NormalizedEvent } from '../types';

// Simulated 24-hour alarm trend data
const trendData = [0, 1, 0, 0, 2, 1, 0, 0, 1, 3, 5, 7, 4, 3, 2, 1, 2, 3, 6, 4, 2, 1, 3, 5];
const trendLabels = ['00', '', '', '03', '', '', '06', '', '', '09', '', '', '12', '', '', '15', '', '', '18', '', '', '21', '', '23'];

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

  const onlineDevices = mockDevices.filter(d => d.status === 'ONLINE').length;
  const offlineDevices = mockDevices.filter(d => d.status !== 'ONLINE').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Command Center — PT Pupuk Kujang</p>
      </div>

      {/* ── KPI Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Alarms"
          value={stats.activeAlarms}
          icon={<Bell className="w-5 h-5" />}
          severity={stats.criticalCount > 0 ? 'CRITICAL' : stats.activeAlarms > 0 ? 'WARNING' : 'INFO'}
          breakdown={[
            { label: 'Critical', value: stats.criticalCount, color: 'var(--color-critical)' },
            { label: 'Warning', value: stats.warningCount, color: 'var(--color-warning)' },
          ]}
        />
        <StatCard
          label="Devices"
          value={`${onlineDevices}/${stats.devicesTotal}`}
          icon={<Cpu className="w-5 h-5" />}
          severity={offlineDevices > 0 ? 'WARNING' : 'INFO'}
          subtitle={`${offlineDevices} offline`}
          breakdown={[
            { label: 'Online', value: onlineDevices, color: 'var(--color-normal)' },
            { label: 'Offline', value: offlineDevices, color: 'var(--color-offline)' },
          ]}
        />
        <StatCard
          label="Avg Response"
          value="3.2m"
          icon={<Clock className="w-5 h-5" />}
          subtitle="Waktu rata-rata acknowledge"
        />
        <StatCard
          label="Network Health"
          value="96%"
          icon={<Wifi className="w-5 h-5" />}
          severity="INFO"
          subtitle={`${stats.eventsToday} events hari ini`}
        />
      </div>

      {/* ── Alarm Trend + Active Alarms ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart */}
        <div>
          <AlarmTrendChart data={trendData} labels={trendLabels} height={160} />
        </div>

        {/* Active Alarms — 1 col */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Active Alarms</span>
            <span className="tabular text-xs font-semibold text-[var(--color-text-secondary)]">{activeAlarms.length}</span>
          </div>
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {activeAlarms.length === 0 ? (
              <div className="text-center py-10 text-[var(--color-text-muted)]">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Tidak ada alarm aktif</p>
              </div>
            ) : (
              activeAlarms.slice(0, 5).map(alarm => (
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

      {/* ── Zone Overview ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="section-label">Zone Overview</span>
          <span className="text-xs text-[var(--color-text-muted)]">{mockZones.length} zones</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockZones.map(zone => {
            const zoneDevices = mockDevices.filter(d => d.zoneId === zone.id);
            const zoneAlarms = alarms.filter(a => a.zoneId === zone.id);
            return (
              <ZoneCard
                key={zone.id}
                zone={zone}
                devices={zoneDevices}
                alarms={zoneAlarms}
              />
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Wind + Recent Events ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Wind */}
        <WindCompass data={mockWindData} />

        {/* Recent Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">Recent Events</span>
            <span className="text-xs text-[var(--color-text-muted)]">{mockEvents.length} events</span>
          </div>
          <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-4 py-3 section-label">Time</th>
                  <th className="text-left px-4 py-3 section-label">Severity</th>
                  <th className="text-left px-4 py-3 section-label">Device</th>
                  <th className="text-left px-4 py-3 section-label hidden md:table-cell">Event</th>
                  <th className="text-left px-4 py-3 section-label hidden lg:table-cell">Zone</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.slice(0, 6).map((event: NormalizedEvent) => (
                  <tr key={event.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-hover)] transition-colors">
                    <td className="px-4 py-3 tabular text-xs text-[var(--color-text-muted)]">
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: localeId })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge severity={event.severity} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-[var(--color-text-primary)]">{event.deviceName}</td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-text-secondary)] hidden md:table-cell">{event.eventType}</td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-text-muted)] hidden lg:table-cell">{event.zoneName}</td>
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
