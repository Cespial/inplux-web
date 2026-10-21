import type { Metadata } from "next";

/**
 * Las tarjetas para compartir (Open Graph y X) que salen de `scripts/og-cards.mjs`.
 *
 * Desde el 20-oct-2026 (PR N) la portada, `/en` y `/nosotros` usan JPEG con
 * foto, con nombres nuevos para que WhatsApp y LinkedIn no sirvan la caché de
 * la tarjeta v3 (`og-default.png`). Si cambia el diseño de una tarjeta, se
 * repinta con otro nombre: las redes la guardan por URL.
 *
 * La foto de la portada es sintética (Midjourney, ver `public/brand/og/CREDITOS.md`):
 * el texto alternativo describe la imagen y no dice que sea el equipo de INPLUX.
 */

/** `og:site_name`: la marca, no la razón social. */
export const socialSiteName = "INPLUX";

const card = { width: 1200, height: 630, type: "image/jpeg" } as const;

export const homeSocialImage = {
  ...card,
  url: "/brand/og/og-home.jpg",
  alt: "Equipo trabajando frente a pantallas en una oficina con vista a las montañas de Medellín",
};

export const homeSocialImageEn = {
  ...card,
  url: "/brand/og/og-home-en.jpg",
  alt: "A team working at their screens in an office overlooking the mountains of Medellín",
};

export const nosotrosSocialImage = {
  ...card,
  url: "/brand/og/og-nosotros.jpg",
  alt: "Edificios entre árboles con las montañas de Medellín al fondo",
};

/** La versión de X lleva la misma imagen; X no lee ni el tamaño ni el tipo. */
export function twitterImage(image: { url: string; alt: string }) {
  return { url: image.url, alt: image.alt };
}

/** El Open Graph de la portada, que también es el respaldo del layout. */
export const homeOpenGraph = {
  title: "Transformación con IA que llega a producción.",
  description:
    "Conoce los productos que INPLUX desarrolla e implementa con empresas e instituciones de Latinoamérica.",
  url: "https://inplux.co",
  siteName: socialSiteName,
  locale: "es_CO",
  type: "website",
  images: [homeSocialImage],
} satisfies NonNullable<Metadata["openGraph"]>;
