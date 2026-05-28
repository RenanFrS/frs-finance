import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full whitespace-nowrap font-mono uppercase tracking-[0.16em] transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px",
        outline:
          "border border-border bg-background text-foreground hover:bg-secondary hover:border-foreground/30",
        ghost: "text-foreground hover:bg-secondary",
        secondary: "bg-secondary text-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "rounded-none px-0 tracking-normal normal-case text-primary underline-offset-4 hover:underline font-body",
      },
      size: {
        default: "h-9 px-4 text-[11px]",
        xs: "h-7 px-2.5 text-[10px]",
        sm: "h-8 px-3 text-[10.5px]",
        md: "h-9 px-4 text-[11px]",
        lg: "h-12 px-6 text-[12.5px]",
        icon: "size-9 px-0",
        "icon-xs": "size-6 px-0",
        "icon-sm": "size-7 px-0",
        "icon-lg": "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
