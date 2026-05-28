import { Prisma } from "@prisma/client";

export function decimalToNumber(v: Prisma.Decimal | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  return Number(v.toString());
}

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export function brlSplit(value: number): { int: string; dec: string } {
  const [int, dec] = Math.abs(value).toFixed(2).split(".");
  return { int: Number(int).toLocaleString("pt-BR"), dec };
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function shortDate(d: Date): string {
  return `${d.getDate().toString().padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
}

/**
 * Parse `YYYY-MM-DD` from a date input as local midnight. Using `new Date(s)`
 * would treat the string as UTC, shifting the day by one in negative offsets
 * (e.g. Brazil GMT-3).
 */
export function parseInputDate(input: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!m) {
    const fallback = new Date(input);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  return new Date(y, mo, d);
}

/**
 * Render a Date as YYYY-MM-DD using local fields. Use this to pre-fill
 * <input type="date"> values without timezone drift.
 */
export function toDateInputValue(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function relativeAgo(date: Date | null | undefined): string {
  if (!date) return "—";
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h`;
  const days = Math.floor(hr / 24);
  return `${days}d`;
}

export function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
