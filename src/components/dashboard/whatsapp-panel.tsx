import { Panel, PanelHeader } from "@/components/dashboard/panel";

export type WhatsAppEntry = {
  id: string;
  initials: string;
  text: string;
  time: string;
};

export function WhatsAppPanel({ items }: { items: WhatsAppEntry[] }) {
  return (
    <Panel>
      <PanelHeader title="Via WhatsApp">
        <span className="flex items-center gap-1.5 mono-meta text-muted-foreground text-[10px] tracking-[0.18em]">
          <span className="size-1.5 rounded-full bg-muted-foreground" />
          {items.length > 0 ? "AO VIVO" : "AGUARDANDO"}
        </span>
      </PanelHeader>
      {items.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-muted-foreground">
          Conecte o bot para ver os registros aqui.
        </div>
      ) : (
        <div className="grid">
          {items.map((w, i) => (
            <div
              key={w.id}
              className={`grid grid-cols-[32px_1fr] gap-3 py-2.5 items-center ${
                i < items.length - 1 ? "border-b border-dashed border-border" : ""
              }`}
            >
              <div
                className="size-8 rounded-full grid place-items-center font-mono text-[11px] font-medium"
                style={{
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                }}
              >
                {w.initials}
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[13px] text-foreground truncate">
                  {w.text}
                </div>
                <div className="mono-meta text-muted-foreground text-[9px] tracking-[0.15em] mt-0.5">
                  {w.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
