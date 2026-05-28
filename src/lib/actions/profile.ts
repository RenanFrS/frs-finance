"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function updateProfile(formData: FormData) {
  const session = await requireSession();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (firstName.length < 2 || lastName.length < 2) {
    return { error: "Informe nome e sobrenome (mín. 2 letras cada)." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail inválido." };
  }

  if (email !== session.user.email) {
    const exists = await db.user.findUnique({ where: { email } });
    if (exists && exists.id !== session.user.id) {
      return { error: "Este e-mail já está em uso." };
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, email },
  });

  revalidatePath("/preferencias");
  return { ok: true } as const;
}
