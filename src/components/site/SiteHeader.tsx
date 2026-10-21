"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ContactLink } from "@/components/site/ContactLink";
import type { ContactSource } from "@/components/site/ContactLink";
import { headerCopyEs } from "@/content/copy/es-chrome";
import { pairedPath } from "@/content/i18n";
import {
  isNavigationGroup,
  type HeaderCopy,
  type NavigationGroup,
  type NavigationItem,
} from "@/content/copy/types";
import styles from "./SiteChrome.module.css";

/** Ruta estable de contacto cuando el diálogo no puede abrirse. */
const headerContactHref = "/contacto";

/** Cuánto espera el desplegable antes de cerrarse cuando el puntero sale. */
const HOVER_CLOSE_DELAY = 120;

function readMenuCloseDuration() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--dropdown-close-dur")
    .trim();

  if (value.endsWith("ms")) return Number.parseFloat(value) || 150;
  if (value.endsWith("s")) return (Number.parseFloat(value) || 0.15) * 1000;
  return 150;
}

function isCurrent(pathname: string, href: string) {
  const route = href.split("#")[0];
  if (!route) return false;
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * Un grupo desplegable de la cabecera (escritorio). Es un *disclosure*: un
 * botón con `aria-expanded` que controla un panel de enlaces. Se abre con
 * clic, Enter o Espacio y con intención de puntero; se cierra con Escape
 * (devolviendo el foco al botón), al salir el foco, al pulsar fuera y al
 * cambiar de ruta. Sólo un grupo puede estar abierto.
 */
function NavGroup({
  group,
  open,
  pathname,
  onOpen,
  onClose,
}: {
  group: NavigationGroup;
  open: boolean;
  pathname: string;
  onOpen: () => void;
  onClose: (returnFocus?: boolean) => void;
}) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const containsCurrent = group.items.some((item) => isCurrent(pathname, item.href));

  const cancelLeave = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  useEffect(() => cancelLeave, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      className={styles.navGroup}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        cancelLeave();
        onOpen();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        cancelLeave();
        leaveTimerRef.current = window.setTimeout(() => onClose(false), HOVER_CLOSE_DELAY);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          onClose(true);
        }
      }}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (open && next && !rootRef.current?.contains(next)) onClose(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.navTrigger}
        aria-expanded={open}
        aria-controls={panelId}
        data-current={containsCurrent || undefined}
        onClick={() => (open ? onClose(false) : onOpen())}
      >
        {group.label}
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      <div
        id={panelId}
        className={styles.navPanel}
        role="group"
        aria-label={group.label}
        data-open={open || undefined}
      >
        <ul className={styles.navPanelList}>
          {group.items.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                className={styles.navPanelLink}
                href={item.href}
                hrefLang={item.hrefLang}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                onClick={() => onClose(false)}
              >
                <strong>{item.label}</strong>
                {item.description ? <span>{item.description}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
        {group.more ? (
          <Link
            className={styles.navPanelMore}
            href={group.more.href}
            hrefLang={group.more.hrefLang}
            tabIndex={open ? 0 : -1}
            onClick={() => onClose(false)}
          >
            {group.more.label} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function MobileEntry({
  entry,
  index,
  pathname,
  onNavigate,
}: {
  entry: NavigationItem | NavigationGroup;
  index: number;
  pathname: string;
  onNavigate: (event: React.MouseEvent) => void;
}) {
  const number = <span aria-hidden="true">0{index + 1}</span>;
  if (!isNavigationGroup(entry)) {
    return (
      <Link
        className={styles.mobileLink}
        href={entry.href}
        hrefLang={entry.hrefLang}
        aria-current={isCurrent(pathname, entry.href) ? "page" : undefined}
        onClick={onNavigate}
      >
        {number}
        {entry.label}
      </Link>
    );
  }
  return (
    <details className={styles.mobileGroup}>
      <summary className={styles.mobileLink}>
        {number}
        {entry.label}
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </summary>
      <ul className={styles.mobileGroupList}>
        {[...entry.items, ...(entry.more ? [entry.more] : [])].map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              href={item.href}
              hrefLang={item.hrefLang}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader({
  copy = headerCopyEs,
  desktopContactSource = "header-desktop",
  inverseOnTop = true,
  mobileContactSource = "header-mobile",
}: {
  copy?: HeaderCopy;
  desktopContactSource?: ContactSource;
  inverseOnTop?: boolean;
  mobileContactSource?: ContactSource;
}) {
  const pathname = usePathname();
  // El cambio de idioma aparece solo en una página con par y lleva a su
  // equivalente (`content/i18n.ts`). En /equipo, /prensa o /marca, que se
  // publican solo en español, no aparece: un «English» ahí llevaría a una
  // página que no traduce esa.
  const pair = pairedPath(pathname);
  const languageSwitch =
    pair && copy.languageSwitch
      ? { label: copy.languageSwitch.label, href: pair.href, hrefLang: pair.lang }
      : null;
  const contactHref = copy.contactHref ?? headerContactHref;
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [menuInstant, setMenuInstant] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // El grupo abierto va atado a la ruta en la que se abrió: al navegar, el
  // estado deja de coincidir y el desplegable se cierra solo, sin efecto.
  const [openState, setOpenState] = useState<{ label: string; path: string } | null>(null);
  const openGroup = openState && openState.path === pathname ? openState.label : null;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const skipMenuFocusRestoreRef = useRef(false);
  const menuCloseResolverRef = useRef<(() => void) | null>(null);
  const menuOpenFrameRef = useRef<number | null>(null);
  const menuCloseTimerRef = useRef<number | null>(null);

  const closeGroup = useCallback((returnFocus?: boolean) => {
    if (returnFocus) {
      desktopNavRef.current
        ?.querySelector<HTMLButtonElement>(`button[aria-expanded="true"]`)
        ?.focus();
    }
    setOpenState(null);
  }, []);

  const clearMenuMotion = useCallback(() => {
    if (menuOpenFrameRef.current !== null) {
      window.cancelAnimationFrame(menuOpenFrameRef.current);
    }
    if (menuCloseTimerRef.current !== null) {
      window.clearTimeout(menuCloseTimerRef.current);
    }
    menuOpenFrameRef.current = null;
    menuCloseTimerRef.current = null;
  }, []);

  const openMenu = useCallback(
    (animate: boolean) => {
      clearMenuMotion();
      setMenuClosing(false);
      setMenuInstant(!animate);
      setMenuMounted(true);

      if (!animate) {
        setOpen(true);
        return;
      }

      setOpen(false);
      menuOpenFrameRef.current = window.requestAnimationFrame(() => {
        setOpen(true);
        menuOpenFrameRef.current = null;
      });
    },
    [clearMenuMotion],
  );

  const closeMenu = useCallback(
    (animate: boolean) => {
      if (!menuMounted || menuClosing) return;

      clearMenuMotion();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const shouldAnimate = animate && !reduceMotion && open;
      setOpen(false);

      if (!shouldAnimate) {
        setMenuInstant(true);
        setMenuClosing(false);
        setMenuMounted(false);
        return;
      }

      setMenuInstant(false);
      setMenuClosing(true);
      menuCloseTimerRef.current = window.setTimeout(() => {
        setMenuClosing(false);
        setMenuMounted(false);
        menuCloseTimerRef.current = null;
      }, readMenuCloseDuration());
    },
    [clearMenuMotion, menuClosing, menuMounted, open],
  );

  useEffect(() => {
    let animationFrame = 0;
    let lastScrolled = false;

    const updateHeaderState = () => {
      animationFrame = 0;
      const nextScrolled = window.scrollY > 12;

      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateHeaderState);
    };

    updateHeaderState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!menuMounted) return;

    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;

    const previousOverflow = document.body.style.overflow;
    const pageContent = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, footer, [data-site-header-inner]",
      ),
    );
    const previousInert = pageContent.map((element) => element.inert);
    document.body.style.overflow = "hidden";
    pageContent.forEach((element) => {
      element.inert = true;
    });

    const focusFirstMenuControl = window.requestAnimationFrame(() => {
      mobileMenuRef.current
        ?.querySelector<HTMLElement>('button:not([disabled]), a[href], summary')
        ?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        clearMenuMotion();
        setOpen(false);
        setMenuClosing(false);
        setMenuInstant(true);
        setMenuMounted(false);
        return;
      }

      if (event.key !== "Tab") return;

      const menu = mobileMenuRef.current;
      if (!menu) return;

      const focusableElements = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!focusableElements.includes(document.activeElement as HTMLElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const mobileViewport = window.matchMedia("(max-width: 1020px)");
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        clearMenuMotion();
        setOpen(false);
        setMenuClosing(false);
        setMenuInstant(true);
        setMenuMounted(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    mobileViewport.addEventListener("change", onViewportChange);

    return () => {
      window.cancelAnimationFrame(focusFirstMenuControl);
      document.removeEventListener("keydown", onKeyDown);
      mobileViewport.removeEventListener("change", onViewportChange);
      document.body.style.overflow = previousOverflow;
      pageContent.forEach((element, index) => {
        element.inert = previousInert[index];
      });

      const shouldRestoreFocus = !skipMenuFocusRestoreRef.current;
      skipMenuFocusRestoreRef.current = false;
      if (shouldRestoreFocus) {
        window.requestAnimationFrame(() => {
          returnFocusRef.current?.focus();
        });
      }
    };
  }, [clearMenuMotion, menuMounted]);

  useEffect(() => {
    if (menuMounted || !menuCloseResolverRef.current) return;

    const resolveAfterCleanup = window.requestAnimationFrame(() => {
      const resolve = menuCloseResolverRef.current;
      menuCloseResolverRef.current = null;
      resolve?.();
    });

    return () => window.cancelAnimationFrame(resolveAfterCleanup);
  }, [menuMounted]);

  const closeMenuBeforeContact = () =>
    new Promise<void>((resolve) => {
      if (!menuMounted) {
        resolve();
        return;
      }
      skipMenuFocusRestoreRef.current = true;
      menuCloseResolverRef.current = resolve;
      closeMenu(true);
    });

  useEffect(
    () => () => {
      clearMenuMotion();
    },
    [clearMenuMotion],
  );

  return (
    <header
      className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}${
        openGroup ? ` ${styles.hasOpenGroup}` : ""
      }`}
      data-inverse={inverseOnTop || undefined}
    >
      <a className={styles.skipLink} href="#main-content">
        {copy.skipToContent}
      </a>
      <div className={styles.inner} data-site-header-inner>
        <Link
          className={styles.brand}
          href={copy.homeHref ?? "/"}
          prefetch={false}
          aria-label={copy.brandLabel}
        >
          {/*
            El logo es el elemento del LCP en móvil: el texto del hero entra con
            `rise` desde opacidad 0 y Chrome no lo cuenta. `priority` lo precarga;
            `fetchPriority="high"` evita que el SVG haga cola detrás de los chunks.
          */}
          <Image
            src="/brand/logos/inplux-logo-horizontal-inverse.svg"
            alt="INPLUX"
            width={403}
            height={112}
            priority
            fetchPriority="high"
          />
        </Link>

        <nav ref={desktopNavRef} className={styles.desktopNav} aria-label={copy.navigationLabel}>
          {copy.navigation.map((entry) =>
            isNavigationGroup(entry) ? (
              <NavGroup
                key={entry.label}
                group={entry}
                open={openGroup === entry.label}
                pathname={pathname}
                onOpen={() => setOpenState({ label: entry.label, path: pathname })}
                onClose={closeGroup}
              />
            ) : (
              <Link
                key={entry.href}
                className={styles.navLink}
                href={entry.href}
                hrefLang={entry.hrefLang}
                aria-current={isCurrent(pathname, entry.href) ? "page" : undefined}
              >
                {entry.label}
              </Link>
            ),
          )}
          {languageSwitch ? (
            <Link
              className={styles.languageSwitch}
              href={languageSwitch.href}
              hrefLang={languageSwitch.hrefLang}
              prefetch={false}
            >
              {languageSwitch.label}
            </Link>
          ) : null}
        </nav>

        <ContactLink
          className={styles.cta}
          fallbackHref={contactHref}
          source={desktopContactSource}
        >
          {copy.contactCta}
        </ContactLink>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={menuMounted}
          aria-controls={menuMounted ? "site-mobile-menu" : undefined}
          aria-haspopup="dialog"
          aria-label={menuMounted ? copy.closeMenu : copy.openMenu}
          onClick={(event) => {
            const animate =
              event.detail !== 0 &&
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (menuMounted) closeMenu(animate);
            else openMenu(animate);
          }}
          tabIndex={menuMounted ? -1 : 0}
        >
          <span />
          <span />
        </button>
      </div>

      {menuMounted ? (
        <div
          className={styles.menuLayer}
          role="dialog"
          aria-modal="true"
          aria-label={copy.mobileNavigationLabel}
        >
          <button
            type="button"
            className={`${styles.backdrop}${open ? ` ${styles.open}` : ""}${
              menuClosing ? ` ${styles.closing}` : ""
            }${menuInstant ? ` ${styles.instant}` : ""}`}
            onClick={(event) => closeMenu(event.detail !== 0)}
            aria-label={copy.closeMenu}
            tabIndex={-1}
          />

          <nav
            ref={mobileMenuRef}
            id="site-mobile-menu"
            className={`${styles.mobileNav}${open ? ` ${styles.open}` : ""}${
              menuClosing ? ` ${styles.closing}` : ""
            }${menuInstant ? ` ${styles.instant}` : ""}`}
            aria-label={copy.navigationLabel}
          >
            <button
              type="button"
              className={styles.menuClose}
              onClick={(event) => closeMenu(event.detail !== 0)}
              aria-label={copy.closeMenu}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
            <p className={styles.mobileLabel}>{copy.mobileMenuLabel}</p>
            {copy.navigation.map((entry, index) => (
              <MobileEntry
                key={isNavigationGroup(entry) ? entry.label : entry.href}
                entry={entry}
                index={index}
                pathname={pathname}
                onNavigate={(event) => closeMenu(event.detail !== 0)}
              />
            ))}
            {languageSwitch ? (
              <Link
                className={styles.mobileLink}
                href={languageSwitch.href}
                hrefLang={languageSwitch.hrefLang}
                prefetch={false}
                onClick={(event) => closeMenu(event.detail !== 0)}
              >
                <span aria-hidden="true">{languageSwitch.hrefLang?.toUpperCase()}</span>
                {languageSwitch.label}
              </Link>
            ) : null}
            <ContactLink
              className={styles.mobileContact}
              fallbackHref={contactHref}
              source={mobileContactSource}
              beforeOpen={closeMenuBeforeContact}
              returnFocusRef={menuButtonRef}
            >
              {`${copy.contactCtaMobile} `}<span aria-hidden="true">→</span>
            </ContactLink>
            <p className={styles.menuNote}>{copy.menuNote}</p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
