import { db } from "@/lib/db";
import { decimalToNumber, parseInputDate } from "@/lib/format";

export async function listAccounts(tenantId: string) {
  return db.bankAccount.findMany({
    where: { tenantId },
    orderBy: { createdAt: "asc" },
    include: { connection: { select: { id: true, bankName: true, lastSyncAt: true } } },
  });
}

export function accountLabel(a: {
  nickname?: string | null;
  bankName: string;
  number?: string | null;
}): string {
  const base = (a.nickname?.trim() || a.bankName).trim();
  return a.number ? `${base} · ${a.number}` : base;
}

export type Period = {
  from: Date;
  to: Date;
  label: string;
  /** True when no explicit range was selected; falls back to current month. */
  isDefault: boolean;
};

const MONTHS_LONG = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const MONTHS_SHORT = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function resolvePeriod(
  fromInput?: string | null,
  toInput?: string | null,
  now: Date = new Date(),
): Period {
  if (fromInput && toInput) {
    const f = parseInputDate(fromInput);
    const t = parseInputDate(toInput);
    if (f && t && !Number.isNaN(f.getTime()) && !Number.isNaN(t.getTime())) {
      const [a, b] = f <= t ? [f, t] : [t, f];
      const sameDay =
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
      const label = sameDay
        ? `${a.getDate().toString().padStart(2, "0")} ${MONTHS_SHORT[a.getMonth()]}`
        : `${a.getDate().toString().padStart(2, "0")} ${MONTHS_SHORT[a.getMonth()]} → ${b.getDate().toString().padStart(2, "0")} ${MONTHS_SHORT[b.getMonth()]}`;
      return { from: startOfDay(a), to: endOfDay(b), label, isDefault: false };
    }
  }
  const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  to.setMilliseconds(-1);
  return { from, to, label: MONTHS_LONG[now.getMonth()], isDefault: true };
}

/**
 * Returns the period of equal length that immediately precedes `p`. Used for
 * mom-style trend comparisons regardless of the active picker selection.
 */
export function previousPeriod(p: Period): Period {
  const lengthMs = p.to.getTime() - p.from.getTime();
  const to = new Date(p.from.getTime() - 1);
  const from = new Date(p.from.getTime() - lengthMs - 1);
  return { from, to, label: "anterior", isDefault: false };
}

export async function listMovements(
  tenantId: string,
  opts: {
    take?: number;
    skip?: number;
    type?: "EXPENSE" | "INCOME";
    accountId?: string;
    period?: Period;
  } = {},
) {
  return db.movement.findMany({
    where: {
      tenantId,
      ...(opts.type ? { type: opts.type } : {}),
      ...(opts.accountId ? { accountId: opts.accountId } : {}),
      ...(opts.period
        ? { occurredAt: { gte: opts.period.from, lte: opts.period.to } }
        : {}),
    },
    orderBy: { occurredAt: "desc" },
    take: opts.take,
    skip: opts.skip,
    include: { account: true, category: true },
  });
}

export async function countMovements(tenantId: string, period?: Period) {
  return db.movement.count({
    where: {
      tenantId,
      ...(period
        ? { occurredAt: { gte: period.from, lte: period.to } }
        : {}),
    },
  });
}

export async function listCategories(tenantId: string) {
  return db.category.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
    include: {
      children: true,
      _count: { select: { movements: true } },
    },
  });
}

export async function listConnections(tenantId: string) {
  return db.bankConnection.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { accounts: true } } },
  });
}

export async function listCreditCards(tenantId: string) {
  return db.creditCard.findMany({
    where: { tenantId },
    orderBy: { createdAt: "asc" },
    include: { invoices: { orderBy: { dueAt: "asc" } } },
  });
}

