"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";
import { htmlLang } from "@/content/i18n";

/**
 * El `<html>` del sitio, con el idioma de la ruta.
 *
 * El layout raíz es uno solo para las dos lenguas, así que no puede escribir
 * `lang` literal. Este componente lee el primer segmento de la ruta —`en` para
 * todo `/en/*`— y lo resuelve en el servidor: el HTML estático de cada página
 * sale ya con su `lang`, sin JavaScript y sin volver dinámica ninguna ruta.
 */
export function HtmlRoot({ className, children }: { className: string; children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  return (
    <html
      lang={segment === "en" ? htmlLang.en : htmlLang.es}
      className={className}
      // `motionScript` añade `data-motion` antes de hidratar.
      suppressHydrationWarning
    >
      {children}
    </html>
  );
}
