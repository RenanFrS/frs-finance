"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TenantSwitcher } from "@/components/dashboard/tenant-switcher";
import { useSidebar, SIDEBAR_W } from "@/components/app-shell/sidebar-provider";
import { NAV } from "@/components/app-shell/nav-config";
import { cn } from "@/lib/utils";

/**
 * Desktop sidebar. Renders inside the page grid using --sidebar-w to reserve
 * its column. When the user pins it collapsed, hovering peeks an overlay back
 * to full width without shifting the rest of the layout.
 */
export function Sidebar() {
  const { mode, isPeeked, setPeeked, togglePinned } = useSidebar();
  const isExpanded = mode === "expanded" || isPeeked;
  const isOverlayPeek = mode === "collapsed" && isPeeked;

  return (
    <>
      {/* Fixed-width gutter that always reserves layout space. */}
      <aside
        aria-label="Navegação principal"
        className="hidden lg:block sticky top-0 self-start h-screen z-30 border-r border-border bg-secondary"
        style={{
          width: SIDEBAR_W[mode],
          transition: "width 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onMouseEnter={() => mode === "collapsed" && setPeeked(true)}
        onMouseLeave={() => setPeeked(false)}
      >
        <motion.div
          layout
          className={cn(
            "h-full flex flex-col",
            isOverlayPeek
              ? "absolute top-0 left-0 z-40 bg-secondary border-r border-border shadow-vintage"
              : "relative",
          )}
          style={{
            width: isExpanded ? SIDEBAR_W.expanded : SIDEBAR_W.collapsed,
            transition: "width 280ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <SidebarContent
            isExpanded={isExpanded}
            mode={mode}
            togglePinned={togglePinned}
          />
        </motion.div>
      </aside>
    </>
  );
}

export function SidebarContent({
  isExpanded,
  mode,
  togglePinned,
  onNavigate,
}: {
  isExpanded: boolean;
  mode: "expanded" | "collapsed";
  togglePinned: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex flex-col h-full p-3 gap-4 min-h-0">
        {/* Brand + pin button */}
        <div
          className={cn(
            "flex items-center gap-2 pb-3 border-b border-border min-h-[44px]",
            isExpanded ? "justify-between px-1" : "justify-center",
          )}
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-2.5 min-w-0"
          >
            <span
              className="shrink-0 logo-mark text-foreground"
              style={{ width: 32, height: 24 }}
              aria-label="FrS Finance"
            />
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  key="word"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18 }}
                  className="font-display font-semibold text-[15px] tracking-tight text-foreground whitespace-nowrap"
                >
                  <span className="ml-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium">
                    FINANCE
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {isExpanded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={togglePinned}
                  aria-label={mode === "expanded" ? "Recolher sidebar" : "Fixar sidebar aberto"}
                  className="grid place-items-center size-8 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {mode === "expanded" ? (
                    <PanelLeftClose className="size-4" />
                  ) : (
                    <PanelLeftOpen className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="mono-meta">
                {mode === "expanded" ? "Recolher (passe o mouse p/ ver)" : "Fixar aberto"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Tenant switcher */}
        {isExpanded ? (
          <TenantSwitcher />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Tenant ativo · ACME"
                className="mx-auto size-9 rounded-[10px] grid place-items-center font-display font-bold text-[12px] bg-primary text-primary-foreground"
              >
                AC
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="mono-meta">
              Tenant · ACME
            </TooltipContent>
          </Tooltip>
        )}

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto -mr-2 pr-2 flex flex-col gap-5">
          {NAV.map((group) => (
            <div key={group.group}>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`${group.group}-label`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mono-meta text-muted-foreground text-[9px] tracking-[0.22em] mb-2 px-3 overflow-hidden"
                  >
                    {group.group}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid gap-px">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const itemEl = (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center rounded-[10px] transition-colors text-[14px]",
                        isExpanded
                          ? "px-3 py-2.5 gap-3 justify-between"
                          : "size-10 mx-auto justify-center",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/85 hover:bg-accent/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-3",
                          !isExpanded && "justify-center",
                        )}
                      >
                        <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -4 }}
                              transition={{ duration: 0.15 }}
                              className="whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      {isExpanded && item.count && (
                        <span
                          className={cn(
                            "font-mono text-[10px]",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                  if (isExpanded) return <React.Fragment key={item.href}>{itemEl}</React.Fragment>;
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{itemEl}</TooltipTrigger>
                      <TooltipContent side="right" className="mono-meta">
                        {item.name}
                        {item.count && <span className="ml-2 opacity-60">{item.count}</span>}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* WhatsApp footer card */}
        <div
          className={cn(
            "rounded-[14px] border border-border bg-background transition-all",
            isExpanded ? "p-3.5" : "p-2 grid place-items-center",
          )}
        >
          {isExpanded ? (
            <>
              <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.22em] flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                WhatsApp · Em breve
              </div>
              <div className="text-[13px] text-foreground/85 italic mt-1.5 leading-tight">
                Integração planejada
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Acompanhe os registros em /whatsapp
              </div>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="size-8 rounded-[10px] grid place-items-center bg-secondary text-muted-foreground">
                  <MessageCircle className="size-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="mono-meta">
                WhatsApp · em breve
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {mode === "collapsed" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={togglePinned}
                aria-label="Fixar sidebar aberto"
                className="grid place-items-center size-9 rounded-[10px] mx-auto text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <PanelLeftOpen className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="mono-meta">
              Fixar aberto
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
