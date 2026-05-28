"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { parseInputDate } from "@/lib/format";

const TYPES = ["EXPENSE", "INCOME", "TRANSFER", "INVESTMENT"] as const;
type MovementType = (typeof TYPES)[number];

function parseAmount(input: string): number | null {
  if (!input) return null;
  const normalized = input
    .replace(/[^0-9,.\-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export async function createMovement(formData: FormData) {
  const session = await requireSession();

  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "EXPENSE") as MovementType;
  const amountInput = parseAmount(String(formData.get("amount") ?? ""));
  const accountId = String(formData.get("accountId") ?? "").trim() || null;
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const occurredAtRaw = String(formData.get("occurredAt") ?? "").trim();

  if (!description) return { error: "Descrição é obrigatória." };
  if (!TYPES.includes(type)) return { error: "Tipo inválido." };
  if (amountInput === null) return { error: "Valor inválido." };

  const occurredAt = occurredAtRaw ? parseInputDate(occurredAtRaw) : new Date();
  if (!occurredAt || Number.isNaN(occurredAt.getTime())) {
    return { error: "Data inválida." };
  }

  // store signed amount: expenses negative, income/transfers positive
  const signedAmount =
    type === "EXPENSE" ? -Math.abs(amountInput) : Math.abs(amountInput);

  try {
    await db.$transaction(async (tx) => {
      await tx.movement.create({
        data: {
          tenantId: session.tenant.id,
          description,
          type,
          source: "MANUAL",
          amount: new Prisma.Decimal(signedAmount.toFixed(2)),
          occurredAt,
          accountId,
          categoryId,
        },
      });
      if (accountId) {
        await tx.bankAccount.update({
          where: { id: accountId },
          data: {
            balance: { increment: new Prisma.Decimal(signedAmount.toFixed(2)) },
            available: { increment: new Prisma.Decimal(signedAmount.toFixed(2)) },
          },
        });
      }
    });
  } catch (err) {
    console.error("[createMovement]", err);
    return { error: "Falha ao registrar movimento." };
  }

  revalidatePath("/movimentos");
  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function deleteMovement(movementId: string) {
  const session = await requireSession();
  const m = await db.movement.findFirst({
    where: { id: movementId, tenantId: session.tenant.id },
  });
  if (!m) return { ok: true } as const;

  await db.$transaction(async (tx) => {
    await tx.movement.delete({ where: { id: m.id } });
    if (m.accountId) {
      await tx.bankAccount.update({
        where: { id: m.accountId },
        data: {
          balance: { decrement: m.amount },
          available: { decrement: m.amount },
        },
      });
    }
  });

  revalidatePath("/movimentos");
  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}