export async function tenantTotals(
  tenantId: string,
  period: Period = resolvePeriod(),
) {
  const prev = previousPeriod(period);

  const [
    liquidAgg,
    patrimonyAgg,
    investmentAgg,
    accountCount,
    periodMovs,
    prevMovs,
    breakdownMovs,
    categoriesCount,
    connectionsCount,
    movementsCount,
  ] = await Promise.all([
    db.bankAccount.aggregate({
      where: { tenantId, type: { in: ["CHECKING", "SAVINGS"] } },
      _sum: { available: true },
    }),
    db.bankAccount.aggregate({
      where: { tenantId, type: { in: ["CHECKING", "SAVINGS", "INVESTMENT"] } },
      _sum: { balance: true },
    }),
    db.bankAccount.aggregate({
      where: { tenantId, type: "INVESTMENT" },
      _sum: { balance: true },
    }),
    db.bankAccount.count({ where: { tenantId } }),
    db.movement.findMany({
      where: { tenantId, occurredAt: { gte: period.from, lte: period.to } },
      select: { amount: true, type: true },
    }),
    db.movement.findMany({
      where: { tenantId, occurredAt: { gte: prev.from, lte: prev.to } },
      select: { amount: true, type: true },
    }),
    db.movement.findMany({
      where: { tenantId, occurredAt: { gte: period.from, lte: period.to } },
      select: {
        amount: true,
        type: true,
        categoryId: true,
        category: { select: { name: true, color: true } },
      },
    }),
    db.category.count({ where: { tenantId } }),
    db.bankConnection.count({ where: { tenantId, active: true } }),
    db.movement.count({ where: { tenantId } }),
  ]);

  const totalAvailable = decimalToNumber(liquidAgg._sum.available);
  const totalBalance = decimalToNumber(patrimonyAgg._sum.balance);
  const totalInvestment = decimalToNumber(investmentAgg._sum.balance);

  const sumExpense = (rows: { type: string; amount: unknown }[]) =>
    rows
      .filter((r) => r.type === "EXPENSE")
      .reduce(
        (s, r) =>
          s + Math.abs(decimalToNumber(r.amount as Parameters<typeof decimalToNumber>[0])),
        0,
      );
  const sumIncome = (rows: { type: string; amount: unknown }[]) =>
    rows
      .filter((r) => r.type === "INCOME")
      .reduce(
        (s, r) =>
          s + decimalToNumber(r.amount as Parameters<typeof decimalToNumber>[0]),
        0,
      );

  return {
    period,
    totalBalance,
    totalAvailable,
    totalInvestment,
    accountCount,
    categoriesCount,
    connectionsCount,
    movementsCount,
    expensePeriod: sumExpense(periodMovs),
    incomePeriod: sumIncome(periodMovs),
    expensePrev: sumExpense(prevMovs),
    incomePrev: sumIncome(prevMovs),
    breakdownMovs,
  };
}

/**
 * Daily closing-balance series for the patrimony (non-CREDIT accounts) over
 * `period`. Walks current balance backwards using observed movements, so the
 * last point always equals the current totalBalance.
 */
export async function computeEquitySeries(
  tenantId: string,
  period: Period,
): Promise<{ values: number[]; min: number; max: number; mid: number }> {
  const [patrimony, allMovs] = await Promise.all([
    db.bankAccount.aggregate({
      where: { tenantId, type: { in: ["CHECKING", "SAVINGS", "INVESTMENT"] } },
      _sum: { balance: true },
    }),
    db.movement.findMany({
      where: {
        tenantId,
        occurredAt: { gte: period.from },
      },
      select: { amount: true, occurredAt: true, accountId: true, account: { select: { type: true } } },
    }),
  ]);
  const currentBalance = decimalToNumber(patrimony._sum.balance);

  // Only movements tied to patrimony-affecting accounts (CHECKING/SAVINGS/INVESTMENT
  // or no linked account — those are user-recorded but don't move any balance,
  // so we ignore them for the chart to keep it consistent with currentBalance).
  const isPatrimonyMov = (m: { accountId: string | null; account: { type: string } | null }) =>
    !!m.accountId && m.account?.type !== "CREDIT";

  const endOfTo = period.to;

  // Sum of movements *after* the period end — used to back-solve the balance
  // at the end of `period.to`.
  let sumAfterTo = 0;
  const byDay = new Map<string, number>();
  for (const m of allMovs) {
    if (!isPatrimonyMov(m)) continue;
    const amount = decimalToNumber(m.amount);
    if (m.occurredAt > endOfTo) {
      sumAfterTo += amount;
    } else {
      const d = m.occurredAt;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      byDay.set(key, (byDay.get(key) ?? 0) + amount);
    }
  }

  const balanceAtPeriodEnd = currentBalance - sumAfterTo;

  // Walk backwards from period.to → period.from, recording end-of-day balance.
  const values: number[] = [];
  const cursor = new Date(
    period.to.getFullYear(),
    period.to.getMonth(),
    period.to.getDate(),
  );
  const start = new Date(
    period.from.getFullYear(),
    period.from.getMonth(),
    period.from.getDate(),
  );

  let running = balanceAtPeriodEnd;
  // Cap series length to avoid pathological ranges blowing up SVG.
  const MAX_POINTS = 365;
  while (cursor >= start && values.length < MAX_POINTS) {
    values.unshift(running);
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    running -= byDay.get(key) ?? 0;
    cursor.setDate(cursor.getDate() - 1);
  }

  if (values.length === 0) {
    return { values: [], min: 0, max: 0, mid: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const mid = (min + max) / 2;
  return { values, min, max, mid };
}

export async function creditTotals(tenantId: string) {
  const cards = await db.creditCard.findMany({
    where: { tenantId },
    include: { invoices: { where: { status: { not: "PAID" } } } },
  });

  const totalLimit = 0;
  let used = 0;
  let nextInvoiceAmount = 0;
  let nextDue: Date | null = null;
  for (const c of cards) {
    for (const inv of c.invoices) {
      used += decimalToNumber(inv.amount);
      if (!nextDue || inv.dueAt < nextDue) {
        nextDue = inv.dueAt;
        nextInvoiceAmount = decimalToNumber(inv.amount);
      }
    }
  }
  return { cardsCount: cards.length, totalLimit, used, nextDue, nextInvoiceAmount };
}
