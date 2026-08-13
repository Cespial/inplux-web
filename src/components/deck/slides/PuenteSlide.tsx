import Image from "next/image";
import type { CSSProperties } from "react";
import { DECK_COPY, type DeckSlide } from "@/content/deck";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { formatShortDate } from "@/content/work-format";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./puente.module.css";

const { pregunta, respuesta } = DECK_COPY.puente;

/**
 * ⚠️ **COPY DE FIGURA QUE NO SALE DE `deck.copy.ts`, y lo digo en vez de
 * esconderlo.** Son dos fragmentos y ninguno afirma nada nuevo: el primero
 * nombra QUÉ son las cinco imágenes y el segundo dice DÓNDE se ven enteras.
 * Ninguno trae cifras: el número de capturas y las fechas se derivan.
 *
 * Van aquí, aislados y arriba, por el precedente que ya fijaron
 * `DECK_COPY.problema.figura` y `DECK_COPY.tesis.figura`: **cuando
 * `deck.copy.ts` se pueda tocar, esto sube a `puente.figura` y aquí queda una
 * línea de import.** «Captura de navegador» ya existe como rótulo, en singular,
 * en `CapturaEnmarcada.tsx`; esta es su forma en plural.
 */
const ROTULO_FIGURA = {
  acta: "capturas de navegador",
  remate: "cada una se ve completa en su lámina",
} as const;

/** Los perfiles que esta lámina enseña: los del deck que la contiene. */
type Perfiles = readonly Extract<DeckSlide, { kind: "producto" }>["perfil"][];

/**
 * El acta de la vitrina, derivada. Ni el conteo ni las fechas se escriben: el
 * número sale de los perfiles QUE ESTE DECK PRESENTA y el rango, de las
 * `capturedAt` del acta de procedencia
 * (`public/work/real-pages/capture-manifest.json`, contra la que
 * `scripts/verify-captures.test.mjs` compara fichero, fecha, URL y `sha256`).
 * Si mañana se recaptura Porkia, esta línea cambia sola; si entra un sexto
 * producto, dice seis.
 *
 * ⚠️ **Los perfiles llegan por parámetro y ya no de `workProfiles`.** Leyendo
 * el global, un deck recortado pintaba en esta vitrina los cinco productos y
 * declaraba «5 capturas de navegador» mientras la serie de fichas que venía
 * detrás traía cuatro: el conteo era derivado y aun así mentía, porque estaba
 * derivado de la fuente equivocada.
 */
function actaDeLaVitrina(perfiles: Perfiles) {
  const fechas = perfiles.map((perfil) => workCaptures[perfil.slug].capturedAt).sort();
  const primera = formatShortDate(fechas[0]);
  const ultima = formatShortDate(fechas[fechas.length - 1]);
  const rango = primera === ultima ? primera : `${primera} – ${ultima}`;
  return `${perfiles.length} ${ROTULO_FIGURA.acta} · ${rango} · ${ROTULO_FIGURA.remate}`;
}

/**
 * El ancho que ocupa cada miniatura, para `next/image`.
 *
 * Los porcentajes salen de la rejilla de `puente.module.css` medidos contra sus
 * `clamp` reales: por encima de 62rem son cinco pistas iguales —242 px de 1440
 * (16,8 %) y 331 px de 1920 (17,2 %)—; por debajo la ficha se pone en fila y la
 * miniatura ocupa el 30 % de la lámina (103 px de 342, o sea 26 % del viewport).
 *
 * ⚠️ **Esto NO es `CAPTURA_SIZES`, y la diferencia se paga en la sala.** Con
 * este `sizes` el navegador se lleva el candidato de 640 px por captura; con el
 * de la ficha de producto (`(max-width: 62rem) 92vw, 41vw`) se llevaría el de
 * 1.200 y **calentaría la caché de las cinco láminas siguientes**, que hoy pagan
 * cada una su descarga en mitad de la presentación. Es una decisión de producto,
 * no de figura: aquí se elige lo barato y queda anotado que la otra opción
 * existe y qué compra.
 */
