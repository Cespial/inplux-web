"use client";

import { useCallback, useEffect, useState } from "react";
import { SLIDES, TOTAL_SLIDES, type DeckSlide } from "@/content/deck";

function indiceDesdeHash(hash: string): number {
  const id = hash.replace(/^#/, "");
  const encontrado = SLIDES.findIndex((slide) => slide.id === id);
  return encontrado === -1 ? 0 : encontrado;
}

export type DeckNav = {
  indice: number;
  slide: DeckSlide;
  direccion: 1 | -1;
  secuencia: number;
  ir: (n: number) => void;
  siguiente: () => void;
  anterior: () => void;
};

// Un solo objeto de estado. Índice, dirección y secuencia cambian
// SIEMPRE juntos, así que separarlos en tres useState obligaría a llamar
// un setState dentro del updater de otro — que React invoca dos veces en
// StrictMode y desincroniza la dirección de la transición.
type Estado = { indice: number; direccion: 1 | -1; secuencia: number };

export function useDeckNav(): DeckNav {
  // Arranca siempre en 0 para que servidor y primer render del cliente
  // coincidan. El hash se aplica en el efecto, ya hidratado.
  const [estado, setEstado] = useState<Estado>({ indice: 0, direccion: 1, secuencia: 0 });

  const ir = useCallback((n: number) => {
    setEstado((actual) => {
      const destino = Math.max(0, Math.min(TOTAL_SLIDES - 1, n));
      if (destino === actual.indice) return actual;
      return {
        indice: destino,
        direccion: destino > actual.indice ? 1 : -1,
        secuencia: actual.secuencia + 1,
      };
    });
  }, []);

  const mover = useCallback((delta: 1 | -1) => {
    setEstado((actual) => {
      const destino = Math.max(0, Math.min(TOTAL_SLIDES - 1, actual.indice + delta));
      if (destino === actual.indice) return actual;
      return { indice: destino, direccion: delta, secuencia: actual.secuencia + 1 };
    });
  }, []);

  const siguiente = useCallback(() => mover(1), [mover]);
  const anterior = useCallback(() => mover(-1), [mover]);

  // El hash se escribe en un efecto, no dentro del updater: history es un
  // efecto de fuera de React y no puede vivir en una función pura.
  //
  // La guarda es `secuencia === 0`, no un ref de «primer render». Con el ref,
  // StrictMode monta los efectos dos veces: la segunda pasada ya lo encuentra
  // consumido, reescribe el hash a #portada con el índice viejo y la lectura
  // del hash que corre justo después —en la misma pasada— aterriza en la
  // portada en vez de en la lámina pedida. Verificado en `npm run dev`
  // abriendo /deck/presentacion#espejo. `secuencia` solo avanza cuando la
  // lámina cambió de verdad, así que sobrevive a cualquier número de pasadas.
  useEffect(() => {
    if (estado.secuencia === 0) return;
    window.history.replaceState(null, "", `#${SLIDES[estado.indice].id}`);
  }, [estado.secuencia, estado.indice]);

  useEffect(() => {
    const alCambiarHash = () => ir(indiceDesdeHash(window.location.hash));
    window.addEventListener("hashchange", alCambiarHash);
    // La lectura inicial del hash pasa por el mismo callback y en un
    // microtask: llamar setState en el cuerpo del efecto encadena renders y
    // `react-hooks/set-state-in-effect` lo rechaza. `ir` es idempotente, así
    // que las dos pasadas de StrictMode aterrizan en la misma lámina.
    if (window.location.hash) queueMicrotask(alCambiarHash);
    return () => window.removeEventListener("hashchange", alCambiarHash);
  }, [ir]);

  useEffect(() => {
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;
      switch (evento.key) {
        case "ArrowRight": case "PageDown": case " ": evento.preventDefault(); siguiente(); break;
        case "ArrowLeft": case "PageUp": evento.preventDefault(); anterior(); break;
        case "Home": evento.preventDefault(); ir(0); break;
        case "End": evento.preventDefault(); ir(TOTAL_SLIDES - 1); break;
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [siguiente, anterior, ir]);

  return {
    indice: estado.indice,
    slide: SLIDES[estado.indice],
    direccion: estado.direccion,
    secuencia: estado.secuencia,
    ir,
    siguiente,
    anterior,
  };
}
