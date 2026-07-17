import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';

interface TopbarProps {
  criticalCount: number;
  activeAlarms: number;
}

export default function Topbar({ criticalCount, activeAlarms }: TopbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="h-16 glass flex items-center justify-between px-6 border-b border-[var(--color-border)]">
      {/* Left: Time */}
      <div className="flex items-center gap-4">
        <div>
          <span className="tabular text-2xl font-bold text-[var(--color-text-primary)]">
            {formattedTime}
          </span>
          <span className="ml-3 text-sm text-[var(--color-text-muted)]">{formattedDate}</span>
        </div>
      </div>

      {/* Right: Alarm counter + User */}
      <div className="flex items-center gap-4">
        {/* Alarm Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
            ${criticalCount > 0
              ? 'bg-[var(--color-critical-bg)] animate-pulse-critical'
              : activeAlarms > 0
                ? 'bg-[var(--color-warning-bg)]'
                : 'bg-[var(--color-normal-bg)]'
            }`}
        >
          <Bell
            className={`w-4 h-4 ${
              criticalCount > 0
                ? 'text-[var(--color-critical)]'
                : activeAlarms > 0
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-normal)]'
            }`}
          />
          <span
            className={`tabular text-sm font-bold ${
              criticalCount > 0
                ? 'text-[var(--color-critical)]'
                : activeAlarms > 0
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-normal)]'
            }`}
          >
            {activeAlarms}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">active</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Operator</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Command Center</p>
          </div>
        </div>
      </div>
    </header>
  );
}
