# Diseño — `inplux.co/deck`

> **Estado:** aprobado el 11-ago-2026. Cierra la fase F0 («Decidir») del pliego `DECK.md`.
> **Alcance:** dos entregas independientes — F0.5 (atribución en el sitio) y F1–F6 (el deck).
> **Enmendado la noche del 11-ago-2026** — ver §0.
> **Este archivo es `.md` a propósito.** `scripts/verify-public-content.mjs` escanea `src/` y
> `public/` con las extensiones `.css .html .json .svg .ts .tsx .txt .webmanifest`. No escanea
> `docs/`, y `.md` no está en la lista. Por eso aquí se pueden nombrar las reglas sin romper
> el build.

---

## 0. Enmienda — noche del 11-ago-2026

Durante la ejecución de F0.5 el dueño amplió el encargo. Lo que sigue del documento se lee **con
estas correcciones encima**; no se reescribió el cuerpo porque el registro de lo que se aprobó
por la mañana tiene valor propio.

| Qué decía | Qué rige ahora | Por qué |
|---|---|---|
| Cuatro productos | **Cinco.** Porkia entra al portafolio | El dueño confirmó su autoría y autorizó retirar la regla de build que bloqueaba el nombre |
| Etiqueta «Solución de INPLUX» para Tribai y Kelsen | **«Desarrollo de INPLUX»** | Instrucción literal del dueño: son desarrollos suyos. Gobia conserva «Solución» porque es la única etiqueta respaldada palabra por palabra por su fuente |
| Deck de **14** láminas | **15** | Una lámina de producto más, generada sola desde `workProfiles` |
| Lámina 6: «Catorce cosas…» | **«Trece cosas…»** | `bannedPublicLanguage` pasó de 14 reglas a 13 al retirar la de Porkia |
| F0.5 toca 5 archivos | **Muchos más** | `attribution.state` gobernaba comportamiento, no solo texto: filtraba el ribbon de la portada, alimentaba las tarjetas OG y decidía qué publicaba `/en` |
| `/capacidades` y `/nosotros` fuera de alcance | **Dentro de F0.5** | Contaban la historia de dos productos; el dueño pidió cerrarlas en la misma rama |

**La autoría es una declaración de INPLUX, no una cita.** Ninguna fuente pública de Tribai,
Kelsen ni Porkia atribuye el desarrollo a INPLUX; Gobia y Laudos sí. La prosa del sitio dice las
dos cosas como cosas distintas: la tabla reúne las fuentes públicas de cada producto, y la
autoría se declara. Eso reemplaza a §5.2 del pliego («Lo que no reclamamos»), que ya no tiene
contenido.

**Lección que conviene no perder:** el defecto recurrente de esta rama fue **rejillas acopladas a
un conteo fijo de productos**. Apareció tres veces —el ribbon de la portada, las pestañas de la
vitrina, las columnas de una lista— y cada vez el síntoma fue distinto. Todo lo que se construya
en el deck deriva su disposición del número de ítems, nunca de un número escrito a mano.

---

## 1. Qué se construye

Una presentación de **15 láminas** en `inplux.co/deck/presentacion`, más un índice puntual en
`inplux.co/deck`. Navegable con teclado y gestos, hash por lámina, fondo claro.

Tesis vertebral, literal del sitio (`src/content/copy/es.ts:113`):

> **De un problema real a software en producción.**

Con su remate, también literal: *«La IA acelera el trabajo. Personas expertas dirigen y validan
las decisiones críticas.»*

El deck se usa **en vivo y por link**. Cada lámina se sostiene sola —el titular es la respuesta
completa, no un pie que necesite locución— pero el ritmo aguanta una exposición.

---

## 2. Decisiones cerradas (§13 del pliego)

| # | Pregunta | Decisión |
|---|---|---|
| 13.1 | La cifra de la lámina 2 | **Flyvbjerg & Budzier**: 1 de cada 6 proyectos de TI es un cisne negro |
| 13.2 | Reparto de actos | **Sin actos.** Una serie de 4 productos, sin separadores |
| 13.3 | «Lo que no reclamamos» | **Va**, con el contenido reemplazado (§5 de este documento) |
| 13.4 | Audiencia | **Empresa privada y entidad pública**, con una lámina espejo |
| 13.5 | Idioma | **Solo español**, con el copy en un objeto tipado listo para inglés. No se construye `/en/deck` |
| 13.6 | Marca | **INPLUX solo.** Los cuatro productos se presentan como propios. **REDEK no se nombra en el deck** |

