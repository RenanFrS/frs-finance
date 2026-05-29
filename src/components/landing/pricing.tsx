"use client";

import Link from "next/link";
import { useState } from "react";

const PLANS = {
  monthly: { val: "39,99", per: "/mês", sub: "Cobrado mensalmente após o teste." },
  annual: { val: "33,32", per: "/mês", sub: "R$ 399,90 por ano — economize R$ 79,98." },
} as const;

type Plan = keyof typeof PLANS;

const INCLUDED = [
  "Visão consolidada do patrimônio",
  "Conexões ilimitadas via Open Finance",
  "Reconciliação automática de cartão",
  "Registro de gastos pelo WhatsApp",
  "Acompanhamento de investimentos",
  "Categorias e evolução do patrimônio",
  "Temas claro e escuro",
];

export function Pricing() {
  const [plan, setPlan] = useState<Plan>("monthly");
  const current = PLANS[plan];

  return (
    <div className="price-wrap">
      <div style={{ textAlign: "center" }}>
        <div className="price-toggle" role="tablist">
          <button
            className={plan === "monthly" ? "on" : undefined}
            onClick={() => setPlan("monthly")}
            role="tab"
            aria-selected={plan === "monthly"}
          >
            Mensal
          </button>
          <button
            className={plan === "annual" ? "on" : undefined}
            onClick={() => setPlan("annual")}
            role="tab"
            aria-selected={plan === "annual"}
          >
            Anual <span className="save">2 meses grátis</span>
          </button>
        </div>
      </div>

      <div className="price-card">
        <div className="price-left">
          <div className="pname">FrS Finance</div>
          <div className="pdesc">Acesso completo ao planejador, para uma pessoa.</div>

          <div className="price-amt">
            <span className="cur">R$</span>
            <span className="val num">{current.val}</span>
            <span className="per">{current.per}</span>
          </div>
          <div className="price-sub">{current.sub}</div>

          <div className="price-free">
            <span className="star">✦</span> 7 dias grátis · sem cartão para começar
          </div>

          <div className="price-cta">
            <Link className="btn btn-primary btn-lg" href="/register">
              Começar meus 7 dias grátis <span className="arr">→</span>
            </Link>
          </div>
          <div className="price-fine">Renovação automática · cancele a qualquer momento</div>
        </div>

        <div className="price-right">
          <div className="inc">Tudo incluído</div>
          <ul>
            {INCLUDED.map((item) => (
              <li key={item}>
                <span className="ck">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
