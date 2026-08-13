import type { Metadata } from "next";

/**
 * El deck dirigido no se indexa, y no está en el sitemap.
 *
 * No es una página pública: es un deck que se manda por enlace a una sala
 * concreta —ministros, directores, líderes del sector público— con una serie de
 * producto recortada a su terreno. Publicarlo en el índice de un buscador lo
 * convertiría en «la otra versión del deck de INPLUX, con menos productos», que
 * es exactamente lo que no es.
 *
 * `follow: true`, como en `/marca`: los enlaces que salen de aquí van a páginas
 * que sí se indexan y no hay razón para cortarles el paso.
 *
 * ⚠️ El `noindex` vive en el layout y no en cada página **a propósito**: cubre
 * la ruta y todo lo que cuelgue de ella, así que una lámina o una variante
 * nueva bajo `/deck/legaltech` nace ya fuera del índice. Puesto en cada página,
 * la siguiente que se añadiera nacería indexable y nadie se enteraría.
 *
 * ⚠️ Y **no entra en `src/app/sitemap.ts`**. `verify-build-output.mjs` compara
 * el sitemap posición por posición, así que si algún día se decide publicarla
 * hay que darla de alta en los dos sitios.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: { index: false, follow: true, noimageindex: true },
  },
};

export default function DeckLegaltechLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
