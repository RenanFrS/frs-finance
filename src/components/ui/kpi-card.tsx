"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type TrendKind = "up" | "down" | "neutral";

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: React.ReactNode;
  trendKind?: TrendKind;
  className?: string;
  /** Optional index used by the parent grid to stagger the entrance. */
  index?: number;
}

const TREND_TONE: Record<TrendKind, string> = {
  up: "text-positive",
  down: "text-negative",
  neutral: "text-muted-foreground",
};

export function KpiCard({
  label,
  value,
  suffix,
  trend,
  trendKind = "neutral",
  className,
  index = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.04 * index,
      }}
      className={cn(
        "rounded-[18px] border border-border bg-card p-[18px] grid gap-2 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-[26px] font-medium tabular-nums tracking-tight text-foreground leading-none">
        {value}
        {suffix && (
          <span className="text-muted-foreground text-[16px]">{suffix}</span>
        )}
      </span>
      {trend && (
        <span
          className={cn(
            "font-mono text-[11px] tracking-[0.04em]",
            TREND_TONE[trendKind],
          )}
        >
          {trend}
        </span>
      )}
    </motion.div>
  );
}
