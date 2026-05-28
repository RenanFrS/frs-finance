import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { FrsBadge } from "@/components/common/frs-badge";
import { BankMark } from "@/components/ui/bank-mark";

export type ConnectionSummary = {
  id: string;
  bankName: string;
  meta: string;
  badge: "positive" | "primary" | "negative";
  badgeText: string;
};

export function ConnectionsPanel({ items }: { items: ConnectionSummary[] }) {
  return (
    <Panel>
      <PanelHeader title="Conexões" meta={`${items.length} ativas`} />
      {items.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-muted-foreground">
          Nenhuma conexão registrada.
          <br />
          Vá em <span className="text-primary">Conexões</span> para adicionar.
        </div>
      ) : (
        <div className="grid gap-2.5">
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-[14px] border border-border bg-background px-4 py-3 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BankMark name={b.bankName} size={30} />
                <div className="min-w-0">
                  <div className="text-[14px] text-foreground truncate">
                    {b.bankName}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-[0.1em] uppercase truncate">
                    {b.meta}
                  </div>
                </div>
              </div>
              <FrsBadge variant={b.badge} dot>
                {b.badgeText}
              </FrsBadge>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
