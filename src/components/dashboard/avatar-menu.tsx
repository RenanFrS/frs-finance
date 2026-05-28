"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { useTheme, type Palette } from "@/components/theme/theme-provider";
import { useSession } from "@/components/app-shell/session-provider";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const PALETTES: { value: Palette; label: string; swatch: string }[] = [
  { value: "terracota", label: "Terracota", swatch: "oklch(0.48 0.135 45)" },
  { value: "bordo", label: "Bordô", swatch: "oklch(0.40 0.115 22)" },
  { value: "verde", label: "Verde", swatch: "oklch(0.36 0.05 165)" },
];

export function AvatarMenu() {
  const { user, tenant, role } = useSession();
  const { theme, palette, setTheme, setPalette } = useTheme();
  const [pending, startTransition] = React.useTransition();

  const name = `${user.firstName} ${user.lastName}`.trim();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Perfil de ${name}`}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring/40"
        >
          <InitialsAvatar
            name={name}
            size="md"
            halo
            style={{ width: 38, height: 38, fontSize: 14 }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] p-4">
        <div className="flex items-center gap-3 pb-3 border-b border-dashed border-border">
          <InitialsAvatar
            name={name}
            size="md"
            style={{ width: 40, height: 40, fontSize: 14 }}
          />
          <div className="min-w-0">
            <div className="font-display font-semibold text-[15px] text-foreground truncate">
              {name || "Sem nome"}
            </div>
            <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.18em] truncate">
              {user.email}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.2em] mb-1.5">
            Tenant ativo
          </div>
          <div className="flex items-center justify-between rounded-[12px] bg-primary/10 border border-primary/30 px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-body text-[13px] text-primary font-medium truncate">
                {tenant.name}
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.18em] text-primary shrink-0 ml-2">
              {role}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.2em] mb-2">
            Aparência
          </div>

          <div className="grid gap-2.5">
            <Segmented
              label="Tema"
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
            <div>
              <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.18em] mb-1.5">
                Paleta
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {PALETTES.map((p) => {
                  const isActive = p.value === palette;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPalette(p.value)}
                      className={cn(
                        "rounded-[10px] border p-2 flex flex-col items-center gap-1.5 transition-colors",
                        isActive
                          ? "border-foreground bg-secondary"
                          : "border-border bg-background hover:bg-accent/40",
                      )}
                    >
                      <span
                        className="size-[22px] rounded-full"
                        style={{
                          background: p.swatch,
                          boxShadow: "inset 0 0 0 2px var(--background)",
                        }}
                      />
                      <span
                        className={cn(
                          "font-mono text-[9px] tracking-[0.1em] uppercase",
                          isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground",
                        )}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-0.5">
          <a
            href="/preferencias"
            className="block w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-body transition-colors hover:bg-accent/40 text-foreground/85"
          >
            Preferências
          </a>
          <div className="pt-2 mt-1.5 border-t border-dashed border-border">
            <button
              type="button"
              onClick={handleLogout}
              disabled={pending}
              className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-[10px] text-[13px] font-body transition-colors hover:bg-destructive/10 text-destructive disabled:opacity-50"
            >
              <LogOut className="size-3.5" />
              {pending ? "Saindo…" : "Sair"}
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.18em] mb-1.5">
        {label}
      </div>
      <div className="flex rounded-full bg-background border border-border p-[3px]">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "flex-1 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] py-1.5 transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
