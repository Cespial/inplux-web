"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { perfilesDe, type DeckSlide } from "@/content/deck";
import type { ReglaBloqueada } from "@/lib/banned-reasons.server";
import { ALTO_BARRA_INFERIOR, ALTO_BARRA_SUPERIOR } from "./chrome/altos";
import { HelpOverlay } from "./chrome/HelpOverlay.client";
import { IndexOverlay } from "./chrome/IndexOverlay.client";
import { ProgressRail } from "./chrome/ProgressRail";
import { TopBar } from "./chrome/TopBar";
import chrome from "./chrome/chrome.module.css";
import { SlideRenderer } from "./SlideRenderer";
import { useDeckNav } from "./useDeckNav";
import styles from "./deck.module.css";

/** La lámina que ocupa un slot del riel, atada a la secuencia que la montó. */
type Montada = { slide: DeckSlide; secuencia: number };

/** Un deslizamiento cuenta si recorre esto y es más horizontal que vertical. */
const RECORRIDO_MINIMO = 60;

// Los dos altos del chrome bajan al CSS como variables, desde las constantes y
// no como literales repetidos: el margen de bloque de la lámina y el alto de
// las barras salen del mismo número, así que no pueden divergir y dejar una
// lámina metida debajo de una barra.
const ALTOS = {
  "--deck-barra-superior": `${ALTO_BARRA_SUPERIOR}px`,
  "--deck-barra-inferior": `${ALTO_BARRA_INFERIOR}px`,
} as CSSProperties;

