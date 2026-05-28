import { AppBar } from "@/components/app-shell/app-bar";
import { PageSection } from "@/components/app-shell/page-section";
import { DateRangePicker } from "@/components/app-shell/date-range-picker";
import { KpiCard } from "@/components/ui/kpi-card";
import { EquityPanel } from "@/components/dashboard/equity-panel";
import { CategoryPanel } from "@/components/dashboard/category-panel";
import { MovementsPanel, type RecentMovement } from "@/components/dashboard/movements-panel";
import { WhatsAppPanel } from "@/components/dashboard/whatsapp-panel";
import {
  ConnectionsPanel,
  type ConnectionSummary,
} from "@/components/dashboard/connections-panel";
import { CreateMovementDialog } from "@/components/dialogs/create-movement-dialog";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/session";
import {
  accountLabel,
  computeEquitySeries,
  listAccounts,
  listCategories,
  listConnections,
  listMovements,
  resolvePeriod,
  tenantTotals,
} from "@/lib/queries";
import { decimalToNumber, brl, brlSplit, shortDate, greeting } from "@/lib/format";

export const metadata = { title: "Visão geral · FrS Finance" };
export const dynamic = "force-dynamic";

const CAT_COLORS_DEFAULT = [
  "var(--primary)",
  "var(--gold)",
  "var(--positive)",
  "var(--negative)",
  "var(--muted-foreground)",
  "oklch(0.55 0.04 70)",
];

