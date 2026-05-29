"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { globalSearch, type SearchHit } from "@/lib/actions/search";
import { cn } from "@/lib/utils";

export function GlobalSearchTrigger() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden xl:flex items-center gap-2.5 rounded-full border border-border bg-secondary px-3.5 py-[7px] min-w-[240px] hover:border-foreground/30 transition-colors"
        aria-label="Buscar"
      >
        <Search className="size-3.5 text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground flex-1 truncate text-left">
          Buscar movimento, conta...
        </span>
        <span className="font-mono text-[10px] text-muted-foreground border border-border rounded-[6px] px-2 py-0.5 leading-none">
          ⌘K
        </span>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="xl:hidden grid place-items-center size-9 rounded-full border border-border bg-secondary hover:border-foreground/30 transition-colors"
        aria-label="Buscar"
      >
        <Search className="size-4 text-muted-foreground" />
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [hits, setHits] = React.useState<SearchHit[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Reset the search box when the dialog closes. Adjusting state during
  // render (instead of in an effect) avoids a cascading re-render.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setQuery("");
      setHits([]);
    }
  }

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    let active = true;
    const handle = setTimeout(() => {
      setLoading(true);
      globalSearch(query)
        .then((r) => {
          if (active) setHits(r);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 180);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query]);

  // Hide any stale results until the query is long enough to search.
  const visibleHits = query.trim().length < 2 ? [] : hits;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0">
        <DialogTitle className="sr-only">Busca global</DialogTitle>
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Movimentos, contas, categorias…"
            className="flex-1 bg-transparent border-0 outline-none text-[15px] placeholder:text-muted-foreground"
          />
          <span className="font-mono text-[10px] text-muted-foreground border border-border rounded-[6px] px-2 py-0.5 leading-none">
            ESC
          </span>
        </div>
        <div className="max-h-[420px] overflow-y-auto py-2">
          {query.trim().length < 2 && (
            <div className="px-4 py-6 text-[13px] text-muted-foreground text-center">
              Digite ao menos 2 caracteres para buscar.
            </div>
          )}
          {query.trim().length >= 2 && !loading && visibleHits.length === 0 && (
            <div className="px-4 py-6 text-[13px] text-muted-foreground text-center">
              Nada encontrado para “{query}”.
            </div>
          )}
          {visibleHits.map((h) => (
            <a
              key={`${h.kind}-${h.id}`}
              href={h.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/40",
              )}
            >
              <span className="size-7 rounded-[8px] grid place-items-center bg-secondary text-foreground font-display font-bold text-[12px]">
                {h.kind === "movement"
                  ? "M"
                  : h.kind === "account"
                    ? "C"
                    : "T"}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] text-foreground truncate">
                  {h.title}
                </span>
                <span className="block mono-meta text-muted-foreground text-[9px] tracking-[0.15em] truncate">
                  {h.meta}
                </span>
              </span>
              {h.kind === "movement" && (
                <span
                  className={cn(
                    "font-mono text-[12px] tabular-nums",
                    h.amount >= 0 ? "text-positive" : "text-foreground",
                  )}
                >
                  {h.amount >= 0 ? "+" : "−"}R${" "}
                  {Math.abs(h.amount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
              {h.kind === "account" && (
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                  R${" "}
                  {h.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              )}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
