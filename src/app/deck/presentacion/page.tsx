import type { Metadata } from "next";
import { SLIDES } from "@/content/deck";

export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description:
    "Cómo INPLUX convierte un problema concreto en software que funciona en producción, en quince láminas.",
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

export default function PresentacionPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {SLIDES.map((slide, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <section key={slide.id} data-slide={slide.id} aria-label={slide.titulo}>
            <Heading>{slide.titulo}</Heading>
          </section>
        );
      })}
    </main>
  );
}
