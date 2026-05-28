# FrS Finance — setup local

Boot rápido (Postgres limpo + Prisma):

```bash
# 1. dependências
pnpm install

# 2. variáveis de ambiente
cp .env.example .env   # se ainda não existir

# 3. sobe o postgres em container
pnpm db:up             # docker compose up -d postgres

# 4. aplica o schema (cria as tabelas, ZERO dados fictícios)
pnpm prisma:migrate    # primeira vez: dá um nome tipo "init"

# 5. roda o app
pnpm dev
```

## Scripts úteis

| Comando | O que faz |
|---|---|
| `pnpm db:up`        | Sobe o Postgres em background |
| `pnpm db:down`      | Para o Postgres (volume preservado) |
| `pnpm db:reset`     | Para, **apaga o volume** e sobe limpo de novo |
| `pnpm db:logs`      | Acompanha o log do Postgres |
| `pnpm prisma:migrate` | Aplica migrations e regenera o client |
| `pnpm prisma:studio`  | Abre o Prisma Studio (UI do DB) |
| `pnpm setup`        | install + db:up + prisma:migrate (one-shot inicial) |

## O que está no banco

Nada por padrão. O `docker-compose.yml` cria apenas o database
`frs_finance` vazio. As migrations criam as tabelas (`users`,
`tenants`, `memberships`, `bank_accounts`, `movements`, etc.).

Pra criar seu usuário e tenant pessoal, use o cadastro em `/register`
quando a rota de auth real estiver ligada — hoje os forms ainda são
mockados e redirecionam direto para o dashboard. Para criar registros
diretamente no banco enquanto o backend não está pronto, use
`pnpm prisma:studio`.

## Mock data

`src/lib/mock-data.ts` existe só para popular as telas. Substitua por
queries Prisma (`import { db } from "@/lib/db"`) quando for ligar de
verdade.
