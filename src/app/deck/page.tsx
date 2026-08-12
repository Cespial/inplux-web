import type { Metadata } from "next";
import Link from "next/link";
import { SLIDES } from "@/content/deck";

// ⚠️ **Ningún conteo escrito a mano, tampoco aquí.** Esta descripción decía
// «los cinco productos» y es lo que se ve en la tarjeta del enlace antes de
// abrir nada: un perfil nuevo en `work.ts` —o un deck recortado con
// `construirDeck([...])`— la dejaba mintiendo en la vista previa, y
// `verify-build-output.mjs` fijaba la cadena vieja como contrato, así que
// `check` seguía en verde. El número de láminas se deriva; el de productos
// desaparece, porque la frase no lo necesitaba.
export const metadata: Metadata = {
  title: "Deck — de un problema real a software en producción",
  description: `El índice de la presentación de INPLUX en ${SLIDES.length} láminas: la tesis, el método, los productos y sus fuentes.`,
  alternates: { canonical: "https://inplux.co/deck" },
};

export default function DeckPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>De un problema real a software en producción</h1>
      <Link href="/deck/presentacion">Ver la presentación</Link>
      <ol>
        {SLIDES.map((slide) => (
          <li key={slide.id}>
            <Link href={`/deck/presentacion#${slide.id}`}>{slide.titulo}</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