### 2.1 Consecuencias de 13.6 — dejadas por escrito

Dos hechos del repo que el encargo modifica o rodea. Se registran aquí para que la decisión sea
trazable, no para reabrirla.

**a) El build exige que el sitio nombre a REDEK.** En
`scripts/verify-public-content.mjs:verifyPortfolio()`:

```js
const laudos = entries.find(([, name]) => name === "Laudos")?.[0];
if (!laudos || !/REDEK/.test(laudos)) {
  errors.push("Laudos debe conservar la atribución explícita a REDEK");
}
```

La regla aplica a `src/content/home.ts`, no al deck. **El sitio conserva la atribución; el deck
la omite.** Es una divergencia deliberada, aprobada el 11-ago-2026. No se toca esa regla ni la
entrada de Laudos en `home.ts`.

**b) Tribai y Kelsen figuran como `unconfirmed` en `src/content/work.ts`.** El campo no dice «no
los hicimos»: dice que la atribución **pública** no era verificable en la fuente revisada
(`verifiedAt: 2026-07-21`). Se confirma que los dos son de INPLUX y se corrige el sitio en F0.5.
Sin esa corrección, el deck y `/trabajo/tribai` se contradirían en el mismo dominio.

---

## 3. F0.5 — La atribución en el sitio

Entrega autónoma, rama y PR propios, **antes** del deck. No bloquea nada del deck: las láminas de
producto se generan desde `workProfiles`, así que heredan el cambio sin tocar código de deck.

### 3.1 Qué cambia

Tribai (`01`) y Kelsen (`03`) pasan de `unconfirmed` a `confirmed`, con la etiqueta que ya usa
Gobia: **«Solución de INPLUX»**.

### 3.2 Archivos

| Archivo | Qué toca |
|---|---|
| `src/content/work.ts` | `attribution.state`, `.label` y `.statement` de Tribai y Kelsen. `sources[]` y `verifiedAt` se conservan: siguen sosteniendo la existencia y las capacidades del producto |
| `src/app/trabajo/page.tsx` | Hoy separa el directorio en trabajo atribuible y «el ecosistema observado». Con cuatro confirmados esa partición se queda sin contenido y el listado pasa a ser uno solo |
| `src/app/api/og/trabajo/[key]/route.tsx` | Rama de render por estado de atribución |
| `src/app/api/og/trabajo/social-card.ts` | Cadena «ecosistema observado» |
| `src/app/trabajo/[slug]/profile.module.css` | Clases por estado `unconfirmed` |
| `scripts/verify-build-output.mjs` | Trae las cadenas **hardcodeadas**: `attribution` y `socialAlt` de cada perfil (p. ej. `"Tribai: Producto público. Atribución pública no confirmada."`), y la `description` de `/trabajo` |
| `scripts/verify-http-contracts.mjs` | Bump del `?v=` de las cinco tarjetas OG (hoy `2026-07-21`) |

`workSocialVersion` en `verify-build-output.mjs` y el `?v=` de `verify-http-contracts.mjs` **son
la misma fecha y tienen que moverse juntos**, o el contrato HTTP falla.

### 3.3 Qué NO cambia

- La entrada de Laudos en `home.ts` conserva la mención a REDEK (§2.1a).
- `attribution.state` sigue existiendo como campo. La disciplina no se elimina del modelo: se
  corrige el dato.
- `CONTENT_VERIFICATION_MAX_AGE_DAYS` (120 días). Los `verifiedAt` actuales son `2026-07-15` y
  `2026-07-21`: 27 y 21 días. Dentro de plazo.

### 3.4 Cierra cuando

`npm run check` pasa completo (`lint` + `test:hero-inspector` + `build` + `check:http`) y
`/trabajo`, `/trabajo/tribai` y `/trabajo/kelsen` muestran los cuatro productos bajo una sola
atribución.

