import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AlarmList from './pages/AlarmList';
import DeviceManagement from './pages/DeviceManagement';
import ZoneOverview from './pages/ZoneOverview';
import EventLog from './pages/EventLog';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login — no layout */}
        <Route path="/login" element={<Login />} />

        {/* App routes — with layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alarms" element={<AlarmList />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/zones" element={<ZoneOverview />} />
          <Route path="/events" element={<EventLog />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
