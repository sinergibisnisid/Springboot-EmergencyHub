import { useEffect, useState } from 'react';
import { Bell, Search, CheckCircle2, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface TopbarProps {
  criticalCount: number;
  activeAlarms: number;
}

export default function Topbar({ criticalCount, activeAlarms }: TopbarProps) {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  });

  const systemHealthy = criticalCount === 0;

  return (
    <header className="h-16 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-6">
      {/* Left: Greeting + Clock */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            Halo, <span className="font-semibold text-[var(--color-text-primary)]">Operator</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="tabular text-lg font-bold text-[var(--color-text-primary)]">
              {formattedTime}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex items-center max-w-sm flex-1 mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search alarms, devices..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]
              text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
              focus:outline-none focus:border-[var(--color-brand)] transition-colors"
          />
        </div>
      </div>

      {/* Right: Status + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* System Status */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          ${systemHealthy
            ? 'bg-[var(--color-normal-dim)] text-[var(--color-normal)]'
            : 'bg-[var(--color-critical-dim)] text-[var(--color-critical)]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {systemHealthy ? 'System Normal' : `${criticalCount} Critical`}
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" />
          {activeAlarms > 0 && (
            <span className={`absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white
              ${criticalCount > 0 ? 'bg-[var(--color-critical)] animate-pulse-critical' : 'bg-[var(--color-warning)]'}`}>
              {activeAlarms > 9 ? '9+' : activeAlarms}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark'
            ? <Sun className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" />
            : <Moon className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" />
          }
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-[var(--color-border)]" />

        {/* User */}
        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-medium text-[var(--color-text-primary)] leading-tight">Akbar</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Operator</p>
          </div>
        </button>
      </div>
    </header>
  );
}
