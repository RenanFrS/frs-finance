import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { BankMark } from "@/components/ui/bank-mark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { CreateAccountDialog } from "@/components/dialogs/create-account-dialog";
import { EditAccountDialog } from "@/components/dialogs/edit-account-dialog";
import { requireSession } from "@/lib/session";
import { listAccounts, tenantTotals } from "@/lib/queries";
import { brl, brlSplit, decimalToNumber, relativeAgo } from "@/lib/format";

export const metadata = { title: "Contas · FrS Finance" };
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  CHECKING: "Conta corrente",
  SAVINGS: "Poupança",
  INVESTMENT: "Investimento",
  CREDIT: "Crédito",
};

export default async function ContasPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;
  const [accounts, totals] = await Promise.all([
    listAccounts(tenantId),
    tenantTotals(tenantId),
  ]);

  const totalBalance = brlSplit(totals.totalBalance);
  const totalAvailable = brlSplit(totals.totalAvailable);
  const totalInvestment = brlSplit(totals.totalInvestment);

  return (
    <>
      <AppBar
        crumb="Principal · Contas"
        title="Suas"
        titleEm="contas conectadas"
        actions={<CreateAccountDialog />}
      />

      <PageSection className="grid gap-4 sm:gap-5">
        <div className="grid gap-3 sm:gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Saldo total"
            value={`R$ ${totalBalance.int}`}
            suffix={`,${totalBalance.dec}`}
            trend={`${totals.accountCount} ${totals.accountCount === 1 ? "conta" : "contas"}`}
            trendKind="neutral"
          />
          <KpiCard
            index={1}
            label="Disponível"
            value={`R$ ${totalAvailable.int}`}
            suffix={`,${totalAvailable.dec}`}
            trend="contas correntes + poupança"
            trendKind="neutral"
          />
          <KpiCard
            index={2}
            label="Em investimentos"
            value={`R$ ${totalInvestment.int}`}
            suffix={`,${totalInvestment.dec}`}
            trend={`${accounts.filter((a) => a.type === "INVESTMENT").length} ${
              accounts.filter((a) => a.type === "INVESTMENT").length === 1 ? "conta" : "contas"
            }`}
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label="Conexões ativas"
            value={`${totals.connectionsCount}`}
            trend="Open Finance / Manual"
            trendKind="neutral"
          />
        </div>

        <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 grid gap-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-border">
            <h3 className="font-display font-semibold text-[18px]">Contas ativas</h3>
            <span className="mono-meta text-muted-foreground">
              {accounts.length} {accounts.length === 1 ? "cadastrada" : "cadastradas"}
            </span>
          </div>

          {accounts.length === 0 ? (
            <div className="py-10 text-center grid gap-3 place-items-center">
              <p className="text-[14px] text-muted-foreground">
                Nenhuma conta cadastrada ainda.
              </p>
              <CreateAccountDialog
                trigger={<Button size="sm">+ Adicionar primeira conta</Button>}
              />
            </div>
          ) : (
            <div className="grid gap-3.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {accounts.map((a) => {
                const balance = decimalToNumber(a.balance);
                const available = decimalToNumber(a.available);
                const split = brlSplit(balance);
                const sync = a.connection?.lastSyncAt ?? null;
                const displayName = a.nickname?.trim() || a.bankName;
                return (
                  <article
                    key={a.id}
                    className="rounded-2xl border border-border bg-background p-[18px] grid gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-vintage"
                  >
                    <div className="flex items-center justify-between">
                      <BankMark name={a.bankName} />
                      <Badge variant={a.connection ? "positive" : "default"}>
                        ● {a.connection ? `sync · ${relativeAgo(sync)}` : "manual"}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-[16px] leading-tight truncate">
                        {displayName}
                      </div>
                      <div className="mono-meta text-muted-foreground mt-0.5 truncate">
                        {a.nickname ? `${a.bankName} · ` : ""}
                        {TYPE_LABEL[a.type] ?? a.type}
                        {a.number ? ` · ${a.number}` : ""}
                      </div>
                    </div>
                    <div className="font-mono text-[22px] sm:text-[24px] font-medium tabular-nums tracking-tight">
                      R$ {split.int}
                      <small className="text-[12px] text-muted-foreground font-normal">
                        ,{split.dec}
                      </small>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono-meta text-muted-foreground">
                        Disp. R$ {brl(available)}
                      </span>
                      <EditAccountDialog
                        account={{
                          id: a.id,
                          bankName: a.bankName,
                          nickname: a.nickname,
                          number: a.number,
                          type: a.type,
                          balance,
                          available,
                        }}
                        trigger={
                          <Button variant="ghost" size="xs">
                            editar →
                          </Button>
                        }
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </PageSection>
    </>
  );
}
