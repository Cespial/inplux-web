import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "INPLUX HUB // Ecosistema Tecnologico",
  description:
    "Hub tecnologico que integra empresas de TI líderes. Innovacion, desarrollo de software, inteligencia artificial y transformacion digital bajo un mismo ecosistema.",
  keywords: [
    "hub tecnologico",
    "empresas TI",
    "desarrollo de software",
    "inteligencia artificial",
    "transformacion digital",
    "Colombia",
    "Medellin",
    "Inplux",
    "ecosistema tech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
