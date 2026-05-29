# Handoff: FrS Finance — Landing Page

## Overview
Landing page (marketing site) do **FrS Finance**, um planejador financeiro pessoal brasileiro. A página apresenta o produto, recursos, "como funciona", preço (com toggle mensal/anual), FAQ (acordeão) e CTAs para o teste grátis de 7 dias. O objetivo é converter visitantes em trials.

Deve ser implementada na **raiz (`/`)** do projeto.

## About the Design Files
Os arquivos deste pacote (`landing.html` + `landing.css` + imagens) são **referências de design feitas em HTML/CSS** — um protótipo de alta fidelidade que mostra o visual e o comportamento pretendidos, **não** código de produção para copiar diretamente.

A tarefa é **recriar este design no ambiente do seu codebase** (React/Next.js, Vue, Astro, etc.), usando os padrões, componentes e convenções já estabelecidos no projeto. Se ainda não houver um framework definido, escolha o mais adequado (recomendo **Next.js** ou **Astro** para uma landing estática/SEO-friendly) e implemente lá. O HTML/CSS pode servir de base 1:1 já que é semântico e sem dependências, mas componentize conforme o padrão do seu codebase.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos e interações são finais. Recrie pixel-perfect. Toda a paleta usa `oklch()` — mantenha-a (suporte amplo em navegadores modernos) ou converta para os equivalentes do seu design system.

## Direção visual
Editorial vintage / "livro-razão" (ledger). Sensação de papel impresso: textura de grão sobre toda a página, tons de papel quente, tinta marrom-escura, detalhes em mono monoespaçada com tracking largo (parecendo carimbos/etiquetas), serifa display para títulos. Acentos em vermelho-tijolo (primary) e dourado (gold). Bandas escuras "couro/ledger" para contraste.

## Estrutura da página (top → bottom)

### 1. NAV (sticky)
- Sticky no topo, fundo `--paper` 86% com `backdrop-filter: blur(14px)`, borda inferior `--rule`.
- Esquerda: logo (`assets/logo.svg`, filtrado p/ ficar escuro) + wordmark "FrS Finance" em Playfair Display 600/21px + selo "BETA" em mono 9px.
- Centro: links (Recursos, Como funciona, Preço, Dúvidas) — mono 13px, uppercase, tracking .12em, hover vira `--primary`.
- Direita: botão "Entrar" (ghost) + "Começar grátis →" (primary, pill).
- Links e CTA ghost somem em telas pequenas (ver responsivo).

### 2. HERO
- Grid 2 colunas (1.02fr / 0.98fr), gap 56px, padding-top 78px.
- Esquerda (copy):
  - Eyebrow "Planejador financeiro pessoal" (mono, uppercase, tracking .26em, primary, com tracinho de 34px antes via `::before`).
  - H1: "Dinheiro com **compostura**." — Playfair Display 800, `clamp(54px, 6vw, 92px)`, line-height .97, "compostura" em `.serif-em` (Playfair itálico, cor primary).
  - Subtítulo: Newsreader, `clamp(19px,1.5vw,23px)`, cor `--ink-2`, max 34ch.
  - CTAs: "Testar 7 dias grátis →" (primary lg) + "Ver como funciona" (ghost lg).
  - Nota: ponto verde pulsante + "7 dias grátis · depois R$ 39,99/mês · cancele quando quiser" (mono 12.5px).
- Direita (mockup):
  - Card escuro (`--ledger-2`), borda + raio 18px, sombra grande, **com perspectiva 3D**: `transform: perspective(1800px) rotateY(-9deg) rotateX(2deg)`, origin left center.
  - Badge "App · Dashboard" no canto superior direito.
  - Imagem: `img/dash-dark.png`.
  - No responsivo (≤940px) a perspectiva é removida e centraliza.
- **Trust strip** abaixo do hero: faixa `--paper-2` com bordas, texto "Conecta suas contas via Open Finance" + nomes de bancos (Nubank, Itaú, XP, Inter, C6 Bank, Caixa) em Playfair 600/20px.

### 3. PROBLEM → SOLUTION / RECURSOS (`#recursos`)
- Cabeçalho centralizado: eyebrow "O problema, resolvido", H2 "Seu dinheiro mora em sete lugares. O FrS reúne todos em *um*." + parágrafo.
- 4 linhas de feature alternadas (`.feat-row`, grid 1fr/1fr, gap 72px, separadas por borda superior `--rule`; classe `.flip` inverte a ordem da mídia):
  1. **Visão consolidada** — "Todo o patrimônio em uma só tela." + 3 itens · mídia escura `img/dash-light.png` legenda "Dashboard · visão geral".
  2. **Open Finance** (flip) — "Conecte suas contas em minutos." + 3 itens · mídia `img/conexoes.png` legenda "Conexões bancárias".
  3. **Registro por WhatsApp** — "Um gasto cabe em uma mensagem." + pílula de comando `/gasto 84,30 farmácia drogaria` + 2 itens · mídia escura `img/whatsapp.png` legenda "Bot do WhatsApp".
  4. **Temas** (flip) — "Claro de dia. Couro à noite." + 3 itens · mídia `img/dash-dark-fit.png` legenda "Tema escuro · couro".
