import { AppBar } from "@/components/app-shell/app-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { decimalToNumber, shortDate } from "@/lib/format";

export const metadata = { title: "WhatsApp · FrS Finance" };
export const dynamic = "force-dynamic";

const COMMANDS = [
  { cmd: "/gasto", description: "Registrar uma despesa", example: "/gasto 84,30 farmácia drogaria" },
  { cmd: "/receita", description: "Registrar uma entrada", example: "/receita 2500 freelance design" },
  { cmd: "/investi", description: "Registrar aporte", example: "/investi 1500 tesouro selic" },
  { cmd: "/saldo", description: "Consultar saldo consolidado", example: "/saldo" },
  { cmd: "/fatura", description: "Resumo de faturas em aberto", example: "/fatura" },
  { cmd: "/meta", description: "Status das metas de orçamento", example: "/meta alimentacao" },
];

export default async function WhatsappPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;

  const whatsappMovements = await db.movement.findMany({
    where: { tenantId, source: "WHATSAPP" },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { category: true, account: true },
  });

  // Server Component: this runs once per request and never re-renders.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const total30 = await db.movement.count({
    where: {
      tenantId,
      source: "WHATSAPP",
      occurredAt: { gte: since },
    },
  });

  return (
    <>
      <AppBar
        crumb="Registros · WhatsApp"
        title="Bot do"
        titleEm="WhatsApp"
      />

      <PageSection className="grid gap-5">
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            index={0}
            label="Status"
            value="EM BREVE"
            trend="integração planejada"
            trendKind="neutral"
          />
          <KpiCard
            index={1}
            label="Registros · 30d"
            value={`${total30}`}
            trend={total30 > 0 ? "do canal WhatsApp" : "sem registros"}
            trendKind="neutral"
          />
          <KpiCard
            index={2}
            label="Comandos"
            value={`${COMMANDS.length}`}
            trend="texto livre suportado"
            trendKind="neutral"
          />
          <KpiCard
            index={3}
            label="Tempo médio"
            value="—"
            trend="aguardando produção"
            trendKind="neutral"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
            <div className="flex items-baseline justify-between pb-3 border-b border-border">
              <h3 className="font-display font-semibold text-[18px]">
                Últimos registros via WhatsApp
              </h3>
              <span className="mono-meta text-muted-foreground">
                {whatsappMovements.length}{" "}
                {whatsappMovements.length === 1 ? "registro" : "registros"}
              </span>
            </div>

            {whatsappMovements.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-muted-foreground">
                Nenhum registro via WhatsApp ainda. A integração do bot virá em
                breve — por ora, registre os movimentos pela tela{" "}
                <a href="/movimentos" className="text-primary underline">
                  Movimentos
                </a>
                .
              </div>
            ) : (
              <div className="grid gap-3">
                {whatsappMovements.map((m) => {
                  const amount = decimalToNumber(m.amount);
                  return (
                    <div
                      key={m.id}
                      className="grid grid-cols-[32px_1fr_auto] gap-3 py-2.5 border-b border-dashed border-border last:border-b-0 items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/12 text-primary flex items-center justify-center font-mono text-[11px] font-medium">
                        WA
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] truncate">
                          {m.description}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2.5 mono-meta text-muted-foreground">
                          <span>{shortDate(m.occurredAt)}</span>
                          <Badge>
                            {m.category?.name ?? m.type.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                      <div
                        className={`font-mono tabular-nums text-[13px] ${
                          amount >= 0 ? "text-positive" : ""
                        }`}
                      >
                        {amount >= 0 ? "+" : "−"}R${" "}
                        {Math.abs(amount).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
            <div className="flex items-baseline justify-between pb-3 border-b border-border">
              <h3 className="font-display font-semibold text-[18px]">
                Comandos planejados
              </h3>
              <span className="mono-meta text-muted-foreground">
                {COMMANDS.length} comandos
              </span>
            </div>

            <div className="grid gap-2.5">
              {COMMANDS.map((c) => (
                <div
                  key={c.cmd}
                  className="p-3.5 border border-border rounded-xl bg-background transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[13px] text-primary font-medium">
                      {c.cmd}
                    </span>
                    <span className="text-[13px] text-muted-foreground text-right">
                      {c.description}
                    </span>
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    ex.: {c.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
