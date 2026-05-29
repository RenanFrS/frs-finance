"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ActionResult =
  | { error: string }
  | { ok: true }
  | undefined
  | void;

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Salvar",
  action,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  action: (fd: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  // Clear the error when the dialog closes. Adjusting state during render
  // (instead of in an effect) avoids a cascading re-render.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setError(null);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(fd);
      if (result && typeof result === "object" && "error" in result && result.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[480px]", className)}>
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-semibold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-[13px]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form ref={formRef} onSubmit={onSubmit} className="grid gap-3.5">
          {children}

          {error && (
            <p
              className="text-[12px] text-destructive rounded-[10px] border border-destructive/30 bg-destructive/10 px-3 py-2"
              role="alert"
            >
              {error}
            </p>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Salvando…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="mono-meta text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && (
        <span className="font-mono text-[10px] tracking-[0.05em] text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  );
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-[10px] border border-input bg-card px-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors",
        props.className,
      )}
    />
  );
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-[10px] border border-input bg-card px-3 text-[14px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors",
        props.className,
      )}
    />
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
}) {
  const [pending, startTransition] = React.useTransition();
  function handle() {
    startTransition(async () => {
      await onConfirm();
      onOpenChange(false);
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-semibold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            size="sm"
            onClick={handle}
            disabled={pending}
          >
            {pending ? "Aguarde…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
