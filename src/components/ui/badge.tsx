import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full whitespace-nowrap font-mono uppercase tracking-[0.18em] text-[10px] px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
  {
    variants: {
      variant: {
        default:
          "border border-border text-muted-foreground bg-transparent",
        primary:
          "border border-primary/30 bg-primary/10 text-primary",
        positive:
          "border border-[color:var(--positive)]/30 text-positive bg-[color:var(--positive)]/10",
        negative:
          "border border-[color:var(--negative)]/30 text-negative bg-[color:var(--negative)]/10",
        gold:
          "border border-[color:var(--gold)]/30 text-gold bg-[color:var(--gold)]/10",
        outline:
          "border border-border text-foreground bg-background",
        secondary:
          "border border-border bg-secondary text-secondary-foreground",
        destructive:
          "border border-destructive/30 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
