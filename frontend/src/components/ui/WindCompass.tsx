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
      : 'var(--color-brand)';

  return (
    <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="section-label">Wind Status</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Compass SVG */}
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />

            {['N', 'E', 'S', 'W'].map((dir, i) => {
              const angle = i * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 50 + 36 * Math.cos(rad);
              const y = 50 + 36 * Math.sin(rad);
              return (
                <text key={dir} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fill="var(--color-text-muted)" fontSize="7" fontWeight="600">
                  {dir}
                </text>
              );
            })}

            <g transform={`rotate(${degrees}, 50, 50)`}>
              <line x1="50" y1="50" x2="50" y2="18" stroke={statusColor} strokeWidth="2" strokeLinecap="round" />
              <polygon points="50,14 46,24 54,24" fill={statusColor} />
              <circle cx="50" cy="50" r="3" fill={statusColor} opacity="0.5" />
            </g>
          </svg>
        </div>

        <div>
          <p className="tabular text-3xl font-bold" style={{ color: statusColor }}>
            {data.speed}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{data.unit}</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">{data.direction}</p>
          <p className={`text-[11px] font-medium mt-0.5 ${
            isCriticalWind ? 'text-[var(--color-critical)]' : isHighWind ? 'text-[var(--color-warning)]' : 'text-[var(--color-brand)]'
          }`}>
            {isCriticalWind ? '⚠ BAHAYA' : isHighWind ? '⚠ TINGGI' : '✓ NORMAL'}
          </p>
        </div>
      </div>
    </div>
  );
}
