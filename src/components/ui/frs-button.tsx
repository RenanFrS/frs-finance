import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const frsButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-mono uppercase tracking-[0.15em] whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-foreground text-foreground hover:bg-foreground hover:text-background",
        ghost: "text-primary hover:bg-primary/10",
        soft: "bg-secondary text-foreground hover:bg-accent",
      },
      size: {
        sm: "h-9 px-3.5 text-[11px]",
        md: "h-11 px-5 text-xs",
        lg: "h-14 px-7 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type FrsButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof frsButtonVariants> & {
    asChild?: boolean;
  };

export function FrsButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: FrsButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="frs-button"
      className={cn(frsButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { frsButtonVariants };
