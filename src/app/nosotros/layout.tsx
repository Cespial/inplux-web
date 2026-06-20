import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros — INPLUX | Tributaristas que construyen tecnología",
  description:
    "Primero la norma, después el código. Tributaristas y financieros que escriben código. Medellín, Colombia — desde el año 2000.",
  alternates: { canonical: "https://inplux.co/nosotros" },
  openGraph: {
    title: "Nosotros — INPLUX",
    description:
      "Primero la norma, después el código. Tributaristas y financieros que escriben código desde el año 2000.",
    url: "https://inplux.co/nosotros",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og/nosotros.png", width: 1200, height: 630, alt: "Nosotros — INPLUX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros — INPLUX",
    description: "Primero la norma, después el código. Desde el año 2000.",
    images: ["/og/nosotros.png"],
  },
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
