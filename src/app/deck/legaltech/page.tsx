import type { Metadata } from "next";
import { IndiceDeDeck } from "@/components/deck/IndiceDeDeck";
import { nombresEnProsa, SLIDES_LEGALTECH } from "@/content/deck";

// ⚠️ **Ni el conteo de láminas ni los nombres de los productos se escriben.**
// El número sale del deck ya construido y la lista, de `work.ts` a través de
// `nombresEnProsa`. Es la misma regla del índice general —donde «los cinco
// productos» escrito a mano ya dejó una descripción mintiendo con `check` en
// verde— y aquí además hace de puerta: si alguien mete a la variante un
// producto que no es de esta sala, su nombre sale publicado en esta cadena y el
// control del HTML construido lo ve.
const productos = nombresEnProsa(SLIDES_LEGALTECH);

export const metadata: Metadata = {
  title: "Deck legaltech — de un problema real a software en producción",
  description: `El índice de la presentación de INPLUX en ${SLIDES_LEGALTECH.length} láminas: la tesis, el método y los productos ${productos}, con sus fuentes.`,
  alternates: { canonical: "https://inplux.co/deck/legaltech" },
};

export default function DeckLegaltechPage() {
  return (
    <IndiceDeDeck slides={SLIDES_LEGALTECH} hrefPresentacion="/deck/legaltech/presentacion" />
  );
}
