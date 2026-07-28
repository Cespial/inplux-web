import type { MetadataRoute } from "next";

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
    "/prensa",
    "/contacto",
  ];

  return routes.map((route) => ({
    url: `https://inplux.co${route}`,
  }));
}
