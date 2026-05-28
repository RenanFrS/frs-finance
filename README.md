# Handoff: FrS Finance — Identidade visual + telas iniciais

## Visão geral

**FrS Finance** é um planejador financeiro pessoal multi-tenant. Cada cliente acessa apenas seus próprios dados (autenticação por e-mail/senha + OAuth Google/Apple). O produto integra contas via **Open Finance / API bancária** e permite registrar gastos/investimentos via **WhatsApp Business API**. A dashboard apresenta uma vista única do patrimônio: saldo, crédito, investimentos e despesas.

Este bundle entrega:
1. A **identidade visual completa** (paleta light + dark, tipografia, tokens `oklch()` prontos para shadcn).
2. **Três telas-âncora**: Dashboard, Login e Registro.
3. **Convenções de componentes** (botões, cards, badges, inputs, avatar com fallback de iniciais, tenant switcher).

## Sobre os arquivos de design

Os arquivos `.html` / `.jsx` neste bundle são **referências de design feitas em HTML/CSS/React** — protótipos mostrando aparência e comportamento desejados, **não código de produção para copiar diretamente**.

A tarefa é **recriar esses designs no codebase real** usando:
- **Next.js 14+ (App Router) · TypeScript · React 18**
- **shadcn/ui · Tailwind CSS · Radix UI**
- **Node.js · pnpm · PostgreSQL · Prisma (recomendado)**
- **Autenticação multi-tenant** (Auth.js / Clerk / Lucia, à escolha do dev — manter row-level security no Postgres)
- **Open Finance / Belvo / Pluggy** para integração bancária
- **WhatsApp Business API · Twilio** (ou Meta Cloud API direta) para o bot de registro

## Fidelidade

**Alta-fidelidade (hi-fi).** Cores, tipografia, espaçamentos e arredondamentos são finais. Recrie pixel-perfeito usando os componentes shadcn já instalados (`button`, `card`, `input`, `badge`, `avatar`, `dropdown-menu`, `tabs`, `dialog`, `sheet`).

---

## Sistema de design

### Direção
**Vintage minimalista com calma de private banking.** Tons sépia + um único acento (terracota), tipografia editorial em Playfair + Newsreader, monoespaçada para números (JetBrains Mono com numerais tabulares). Cantos arredondados ao estilo Apple (12–24px). Hairlines de 1px no lugar de sombras pesadas.

### Tokens shadcn — `app/globals.css`

Cole o bloco abaixo no `globals.css`. Usa `oklch()` para contraste estável e transições suaves entre light/dark.

```css
:root {
  /* Light · papel */
  --background: oklch(0.965 0.012 78);
  --foreground: oklch(0.215 0.022 50);
  --card: oklch(0.945 0.018 75);
  --card-foreground: oklch(0.215 0.022 50);
  --popover: oklch(0.965 0.012 78);
  --popover-foreground: oklch(0.215 0.022 50);
  --primary: oklch(0.48 0.135 45);              /* terracota */
  --primary-foreground: oklch(0.972 0.018 80);
  --secondary: oklch(0.915 0.024 72);
  --secondary-foreground: oklch(0.215 0.022 50);
  --muted: oklch(0.945 0.018 75);
  --muted-foreground: oklch(0.52 0.022 55);
  --accent: oklch(0.92 0.04 50);
  --accent-foreground: oklch(0.215 0.022 50);
  --destructive: oklch(0.42 0.13 25);           /* oxblood */
  --destructive-foreground: oklch(0.972 0.018 80);
  --border: oklch(0.85 0.022 70);
  --input: oklch(0.85 0.022 70);
  --ring: oklch(0.48 0.135 45);
  --radius: 0.875rem;                            /* 14px base — bump cards p/ 18–22px */

  /* Tokens semânticos extras */
  --positive: oklch(0.44 0.075 145);             /* verdigris — ganhos */
  --negative: oklch(0.42 0.13 25);
  --gold: oklch(0.72 0.10 80);                   /* aged brass — destaque */
  --primary-soft: oklch(0.92 0.04 50);
}

.dark {
  /* Dark · couro envelhecido */
  --background: oklch(0.165 0.014 40);
  --foreground: oklch(0.93 0.022 80);
  --card: oklch(0.205 0.018 42);
  --card-foreground: oklch(0.93 0.022 80);
  --popover: oklch(0.205 0.018 42);
  --popover-foreground: oklch(0.93 0.022 80);
  --primary: oklch(0.70 0.13 50);
  --primary-foreground: oklch(0.155 0.018 40);
  --secondary: oklch(0.245 0.022 44);
  --secondary-foreground: oklch(0.93 0.022 80);
  --muted: oklch(0.205 0.018 42);
  --muted-foreground: oklch(0.78 0.02 75);
  --accent: oklch(0.28 0.05 50);
  --accent-foreground: oklch(0.93 0.022 80);
  --destructive: oklch(0.68 0.13 28);
  --destructive-foreground: oklch(0.155 0.018 40);
  --border: oklch(0.32 0.02 50);
  --input: oklch(0.32 0.02 50);
  --ring: oklch(0.70 0.13 50);

  --positive: oklch(0.68 0.085 145);
  --negative: oklch(0.68 0.13 28);
  --gold: oklch(0.78 0.10 80);
  --primary-soft: oklch(0.28 0.05 50);
}
```

