"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como", label: "Como funciona" },
  { href: "#preco", label: "Preço" },
  { href: "#faq", label: "Dúvidas" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // trava o scroll do body enquanto o menu mobile está aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // fecha com Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={open ? "nav nav-open" : "nav"}>
      <div className="nav-inner">
        <Link className="brand" href="#top" aria-label="FrS Finance" onClick={close}>
          <Image src="/logo.svg" alt="" width={38} height={26} priority />
          <span className="bw">
            FrS Finance<small>BETA</small>
          </span>
        </Link>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-ghost" href="/login">
            Entrar
          </Link>
          <Link className="btn btn-primary" href="/register">
            Começar grátis <span className="arr">→</span>
          </Link>
        </div>
        <button
          className="nav-burger"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="nav-mobile" className="nav-mobile" aria-hidden={!open}>
        <nav className="nav-mobile-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close} tabIndex={open ? 0 : -1}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-mobile-cta">
          <Link
            className="btn btn-ghost btn-lg"
            href="/login"
            onClick={close}
            tabIndex={open ? 0 : -1}
          >
            Entrar
          </Link>
          <Link
            className="btn btn-primary btn-lg"
            href="/register"
            onClick={close}
            tabIndex={open ? 0 : -1}
          >
            Começar grátis <span className="arr">→</span>
          </Link>
        </div>
      </div>

      <button
        className="nav-backdrop"
        type="button"
        aria-label="Fechar menu"
        tabIndex={-1}
        onClick={close}
      />
    </header>
  );
}
