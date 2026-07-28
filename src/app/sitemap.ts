import type { MetadataRoute } from "next";
import { teamMembers } from "@/content/team";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/fabrica",
    "/trabajo",
    "/trabajo/tribai",
    "/trabajo/gobia",
    "/trabajo/kelsen",
    "/trabajo/laudos",
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
