<div align="center">

# FrS Finance

**Planejador financeiro pessoal multi-tenant — uma vista única do seu patrimônio.**

Saldos, crédito, investimentos e despesas em um só painel, com integração bancária via Open Finance e registro de gastos pelo WhatsApp.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql&logoColor=white)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## ✦ Sobre o projeto

**FrS Finance** centraliza a vida financeira de cada usuário em um único painel. A arquitetura é **multi-tenant**: cada pessoa (ou família/empresa) tem seu próprio espaço isolado, e um usuário pode pertencer a vários espaços com papéis distintos (`OWNER`, `EDITOR`, `VIEWER`).

A proposta de design é **"vintage minimalista com a calma de um private banking"** — tons sépia, um único acento terracota, tipografia editorial (Playfair + Newsreader) e números em monoespaçada com numerais tabulares. A especificação visual completa vive em [`docs/DESIGN.md`](docs/DESIGN.md).

## ✦ Funcionalidades

- 📊 **Dashboard consolidada** — KPIs de patrimônio, evolução em sparkline, gastos por categoria (donut) e movimentos recentes.
- 🏦 **Contas & conexões bancárias** — múltiplas contas (corrente, poupança, investimento, crédito), prontas para integração via Open Finance (Belvo / Pluggy).
- 💸 **Movimentos** — despesas, receitas, transferências e investimentos, com origem `MANUAL`, `API` ou `WHATSAPP`.
- 🗂️ **Categorias** — hierárquicas (categoria/subcategoria), com orçamento e cor.
- 💳 **Crédito** — cartões e faturas com status (`OPEN`, `PARTIAL`, `PAID`).
- 📈 **Investimentos** — acompanhamento da carteira.
- 💬 **WhatsApp** — registro de gastos por comandos (`/gasto 84,30 farmácia`) via WhatsApp Business API.
- 🎨 **Preferências por usuário** — tema (light/dark) e paleta (Terracota · Bordô · Verde Cofre), persistidas no banco.
- 🔐 **Multi-tenant com troca de espaço** — tenant switcher no header e isolamento de dados por tenant.

## ✦ Stack

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 · TypeScript |
| **UI** | Tailwind CSS 4 · shadcn/ui · Radix UI · Motion · Lenis |
| **Banco de dados** | PostgreSQL (Neon) · Prisma 6 |
| **Autenticação** | E-mail/senha próprios — hash `scrypt`, sessão em cookie `httpOnly` assinado com HMAC-SHA256 |
| **Mutations** | Next.js Server Actions (`src/lib/actions`) |
| **Gerenciador** | pnpm 10 |

> A autenticação é caseira e sem dependências externas: senhas via `scrypt` ([`src/lib/password.ts`](src/lib/password.ts)) e sessões assinadas via HMAC ([`src/lib/session.ts`](src/lib/session.ts)).

## ✦ Estrutura

```
src/
├─ app/
│  ├─ (auth)/            # login · register
│  └─ (app)/             # dashboard · contas · movimentos · categorias
│                        # credito · investimentos · conexoes · whatsapp · preferencias
├─ components/
│  ├─ ui/                # primitivos shadcn
│  ├─ dashboard/         # sparkline, donut, KPIs, sidebar
│  ├─ app-shell/ auth/ dialogs/ theme/ preferencias/ ...
│  └─ ...
└─ lib/
   ├─ db.ts              # Prisma client
   ├─ session.ts         # sessão HMAC
   ├─ password.ts        # hashing scrypt
   ├─ queries.ts         # leituras
   └─ actions/           # server actions (auth, accounts, movements, ...)
prisma/
├─ schema.prisma         # modelo multi-tenant
└─ migrations/
docs/
└─ DESIGN.md             # sistema de design + spec de telas (hi-fi)
```

## ✦ Começando

### Pré-requisitos

- Node.js `>=20.9.0`
- pnpm `>=10`
- PostgreSQL — local via Docker, ou um banco gerenciado (Neon)

### Instalação

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
#    edite o .env com suas credenciais (veja abaixo)

# 3. Subir o Postgres local (opcional, via Docker)
pnpm db:up

# 4. Aplicar as migrations
pnpm prisma:migrate

# 5. Rodar em desenvolvimento
pnpm dev
```

A aplicação sobe em **http://localhost:3000**.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Conexão Postgres (pooled, usada pelo app em runtime). |
| `DATABASE_URL_UNPOOLED` | Conexão direta (sem pgbouncer) — usada como `directUrl` pelas migrations do Prisma. |
| `SESSION_SECRET` | Segredo HMAC da sessão (32+ bytes). Gere com `openssl rand -hex 32`. |

> Com Neon, o `DATABASE_URL` aponta para o host `-pooler` e o `DATABASE_URL_UNPOOLED` para o host direto. Em local com Docker, ambos podem apontar para a mesma URL do Postgres.

## ✦ Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | `prisma generate && prisma migrate deploy && next build` |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | ESLint |
| `pnpm db:up` / `pnpm db:down` | Sobe / derruba o Postgres do Docker |
| `pnpm db:reset` | Recria o Postgres do zero (apaga volume) |
| `pnpm prisma:migrate` | Cria/aplica migrations em dev |
| `pnpm prisma:studio` | Abre o Prisma Studio |
| `pnpm setup` | Instala deps + sobe DB + roda migrations |

## ✦ Deploy

O projeto está pronto para a **Vercel**. O comando de build já roda `prisma generate` e `prisma migrate deploy` antes do `next build`, aplicando migrations automaticamente.

Configure no painel da Vercel (Settings → Environment Variables) as três variáveis acima — incluindo `DATABASE_URL_UNPOOLED`, exigida pelo Prisma para as migrations.

## ✦ Modelo de dados

Multi-tenant via `Tenant` + `Membership` (join `User`↔`Tenant` com papel). Tabelas escopadas por tenant: `BankAccount`, `BankConnection`, `Movement`, `Category`, `CreditCard`, `Invoice`. Detalhes em [`prisma/schema.prisma`](prisma/schema.prisma).

> **Próximo passo de segurança:** habilitar Row-Level Security no Postgres, restringindo `SELECT/UPDATE/DELETE` a `tenant_id = current_setting('app.current_tenant_id')`.

---

<div align="center">
<sub>FrS Finance · projeto pessoal · 2026</sub>
</div>