const MINIATURA_SIZES = "(max-width: 62rem) 26vw, 18vw";

/**
 * La geometría del nodo, publicada para que ni el `viewBox` ni la altura de la
 * caída vivan escritos dos veces — y sobre todo para que el rótulo pueda
 * alinearse con el ARO y no con el borde de arriba del SVG.
 *
 * ⚠️ Esa alineación es una corrección, no un adorno. Con la etiqueta pegada al
 * borde superior de un SVG de dos rem, lo que se veía en la ampliación era «un
 * tick gris, una etiqueta, y un círculo teal suelto quince píxeles más abajo»:
 * tres objetos en vez de un nodo con su nombre. La gramática de s50 pide
 * etiqueta DEL NODO; alineada con la caída, la etiqueta era del conector.
 * `--nodoCy` es la fracción del alto a la que vive el centro del aro, y de ahí
 * sale el desplazamiento del rótulo en el módulo.
 */
const NODO = { ancho: 18, alto: 28, caida: 9, cy: 19, r: 7 } as const;

const GEOMETRIA_NODO = {
  "--nodoCy": String(NODO.cy / NODO.alto),
} as CSSProperties;

/**
 * El nodo de la ficha: la caída desde el riel y el aro. Idéntico en las cinco,
 * y esa identidad ES la mitad de la afirmación de la lámina.
 *
 * ⚠️ `preserveAspectRatio` se queda por omisión (`xMidYMid meet`). Aquí hay un
 * `<circle>`: con `none` los ejes se escalan por separado y el aro se vuelve
 * óvalo en cuanto la caja pierde la proporción del `viewBox`.
 *
 * ⚠️ Sin `<text>` dentro. En toda la lámina no hay un solo `<text>` de SVG, así
 * que el límite declarado nº 5 del arnés —un `<text>` medido por su caja
 * entera— no puede dispararse aquí.
 */
function NodoDominio() {
  return (
    <svg
      className={styles.nodo}
      viewBox={`0 0 ${NODO.ancho} ${NODO.alto}`}
      focusable="false"
      aria-hidden="true"
    >
      {/* La caída muere tres unidades antes del borde del aro (19 − 7 = 12): en
          la gramática de s50 el conector se recorta a unos puntos del borde de
          cada forma, nunca nace ni muere pegado.

          ⚠️ Por arriba tampoco nace pegada al riel, y conviene decirlo bien: el
          `padding-top` de la ficha deja unos píxeles entre el `border-top` y el
          `y = 0` del lienzo. El recorte de ESE extremo es correcto por la misma
          regla, pero es accidental —lo produce la maqueta, no el dibujo—, así
          que si algún día ese `padding` se va a cero el conector nacerá pegado
          al riel y habrá que recortarlo aquí. */}
      <line
        className={styles.nodoCaida}
        x1={NODO.ancho / 2}
        y1={0}
        x2={NODO.ancho / 2}
        y2={NODO.caida}
      />
      <circle className={styles.nodoAro} cx={NODO.ancho / 2} cy={NODO.cy} r={NODO.r} />
    </svg>
  );
}

