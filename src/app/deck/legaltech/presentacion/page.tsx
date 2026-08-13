import type { Metadata } from "next";
import { PaginaDeDeck } from "@/components/deck/PaginaDeDeck";
import { nombresEnProsa, SLIDES_LEGALTECH } from "@/content/deck";

// El mismo deck que el índice de al lado, y por eso los dos leen
// `SLIDES_LEGALTECH`: qué productos entran y qué láminas se quitan se decide
// una sola vez, en `src/content/deck.ts`, y no en cada ruta.
const productos = nombresEnProsa(SLIDES_LEGALTECH);

export const metadata: Metadata = {
  title: "Presentación legaltech — de un problema real a software en producción",
  description: `Cómo INPLUX convierte un problema concreto en software que funciona en producción, en ${SLIDES_LEGALTECH.length} láminas, con los productos ${productos}.`,
  alternates: { canonical: "https://inplux.co/deck/legaltech/presentacion" },
};

export default function PresentacionLegaltechPage() {
  return <PaginaDeDeck slides={SLIDES_LEGALTECH} hrefIndice="/deck/legaltech" />;
}
