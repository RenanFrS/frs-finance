"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormDialog, Field, TextField } from "./form-dialog";
import { createCategory } from "@/lib/actions/categories";

export function CreateCategoryDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger ?? (
          <Button size="sm" type="button">
            + Nova categoria
          </Button>
        )}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Nova categoria"
        description="Categorias agrupam movimentos e ajudam a orçar."
        submitLabel="Criar categoria"
        action={createCategory}
      >
        <Field label="Nome" htmlFor="name">
          <TextField
            id="name"
            name="name"
            placeholder="Alimentação, Transporte…"
            required
          />
        </Field>
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <Field label="Inicial" htmlFor="letter" hint="1 letra">
            <TextField
              id="letter"
              name="letter"
              maxLength={1}
              placeholder="A"
            />
          </Field>
          <Field
            label="Cor (opcional)"
            htmlFor="color"
            hint="qualquer valor CSS"
          >
            <TextField id="color" name="color" placeholder="var(--primary)" />
          </Field>
        </div>
        <Field label="Orçamento mensal (opcional)" htmlFor="budget">
          <TextField
            id="budget"
            name="budget"
            inputMode="decimal"
            placeholder="0,00"
          />
        </Field>
      </FormDialog>
    </>
  );
}
