import { isNewsActive, newsCopy } from "@/content/noticia";
import { NewsTabClient } from "./NewsTab.client";

/**
 * La pestaña de noticia del hero de la portada.
 *
 * La vigencia se decide aquí, en el servidor: la portada se prerenderiza en el
 * build, así que un build posterior al último día ya no la incluye en el HTML.
 * El cliente repite la comprobación al hidratar por si el build es anterior.
 */
export function NewsTab({ lang }: { lang: "es" | "en" }) {
  if (!isNewsActive()) return null;
  return (
    <NewsTabClient
      copy={newsCopy[lang]}
      source={lang === "en" ? "en-news-sf" : "news-sf"}
      fallbackHref={lang === "en" ? "/en/contact" : "/contacto"}
    />
  );
}
