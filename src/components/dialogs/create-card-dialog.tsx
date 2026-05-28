"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormDialog, Field, TextField } from "./form-dialog";
import { createCreditCard } from "@/lib/actions/credit";

export function CreateCardDialog({
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
            + Adicionar cartão
          </Button>
        )}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Novo cartão de crédito"
        submitLabel="Criar cartão"
        action={createCreditCard}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Banco" htmlFor="bankName">
            <TextField id="bankName" name="bankName" placeholder="Itaú" required />
          </Field>
          <Field label="Produto" htmlFor="product">
            <TextField
              id="product"
              name="product"
              placeholder="Personnalité"
              required
            />
          </Field>
        </div>
        <Field label="Número mascarado" htmlFor="numberMask">
          <TextField
            id="numberMask"
            name="numberMask"
            placeholder="•••• •••• •••• 8120"
          />
        </Field>
        <Field label="Titular" htmlFor="holder">
          <TextField id="holder" name="holder" placeholder="Nome impresso" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Validade" htmlFor="expiry" hint="MM/AA">
            <TextField id="expiry" name="expiry" placeholder="10/29" required />
          </Field>
          <Field label="Limite usado (%)" htmlFor="utilizationPct">
            <TextField
              id="utilizationPct"
              name="utilizationPct"
              type="number"
              min={0}
              max={100}
              defaultValue={0}
            />
          </Field>
        </div>
      </FormDialog>
    </>
  );
}
