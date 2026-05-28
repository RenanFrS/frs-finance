"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

function parseAmount(input: string): number | null {
  if (!input) return null;
  const normalized = input
    .replace(/[^0-9,.\-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export async function createCategory(formData: FormData) {
  const session = await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const letter = String(formData.get("letter") ?? "")
    .trim()
    .slice(0, 1)
    .toUpperCase();
  const color = String(formData.get("color") ?? "").trim() || null;
  const budgetRaw = String(formData.get("budget") ?? "").trim();
  const parentId = String(formData.get("parentId") ?? "").trim() || null;

  if (!name) return { error: "Nome da categoria é obrigatório." };
  const budget = budgetRaw ? parseAmount(budgetRaw) : null;
  if (budgetRaw && budget === null) return { error: "Orçamento inválido." };

  try {
    await db.category.create({
      data: {
        tenantId: session.tenant.id,
        name,
        letter: letter || name[0]?.toUpperCase() || null,
        color,
        parentId,
        budget: budget !== null ? new Prisma.Decimal(budget.toFixed(2)) : null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Já existe uma categoria com esse nome." };
    }
    console.error("[createCategory]", err);
    return { error: "Falha ao criar categoria." };
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function deleteCategory(categoryId: string) {
  const session = await requireSession();
  await db.category.deleteMany({
    where: { id: categoryId, tenantId: session.tenant.id },
  });
  revalidatePath("/categorias");
  return { ok: true } as const;
}
