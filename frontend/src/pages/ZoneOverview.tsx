import ZoneCard from '../components/ui/ZoneCard';
import { mockZones, mockDevices, mockAlarms } from '../services/mockData';

export default function ZoneOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Zone Overview</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Status semua zona area pabrik PT Pupuk Kujang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockZones.map(zone => {
          const zoneDevices = mockDevices.filter(d => d.zoneId === zone.id);
          const zoneAlarms = mockAlarms.filter(a => a.zoneId === zone.id);
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
  );
}
