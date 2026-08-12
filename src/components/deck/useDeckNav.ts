"use client";

import { useCallback, useEffect, useState } from "react";
import { SLIDES, TOTAL_SLIDES, type DeckSlide } from "@/content/deck";

function indiceDesdeHash(hash: string): number {
  const id = hash.replace(/^#/, "");
  const encontrado = SLIDES.findIndex((slide) => slide.id === id);
  return encontrado === -1 ? 0 : encontrado;
}

/** ¿El evento nace dentro de algo donde se escribe? */
function escribiendo(objetivo: EventTarget | null): boolean {
  if (!(objetivo instanceof HTMLElement)) return false;
  if (objetivo.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(objetivo.tagName);
}

/**
 * ¿Hay un diálogo abierto encima?
 *
 * Un `<dialog>` en modal deja inerte el resto del documento para el ratón,
 * pero el teclado sigue burbujeando hasta `window`: sin esta guarda, las
 * flechas moverían el deck por detrás del índice o de la ayuda mientras se
 * leen. Se consulta el DOM en vez de recibir el estado por parámetro para que
 * valga con cualquier diálogo, lo abra quien lo abra.
 */
function hayDialogoAbierto(): boolean {
  return document.querySelector("dialog[open]") !== null;
}

/**
 * ¿El documento se puede desplazar ahora mismo?
 *
 * ⚠️ **Cuando la respuesta es sí, `Espacio`, `Av Pág`, `Re Pág`, `Inicio` y
 * `Fin` dejan de ser del deck.** El riel es `overflow: hidden auto`, así que
 * con el texto ampliado —200 % de la fuente del navegador, que es lo que pide
 * SC 1.4.4— la lámina crece, el documento se desplaza y el contenido sigue
 * estando todo ahí. Lo que se perdía era la forma de llegar a él: medido a
 * 200 %, `Espacio` y `Av Pág` cambiaban de lámina en vez de bajar una pantalla
 * y `Fin` saltaba a la última en vez de ir al final del documento, así que
 * quien leía ampliado tenía que bajar con `↓` unas doce veces —la única tecla
 * que no estaba tomada— y las dos que cualquiera pulsa primero le saltaban la
 * lámina.
 *
 * Las flechas `←` y `→` NO entran en esta guarda: son las del deck, no las del
 * navegador, y quien las pulsa está conduciendo. Se pregunta por el estado real
 * del documento en cada pulsación y no por un tamaño de fuente: da igual por
 * qué se desplace —ampliación, fuente grande, una lámina que creció—, si hay
 * dónde bajar, bajar es lo que tiene que hacer la tecla de bajar.
 */
function documentoSeDesplaza(): boolean {
  const raiz = document.documentElement;
  return raiz.scrollHeight - raiz.clientHeight > 1;
}

/** Los atajos que el chrome atiende y el riel se limita a encaminar. */
export type AtajosDeck = {
  /** `i` */
  alPedirIndice?: () => void;
  /** `?` */
  alPedirAyuda?: () => void;
};

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

// `alPedirIndice` y `alPedirAyuda` se desestructuran a propósito: el efecto del
// teclado los lleva en su lista de dependencias y un objeto de opciones nuevo
// en cada render volvería a registrar el listener en cada pasada.
export function useDeckNav({ alPedirIndice, alPedirAyuda }: AtajosDeck = {}): DeckNav {
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
  // La guarda es `secuencia === 0`, no un ref de «primer render».
  //
  // ⚠️ El camino que rompe con el ref es **entrar desde el índice de /deck**,
  // no recargar. React 19.2 NO dobla los efectos durante la hidratación, así
  // que una recarga dura de /deck/presentacion#espejo aterriza bien incluso
  // con el ref: quien lo compruebe por ahí lo verá funcionar y creerá que la
  // guarda sobra. El montaje que viene de una navegación de cliente sí se
  // dobla —y **solo en `npm run dev`, que monta bajo StrictMode**: con
  // `npm run build && npm run start` los efectos corren una sola vez y el
  // fallo no se reproduce por ningún camino, así que quien intente verlo
  // contra el build no verá nada—. Traza instrumentada, en dev, versión del
  // brief, clic en el enlace del índice (11-ago-2026):
  //
  //   lectura inicial, hash = #espejo    ← pasada 1, pide la lámina 5
  //   replaceState -> portada indice 0   ← pasada 2, escribe con el índice viejo
  //   lectura inicial, hash = #portada   ← pasada 2, lee el hash ya pisado
  //
  // y el deck abre en la portada con la URL reescrita a #portada. `secuencia`
  // solo avanza cuando la lámina cambió de verdad, así que sobrevive a
  // cualquier número de pasadas.
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
      // Con el índice o la ayuda abiertos el teclado es suyo: `Esc` lo cierra
      // (lo hace el propio <dialog>) y nada más mueve el deck por detrás.
      if (hayDialogoAbierto()) return;
      // Mantener pulsada la flecha no debe recorrer el deck entero.
      if (evento.repeat) return;
      // Las láminas van a llevar cuerpo: si el foco está escribiendo en algún
      // sitio, el espacio y las flechas son suyos, no del riel.
      if (escribiendo(evento.target)) return;
      // Las cinco teclas que el navegador usa para desplazar el documento se
      // devuelven en cuanto hay algo que desplazar. Ver `documentoSeDesplaza`.
      const deDesplazamiento =
        evento.key === " " ||
        evento.key === "PageDown" ||
        evento.key === "PageUp" ||
        evento.key === "Home" ||
        evento.key === "End";
      if (deDesplazamiento && documentoSeDesplaza()) return;

      switch (evento.key) {
        case " ":
          // Mayús+Espacio retrocede de página en el navegador; que aquí
          // avanzara era lo contrario de lo que pide quien lo pulsa.
          evento.preventDefault();
          if (evento.shiftKey) anterior();
          else siguiente();
          break;
        case "ArrowRight": case "PageDown": evento.preventDefault(); siguiente(); break;
        case "ArrowLeft": case "PageUp": evento.preventDefault(); anterior(); break;
        case "Home": evento.preventDefault(); ir(0); break;
        case "End": evento.preventDefault(); ir(TOTAL_SLIDES - 1); break;
        // El índice y la ayuda salen por aquí y no por un listener propio del
        // chrome: así heredan las mismas guardas —tecla repetida, tecla nacida
        // en un campo editable, diálogo ya abierto— en vez de copiarlas.
        // `I` además de `i` porque con Bloq Mayús la tecla llega en mayúscula.
        case "i": case "I": evento.preventDefault(); alPedirIndice?.(); break;
        case "?": evento.preventDefault(); alPedirAyuda?.(); break;
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [siguiente, anterior, ir, alPedirIndice, alPedirAyuda]);

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
