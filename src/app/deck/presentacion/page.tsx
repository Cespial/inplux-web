import type { Metadata } from "next";
import { PresentationDeck } from "@/components/deck/PresentationDeck.client";

export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description:
    "Cómo INPLUX convierte un problema concreto en software que funciona en producción, en quince láminas.",
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

// La ruta es un componente de servidor: aquí, y solo aquí, se puede leer del
// disco. La Tarea 12 lee los motivos del verificador y los pasa a la lámina de
// evidencia; hasta entonces la lista va vacía. Dejar el `async` puesto desde ya
// evita convertir la ruta después.
export default async function PresentacionPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck motivos={[]} />
    </main>
  );
}