---

## 4. El guion — 15 láminas

El pliego proponía ~18 con tres separadores de acto. Sin actos y con la lámina espejo quedaban 14;
con Porkia (§0) son 15. Ninguna de relleno.

| # | id | `kind` | Lámina | Arquetipo |
|---|---|---|---|---|
| 1 | `portada` | `portada` | *De un problema real a software en producción.* Bajada: la IA acelera, las personas dirigen | Malla de fondo |
| 2 | `problema` | `problema` | **El promedio no es el riesgo. 1 de cada 6.** | Barras que se desbordan |
| 3 | `tesis` | `tesis` | El software empieza en el problema, no en el requisito | Curvas cruzadas |
| 4 | `metodo` | `metodo` | Entender → Definir → Construir → Lanzar | Línea de tiempo |
| 5 | `espejo` | `espejo` | El mismo método, dos lecturas: empresa / entidad | Espina simétrica |
| 6 | `evidencia` | `evidencia` | **Trece cosas que este sitio no puede decir** | Log de build |
| 7 | `puente` | `puente` | La fábrica no es de un sector | Rejilla de 4 |
| 8 | `tribai` | `producto` | Tribai — Tributación | Ficha + interfaz `tributary` |
| 9 | `gobia` | `producto` | Gobia — Gestión pública | Ficha + interfaz `civic` |
| 10 | `kelsen` | `producto` | Kelsen — Derecho | Ficha + interfaz `legal` |
| 11 | `laudos` | `producto` | Laudos — Arbitraje | Ficha + interfaz `arbitration` |
| 12 | `porkia` | `producto` | Porkia — Porcicultura | Ficha + interfaz `livestock` |
| 13 | `capacidades` | `capacidades` | La fábrica por dentro | Capas |
| 14 | `como-empezamos` | `como-empezamos` | Los cuatro tiempos aplicados a tu reto | Hub radial |
| 15 | `cierre` | `cierre` | `gerencia@inplux.co` · Medellín | Tipografía |

**El orden de 8–12 es el de `workProfiles` en `work.ts`.** Una sola fuente para el orden: si hay
que reordenar, se reordena ahí y `/trabajo` se mueve con el deck. Y el conteo **nunca** se escribe
a mano: si entra un sexto producto, el deck se renumera solo (§0).

### 4.1 Arquetipos — verificación de §2.5

Barras → curvas → línea de tiempo → espina → log → rejilla → **[serie de 5 fichas]** → capas →
hub → tipografía. Ningún arquetipo se repite en láminas contiguas.

Las cinco fichas de producto repiten estructura **a propósito**: son una serie, y la serie es
el argumento de la lámina 7. Lo que varía en cada una es la figura de interfaz, que ya viene
diferenciada por `interface.theme` (`tributary` · `civic` · `legal` · `arbitration` · `livestock`).

⚠️ La lámina 7 («la fábrica no es de un sector») **gana fuerza** con Porkia: cuatro dominios
jurídico-administrativos más una app para porcicultores de 50 a 300 cerdos es un argumento mucho
más difícil de rebatir que cuatro variaciones sobre lo mismo.

### 4.2 Lámina 2 — la cifra

**Fuente:** Bent Flyvbjerg y Alexander Budzier, *Why Your IT Project May Be Riskier Than You
Think*, Harvard Business Review, septiembre de 2011. Muestra: **1.471 proyectos de TI**.

**Dato:** el sobrecosto promedio es del 27 %, pero **uno de cada seis** proyectos es un «cisne
negro»: 200 % de sobrecosto en promedio y casi 70 % de sobreplazo.

**Acceso libre y citable:** preprint en `arXiv:1304.0265` (`https://arxiv.org/abs/1304.0265`),
mismos autores y mismas cifras. Verificado contra el abstract el **11-ago-2026**. La versión de
HBR está tras muro de pago; el pie de la lámina cita el arXiv para que cualquiera pueda
comprobarlo en la sala.

**Por qué esta y no CHAOS:** el argumento no es «el software falla», que es refutable y suena a
folleto. Es **«el riesgo no está en el promedio, está en la cola»** — que es más difícil de
rebatir, más interesante, y desemboca directo en la tesis: entender el problema antes de
comprometer el alcance es lo que recorta la cola.

