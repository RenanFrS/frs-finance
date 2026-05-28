"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export type FormResult = { error: string } | undefined;

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "tenant";
  for (let i = 0; i < 16; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const exists = await db.tenant.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export async function registerAction(formData: FormData): Promise<FormResult> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const accepted = formData.get("accepted") === "on" || formData.get("accepted") === "true";

  if (firstName.length < 2 || lastName.length < 2) {
    return { error: "Informe nome e sobrenome." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail inválido." };
  }
  if (password.length < 8 || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return { error: "Senha precisa ter 8+ caracteres, 1 número e 1 símbolo." };
  }
  if (!accepted) {
    return { error: "Aceite os termos para continuar." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Este e-mail já tem conta. Tente entrar." };
  }

  const tenantName = `${firstName} ${lastName}`.trim();
  const slug = await uniqueSlug(slugify(`${firstName}-${lastName}`));

  try {
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash: hashPassword(password),
          preferences: { create: {} },
        },
      });
      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug },
      });
      await tx.membership.create({
        data: { userId: user.id, tenantId: tenant.id, role: "OWNER" },
      });
      return { userId: user.id, tenantId: tenant.id };
    });

    await createSession({ userId: result.userId, tenantId: result.tenantId });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Conflito ao criar conta. Tente outro e-mail." };
    }
    console.error("[register] failed", err);
    return { error: "Falha ao criar conta. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") !== "off";

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const user = await db.user.findUnique({
    where: { email },
    include: {
      memberships: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha incorretos." };
  }

  const firstMembership = user.memberships[0];
  if (!firstMembership) {
    return { error: "Sua conta não tem um tenant ativo. Contate o suporte." };
  }

  await createSession({
    userId: user.id,
    tenantId: firstMembership.tenantId,
    rememberMe: remember,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function switchTenantAction(tenantId: string) {
  const { getCurrentSession } = await import("@/lib/session");
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id, tenantId },
  });
  if (!membership) {
    return { error: "Você não tem acesso a esse tenant." };
  }

  await createSession({ userId: session.user.id, tenantId });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
}
