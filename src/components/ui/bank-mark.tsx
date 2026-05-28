import * as React from "react";
import { cn } from "@/lib/utils";

const BANK_COLORS: Record<string, string> = {
  Nubank: "#8A05BE",
  "Itaú": "#EC7000",
  Itau: "#EC7000",
  XP: "#004D40",
  Inter: "#FF7A00",
  "C6 Bank": "#222222",
  Caixa: "#005CA9",
  "BTG Pactual": "#0A1A2F",
  "Banco do Brasil": "#FFEF38",
  Santander: "#EC0000",
  Bradesco: "#CC092F",
  Sicoob: "#003641",
};

const TEXT_OVERRIDE: Record<string, string> = {
  "Banco do Brasil": "#1A1308",
};

export interface BankMarkProps {
  name: string;
  size?: number;
  className?: string;
}

export function BankMark({ name, size = 30, className }: BankMarkProps) {
  const color = BANK_COLORS[name] ?? "var(--foreground)";
  const text = TEXT_OVERRIDE[name] ?? "white";
  const initial = name.replace(/^Banco do /, "B")[0] ?? "?";
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center font-display font-bold rounded-[10px]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: color,
        color: text,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {initial}
    </span>
  );
}

export { BANK_COLORS };
