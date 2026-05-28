"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FormDialog, Field, TextField, SelectField } from "./form-dialog";
import { createBankConnection } from "@/lib/actions/connections";

export function CreateConnectionDialog({
  trigger,
  bankName,
}: {
  trigger?: React.ReactNode;
  bankName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger ?? (
          <Button size="sm" type="button">
            + Conectar banco
          </Button>
        )}
      </span>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Conectar banco"
        description="Open Finance / Pluggy / Belvo virá numa próxima sprint. Por enquanto, cadastre a conexão manualmente para organizar os dados."
        submitLabel="Conectar"
        action={createBankConnection}
      >
        <Field label="Banco" htmlFor="bankName">
          <TextField
            id="bankName"
            name="bankName"
            defaultValue={bankName ?? ""}
            placeholder="Nubank, Itaú, XP…"
            required
          />
        </Field>
        <Field label="Provedor" htmlFor="provider">
          <SelectField id="provider" name="provider" defaultValue="manual">
            <option value="manual">Manual</option>
            <option value="pluggy">Pluggy</option>
            <option value="belvo">Belvo</option>
          </SelectField>
        </Field>
        <Field
          label="Escopos"
          htmlFor="scopes"
          hint="separados por vírgula — Contas, Cartões, Investimentos"
        >
          <TextField
            id="scopes"
            name="scopes"
            placeholder="Contas, Cartões, Pix"
          />
        </Field>
        <Field
          label="Vencimento do consentimento (dias)"
          htmlFor="consentDays"
        >
          <TextField
            id="consentDays"
            name="consentDays"
            type="number"
            min={30}
            max={365}
            defaultValue={180}
          />
        </Field>
      </FormDialog>
    </>
  );
}
