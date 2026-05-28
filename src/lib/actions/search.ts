"use server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";

export type SearchHit =
  | {
      kind: "movement";
      id: string;
      title: string;
      meta: string;
      amount: number;
      occurredAt: Date;
      href: string;
    }
  | {
      kind: "account";
      id: string;
      title: string;
      meta: string;
      balance: number;
      href: string;
    }
  | {
      kind: "category";
      id: string;
      title: string;
      meta: string;
      href: string;
    };

export async function globalSearch(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const session = await getCurrentSession();
  if (!session) return [];

  const [movements, accounts, categories] = await Promise.all([
    db.movement.findMany({
      where: {
        tenantId: session.tenant.id,
        description: { contains: q, mode: "insensitive" },
      },
      include: { account: true, category: true },
      orderBy: { occurredAt: "desc" },
      take: 6,
    }),
    db.bankAccount.findMany({
      where: {
        tenantId: session.tenant.id,
        OR: [
          { bankName: { contains: q, mode: "insensitive" } },
          { number: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    }),
    db.category.findMany({
      where: {
        tenantId: session.tenant.id,
        name: { contains: q, mode: "insensitive" },
      },
      take: 4,
    }),
  ]);

  const hits: SearchHit[] = [];
  for (const m of movements) {
    hits.push({
      kind: "movement",
      id: m.id,
      title: m.description,
      meta: `${m.category?.name ?? "Sem categoria"} · ${m.account?.bankName ?? "Manual"}`,
      amount: Number(m.amount),
      occurredAt: m.occurredAt,
      href: `/movimentos`,
    });
  }
  for (const a of accounts) {
    hits.push({
      kind: "account",
      id: a.id,
      title: `${a.bankName} ${a.number ?? ""}`.trim(),
      meta: a.type,
      balance: Number(a.balance),
      href: `/contas`,
    });
  }
  for (const c of categories) {
    hits.push({
      kind: "category",
      id: c.id,
      title: c.name,
      meta: "Categoria",
      href: `/categorias`,
    });
  }
  return hits;
}