- Cada mídia tem 4 "cantos de registro" decorativos (`.cn` — tl/tr/bl/br), uma legenda pill (`.cap`) no canto inferior esquerdo, e os itens da lista usam um losango primary como bullet (`::before` rotacionado 45°).

### 4. COMO FUNCIONA (`#como`) — banda escura
- `.band`: fundo gradiente radial primary + linear ledger escuro, com **linhas horizontais** decorativas (efeito papel pautado, via `::after` background-size 48px). Texto claro.
- Cabeçalho: eyebrow dourada "Em 60 segundos", H2 "Comece hoje, sem cartão de crédito."
- 3 passos (grid 3 col): cada um com borda superior, ordinal romano dourado ("i. — Criar conta", "ii. — Conectar", "iii. — Acompanhar"), H3 Playfair e parágrafo.

### 5. PREÇO (`#preco`)
- Cabeçalho central: eyebrow "Preço", H2 "Um plano. Tudo incluído." + parágrafo.
- **Toggle Mensal/Anual** (`.price-toggle`, pill com 2 botões; o ativo tem `.on` = fundo `--ink`, texto papel). Anual mostra selo "2 meses grátis".
- **Card de preço** (grid 1.15fr/1fr):
  - Esquerda: nome "FrS Finance", descrição, **preço grande** (R$ + valor em Playfair 800/84px + "/mês"), sublinha dinâmica, pílula "✦ 7 dias grátis · sem cartão para começar", botão primary full-width "Começar meus 7 dias grátis →", letra miúda.
  - Direita (`--paper-2`): "Tudo incluído" + lista de 7 benefícios com check primary.
- **Comportamento JS**: `setPlan('monthly'|'annual')` troca:
  - Mensal: valor `39,99`, "/mês", sub "Cobrado mensalmente após o teste."
  - Anual: valor `33,32`, "/mês", sub "R$ 399,90 por ano — economize R$ 79,98."

### 6. FAQ (`#faq`)
- Cabeçalho central: eyebrow "Dúvidas frequentes", H2 "Antes de começar."
- Acordeão (`.faq-item`): pergunta em Playfair 600/24px + sinal "+" que rotaciona 45° (vira "×") ao abrir. Resposta animada via `max-height` transition.
- **Comportamento JS**: `toggleFaq(btn)` — abre o item clicado e **fecha os demais** (accordion exclusivo); seta `max-height = scrollHeight`.
- 5 perguntas: teste de 7 dias, segurança dos dados, bancos suportados, registro por WhatsApp, cancelamento. (Textos completos no HTML.)

### 7. CTA FINAL — banda escura
- `.band.final`, centralizado. H2 "Veja seu patrimônio inteiro em *uma vista*." ("uma vista" em serif-em dourado). Parágrafo itálico. Botão `.btn-light` "Testar 7 dias grátis →" + nota.

### 8. FOOTER
- `--paper`, borda superior. Logo + tagline "Dinheiro com compostura. Feito em São Paulo." + 3 colunas de links (Produto / Empresa / Legal). Base: "© MMXXVI · FrS Finance" / "frs.finance · São Paulo · BR" em mono.

## Interactions & Behavior
- **Pricing toggle** — `setPlan(plan)`: alterna classe `.on` nos botões e atualiza valor/período/sublinha.
- **FAQ accordion** — `toggleFaq(btn)`: accordion exclusivo (fecha os outros), anima `max-height`.
- **Smooth scroll** — `html { scroll-behavior: smooth; scroll-padding-top: 92px; }` para os links de âncora da nav.
- **Hover de botões** — `transform: translateY(-1px)` + mudança de cor de fundo.
- **Links da nav** — cor → `--primary` no hover.
- Não há estados de loading/erro nesta página (é estática/marketing). Os CTAs apontam para âncoras (`#preco`, `#top`) — no produto real devem ir para fluxo de cadastro/login.

## State Management
Mínimo — duas micro-interações de UI client-side:
- `plan` atual (mensal | anual) no toggle de preço.
- Item de FAQ aberto.
Em React, use `useState` local em cada componente (`PricingCard`, `Faq`). Nenhuma busca de dados é necessária.

