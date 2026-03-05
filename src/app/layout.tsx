import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "INPLUX — Hub de Consultoría Estratégica & Tecnología",
  description:
    "Hub que integra consultoría financiera, inteligencia tributaria y transformación digital. +25 años de experiencia transformando organizaciones públicas y privadas en Colombia.",
  keywords: [
    "consultoría estratégica",
    "inteligencia tributaria",
    "transformación digital",
    "hub tecnológico",
    "sector público",
    "Colombia",
    "Medellín",
    "Inplux",
    "Tribai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
