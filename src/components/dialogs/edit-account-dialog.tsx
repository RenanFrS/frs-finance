"use client";

import * as React from "react";
import { FormDialog, Field, TextField, SelectField } from "./form-dialog";
import { updateBankAccount } from "@/lib/actions/accounts";

export type EditableAccount = {
  id: string;
  bankName: string;
  nickname: string | null;
  number: string | null;
  type: "CHECKING" | "SAVINGS" | "INVESTMENT" | "CREDIT";
  balance: number;
  available: number;
};

export function EditAccountDialog({
  trigger,
  account,
}: {
  trigger: React.ReactNode;
  account: EditableAccount;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Editar conta bancária"
        submitLabel="Salvar alterações"
        action={updateBankAccount}
      >
        <input type="hidden" name="id" value={account.id} />
        <Field label="Banco" htmlFor={`bank-${account.id}`}>
          <TextField
            id={`bank-${account.id}`}
            name="bankName"
            defaultValue={account.bankName}
            required
          />
        </Field>
        <Field
          label="Apelido"
          htmlFor={`nick-${account.id}`}
          hint="opcional"
        >
          <TextField
            id={`nick-${account.id}`}
            name="nickname"
            defaultValue={account.nickname ?? ""}
            placeholder="Conta salário, Reserva…"
          />
        </Field>
        <Field label="Tipo" htmlFor={`type-${account.id}`}>
          <SelectField
            id={`type-${account.id}`}
            name="type"
            defaultValue={account.type}
          >
            <option value="CHECKING">Conta corrente</option>
            <option value="SAVINGS">Poupança</option>
            <option value="INVESTMENT">Investimento</option>
            <option value="CREDIT">Crédito</option>
          </SelectField>
        </Field>
        <Field label="Número / agência" htmlFor={`num-${account.id}`}>
          <TextField
            id={`num-${account.id}`}
            name="number"
            defaultValue={account.number ?? ""}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Saldo atual" htmlFor={`bal-${account.id}`}>
            <TextField
              id={`bal-${account.id}`}
              name="balance"
              inputMode="decimal"
              defaultValue={account.balance.toFixed(2).replace(".", ",")}
            />
          </Field>
          <Field label="Disponível" htmlFor={`avail-${account.id}`}>
            <TextField
              id={`avail-${account.id}`}
              name="available"
              inputMode="decimal"
              defaultValue={account.available.toFixed(2).replace(".", ",")}
            />
          </Field>
        </div>
      </FormDialog>
    </>
  );
}
