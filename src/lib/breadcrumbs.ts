/**
 * Las migas de una página, en los dos formatos que las leen: el `PageHero` las
 * pinta y los buscadores leen este `BreadcrumbList`. Salen de la misma lista
 * para que no se contradigan.
 *
 * Un paso sin `href` en medio de la ruta (p. ej. «Sectores», que no tiene
 * índice propio) se pinta pero no entra al JSON-LD: schema.org exige un `item`
 * para cada eslabón menos el último, y no hay URL que darle.
 */
const SITE_URL = "https://inplux.co";

export type Crumb = { label: string; href?: string };

export function breadcrumbJsonLd(crumbs: readonly Crumb[], url: string) {
  const linked = crumbs.filter((crumb, index) => crumb.href || index === crumbs.length - 1);

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: linked.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: index === linked.length - 1 ? url : new URL(crumb.href ?? "/", SITE_URL).toString(),
    })),
  };
}

/** El mismo `BreadcrumbList` como documento propio, para una página sin `@graph`. */
export function breadcrumbJsonLdDocument(crumbs: readonly Crumb[], url: string) {
  return { "@context": "https://schema.org", ...breadcrumbJsonLd(crumbs, url) };
}
