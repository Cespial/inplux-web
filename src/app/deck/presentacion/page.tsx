import type { Metadata } from "next";
import { PresentationDeck } from "@/components/deck/PresentationDeck.client";
import { leerMotivos } from "@/lib/banned-reasons.server";

export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description:
    "Cómo INPLUX convierte un problema concreto en software que funciona en producción, en quince láminas.",
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

// La ruta es un componente de servidor: aquí, y solo aquí, se puede leer del
// disco. Los motivos de la lámina 6 salen de `scripts/verify-public-content.mjs`
// en tiempo de build y bajan como prop, porque uno de ellos coincide con su
// propio patrón bloqueado y escribirlos bajo `src/` rompe el build en su propia
// lista. Ver `src/lib/banned-reasons.server.ts`.
export default async function PresentacionPage() {
  const motivos = await leerMotivos();

  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck motivos={motivos} />
    </main>
  );
}
