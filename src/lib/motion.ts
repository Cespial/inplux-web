import type { Transition } from "motion/react";

/**
 * Escala de springs INPLUX (física, no duración).
 * - snappy : micro-interacciones, hover/tap de botones. Respuesta nítida.
 * - smooth : UI estándar, cards que entran, paneles. Default de la casa.
 * - gentle : superficies grandes / hero (tilt). Asentamiento suave.
 * - bouncy : acentos con personalidad (badges). Overshoot leve.
 */
export const snappy: Transition = { type: "spring", stiffness: 400, damping: 28, mass: 0.7 };
export const smooth: Transition = { type: "spring", stiffness: 200, damping: 26 };
export const gentle: Transition = { type: "spring", stiffness: 120, damping: 20 };
export const bouncy: Transition = { type: "spring", stiffness: 500, damping: 18, mass: 0.8 };

/** Objeto (para `import { spring }` → spring.smooth) además de los named sueltos. */
export const spring = { snappy, smooth, gentle, bouncy } as const;
export type SpringName = keyof typeof spring;

/** Easing asimétrico estilo Linear (espejo JS de los tokens CSS --ease-*). */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN: [number, number, number, number] = [0.4, 0.14, 1, 1];
export const EASE_STD: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export const exitTween: Transition = { duration: 0.16, ease: EASE_IN };
export const revealTween: Transition = { duration: 0.45, ease: EASE_OUT };

/**
 * Props de hover/tap con física interrumpible para botones/cards.
 * Bajo reduced-motion devuelve {} (sin desplazamiento ni scale).
 */
export function pressable(reduced: boolean) {
  if (reduced) return {} as Record<string, never>;
  return { whileHover: { y: -2, scale: 1.01 }, whileTap: { scale: 0.98 }, transition: snappy };
}
