import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { BankMark } from "@/components/ui/bank-mark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { CreateConnectionDialog } from "@/components/dialogs/create-connection-dialog";
import { requireSession } from "@/lib/session";
import { listConnections } from "@/lib/queries";
import { relativeAgo, shortDate } from "@/lib/format";

export const metadata = { title: "Conexões · FrS Finance" };
export const dynamic = "force-dynamic";

const SUGGESTED_BANKS = [
  "Nubank",
  "Itaú",
  "Inter",
  "C6 Bank",
  "Caixa",
  "BTG Pactual",
  "Banco do Brasil",
  "Santander",
  "Bradesco",
  "Sicoob",
  "XP",
];

export default async function ConexoesPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;
  const connections = await listConnections(tenantId);

  const activeCount = connections.filter((c) => c.active).length;
  const lastSync = connections
    .map((c) => c.lastSyncAt)
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const nextExpiry = connections
    .map((c) => c.consentExpiry)
    .filter((d): d is Date => !!d)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const cadastradas = new Set(connections.map((c) => c.bankName));
  const candidates = SUGGESTED_BANKS.filter((b) => !cadastradas.has(b));

  return (
    <>
      <AppBar
        crumb="Configuração · Conexões"
        title="Conexões"
        titleEm="bancárias"
        actions={<CreateConnectionDialog />}
      />

      <PageSection className="grid gap-5">
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Bancos conectados"
            value={`${activeCount}`}
            trend={activeCount > 0 ? "ativos" : "nenhum ativo"}
            trendKind={activeCount > 0 ? "up" : "neutral"}
          />
          <KpiCard
            index={1}
            label="Última sync"
            value={lastSync ? relativeAgo(lastSync) : "—"}
            trend={lastSync ? "automático" : "sem syncs ainda"}
            trendKind="neutral"
          />
          <KpiCard
            index={2}
            label="Conexões totais"
            value={`${connections.length}`}
            trend="incluindo inativas"
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label="Próxima renovação"
            value={nextExpiry ? shortDate(nextExpiry) : "—"}
            trend={nextExpiry ? "Open Finance" : "sem consentimento"}
            trendKind="neutral"
          />
        </div>

        <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
          <div className="flex items-baseline justify-between pb-3 border-b border-border">
            <h3 className="font-display font-semibold text-[18px]">
              Bancos conectados · {connections.length}
            </h3>
            <span className="mono-meta text-muted-foreground">
              Open Finance · escopos · expiração
            </span>
          </div>

          {connections.length === 0 ? (
            <div className="py-10 text-center grid gap-3 place-items-center">
              <p className="text-[14px] text-muted-foreground">
                Nenhuma conexão registrada.
              </p>
              <CreateConnectionDialog
                trigger={<Button size="sm">+ Conectar agora</Button>}
              />
            </div>
          ) : (
            <div className="grid gap-2.5">
              {connections.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border border-border rounded-2xl bg-background grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1.2fr_1fr_1fr_1fr_auto] gap-3 sm:gap-3.5 items-center transition-colors hover:border-foreground/30"
                >
                  <BankMark name={c.bankName} size={32} />
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-[16px] truncate">
                      {c.bankName}
                    </div>
                    <div className="mono-meta text-muted-foreground mt-0.5 truncate">
                      {c._count.accounts > 0
                        ? `${c._count.accounts} ${c._count.accounts === 1 ? "conta" : "contas"} vinculadas`
                        : "sem contas vinculadas"}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="mono-meta text-muted-foreground">Última sync</div>
                    <div className="font-mono tabular-nums mt-0.5">
                      {c.lastSyncAt ? relativeAgo(c.lastSyncAt) : "—"}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="mono-meta text-muted-foreground">Consentimento</div>
                    <div className="font-mono tabular-nums mt-0.5">
                      {c.consentExpiry ? shortDate(c.consentExpiry) : "—"}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="mono-meta text-muted-foreground">Escopos</div>
                    <div className="text-[12.5px] mt-0.5 truncate">
                      {c.scopes.length ? c.scopes.join(" · ") : "—"}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant={c.active ? "positive" : "default"}>
                      ● {c.active ? "ativo" : "inativo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {candidates.length > 0 && (
          <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
            <div className="flex items-baseline justify-between pb-3 border-b border-border">
              <h3 className="font-display font-semibold text-[18px]">
                Disponíveis para conectar
              </h3>
              <span className="mono-meta text-muted-foreground">
                Open Finance · BR
              </span>
            </div>

            <div className="grid gap-2.5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {candidates.map((b) => (
                <CreateConnectionDialog
                  key={b}
                  bankName={b}
                  trigger={
                    <button className="p-3 border border-border rounded-xl bg-background flex items-center gap-2.5 hover:-translate-y-0.5 hover:border-foreground/30 transition text-left w-full">
                      <BankMark name={b} size={28} />
                      <span className="flex-1 text-[13px] font-medium truncate">
                        {b}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        →
                      </span>
                    </button>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </PageSection>
    </>
  );
}
