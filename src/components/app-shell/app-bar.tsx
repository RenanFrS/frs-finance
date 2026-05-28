"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { AvatarMenu } from "@/components/dashboard/avatar-menu";
import { SidebarMobileTrigger } from "@/components/app-shell/sidebar-mobile-trigger";
import { GlobalSearchTrigger } from "@/components/app-shell/global-search";

export interface AppBarProps {
  crumb: string;
  title: string;
  titleEm: string;
  actions?: React.ReactNode;
}

export function AppBar({ crumb, title, titleEm, actions }: AppBarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3.5 sm:py-5 border-b border-dashed border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <SidebarMobileTrigger className="lg:hidden" />
        <div className="min-w-0">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-muted-foreground truncate">
            {crumb}
          </div>
          <h1 className="mt-0.5 sm:mt-1 font-display font-bold text-[20px] sm:text-[24px] md:text-[28px] leading-[1.1] tracking-[-0.01em] text-foreground">
            {title}{" "}
            <em className="not-italic font-normal italic text-primary">
              {titleEm}
            </em>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <GlobalSearchTrigger />
        {actions && (
          <div className="flex items-center gap-2 [&_button]:whitespace-nowrap">
            {actions}
          </div>
        )}
        <AvatarMenu />
      </div>
    </motion.header>
  );
}

export { Search };
