"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  {
    q: "Como funciona o teste de 7 dias?",
    a: "Você cria a conta e usa o FrS completo por 7 dias sem informar cartão. Ao final, se quiser continuar, é só ativar a assinatura de R$ 39,99/mês. Sem ativação, o acesso simplesmente pausa.",
  },
  {
    q: "Meus dados bancários estão seguros?",
    a: "Sim. As conexões usam o padrão Open Finance regulado pelo Banco Central, com transporte cifrado. Cada cliente tem seus dados isolados no banco — ninguém vê o que não é seu, e nunca guardamos a senha do seu banco.",
  },
  {
    q: "Quais bancos posso conectar?",
    a: "Todos os bancos e corretoras que participam do Open Finance no Brasil — incluindo Nubank, Itaú, XP, Inter, C6 Bank e Caixa, entre muitos outros.",
  },
  {
    q: "Como registro gastos pelo WhatsApp?",
    a: "Depois de ativar o bot, basta enviar uma mensagem como “/gasto 84,30 farmácia”. O lançamento aparece categorizado na sua vista em segundos, sem precisar abrir o aplicativo.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sempre. A assinatura é mensal e o cancelamento é imediato, sem multa e sem burocracia. No plano anual, você economiza o equivalente a dois meses.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq">
      {ITEMS.map((item, i) => (
        <FaqItem
          key={item.q}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answer = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    setMaxHeight(isOpen && answer.current ? answer.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className={isOpen ? "faq-item open" : "faq-item"}>
      <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
        {item.q} <span className="pm">+</span>
      </button>
      <div className="faq-a" ref={answer} style={{ maxHeight }}>
        <p>{item.a}</p>
      </div>
    </div>
  );
}
