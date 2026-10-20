import type { MetadataRoute } from "next";
import { sectorProfiles } from "@/content/sectores";
import { teamMembers } from "@/content/team";

/*
 * Sin `lastmod`, `changefreq` ni `priority` a propósito: `verify-build-output`
 * lo exige. Una fecha de modificación que no sale de un dato real es una
 * fecha inventada, y los buscadores ignoran las otras dos señales.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/en",
    "/como-trabajamos",
    "/trabajo",
    "/trabajo/tribai",
    "/trabajo/gobia",
    "/trabajo/kelsen",
    "/trabajo/laudos",
    "/trabajo/porkia",
    "/deck",
    "/deck/presentacion",
    ...sectorProfiles.map((sector) => `/sectores/${sector.slug}`),
    "/nosotros",
    ...teamMembers.map((member) => `/equipo/${member.slug}`),
    "/prensa",
    "/contacto",
  ];

  return routes.map((route) => ({
    url: `https://inplux.co${route}`,
  }));
}
