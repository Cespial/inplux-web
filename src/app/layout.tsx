import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  themeColor: "#1a1918",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://inplux.co"),
  title: "INPLUX — Hub de Inteligencia Tributaria, Financiera & IA",
  description:
    "Hub que integra consultoría tributaria y financiera, inteligencia artificial y transformación digital. +25 años de experiencia, +50 municipios, +100 proyectos en Colombia. Creadores de Tribai.co.",
  keywords: [
    "consultoría tributaria",
    "inteligencia tributaria",
    "inteligencia artificial",
    "transformación digital",
    "hub tecnológico",
    "sector público",
    "Colombia",
    "Medellín",
    "Inplux",
    "Tribai",
    "NIC NIIF",
    "estatuto tributario",
    "hacienda pública",
    "IA tributaria",
  ],
  openGraph: {
    title: "INPLUX — Hub de Inteligencia Tributaria, Consultoría & IA",
    description:
      "Nuestra historia empezó en la gestión tributaria. Llevamos 25 años entre estatutos, NIC/NIIF y hacienda pública colombiana. Hoy convertimos ese conocimiento en tecnología e inteligencia artificial.",
    url: "https://inplux.co",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "INPLUX — Hub de Inteligencia Tributaria & IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "INPLUX — Hub de Inteligencia Tributaria & IA",
    description:
      "Tributaristas que construyen tecnología. +25 años, +50 municipios, +100 proyectos. Creadores de Tribai.co.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://inplux.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "INPLUX S.A.S.",
    url: "https://inplux.co",
    logo: "https://inplux.co/logos/logo.png",
    description:
      "Hub de inteligencia tributaria, consultoría y tecnología con IA. +25 años de experiencia en Colombia.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 23 # 43 A 66, Local 141",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    telephone: "+573138893615",
    email: "gerencia@inplux.co",
    foundingDate: "2000",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10 },
    sameAs: ["https://tribai.co", "https://gobia.co", "https://fourier.dev/en"],
    knowsAbout: [
      "Inteligencia tributaria",
      "Consultoría financiera",
      "Inteligencia artificial",
      "Transformación digital",
      "NIC/NIIF",
      "Estatuto tributario colombiano",
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