**Copy propuesto:**

> El promedio no es el riesgo.
> **1 de cada 6**
> proyectos de TI se sale 200 %.

**Animación:** seis barras iguales entran. Cinco se detienen en su marca. La sexta sigue
creciendo hasta triplicar el ancho del recuadro. El contador sube acoplado a esa sexta barra
(§7.1). Es el mecanismo, no un resultado.

**Registro:** el dato entra a `src/content/deck.ts` con su `source` y su `verifiedAt`, con la
misma forma que `WorkSource` en `work.ts`.

### 4.3 Lámina 5 — el espejo

Una sola lámina partida en dos columnas simétricas. Cada tiempo del método, leído desde los dos
lados:

| Tiempo | Empresa | Entidad |
|---|---|---|
| Entender | Quién decide y con qué información | Qué obliga la norma y quién responde |
| Definir | Qué versión mínima es útil este trimestre | Qué alcance es defendible y trazable |
| Construir | Se integra con lo que ya opera | Deja rastro de cada decisión |
| Lanzar | Se mide el uso real y se ajusta | Se entrega documentado y auditable |

⚠️ **Restricción de copy:** `verify-public-content.mjs` bloquea `alcance nacional` y `areaServed`.
La columna pública **no puede insinuar cobertura territorial**. También bloquea la promesa
genérica de velocidad, así que ninguna columna promete plazos.

**Animación:** la espina se dibuja desde el centro y los dos lados reciben su marca **a la vez**.
La simetría es el argumento.

---

## 5. Lámina 6 — «Trece cosas que este sitio no puede decir»

> **Nota de precisión.** El titular dice *cosas*, no *frases*: cada una de las trece reglas
> bloquea una familia de expresiones, no una cadena única — la regla de logos, por ejemplo,
> cubre cuatro nombres. «Trece frases» sería impreciso, y este deck no puede permitirse una
> imprecisión justo en la lámina que habla de rigor.

Reemplaza a «Lo que no reclamamos» del pliego, que se queda sin las dos columnas al pasar los
cuatro productos a propios. El argumento no se pierde: se muda a un terreno **más fuerte y que no
depende de la atribución**.

### 5.1 Contenido

las trece etiquetas son literalmente los motivos de `bannedPublicLanguage` en
`scripts/verify-public-content.mjs`:

1. cifra de trayectoria sin evidencia
2. cifra de cobertura sin evidencia
3. cifra de proyectos sin evidencia
4. cifra jurídica sin evidencia
5. promesa genérica de velocidad
6. posicionamiento tributario anterior
7. jerga agéntica
8. afirmación autónoma no aprobada
9. cobertura geográfica no aprobada
10. logo o relación sin permiso
11. prueba social anterior
12. impacto no demostrado
13. posicionamiento profesional anterior

⚠️ Eran catorce hasta la noche del 11-ago-2026, cuando se retiró «producto fuera del portafolio»
para poder publicar Porkia (§0). **Esto es exactamente lo que la prueba de §5.3 existe para
atrapar**, y se disparó antes de que la lámina estuviera construida: la lista es viva, y el
titular de la lámina tiene que seguirla.

Con el remate:

> **No es una guía de estilo. Es una prueba automática.**
> Si alguien las escribe, el sitio no compila.

### 5.2 La trampa — dos capas, y la segunda muerde

⚠️ **Capa 1.** `verifyPublicLanguage()` recorre **todo `src/`** y `public/` buscando las cadenas
prohibidas. Una lámina que imprima las frases literales **rompe su propio build**. Es la razón
por la que `DECK.md` es `.md`.

Por eso la lámina muestra **los motivos, no las frases**. Como copy además son mejores: nombran
la categoría de deshonestidad, no el ejemplo.

⚠️ **Capa 2 — la que no es obvia.** Uno de los motivos **es él mismo una cadena prohibida**. El
patrón de jerga es:

```js
["jerga agéntica", /\b(?:agentic|ag[eé]ntic[oa]s?|multiagente)\b/giu],
```

