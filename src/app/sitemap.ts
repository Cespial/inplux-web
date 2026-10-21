import type { MetadataRoute } from "next";
import { pressStories } from "@/content/press";
import { sectorProfiles } from "@/content/sectores";
import { sectorProfilesEn } from "@/content/sectores.en";
import { teamMembers } from "@/content/team";
import { workProfilesEn } from "@/content/work.en";

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
    "/equipo",
    ...teamMembers.map((member) => `/equipo/${member.slug}`),
    "/prensa",
    ...pressStories.filter((story) => story.article).map((story) => story.href),
    "/contacto",
    "/seguridad",
    // El sitio en inglés va al final para no mover las posiciones españolas.
    "/en/how-we-work",
    "/en/work",
    ...workProfilesEn.map((profile) => `/en/work/${profile.slug}`),
    ...sectorProfilesEn.map((sector) => `/en/sectors/${sector.enSlug}`),
    "/en/about",
    "/en/security",
    "/en/contact",
  ];

  return routes.map((route) => ({
    url: `https://inplux.co${route}`,
  }));
}
