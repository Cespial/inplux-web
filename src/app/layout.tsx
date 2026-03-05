import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const goodly = localFont({
  src: [
    { path: "../../public/fonts/Goodly-Regular.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/Goodly-Medium.woff", weight: "500", style: "normal" },
    { path: "../../public/fonts/Goodly-Semibold.woff", weight: "600", style: "normal" },
    { path: "../../public/fonts/Goodly-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Inplux — Consultoría Estratégica & Transformación Digital",
  description:
    "Somos el socio estratégico que convierte desafíos complejos en resultados medibles. +25 años de experiencia en consultoría financiera, transformación digital y optimización organizacional en Colombia.",
  keywords: [
    "consultoría estratégica",
    "transformación digital",
    "gestión financiera",
    "sector público",
    "Colombia",
    "Medellín",
    "Inplux",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} ${goodly.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
