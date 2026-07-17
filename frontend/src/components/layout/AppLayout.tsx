import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import EventTicker from './EventTicker';
import { mockAlarms, mockEvents } from '../../services/mockData';

export default function AppLayout() {
  const activeAlarms = mockAlarms.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlarms.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY').length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen transition-all duration-300">
        <Topbar criticalCount={criticalCount} activeAlarms={activeAlarms.length} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Event Ticker */}
        <EventTicker events={mockEvents} />
      </div>
    </div>
  );
}
