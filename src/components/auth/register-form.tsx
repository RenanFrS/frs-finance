"use client";

import * as React from "react";
import { AuthTabs, Eyebrow } from "@/components/auth/auth-frame";
import { FrsButton } from "@/components/ui/frs-button";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { initialsFromParts } from "@/lib/initials";
import { registerAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [accepted, setAccepted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const liveName = `${first} ${last}`.trim() || "Novo Usuário";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (first.length < 2 || last.length < 2) {
      setError("Informe nome e sobrenome.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("E-mail inválido.");
      return;
    }
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError("Senha precisa de 8+ caracteres com 1 número e 1 símbolo.");
      return;
    }
    if (!accepted) {
      setError("Aceite os termos para continuar.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.set("firstName", first);
    formData.set("lastName", last);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("accepted", "on");

    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <AuthTabs active="register" />
      <Eyebrow>Comece em 60 segundos</Eyebrow>
      <h1 className="font-display font-bold text-[clamp(36px,4.5vw,48px)] leading-[1.05] tracking-[-0.018em] text-foreground">
        Crie sua{" "}
        <span className="italic font-medium text-primary">conta</span>.
      </h1>
      <p className="text-[15px] text-muted-foreground -mt-2">
        Nome completo gera suas iniciais no avatar. Você pode trocar por uma
        foto depois.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="grid gap-2">
          <label htmlFor="first" className="mono-meta text-foreground/80">
            Nome
          </label>
          <input
            id="first"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="João"
            className="h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
            disabled={pending}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="last" className="mono-meta text-foreground/80">
            Sobrenome
          </label>
          <input
            id="last"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            placeholder="Pessoa"
            className="h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
            disabled={pending}
          />
        </div>
      </div>

      <div className="rounded-[16px] border border-dashed border-border bg-secondary p-4 flex items-center gap-4">
        <InitialsAvatar name={liveName} size="lg" halo />
        <div className="grid gap-1">
          <span className="mono-meta text-foreground/80">Avatar inicial</span>
          <p className="text-[13px] text-muted-foreground leading-[1.4]">
            Gerado das iniciais{" "}
            <span className="font-mono text-foreground">
              ({initialsFromParts(first, last) || "—"})
            </span>
            . Você pode enviar uma foto após o cadastro.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="mono-meta text-foreground/80">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          className="h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
          disabled={pending}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="mono-meta text-foreground/80">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
          disabled={pending}
        />
        <p className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
          Mín. 8 caracteres · 1 número · 1 símbolo
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none mt-1">
        <span
          className={cn(
            "mt-[2px] size-[18px] shrink-0 rounded-[5px] border border-input grid place-items-center transition-colors",
            accepted && "bg-primary border-primary text-primary-foreground",
          )}
          onClick={() => setAccepted((v) => !v)}
        >
          {accepted && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6.2 5 8.5 9.5 3.7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span className="text-[13px] text-foreground/85 leading-[1.4]">
          Aceito os{" "}
          <a href="#" className="text-primary underline underline-offset-4">
            Termos
          </a>{" "}
          e a{" "}
          <a href="#" className="text-primary underline underline-offset-4">
            Política de privacidade
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="text-[12px] text-destructive" role="alert">
          {error}
        </p>
      )}

      <FrsButton
        variant="primary"
        size="lg"
        type="submit"
        disabled={!accepted || pending}
        className="w-full mt-2"
      >
        <span>{pending ? "Criando…" : "Criar conta"}</span>
        {!pending && <span aria-hidden>→</span>}
      </FrsButton>

      <p className="mono-meta text-muted-foreground text-center mt-6">
        Já tem conta?{" "}
        <a
          href="/login"
          className="text-foreground underline decoration-primary/40 underline-offset-4"
        >
          Entrar →
        </a>
      </p>
    </form>
  );
}