### Tipografia

| Token | Família | Peso | Tamanho | Line-height | Tracking |
|---|---|---|---|---|---|
| `display` | Playfair Display | 800 | 72px | 1.0 | −0.02em |
| `h1` | Playfair Display | 700 | 56px | 1.05 | −0.018em |
| `h2` | Playfair Display | 700 | 48px | 1.05 | −0.018em |
| `h3` | Playfair Display | 600 | 28px | 1.2 | −0.01em |
| `h4` | Newsreader | 500 | 20px | 1.3 | normal |
| `body` | Newsreader | 400 | 17px | 1.55 | normal |
| `small` | Newsreader | 400 | 14px | 1.55 | normal |
| `eyebrow` | JetBrains Mono | 500 | 11px | 1.0 | 0.22em UPPER |
| `numeric` | JetBrains Mono | 500 | 44px | 1.0 | −0.01em + tabular-nums |

**Imports** (`app/layout.tsx`):
```tsx
import { Playfair_Display, Newsreader, JetBrains_Mono } from "next/font/google";
const playfair   = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-body" });
const mono       = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
```

E em `tailwind.config.ts`:
```ts
fontFamily: {
  display: ["var(--font-display)", "serif"],
  body:    ["var(--font-body)", "serif"],
  mono:    ["var(--font-mono)", "monospace"],
}
```

Para qualquer número monetário usar `font-mono tabular-nums tracking-tight`.

### Arredondamento (Apple-style)

| Elemento | Radius |
|---|---|
| Botões e badges | `9999px` (pill) |
| Inputs | `12px` |
| Cards de KPI / preview | `18px` |
| Painéis de dashboard | `20px` |
| Cards grandes (componentes, paletas) | `22px` |
| Shells / janelas de aplicação | `24–28px` |
| Tenant cards | `16px` |
| App icon | `14px` (60px) — equivalente a ~22% para superellipse iOS |

### Espaçamento

Base 4. Escala: `4 · 8 · 12 · 14 · 18 · 24 · 32 · 48 · 56 · 80 · 96` (em px). Padding interno de cards: 18–28px.

### Linhas e sombras

- `border: 1px solid var(--border)` — única linguagem de delimitação. Nunca usar borda > 1px.
- Sombra: `0 1px 0 rgba(60,40,20,.03), 0 8px 24px -12px rgba(60,40,20,.12)` (light) · variante mais profunda no dark. Use somente em `Card` flutuante; nunca em buttons/inputs.
- Grain de papel: SVG `feTurbulence` (`baseFrequency=0.85`, opacity .35, `mix-blend-mode: multiply`) — opcional, applicar via `body::before` global.

---

## Telas

### 1. Dashboard (`/app/(app)/dashboard/page.tsx`)

**Layout (1240×720+ desktop):** grid `240px · 1fr`.

**Sidebar (240px, `bg-secondary`)**
- Brand mark + wordmark (28×20 logo + "FrS Finance" em Playfair 15px)
- **Tenant switcher** — card 14px radius com logo do tenant (28×28, 8px radius), nome, role label uppercase em mono 9px. Click → dropdown com lista de tenants do usuário.
- 3 grupos de navegação com labels mono 9px UPPER 0.22em tracking:
  - **PRINCIPAL**: Visão geral · Contas (3) · Investimentos (12) · Crédito (2)
  - **REGISTROS**: Movimentos (184) · Categorias (24) · WhatsApp (14)
  - **CONFIGURAÇÃO**: Conexões · Preferências
