import Image from "next/image";
import Link from "next/link";

import { Faq } from "./faq";
import { Pricing } from "./pricing";
import "./landing.css";

const BANKS = ["Nubank", "Itaú", "XP", "Inter", "C6 Bank", "Caixa"];

const FEATURES = [
  {
    eyebrow: "Visão consolidada",
    title: "Todo o patrimônio em uma só tela.",
    body: "Saldo, crédito disponível e investimentos somados em tempo real — com a evolução do seu patrimônio em 30 dias, 90 dias ou 12 meses.",
    items: [
      "Saldo total atualizado automaticamente",
      "Gasto por categoria, sem digitar nada",
      "Curva de evolução do patrimônio",
    ],
    img: "/landing/dash-light.png",
    alt: "Visão geral do patrimônio no FrS",
    cap: "Dashboard · visão geral",
    dark: true,
    flip: false,
  },
  {
    eyebrow: "Open Finance",
    title: "Conecte suas contas em minutos.",
    body: "Vincule bancos e corretoras com segurança pelo Open Finance. O FrS sincroniza saldos e movimentos sozinho e reconcilia as faturas do cartão automaticamente.",
    items: [
      "Sincronização automática de saldos",
      "Reconciliação de cartão sem trabalho",
      "Conexão cifrada · padrão do Banco Central",
    ],
    img: "/landing/conexoes.png",
    alt: "Tela de conexões bancárias do FrS",
    cap: "Conexões bancárias",
    dark: false,
    flip: true,
  },
];

