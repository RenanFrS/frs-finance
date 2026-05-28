import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthFrame({ children, className }: AuthFrameProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background",
        className,
      )}
    >
      {/* Art panel */}
      <div
        className="relative overflow-hidden text-[oklch(0.97_0.018_80)] order-1 lg:order-1 min-h-[320px] lg:min-h-screen"
        style={{
          background:
            "radial-gradient(110% 75% at 18% 12%, oklch(0.48 0.135 45 / 0.65), transparent 60%), radial-gradient(85% 65% at 90% 100%, oklch(0.72 0.10 80 / 0.35), transparent 60%), linear-gradient(160deg, #3d2c1f, #261b13 55%, #1a120c)",
        }}
      >
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay pointer-events-none"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 38px, rgba(255,245,225,0.9) 38px, rgba(255,245,225,0.9) 39px)",
          }}
        />

        <div className="relative z-[2] h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
          <div className="flex items-start gap-3">
            <div
              className="rounded-[10px] border border-white/20 p-3 flex items-center justify-center bg-white/5 backdrop-blur-[1px]"
              style={{ width: 56, height: 56 }}
            >
              <span
                className="logo-mark"
                style={{
                  width: 32,
                  height: 22,
                  backgroundColor: "oklch(0.97 0.018 80)",
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-[20px]">
                FrS Finance
              </div>
              <div className="mono-meta text-white/55 mt-1">
                Planejador · MMXXVI
              </div>
            </div>
          </div>

          <div className="max-w-[480px] my-12 lg:my-0">
            <p className="font-display italic font-medium text-[clamp(26px,3.2vw,44px)] leading-[1.15] text-white/92">
              “O patrimônio se conserva mais pela atenção diária do que pelo
              grande lance.”
            </p>
            <p className="mt-6 mono-meta text-white/55">
              — <span className="ml-1">Cadastro pessoal de F.S., 1928</span>
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 mono-meta whitespace-nowrap text-white/55 tracking-[0.28em]">
              <span>SP · BR</span>
              <span className="text-[oklch(0.70_0.13_50)]">◆</span>
              <span>OPEN FINANCE</span>
              <span className="text-[oklch(0.70_0.13_50)]">◆</span>
              <span>SSL · 256</span>
              <span className="text-[oklch(0.70_0.13_50)]">◆</span>
              <span>v0.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="bg-background order-2 flex items-center justify-center p-6 md:p-10 lg:p-14 min-h-[60vh] lg:min-h-screen">
        <div className="w-full max-w-[460px]">{children}</div>
      </div>
    </div>
  );
}

export function AuthTabs({ active }: { active: "login" | "register" }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1 mb-8">
      <a
        href="/login"
        data-active={active === "login"}
        className="px-5 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground data-[active=true]:bg-foreground data-[active=true]:text-background transition-colors"
      >
        Entrar
      </a>
      <a
        href="/register"
        data-active={active === "register"}
        className="px-5 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground data-[active=true]:bg-foreground data-[active=true]:text-background transition-colors"
      >
        Criar conta
      </a>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="block h-px w-6 bg-foreground" />
      <span className="eyebrow text-primary">{children}</span>
    </div>
  );
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <span className="flex-1 h-px bg-border" />
      <span className="mono-meta text-muted-foreground">{children}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