- Items: `radius 10px`, padding `9px 12px`, hover sutil, ativo = `bg-primary/10 text-primary`
- Footer: card "WHATSAPP · ATIVO" mostrando contagem do dia + número configurado

**Top bar**
- Saudação personalizada (`Boa tarde, {user.firstName} · 27 Maio MMXXVI`) em mono 10px
- Page title em Playfair 28px: `Visão consolidada do patrimônio` (com "patrimônio" em italic + terracota)
- Search box pill (border-radius 999, 260px min-width) com `⌘K` hint
- Botão `+ registrar` (primary, sm)
- **Avatar** (38px circle, com initials fallback ou foto, halo `0 0 0 3px var(--paper), 0 0 0 4px var(--border)`) → clica abre popover 240px com user info, tenant atual, links de perfil/cobrança/sair

**KPI grid (4 colunas)**
Card style: `bg-card border radius-18 p-18`. Conteúdo:
1. Label (mono 10px UPPER) `Saldo total` → valor em mono 26px com decimais menores e cinza → trend `↗ +1,8% · 30d` em `text-positive`
2. `Investimentos` → R$ 142.840,11 → `↗ +R$ 3.214 mensal`
3. `Crédito disponível` → R$ 12.188,00 → texto neutro "de R$ 17.000 · 28% usado"
4. `Gasto do mês` → R$ 4.812,00 → `↘ −R$ 218 vs. abril` em `text-negative`

**Painel "Patrimônio · evolução" (1.6fr)**
- Sparkline custom em SVG: área com gradiente `--primary` (35% → 0%), linha 1.5px, pontos a cada 4 amostras
- Gridlines horizontais dashed 25%/50%/75%
- Tabs `30d · 90d · 12m` em mono 10px (segmented pill)
- Eixo x com 4 valores em mono 10px

**Painel "Por categoria" (1fr)**
- Donut SVG 150px, stroke-width 14, 5 segmentos: Alimentação 38% (primary) · Transporte 22% (gold) · Moradia 18% (positive) · Lazer 12% (negative) · Outros 10% (muted)
- Texto central: "GASTO" (mono 11px) + "R$ 4.812" (Playfair 18px)
- Legenda à direita com dots quadrados 10px e percentuais em mono

**Painel "Movimentos recentes" (1.6fr)**
- Tabela com colunas: ícone categoria (22×22 round, letra Playfair) · descrição + meta · data · valor · status
- 6 linhas com border-bottom dashed
- Valores positivos em `text-positive`, negativos em ink padrão
- Badge `✓ conc.` (positive variant) ao final

**Painel "Via WhatsApp" + "Conexões" (1fr empilhado)**
- WA: avatares 32px com iniciais, mensagens monoespaçadas para comandos (`/gasto 84,30 farmácia`), badge `● AO VIVO` positivo
- Conexões: linhas de banco (Nubank · Itaú · XP) com square logos (30×30, radius 10), nome + saldo, badge sync/14h

### 2. Login (`/app/(auth)/login/page.tsx`)

**Frame 50/50, radius 28px, min-height 720px, overflow hidden, shadow vintage.**

**Esquerda — Art panel**
- Background: `radial-gradient(110% 75% at 18% 12%, primary/65%, transparent), radial-gradient(85% 65% at 90% 100%, gold/35%, transparent), linear-gradient(160deg, #3d2c1f, #261b13, #1a120c)`
- Overlay: noise SVG mix-blend overlay opacity .35
- Linhas-guia horizontais de livro-razão a cada 39px (1px linha, 8% opacity)
- Conteúdo z-index 2, padding 48px, `flex-col justify-between`:
  - **Topo**: brand mark 56×40 (logo mask em bone) + wordmark "FrS Finance" + tagline mono "Planejador · MMXXVI"
  - **Centro**: blockquote Playfair italic 28–44px (clamp) — "O patrimônio se conserva mais pela atenção diária do que pelo grande lance." + atribuição mono 11px 0.22em UPPER
  - **Rodapé**: marquee `SP · BR ◆ OPEN FINANCE ◆ SSL · 256 ◆ v0.1` (mono 10px UPPER 0.28em), separadores `◆` em terracota

