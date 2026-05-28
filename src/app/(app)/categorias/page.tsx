import { AppBar } from "@/components/app-shell/app-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/app-shell/page-section";
import { CreateCategoryDialog } from "@/components/dialogs/create-category-dialog";
import { requireSession } from "@/lib/session";
import { listCategories, tenantTotals } from "@/lib/queries";
import { brl, decimalToNumber } from "@/lib/format";

export const metadata = { title: "Categorias · FrS Finance" };
export const dynamic = "force-dynamic";

const FALLBACK_COLORS = [
  "var(--primary)",
  "var(--gold)",
  "var(--positive)",
  "var(--negative)",
  "var(--muted-foreground)",
  "oklch(0.55 0.04 70)",
];

export default async function CategoriasPage() {
  const session = await requireSession();
  const tenantId = session.tenant.id;
  const [categories, totals] = await Promise.all([
    listCategories(tenantId),
    tenantTotals(tenantId),
  ]);

  const expenseByCategoryId = new Map<string, number>();
  for (const m of totals.breakdownMovs) {
    if (m.type !== "EXPENSE" || !m.categoryId) continue;
    const v = Math.abs(decimalToNumber(m.amount));
    expenseByCategoryId.set(
      m.categoryId,
      (expenseByCategoryId.get(m.categoryId) ?? 0) + v,
    );
  }
  const totalExpenseCategorized = [...expenseByCategoryId.values()].reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <>
      <AppBar
        crumb="Registros · Categorias"
        title="Categorias &"
        titleEm="orçamento"
        actions={<CreateCategoryDialog />}
      />

      <PageSection className="grid gap-5">
        {categories.length === 0 ? (
          <div className="rounded-[20px] border border-border bg-card p-10 grid gap-3 place-items-center text-center">
            <h3 className="font-display font-semibold text-[18px]">
              Nenhuma categoria cadastrada
            </h3>
            <p className="text-[14px] text-muted-foreground max-w-[420px]">
              Crie categorias para agrupar movimentos e acompanhar orçamentos
              por área.
            </p>
            <CreateCategoryDialog
              trigger={<Button size="sm">+ Criar primeira categoria</Button>}
            />
          </div>
        ) : (
          <div className="grid gap-3.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((c, i) => {
              const spent = expenseByCategoryId.get(c.id) ?? 0;
              const pct = totalExpenseCategorized > 0
                ? Math.round((spent / totalExpenseCategorized) * 100)
                : 0;
              const budget = c.budget ? decimalToNumber(c.budget) : null;
              const budgetPct = budget && budget > 0
                ? Math.min(100, Math.round((spent / budget) * 100))
                : pct;
              const color = c.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

              return (
                <article
                  key={c.id}
                  className="rounded-2xl border border-border bg-background p-[18px] grid gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-vintage"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-[14px]"
                      style={{
                        background: `color-mix(in oklch, ${color} 16%, transparent)`,
                        color,
                      }}
                    >
                      {(c.letter || c.name[0]).toUpperCase()}
                    </div>
                    <Badge>{c._count.movements} movs.</Badge>
                  </div>

                  <div>
                    <div className="font-display font-semibold text-[16px] leading-tight">
                      {c.name}
                    </div>
                    <div className="mono-meta text-muted-foreground mt-0.5">
                      {c.children.length > 0
                        ? `${c.children.length} sub-cats`
                        : "sem subcategorias"}
                    </div>
                  </div>

                  <div className="font-mono text-[20px] font-medium tabular-nums tracking-tight">
                    R$ {brl(spent)}
                    <small className="text-[12px] text-muted-foreground font-normal">
                      {" "}· {pct}% do gasto
                    </small>
                  </div>

                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${budgetPct}%`, background: color }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
                      {budget !== null
                        ? `orçamento R$ ${brl(budget)}`
                        : "sem orçamento"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </PageSection>
    </>
  );
}
