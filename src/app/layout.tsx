import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { HtmlRoot } from "@/components/site/HtmlRoot.client";
import { crewPersonId, personId, teamCrew, teamMembers } from "@/content/team";
import { homeOpenGraph, homeSocialImage, twitterImage } from "@/lib/social-cards";
import "./globals.css";

/*
 * Una sola familia para todo el sitio: Rethink Sans (OFL), variable de 400 a
 * 800, sólo redonda: el sitio no usa cursiva y `font-synthesis: none` en
 * `globals.css` impide que el navegador la invente; lo que antes iba en
 * cursiva va en peso 600. next/font inyecta en <html> las dos variables que usan
 * las hojas —--font-body y --font-serif— y las dos cargan los mismos archivos
 * con la misma precarga, así que comparten URL y el navegador los descarga una
 * sola vez. next/font exige opciones literales: por eso la lista se repite. Los
 * alias de cursiva y mono se enlazan a esta misma familia en `tokens/typography.css`.
 */
const rethink = localFont({
  src: [
    { path: "./fonts/RethinkSans-Latin.woff2", weight: "400 800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const rethinkDisplay = localFont({
  src: [
    { path: "./fonts/RethinkSans-Latin.woff2", weight: "400 800", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://inplux.co"),
  // Verificación de Google Search Console (propiedad de prefijo https://inplux.co).
  // Se hace por etiqueta y no por DNS porque el DNS de inplux.co vive en
  // Cloudflare, fuera de este repo. Next la emite como
  // <meta name="google-site-verification" content="…">.
  verification: { google: "NtbZyIVhM4El76G13EPJ3euuE-5ISxt7OA9JGbUAy5Q" },
  title: {
    default: "INPLUX | Transformación con IA que llega a producción",
    template: "%s | INPLUX",
  },
  description:
    "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica. Productos propios en producción y equipos que los implementan.",
  keywords: [
    "transformación con IA",
    "desarrollo e implementación de IA",
    "software a la medida",
    "desarrollo de software Colombia",
    "automatización",
    "inteligencia artificial aplicada",
    "plataformas digitales",
    "Medellín",
    "INPLUX",
  ],
  // Respaldo de toda ruta sin Open Graph propio (el deck, por ejemplo).
  openGraph: homeOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: "Transformación con IA que llega a producción.",
    description: "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica.",
    images: [twitterImage(homeSocialImage)],
  },
};

/*
 * Antes del primer pintado, marca `<html data-motion>` para que las bandas
 * puedan esperar ocultas su entrada al hacer scroll (`components/v5/Reveal`).
 * Si `Reveal` no monta en 2,6 s (un chunk que no llegó), quita la marca y todo
 * queda visible. Sin JavaScript la marca nunca existe y no se oculta nada.
 */
const motionScript =
  'document.documentElement.setAttribute("data-motion","");' +
  'setTimeout(function(){var d=document.documentElement;' +
  'if(!d.hasAttribute("data-motion-ready"))d.removeAttribute("data-motion")},2600);';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://inplux.co/#organization",
    name: "INPLUX S.A.S.",
    url: "https://inplux.co",
    logo: "https://inplux.co/brand/logos/inplux-logo-horizontal.svg",
    description:
      "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica.",
    foundingDate: "2023",
    email: "gerencia@inplux.co",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    sameAs: ["https://www.linkedin.com/company/inpluxco"],
    knowsAbout: [
      "Desarrollo de software a la medida",
      "Productos digitales",
      "Automatización",
      "Inteligencia artificial aplicada",
    ],
    /*
     * Las personas se citan por su `@id` canónico (`/equipo/<slug>#person`),
     * el mismo que usan /nosotros, /prensa y cada perfil. Así la organización
     * y sus dos direcciones son un solo grafo y no entidades sueltas.
     */
    founder: teamMembers
      .filter((member) => member.jobTitle.toLowerCase().includes("fundador"))
      .map((member) => ({ "@id": personId(member.slug) })),
    // El equipo (PR P) se cita por su `@id` en /equipo (`/equipo#<slug>`).
    employee: [
      ...teamMembers.map((member) => ({ "@id": personId(member.slug) })),
      ...teamCrew.map((member) => ({ "@id": crewPersonId(member.slug) })),
    ],
  };

  return (
    // `lang` sale de la ruta: `es-CO` en el sitio español, `en` bajo `/en`.
    <HtmlRoot className={`${rethink.variable} ${rethinkDisplay.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        {/*
          El aviso de aliados del Día D (`AllyNotice`) se desmontó el 17-oct-2026,
          pasado el evento. Su componente, su hoja y `src/content/dia-d.ts`
          siguen en el repo porque la tarjeta de prensa del Día D lee la lista
          de aliados de ahí; la limpieza va en un cambio aparte.
        */}
      </body>
    </HtmlRoot>
  );
}
