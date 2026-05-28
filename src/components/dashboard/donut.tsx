"use client";

import * as React from "react";
import { motion } from "motion/react";

export interface DonutSegment {
  /** Exact percentage 0..100 (may be fractional). */
  pct: number;
  color: string;
  label: string;
}

interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  stroke?: number;
  centerLabel: string;
  centerValue: string;
}

export function Donut({
  segments,
  size = 150,
  stroke = 14,
  centerLabel,
  centerValue,
}: DonutProps) {
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;

  // Re-normalize so the segments always tile the full circle (no rounding gap).
  const total = segments.reduce((s, x) => s + Math.max(0, x.pct), 0);
  const visible = total > 0
    ? segments
        .filter((s) => s.pct > 0)
        .map((s) => ({ ...s, pct: (s.pct / total) * 100 }))
    : [];

  const positioned = visible.reduce<
    Array<DonutSegment & { len: number; offset: number }>
  >((arr, s) => {
    const len = (s.pct / 100) * c;
    const offset =
      arr.length === 0
        ? 0
        : arr[arr.length - 1].offset + arr[arr.length - 1].len;
    arr.push({ ...s, len, offset });
    return arr;
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={centerLabel}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {positioned.map((s, i) => (
          <motion.circle
            key={`${s.label}-${i}`}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${s.len} ${c}`}
            initial={{ strokeDashoffset: -s.offset + s.len, opacity: 0 }}
            animate={{ strokeDashoffset: -s.offset, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.06 * i,
            }}
          />
        ))}
      </g>
      <motion.text
        x="50%"
        y="46%"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          fill: "var(--muted-foreground)",
          letterSpacing: "0.18em",
        }}
      >
        {centerLabel}
      </motion.text>
      <motion.text
        x="50%"
        y="62%"
        textAnchor="middle"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: 18,
          fontWeight: 600,
          fill: "var(--foreground)",
        }}
      >
        {centerValue}
      </motion.text>
    </svg>
  );
}
