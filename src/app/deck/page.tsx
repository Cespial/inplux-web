import type { Metadata } from "next";
import Link from "next/link";
import { SLIDES } from "@/content/deck";

export const metadata: Metadata = {
  title: "Deck — de un problema real a software en producción",
  description:
    "El índice de la presentación de INPLUX: la tesis, el método, los cinco productos y sus fuentes.",
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
