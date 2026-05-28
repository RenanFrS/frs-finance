"use client";

import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { Sparkline } from "@/components/dashboard/sparkline";
import { brl } from "@/lib/format";

export function EquityPanel({
  values,
  min,
  max,
  mid,
  periodLabel,
}: {
  values: number[];
  min: number;
  max: number;
  mid: number;
  periodLabel: string;
}) {
  const hasData = values.length > 1 && (max - min > 0.01 || values.some((v) => v !== 0));

  return (
    <Panel>
      <PanelHeader title="Patrimônio · evolução" meta={periodLabel} />
      <div className="pt-2 min-h-[120px]">
        {hasData ? (
          <Sparkline data={values} />
        ) : (
          <div className="py-10 text-center text-[13px] text-muted-foreground">
            {values.length === 0
              ? "Sem dados no período selecionado."
              : "Patrimônio estável no período — registre movimentos para ver a evolução."}
          </div>
        )}
      </div>
      {hasData && (
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground tracking-[0.1em]">
          <span>R$ {brl(min)}</span>
          <span>R$ {brl(mid)}</span>
          <span>R$ {brl(max)}</span>
        </div>
      )}
    </Panel>
  );
}
