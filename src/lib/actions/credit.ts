"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { parseInputDate } from "@/lib/format";

export async function createCreditCard(formData: FormData) {
  const session = await requireSession();

  const bankName = String(formData.get("bankName") ?? "").trim();
  const product = String(formData.get("product") ?? "").trim();
  const numberMask = String(formData.get("numberMask") ?? "").trim();
  const holder = String(formData.get("holder") ?? "").trim();
  const expiry = String(formData.get("expiry") ?? "").trim();
  const utilizationPctRaw = Number(formData.get("utilizationPct") ?? 0);
  const utilizationPct = Number.isFinite(utilizationPctRaw)
    ? Math.max(0, Math.min(100, Math.round(utilizationPctRaw)))
    : 0;

  if (!bankName) return { error: "Banco é obrigatório." };
  if (!product) return { error: "Produto é obrigatório." };
  if (!holder) return { error: "Titular é obrigatório." };
  if (!expiry) return { error: "Validade (MM/AA) é obrigatória." };

  try {
    await db.creditCard.create({
      data: {
        tenantId: session.tenant.id,
        bankName,
        product,
        numberMask: numberMask || "•••• •••• •••• ••••",
        holder,
        expiry,
        utilizationPct,
      },
    });
  } catch (err) {
    console.error("[createCreditCard]", err);
    return { error: "Falha ao criar cartão." };
  }

  revalidatePath("/credito");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

function parseAmount(input: string): number | null {
  if (!input) return null;
  const normalized = input
    .replace(/[^0-9,.\-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export async function createInvoice(formData: FormData) {
  const session = await requireSession();
  const cardId = String(formData.get("cardId") ?? "").trim();
  const amountRaw = parseAmount(String(formData.get("amount") ?? ""));
  const closingAtRaw = String(formData.get("closingAt") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "").trim();

  if (!cardId) return { error: "Cartão é obrigatório." };
  if (amountRaw === null) return { error: "Valor inválido." };
  if (!closingAtRaw || !dueAtRaw) return { error: "Datas são obrigatórias." };

  const closingAt = parseInputDate(closingAtRaw);
  const dueAt = parseInputDate(dueAtRaw);
  if (!closingAt || !dueAt) return { error: "Datas inválidas." };

  try {
    await db.invoice.create({
      data: {
        tenantId: session.tenant.id,
        cardId,
        amount: new Prisma.Decimal(amountRaw.toFixed(2)),
        closingAt,
        dueAt,
        status: "OPEN",
      },
    });
  } catch (err) {
    console.error("[createInvoice]", err);
    return { error: "Falha ao registrar fatura." };
  }

  revalidatePath("/credito");
  return { ok: true } as const;
}

export async function markInvoicePaid(invoiceId: string) {
  const session = await requireSession();
  await db.invoice.updateMany({
    where: { id: invoiceId, tenantId: session.tenant.id },
    data: { status: "PAID" },
  });
  revalidatePath("/credito");
  return { ok: true } as const;
}