`ag[eé]ntic[oa]s?` coincide con la propia etiqueta del motivo. Escribir los trece motivos como
literales en un `.tsx` **falla el build en esa línea**. La regla se muerde la cola.

**Consecuencia de diseño:** la lectura en build de §5.3 no es una elegancia opcional. Es la
única forma de construir esta lámina. Los trece motivos **nunca** aparecen como literales en
`src/`.

### 5.3 De dónde salen los motivos, y cómo no envejecen

Un módulo lee `scripts/verify-public-content.mjs` en tiempo de build, extrae el primer elemento
de cada tupla de `bannedPublicLanguage` y exporta la lista.

Funciona porque el `.mjs` **no está bajo `src/` ni `public/`**: el verificador no lo escanea a
sí mismo. Y lo que llega al HTML es salida de build, que tampoco se escanea — `check:content`
corre sobre las fuentes, antes de `next build`.

Con una prueba que falla si el conteo deja de ser 13: si alguien añade o quita una regla, o se
actualiza el titular de la lámina, o falla el test. Nunca queda desincronizada en silencio.

⚠️ El módulo lector vive en `scripts/` o en la capa de servidor, **no** como constante en un
componente. Si alguien «simplifica» pegando la lista en el `.tsx`, el build lo rechaza en la
línea de la jerga — que es exactamente el comportamiento que la lámina está afirmando.

### 5.4 Animación

Un log de build que corre. Las trece líneas aparecen escalonadas y la última pinta
`✗ check:content` con el conteo. Es el mecanismo — la prueba corriendo — no un resultado.

---

## 6. Arquitectura

Réplica de `~/tensor-web/src/components/portfolio-deck/`, probado en producción en
`tensor.lat/deck/presentacion`. Piezas ya resueltas allí que se portan: `useDeckNav.ts`,
`Contador.tsx`, `EspejoSlide.tsx`, `chrome/` completo.

### 6.1 Rutas

| Ruta | Qué es |
|---|---|
| `/deck` | Índice puntual: hero, tesis, los cuatro perfiles, salida doble (producto vivo + lámina) |
| `/deck/presentacion` | La presentación cinemática, hash por lámina |

Las dos se registran en `scripts/verify-build-output.mjs`, en `pageDefinitions` **y** en
`expectedSitemapUrls` — que pasa de 14 a **16** entradas. Sin `lastmod`, `changefreq` ni
`priority`: el verificador falla si aparecen.

### 6.2 Modelo de datos

Una sola fuente para orden y contenido. **Las láminas de producto no se escriben a mano.**

```ts
// src/content/deck.ts
import { workProfiles } from "./work";

export type DeckSlideKind =
  | "portada" | "problema" | "tesis" | "metodo" | "espejo"
  | "evidencia" | "puente" | "producto" | "capacidades"
  | "como-empezamos" | "cierre";

export type DeckSlide =
  | { n: number; id: string; kind: Exclude<DeckSlideKind, "producto"> }
  | { n: number; id: string; kind: "producto"; perfil: (typeof workProfiles)[number] };

export const SLIDES: readonly DeckSlide[] = construir();
export const TOTAL_SLIDES = SLIDES.length;
```

Con la prueba de perfil huérfano, que en Tensor atrapó un producto sin lámina:

```ts
if (PRODUCT_SLIDE_COUNT !== workProfiles.length) throw new Error(/* … */);
```

El copy vive en un objeto tipado con la forma de `src/content/copy/es.ts`. Añadir inglés después
es rellenar un objeto gemelo y registrar dos rutas más; no se construye ahora.

### 6.3 Componentes

```
src/components/deck/
  PresentationDeck.tsx     ← riel, teclado, gestos, hash, índice
  SlideRenderer.tsx        ← switch por kind, SIN default
  slides/                  ← una lámina por archivo
  figures/                 ← una figura por archivo, gramática de §8 del pliego
  Contador.tsx             ← cifra que sube
  chrome/                  ← barra superior, riel de progreso, índice, ayuda
```

⚠️ El `switch` de `SlideRenderer` **no lleva `default`**: sin él TypeScript comprueba que están
cubiertos todos los `kind`, y añadir un tipo de lámina sin su rama rompe el build en vez de
pintar un hueco en producción.

### 6.4 El riel

