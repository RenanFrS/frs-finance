"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "rounded-[20px] border border-border bg-card p-4 sm:p-5 grid gap-3.5",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function PanelHeader({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 pb-2.5 border-b border-border">
      <h2 className="font-display font-semibold text-[18px] text-foreground m-0">
        {title}
      </h2>
      {children
        ? children
        : meta && (
            <span className="mono-meta text-muted-foreground text-[10px] tracking-[0.18em]">
              {meta}
            </span>
          )}
    </div>
  );
}
