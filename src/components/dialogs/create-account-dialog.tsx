"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormDialog, Field, TextField, SelectField } from "./form-dialog";
import { createBankAccount } from "@/lib/actions/accounts";

export function CreateAccountDialog({
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
            + Adicionar conta
          </Button>
        )}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Nova conta bancária"
        description="Cadastre uma conta manualmente. Para sincronizar via Open Finance, use a página de Conexões."
        submitLabel="Criar conta"
        action={createBankAccount}
      >
        <Field label="Banco" htmlFor="bankName">
          <TextField
            id="bankName"
            name="bankName"
            placeholder="Nubank, Itaú, XP…"
            required
          />
        </Field>
        <Field
          label="Apelido"
          htmlFor="nickname"
          hint="opcional — facilita identificar"
        >
          <TextField
            id="nickname"
            name="nickname"
            placeholder="Conta salário, Reserva, Cartão da viagem…"
          />
        </Field>
        <Field label="Tipo" htmlFor="type">
          <SelectField id="type" name="type" defaultValue="CHECKING">
            <option value="CHECKING">Conta corrente</option>
            <option value="SAVINGS">Poupança</option>
            <option value="INVESTMENT">Investimento</option>
            <option value="CREDIT">Crédito</option>
          </SelectField>
        </Field>
        <Field label="Número / agência" htmlFor="number">
          <TextField id="number" name="number" placeholder="••• 4421" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Saldo atual" htmlFor="balance">
            <TextField
              id="balance"
              name="balance"
              inputMode="decimal"
              placeholder="0,00"
              defaultValue="0"
            />
          </Field>
          <Field label="Disponível" htmlFor="available">
            <TextField
              id="available"
              name="available"
              inputMode="decimal"
              placeholder="0,00"
            />
          </Field>
        </div>
      </FormDialog>
    </>
  );
}
