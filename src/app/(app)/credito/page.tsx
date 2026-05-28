import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { BankMark } from "@/components/ui/bank-mark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { CreateCardDialog } from "@/components/dialogs/create-card-dialog";
import { requireSession } from "@/lib/session";
import { creditTotals, listCreditCards } from "@/lib/queries";
import { brl, brlSplit, decimalToNumber, shortDate } from "@/lib/format";

export const metadata = { title: "Crédito · FrS Finance" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "em aberto",
  PARTIAL: "parcial",
  PAID: "paga",
};

export default async function CreditoPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;

  const [cards, totals] = await Promise.all([
    listCreditCards(tenantId),
    creditTotals(tenantId),
  ]);

  const allInvoices = cards.flatMap((c) =>
    c.invoices.map((inv) => ({ ...inv, card: c })),
  );

  const usedSplit = brlSplit(totals.used);
  const nextSplit = brlSplit(totals.nextInvoiceAmount);

  return (
    <>
      <AppBar
        crumb="Principal · Crédito"
        title="Cartões &"
        titleEm="faturas"
        actions={<CreateCardDialog />}
      />

      <PageSection className="grid gap-5">
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Cartões"
            value={`${totals.cardsCount}`}
            trend={`${totals.cardsCount === 1 ? "ativo" : "ativos"}`}
            trendKind="neutral"
          />
          <KpiCard
            index={1}
            label="Em aberto"
            value={`R$ ${usedSplit.int}`}
            suffix={`,${usedSplit.dec}`}
            trend={`${allInvoices.filter((i) => i.status !== "PAID").length} faturas`}
            trendKind="neutral"
          />
          <KpiCard
            index={2}
            label="Próxima fatura"
            value={
              totals.nextDue
                ? `R$ ${nextSplit.int}`
                : "—"
            }
            suffix={totals.nextDue ? `,${nextSplit.dec}` : undefined}
            trend={
              totals.nextDue
                ? `vence em ${shortDate(totals.nextDue)}`
                : "sem fatura aberta"
            }
            trendKind="down"
          />
          <KpiCard
            index={3}
            label="Utilização média"
            value={
              cards.length > 0
                ? `${Math.round(
                    cards.reduce((s, c) => s + (c.utilizationPct ?? 0), 0) / cards.length,
                  )}`
                : "0"
            }
            suffix=" %"
            trend="dos limites cadastrados"
            trendKind="neutral"
          />
        </div>

        {cards.length === 0 ? (
          <div className="rounded-[20px] border border-border bg-card p-10 grid gap-3 place-items-center text-center">
            <h3 className="font-display font-semibold text-[18px]">
              Nenhum cartão cadastrado
            </h3>
            <p className="text-[14px] text-muted-foreground max-w-[420px]">
              Cadastre seus cartões para acompanhar faturas, vencimentos e
              utilização de limite.
            </p>
            <CreateCardDialog
              trigger={<Button size="sm">+ Adicionar primeiro cartão</Button>}
            />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {cards.map((c) => (
              <div
                key={c.id}
                className="rounded-[18px] p-[22px] text-white grid gap-[22px] min-h-[200px] relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.32 0.04 35), oklch(0.18 0.025 30))",
                }}
              >
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 10% 20%, color-mix(in oklch, var(--primary) 65%, transparent), transparent 55%)",
                  }}
                  aria-hidden
                />
                <div className="relative z-10 flex justify-between items-start">
                  <span className="font-display font-semibold text-[18px] tracking-tight">
                    {c.bankName} · {c.product}
                  </span>
                  <div
                    className="w-8 h-[22px] rounded-[4px]"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.05 80), oklch(0.55 0.06 70))",
                    }}
                  />
                </div>
                <div className="relative z-10 font-mono text-[17px] tracking-[0.16em]">
                  {c.numberMask}
                </div>
                <div className="relative z-10 flex justify-between items-end gap-3">
                  <div>
                    <div className="mono-meta opacity-70">titular</div>
                    <div className="font-display text-[14px] font-medium mt-1">
                      {c.holder}
                    </div>
                  </div>
                  <div>
                    <div className="mono-meta opacity-70">limite usado</div>
                    <div className="font-display text-[14px] font-medium mt-1">
                      {c.utilizationPct} %
                    </div>
                  </div>
                  <div>
                    <div className="mono-meta opacity-70">venc.</div>
                    <div className="font-display text-[14px] font-medium mt-1">
                      {c.expiry}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5 overflow-x-auto">
          <div className="flex items-baseline justify-between pb-3 border-b border-border">
            <h3 className="font-display font-semibold text-[18px]">Faturas</h3>
            <span className="mono-meta text-muted-foreground">
              {allInvoices.length} {allInvoices.length === 1 ? "cadastrada" : "cadastradas"}
            </span>
          </div>

          {allInvoices.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-muted-foreground">
              Nenhuma fatura registrada ainda.
            </div>
          ) : (
            <div className="min-w-[760px] grid">
              <div className="grid grid-cols-[40px_1.4fr_110px_110px_130px_110px] gap-3 py-2 border-b border-foreground font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                <span />
                <span>Cartão</span>
                <span>Fechamento</span>
                <span>Vencimento</span>
                <span className="text-right">Valor</span>
                <span className="text-right">Status</span>
              </div>

              {allInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-[40px_1.4fr_110px_110px_130px_110px] gap-3 py-3 border-b border-dashed border-border last:border-b-0 items-center text-[13.5px]"
                >
                  <BankMark name={inv.card.bankName} size={26} />
                  <div>
                    <div className="font-medium">
                      {inv.card.bankName} {inv.card.product}
                    </div>
                    <div className="mono-meta text-muted-foreground mt-0.5">
                      {inv.card.numberMask.slice(-7)}
                    </div>
                  </div>
                  <div className="font-mono tabular-nums text-muted-foreground">
                    {shortDate(inv.closingAt)}
                  </div>
                  <div className="font-mono tabular-nums">
                    {shortDate(inv.dueAt)}
                  </div>
                  <div className="font-mono tabular-nums text-right">
                    R$ {brl(decimalToNumber(inv.amount))}
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        inv.status === "OPEN"
                          ? "negative"
                          : inv.status === "PARTIAL"
                            ? "default"
                            : "positive"
                      }
                    >
                      ● {STATUS_LABEL[inv.status] ?? inv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </>
  );
}