**Direita — Form panel** (bg-paper, padding 48px, center)
- Max-width 420px form-inner
- **Tabs em pílula** (segmented): `Entrar | Criar conta`. Tab ativa: `bg-foreground text-background`
- Eyebrow `BEM-VINDO DE VOLTA` mono 11px terracota com linha curta
- Heading Playfair 36–48px clamp: `Entre na sua conta.` (conta em italic + terracota)
- Sub Newsreader 15px muted
- Field "E-mail" (label mono 10px UPPER 0.22em) → input radius-12 padding 12×16
- Field "Senha" com link `Esqueceu?` à direita do label (italic terracota com underline 40% opacity)
- Checkbox custom 18×18 radius-5 (preenchido terracota com check branco)
- Botão primary lg full-width radius-pill, padding 15×22, font mono 12px UPPER 0.15em + seta `→`
- Divider "ou continue com" — `flex` com linhas hairline antes/depois, mono 10px UPPER
- Social grid 1fr 1fr: `Google` e `Apple` em outline buttons (font Newsreader 11px sem UPPER, ícone Playfair 14px à esquerda)
- Switch link rodapé: `Não tem conta? Crie a sua →`

### 3. Registro

**Mesmo frame.** Aba "Criar conta" ativa. Diferenças:

- Eyebrow: `COMECE EM 60 SEGUNDOS`
- Title: `Crie sua conta.`
- Sub: `Nome completo gera suas iniciais no avatar. Você pode trocar por uma foto depois.`
- **Field row 2 colunas**: Nome + Sobrenome
- **Avatar preview live** — quando o usuário digita Nome e Sobrenome, atualizar avatar em tempo real:
  ```ts
  const initials = ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
  ```
  Avatar 64×64 round, bg ink, texto Playfair 22px, halo `0 0 0 3px paper, 0 0 0 4px border`
  Caixa de preview: `bg-secondary border-dashed radius-16 p-14×16`, com título `AVATAR INICIAL` mono UPPER e sub explicando "enviar foto" depois
- E-mail
- Senha com hint mono 10px
- Checkbox de aceite de Termos + Política
- Botão "Criar conta →"
- Social + switch para login

### Componentes shadcn customizados

#### `<Avatar />`
```tsx
type AvatarProps = { name: string; photoUrl?: string; size?: number };

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last  = parts.length > 1 ? parts.at(-1)![0] : (parts[0]?.[1] ?? '');
  return (first + last).toUpperCase();
}
```
Tamanhos: sm 28 · md 44 · lg 64. Fallback: `bg-foreground text-background font-display font-semibold`. Halo via box-shadow. Click → dropdown menu (shadcn `DropdownMenu`).

#### Avatar dropdown — preferências de aparência
O popover do avatar (após o tenant ativo) traz uma seção **Aparência** com dois controles que aplicam preferência do usuário ao instante e persistem por tenant:

- **Tema** — segmented control `Light | Dark`
- **Paleta** — grid 3 colunas com swatches circulares: **Terracota** (default · oklch 0.48 0.135 45), **Bordô** (oklch 0.40 0.115 22), **Verde Cofre** (oklch 0.36 0.05 165). O selecionado tem borda `var(--foreground)` e label bold.

Implementação sugerida: persistir em `user_preferences` (ou `membership.preferences` se preferências forem por tenant) no Postgres. Aplicar via atributo no `<html>`:
```tsx
useEffect(() => {
  document.documentElement.dataset.theme = pref.theme;
  document.documentElement.dataset.palette = pref.palette;
}, [pref.theme, pref.palette]);
```
E em `globals.css`, além dos blocos `:root` / `.dark`, adicionar variantes por paleta:
```css
html[data-palette="bordo"]       { --primary: oklch(0.40 0.115 22); /* ... */ }
html[data-palette="bordo"].dark  { --primary: oklch(0.66 0.13 25);  /* ... */ }
html[data-palette="verde"]       { --primary: oklch(0.36 0.05 165); /* ... */ }
html[data-palette="verde"].dark  { --primary: oklch(0.66 0.075 160); /* ... */ }
```

#### `<TenantSwitcher />`
Combobox shadcn. Lista os tenants do `user.memberships`. Tenant ativo destacado em `bg-primary/10 border-primary`. Cada item: 36×36 square mark (radius 10), nome + role badge (OWNER/EDITOR/VIEWER).

#### `<Button />` (shadcn override)
```tsx
// variants
default:   'bg-primary text-primary-foreground rounded-full font-mono uppercase tracking-[0.15em] text-xs'
outline:   'border border-foreground text-foreground rounded-full hover:bg-foreground hover:text-background'
ghost:     'text-primary hover:bg-primary/10 rounded-full'
// sizes
sm: 'h-9 px-3.5 text-[11px]'
md: 'h-11 px-5 text-xs'
lg: 'h-14 px-7 text-[13px]'
```

