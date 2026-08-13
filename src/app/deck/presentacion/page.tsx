import type { Metadata } from "next";
import { PaginaDeDeck } from "@/components/deck/PaginaDeDeck";
import { SLIDES, TOTAL_SLIDES } from "@/content/deck";

// ⚠️ **El número de láminas se deriva, no se escribe.** Decía «quince láminas»
// y `TOTAL_SLIDES` es `SLIDES.length` sobre `workProfiles`: un producto nuevo
// mueve el total y esta descripción —que es la que se ve en la tarjeta del
// enlace— empezaba a mentir en silencio.
export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description: `Cómo INPLUX convierte un problema concreto en software que funciona en producción, en ${TOTAL_SLIDES} láminas.`,
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

// El cuerpo —leer los motivos del disco, anunciar las capturas y montar el
// riel— vive en `PaginaDeDeck`, que es el mismo para todos los decks. Aquí
// queda lo que sí es de esta ruta: qué deck presenta y su metadata.
export default function PresentacionPage() {
  return <PaginaDeDeck slides={SLIDES} hrefIndice="/deck" />;
}