/**
 * Lámina 7 · El puente.
 *
 * Sin ella, lo que sigue son aplicaciones sueltas. Con ella, los mismos
 * productos son la evidencia de una sola afirmación: los dominios no se
 * parecen —tributación, gestión pública, derecho, arbitraje, porcicultura— y la
 * fábrica es la misma.
 *
 * **Por qué capturas y no un hub radial.** La gramática de `estilo-s50` tiene
 * el generador exacto para «un centro, N nodos», y se descartó por una razón
 * medible: un hub no produce materia. Un aro de 60 px de radio con trazo de
 * 2 px aporta 754 px² de tinta; cinco aros, 3,8 k px² = 0,4 % del lienzo — y
 * esta lámina era la que el diagnóstico señalaba como «aquí perdemos el acto
 * entero antes de empezarlo», con 2,3 % de tinta y 0,00 % de croma. Los
 * rellenos al 18 % que sí usa el catálogo tampoco sirven: un bloque igual para
 * los cinco no representa ninguna cantidad, y pintarlo sería inventar un dato
 * con forma de figura. Lo que sí hay, y es nuestro, son cinco capturas de
 * página real ya verificadas con su acta de procedencia. La gramática se
 * TRADUCE, no se copia: el marco de la captura es el nodo (interior del papel,
 * frontera cerrada), el aro colgado del riel es el nodo de dominio, la caída es
 * el conector recortado, el rótulo mono es la etiqueta del nodo y `status.label`
 * el descriptor gris.
 *
 * ⚠️ **La rejilla se deriva del número de perfiles, no de un número escrito.**
 * En F0.5 ese defecto apareció seis veces. Aquí no hay ningún `repeat(N, …)`
 * con N literal ni ninguna regla que nombre una posición.
 *
 * ⚠️ **Y los perfiles son los del deck que la monta, no los de `work.ts`.** Ver
 * `actaDeLaVitrina`. La lámina, además, no entra en el deck dirigido a
 * legaltech: su argumento —«la fábrica no es de un sector»— es justo el
 * contrario del que sirve en esa sala, y con una serie de un solo terreno la
 * frase deja de ser cierta. La decisión y su motivo viven en `SIN_PUENTE`, en
 * `src/content/deck.ts`.
 *
 * ⚠️ **Sin sombra en el marco**, a diferencia de `CapturaEnmarcada`. Allí la
 * captura es el objeto de la lámina y la sombra es parte de la frontera que
 * sustituye al halo; aquí son cinco objetos pequeños en fila y cinco sombras
 * leen como cinco tarjetas —«un catálogo»— en vez de como una serie. El precio
 * lo pagan las dos capturas claras (Tribai y Kelsen), y por eso el hilo del
 * marco no es `--border`: ver `.marco` en el módulo.
 */
export function PuenteSlide({ id, perfiles }: { id: string; perfiles: Perfiles }) {
  return (
    <Slide id={id}>
      <div className={`${deck.bloque} ${deck.escalonado}`}>
        <p className={deck.pregunta}>{pregunta}</p>
        <h1 className={deck.respuesta}>{respuesta}</h1>
      </div>

      <ul className={styles.vitrina}>
        {perfiles.map((perfil, i) => {
          const captura = workCaptures[perfil.slug];
          return (
            <li className={styles.ficha} key={perfil.slug} style={{ "--i": i } as CSSProperties}>
              <p className={styles.nodoFila} style={GEOMETRIA_NODO}>
                <NodoDominio />
                <span className={styles.rotulo}>{perfil.interface.eyebrow}</span>
              </p>

              <figure className={styles.marco}>
                <Image
                  className={styles.miniatura}
                  src={captura.src}
                  alt={captura.alt}
                  width={CAPTURA_ANCHO}
                  height={CAPTURA_ALTO}
                  sizes={MINIATURA_SIZES}
                />
              </figure>

              <div className={styles.fichaTexto}>
                {/* El dominio manda sobre el nombre, y es al revés de lo que uno
                    haría. La lámina no está presentando productos —eso lo hacen
                    las fichas que siguen, una por producto—: está afirmando que
                    los dominios no se parecen. El sustantivo del argumento es
                    «porcicultura», no «Porkia». Por eso va en serif y grande, y
                    el nombre debajo en mono de pie. */}
                <p className={styles.dominio}>{perfil.category}</p>
                <p className={styles.pieFicha}>
                  <span className={styles.nombre}>
                    {perfil.number} · {perfil.name}
                  </span>
                  <span className={styles.estado}>{perfil.status.label}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ⚠️ El acta se queda VISIBLE en el móvil. La primera versión la ocultaba
          bajo 62 rem sin argumento, y lo que desaparecía era la única línea de
          procedencia de la lámina —cuántas capturas, tomadas cuándo—, que es
          justo la prueba de que ni el conteo ni las fechas están escritos. En un
          deck que se manda por enlace, el móvil no es el caso raro. */}
      <p className={styles.acta}>{actaDeLaVitrina(perfiles)}</p>
    </Slide>
  );
}