## Design Tokens (CSS custom properties — oklch)
```css
--paper:       oklch(0.965 0.012 78);   /* fundo principal */
--paper-2:     oklch(0.945 0.018 75);   /* fundos secundários/cards */
--paper-3:     oklch(0.915 0.024 72);
--ink:         oklch(0.215 0.022 50);   /* texto principal */
--ink-2:       oklch(0.355 0.025 50);   /* texto secundário */
--ink-3:       oklch(0.52  0.022 55);   /* texto terciário/legendas */
--rule:        oklch(0.85  0.022 70);   /* linhas/bordas */
--rule-2:      oklch(0.78  0.024 68);   /* bordas mais fortes */
--primary:     oklch(0.48  0.135 45);   /* vermelho-tijolo (CTA, acentos) */
--primary-2:   oklch(0.55  0.14  48);   /* hover do primary */
--primary-ink: oklch(0.972 0.018 80);   /* texto sobre primary */
--gold:        oklch(0.66  0.09  78);   /* dourado (acentos em bandas escuras) */
--positive:    oklch(0.44  0.075 145);  /* verde (ponto pulsante) */
--ledger:      oklch(0.27 0.045 42);    /* couro/ledger claro */
--ledger-2:    oklch(0.155 0.022 38);   /* couro/ledger escuro */
--maxw: 1240px;                         /* largura máxima do container */
```

### Tipografia (Google Fonts)
- **Playfair Display** (serif display) — títulos H1/H2/H3, wordmark, valores de preço. Pesos 400–900, itálico p/ `.serif-em`.
- **Newsreader** (serif de texto) — corpo de texto / parágrafos. Pesos 300–600.
- **JetBrains Mono** (mono) — eyebrows, labels, botões, números (`font-variant-numeric: tabular-nums`), comandos, legendas. Pesos 300–600.
- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@...&family=Newsreader:ital,opsz,wght@...&family=JetBrains+Mono:wght@300;400;500;600&display=swap` (string completa no `<head>` do HTML).

### Border radius
- Botões / pills / selos: `999px`.
- Mídias de feature: `16px`. Hero shot: `18px`. Card de preço: `22px`. Pílula de comando: `11px`.

### Sombras
- Hero shot: `0 2px 0 rgba(60,40,20,.05), 0 50px 90px -44px rgba(40,26,14,.55)`.
- Feature media: `0 1px 0 rgba(60,40,20,.04), 0 34px 70px -38px rgba(40,26,14,.5)`.
- Card de preço: `0 2px 0 rgba(60,40,20,.04), 0 40px 80px -44px rgba(40,26,14,.4)`.

### Textura de papel (grão)
`body::before` fixo, `z-index:1`, `mix-blend-mode: multiply`, `opacity:.30`, com um SVG `feTurbulence` inline como background (string completa no CSS). Aplica-se sobre a página inteira. Conteúdo fica em `z-index:2`.

### Espaçamento
- Padding de seção: `.sec-pad { 104px 0 }` (72px em ≤940px).
- Container: `padding: 0 40px` (22px em ≤560px).
- Gaps de grid principais: hero 56px, feature 72px, steps 32px.

## Responsive (breakpoints)
- **≤940px**: hero vira 1 coluna (mockup perde a perspectiva, centraliza, max 560px); feature rows viram 1 coluna; steps 1 coluna; card de preço 1 coluna; links da nav somem; `.sec-pad` → 72px.
- **≤560px**: paddings laterais → 22px; paddings internos do card de preço reduzem; botão "Entrar" (ghost) some da nav.

## Assets
Todos em `img/` e `assets/` neste pacote:
- `assets/logo.svg` — logo FrS (filtrado via CSS p/ ficar escuro na nav).
- `img/dash-dark.png` — mockup do hero (painel tema escuro).
- `img/dash-light.png` — feature "Visão consolidada".
- `img/conexoes.png` — feature "Open Finance".
- `img/whatsapp.png` — feature "Registro por WhatsApp".
- `img/dash-dark-fit.png` — feature "Temas" (tema escuro).
- `img/dash-light-fit.png`, `img/login.png` — variações extras (não usadas na página atual; disponíveis se precisar).

Estes são **screenshots do protótipo do app**. No produto real, substitua por capturas atualizadas do app de verdade, mantendo proporções e enquadramento.

## Files
- `landing.html` — markup completo + JS (toggle de preço, accordion de FAQ).
- `landing.css` — sistema de estilo completo (tokens, componentes, responsivo). 339 linhas, sem dependências.
- `img/`, `assets/` — imagens e logo.

## Notas de implementação
- A página é **estática e sem dependências** — pronta para componentizar. Sugestão de componentes: `<Nav>`, `<Hero>`, `<TrustStrip>`, `<FeatureRow>` (com prop `flip` e `dark`), `<HowItWorks>`, `<Pricing>`, `<Faq>`, `<FinalCta>`, `<Footer>`.
- Mantenha as fontes via `next/font` (ou equivalente) para performance, em vez do `<link>` direto.
- CTAs hoje são âncoras — conecte-os ao fluxo real de signup/login do produto.
- Acessibilidade: o toggle de preço usa `role="tab"`; os botões de FAQ são `<button>`. Considere adicionar `aria-expanded` nos itens de FAQ ao componentizar.
