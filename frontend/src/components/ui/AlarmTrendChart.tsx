interface AlarmTrendChartProps {
  data: number[];
  labels?: string[];
  height?: number;
}

export default function AlarmTrendChart({ data, labels, height = 120 }: AlarmTrendChartProps) {
  const max = Math.max(...data, 1);
  const width = 100;
  const barCount = data.length;
  const barWidth = width / barCount * 0.6;
  const gap = width / barCount * 0.4;

  return (
    <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="section-label">Alarm Trend (24 Jam)</span>
        <span className="text-xs text-[var(--color-text-muted)]">
          Total: <span className="tabular font-semibold text-[var(--color-text-primary)]">{data.reduce((s, v) => s + v, 0)}</span>
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(frac => (
          <line
            key={frac}
            x1="0" y1={height * (1 - frac)} x2={width} y2={height * (1 - frac)}
            stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="2 2"
          />
        ))}

        {/* Bars */}
        {data.map((val, i) => {
          const barH = (val / max) * (height - 20);
          const x = i * (barWidth + gap) + gap / 2;
          const y = height - barH;
          const color = val >= 5 ? 'var(--color-critical)' : val >= 3 ? 'var(--color-warning)' : 'var(--color-brand)';
          const opacity = val >= 5 ? 0.8 : val >= 3 ? 0.7 : 0.5;

          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barWidth} height={barH}
                rx="2" fill={color} opacity={opacity}
              />
              {/* Value label on top */}
              {val > 0 && (
                <text
                  x={x + barWidth / 2} y={y - 4}
                  textAnchor="middle" fontSize="5" fill="var(--color-text-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {labels && labels.map((label, i) => {
          const x = i * (barWidth + gap) + gap / 2 + barWidth / 2;
          return (
            <text
              key={i} x={x} y={height - 1}
              textAnchor="middle" fontSize="4" fill="var(--color-text-muted)"
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