// `reglas` llega desde la ruta, que es un componente de servidor y las lee del
// verificador en build. Un componente async NO se puede renderizar desde un
// componente cliente, así que la lectura vive arriba del límite y baja como
// prop. El `import type` de arriba se borra en el empaquetado: lo que cruza el
// límite son datos, nunca el lector.
//
// ⚠️ **`slides` también llega por prop, y ese es el mecanismo entero del deck
// dirigido.** Este componente importaba `SLIDES` y `TOTAL_SLIDES` del módulo,
// así que había UN solo deck posible: una segunda ruta con otro subconjunto
// habría enseñado igual las láminas del general. Quien monta el riel dice qué
// láminas conduce; el riel no lo decide.
export function PresentationDeck({
  slides,
  // La ruta que publica el índice de ESTE deck. Sin JavaScript el recorrido no
  // existe y lo único que queda es ese enlace: con `/deck` escrito aquí, quien
  // abriera el deck dirigido sin JS aterrizaba en el índice del general —otras
  // láminas, otros productos— sin ninguna señal de que había cambiado de deck.
  hrefIndice,
  reglas,
}: {
  slides: readonly DeckSlide[];
  hrefIndice: string;
  reglas: readonly ReglaBloqueada[];
}) {
  const total = slides.length;
  // Los perfiles de la serie, para las dos láminas que hablan de ella entera.
  // `useMemo` porque este componente se vuelve a pintar en cada cambio de
  // lámina y el arreglo baja como prop hasta la figura.
  const perfiles = useMemo(() => perfilesDe(slides), [slides]);
  // El índice y la ayuda se montan solo cuando se piden. No es una preferencia
  // de estilo: `verify-build-output.mjs` exige CERO `<dialog>` en el HTML
  // construido de /deck/presentacion, y un diálogo montado desde el primer
  // render —aunque salga cerrado— rompe `check:output`.
  const [overlay, setOverlay] = useState<"indice" | "ayuda" | null>(null);
  const abrirIndice = useCallback(() => setOverlay("indice"), []);
  const abrirAyuda = useCallback(() => setOverlay("ayuda"), []);
  const cerrarOverlay = useCallback(() => setOverlay(null), []);

  const nav = useDeckNav({ slides, alPedirIndice: abrirIndice, alPedirAyuda: abrirAyuda });
  const inicioTactil = useRef<{ x: number; y: number } | null>(null);
  const slotActivo = useRef<HTMLDivElement | null>(null);

  // Dos slots, no una lista con el deck entero. Montarlas todas haría que
  // todas las animaciones de entrada terminaran antes de que nadie las viera.
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
  //
  // Cuando el salto viene del índice, este efecto corre DESPUÉS de que el
  // diálogo devuelva el foco a quien lo abrió, así que gana la lámina, que es
  // lo que se acaba de pedir. Si el destino era la lámina ya visible no hay
  // cambio de secuencia, el efecto no corre, y el foco se queda en el botón
  // que abrió el índice: también correcto.
  // ⚠️ **Salvo si quien pidió el cambio está en el riel.** Medido con teclado
  // real: foco en «Lámina siguiente» → Enter → el foco acababa en el slot y
  // volver al mismo botón costaba **18 tabulaciones** (los dos botones de la
  // barra superior y un segmento de riel por lámina). Quien conduce el deck
  // desde el riel es justamente quien no usa las flechas —conmutador, teclado
  // en pantalla, navegación por tabulación— y no podía repetir la acción sin
  // recorrer el riel entero.
  //
  // La guarda mira SOLO el riel (`data-deck-chrome="inferior"`) y no el chrome
  // entero, a propósito: el índice se abre desde la barra superior y al
  // cerrarse el `<dialog>` devuelve el foco al botón que lo abrió, así que si
  // la guarda cubriera también la barra, el salto desde el índice dejaría el
  // foco arriba y la lámina pedida no se anunciaría. Ese camino tiene que
  // seguir moviendo el foco.
  //
  // El precio, declarado: al conducir desde el riel, el cambio de lámina ya no
  // se anuncia por traslado de foco. Se acepta porque en ese camino el usuario
  // acaba de pedir esa lámina por su nombre —los segmentos se llaman «Ir a
  // <título>»— y el coste de volver era real y medido.
  useEffect(() => {
    if (nav.secuencia === 0) return;
    const activo = document.activeElement;
    if (activo instanceof HTMLElement && activo.closest('[data-deck-chrome="inferior"]') !== null) {
      return;
    }
    slotActivo.current?.focus({ preventScroll: true });
  }, [nav.secuencia]);

  return (
    <div
      className={`${styles.riel} ${chrome.conChrome}`}
      style={ALTOS}
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
      <TopBar
        titulo={nav.slide.titulo}
        indice={nav.indice}
        total={total}
        alPedirIndice={abrirIndice}
        alPedirAyuda={abrirAyuda}
      />

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
          <SlideRenderer slide={saliente.slide} perfiles={perfiles} reglas={reglas} />
        </div>
      )}

      {/* Un solo nombre accesible para la lámina, el de este slot. La
          <section> de dentro dejó de llevar `aria-label`: repetía el título
          del <h1> y de paso convertía cada lámina en una región con el mismo
          nombre que su encabezado. */}
      <div
        className={styles.slot}
        data-estado="activa"
        key={`activa-${nav.secuencia}`}
        ref={slotActivo}
        tabIndex={-1}
        role="group"
        aria-roledescription="lámina"
        aria-label={`${nav.indice + 1} de ${total}: ${nav.slide.titulo}`}
      >
        <SlideRenderer slide={nav.slide} perfiles={perfiles} reglas={reglas} />
      </div>

      <ProgressRail
        slides={slides}
        indice={nav.indice}
        ir={nav.ir}
        anterior={nav.anterior}
        siguiente={nav.siguiente}
      />

      {overlay === "indice" ? (
        <IndexOverlay slides={slides} indice={nav.indice} ir={nav.ir} alCerrar={cerrarOverlay} />
      ) : null}
      {overlay === "ayuda" ? <HelpOverlay alCerrar={cerrarOverlay} /> : null}

      {/* Sin JavaScript el recorrido no existe. Repetir aquí los títulos de
          todas las láminas ofrecía MENOS que /deck —que los publica
          enlazados— y metía un `data-slide` de más por lámina en el HTML
          construido, una trampa para cualquiera que los cuente. Queda la frase
          y el enlace. Si algún día las láminas traen su cuerpo real aquí
          dentro, se reconsidera.
          ⚠️ El número sale del deck que se monta, no escrito: este texto se
          publica dentro del `<noscript>` del HTML construido y decía «las
          quince láminas». */}
      <noscript>
        <p className={styles.sinScript}>
          El recorrido lámina a lámina necesita JavaScript.{" "}
          <a href={hrefIndice}>Ver el índice de las {total} láminas</a>.
        </p>
      </noscript>
    </div>
  );
}