**Dos slots que se sustituyen**, con `key` por secuencia. No `AnimatePresence mode="sync"`: en
Tensor montaba un nodo nuevo por pulsación y acumulaba salientes. Se arranca con los dos slots.

Solo dos láminas montadas a la vez es lo que hace que las animaciones de entrada disparen al
llegar a la lámina y no al cargar la página.

`<MotionConfig reducedMotion="user">` envuelve el deck entero.

Cada `<section>` de lámina lleva `data-slide="<id>"` — sin eso el arnés de QA tiene que adivinar
cuál es la lámina visible, y adivinar falla justo cuando hay dos montadas.

---

## 7. Sistema visual y movimiento

### 7.1 Tokens y tipografía

Los del sitio, en `src/app/globals.css` y `src/app/tokens/`. **No se crea una paleta de deck.**

```
--off-white #f8f8f7   fondo
--ink       #1a1918   texto (nunca negro puro)
--teal      #0d7d74   acento, relleno
--teal-accent #0fb3a1 trazo fino sobre claro
--teal-soft #e8f5f3   fondos de bloque
--border    #e5e3e0   hairline
```

`verify-public-content.mjs:verifyBrandSystem()` exige conservar `--gray-400: #76716a` y
`--teal-on-soft: #0b746c` (los accesibles). **Todo texto en teal usa `--teal-on-soft`, no
`--teal`.** El contraste se verifica sobre `--off-white`, no sobre blanco puro.

Tipografías: `--font-body` Geist · `--font-serif` Newsreader Display 300 · `--font-mono` Geist
Mono. La jerarquía se resuelve con **peso y tamaño**, no con color.

### 7.2 Jerarquía — §2.2 del pliego

La pregunta es el montaje; el titular es la **respuesta**. Pregunta pequeña (≈1,6 rem), respuesta
grande (≈4,3 rem). Cuando una lámina se vea cargada, sobra tamaño en el sitio equivocado, no
copy.

### 7.3 Gramática de figuras

De `estilo-s50` en su versión original para fondo claro
(`~/hospital-alma-mater-ruta-2050/estilo-s50/SKILL.md`):

- Nodo: relleno del fondo, contorno del color del nodo, grosor ≈ 6–7 % del diámetro.
- Conector: 0,7 pt gris, recortado a unos puntos del borde de cada círculo.
- Etiqueta del nodo: del color del nodo. Descriptor secundario: gris. Nunca negro.
- Cero rellenos sólidos, cero sombras, cero degradados de fondo, cero cajas.
- Si un texto no cabe en un nodo: reduce el cuerpo o parte en dos líneas. Nunca agrandes el
  círculo ni saques la etiqueta con línea guía.

**El WOW en fondo claro es precisión**, no luz: aire, retículas de un solo hilo, trazos hairline,
movimiento que demuestra un mecanismo.

### 7.4 Móvil

Las figuras ceden a listas compactas **por CSS, no por rama de JavaScript**. Mismo DOM. Bajo el
breakpoint, las etiquetas de un SVG caen por debajo de 8 px y dejan de leerse.

### 7.5 Las tres animaciones — y solo esas

1. **La sexta barra se desborda mientras el contador sube.** El compás vive en un solo sitio y se
   exporta desde la figura:

   ```ts
   export const RITMO = { inicio: 0.35, total: 2.6, arranque: 0.25, fin: 0.95 } as const;
   export const T_CIFRA = {
     retraso: RITMO.inicio + RITMO.arranque * RITMO.total,
     duracion: (RITMO.fin - RITMO.arranque) * RITMO.total,
   } as const;
   ```

   Cascada con `duration` y `delay` **comunes**, moviendo el instante de cada barra con `times`.
   Duraciones distintas por elemento descoordinan el contador. El contador va **lineal**: una
   curva expo-out se lee atascada porque alcanza el 99 % a mitad de recorrido. Y va
   `aria-hidden`: la lámina declara el dato completo en su `aria-label`.

2. **El pulso recorre** Entender → Definir → Construir → Lanzar. Es la tesis, literal.

3. **La espina del espejo se dibuja** y los dos lados llegan a la vez.

