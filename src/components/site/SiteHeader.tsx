"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContactLink } from "@/components/site/ContactLink";
import type { ContactSource } from "@/components/site/ContactLink";
import { homeCopyEs } from "@/content/copy/es";
import type { HeaderCopy } from "@/content/copy/types";
import styles from "./SiteChrome.module.css";

/** Ruta estable de contacto cuando el diálogo no puede abrirse. */
const headerContactHref = "/contacto";

function readMenuCloseDuration() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--dropdown-close-dur")
    .trim();

  if (value.endsWith("ms")) return Number.parseFloat(value) || 150;
  if (value.endsWith("s")) return (Number.parseFloat(value) || 0.15) * 1000;
  return 150;
}

export function SiteHeader({
  copy = homeCopyEs.header,
  desktopContactSource = "header-desktop",
  inverseOnTop = false,
  mobileContactSource = "header-mobile",
}: {
  copy?: HeaderCopy;
  desktopContactSource?: ContactSource;
  inverseOnTop?: boolean;
  mobileContactSource?: ContactSource;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [menuInstant, setMenuInstant] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const skipMenuFocusRestoreRef = useRef(false);
  const menuCloseResolverRef = useRef<(() => void) | null>(null);
  const menuOpenFrameRef = useRef<number | null>(null);
  const menuCloseTimerRef = useRef<number | null>(null);

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
        ?.querySelector<HTMLElement>('button:not([disabled]), a[href]')
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
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
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
      className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`}
      data-inverse={inverseOnTop || undefined}
    >
      <a className={styles.skipLink} href="#main-content">
        {copy.skipToContent}
      </a>
      <div className={styles.inner} data-site-header-inner>
        <Link
          className={styles.brand}
          href="/"
          prefetch={false}
          aria-label={copy.brandLabel}
        >
          <Image
            src="/brand/logos/inplux-logo-horizontal-inverse.svg"
            alt="INPLUX"
            width={403}
            height={112}
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label={copy.navigationLabel}>
          {copy.navigation.map(({ href, hrefLang, label }) => (
            <Link
              key={href}
              href={href}
              hrefLang={hrefLang}
              aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          {copy.languageSwitch ? (
            <Link
              className={styles.languageSwitch}
              href={copy.languageSwitch.href}
              hrefLang={copy.languageSwitch.hrefLang}
              prefetch={false}
            >
              {copy.languageSwitch.label}
            </Link>
          ) : null}
        </nav>

        <ContactLink
          className={styles.cta}
          fallbackHref={headerContactHref}
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
            {copy.navigation.map(({ href, hrefLang, label }, index) => (
              <Link
                key={href}
                className={styles.mobileLink}
                href={href}
                hrefLang={hrefLang}
                aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
                onClick={(event) => closeMenu(event.detail !== 0)}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {label}
              </Link>
            ))}
            {copy.languageSwitch ? (
              <Link
                className={styles.mobileLink}
                href={copy.languageSwitch.href}
                hrefLang={copy.languageSwitch.hrefLang}
                prefetch={false}
                onClick={(event) => closeMenu(event.detail !== 0)}
              >
                <span aria-hidden="true">ES</span>
                {copy.languageSwitch.label}
              </Link>
            ) : null}
            <ContactLink
              className={styles.mobileContact}
              fallbackHref={headerContactHref}
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
