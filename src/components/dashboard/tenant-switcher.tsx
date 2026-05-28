"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FrsBadge } from "@/components/common/frs-badge";
import { useSession } from "@/components/app-shell/session-provider";
import { switchTenantAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

function short(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

export function TenantSwitcher() {
  const { tenant, tenants } = useSession();
  const [pending, startTransition] = React.useTransition();

  function pick(tenantId: string) {
    if (tenantId === tenant.id) return;
    startTransition(async () => {
      await switchTenantAction(tenantId);
    });
  }

  const activeShort = short(tenant.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-2.5 rounded-[14px] border border-border bg-background px-3 py-2.5 hover:bg-accent/40 transition-colors text-left",
          )}
        >
          <span
            className="size-7 rounded-[8px] grid place-items-center font-display font-bold text-[12px] bg-primary text-primary-foreground"
            aria-hidden
          >
            {activeShort}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-body text-[13px] text-foreground leading-tight font-medium truncate">
              {tenant.name}
            </span>
            <span className="block mono-meta text-muted-foreground text-[9px] tracking-[0.18em] mt-0.5 truncate">
              {tenant.slug}
            </span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">⇅</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[256px]">
        <DropdownMenuLabel className="mono-meta text-muted-foreground">
          Seus tenants
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tenants.map((t) => {
          const isActive = t.id === tenant.id;
          return (
            <DropdownMenuItem
              key={t.id}
              disabled={pending}
              onSelect={(e) => {
                e.preventDefault();
                pick(t.id);
              }}
              className={cn(
                "gap-2.5 px-2.5 py-2 rounded-[10px]",
                isActive && "bg-primary/10 border border-primary/30",
              )}
            >
              <span
                className={cn(
                  "size-9 rounded-[10px] grid place-items-center font-display font-bold text-[13px]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground",
                )}
              >
                {short(t.name)}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] text-foreground font-medium truncate">
                  {t.name}
                </span>
                <span className="block text-[11px] text-muted-foreground truncate">
                  {t.slug}
                </span>
              </span>
              <FrsBadge variant={isActive ? "primary" : "default"}>
                {t.role}
              </FrsBadge>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
