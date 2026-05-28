"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme, type Palette, type Theme } from "@/components/theme/theme-provider";
import { updateProfile } from "@/lib/actions/profile";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const PALETTES: { v: Palette; n: string; d: string; colors: string[] }[] = [
  {
    v: "terracota",
    n: "Terracota Brûlée",
    d: "Padrão · sépia + acento quente",
    colors: [
      "oklch(0.48 0.135 45)",
      "oklch(0.965 0.012 78)",
      "oklch(0.215 0.022 50)",
      "oklch(0.72 0.10 80)",
    ],
  },
  {
    v: "bordo",
    n: "Bordô Reserva",
    d: "Acento profundo · biblioteca",
    colors: [
      "oklch(0.40 0.115 22)",
      "oklch(0.965 0.012 78)",
      "oklch(0.215 0.022 50)",
      "oklch(0.72 0.10 80)",
    ],
  },
  {
    v: "verde",
    n: "Verde Cofre",
    d: "Garrafa · contabilidade clássica",
    colors: [
      "oklch(0.36 0.05 165)",
      "oklch(0.965 0.012 78)",
      "oklch(0.215 0.022 50)",
      "oklch(0.72 0.10 80)",
    ],
  },
];

const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function PreferenciasForm({
  user,
  tenant,
  role,
}: {
  user: { firstName: string; lastName: string; email: string };
  tenant: { id: string; name: string; slug: string };
  role: "OWNER" | "EDITOR" | "VIEWER";
}) {
  const { theme, palette, setTheme, setPalette } = useTheme();
  const [first, setFirst] = React.useState(user.firstName);
  const [last, setLast] = React.useState(user.lastName);
  const [email, setEmail] = React.useState(user.email);
  const [status, setStatus] = React.useState<
    | { kind: "ok"; msg: string }
    | { kind: "error"; msg: string }
    | null
  >(null);
  const [pendingSave, startSave] = React.useTransition();
  const [pendingLogout, startLogout] = React.useTransition();

  function reset() {
    setFirst(user.firstName);
    setLast(user.lastName);
    setEmail(user.email);
    setStatus(null);
  }

  function save() {
    setStatus(null);
    const fd = new FormData();
    fd.set("firstName", first);
    fd.set("lastName", last);
    fd.set("email", email);
    startSave(async () => {
      const result = await updateProfile(fd);
      if (result && "error" in result && typeof result.error === "string") {
        setStatus({ kind: "error", msg: result.error });
      } else {
        setStatus({ kind: "ok", msg: "Perfil atualizado." });
      }
    });
  }

  function logout() {
    startLogout(async () => {
      await logoutAction();
    });
  }

  const displayName = `${first} ${last}`.trim() || "Usuário";

  return (
    <div className="grid gap-5">
      {/* Aparência */}
      <div className="rounded-[20px] border border-border bg-card p-5 grid gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-border">
          <h3 className="font-display font-semibold text-[18px]">Aparência</h3>
          <span className="mono-meta text-muted-foreground">
            Aplicado ao tenant ativo · {tenant.name}
          </span>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-[200px_1fr] pt-1">
          <div>
            <Label className="mono-meta text-muted-foreground">Tema</Label>
            <p className="text-[13.5px] text-muted-foreground mt-1">
              Escolha como o app aparece nos seus dispositivos.
            </p>
          </div>
          <div className="inline-flex bg-background border border-border rounded-full p-0.5 w-fit">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "font-mono text-[10px] tracking-[0.16em] uppercase px-3.5 py-1.5 rounded-full transition font-medium",
                  theme === t.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-[200px_1fr] pt-4 border-t border-dashed border-border">
          <div>
            <Label className="mono-meta text-muted-foreground">Paleta</Label>
            <p className="text-[13.5px] text-muted-foreground mt-1">
              Acento da marca em botões, gráficos e destaques.
            </p>
          </div>
          <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3">
            {PALETTES.map((p) => (
              <button
                key={p.v}
                onClick={() => setPalette(p.v)}
                className={cn(
                  "rounded-2xl p-4 border bg-background text-left grid gap-2.5 transition",
                  palette === p.v
                    ? "border-foreground bg-card"
                    : "border-border hover:border-foreground/40",
                )}
              >
                <div className="flex gap-1">
                  {p.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-[22px] h-[22px] rounded-full"
                      style={{
                        background: c,
                        boxShadow: "inset 0 0 0 2px var(--background)",
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div className="font-display font-semibold text-[15px]">
                    {p.n}
                  </div>
                  <div className="mono-meta text-muted-foreground mt-1">
                    {p.d}
                  </div>
                </div>
                {palette === p.v && (
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-primary">
                    ● selecionada
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Perfil */}
      <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
        <div className="flex items-baseline justify-between pb-3 border-b border-border">
          <h3 className="font-display font-semibold text-[18px]">Perfil</h3>
          <span className="mono-meta text-muted-foreground">
            {tenant.name} · {role}
          </span>
        </div>
        <div className="flex items-center gap-3.5 pb-3.5 border-b border-dashed border-border">
          <Avatar name={displayName} size={56} />
          <div>
            <div className="font-display font-semibold text-[16px]">
              {displayName}
            </div>
            <div className="mono-meta text-muted-foreground mt-0.5">
              {email} · {role} em {tenant.name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label
              className="mono-meta text-muted-foreground"
              htmlFor="firstName"
            >
              Nome
            </Label>
            <Input
              id="firstName"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              disabled={pendingSave}
            />
          </div>
          <div className="grid gap-1.5">
            <Label
              className="mono-meta text-muted-foreground"
              htmlFor="lastName"
            >
              Sobrenome
            </Label>
            <Input
              id="lastName"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              disabled={pendingSave}
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label className="mono-meta text-muted-foreground" htmlFor="email">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pendingSave}
          />
        </div>

        {status && (
          <p
            className={cn(
              "text-[12px] rounded-[10px] px-3 py-2 border",
              status.kind === "ok"
                ? "text-positive border-positive/30 bg-positive/10"
                : "text-destructive border-destructive/30 bg-destructive/10",
            )}
            role={status.kind === "error" ? "alert" : "status"}
          >
            {status.msg}
          </p>
        )}

        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={reset}
            disabled={pendingSave}
          >
            Descartar
          </Button>
          <Button
            size="sm"
            type="button"
            onClick={save}
            disabled={pendingSave}
          >
            {pendingSave ? "Salvando…" : "Salvar alterações"}
          </Button>
        </div>
      </div>

      {/* Sessão */}
      <div className="rounded-[20px] border border-border bg-card p-5 grid gap-3.5">
        <div className="flex items-baseline justify-between pb-3 border-b border-border">
          <h3 className="font-display font-semibold text-[18px]">
            Sessão & segurança
          </h3>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div>
            <div className="text-[14px] text-foreground">
              Encerrar sessão neste dispositivo
            </div>
            <div className="mono-meta text-muted-foreground mt-0.5">
              Você precisará entrar novamente.
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            disabled={pendingLogout}
          >
            {pendingLogout ? "Saindo…" : "Sair"}
          </Button>
        </div>
      </div>
    </div>
  );
}
