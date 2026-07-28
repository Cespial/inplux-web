import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const geist = localFont({
  src: "./fonts/Geist-Latin.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

const newsreader = localFont({
  src: "./fonts/Newsreader-Display-300-Latin.woff2",
  variable: "--font-serif",
  weight: "300",
  style: "normal",
  display: "swap",
});

const newsreaderItalic = localFont({
  src: "./fonts/Newsreader-Display-300-Italic-Latin.woff2",
  variable: "--font-serif-italic",
  weight: "300",
  style: "italic",
  display: "swap",
  preload: false,
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Latin.woff2",
  variable: "--font-mono-face",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://inplux.co"),
  title: {
    default: "INPLUX | Fábrica de software a la medida",
    template: "%s | INPLUX",
  },
  description:
    "Diseñamos, construimos y evolucionamos software a la medida para empresas y entidades, con inteligencia artificial aplicada y dirección humana.",
  keywords: [
    "fábrica de software",
    "software a la medida",
    "desarrollo de software Colombia",
    "automatización",
    "inteligencia artificial aplicada",
    "plataformas digitales",
    "Medellín",
    "INPLUX",
  ],
  openGraph: {
    title: "De un problema real a software en producción.",
    description:
      "Conoce cómo INPLUX convierte necesidades concretas en productos digitales que se pueden usar y mejorar.",
    url: "https://inplux.co",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "De un problema real a software en producción.",
    description: "Fábrica de software a la medida para empresas y entidades.",
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
};

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
      "Fábrica de software a la medida para empresas y entidades, con inteligencia artificial aplicada y dirección humana.",
    foundingDate: "2023",
    email: "gerencia@inplux.co",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    sameAs: ["https://www.linkedin.com/company/inplux"],
    knowsAbout: [
      "Desarrollo de software a la medida",
      "Productos digitales",
      "Automatización",
      "Inteligencia artificial aplicada",
    ],
  };

  return (
    <html
      lang="es-CO"
      className={`${geist.variable} ${newsreader.variable} ${newsreaderItalic.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
