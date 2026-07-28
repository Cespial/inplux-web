# Diseño — Consolidación de entidad para personas (SEO)

**Fecha:** 2026-07-27
**Objetivo:** que «Jaime Alonso Cano Pino» y «Cristian Espinal Maya» devuelvan páginas de inplux.co en Google, y reforzar la marca INPLUX.

---

## 1. Diagnóstico

Verificado el 2026-07-27 contra Google y el código en producción.

| Consulta | Qué rankea hoy | Páginas de inplux.co |
|---|---|---|
| `"Jaime Alonso Cano Pino"` | 7 columnas en alponiente.com | ninguna |
| `"Cristian Espinal Maya"` | perfil de Google Scholar | ninguna |

Ambas compiten con homónimos: Jaime Alonso Cano Ríos (SIGEP), Jaime Alonso Cano Martínez (diputado) y varios deportistas apellidados Espinal alojados en dominios de alta autoridad.

### Lo que el sitio ya hace bien

No hay que construirlo de nuevo:

- `Organization` con `@id` estable (`https://inplux.co/#organization`) en `src/app/layout.tsx`.
- `/nosotros` con `AboutPage`, `BreadcrumbList` y un nodo `Person` por directivo, con `worksFor` apuntando a la `Organization`.
- `/prensa` con `CollectionPage` + `ItemList` y, por pieza, `Article`, `ScholarlyArticle` o `Event`, con `publisher` y `author`.
- `src/content/press.ts`: 19 publicaciones tipadas con `byline`, `outlet`, `publishedAt`, `summary` y `href` externo. Enlaza a la fuente sin duplicar contenido — el patrón correcto.
- El sitemap excluye `/marca` a propósito y omite `lastmod`/`changefreq`/`priority`, señales que los buscadores ignoran.

### El defecto real: la entidad está fragmentada

Los nodos `Person` existen pero **no comparten identidad**:

- en `/nosotros`, Jaime es `https://inplux.co/nosotros#leader-1`;
- en `/prensa`, cada una de sus 11 columnas genera un `Person` anónimo **sin `@id`** (`src/app/prensa/page.tsx:143-146`).

Google no ve una persona con once publicaciones: ve **doce entidades distintas que comparten nombre**. Es la causa más probable de que el nombre no posicione pese a que los datos son correctos.

### Defectos secundarios

1. **No hay URL por persona.** Un fragmento `#leader-1` no puede rankear como página; Google necesita una URL por entidad.
2. **«Cristian Espinal Maya» no aparece en `/nosotros`.** El array `leaders` dice «Cristian Espinal». El nombre completo sólo existe en los *bylines* de `/prensa`.
3. **Los `Person` son mínimos.** Sin `alternateName`, `givenName`/`familyName`, `disambiguatingDescription`, `knowsAbout`, `image` ni `subjectOf`. `sameAs` sólo tiene LinkedIn: falta Google Scholar y la página de autor en Al Poniente.

---

## 2. Premisa estratégica

Google rara vez muestra más de dos resultados del mismo dominio por consulta (*host crowding*). Dominar la SERP de un nombre propio no se consigue con muchas páginas de inplux.co, sino con **varias propiedades que describan la misma entidad de forma consistente**: inplux.co, tribai.co, kelsen.io, laudos.co, gobia.co, LinkedIn, Google Scholar y Al Poniente.

El trabajo es **consolidar una entidad**, no optimizar palabras clave.

---

## 3. Diseño

### 3.1 Fuente única de verdad: `src/content/team.ts`

Módulo nuevo con el modelo `TeamMember`: nombre legal completo, `slug`, cargo, biografía, credenciales, `alternateName`, `disambiguatingDescription`, `knowsAbout` y `sameAs`.

Exporta un helper `personId(slug)` que devuelve `https://inplux.co/equipo/${slug}#person`. **Ese identificador es el eje de todo el diseño**: cualquier referencia a una persona en cualquier página del sitio debe apuntar a él.

Consumidores: `/nosotros`, `/equipo/[slug]` y `/prensa`.

### 3.2 Páginas de perfil: `/equipo/[slug]`

- `/equipo/jaime-alonso-cano-pino`
- `/equipo/cristian-espinal-maya`

El slug reproduce el nombre exacto y aparece en la URL mostrada en la SERP.

Cada página: `H1` con el nombre completo, metadata propia, biografía sustancial, publicaciones derivadas de `press.ts` filtrando por `byline`, y enlaces a LinkedIn y Scholar.

JSON-LD: `ProfilePage` + `Person` (con el `@id` canónico) + `BreadcrumbList`, y `subjectOf` hacia las publicaciones.

Se reutiliza el patrón de `src/app/trabajo/[slug]/page.tsx` (`generateStaticParams` + `generateMetadata`) y los componentes `SiteHeader`, `SiteFooter` y `ContactDialogProvider`.

### 3.3 Unificar identidad en `/nosotros` y `/prensa`

- `/nosotros` lee de `team.ts`, usa el `@id` canónico en lugar de `#leader-N`, escribe **«Cristian Espinal Maya»** completo y enlaza a cada perfil.
- `/prensa` resuelve el `byline` contra `team.ts`: si coincide con un miembro, el `Person` autor lleva el `@id` canónico; si no, se mantiene anónimo como hoy.

Con esto, las doce entidades sueltas se convierten en una sola con once publicaciones atribuidas.

### 3.4 Sitemap y verificadores

- Añadir `/equipo/*` a `src/app/sitemap.ts`.
- Registrar las rutas nuevas en `scripts/verify-build-output.mjs` (`pageDefinitions` y `expectedSitemapUrls`), que valida título, descripción, canonical, OG, JSON-LD y superficie de contacto por ruta.
- **No** añadir `lastmod`, `changefreq` ni `priority`: el verificador los rechaza a propósito.
- **No** publicar `/marca` en el sitemap: ya está excluida deliberadamente.

---

## 4. Fuera del código

Ejecución humana, sin la cual el trabajo en el sitio rinde la mitad:

- **LinkedIn:** nombre completo literal en el campo de nombre, titular con INPLUX, URL personalizada y enlace a la página de perfil.
- **Google Scholar:** añadir la afiliación INPLUX junto a EAFIT.
- **Al Poniente:** biografía de autor enlazando a `/equipo/jaime-alonso-cano-pino`.
- **Ecosistema propio** (tribai.co, kelsen.io, laudos.co, gobia.co, fourier.dev): `sameAs` recíproco y un enlace editorial contextual hacia el perfil correspondiente. Se descarta poner enlaces idénticos en los pies de página de todos los sitios: ese patrón se lee como esquema de enlaces.
- **Search Console:** verificar el dominio, enviar el sitemap y fijar línea base de posiciones.

El factor decisivo es la **coincidencia exacta del nombre** entre propiedades. Una variante distinta fragmenta la entidad igual que lo hace hoy el JSON-LD.

---

## 5. Fuera de alcance

Blog con motor de contenido, páginas por tema, contenido generado a escala, `hreflang` y versión en inglés.

---

## 6. Criterio de éxito

Que ambos nombres exactos devuelvan una página de inplux.co entre los tres primeros resultados y que la primera pantalla de la SERP esté ocupada por propiedades bajo control propio.

**Plazo estimado:** 4 a 10 semanas tras la indexación.

**Salvedad:** el caso de Cristian Espinal Maya será más lento, porque compite con deportistas homónimos en dominios de autoridad muy alta.
