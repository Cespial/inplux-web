"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContactLink } from "@/components/site/ContactLink";
import styles from "./home.module.css";

const navigation = [
  ["Trabajo real", "/#trabajo-real"],
  ["La fábrica", "/#fabrica-en-vivo"],
  ["Qué construimos", "/#que-construimos"],
  ["Prensa", "/#prensa"],
  ["Nosotros", "/nosotros"],
] as const;

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuInstant, setMenuInstant] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const menuLayerRef = useRef<HTMLDivElement>(null);
  const menuFrameRef = useRef(0);
  const menuTimerRef = useRef(0);

  const openMenu = useCallback((instant: boolean) => {
    window.clearTimeout(menuTimerRef.current);
    window.cancelAnimationFrame(menuFrameRef.current);
    setMenuClosing(false);
    setMenuInstant(instant);
    setMenuOpen(true);
    if (instant) {
      setMenuVisible(true);
      return;
    }
    setMenuVisible(false);
    menuFrameRef.current = window.requestAnimationFrame(() => setMenuVisible(true));
  }, []);

  const closeMenu = useCallback((instant = false, restoreFocus = true) => {
    window.clearTimeout(menuTimerRef.current);
    window.cancelAnimationFrame(menuFrameRef.current);
    if (instant || menuInstant) {
      setMenuVisible(false);
      setMenuClosing(false);
      setMenuOpen(false);
      if (restoreFocus) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      return;
    }
    setMenuClosing(true);
    setMenuVisible(false);
    menuTimerRef.current = window.setTimeout(() => {
      setMenuClosing(false);
      setMenuOpen(false);
      if (restoreFocus) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    }, 150);
  }, [menuInstant]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const headerInner = headerInnerRef.current;
    document.body.style.overflow = "hidden";
    if (main instanceof HTMLElement) main.inert = true;
    if (footer instanceof HTMLElement) footer.inert = true;
    if (headerInner) headerInner.inert = true;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          menuLayerRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => !element.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (main instanceof HTMLElement) main.inert = false;
      if (footer instanceof HTMLElement) footer.inert = false;
      if (headerInner) headerInner.inert = false;
      if (document.activeElement === document.body) previousFocus?.focus();
    };
  }, [closeMenu, menuOpen]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(menuFrameRef.current);
      window.clearTimeout(menuTimerRef.current);
    },
    [],
  );

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.headerScrolled}` : ""}`}>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido
      </a>
      <div ref={headerInnerRef} className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="INPLUX, ir al inicio">
          <Image
            src="/brand/logos/inplux-logo-horizontal-inverse.svg"
            alt="INPLUX"
            width={403}
            height={112}
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegación principal">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          {scrolled ? (
            <ContactLink
              className={styles.navContact}
              fallbackHref="/#contacto"
              source="header-desktop"
            >
              Empezar un proyecto
            </ContactLink>
          ) : null}
        </nav>

        <ContactLink
          className={`${styles.pillButton} ${styles.headerCta}`}
          fallbackHref="/#contacto"
          source="header-desktop"
        >
          Empezar un proyecto
        </ContactLink>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="home-mobile-menu"
          aria-label="Abrir menú"
          onClick={(event) => openMenu(event.detail === 0)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen ? (
        <div
          ref={menuLayerRef}
          className={`${styles.mobileMenuLayer}${
            menuVisible ? ` ${styles.menuVisible}` : ""
          }${menuInstant ? ` ${styles.menuInstant}` : ""}${
            menuClosing ? ` ${styles.menuClosing}` : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <button
            ref={closeButtonRef}
            className={styles.menuClose}
            type="button"
            aria-label="Cerrar menú"
            onClick={(event) => closeMenu(event.detail === 0)}
          >
            <span />
            <span />
          </button>
          <nav id="home-mobile-menu" className={styles.mobileNav} aria-label="Navegación móvil">
            <p>Explora INPLUX</p>
            {navigation.map(([label, href], index) => (
              <Link key={href} href={href} onClick={(event) => closeMenu(event.detail === 0)}>
                <span>0{index + 1}</span>
                {label}
              </Link>
            ))}
            <ContactLink
              className={styles.mobileContact}
              fallbackHref="/#contacto"
              source="header-mobile"
              beforeOpen={() => closeMenu(true, false)}
              returnFocusRef={menuButtonRef}
            >
              Empezar un proyecto <span aria-hidden="true">→</span>
            </ContactLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
