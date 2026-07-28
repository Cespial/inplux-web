import type { Metadata } from "next";

const description =
  "Guía interna de identidad de INPLUX: logo, color, tipografía, componentes y activos oficiales.";

export const metadata: Metadata = {
  title: { absolute: "Sistema de marca — INPLUX" },
  description,
  alternates: { canonical: "https://inplux.co/marca" },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: { index: false, follow: true, noimageindex: true },
  },
  openGraph: {
    title: "Sistema de marca — INPLUX",
    description,
    url: "https://inplux.co/marca",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, fábrica de software a la medida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de marca — INPLUX",
    description,
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, fábrica de software a la medida",
      },
    ],
  },
};

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
