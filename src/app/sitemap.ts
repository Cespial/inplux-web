import type { MetadataRoute } from "next";
import { teamMembers } from "@/content/team";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/en",
    "/fabrica",
    "/trabajo",
    "/trabajo/tribai",
    "/trabajo/gobia",
    "/trabajo/kelsen",
    "/trabajo/laudos",
    "/trabajo/porkia",
    "/deck",
    "/deck/presentacion",
    "/capacidades",
    "/nosotros",
    ...teamMembers.map((member) => `/equipo/${member.slug}`),
    "/prensa",
    "/contacto",
  ];

  return routes.map((route) => ({
    url: `https://inplux.co${route}`,
  }));
}
