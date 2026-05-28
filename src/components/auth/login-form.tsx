"use client";

import * as React from "react";
import { AuthTabs, Eyebrow } from "@/components/auth/auth-frame";
import { FrsButton } from "@/components/ui/frs-button";
import { loginAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [keepSigned, setKeepSigned] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Verifique seu e-mail e senha.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("remember", keepSigned ? "on" : "off");

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <AuthTabs active="login" />
      <Eyebrow>Bem-vindo de volta</Eyebrow>
      <h1 className="font-display font-bold text-[clamp(36px,4.5vw,48px)] leading-[1.05] tracking-[-0.018em] text-foreground">
        Entre na sua{" "}
        <span className="italic font-medium text-primary">conta</span>.
      </h1>
      <p className="text-[15px] text-muted-foreground -mt-2">
        Conecte-se para ver saldo, crédito e investimentos consolidados.
      </p>

      <div className="grid gap-2 mt-2">
        <label htmlFor="email" className="mono-meta text-foreground/80">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          className={cn(
            "h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors",
            error && "border-destructive focus:ring-destructive/20",
          )}
          disabled={pending}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="mono-meta text-foreground/80">
            Senha
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={cn(
            "h-12 rounded-[12px] border border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors",
            error && "border-destructive focus:ring-destructive/20",
          )}
          disabled={pending}
        />
        {error && (
          <p className="text-[12px] text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none mt-1">
        <span
          className={cn(
            "size-[18px] rounded-[5px] border border-input grid place-items-center transition-colors",
            keepSigned && "bg-primary border-primary text-primary-foreground",
          )}
          onClick={() => setKeepSigned((v) => !v)}
        >
          {keepSigned && (
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
          checked={keepSigned}
          onChange={(e) => setKeepSigned(e.target.checked)}
        />
        <span className="text-[14px] text-foreground/85">
          Manter conectado neste dispositivo
        </span>
      </label>

      <FrsButton
        variant="primary"
        size="lg"
        type="submit"
        className="w-full mt-2"
        disabled={pending}
      >
        <span>{pending ? "Entrando…" : "Entrar"}</span>
        {!pending && <span aria-hidden>→</span>}
      </FrsButton>

      <p className="mono-meta text-muted-foreground text-center mt-6">
        Não tem conta?{" "}
        <a
          href="/register"
          className="text-foreground underline decoration-primary/40 underline-offset-4"
        >
          Crie a sua →
        </a>
      </p>
    </form>
  );
}
