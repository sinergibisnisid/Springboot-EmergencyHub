import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Cpu,
  MapPin,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alarms', icon: Bell, label: 'Alarms' },
  { to: '/devices', icon: Cpu, label: 'Devices' },
  { to: '/zones', icon: MapPin, label: 'Zones' },
  { to: '/events', icon: ScrollText, label: 'Event Log' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col bg-[var(--color-bg-card)] border-r border-[var(--color-border)] transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 h-16 border-b border-[var(--color-border)] ${collapsed ? 'px-4 justify-center' : 'px-5'}`}>
        <div className="w-9 h-9 rounded-lg bg-[var(--color-brand)] flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-[13px] font-bold text-[var(--color-text-primary)] leading-tight">
              Emergency Hub
            </h1>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              PT Pupuk Kujang
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <p className={`section-label mb-3 ${collapsed ? 'text-center text-[9px]' : 'px-3'}`}>
          {collapsed ? '•••' : 'Menu'}
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg transition-all duration-200 group
              ${collapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5'}
              ${isActive
                ? 'bg-[var(--color-brand-dim)] text-[var(--color-brand-light)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--color-brand)]" />
                )}
                <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} />
                {!collapsed && (
                  <span className="text-[13px] font-medium">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-11 border-t border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
