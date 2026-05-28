import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { FrsBadge } from "@/components/common/frs-badge";
import { cn } from "@/lib/utils";

export type RecentMovement = {
  id: string;
  letter: string;
  catBg: string;
  catFg: string;
  description: string;
  meta: string;
  date: string;
  amount: number;
  reconciled: boolean;
};

export function MovementsPanel({
  items,
  total,
}: {
  items: RecentMovement[];
  total: number;
}) {
  return (
    <Panel>
      <PanelHeader title="Movimentos recentes" meta={`${total} no total`} />

      {items.length === 0 ? (
        <div className="py-10 text-center text-[13px] text-muted-foreground">
          Nenhum movimento registrado ainda.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[24px_1fr_90px_120px_90px] gap-3 py-2 border-b border-foreground/80 mono-meta text-muted-foreground text-[9px] tracking-[0.2em]">
            <span />
            <span>Descrição</span>
            <span className="text-right">Data</span>
            <span className="text-right">Valor</span>
            <span className="text-right">Status</span>
          </div>

          {items.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-[24px_1fr_90px_120px_90px] gap-3 py-3 border-b border-dashed border-border last:border-b-0 items-center"
            >
              <div
                className="size-[22px] rounded-full grid place-items-center font-display font-semibold text-[11px]"
                style={{ background: m.catBg, color: m.catFg }}
              >
                {m.letter}
              </div>
              <div className="min-w-0">
                <div className="text-foreground text-[14px] truncate">
                  {m.description}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-[0.1em] uppercase mt-0.5 truncate">
                  {m.meta}
                </div>
              </div>
              <span className="font-mono text-[12px] tabular-nums text-muted-foreground text-right">
                {m.date}
              </span>
              <span
                className={cn(
                  "font-mono text-[14px] tabular-nums text-right",
                  m.amount >= 0 ? "text-positive" : "text-foreground",
                )}
              >
                {m.amount >= 0 ? "+" : "−"}R${" "}
                {Math.abs(m.amount).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <div className="flex justify-end">
                <FrsBadge variant={m.reconciled ? "positive" : "default"}>
                  {m.reconciled ? "✓ conc." : "● pend."}
                </FrsBadge>
              </div>
            </div>
          ))}
        </>
      )}
    </Panel>
  );
}
