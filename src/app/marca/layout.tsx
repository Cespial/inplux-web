import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Marca — INPLUX",
  description:
    "Brandbook vivo de INPLUX: logo, color, tipografía, componentes y plantillas. Descarga los activos oficiales.",
  robots: { index: false, follow: false },
};

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