Curva de entrada: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)`. Escalonado de 0,06–0,12 s entre
hermanos.

### 7.6 Movimiento reducido — la barrera

`useReducedMotion()` devuelve el valor real ya en el primer render del cliente pero `false`/`null`
en SSR. Si ese valor decide **qué se renderiza**, el HTML del servidor deja de coincidir con el
primer render del cliente → **React #418, solo para usuarios con `prefers-reduced-motion`**,
invisible en dev y determinista en producción.

- **Seguro:** el flag dentro de props de motion (`animate`, `transition`) y en gates de
  comportamiento (un `setInterval` que no arranca).
- **Prohibido:** `if (reduce) return <otro/>`, `key={reduce ? …}`, elementos condicionales.

`<MotionConfig reducedMotion="user">` cubre las props de motion, **no** lo imperativo: un
`animate()` llamado a mano o un `setInterval` tienen que leer el flag y apagarse.

Se verifica **en build de producción**, con los dos modos. En dev no se reproduce.

---

## 8. QA

### 8.1 Arnés de medición

`scripts/qa-deck.mjs`, con el dev server arriba. **Mide**; las capturas son para juzgar. Tres
viewports: 1440×900 (escritorio), 1920×1080 (proyector), 390×844 (móvil).

Comprueba por lámina: caja superior e inferior contra las barras del deck (70 px arriba, 60 px
abajo), conteo de palabras, conteo de figuras, errores de consola y `pageerror`.

⚠️ **Filtrar por `height > 0` antes de medir.** Los hijos ocultos por breakpoint (`display:none`)
devuelven un rect en ceros y contaminan cualquier `Math.min` sobre coordenadas.

### 8.2 Barrera de hidratación

`scripts/qa-reduce.mjs`, contra `npm run build && npm run start`. Recorre el deck con
`reducedMotion: "reduce"` y `"no-preference"`, contando errores de consola y `pageerror`.

### 8.3 Criterios de aceptación por lámina

- [ ] No choca con las barras en 1440×900, 1920×1080 y 390×844.
- [ ] ≤ 110 palabras en las láminas de apertura. Si pasa, revisar jerarquía (§7.2) antes de cortar.
- [ ] Al menos una figura, o una razón escrita de por qué no.
- [ ] Su arquetipo no se repite en la lámina anterior ni en la siguiente.
- [ ] Toda cifra tiene fuente con `verifiedAt`.
- [ ] Cero errores de consola y cero React #418 en los dos modos de movimiento.

### 8.4 Puertas de build

`npm run check` = `lint` + `test:hero-inspector` + `build` + `check:http`. Es la que hay que pasar
antes de mergear. `npm run build` corre `check:content` → `next build` → `check:output`.

---

## 9. Catálogo de trampas

Todas medidas en Tensor o en este repo. Ninguna teórica.

| Trampa | Síntoma | Salida |
|---|---|---|
| Frases prohibidas en el copy del deck | `check:content` falla el build | Motivos, no frases (§5.2) |
| El motivo «jerga agéntica» es él mismo una cadena prohibida | La lámina 6 rompe el build en su propia lista | Leer los motivos del `.mjs` en build; nunca como literales en `src/` (§5.2) |
| Estructura condicional por `useReducedMotion` | React #418 solo con movimiento reducido, solo en producción | Flag dentro de props de motion (§7.6) |
| `pathLength` con `preserveAspectRatio="none"` | La cola del trazo (~16 % del ancho) queda sin pintar | Barrido con `clipPath` que crece, o animar opacidad |
| `<circle>` bajo `preserveAspectRatio="none"` | Se deforma en óvalo al cambiar el ancho | `<rect>` corto |
| framer pisa la clase de opacidad del contenedor | La atenuación desaparece al animar | Que la opacidad viva en el hijo SVG |
| Figura sin tope de ancho | Crece de alto en proporción y mete la lámina bajo las barras | `max-w` explícito en el envoltorio |
| Arnés que mide `Math.min` sobre todos los hijos | Reporta `top: 0` falso | Filtrar por `height > 0` |
| Orden de lectura ≠ orden visual | La rejilla intercala dos columnas en móvil | `lg:contents` en el envoltorio de cada columna |
| Clases de Tailwind por concatenación | El JIT no las genera y el estilo no aplica | Mapa de literales |
| Conector anclado a un `top` fijo | Se desalinea cuando el `clamp` del titular cambia | `calc(pad + clamp(…) * 0.69)` |
| Azar en geometría de SSR | Rompe la hidratación | Geometría determinista a nivel de módulo |
| Puerto 3000 ocupado por otro proyecto | «Ready» en 3000 pero responde otra app y el arnés ve láminas vacías | Levantar en otro puerto (`-p 3210`) |
| Cascada con duraciones distintas por celda | El contador se desacopla de la figura | `duration` y `delay` comunes, mover con `times` |
| `workSocialVersion` y `?v=` desincronizados | `check:http` falla tras tocar las OG | Moverlos juntos (§3.2) |

---

## 10. Plan de fases

Cada fase termina en algo que se puede mirar. No se pasa a la siguiente sin cerrar la anterior.

**F0 · Decidir.** ✅ Cerrada el 11-ago-2026 con este documento. Sin `[VERIFICAR]` en el guion.

**F0.5 · Atribución en el sitio.** Los seis archivos de §3.2, rama y PR propios.
→ *Cierra cuando:* `npm run check` pasa y los cuatro productos aparecen bajo una sola atribución.

**F1 · Andamiaje.** Rutas registradas en `verify-build-output.mjs`. Modelo de datos de §6.2 con su
prueba de perfil huérfano. Riel de dos slots, teclado, gestos, hash, índice. Láminas en blanco con
su `data-slide`.
→ *Cierra cuando:* `npm run check` pasa y se recorren las 15 láminas vacías con →.

**F2 · Apertura (láminas 1–7).** Es el 70 % del valor del deck. Completa, con figuras, antes de
tocar los productos.
→ *Cierra cuando:* el arnés da verde en los tres viewports y las 7 cumplen §8.3.

**F3 · Productos y cierre (8–14).** Generadas desde `workProfiles`.
→ *Cierra cuando:* la prueba de perfil huérfano pasa y las cuatro fichas leen su atribución desde
`work.ts`, sin copia local.

**F4 · Movimiento.** Las tres animaciones de §7.5, y solo esas. Después, la barrera de §8.2.
→ *Cierra cuando:* cero #418 en los dos modos, en build de producción.

**F5 · Revisión adversarial.** Tres lecturas independientes antes de mergear: **cliente escéptico**
(¿qué no me creo?), **director de arte** (¿qué se ve barato?), **auditor de evidencia** (¿qué
afirmación no tiene fuente?).
→ *Cierra cuando:* lo convergente entre las tres está implementado o descartado por escrito.

**F6 · Cierre.** `npm run check` completo, merge a `main` (auto-deploy desde GitHub; no se corre
`vercel deploy --prod` a mano), y verificación en producción **con Playwright, no con `curl`**: las
láminas más allá de la primera se renderizan en cliente y no aparecen en el HTML inicial.

---

## 11. Fuentes

| Qué | Dónde | Verificado |
|---|---|---|
| 1.471 proyectos · 1 de cada 6 · 200 % · ~70 % | Flyvbjerg & Budzier, HBR sept-2011 · preprint `arXiv:1304.0265` | 11-ago-2026 |
| Perfiles, atribución y capacidades | `src/content/work.ts` | 21-jul-2026 |
| Método, servicios y portafolio | `src/content/home.ts` | 15-jul-2026 |
| Tesis y remate | `src/content/copy/es.ts:113` | — |
| Reglas de lenguaje público | `scripts/verify-public-content.mjs` | leído 11-ago-2026 |
| Rutas y sitemap | `scripts/verify-build-output.mjs` | leído 11-ago-2026 |
| Deck de referencia | `~/tensor-web/src/components/portfolio-deck/` | leído 11-ago-2026 |
| Gramática de figuras | `~/hospital-alma-mater-ruta-2050/estilo-s50/SKILL.md` | — |

**Regla de cifras (§5.3 del pliego):** ninguna cifra nueva entra al deck sin pasar antes por el
contenido del sitio. Si el deck necesita un dato que el sitio no tiene, primero se verifica y se
agrega, después se usa.
