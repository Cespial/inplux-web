"use client";

import { useEffect, useRef, useState } from "react";
import { TOTAL_SLIDES, type DeckSlide } from "@/content/deck";
import { SlideRenderer } from "./SlideRenderer";
import { useDeckNav } from "./useDeckNav";
import styles from "./deck.module.css";

/** La lámina que ocupa un slot del riel, atada a la secuencia que la montó. */
type Montada = { slide: DeckSlide; secuencia: number };

/** Un deslizamiento cuenta si recorre esto y es más horizontal que vertical. */
const RECORRIDO_MINIMO = 60;

// `motivos` llega desde la ruta, que es un componente de servidor y los
// lee del verificador en build. Un componente async NO se puede
// renderizar desde un componente cliente, así que la lectura vive
// arriba del límite y baja como prop. Ver la Tarea 12.
export function PresentationDeck({ motivos }: { motivos: readonly string[] }) {
  const nav = useDeckNav();
  const inicioTactil = useRef<{ x: number; y: number } | null>(null);
  const slotActivo = useRef<HTMLDivElement | null>(null);

  // Dos slots, no una lista de quince. Montar las quince haría que todas las
  // animaciones de entrada terminaran antes de que nadie las viera.
  const [montada, setMontada] = useState<Montada>({
    slide: nav.slide,
    secuencia: nav.secuencia,
  });
  const [saliente, setSaliente] = useState<Montada | null>(null);

  // Ajuste de estado durante el render, no en un efecto: la lámina que sale y
  // la que entra tienen que aparecer en el mismo commit; con un efecto se ve
  // un fotograma con la nueva ya puesta y la vieja todavía sin animarse.
  // React descarta esta pasada y vuelve a llamar al componente con el estado
  // nuevo, así que el JSX de abajo siempre pinta el par ya sincronizado.
  if (montada.secuencia !== nav.secuencia) {
    setSaliente(montada);
    setMontada({ slide: nav.slide, secuencia: nav.secuencia });
  }

  // Cambiar de lámina mueve el foco a la que entra. Es lo que la anuncia —el
  // slot lleva su nombre accesible con posición y título— y de paso resuelve
  // que el foco se quedaba en un botón que acababa de deshabilitarse al
  // llegar a un extremo. En la carga (secuencia 0) no se toca el foco: nadie
  // ha pedido nada todavía.
  useEffect(() => {
    if (nav.secuencia === 0) return;
    slotActivo.current?.focus({ preventScroll: true });
  }, [nav.secuencia]);

  return (
    <div
      className={styles.riel}
      data-direccion={nav.direccion === 1 ? "adelante" : "atras"}
      onTouchStart={(e) => {
        // Un segundo dedo desarma el gesto: ampliar con dos dedos no es
        // deslizar, y sin esta guarda el pellizco se leería como avance.
        if (e.touches.length !== 1) {
          inicioTactil.current = null;
          return;
        }
        inicioTactil.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const inicio = inicioTactil.current;
        inicioTactil.current = null;
        if (inicio === null) return;
        const recorrido = e.changedTouches[0].clientX - inicio.x;
        const desvio = Math.abs(e.changedTouches[0].clientY - inicio.y);
        // El desvío vertical desarma el gesto: en un móvil, arrastrar hacia
        // abajo es leer, no avanzar.
        if (Math.abs(recorrido) <= RECORRIDO_MINIMO || desvio > Math.abs(recorrido)) return;
        if (recorrido < 0) nav.siguiente();
        else nav.anterior();
      }}
    >
      {/* La lámina que sale vive hasta que termina su animación. El arnés lee
          la lámina visible como `[data-estado="activa"] [data-slide]`: durante
          la transición hay dos `data-slide` en el DOM y solo una se está
          viendo. */}
      {saliente === null ? null : (
        <div
          className={styles.slot}
          data-estado="saliente"
          key={`saliente-${saliente.secuencia}`}
          aria-hidden="true"
          inert
          onAnimationEnd={(e) => {
            // Las animaciones de dentro de la lámina también burbujean hasta
            // aquí; solo la del propio slot la desmonta.
            if (e.target === e.currentTarget) setSaliente(null);
          }}
        >
          <SlideRenderer slide={saliente.slide} motivos={motivos} />
        </div>
      )}

      <div
        className={styles.slot}
        data-estado="activa"
        key={`activa-${nav.secuencia}`}
        ref={slotActivo}
        tabIndex={-1}
        role="group"
        aria-roledescription="lámina"
        aria-label={`${nav.indice + 1} de ${TOTAL_SLIDES}: ${nav.slide.titulo}`}
      >
        <SlideRenderer slide={nav.slide} motivos={motivos} />
      </div>

      <div className={styles.controles}>
        {/* El contador ya no es una región viva: el cambio lo anuncia el foco
            al aterrizar en la lámina, con su posición y su título. Dos
            anuncios para el mismo movimiento sobraban. */}
        <p className={styles.contadorLaminas}>
          <span className={styles.contadorNumero}>{nav.indice + 1}</span> / {TOTAL_SLIDES}
        </p>

        <div className={styles.pasos}>
          <button
            className={styles.paso}
            type="button"
            onClick={nav.anterior}
            disabled={nav.indice === 0}
          >
            Lámina anterior
          </button>
          <button
            className={styles.paso}
            type="button"
            onClick={nav.siguiente}
            disabled={nav.indice === TOTAL_SLIDES - 1}
          >
            Lámina siguiente
          </button>
        </div>
      </div>

      {/* Sin JavaScript el recorrido no existe. Repetir aquí los quince
          títulos ofrecía MENOS que /deck —que los publica enlazados— y metía
          quince `data-slide` de más en el HTML construido, una trampa para
          cualquiera que los cuente. Queda la frase y el enlace. Si algún día
          las láminas traen su cuerpo real aquí dentro, se reconsidera. */}
      <noscript>
        <p className={styles.sinScript}>
          El recorrido lámina a lámina necesita JavaScript.{" "}
          <a href="/deck">Ver el índice de las quince láminas</a>.
        </p>
      </noscript>
    </div>
  );
}
