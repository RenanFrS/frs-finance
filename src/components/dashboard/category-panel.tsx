import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { Donut, type DonutSegment } from "@/components/dashboard/donut";

export function CategoryPanel({
  segments,
  totalLabel,
  totalValue,
  period,
}: {
  segments: DonutSegment[];
  totalLabel: string;
  totalValue: string;
  period: string;
}) {
  return (
    <Panel>
      <PanelHeader title="Por categoria" meta={period} />
      {segments.length === 0 ? (
        <div className="py-10 text-center text-[13px] text-muted-foreground">
          Crie categorias e registre movimentos para ver a distribuição.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Donut
            segments={segments}
            centerLabel={totalLabel}
            centerValue={totalValue}
          />
          <ul className="grid gap-2 flex-1 w-full font-body text-[13px]">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-foreground/85">{s.label}</span>
                <span className="ml-auto font-mono tabular-nums text-foreground">
                  {s.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
