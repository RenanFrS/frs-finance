import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { DateRangePicker } from "@/components/app-shell/date-range-picker";
import { CreateMovementDialog } from "@/components/dialogs/create-movement-dialog";
import { requireSession } from "@/lib/session";
import {
  accountLabel,
  countMovements,
  listAccounts,
  listCategories,
  listMovements,
  resolvePeriod,
  tenantTotals,
} from "@/lib/queries";
import { brl, brlSplit, decimalToNumber, shortDate } from "@/lib/format";

export const metadata = { title: "Movimentos · FrS Finance" };
export const dynamic = "force-dynamic";

const TYPE_BG: Record<string, { bg: string; fg: string }> = {
  EXPENSE: { bg: "var(--primary-soft)", fg: "var(--primary)" },
  INCOME: {
    bg: "color-mix(in oklch, var(--positive) 18%, transparent)",
    fg: "var(--positive)",
  },
  TRANSFER: { bg: "var(--accent)", fg: "var(--muted-foreground)" },
  INVESTMENT: {
    bg: "color-mix(in oklch, var(--gold) 22%, transparent)",
    fg: "var(--gold)",
  },
};

type SearchParams = Promise<{ from?: string; to?: string }>;

export default async function MovimentosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const tenantId = session.tenant.id;
  const { from, to } = await searchParams;
  const period = resolvePeriod(from, to);

  const [movements, accounts, categories, totals, periodCount, totalCount] =
    await Promise.all([
      listMovements(tenantId, { take: 200, period }),
      listAccounts(tenantId),
      listCategories(tenantId),
      tenantTotals(tenantId, period),
      countMovements(tenantId, period),
      countMovements(tenantId),
    ]);

  const reconciledCount = movements.filter((m) => !!m.reconciledAt).length;
  const incomeSplit = brlSplit(totals.incomePeriod);
  const expenseSplit = brlSplit(totals.expensePeriod);
  const netSplit = brlSplit(totals.incomePeriod - totals.expensePeriod);

  const accountOptions = accounts.map((a) => ({ id: a.id, label: accountLabel(a) }));
  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.name }));

  return (
    <>
      <AppBar
        crumb="Registros · Movimentos"
        title="Movimentos"
        titleEm="& reconciliação"
        actions={
          <>
            <DateRangePicker />
            <CreateMovementDialog
              accounts={accountOptions}
              categories={categoryOptions}
            />
          </>
        }
      />

      <PageSection className="grid gap-4 sm:gap-5">
        <div className="grid gap-3 sm:gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label={`Entradas · ${period.label}`}
            value={`R$ ${incomeSplit.int}`}
            suffix={`,${incomeSplit.dec}`}
            trendKind="up"
          />
          <KpiCard
            index={1}
            label={`Saídas · ${period.label}`}
            value={`R$ ${expenseSplit.int}`}
            suffix={`,${expenseSplit.dec}`}
            trendKind="down"
          />
          <KpiCard
            index={2}
            label={`Saldo · ${period.label}`}
            value={`R$ ${netSplit.int}`}
            suffix={`,${netSplit.dec}`}
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label="Reconciliados"
            value={`${reconciledCount}`}
            suffix={` / ${movements.length}`}
            trend={
              movements.length > 0
                ? `${Math.round((reconciledCount / movements.length) * 100)}%`
                : "—"
            }
            trendKind={reconciledCount === movements.length ? "up" : "neutral"}
          />
        </div>

        <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 grid gap-3.5 overflow-x-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-border">
            <h3 className="font-display font-semibold text-[18px]">
              {periodCount} {periodCount === 1 ? "movimento" : "movimentos"} no período
            </h3>
            <span className="mono-meta text-muted-foreground">
              {totalCount} {totalCount === 1 ? "registro" : "registros"} no total
            </span>
          </div>

          {movements.length === 0 ? (
            <div className="py-10 text-center grid gap-3 place-items-center">
              <p className="text-[14px] text-muted-foreground">
                Nenhum movimento no período selecionado.
              </p>
              <CreateMovementDialog
                accounts={accountOptions}
                categories={categoryOptions}
                trigger={<Button size="sm">+ Registrar movimento</Button>}
              />
            </div>
          ) : (
            <div className="min-w-[820px] grid">
              <div className="grid grid-cols-[24px_1.5fr_1fr_90px_130px_100px] gap-3 py-2 border-b border-foreground font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                <span />
                <span>Descrição</span>
                <span>Categoria</span>
                <span className="text-right">Data</span>
                <span className="text-right">Valor</span>
                <span className="text-right">Status</span>
              </div>

              {movements.map((m) => {
                const colors = TYPE_BG[m.type] ?? TYPE_BG.EXPENSE;
                const amount = decimalToNumber(m.amount);
                const letter =
                  m.category?.letter ||
                  m.category?.name?.[0] ||
                  (amount >= 0 ? "+" : "−");
                return (
                  <div
                    key={m.id}
                    className="grid grid-cols-[24px_1.5fr_1fr_90px_130px_100px] gap-3 py-3 border-b border-dashed border-border last:border-b-0 items-center text-[13.5px]"
                  >
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-display text-[11px] font-semibold"
                      style={{ background: colors.bg, color: colors.fg }}
                    >
                      {letter.toUpperCase()}
                    </div>
                    <div>
                      <div>{m.description}</div>
                      <div className="mono-meta text-muted-foreground mt-0.5">
                        {m.source === "WHATSAPP"
                          ? "WhatsApp · "
                          : m.source === "MANUAL"
                            ? "Manual · "
                            : ""}
                        {m.account
                          ? accountLabel({
                              nickname: m.account.nickname,
                              bankName: m.account.bankName,
                              number: m.account.number,
                            })
                          : "sem conta"}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
                      {m.category?.name ?? "—"}
                    </div>
                    <div className="font-mono tabular-nums text-right text-muted-foreground text-[11.5px]">
                      {shortDate(m.occurredAt)}
                    </div>
                    <div
                      className={`font-mono tabular-nums text-right ${
                        amount > 0 ? "text-positive" : ""
                      }`}
                    >
                      {amount > 0 ? "+" : "−"}R${" "}
                      {brl(Math.abs(amount))}
                    </div>
                    <div className="text-right">
                      <Badge variant={m.reconciledAt ? "positive" : "default"}>
                        ● {m.reconciledAt ? "conc." : "pend."}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageSection>
    </>
  );
}
