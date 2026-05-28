import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/app-shell/page-section";
import { BankMark } from "@/components/ui/bank-mark";
import { CreateAccountDialog } from "@/components/dialogs/create-account-dialog";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { brl, brlSplit, decimalToNumber } from "@/lib/format";

export const metadata = { title: "Investimentos · FrS Finance" };
export const dynamic = "force-dynamic";

export default async function InvestimentosPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;

  const [investmentAccounts, agg] = await Promise.all([
    db.bankAccount.findMany({
      where: { tenantId, type: "INVESTMENT" },
      orderBy: { balance: "desc" },
    }),
    db.bankAccount.aggregate({
      where: { tenantId, type: "INVESTMENT" },
      _sum: { balance: true, available: true },
    }),
  ]);

  const total = decimalToNumber(agg._sum.balance);
  const totalSplit = brlSplit(total);

  // group by bank to show "classes" approximation
  const byBank = new Map<string, number>();
  for (const a of investmentAccounts) {
    const balance = decimalToNumber(a.balance);
    byBank.set(a.bankName, (byBank.get(a.bankName) ?? 0) + balance);
  }
  const classes = [...byBank.entries()]
    .map(([name, value]) => ({ name, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value);

  const PALETTE = [
    "var(--primary)",
    "var(--gold)",
    "var(--positive)",
    "var(--negative)",
    "var(--muted-foreground)",
  ];

  return (
    <>
      <AppBar
        crumb="Principal · Investimentos"
        title="Carteira"
        titleEm="& posições"
        actions={
          <CreateAccountDialog
            trigger={<Button size="sm">+ Conta de investimento</Button>}
          />
        }
      />

      <PageSection className="grid gap-5">
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Patrimônio investido"
            value={`R$ ${totalSplit.int}`}
            suffix={`,${totalSplit.dec}`}
            trend={`${investmentAccounts.length} ${investmentAccounts.length === 1 ? "conta" : "contas"}`}
            trendKind="neutral"
          />
          <KpiCard
            index={1}
            label="Custódias"
            value={`${byBank.size}`}
            trend="bancos / corretoras"
            trendKind="neutral"
          />
          <KpiCard
            index={2}
            label="Disponível p/ resgate"
            value={`R$ ${brl(decimalToNumber(agg._sum.available))}`}
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label="Maior posição"
            value={
              classes[0]
                ? `R$ ${brl(classes[0].value)}`
                : "—"
            }
            trend={classes[0]?.name ?? "sem dados"}
            trendKind="neutral"
          />
        </div>

        {investmentAccounts.length === 0 ? (
          <div className="rounded-[20px] border border-border bg-card p-10 grid gap-3 place-items-center text-center">
            <h3 className="font-display font-semibold text-[18px]">
              Sem contas de investimento
            </h3>
            <p className="text-[14px] text-muted-foreground max-w-[440px]">
              Cadastre uma conta com tipo <strong>Investimento</strong> para
              acompanhar custódia, saldos e classes de ativos por aqui.
            </p>
            <CreateAccountDialog
              trigger={<Button size="sm">+ Adicionar conta</Button>}
            />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5 overflow-x-auto">
              <div className="flex items-baseline justify-between pb-3 border-b border-border">
                <h3 className="font-display font-semibold text-[18px]">
                  Contas de investimento
                </h3>
                <span className="mono-meta text-muted-foreground">
                  {investmentAccounts.length}{" "}
                  {investmentAccounts.length === 1 ? "ativa" : "ativas"}
                </span>
              </div>
              <div className="min-w-[640px] grid">
                <div className="grid grid-cols-[40px_1.6fr_1fr_140px] gap-3 py-2 border-b border-foreground font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                  <span />
                  <span>Banco / Corretora</span>
                  <span>Identificador</span>
                  <span className="text-right">Saldo</span>
                </div>
                {investmentAccounts.map((a) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-[40px_1.6fr_1fr_140px] gap-3 py-3 border-b border-dashed border-border last:border-b-0 items-center text-[13.5px]"
                  >
                    <BankMark name={a.bankName} size={28} />
                    <div className="font-medium">{a.bankName}</div>
                    <div className="text-muted-foreground">
                      {a.number ?? "—"}
                    </div>
                    <div className="font-mono tabular-nums text-right">
                      R$ {brl(decimalToNumber(a.balance))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
              <div className="flex items-baseline justify-between pb-3 border-b border-border">
                <h3 className="font-display font-semibold text-[18px]">
                  Por custódia
                </h3>
                <span className="mono-meta text-muted-foreground">
                  {classes.length} {classes.length === 1 ? "fonte" : "fontes"}
                </span>
              </div>
              <div className="grid gap-3">
                {classes.map((c, i) => (
                  <div key={c.name} className="grid gap-1.5">
                    <div className="flex justify-between text-[13px]">
                      <span>{c.name}</span>
                      <span className="font-mono tabular-nums">{c.pct} %</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{
                          width: `${c.pct}%`,
                          background: PALETTE[i % PALETTE.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageSection>
    </>
  );
}
