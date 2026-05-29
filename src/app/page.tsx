import { redirect } from "next/navigation";

import { Landing } from "@/components/landing";
import { readSessionPayload } from "@/lib/session";

export const metadata = {
  title: "FrS Finance — Dinheiro com compostura",
  description:
    "O planejador financeiro pessoal que reúne bancos, cartões e investimentos em uma só vista. Open Finance + WhatsApp. 7 dias grátis.",
};

export default async function HomePage() {
  // Visitantes deslogados veem a landing; quem já tem sessão vai direto pro app.
  const session = await readSessionPayload();
  if (session) redirect("/dashboard");

  return <Landing />;
}