export function Landing() {
  return (
    <div className="landing-root">
      {/* ============ NAV ============ */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="brand" href="#top" aria-label="FrS Finance">
            <Image src="/logo.svg" alt="" width={38} height={26} priority />
            <span className="bw">
              FrS Finance<small>BETA</small>
            </span>
          </Link>
          <nav className="nav-links">
            <a href="#recursos">Recursos</a>
            <a href="#como">Como funciona</a>
            <a href="#preco">Preço</a>
            <a href="#faq">Dúvidas</a>
          </nav>
          <div className="nav-cta">
            <Link className="btn btn-ghost" href="/login">
              Entrar
            </Link>
            <Link className="btn btn-primary" href="/register">
              Começar grátis <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Planejador financeiro pessoal</div>
              <h1>
                Dinheiro com <span className="serif-em">compostura</span>.
              </h1>
              <p className="sub">
                Bancos, cartões e investimentos reunidos em uma única vista serena. Conecte pelo
                Open Finance, registre gastos pelo WhatsApp e veja seu patrimônio inteiro tomar
                forma.
              </p>
              <div className="hero-cta">
                <Link className="btn btn-primary btn-lg" href="/register">
                  Testar 7 dias grátis <span className="arr">→</span>
                </Link>
                <a className="btn btn-ghost btn-lg" href="#como">
                  Ver como funciona
                </a>
              </div>
              <div className="hero-note">
                <span className="dot" /> <b>7 dias grátis</b> · depois R$&nbsp;39,99/mês · cancele
                quando quiser
              </div>
            </div>
            <div className="hero-shot">
              <span className="badge">App · Dashboard</span>
              <Image
                src="/landing/dash-dark.png"
                alt="Painel do FrS Finance com visão consolidada do patrimônio"
                width={924}
                height={540}
                priority
              />
            </div>
          </div>

          {/* trust strip */}
          <div className="trust">
            <div className="trust-inner">
              <span className="tl">Conecta suas contas via Open Finance</span>
              <div className="banks">
                {BANKS.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROBLEM → SOLUTION ============ */}
        <section className="section sec-pad" id="recursos">
          <div className="container">
            <div className="sec-head center">
              <div className="eyebrow center">O problema, resolvido</div>
              <h2>
                Seu dinheiro mora em sete lugares. O FrS reúne todos em{" "}
                <span className="serif-em">um</span>.
              </h2>
              <p>
                Pare de abrir seis aplicativos e uma planilha para saber quanto você realmente tem.
                O FrS lê suas contas, reconcilia o cartão sozinho e devolve um extrato claro como um
                livro-razão.
              </p>
            </div>

            <div style={{ marginTop: 56 }}>
              {/* feature 1 */}
              <FeatureRow {...FEATURES[0]} />

              {/* feature 2 */}
              <FeatureRow {...FEATURES[1]} />

              {/* feature 3 — WhatsApp (custom: command pill) */}
              <div className="feat-row">
                <div className="feat-copy">
                  <div className="eyebrow">Registro por WhatsApp</div>
                  <h3>Um gasto cabe em uma mensagem.</h3>
                  <p>
                    Sem abrir o app: mande um comando ao nosso bot e o lançamento aparece
                    categorizado na sua vista em segundos.
                  </p>
                  <div className="cmd">
                    <span className="k">/gasto</span> 84,30 farmácia drogaria
                  </div>
                  <div className="feat-list" style={{ marginTop: 22 }}>
                    <div className="it">Categorização instantânea</div>
                    <div className="it">Resposta média em 1,2 segundo</div>
                  </div>
                </div>
                <FeatureMedia
                  img="/landing/whatsapp.png"
                  alt="Registro de gastos pelo WhatsApp no FrS"
                  cap="Bot do WhatsApp"
                  dark
                />
              </div>

              {/* feature 4 */}
              <div className="feat-row flip">
                <div className="feat-copy">
                  <div className="eyebrow">Feito para durar o dia inteiro</div>
                  <h3>Cappuccino de dia. Expresso à noite.</h3>
                  <p>
                    Tema claro e escuro, três paletas e preferências que ficam salvas. Cada cliente
                    vê apenas os próprios dados, sempre na mesma linguagem de livro-razão.
                  </p>
                  <div className="feat-list">
                    <div className="it">Temas claro e escuro</div>
                    <div className="it">Multi-conta · dados isolados por usuário</div>
                    <div className="it">Entrar com Google ou Apple</div>
                  </div>
                </div>
                <FeatureMedia
                  img="/landing/dash-dark-fit.png"
                  alt="Tema escuro do FrS Finance"
                  cap="Tema escuro · couro"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="band section sec-pad" id="como">
          <div className="container">
            <div className="sec-head">
              <div className="eyebrow">Em 60 segundos</div>
              <h2>Comece hoje, sem cartão de crédito.</h2>
            </div>
            <div className="steps">
              <div className="step">
                <div className="ord">i. — Criar conta</div>
                <h3>Entre com e-mail, Google ou Apple</h3>
                <p>
                  Sua conta nasce pronta e privada. Nenhum cartão é pedido para começar o teste de 7
                  dias.
                </p>
              </div>
              <div className="step">
                <div className="ord">ii. — Conectar</div>
                <h3>Vincule seus bancos pelo Open Finance</h3>
                <p>
                  Em poucos cliques, saldos, cartões e investimentos aparecem reunidos na sua vista.
                </p>
              </div>
              <div className="step">
                <div className="ord">iii. — Acompanhar</div>
                <h3>Registre pelo WhatsApp e relaxe</h3>
                <p>
                  O FrS organiza tudo por categoria e mostra seu patrimônio evoluir, dia após dia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="section sec-pad" id="preco">
          <div className="container">
            <div className="sec-head center">
              <div className="eyebrow center">Preço</div>
              <h2>Um plano. Tudo incluído.</h2>
              <p>
                Comece com 7 dias grátis. Se não amar a calma de ter tudo em uma só vista, é só
                cancelar — sem perguntas.
              </p>
            </div>
            <Pricing />
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section sec-pad" id="faq" style={{ paddingTop: 40 }}>
          <div className="container">
            <div className="sec-head center" style={{ marginBottom: 48 }}>
              <div className="eyebrow center">Dúvidas frequentes</div>
              <h2>Antes de começar.</h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="band section sec-pad final">
          <div className="container">
            <div className="eyebrow center">Comece agora</div>
            <h2 style={{ marginTop: 22 }}>
              Veja seu patrimônio
              <br />
              inteiro em{" "}
              <span className="serif-em" style={{ color: "var(--gold)" }}>
                uma vista
              </span>
              .
            </h2>
            <p>
              Conecte uma conta, mande um “/gasto” e descubra a serenidade de ter o dinheiro sob
              controle.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-light btn-lg" href="/register">
                Testar 7 dias grátis <span className="arr">→</span>
              </Link>
            </div>
            <div className="hero-note">
              <span className="dot" /> <b>7 dias grátis</b> · depois R$&nbsp;39,99/mês · cancele
              quando quiser
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link className="brand" href="#top" aria-label="FrS Finance">
              <Image src="/logo.svg" alt="" width={44} height={30} />
              <span className="bw">FrS Finance</span>
            </Link>
            <p className="ft-tag">Dinheiro com compostura. Feito em São Paulo.</p>
          </div>
          <div className="ft-cols">
            <div className="ft-col">
              <h4>Produto</h4>
              <a href="#recursos">Recursos</a>
              <a href="#como">Como funciona</a>
              <a href="#preco">Preço</a>
              <a href="#faq">Dúvidas</a>
            </div>
            <div className="ft-col">
              <h4>Empresa</h4>
              <a href="#top">Sobre</a>
              <a href="#top">Contato</a>
              <a href="#top">Imprensa</a>
            </div>
            <div className="ft-col">
              <h4>Legal</h4>
              <a href="#top">Privacidade</a>
              <a href="#top">Termos</a>
              <a href="#top">Open Finance</a>
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span>© MMXXVI · FrS Finance</span>
          <span>frs.finance · São Paulo · BR</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  items,
  img,
  alt,
  cap,
  dark,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  img: string;
  alt: string;
  cap: string;
  dark: boolean;
  flip: boolean;
}) {
  return (
    <div className={flip ? "feat-row flip" : "feat-row"}>
      <div className="feat-copy">
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="feat-list">
          {items.map((it) => (
            <div className="it" key={it}>
              {it}
            </div>
          ))}
        </div>
      </div>
      <FeatureMedia img={img} alt={alt} cap={cap} dark={dark} />
    </div>
  );
}

function FeatureMedia({
  img,
  alt,
  cap,
  dark,
}: {
  img: string;
  alt: string;
  cap: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "feat-media dark" : "feat-media"}>
      <span className="cn tl" />
      <span className="cn tr" />
      <span className="cn bl" />
      <span className="cn br" />
      <Image src={img} alt={alt} width={924} height={540} />
      <span className="cap">{cap}</span>
    </div>
  );
}
