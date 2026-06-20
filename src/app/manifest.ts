import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INPLUX — Hub de Inteligencia Tributaria & IA",
    short_name: "INPLUX",
    description:
      "Tributaristas que construyen tecnología. Consultoría tributaria y financiera, IA y transformación digital. Creadores de Tribai.co.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1918",
    lang: "es-CO",
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
