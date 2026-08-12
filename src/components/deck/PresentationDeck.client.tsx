"use client";

import { useRef, useState } from "react";
import { SLIDES, TOTAL_SLIDES, type DeckSlide } from "@/content/deck";
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

  return (
    <div
      className={styles.riel}
      data-direccion={nav.direccion === 1 ? "adelante" : "atras"}
      onTouchStart={(e) => {
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

      <div className={styles.slot} data-estado="activa" key={`activa-${nav.secuencia}`}>
        <SlideRenderer slide={nav.slide} motivos={motivos} />
      </div>

      <div className={styles.controles}>
        <p className={styles.contadorLaminas} aria-live="polite">
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

      {/* Sin JS, o antes de hidratar, las quince láminas siguen siendo
          texto navegable: el deck se puede leer y se puede indexar. El riel
          deja montada la portada, así que la lista la repite: se anuncia como
          índice para que se lea como tal y no como una lámina duplicada. */}
      <noscript>
        <div className={styles.sinScript}>
          <p>
            El recorrido lámina a lámina necesita JavaScript. Estas son las quince
            láminas de la presentación, en orden.
          </p>
          {SLIDES.map((slide) => (
            <section key={slide.id} data-slide={slide.id} aria-label={slide.titulo}>
              <h2 className={styles.titulo}>{slide.titulo}</h2>
            </section>
          ))}
          <p>
            <a href="/deck">Volver al índice del deck</a>
          </p>
        </div>
      </noscript>
    </div>
  );
}
