"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Wraps each main page section with the standard padding + entrance fade-up
 * used across the app. Keep the markup simple so children can lay out their
 * own internal grids.
 */
export function PageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("px-4 sm:px-6 md:px-8 py-4 sm:py-6", className)}
    >
      {children}
    </motion.section>
  );
}
