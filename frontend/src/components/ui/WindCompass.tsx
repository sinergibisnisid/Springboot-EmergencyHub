import type { WindData } from '../../types';
import { Wind } from 'lucide-react';

interface WindCompassProps {
  data: WindData;
}

const directionDegrees: Record<string, number> = {
  N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315,
};

export default function WindCompass({ data }: WindCompassProps) {
  const degrees = directionDegrees[data.direction] || 0;
  const isHighWind = data.speed > 25;
  const isCriticalWind = data.speed > 40;

  const statusColor = isCriticalWind
    ? 'var(--color-critical)'
    : isHighWind
      ? 'var(--color-warning)'
      : 'var(--color-normal)';

  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wind className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          Wind Status
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Compass SVG */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer circle */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="2" />
            <circle cx="50" cy="50" r="46" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.3" />

            {/* Cardinal directions */}
            {['N', 'E', 'S', 'W'].map((dir, i) => {
              const angle = i * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 50 + 38 * Math.cos(rad);
              const y = 50 + 38 * Math.sin(rad);
              return (
                <text key={dir} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fill="var(--color-text-muted)" fontSize="8" fontWeight="bold">
                  {dir}
                </text>
              );
            })}

            {/* Direction arrow */}
            <g transform={`rotate(${degrees}, 50, 50)`}>
              <line x1="50" y1="50" x2="50" y2="16" stroke={statusColor} strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="50,12 45,22 55,22" fill={statusColor} />
              <circle cx="50" cy="50" r="4" fill={statusColor} opacity="0.6" />
            </g>
          </svg>
        </div>

        {/* Wind info */}
        <div>
          <p className="tabular text-3xl font-bold" style={{ color: statusColor }}>
            {data.speed}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{data.unit}</p>
          <p className="text-lg font-semibold text-[var(--color-text-primary)] mt-1">{data.direction}</p>
          <p className={`text-xs font-semibold mt-1 ${
            isCriticalWind ? 'text-[var(--color-critical)]' : 
            isHighWind ? 'text-[var(--color-warning)]' : 
            'text-[var(--color-normal)]'
          }`}>
            {isCriticalWind ? '⚠ BAHAYA' : isHighWind ? '⚠ TINGGI' : '✓ NORMAL'}
          </p>
        </div>
      </div>
    </div>
  );
}
