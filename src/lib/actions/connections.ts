"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function createBankConnection(formData: FormData) {
  const session = await requireSession();

  const bankName = String(formData.get("bankName") ?? "").trim();
  const providerRaw = String(formData.get("provider") ?? "manual").trim();
  const scopesRaw = String(formData.get("scopes") ?? "").trim();
  const consentDays = Number(formData.get("consentDays") ?? 180);

  if (!bankName) return { error: "Nome do banco é obrigatório." };

  const scopes = scopesRaw
    ? scopesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const consentExpiry =
    Number.isFinite(consentDays) && consentDays > 0
      ? new Date(Date.now() + consentDays * 24 * 60 * 60 * 1000)
      : null;

  try {
    await db.bankConnection.create({
      data: {
        tenantId: session.tenant.id,
        bankName,
        provider: providerRaw || "manual",
        scopes,
        consentExpiry,
        active: true,
      },
    });
  } catch (err) {
    console.error("[createBankConnection]", err);
    return { error: "Falha ao registrar conexão." };
  }

  revalidatePath("/conexoes");
  revalidatePath("/contas");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function deleteBankConnection(connectionId: string) {
  const session = await requireSession();
  await db.bankConnection.deleteMany({
    where: { id: connectionId, tenantId: session.tenant.id },
  });
  revalidatePath("/conexoes");
  return { ok: true } as const;
}
