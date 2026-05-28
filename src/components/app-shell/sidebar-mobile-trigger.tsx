"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/app-shell/sidebar-provider";
import { SidebarContent } from "@/components/app-shell/sidebar";
import { cn } from "@/lib/utils";

export function SidebarMobileTrigger({ className }: { className?: string }) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir navegação"
          className={cn(
            "grid place-items-center size-10 rounded-[10px] border border-border bg-background hover:bg-secondary transition-colors",
            className,
          )}
        >
          <Menu className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[260px] p-0 bg-secondary border-r border-border"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navegação principal</SheetTitle>
        </SheetHeader>
        <SidebarContent
          isExpanded
          mode="expanded"
          togglePinned={() => {}}
          onNavigate={() => setMobileOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
