"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type PropsWithChildren,
} from "react";
import { ContactForm } from "@/components/site/ContactForm";

type DialogPhase = "closed" | "open" | "closing";

type OpenContactOptions = {
  animate?: boolean;
  returnFocus?: HTMLElement | null;
};

type ContactDialogContextValue = {
  openContact: (options?: OpenContactOptions) => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null);

function readCloseDuration() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--modal-close-dur")
    .trim();

  if (value.endsWith("ms")) return Number.parseFloat(value) || 150;
  if (value.endsWith("s")) return (Number.parseFloat(value) || 0.15) * 1000;
  return 150;
}

export function useContactDialog() {
  const context = useContext(ContactDialogContext);
  if (!context) {
    throw new Error("useContactDialog debe usarse dentro de ContactDialogProvider");
  }
  return context;
}

export function ContactDialogProvider({ children }: PropsWithChildren) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const backdropPointerDownRef = useRef(false);
  const previousOverflowRef = useRef({ body: "", html: "", gutter: "" });
  const phaseRef = useRef<DialogPhase>("closed");
  const [phase, setPhase] = useState<DialogPhase>("closed");
  const [instant, setInstant] = useState(false);

  const updatePhase = useCallback((nextPhase: DialogPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const restorePage = useCallback(() => {
    document.body.style.overflow = previousOverflowRef.current.body;
    document.documentElement.style.overflow = previousOverflowRef.current.html;
    document.documentElement.style.scrollbarGutter = previousOverflowRef.current.gutter;
  }, []);

  const clearScheduledWork = useCallback(() => {
    if (openFrameRef.current !== null) cancelAnimationFrame(openFrameRef.current);
    if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    openFrameRef.current = null;
    focusFrameRef.current = null;
    closeTimerRef.current = null;
  }, []);

  const finishClose = useCallback(() => {
    clearScheduledWork();
    restorePage();
    updatePhase("closed");
    setInstant(false);
    backdropPointerDownRef.current = false;

    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    focusFrameRef.current = requestAnimationFrame(() => {
      if (target?.isConnected) target.focus();
      focusFrameRef.current = null;
    });
  }, [clearScheduledWork, restorePage, updatePhase]);

  const closeContact = useCallback(
    (animate = true) => {
      const dialog = dialogRef.current;
      if (!dialog?.open || phaseRef.current === "closing") return;

      if (openFrameRef.current !== null) cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || reduceMotion) {
        setInstant(true);
        dialog.close();
        return;
      }

      setInstant(false);
      updatePhase("closing");
      closeTimerRef.current = window.setTimeout(() => {
        if (dialog.open) dialog.close();
      }, readCloseDuration());
    },
    [updatePhase],
  );

  const openContact = useCallback(
    ({ animate = true, returnFocus = null }: OpenContactOptions = {}) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      clearScheduledWork();
      returnFocusRef.current = returnFocus;

      if (dialog.open) {
        updatePhase("open");
        titleRef.current?.focus();
        return;
      }

      previousOverflowRef.current = {
        body: document.body.style.overflow,
        html: document.documentElement.style.overflow,
        gutter: document.documentElement.style.scrollbarGutter,
      };
      document.documentElement.style.scrollbarGutter = "stable";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const shouldAnimate = animate && !reduceMotion;
      setInstant(!shouldAnimate);
      updatePhase("closed");
      dialog.showModal();

      const reveal = () => {
        updatePhase("open");
        titleRef.current?.focus();
        openFrameRef.current = null;
      };

      if (shouldAnimate) {
        openFrameRef.current = requestAnimationFrame(reveal);
      } else {
        reveal();
      }
    },
    [clearScheduledWork, updatePhase],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      clearScheduledWork();
      returnFocusRef.current = null;
      if (dialog?.open) dialog.close();
      if (phaseRef.current !== "closed") restorePage();
    };
  }, [clearScheduledWork, restorePage]);

  const contextValue = useMemo(() => ({ openContact }), [openContact]);

  const isOutsidePanel = (
    event: ReactMouseEvent<HTMLDialogElement> | ReactPointerEvent<HTMLDialogElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDialogElement>) => {
    backdropPointerDownRef.current =
      event.target === event.currentTarget && isOutsidePanel(event);
  };

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    const shouldClose =
      backdropPointerDownRef.current &&
      event.target === event.currentTarget &&
      isOutsidePanel(event);
    backdropPointerDownRef.current = false;
    if (shouldClose) closeContact(event.detail !== 0);
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeContact(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);
    const activeElement = document.activeElement as HTMLElement | null;

    if (!firstElement || !lastElement) return;

    if (
      event.shiftKey &&
      (activeElement === firstElement || !focusableElements.includes(activeElement as HTMLElement))
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      (activeElement === lastElement || !focusableElements.includes(activeElement as HTMLElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <ContactDialogContext.Provider value={contextValue}>
      {children}
      <dialog
        ref={dialogRef}
        id="site-contact-dialog"
        className={`site-contact-dialog t-modal${phase === "open" ? " is-open" : ""}${
          phase === "closing" ? " is-closing" : ""
        }${instant ? " is-instant" : ""}`}
        aria-labelledby="site-contact-dialog-title"
        aria-describedby="site-contact-dialog-description"
        onPointerDown={handlePointerDown}
        onClick={handleBackdropClick}
        onKeyDown={handleDialogKeyDown}
        onCancel={(event) => {
          event.preventDefault();
          closeContact(false);
        }}
        onClose={finishClose}
      >
        <button
          className="site-contact-dialog-close"
          type="button"
          aria-label="Cerrar formulario de contacto"
          onClick={(event) => closeContact(event.detail !== 0)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="site-contact-dialog-scroll">
          <div className="site-contact-dialog-grid">
            <div className="site-contact-dialog-copy">
              <p className="site-eyebrow">Empecemos por el problema</p>
              <h2 ref={titleRef} id="site-contact-dialog-title" tabIndex={-1}>
                ¿Qué necesitas <em>construir</em>?
              </h2>
              <p id="site-contact-dialog-description">
                Cuéntanos qué debería cambiar. No necesitas llegar con requisitos ni con el
                alcance definido.
              </p>
              <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
            </div>
            <ContactForm context="dialog" />
          </div>
        </div>
      </dialog>
    </ContactDialogContext.Provider>
  );
}