type SearchParams = Promise<{ from?: string; to?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const tenantId = session.tenant.id;
  const { from, to } = await searchParams;
  const period = resolvePeriod(from, to);

  const [totals, accounts, periodMovements, categories, connections, equity] =
    await Promise.all([
      tenantTotals(tenantId, period),
      listAccounts(tenantId),
      listMovements(tenantId, { take: 6, period }),
      listCategories(tenantId),
      listConnections(tenantId),
      computeEquitySeries(tenantId, period),
    ]);

  const today = new Date();
  const crumb = `${greeting()} · ${today.getDate().toString().padStart(2, "0")} ${
    ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][today.getMonth()]
  } ${today.getFullYear()}`;

  const monthlyDelta = totals.expensePeriod - totals.expensePrev;
  const investedPct = totals.totalBalance > 0
    ? Math.round((totals.totalInvestment / totals.totalBalance) * 100)
    : 0;
  const balanceSplit = brlSplit(totals.totalBalance);
  const investmentSplit = brlSplit(totals.totalInvestment);
  const expenseSplit = brlSplit(totals.expensePeriod);
  const availableSplit = brlSplit(totals.totalAvailable);

  // Donut breakdown for the selected period
  const byCategory = new Map<
    string,
    { name: string; color: string | null; total: number }
  >();
  let categorizedExpense = 0;
  for (const m of totals.breakdownMovs) {
    if (m.type !== "EXPENSE") continue;
    const value = Math.abs(decimalToNumber(m.amount));
    categorizedExpense += value;
    const key = m.category?.name ?? "Sem categoria";
    const color = m.category?.color ?? null;
    const prev = byCategory.get(key) ?? { name: key, color, total: 0 };
    prev.total += value;
    byCategory.set(key, prev);
  }
  const sortedCats = [...byCategory.values()].sort((a, b) => b.total - a.total).slice(0, 6);
  const donutSegments = sortedCats.map((c, i) => ({
    label: c.name,
    pct: categorizedExpense > 0 ? Math.round((c.total / categorizedExpense) * 100) : 0,
    color: c.color ?? CAT_COLORS_DEFAULT[i % CAT_COLORS_DEFAULT.length],
  }));

  const recentItems: RecentMovement[] = periodMovements.map((m) => {
    const isPositive = decimalToNumber(m.amount) >= 0;
    const acc = m.account
      ? accountLabel({
          nickname: m.account.nickname,
          bankName: m.account.bankName,
          number: m.account.number,
        })
      : "Manual";
    return {
      id: m.id,
      letter: (m.category?.letter || m.category?.name?.[0] || (isPositive ? "+" : "−")).toUpperCase(),
      catBg: isPositive
        ? "color-mix(in oklch, var(--positive) 18%, transparent)"
        : "var(--primary-soft)",
      catFg: isPositive ? "var(--positive)" : "var(--primary)",
      description: m.description,
      meta: `${m.category?.name ?? "Sem categoria"} · ${acc}`,
      date: shortDate(m.occurredAt),
      amount: decimalToNumber(m.amount),
      reconciled: !!m.reconciledAt,
    };
  });

  const connectionsSummary: ConnectionSummary[] = connections.slice(0, 4).map((c) => {
    const minutes = c.lastSyncAt
      ? Math.floor((Date.now() - c.lastSyncAt.getTime()) / 60000)
      : null;
    return {
      id: c.id,
      bankName: c.bankName,
      meta: c._count.accounts > 0 ? `${c._count.accounts} contas` : "Sem contas vinculadas",
      badge: c.active ? "positive" : "negative",
      badgeText: minutes !== null ? (minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h`) : c.active ? "ativo" : "inativo",
    };
  });

  const accountOptions = accounts.map((a) => ({ id: a.id, label: accountLabel(a) }));
  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.name }));

  return (
    <>
      <AppBar
        crumb={crumb}
        title="Visão consolidada do"
        titleEm="patrimônio"
        actions={
          <>
            <DateRangePicker />
            <CreateMovementDialog
              accounts={accountOptions}
              categories={categoryOptions}
              trigger={<Button size="sm">+ registrar</Button>}
            />
          </>
        }
      />

      <PageSection className="grid gap-4 sm:gap-5">
        <section className="grid gap-3 sm:gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Patrimônio · saldo"
            value={`R$ ${balanceSplit.int}`}
            suffix={`,${balanceSplit.dec}`}
            trend="contas + investimentos · exclui dívida"
            trendKind="neutral"
          />
          <KpiCard
            index={1}
            label="Investimentos"
            value={`R$ ${investmentSplit.int}`}
            suffix={`,${investmentSplit.dec}`}
            trend={
              totals.totalBalance > 0
                ? `${investedPct}% do patrimônio`
                : "sem patrimônio"
            }
            trendKind={investedPct > 0 ? "up" : "neutral"}
          />
          <KpiCard
            index={2}
            label="Disponível · líquido"
            value={`R$ ${availableSplit.int}`}
            suffix={`,${availableSplit.dec}`}
            trend="conta corrente + poupança"
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label={`Gasto · ${period.label}`}
            value={`R$ ${expenseSplit.int}`}
            suffix={`,${expenseSplit.dec}`}
            trend={
              totals.expensePrev > 0
                ? `${monthlyDelta >= 0 ? "↗ +" : "↘ −"}R$ ${brl(Math.abs(monthlyDelta))} vs. período anterior`
                : "sem comparativo ainda"
            }
            trendKind={monthlyDelta > 0 ? "down" : monthlyDelta < 0 ? "up" : "neutral"}
          />
        </section>

        <section className="grid gap-3 sm:gap-4 grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
          <EquityPanel
            values={equity.values}
            min={equity.min}
            max={equity.max}
            mid={equity.mid}
            periodLabel={period.label}
          />
          <CategoryPanel
            segments={donutSegments}
            totalLabel="GASTO"
            totalValue={`R$ ${brl(categorizedExpense)}`}
            period={period.label}
          />
        </section>

        <section className="grid gap-3 sm:gap-4 grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
          <MovementsPanel items={recentItems} total={totals.movementsCount} />
          <div className="grid gap-4">
            <WhatsAppPanel items={[]} />
            <ConnectionsPanel items={connectionsSummary} />
          </div>
        </section>
      </PageSection>
    </>
  );
}
