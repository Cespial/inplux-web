import { getImageProps } from "next/image";
import ReactDOM from "react-dom";
import { perfilesDe, type DeckSlide } from "@/content/deck";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { leerMotivos } from "@/lib/banned-reasons.server";
import { CAPTURA_SIZES } from "./CapturaEnmarcada";
import { PresentationDeck } from "./PresentationDeck.client";

/**
 * El cuerpo de una ruta de presentación, sea cual sea el deck que presente.
 *
 * ⚠️ **Existe porque hay más de un deck y la ruta hacía tres cosas que no se
 * pueden copiar dos veces**: leer los motivos del disco —solo se puede desde un
 * componente de servidor—, declarar las precargas de las capturas y montar el
 * riel. Copiadas a la ruta del deck dirigido, la segunda copia habría heredado
 * el defecto que se acaba de arreglar (precargar los cinco productos en un deck
 * de cuatro) y habría que arreglarlo dos veces.
 *
 * Lo que NO vive aquí es la metadata: título, descripción y canónica son de
 * cada ruta, y `verify-build-output.mjs` las juzga una por una.
 */

/** Una captura anunciada: lo que `ReactDOM.preload` necesita saber de ella. */
type Precarga = { src: string; srcSet: string | undefined; sizes: string | undefined };

/**
 * Las precargas de un deck, calculadas una sola vez por deck.
 *
 * ⚠️ **Sin esto la evidencia llega tarde y en el peor momento.** El deck monta
 * UNA lámina cada vez —dos durante la transición—, así que la captura de cada
 * ficha no se pide al abrir: se pide al llegar a ella. `priority` de
 * `next/image` no sirve para un componente que todavía no existe. En una sala
 * con red mala, la ficha de producto aparece con el marco vacío delante del
 * cliente.
 *
 * `getImageProps` con exactamente los mismos argumentos que usa la lámina
 * —misma ruta, mismo tamaño, mismo `sizes`, misma calidad por omisión— produce
 * exactamente el mismo `srcSet`, así que el candidato que el navegador elige
 * aquí es el mismo que pedirá el `<img>`. Construir la URL del optimizador a
 * mano habría bastado para que un parámetro de más descargara las capturas DOS
 * veces y la precarga costara el doble en vez de ahorrar.
 *
 * ⚠️ **Las capturas son las del deck que se presenta, no las de `work.ts`.** Un
 * deck recortado anunciaba igual las cinco: el navegador se traía una imagen de
 * medio megabyte que ninguna lámina de esa presentación iba a pintar, y
 * compitiendo por el ancho de banda con las que sí.
 *
 * El `WeakMap` conserva lo que el módulo hacía en su cuerpo —calcular esto una
 * vez y no en cada petición—, ahora que hay más de un deck: los decks son
 * constantes de módulo, así que su identidad es estable y la entrada se
 * calcula una sola vez por deck.
 */
const PRECARGAS = new WeakMap<readonly DeckSlide[], readonly Precarga[]>();

function precargasDe(slides: readonly DeckSlide[]): readonly Precarga[] {
  const memorizadas = PRECARGAS.get(slides);
  if (memorizadas !== undefined) return memorizadas;

  const precargas = perfilesDe(slides).map((perfil) => {
    const captura = workCaptures[perfil.slug];
    const { props } = getImageProps({
      src: captura.src,
      alt: captura.alt,
      width: CAPTURA_ANCHO,
      height: CAPTURA_ALTO,
      sizes: CAPTURA_SIZES,
    });

    return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
  });

  PRECARGAS.set(slides, precargas);
  return precargas;
}

export async function PaginaDeDeck({
  slides,
  hrefIndice,
}: {
  slides: readonly DeckSlide[];
  hrefIndice: string;
}) {
  // Los motivos de la lámina de evidencia salen de
  // `scripts/verify-public-content.mjs` en tiempo de build y bajan como prop,
  // porque uno de ellos coincide con su propio patrón bloqueado y escribirlos
  // bajo `src/` rompe el build en su propia lista. Ver
  // `src/lib/banned-reasons.server.ts`.
  const motivos = await leerMotivos();

  // `fetchPriority: "low"`: se quieren en la caché antes de la serie de
  // producto, no antes del titular de la portada. Con prioridad normal, las
  // capturas compiten con la fuente serif del título, que es lo único que se ve
  // al abrir.
  //
  // ⚠️ Se declaran con `ReactDOM.preload` y **no** pintando un `<link>` por
  // captura en el JSX. Comprobado en el HTML construido: React 19 iza el
  // `<link rel="preload">` a la cabecera *y además* lo registra como recurso,
  // así que cada captura salía anunciada DOS veces —una sin `href` y otra sin
  // `fetchPriority`—. El navegador las resuelve al mismo candidato y descarga
  // una sola vez, pero eran etiquetas de más en un documento que comprimido
  // pesa 6,4 KB.
  for (const precarga of precargasDe(slides)) {
    ReactDOM.preload(precarga.src, {
      as: "image",
      imageSrcSet: precarga.srcSet,
      imageSizes: precarga.sizes,
      fetchPriority: "low",
    });
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck slides={slides} hrefIndice={hrefIndice} motivos={motivos} />
    </main>
  );
}
