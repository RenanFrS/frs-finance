"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

const TYPES = ["CHECKING", "SAVINGS", "INVESTMENT", "CREDIT"] as const;
type AccountType = (typeof TYPES)[number];

function parseAmount(input: string): number | null {
  if (!input) return null;
  const normalized = input
    .replace(/[^0-9,.\-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export async function createBankAccount(formData: FormData) {
  const session = await requireSession();

  const bankName = String(formData.get("bankName") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim() || null;
  const number = String(formData.get("number") ?? "").trim() || null;
  const type = String(formData.get("type") ?? "CHECKING") as AccountType;
  const balance = parseAmount(String(formData.get("balance") ?? "0")) ?? 0;
  const available =
    parseAmount(String(formData.get("available") ?? String(balance))) ?? balance;

  if (!bankName) return { error: "Nome do banco é obrigatório." };
  if (!TYPES.includes(type)) return { error: "Tipo de conta inválido." };

  try {
    await db.bankAccount.create({
      data: {
        tenantId: session.tenant.id,
        bankName,
        nickname,
        number,
        type,
        balance: new Prisma.Decimal(balance.toFixed(2)),
        available: new Prisma.Decimal(available.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("[createBankAccount]", err);
    return { error: "Falha ao criar conta." };
  }

  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function updateBankAccount(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const owned = await db.bankAccount.findFirst({
    where: { id, tenantId: session.tenant.id },
  });
  if (!owned) return { error: "Conta não encontrada." };

  const bankName = String(formData.get("bankName") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim() || null;
  const number = String(formData.get("number") ?? "").trim() || null;
  const type = String(formData.get("type") ?? owned.type) as AccountType;
  const balanceRaw = String(formData.get("balance") ?? "");
  const availableRaw = String(formData.get("available") ?? "");

  if (!bankName) return { error: "Nome do banco é obrigatório." };
  if (!TYPES.includes(type)) return { error: "Tipo de conta inválido." };

  const balance = balanceRaw ? parseAmount(balanceRaw) : null;
  if (balanceRaw && balance === null) return { error: "Saldo inválido." };
  const available = availableRaw ? parseAmount(availableRaw) : null;
  if (availableRaw && available === null) return { error: "Disponível inválido." };

  try {
    await db.bankAccount.update({
      where: { id },
      data: {
        bankName,
        nickname,
        number,
        type,
        ...(balance !== null
          ? { balance: new Prisma.Decimal(balance.toFixed(2)) }
          : {}),
        ...(available !== null
          ? { available: new Prisma.Decimal(available.toFixed(2)) }
          : {}),
      },
    });
  } catch (err) {
    console.error("[updateBankAccount]", err);
    return { error: "Falha ao atualizar conta." };
  }

  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function deleteBankAccount(accountId: string) {
  const session = await requireSession();
  await db.bankAccount.deleteMany({
    where: { id: accountId, tenantId: session.tenant.id },
  });
  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}
