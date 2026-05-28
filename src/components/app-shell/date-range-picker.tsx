"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CalendarRange, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toDateInputValue } from "@/lib/format";
import { cn } from "@/lib/utils";

const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function fmt(input?: string | null): string {
  if (!input) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return input;
  return `${m[3]} ${MONTHS_SHORT[Number(m[2]) - 1]} ${m[1]}`;
}

export type RangePreset = {
  label: string;
  from: string;
  to: string;
};

function buildPresets(now: Date = new Date()): RangePreset[] {
  const today = toDateInputValue(now);
  const startOfMonth = toDateInputValue(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrev = new Date(now.getFullYear(), now.getMonth(), 0);
  const sevenAgo = new Date(now);
  sevenAgo.setDate(now.getDate() - 6);
  const thirtyAgo = new Date(now);
  thirtyAgo.setDate(now.getDate() - 29);
  const ninetyAgo = new Date(now);
  ninetyAgo.setDate(now.getDate() - 89);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  return [
    { label: "Últimos 7 dias", from: toDateInputValue(sevenAgo), to: today },
    { label: "Últimos 30 dias", from: toDateInputValue(thirtyAgo), to: today },
    { label: "Mês atual", from: startOfMonth, to: today },
    {
      label: "Mês passado",
      from: toDateInputValue(startOfPrev),
      to: toDateInputValue(endOfPrev),
    },
    { label: "Últimos 90 dias", from: toDateInputValue(ninetyAgo), to: today },
    { label: "Ano corrente", from: toDateInputValue(yearStart), to: today },
  ];
}

export function DateRangePicker({
  className,
  fromParam = "from",
  toParam = "to",
  /** Label shown when no range is active. Defaults to "Mês atual". */
  defaultLabel = "Mês atual",
}: {
  className?: string;
  fromParam?: string;
  toParam?: string;
  defaultLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const currentFrom = search.get(fromParam);
  const currentTo = search.get(toParam);

  const [open, setOpen] = React.useState(false);
  const [from, setFrom] = React.useState(currentFrom ?? "");
  const [to, setTo] = React.useState(currentTo ?? "");
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setFrom(currentFrom ?? "");
    setTo(currentTo ?? "");
  }, [currentFrom, currentTo]);

  const isActive = Boolean(currentFrom && currentTo);

  function commit(nextFrom: string | null, nextTo: string | null) {
    const params = new URLSearchParams(Array.from(search.entries()));
    if (nextFrom && nextTo) {
      params.set(fromParam, nextFrom);
      params.set(toParam, nextTo);
    } else {
      params.delete(fromParam);
      params.delete(toParam);
    }
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function apply() {
    if (!from || !to) return;
    if (from > to) {
      // swap if user picked reversed
      commit(to, from);
    } else {
      commit(from, to);
    }
    setOpen(false);
  }

  function clear() {
    setFrom("");
    setTo("");
    commit(null, null);
    setOpen(false);
  }

  function applyPreset(p: RangePreset) {
    setFrom(p.from);
    setTo(p.to);
    commit(p.from, p.to);
    setOpen(false);
  }

  const presets = React.useMemo(() => buildPresets(), []);

  const buttonLabel = isActive
    ? `${fmt(currentFrom)} → ${fmt(currentTo)}`
    : defaultLabel;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Selecionar período"
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 h-8 text-[11px] font-mono uppercase tracking-[0.14em] text-foreground hover:bg-secondary transition-colors disabled:opacity-50",
            isActive && "border-primary/40 text-primary",
            className,
          )}
        >
          <CalendarRange className="size-3.5" />
          <span className="hidden sm:inline">{buttonLabel}</span>
          <span className="sm:hidden">{isActive ? "Período ●" : "Período"}</span>
          {isActive && (
            <span
              role="button"
              aria-label="Limpar período"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }}
              className="grid place-items-center size-4 rounded-full hover:bg-primary/15 -mr-1"
            >
              <X className="size-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[320px] p-3 grid gap-3 bg-popover border border-border rounded-[14px] shadow-vintage"
      >
        <div className="grid gap-1">
          <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.18em]">
            Atalhos
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-left px-2.5 py-1.5 rounded-[8px] text-[12px] hover:bg-accent/40 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-border grid gap-2">
          <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.18em]">
            Personalizado
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1">
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
                De
              </span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-9 rounded-[8px] border border-input bg-card px-2.5 text-[13px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>
            <label className="grid gap-1">
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
                Até
              </span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-9 rounded-[8px] border border-input bg-card px-2.5 text-[13px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            disabled={!isActive && !from && !to}
          >
            Limpar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={apply}
            disabled={!from || !to}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
