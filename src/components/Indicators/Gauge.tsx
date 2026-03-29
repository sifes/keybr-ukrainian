"use client";

import { memo } from "react";

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  delta?: number;
}

export const Gauge = memo(function Gauge({ value, max, label, unit, color, delta }: GaugeProps) {
  const radius = 38;
  const strokeWidth = 8;
  const cx = 50;
  const cy = 48;

  // Semicircle arc length
  const arcLength = Math.PI * radius;
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const dashOffset = arcLength * (1 - fraction);

  // Single semicircle path from left to right, going over the top
  // M left → A arc to right, sweep=0 (counter-clockwise in SVG = visually upward)
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 58" className="w-28 h-16">
        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="var(--gauge-bg)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value arc — same path, clipped via dasharray */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={dashOffset}
          className="transition-all duration-500 ease-out"
        />
        {/* Value */}
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          fontSize="15" fontWeight="700"
          fontFamily="monospace"
          fill="var(--text-main)"
        >
          {Math.round(value)}
        </text>
        {/* Unit */}
        <text
          x={cx} y={cy + 6}
          textAnchor="middle"
          fontSize="7"
          fill="var(--text-dim)"
        >
          {unit}
        </text>
      </svg>
      <div className="flex items-center gap-1 text-xs -mt-1">
        <span className="text-[var(--text-dim)]">{label}</span>
        {delta !== undefined && delta !== 0 && (
          <span style={{ color: delta > 0 ? "var(--text-hit)" : "var(--text-miss)" }}>
            {delta > 0 ? "+" : ""}{Math.round(delta)}
          </span>
        )}
      </div>
    </div>
  );
});
