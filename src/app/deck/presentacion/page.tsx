import type { Metadata } from "next";
import { getImageProps } from "next/image";
import ReactDOM from "react-dom";
import { CAPTURA_SIZES } from "@/components/deck/CapturaEnmarcada";
import { PresentationDeck } from "@/components/deck/PresentationDeck.client";
import { TOTAL_SLIDES } from "@/content/deck";
import { workProfiles } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { leerMotivos } from "@/lib/banned-reasons.server";

// ⚠️ **El número de láminas se deriva, no se escribe.** Decía «quince láminas»
// y `TOTAL_SLIDES` es `SLIDES.length` sobre `workProfiles`: un producto nuevo
// mueve el total y esta descripción —que es la que se ve en la tarjeta del
// enlace— empezaba a mentir en silencio.
export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description: `Cómo INPLUX convierte un problema concreto en software que funciona en producción, en ${TOTAL_SLIDES} láminas.`,
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

/**
 * Las capturas de las fichas de producto, precargadas.
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
 * mano habría bastado para que un parámetro de más descargara las cinco DOS
 * veces y la precarga costara el doble en vez de ahorrar.
 *
 * `fetchPriority: "low"`: se quieren en la caché antes de la lámina 8, no antes
 * del titular de la 1. Con prioridad normal, cinco imágenes compiten con la
 * fuente serif del título de portada, que es lo único que se ve al abrir.
 *
 * ⚠️ Se declaran con `ReactDOM.preload` y **no** pintando cinco `<link>` en el
 * JSX. Comprobado en el HTML construido: React 19 iza el `<link rel="preload">`
 * a la cabecera *y además* lo registra como recurso, así que cada captura salía
 * anunciada DOS veces —una sin `href` y otra sin `fetchPriority`—. El navegador
 * las resuelve al mismo candidato y descarga una sola vez, pero eran cinco
 * etiquetas de más en un documento que comprimido pesa 6,4 KB.
 */
const precargas = workProfiles.map((perfil) => {
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

// La ruta es un componente de servidor: aquí, y solo aquí, se puede leer del
// disco. Los motivos de la lámina 6 salen de `scripts/verify-public-content.mjs`
// en tiempo de build y bajan como prop, porque uno de ellos coincide con su
// propio patrón bloqueado y escribirlos bajo `src/` rompe el build en su propia
// lista. Ver `src/lib/banned-reasons.server.ts`.
export default async function PresentacionPage() {
  const motivos = await leerMotivos();

  for (const precarga of precargas) {
    ReactDOM.preload(precarga.src, {
      as: "image",
      imageSrcSet: precarga.srcSet,
      imageSizes: precarga.sizes,
      fetchPriority: "low",
    });
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck motivos={motivos} />
    </main>
  );
}
