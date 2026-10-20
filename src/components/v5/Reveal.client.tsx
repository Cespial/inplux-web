"use client";

import { useEffect } from "react";

const TARGETS =
  "[data-reveal]:not([data-revealed]), [data-reveal-children]:not([data-revealed]), " +
  "[data-reveal-band] > :not([data-reveal], [data-reveal-children], [data-revealed])";

/** El borde superior de un bloque dispara su entrada al cruzar este punto de la ventana. */
const TRIGGER = 0.86;

/**
 * Entrada al hacer scroll. Marca con `data-revealed` cada `[data-reveal]` (un
 * bloque), cada `[data-reveal-children]` (sus hijos entran escalonados) y cada
 * hijo directo de un `[data-reveal-band]` que no se anime solo, la primera vez
 * que su borde superior cruza el 86 % del alto de la ventana (el mismo disparo
 * que usa PRIMERO). La comparación es por posición y no por intersección: así
 * también se revela lo que quedó arriba cuando alguien salta (Fin, un ancla) y
 * lo que vive en la franja final de una página que ya no puede bajar más.
 *
 * Se mide en un `requestAnimationFrame` por scroll: primero todas las
 * lecturas, después todas las escrituras, y sólo sobre lo que falta por
 * revelar. La animación es CSS (`v5.module.css`): opacidad, desplazamiento y
 * desenfoque, nunca alto, así que no mueve el layout.
 *
 * El CSS sólo oculta bajo `html[data-motion]`, que pone el script en línea del
 * layout antes del primer pintado. Si este componente no llega a montar en
 * 2,6 s, ese mismo script quita el atributo y todo queda visible; sin
 * JavaScript nunca se oculta nada. Con «reducir movimiento» se revela todo al
 * montar (y el CSS tampoco oculta).
 */
export function Reveal() {
  useEffect(() => {
    document.documentElement.dataset.motionReady = "";
    let pending = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach(reveal);
      return;
    }

    let frame = 0;
    const check = () => {
      frame = 0;
      const { scrollHeight } = document.documentElement;
      const atEnd = window.innerHeight + window.scrollY >= scrollHeight - 2;
      const line = window.innerHeight * TRIGGER;
      const due = atEnd ? pending : pending.filter((el) => el.getBoundingClientRect().top < line);
      if (due.length === 0) return;
      due.forEach(reveal);
      pending = pending.filter((el) => !due.includes(el));
      if (pending.length === 0) stop();
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    check();
    return stop;
  }, []);

  return null;
}
