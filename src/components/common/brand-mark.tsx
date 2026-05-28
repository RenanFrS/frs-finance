import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("logo-mark text-foreground", className)}
      style={{ width: size, height: Math.round(size * 0.72) }}
    />
  );
}

export function Wordmark({
  className,
  showSub = true,
}: {
  className?: string;
  showSub?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display font-semibold text-[15px] tracking-[0.01em] text-foreground",
        className,
      )}
    >
      FrS
      {showSub && (
        <span className="ml-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium">
          FINANCE
        </span>
      )}
    </span>
  );
}