#### `<Badge />`
```tsx
variants: default (border + muted-fg) · primary (terracota bg/border) · positive · negative
// shape: rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-mono
// optional dot: <span className="size-1.5 rounded-full bg-current" />
```

#### `<KpiCard />`
```tsx
<Card className="rounded-[18px] border bg-card p-[18px] grid gap-2">
  <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
  <Value className="font-mono text-[26px] font-medium tabular-nums tracking-tight">{value}</Value>
  <Trend className={cn("font-mono text-[11px]", trendColor)}>{trend}</Trend>
</Card>
```

---

## Interações & comportamentos

### Login
- Submit → POST `/api/auth/login` com `{ email, password }` → setar httpOnly cookie de sessão → redirect `/dashboard`
- "Esqueceu?" → `/forgot-password`
- Google/Apple → fluxo OAuth padrão
- Em caso de erro: input fica com `border-destructive ring-destructive/20` + texto pequeno abaixo do field em `text-destructive`

### Registro
- Validação client: nome 2+ chars, e-mail RFC, senha 8+ chars com pelo menos 1 número + 1 símbolo
- Live initials no avatar: useState + computar a cada onChange
- Submit → POST `/api/auth/register` → criar `User` + `Tenant` pessoal default → enviar e-mail de verificação → login automático → onboarding (`/onboarding/connect-bank`)
- Checkbox de termos obrigatório (disable botão até marcar)

### Dashboard
- Tabs do gráfico `30d/90d/12m` → trocar dataset do sparkline com fade-in 200ms
- `+ registrar` (topbar) → abre `<Sheet>` lateral com form rápido de transação
- Click em movimento → `<Dialog>` com detalhes + opção de editar categoria
- Tenant switcher → mudar `tenantId` na URL/cookie → revalidar dados do dashboard
- Search `⌘K` → `<CommandDialog>` (shadcn) com busca fuzzy em movimentos/contas/categorias
- Avatar click → dropdown com: Perfil & foto · Trocar tenant · Cobrança & plano · Sair

### Responsividade
- ≥1240px: layout completo
- 960–1239px: sidebar collapse para ícones (60px), navegação principal vira tab bar
- ≤960px: sidebar vira `<Sheet>` por menu hamburger; KPIs 2 colunas; auth frame stack vertical (art em cima, form em baixo)

### Animações
- Page transitions: fade 150ms ease-out
- Tab switch (auth): fade-cross 180ms
- Card hover (tenant card, bank row): `border-color` muda em 200ms
- Sidebar nav active state: background sobe em 150ms

---

## Multi-tenant · modelo de dados sugerido

```sql
-- prisma schema (recorte essencial)
model User {
  id            String       @id @default(cuid())
  email         String       @unique
  passwordHash  String?
  firstName     String
  lastName      String
  photoUrl      String?
  createdAt     DateTime     @default(now())
  memberships   Membership[]
}

model Tenant {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  createdAt   DateTime     @default(now())
  memberships Membership[]
  accounts    BankAccount[]
  movements   Movement[]
}

enum Role { OWNER EDITOR VIEWER }

model Membership {
  id        String   @id @default(cuid())
  userId    String
  tenantId  String
  role      Role     @default(OWNER)
  user      User     @relation(fields: [userId], references: [id])
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  @@unique([userId, tenantId])
}

model BankAccount {
  id         String   @id @default(cuid())
  tenantId   String
  provider   String   // "nubank" | "itau" | "xp" ...
  externalId String   // ID na API do banco
  balance    Decimal  @db.Decimal(14, 2)
  available  Decimal  @db.Decimal(14, 2)
  tenant     Tenant   @relation(fields: [tenantId], references: [id])
  movements  Movement[]
}

model Movement {
  id           String   @id @default(cuid())
  tenantId     String
  accountId    String?
  type         String   // "expense" | "income" | "transfer" | "investment"
  amount       Decimal  @db.Decimal(14, 2)
  description  String
  category     String?
  occurredAt   DateTime
  source       String   // "manual" | "api" | "whatsapp"
  reconciledAt DateTime?
  account      BankAccount? @relation(fields: [accountId], references: [id])
  tenant       Tenant       @relation(fields: [tenantId], references: [id])
}
```

