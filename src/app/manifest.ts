import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INPLUX — Fábrica de software a la medida",
    short_name: "INPLUX",
    description:
      "Diseñamos, construimos y evolucionamos software a la medida para empresas y entidades.",
    id: "/",
    scope: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0b",
    theme_color: "#0c0c0b",
    lang: "es-CO",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/web-app-manifest-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
