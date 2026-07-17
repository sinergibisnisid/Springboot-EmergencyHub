import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import EventTicker from './EventTicker';
import { mockAlarms, mockEvents } from '../../services/mockData';

export default function AppLayout() {
  const activeAlarms = mockAlarms.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlarms.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY').length;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar />

      {/* Main area: min-w-0 prevents flex child from overflowing, overflow-x-hidden as safety net */}
      <div className="flex-1 min-w-0 ml-[240px] flex flex-col min-h-screen overflow-x-hidden">
        <Topbar criticalCount={criticalCount} activeAlarms={activeAlarms.length} />

        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <EventTicker events={mockEvents} />
      </div>
    </div>
  );
}
