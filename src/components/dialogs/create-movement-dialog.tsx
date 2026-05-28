"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormDialog, Field, TextField, SelectField } from "./form-dialog";
import { createMovement } from "@/lib/actions/movements";
import { toDateInputValue } from "@/lib/format";

export type AccountOption = { id: string; label: string };
export type CategoryOption = { id: string; label: string };

export function CreateMovementDialog({
  trigger,
  accounts,
  categories,
}: {
  trigger?: React.ReactNode;
  accounts: AccountOption[];
  categories: CategoryOption[];
}) {
  const [open, setOpen] = React.useState(false);
  const today = toDateInputValue();

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger ?? (
          <Button size="sm" type="button">
            + Registrar movimento
          </Button>
        )}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Registrar movimento"
        description="Despesa, receita, transferência ou aporte."
        submitLabel="Registrar"
        action={createMovement}
      >
        <Field label="Descrição" htmlFor="description">
          <TextField
            id="description"
            name="description"
            placeholder="Mercado, salário, aluguel…"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo" htmlFor="type">
            <SelectField id="type" name="type" defaultValue="EXPENSE">
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
              <option value="TRANSFER">Transferência</option>
              <option value="INVESTMENT">Investimento</option>
            </SelectField>
          </Field>
          <Field label="Valor" htmlFor="amount" hint="R$ — sem sinal">
            <TextField
              id="amount"
              name="amount"
              inputMode="decimal"
              placeholder="0,00"
              required
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Conta" htmlFor="accountId">
            <SelectField id="accountId" name="accountId" defaultValue="">
              <option value="">— sem conta —</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Categoria" htmlFor="categoryId">
            <SelectField id="categoryId" name="categoryId" defaultValue="">
              <option value="">— sem categoria —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </SelectField>
          </Field>
        </div>
        <Field label="Data" htmlFor="occurredAt">
          <TextField
            id="occurredAt"
            name="occurredAt"
            type="date"
            defaultValue={today}
          />
        </Field>
      </FormDialog>
    </>
  );
}