**Row-level security**: aplicar policy no Postgres que restringe `SELECT/UPDATE/DELETE` em `tenant_id = current_setting('app.current_tenant_id')`. Setar a variável na conexão a cada request com o tenant ativo do usuário autenticado.

---

## Stack alvo & estrutura sugerida

```
apps/
  web/                          # Next.js
    app/
      (auth)/login/page.tsx
      (auth)/register/page.tsx
      (app)/dashboard/page.tsx
      (app)/movements/page.tsx
      (app)/investments/page.tsx
      (app)/settings/page.tsx
      api/
    components/
      ui/                       # shadcn primitives
      auth/AuthFrame.tsx
      auth/LoginForm.tsx
      auth/RegisterForm.tsx
      dashboard/Sidebar.tsx
      dashboard/TenantSwitcher.tsx
      dashboard/KpiCard.tsx
      dashboard/Sparkline.tsx
      dashboard/Donut.tsx
      common/Avatar.tsx
      common/Badge.tsx
    lib/
      auth.ts
      db.ts                     # Prisma client
      tenant.ts                 # current-tenant helpers
packages/
  shared/                       # types compartilhados
```

---

## Assets

- `assets/logo.svg` — monograma **FrS** (white-on-transparent). Usar como **CSS mask** para colorir via `background-color: currentColor`:
  ```css
  .logo-mark {
    -webkit-mask: url(/logo.svg) center/contain no-repeat;
            mask: url(/logo.svg) center/contain no-repeat;
    background-color: var(--foreground);
  }
  ```
- Logos de banco (Nubank, Itaú, XP): **NÃO incluídos** — o dev deve buscar SVGs oficiais ou usar squares coloridos com inicial em Playfair como fallback (vide design).

---

## Arquivos neste bundle

| Arquivo | Propósito |
|---|---|
| `Identity.html` | Documento de identidade completo — abre no navegador para ver paleta, tipografia, componentes, login, dashboard em escala 1:1. |
| `dashboard.jsx` | React reference do Dashboard (componentes + dados mockados + Sparkline/Donut SVG custom). |
| `tweaks-panel.jsx` | Painel de tweaks usado no protótipo — **descartar na implementação real**. |
| `frs-tweaks.jsx` | Bindings dos tweaks — **descartar**. |
| `assets/logo.svg` | Logo oficial. |
| `screenshots/` | 10 PNGs hi-res das telas finais — referência visual rápida. |

### Screenshots de referência

| # | Arquivo | Tela |
|---|---|---|
| 01 | `screenshots/01-hero.png` | Hero da identidade · direção visual |
| 02 | `screenshots/02-fundamentos.png` | 3 princípios + mood board |
| 03 | `screenshots/03-logo.png` | Aplicações do logo (12 variações) |
| 04 | `screenshots/04-cores.png` | Paleta light + dark + tokens shadcn |
| 05 | `screenshots/05-tipografia.png` | Escala tipográfica completa |
| 06 | `screenshots/06-componentes.png` | Buttons · badges · inputs · cards · avatar · tenant switcher |
| 07 | `screenshots/07-login.png` | Tela de login (50/50 art + form) |
| 08 | `screenshots/08-register.png` | Tela de registro (live initials no avatar) |
| 09 | `screenshots/09-dashboard-light.png` | Dashboard completa · light mode |
| 10 | `screenshots/10-dashboard-dark.png` | Dashboard completa · dark mode |

**Como usar**: abra `Identity.html` no navegador. A página tem um toggle de tema no topo (light/dark) e um painel de Tweaks para experimentar paletas alternativas (Bordô · Verde Cofre) caso seja útil para discussão futura — a paleta canônica é **Terracota** no modo padrão.

---

## Próximos passos sugeridos

1. `npx create-next-app@latest frs --typescript --tailwind --app --src-dir`
2. `pnpm dlx shadcn@latest init` (estilo: **New York** · base color: **stone** · CSS variables: **yes**)
3. Substituir `globals.css` pelo bloco de tokens acima
4. `pnpm dlx shadcn@latest add button card input label badge avatar dropdown-menu dialog sheet tabs command separator checkbox`
5. Configurar fontes em `layout.tsx`
6. Subir Postgres local (`docker-compose`) + Prisma + migrations iniciais
7. Implementar Login → Register → Dashboard nessa ordem, recriando 1:1 visualmente as telas do `Identity.html`
