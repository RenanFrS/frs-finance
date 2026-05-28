"use client";

import * as React from "react";

type SidebarMode = "expanded" | "collapsed";

type SidebarState = {
  mode: SidebarMode;
  isPeeked: boolean;
  mobileOpen: boolean;
  togglePinned: () => void;
  setPeeked: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarState | undefined>(undefined);

const STORAGE_KEY = "frs.sidebar.mode";

function readStored(): SidebarMode {
  if (typeof window === "undefined") return "expanded";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "collapsed" ? "collapsed" : "expanded";
}

export const SIDEBAR_W = {
  expanded: 240,
  collapsed: 68,
} as const;

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<SidebarMode>(() => readStored());
  const [isPeeked, setPeeked] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      `${SIDEBAR_W[mode]}px`,
    );
  }, [mode]);

  const togglePinned = React.useCallback(() => {
    setMode((prev) => {
      const next: SidebarMode = prev === "expanded" ? "collapsed" : "expanded";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      isPeeked,
      mobileOpen,
      togglePinned,
      setPeeked,
      setMobileOpen,
    }),
    [mode, isPeeked, mobileOpen, togglePinned],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
