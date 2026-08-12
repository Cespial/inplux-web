# Deck INPLUX — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `inplux.co/deck` y `inplux.co/deck/presentacion` — una presentación de 15 láminas, fondo claro, navegable con teclado y gestos — precedida por la corrección de atribución de Tribai y Kelsen en el sitio.

**Architecture:** Las láminas de producto se generan recorriendo `workProfiles`, así que el deck no tiene una segunda copia de la verdad. El riel monta **dos láminas a la vez** con `key` por secuencia. Todo el movimiento es **CSS de módulo**, como el resto del repo: no se instala framer-motion.

**Tech Stack:** Next.js 16.2.10 (App Router) · React 19.2.7 · CSS Modules + tokens en `src/app/tokens/` · `node --test` para pruebas · Playwright (nuevo devDependency, solo para el arnés de QA).

---

## Corrección de arquitectura respecto al spec

El spec (§6.4, §7.5, §7.6) fue escrito contra el deck de Tensor, que usa **framer-motion**. Este repo **no la tiene y no la va a tener**:

```
dependencies: { next, react, react-dom }     ← tres. Nada más.
grep -rn "framer-motion|useReducedMotion" src/  →  NINGUNO
```

Las 23 superficies animadas del sitio usan `@keyframes`, `transition` y `animation-delay` en CSS Modules, con `@media (prefers-reduced-motion: reduce)` en cada una.

**Tres consecuencias, todas buenas:**

1. **No se instala framer-motion.** Añadir una dependencia de animación a un proyecto de tres dependencias, solo para el deck, rompería la consistencia temporal con el resto del sitio.
2. **No hay `MotionConfig` ni `AnimatePresence`.** El riel de dos slots se implementa con `key` y clases CSS de entrada/salida.
3. **La trampa de React #418 desaparece.** Era consecuencia de que `useReducedMotion()` devuelve un valor distinto en SSR y en el primer render del cliente. Una `@media (prefers-reduced-motion: reduce)` no se evalúa en React: no puede producir una discrepancia de hidratación. La única pieza que necesita JS es el contador, y la Tarea 9 lo resuelve renderizando **el valor final** en servidor y en el primer render del cliente.

El resto del spec se mantiene íntegro.

**Corrección menor de alcance:** el spec §3.2 lista seis archivos para F0.5. Son **cinco**. `src/app/trabajo/[slug]/profile.module.css` y `src/app/api/og/trabajo/[key]/route.tsx` leen el estado de forma genérica (`data-attribution={profile.attribution.state}`); con cuatro perfiles confirmados sus ramas `unconfirmed` quedan inertes pero válidas, y el campo sigue existiendo en el tipo. No se tocan.

---

## Enmienda — noche del 11-ago-2026

F0.5 creció durante su ejecución.

⚠️ **Este plan NO está completamente actualizado, y esa es la advertencia más importante del
documento.** Los números de cabecera, el modelo de datos, las pruebas y los comandos del arnés sí
se corrigieron. Los cuerpos de las tareas sin ejecutar **conservan «cuatro» en varios sitios** —
la revisión final de F0.5 encontró siete—. Antes de ejecutar cada tarea, **cuenta los perfiles en
`src/content/work.ts`** y trata cualquier «cuatro» del cuerpo como una errata a verificar, no como
un dato.

Donde eso más muerde: el copy destinado a `src/` (la lámina 7 decía «cuatro dominios»), el
presupuesto de layout de esa misma lámina —medido para cuatro miniaturas, **no para cinco**— y la
posición de las rutas nuevas en `expectedSitemapUrls`, que se compara posicionalmente y donde el
orden ya cambió una vez.

La versión anterior de este párrafo afirmaba que el plan «ya refleja los números nuevos». Era
falso, y una desactualización visible es mucho menos peligrosa que una garantía falsa: quien
confía en ella reproduce la clase exacta de defecto que F0.5 tardó 31 confirmaciones en erradicar.

- **Cinco productos, no cuatro.** Porkia entró al portafolio y la regla de build que bloqueaba su
  nombre se retiró. El deck pasa de 14 a **15 láminas**, y se renumera solo porque las de producto
  se generan desde `workProfiles`.
- **La lámina 6 dice «Trece cosas», no «Catorce».** `bannedPublicLanguage` bajó de 14 reglas a 13
  al retirar la de Porkia. La prueba de la Tarea 12 —la que falla si el conteo cambia— se disparó
  antes de que la lámina existiera. Está haciendo su trabajo.
- **`Porkia` ya no es una cadena prohibida.** Las otras trece reglas siguen vigentes, incluida la
  de promesas de plazo.
- **La autoría es una declaración de INPLUX, no una cita.** Ninguna fuente pública de Tribai,
  Kelsen ni Porkia atribuye el desarrollo a INPLUX. El sitio lo dice como declaración y reserva la
  tabla de fuentes para lo que las fuentes sí sostienen. El deck hereda ese criterio: las fichas
  de producto muestran `attribution.label` sin convertirlo en una afirmación con fuente.

⚠️ **El defecto que más caro salió, y que el deck no puede repetir:** rejillas y listas acopladas
a un conteo fijo de productos. Apareció **tres veces** en F0.5 —el ribbon de la portada, las
pestañas de la vitrina, y una lista de columnas— con un síntoma distinto cada vez. Toda
disposición del deck se deriva del número de ítems. Ningún `repeat(N, …)` con N escrito a mano,
ninguna regla que nombre una posición («la tercera», «las dos últimas»).

---

## Global Constraints

Aplican a **todas** las tareas. No se repiten en cada una.

- **Puerta de contenido.** `scripts/verify-public-content.mjs` escanea `src/` y `public/` en `.css .html .json .svg .ts .tsx .txt .webmanifest`. Ninguna cadena de la lista `bannedPublicLanguage` puede aparecer en un archivo de esos. En particular: nada de `en días` / `en semanas`, `resultados medibles` / `impacto medible`, `alcance nacional`, `areaServed`, `agéntic*`, `agentes de IA`, `confían en nosotros`, ni las cifras de trayectoria.
- **El motivo «jerga agéntica» coincide con su propio patrón bloqueado.** Verificado el 11-ago-2026. Los trece motivos de la lámina 6 **nunca** se escriben como literales en `src/` (Tarea 12).
- **Comando de verificación:** `npm run check` = `lint` + `test:hero-inspector` + `build` + `check:http`. `build` = `check:content` → `next build` → `check:output`. **Toda tarea cierra con `npm run check` en verde.**
- **`check:http` necesita el servidor arriba.** Es `npm run build && npm run start` en otra terminal. Si el puerto 3000 está tomado por otro proyecto, `check:http` responde 200 desde la app equivocada: levantar en `-p 3210` y exportar la base.
- **Tokens.** Solo los de `src/app/tokens/colors.css` y `src/app/globals.css`. No se crea paleta de deck. Nombres reales: `--off-white`, `--ink`, `--teal`, `--teal-bright`, `--teal-on-soft`, `--teal-soft`, `--gray-400`, `--border`, `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- **Texto en teal usa `--teal-on-soft` (#0b746c), nunca `--teal`.** `verifyBrandSystem()` exige conservar ese token justamente porque es el que alcanza AA.
- **Tipografía:** `--font-body` (Geist) · `--font-serif` (Newsreader Display 300) · `--font-mono`. Jerarquía por peso y tamaño, nunca por color.
- **Estilos en CSS Modules** (`*.module.css`) junto al componente. Sin utilidades de Tailwind en `className`: el repo no las usa.
- **Movimiento en CSS.** Cada módulo con animación cierra con:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .algo { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
  ```
- **Cada `<section>` de lámina lleva `data-slide="<id>"`.** Sin eso el arnés no sabe cuál es la lámina visible.
- ⚠️ **Durante toda la transición hay DOS `[data-slide]` montados** — la entrante y la saliente. El riel marca el slot visible con `data-estado="activa"`, y ese atributo vive en el **slot**, no en la `<section>`. Todo lo que mida una lámina filtra por `[data-estado="activa"] section[data-slide="…"]`; sin ese filtro se mide la caja de la saliente la mitad de las veces, y el fallo se ve como ruido aleatorio, no como error. Contrato establecido y verificado en navegador por la Tarea 5.
- **Commits sin trailer de atribución a Claude.** Mensaje en español, imperativo, explicando el porqué.
- **Rama de trabajo.** F0.5 va en `fix/atribucion-tribai-kelsen`; el deck en `feat/deck`. `main` auto-despliega: no se mergea nada que no haya pasado `npm run check`.

---

## Estructura de archivos

**F0.5 — modifica**

| Archivo | Responsabilidad |
|---|---|
| `src/content/work.ts` | Fuente única de perfiles, atribución y fuentes |
| `src/app/trabajo/page.tsx` | Índice de trabajo: copy, ledger, metadatos, JSON-LD |
| `src/app/api/og/trabajo/social-card.ts` | Deriva la tarjeta social y su versión desde `work.ts` |
| `scripts/verify-build-output.mjs` | Contrato de HTML, metadatos y sitemap |
| `scripts/verify-http-contracts.mjs` | Contrato de códigos HTTP y URLs de OG |

**Deck — crea**

| Archivo | Responsabilidad |
|---|---|
| `src/content/deck.ts` | Modelo: `SLIDES`, `TOTAL_SLIDES`, copy tipado, fuentes del deck |
| `src/content/deck.copy.ts` | Todo el texto en un objeto tipado, listo para un gemelo en inglés |
| `scripts/verify-deck-model.test.mjs` | Prueba de perfil huérfano y de conteo de láminas |
| `src/lib/banned-reasons.server.ts` | Lee los motivos de `verify-public-content.mjs` en build. Solo lo importa la ruta, que es de servidor |
| `scripts/verify-deck-reasons.test.mjs` | Prueba de que los motivos siguen siendo 13 |
| `scripts/qa-deck.mjs` | Arnés de medición de láminas |
| `scripts/qa-reduce.mjs` | Barrera de movimiento reducido |
| `src/app/deck/page.tsx` | Índice puntual `/deck` |
| `src/app/deck/deck-index.module.css` | Estilos del índice |
| `src/app/deck/presentacion/page.tsx` | Ruta de la presentación |
| `src/components/deck/PresentationDeck.client.tsx` | Riel de dos slots, teclado, gestos, hash |
| `src/components/deck/useDeckNav.ts` | Estado de navegación: índice, dirección, hash |
| `src/components/deck/SlideRenderer.tsx` | `switch` por `kind`, sin `default` |
| `src/components/deck/Slide.tsx` | Envoltura común: `data-slide`, `aria-label`, rejilla |
| `src/components/deck/deck.module.css` | Retícula, tipografía de lámina, barras |
| `src/components/deck/Contador.client.tsx` | Cifra que sube, acoplada al compás de una figura |
| `src/components/deck/chrome/*` | Barra superior, riel de progreso, índice, ayuda |
| `src/components/deck/slides/*` | Una lámina por archivo |
| `src/components/deck/figures/*` | Una figura por archivo |

---

# FASE 0.5 — Atribución en el sitio

Rama: `fix/atribucion-tribai-kelsen`.

---

### Tarea 1: Re-verificar las fuentes y sincronizar la versión de las tarjetas OG

Las fuentes citadas de todos los perfiles se verificaron el 2026-07-21. La Tarea 2 cambia el contenido de las tarjetas OG, y las cachés sociales indexan por URL: si el `?v=` no se mueve, el mundo sigue viendo la tarjeta vieja. La versión se deriva de `verifiedAt`, así que primero se re-verifica de verdad y después se actualiza la fecha.

**Files:**
- Modify: `src/content/work.ts` — el campo `verifiedAt` de las 8 entradas de `sources[]`
- Modify: `scripts/verify-build-output.mjs:12` — `workSocialVersion`
- Modify: `scripts/verify-http-contracts.mjs:23-27` — el `?v=` de las 5 URLs de OG

**Interfaces:**
- Consumes: nada.
- Produces: todos los perfiles quedan con `verifiedAt: "2026-08-11"`, lo que hace que `getWorkSocialImageUrl()` devuelva `?v=2026-08-11` para los cinco keys.

- [ ] **Step 1: Comprobar que las ocho fuentes siguen vivas y siguen sosteniendo lo que dicen**

Las ocho URLs, con lo que cada una tiene que seguir sosteniendo (campo `supports` de `work.ts`):

| URL | Tiene que seguir mostrando |
|---|---|
| `https://tribai.co/` | Producto público, enfoque tributario, consulta, fuentes, vigencia, herramientas |
| `https://tribai.co/asistente` | El asistente tributario, públicamente accesible |
| `https://gobia.co/` | Producto, atribución a INPLUX, piloto, demo disponible |
| `https://www.gobia.co/demo` | El mapa y el centro de mando fiscal |
| `https://kelsen.io/` | Capacidades de análisis, redacción, monitoreo y trazabilidad |
| `https://kelsen.io/explorador?vigencia=modificado` | Biblioteca legal, búsqueda, filtros, resultados |
| `https://laudos.co/` | Objeto del producto y beta abierta |
| `https://laudos.co/?view=predecir` | El formulario de análisis arbitral |

Usar WebFetch sobre cada una preguntando explícitamente si sigue mostrando lo que la columna derecha dice.

⚠️ **Si alguna no lo sostiene, PARAR y reportar.** No se actualiza una fecha de verificación sobre una fuente que ya no dice lo que decía: eso convierte la disciplina de evidencia en un sello de goma. La salida correcta es corregir el `supports` o cambiar la fuente, y eso es una decisión, no un paso.

- [ ] **Step 2: Actualizar las ocho fechas**

En `src/content/work.ts`, las ocho apariciones de:

```ts
        verifiedAt: "2026-07-21",
```

pasan a:

```ts
        verifiedAt: "2026-08-11",
```

- [ ] **Step 3: Mover las dos constantes de versión**

`scripts/verify-build-output.mjs`, línea 12:

```js
const workSocialVersion = "2026-08-11";
```

`scripts/verify-http-contracts.mjs`, líneas 23–27:

```js
  "/api/og/trabajo/directorio?v=2026-08-11",
  "/api/og/trabajo/tribai?v=2026-08-11",
  "/api/og/trabajo/gobia?v=2026-08-11",
  "/api/og/trabajo/kelsen?v=2026-08-11",
  "/api/og/trabajo/laudos?v=2026-08-11",
```

Las dos constantes **son la misma fecha**. Si se mueve una sola, `check:http` falla con un 404 en las cinco URLs.

- [ ] **Step 4: Verificar**

```bash
npm run build
```
Esperado: `check:content` aprobado, `next build` sin errores, `check:output` sin diferencias de sitemap ni de metadatos.

```bash
npm run start &   # o -p 3210 si 3000 está tomado
npm run check:http
```
Esperado: las cinco URLs de OG responden 200 con `?v=2026-08-11`.

- [ ] **Step 5: Commit**

```bash
git add src/content/work.ts scripts/verify-build-output.mjs scripts/verify-http-contracts.mjs
git commit -m "chore(trabajo): re-verificar las ocho fuentes de los perfiles

Las fuentes se habían revisado el 21-jul-2026. Se comprobó que las ocho
siguen vivas y siguen mostrando lo que su campo supports declara, y se
movió verifiedAt a 2026-08-11.

Eso mueve la versión derivada de las tarjetas OG, así que se sincronizan
las dos constantes que la fijan a mano en los verificadores."
```

---

### Tarea 2: Tribai y Kelsen pasan a «Solución de INPLUX»

**Files:**
- Modify: `src/content/work.ts` — `attribution` de Tribai (~línea 74) y de Kelsen (~línea 232); `description` de ambos
- Modify: `src/app/trabajo/page.tsx` — metadatos, JSON-LD, copy del hero y del ledger
- Modify: `src/app/api/og/trabajo/social-card.ts` — `eyebrow` de perfil y textos del directorio
- Modify: `scripts/verify-build-output.mjs:16-52` — `attribution` y `socialAlt` de Tribai y Kelsen; `description` de `/trabajo` (~línea 152)

**Interfaces:**
- Consumes: `verifiedAt: "2026-08-11"` de la Tarea 1.
- Produces: `workProfiles.every(p => p.attribution.state === "confirmed") === true`. Las láminas de producto del deck (Tarea 14) leen `attribution.label` sin ramificar.

- [ ] **Step 1: Voltear la atribución en `work.ts`**

Tribai:

```ts
    attribution: {
      state: "confirmed",
      label: "Solución de INPLUX",
      statement:
        "INPLUX desarrolla Tribai. Este perfil documenta el producto y sus capacidades públicas, sin convertir esa autoría en una afirmación de resultados.",
    },
```

Kelsen:

```ts
    attribution: {
      state: "confirmed",
      label: "Solución de INPLUX",
      statement:
        "INPLUX desarrolla Kelsen. Este perfil documenta el producto y sus capacidades públicas, sin convertir esa autoría en una afirmación de resultados.",
    },
```

Y la última frase de sus `description`, que hoy niega la atribución, sale. En Tribai:

```ts
    description:
      "Tribai reúne consulta y herramientas tributarias en un entorno orientado a revisar el sustento y la vigencia de la información.",
```

En Kelsen:

```ts
    description:
      "Kelsen presenta capacidades para investigar, analizar, redactar y monitorear trabajo jurídico conservando trazabilidad.",
```

`sources[]`, `partners`, `capabilities`, `interface` y `status` **no se tocan**. Laudos y Gobia tampoco.

- [ ] **Step 2: Actualizar la tarjeta social**

`src/app/api/og/trabajo/social-card.ts`. El tipo `ProfileSocialCard` ya no necesita dos valores de `eyebrow`:

```ts
  eyebrow: "TRABAJO ATRIBUIBLE";
```

y en `getWorkSocialCard`, la rama de perfil:

```ts
    eyebrow: "TRABAJO ATRIBUIBLE",
    category: profile.category,
    status: profile.status.label,
    attribution: profile.attribution.label,
```

En la rama de directorio, los dos textos que hablan del ecosistema observado:

```ts
      title: "Trabajo y productos",
      description:
        "Cuatro productos, cada uno con sus fuentes públicas y su fecha de verificación.",
      eyebrow: "DIRECTORIO / EVIDENCIA",
      status: `${workProfiles.length} PERFILES DOCUMENTADOS`,
      attribution: "CADA DATO CON SU FUENTE",
```

`confirmedCount` y `observedCount` se conservan: los calcula desde `work.ts` y ahora dan 4 y 0, que es correcto.

- [ ] **Step 3: Actualizar `/trabajo`**

`src/app/trabajo/page.tsx`. Los metadatos:

```ts
export const metadata: Metadata = {
  title: "Trabajo y productos — evidencia y atribución",
  description:
    "Los cuatro productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
```

```ts
const workSocialDescription =
  "Cuatro productos documentados, cada uno con sus fuentes públicas y su fecha de verificación.";
const workSocialImageAlt =
  "INPLUX, directorio de trabajo y productos con fuentes verificadas";
```

El JSON-LD:

```ts
  description:
    "Directorio de los productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
```

El hero:

```tsx
                  <h1 id="work-title">
                    Cada producto, <em>con su fuente.</em>
                  </h1>
                  <p className={styles.heroLead}>
                    Publicamos lo que cada producto muestra en su sitio oficial, con la
                    fecha en que lo revisamos. Nada de lo que aparece aquí depende de
                    que nos creas.
                  </p>
```

El ledger pierde la partición y gana la fecha, que es el dato que ahora trabaja:

```tsx
                <div className={styles.heroLedger} aria-label="Resumen del directorio">
                  <p>REGISTRO / 2026.08</p>
                  <div>
                    <strong>{workProfiles.length}</strong>
                    <span>productos documentados</span>
                  </div>
                  <div>
                    <strong>{sourceCount}</strong>
                    <span>fuentes públicas citadas</span>
                  </div>
                  <div>
                    <strong>{lastVerified}</strong>
                    <span>última verificación</span>
                  </div>
                  <small>
                    Cada perfil conserva sus fuentes y la fecha en que se revisaron.
                  </small>
                </div>
```

Con los dos cálculos, arriba del componente, reemplazando a `attributedProfiles` y `observedProfiles`:

```tsx
export default function TrabajoPage() {
  const sourceCount = workProfiles.reduce(
    (total, profile) => total + profile.sources.length,
    0,
  );
  const lastVerified = workProfiles
    .flatMap((profile) => profile.sources.map((source) => source.verifiedAt))
    .reduce((latest, date) => (date > latest ? date : latest), "0000-00-00");
```

Y la banda de evidencia, que hoy dice «qué es y qué no es»:

```tsx
                <h2 id="evidence-title">
                  Cada pantalla dice <em>de dónde salió.</em>
                </h2>
                <p>
                  Son capturas estáticas de páginas públicas oficiales; la experiencia
                  interactiva se abre en el sitio fuente. Cada perfil conserva sus
                  fuentes y su fecha de revisión.
                </p>
```

- [ ] **Step 4: Actualizar el contrato de salida**

`scripts/verify-build-output.mjs`. Tribai y Kelsen en el arreglo `workProfiles` (líneas 16–52):

```js
  {
    slug: "tribai",
    name: "Tribai",
    shortDescription:
      "Consulta tributaria con fuentes, vigencia y herramientas visibles.",
    status: "Producto público",
    attribution: "Solución de INPLUX",
    socialAlt: "Tribai: Producto público. Solución de INPLUX.",
  },
```

```js
  {
    slug: "kelsen",
    name: "Kelsen",
    shortDescription:
      "Análisis, redacción y monitoreo jurídico con trazabilidad.",
    status: "Explorador público",
    attribution: "Solución de INPLUX",
    socialAlt: "Kelsen: Explorador público. Solución de INPLUX.",
  },
```

Y la `description` de `/trabajo` (~línea 152), que tiene que quedar **idéntica** a la del Step 3:

```js
    description:
      "Los cuatro productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
```

⚠️ Si `ogDescription`, `twitterDescription`, `ogImageAlt` o `twitterImageAlt` de `/trabajo` también citan el ecosistema observado, van con el mismo texto del Step 3. `check:output` compara cadena por cadena y dice cuál difiere.

- [ ] **Step 5: Verificar**

```bash
npm run check
```
Esperado: verde. Si `check:output` reporta una diferencia de metadatos, es una cadena que quedó desincronizada entre `page.tsx` y el verificador: se alinean y se repite.

- [ ] **Step 6: Comprobar a ojo las tres páginas**

```bash
npm run dev -- -p 3210
```
Abrir `/trabajo`, `/trabajo/tribai` y `/trabajo/kelsen`. En las tres tiene que decir **Solución de INPLUX**, y en ninguna puede quedar rastro de la partición entre atribuible y observado.

- [ ] **Step 7: Commit y PR**

```bash
git add src/content/work.ts src/app/trabajo/page.tsx src/app/api/og/trabajo/social-card.ts scripts/verify-build-output.mjs
git commit -m "fix(trabajo): Tribai y Kelsen se publican como solución de INPLUX

Los dos perfiles figuraban como atribución pública no confirmada, que
describía el estado de las fuentes revisadas en julio, no la autoría.
INPLUX desarrolla los dos, así que el sitio lo dice.

Con los cuatro productos confirmados, el directorio deja de partirse
entre trabajo atribuible y ecosistema observado; lo que queda de la
disciplina de evidencia es lo que siempre la sostuvo, que cada
afirmación lleve su fuente pública y su fecha de verificación."
git push -u origin fix/atribucion-tribai-kelsen
```

Abrir PR, revisar el preview de Vercel, mergear.

---

# FASE 1 — Andamiaje del deck

Rama: `feat/deck`, desde `main` ya con F0.5 dentro.

---

### Tarea 3: Modelo de datos y prueba de perfil huérfano

**Files:**
- Create: `src/content/deck.ts`
- Create: `src/content/deck.copy.ts`
- Create: `scripts/verify-deck-model.test.mjs`
- Modify: `package.json` — script `test:deck`

**Interfaces:**
- Consumes: `workProfiles` de `src/content/work.ts`.
- Produces:
  - `SLIDES: readonly DeckSlide[]` — 15 entradas, `n` de 1 a 15
  - `TOTAL_SLIDES: number` — 14
  - `DeckSlideKind` — unión de 11 literales
  - `getSlideById(id: string): DeckSlide | undefined`
  - `DECK_COPY` de `deck.copy.ts`
  - `DECK_SOURCES: readonly DeckSource[]`

- [ ] **Step 1: Escribir la prueba que falla**

`scripts/verify-deck-model.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El modelo es TypeScript; se compila a un módulo temporal para poder
// interrogarlo desde node:test sin arrastrar un runner nuevo al repo.
function loadDeck() {
  const result = spawnSync(
    "npx",
    ["tsx", "--eval", `
      import { SLIDES, TOTAL_SLIDES } from "./src/content/deck.ts";
      import { workProfiles } from "./src/content/work.ts";
      process.stdout.write(JSON.stringify({
        total: TOTAL_SLIDES,
        ids: SLIDES.map((s) => s.id),
        kinds: SLIDES.map((s) => s.kind),
        numbers: SLIDES.map((s) => s.n),
        productSlugs: SLIDES.filter((s) => s.kind === "producto").map((s) => s.perfil.slug),
        profileSlugs: workProfiles.map((p) => p.slug),
      }));
    `],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar el modelo:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("cada perfil de work.ts tiene su lámina de producto", () => {
  const deck = loadDeck();
  assert.deepEqual(
    [...deck.productSlugs].sort(),
    [...deck.profileSlugs].sort(),
    "un perfil se quedó sin lámina, o una lámina apunta a un perfil inexistente",
  );
});

test("el deck tiene 15 láminas numeradas de 1 a 15 sin huecos", () => {
  const deck = loadDeck();
  assert.equal(deck.total, 15);
  assert.deepEqual(deck.numbers, Array.from({ length: 15 }, (_, i) => i + 1));
});

test("ningún id se repite", () => {
  const deck = loadDeck();
  assert.equal(new Set(deck.ids).size, deck.ids.length);
});

test("ningún arquetipo estructural se repite en láminas contiguas", () => {
  const deck = loadDeck();
  // Las cuatro fichas de producto repiten a propósito: son una serie.
  const kinds = deck.kinds;
  for (let i = 1; i < kinds.length; i += 1) {
    if (kinds[i] === "producto" && kinds[i - 1] === "producto") continue;
    assert.notEqual(kinds[i], kinds[i - 1], `las láminas ${i} y ${i + 1} comparten kind`);
  }
});
```

- [ ] **Step 2: Instalar `tsx` y registrar el script**

```bash
npm install --save-dev tsx
```

En `package.json`, dentro de `scripts`, después de `test:hero-inspector`:

```json
    "test:deck": "node --test scripts/verify-deck-model.test.mjs",
```

y en `check`, que pasa a ser:

```json
    "check": "npm run lint && npm run test:hero-inspector && npm run test:deck && npm run build && npm run check:http"
```

- [ ] **Step 3: Correr la prueba y verla fallar**

```bash
npm run test:deck
```
Esperado: FAIL — `no se pudo cargar el modelo`, porque `src/content/deck.ts` no existe.

- [ ] **Step 4: Escribir el copy**

`src/content/deck.copy.ts`. Toda la letra del deck vive aquí, con la forma de `src/content/copy/es.ts`, para que añadir inglés sea rellenar un objeto gemelo:

```ts
export type DeckSource = {
  label: string;
  url: string;
  supports: string;
  verifiedAt: `${number}-${number}-${number}`;
};

export const DECK_SOURCES = [
  {
    label: "Flyvbjerg y Budzier, Why Your IT Project May Be Riskier than You Think",
    url: "https://arxiv.org/abs/1304.0265",
    supports:
      "Muestra de 1.471 proyectos de TI; sobrecosto promedio de 27 %; uno de cada seis con 200 % de sobrecosto y casi 70 % de sobreplazo.",
    verifiedAt: "2026-08-11",
  },
] as const satisfies readonly DeckSource[];

export const DECK_COPY = {
  portada: {
    eyebrow: "INPLUX / FÁBRICA DE SOFTWARE",
    titulo: ["De un problema real", "a software en producción."],
    bajada:
      "La IA acelera el trabajo. Personas expertas dirigen y validan las decisiones críticas.",
  },
  problema: {
    pregunta: "¿Por qué el software a la medida se sale de cauce tan seguido?",
    respuesta: "El promedio no es el riesgo.",
    cifra: { valor: 200, sufijo: " %", antetitulo: "1 de cada 6", pie: "proyectos de TI se sale" },
    cuerpo:
      "El sobrecosto promedio de un proyecto de TI es del 27 %, y con ese número se puede vivir. El problema está en la cola: uno de cada seis se va al 200 % y arrastra casi 70 % de sobreplazo.",
    fuente: DECK_SOURCES[0],
  },
  tesis: {
    pregunta: "¿Dónde se decide si un proyecto va a funcionar?",
    respuesta: "El software empieza en el problema, no en el requisito.",
    cuerpo:
      "Un requisito escrito antes de entender el problema no es un plan: es una apuesta con forma de documento. Nosotros empezamos por hablar con quien hace el trabajo.",
  },
  metodo: {
    pregunta: "¿Cómo trabajamos?",
    respuesta: "Cuatro tiempos, y ninguno se salta.",
  },
  espejo: {
    pregunta: "¿Y esto cómo se ve desde mi lado?",
    respuesta: "El mismo método, dos lecturas.",
    columnas: {
      empresa: {
        titulo: "Empresa",
        filas: [
          "Quién decide y con qué información",
          "Qué versión mínima es útil este trimestre",
          "Se integra con lo que ya opera",
          "Se observa el uso real y se ajusta",
        ],
      },
      entidad: {
        titulo: "Entidad",
        filas: [
          "Qué obliga la norma y quién responde",
          "Qué alcance es defendible y trazable",
          "Deja rastro de cada decisión",
          "Se entrega documentado y auditable",
        ],
      },
    },
  },
  evidencia: {
    pregunta: "¿Por qué habría de creerle a una fábrica de software?",
    respuesta: "Trece cosas que este sitio no puede decir.",
    cuerpo: "No es una guía de estilo. Es una prueba automática.",
    remate: "Si alguien las escribe, el sitio no compila.",
  },
  puente: {
    pregunta: "¿Ustedes son de un sector?",
    respuesta: "Cinco dominios distintos. La misma fábrica.",
  },
  capacidades: {
    pregunta: "¿Qué comparten los cuatro por dentro?",
    respuesta: "La fábrica es la misma; cambia el dominio.",
  },
  comoEmpezamos: {
    pregunta: "¿Y con lo mío?",
    respuesta: "Los mismos cuatro tiempos, aplicados a tu reto.",
  },
  cierre: {
    respuesta: "Cuéntanos el problema.",
    correo: "gerencia@inplux.co",
    ciudad: "Medellín, Colombia",
  },
} as const;
```

⚠️ Ninguna de estas cadenas puede contener una promesa de plazo. `este trimestre` es un marco de decisión del cliente, no un compromiso de entrega nuestro, y no coincide con el patrón bloqueado — que solo cubre `en días` y `en semanas`. Si alguien lo reescribe, que no lo haga hacia una promesa.

- [ ] **Step 5: Escribir el modelo**

`src/content/deck.ts`:

```ts
import { workProfiles } from "./work";
import { DECK_COPY, DECK_SOURCES } from "./deck.copy";

export { DECK_COPY, DECK_SOURCES };

export type DeckSlideKind =
  | "portada"
  | "problema"
  | "tesis"
  | "metodo"
  | "espejo"
  | "evidencia"
  | "puente"
  | "producto"
  | "capacidades"
  | "como-empezamos"
  | "cierre";

type WorkProfileEntry = (typeof workProfiles)[number];

export type DeckSlide =
  | { n: number; id: string; kind: Exclude<DeckSlideKind, "producto">; titulo: string }
  | { n: number; id: string; kind: "producto"; titulo: string; perfil: WorkProfileEntry };

const APERTURA = [
  { id: "portada", kind: "portada", titulo: "De un problema real a software en producción" },
  { id: "problema", kind: "problema", titulo: "El promedio no es el riesgo" },
  { id: "tesis", kind: "tesis", titulo: "El software empieza en el problema" },
  { id: "metodo", kind: "metodo", titulo: "Cuatro tiempos" },
  { id: "espejo", kind: "espejo", titulo: "El mismo método, dos lecturas" },
  { id: "evidencia", kind: "evidencia", titulo: "Trece cosas que este sitio no puede decir" },
  { id: "puente", kind: "puente", titulo: "Cinco dominios, la misma fábrica" },
] as const;

const CIERRE = [
  { id: "capacidades", kind: "capacidades", titulo: "La fábrica por dentro" },
  { id: "como-empezamos", kind: "como-empezamos", titulo: "Los cuatro tiempos, con tu reto" },
  { id: "cierre", kind: "cierre", titulo: "Cuéntanos el problema" },
] as const;

function construir(): DeckSlide[] {
  const slides: DeckSlide[] = [];
  let n = 0;

  for (const entrada of APERTURA) {
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  // El orden de los productos es el de work.ts. Una sola fuente para el
  // orden: reordenar allí mueve el deck y /trabajo a la vez.
  for (const perfil of workProfiles) {
    n += 1;
    slides.push({ n, id: perfil.slug, kind: "producto", titulo: perfil.name, perfil });
  }

  for (const entrada of CIERRE) {
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  return slides;
}

export const SLIDES: readonly DeckSlide[] = construir();
export const TOTAL_SLIDES = SLIDES.length;

export function getSlideById(id: string): DeckSlide | undefined {
  return SLIDES.find((slide) => slide.id === id);
}
```

- [ ] **Step 6: Correr la prueba y verla pasar**

```bash
npm run test:deck
```
Esperado: PASS × 4.

- [ ] **Step 7: Commit**

```bash
git add src/content/deck.ts src/content/deck.copy.ts scripts/verify-deck-model.test.mjs package.json package-lock.json
git commit -m "feat(deck): modelo de datos generado desde los perfiles

Las láminas de producto no se escriben a mano: se generan recorriendo
workProfiles, así que añadir o quitar un producto renumera el deck solo
y no deja una segunda copia de la atribución.

La prueba de perfil huérfano falla si un perfil se queda sin lámina; en
el deck de Tensor esa misma comprobación atrapó un producto suelto."
```

---

### Tarea 4: Las dos rutas, en blanco, atravesando las tres puertas

Registrar una ruta en este repo toca tres verificadores. Se hace **antes** de tener contenido, porque descubrir el contrato con 15 láminas encima cuesta el triple.

**Files:**
- Create: `src/app/deck/page.tsx`
- Create: `src/app/deck/presentacion/page.tsx`
- Modify: `scripts/verify-build-output.mjs` — `pageDefinitions` y `expectedSitemapUrls`
- Modify: `scripts/verify-http-contracts.mjs` — dos rutas más
- Modify: `src/app/sitemap.ts` (si el sitemap enumera rutas a mano)

**Interfaces:**
- Consumes: `SLIDES`, `TOTAL_SLIDES` de la Tarea 3.
- Produces: `/deck` y `/deck/presentacion` responden 200 y aparecen en el sitemap en las posiciones 15 y 16.

- [ ] **Step 1: Leer cómo se genera el sitemap**

```bash
cat src/app/sitemap.ts
```
El orden de `expectedSitemapUrls` en el verificador se compara **posición por posición**. Las dos rutas nuevas tienen que ir en el sitemap en el mismo lugar en que se declaren en el verificador.

- [ ] **Step 2: Las dos páginas mínimas**

`src/app/deck/presentacion/page.tsx`:

```tsx
import type { Metadata } from "next";
import { SLIDES } from "@/content/deck";

export const metadata: Metadata = {
  title: "Presentación — de un problema real a software en producción",
  description:
    "Cómo INPLUX convierte un problema concreto en software que funciona en producción, en quince láminas.",
  alternates: { canonical: "https://inplux.co/deck/presentacion" },
};

export default function PresentacionPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {SLIDES.map((slide) => (
        <section key={slide.id} data-slide={slide.id} aria-label={slide.titulo}>
          <h2>{slide.titulo}</h2>
        </section>
      ))}
    </main>
  );
}
```

`src/app/deck/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SLIDES } from "@/content/deck";

export const metadata: Metadata = {
  title: "Deck — de un problema real a software en producción",
  description:
    "El índice de la presentación de INPLUX: la tesis, el método, los cuatro productos y sus fuentes.",
  alternates: { canonical: "https://inplux.co/deck" },
};

export default function DeckPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>De un problema real a software en producción</h1>
      <Link href="/deck/presentacion">Ver la presentación</Link>
      <ol>
        {SLIDES.map((slide) => (
          <li key={slide.id}>
            <Link href={`/deck/presentacion#${slide.id}`}>{slide.titulo}</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
```

- [ ] **Step 3: Registrar en `verify-build-output.mjs`**

En `pageDefinitions`, dos entradas nuevas con la misma forma que las existentes:

```js
  deck: {
    file: ".next/server/app/deck.html",
    title: "Deck — de un problema real a software en producción | INPLUX",
    description:
      "El índice de la presentación de INPLUX: la tesis, el método, los cuatro productos y sus fuentes.",
    canonical: `${siteUrl}/deck`,
  },
  deckPresentacion: {
    file: ".next/server/app/deck/presentacion.html",
    title:
      "Presentación — de un problema real a software en producción | INPLUX",
    description:
      "Cómo INPLUX convierte un problema concreto en software que funciona en producción, en quince láminas.",
    canonical: `${siteUrl}/deck/presentacion`,
  },
```

⚠️ El `title` que el verificador compara es el **renderizado**, con el sufijo de plantilla que `src/app/layout.tsx` añade. Leer ahí la `title.template` antes de escribir la cadena; si no coincide, `check:output` dice exactamente qué encontró.

Y en `expectedSitemapUrls`, **después de `/trabajo/porkia`**, que es la última ruta de producto desde que Porkia entró al portafolio:

```js
    `${siteUrl}/deck`,
    `${siteUrl}/deck/presentacion`,
```

⚠️ La comparación es **posicional** (`verify-build-output.mjs`, `expectedSitemapUrls.forEach` con `expectEqual(urls[index], …)`). Insertarlas en otro sitio rompe `check:output`. **Lee el orden real del sitemap construido antes de escribir**, no te fíes de esta indicación: el orden ya cambió una vez.

- [ ] **Step 4: Registrar en `verify-http-contracts.mjs`**

```js
  ["/deck", 200],
  ["/deck/presentacion", 200],
```

- [ ] **Step 5: Verificar**

```bash
npm run check
```
Esperado: verde, con el sitemap en 16 URLs.

Si `check:output` dice `sitemap cantidad de URLs: esperaba 16, encontró 14`, el sitemap no se generó con las rutas: falta declararlas en `src/app/sitemap.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/app/deck scripts/verify-build-output.mjs scripts/verify-http-contracts.mjs src/app/sitemap.ts
git commit -m "feat(deck): registrar /deck y /deck/presentacion en las tres puertas

Las rutas entran vacías y con las quince secciones en blanco, para
descubrir el contrato de sitemap, metadatos y HTTP antes de que haya
contenido encima. El sitemap pasa de 14 a 16 URLs."
```

---

### Tarea 5: El riel de dos slots y la navegación

**Files:**
- Create: `src/components/deck/useDeckNav.ts`
- Create: `src/components/deck/PresentationDeck.client.tsx`
- Create: `src/components/deck/deck.module.css`
- Create: `src/components/deck/SlideRenderer.tsx`
- Create: `src/components/deck/Slide.tsx`
- Modify: `src/app/deck/presentacion/page.tsx`

**Interfaces:**
- Consumes: `SLIDES`, `TOTAL_SLIDES`, `DeckSlide`, `getSlideById`.
- Produces:
  - `useDeckNav(): { indice: number; slide: DeckSlide; direccion: 1 | -1; secuencia: number; ir(n: number): void; siguiente(): void; anterior(): void }`
  - `<Slide id kind titulo children>` — pinta `<section data-slide>` con la retícula
  - `<SlideRenderer slide />` — `switch` sin `default`

- [ ] **Step 1: El hook de navegación**

`src/components/deck/useDeckNav.ts`:

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, TOTAL_SLIDES, type DeckSlide } from "@/content/deck";

function indiceDesdeHash(hash: string): number {
  const id = hash.replace(/^#/, "");
  const encontrado = SLIDES.findIndex((slide) => slide.id === id);
  return encontrado === -1 ? 0 : encontrado;
}

export type DeckNav = {
  indice: number;
  slide: DeckSlide;
  direccion: 1 | -1;
  secuencia: number;
  ir: (n: number) => void;
  siguiente: () => void;
  anterior: () => void;
};

// Un solo objeto de estado. Índice, dirección y secuencia cambian
// SIEMPRE juntos, así que separarlos en tres useState obligaría a llamar
// un setState dentro del updater de otro — que React invoca dos veces en
// StrictMode y desincroniza la dirección de la transición.
type Estado = { indice: number; direccion: 1 | -1; secuencia: number };

export function useDeckNav(): DeckNav {
  // Arranca siempre en 0 para que servidor y primer render del cliente
  // coincidan. El hash se aplica en el efecto, ya hidratado.
  const [estado, setEstado] = useState<Estado>({ indice: 0, direccion: 1, secuencia: 0 });

  const ir = useCallback((n: number) => {
    setEstado((actual) => {
      const destino = Math.max(0, Math.min(TOTAL_SLIDES - 1, n));
      if (destino === actual.indice) return actual;
      return {
        indice: destino,
        direccion: destino > actual.indice ? 1 : -1,
        secuencia: actual.secuencia + 1,
      };
    });
  }, []);

  const mover = useCallback((delta: 1 | -1) => {
    setEstado((actual) => {
      const destino = Math.max(0, Math.min(TOTAL_SLIDES - 1, actual.indice + delta));
      if (destino === actual.indice) return actual;
      return { indice: destino, direccion: delta, secuencia: actual.secuencia + 1 };
    });
  }, []);

  const siguiente = useCallback(() => mover(1), [mover]);
  const anterior = useCallback(() => mover(-1), [mover]);

  // El hash se escribe en un efecto, no dentro del updater: history es un
  // efecto de fuera de React y no puede vivir en una función pura.
  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) { primerRender.current = false; return; }
    window.history.replaceState(null, "", `#${SLIDES[estado.indice].id}`);
  }, [estado.indice]);

  useEffect(() => {
    if (window.location.hash) ir(indiceDesdeHash(window.location.hash));
    const alCambiarHash = () => ir(indiceDesdeHash(window.location.hash));
    window.addEventListener("hashchange", alCambiarHash);
    return () => window.removeEventListener("hashchange", alCambiarHash);
  }, [ir]);

  useEffect(() => {
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.metaKey || evento.ctrlKey || evento.altKey) return;
      switch (evento.key) {
        case "ArrowRight": case "PageDown": case " ": evento.preventDefault(); siguiente(); break;
        case "ArrowLeft": case "PageUp": evento.preventDefault(); anterior(); break;
        case "Home": evento.preventDefault(); ir(0); break;
        case "End": evento.preventDefault(); ir(TOTAL_SLIDES - 1); break;
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [siguiente, anterior, ir]);

  return {
    indice: estado.indice,
    slide: SLIDES[estado.indice],
    direccion: estado.direccion,
    secuencia: estado.secuencia,
    ir,
    siguiente,
    anterior,
  };
}
```

⚠️ `useState(0)` y no `indiceDesdeHash(location.hash)`: leer `window` durante el render rompe el SSR y, si no, la hidratación. El hash se aplica en el primer efecto.

- [ ] **Step 2: El riel**

`src/components/deck/PresentationDeck.client.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { SLIDES, TOTAL_SLIDES } from "@/content/deck";
import { SlideRenderer } from "./SlideRenderer";
import { useDeckNav } from "./useDeckNav";
import styles from "./deck.module.css";

// `motivos` llega desde la ruta, que es un componente de servidor y los
// lee del verificador en build. Un componente async NO se puede
// renderizar desde un componente cliente, así que la lectura vive
// arriba del límite y baja como prop. Ver la Tarea 12.
export function PresentationDeck({ motivos }: { motivos: readonly string[] }) {
  const nav = useDeckNav();
  const inicioTactil = useRef<number | null>(null);

  return (
    <div
      className={styles.riel}
      data-direccion={nav.direccion === 1 ? "adelante" : "atras"}
      onTouchStart={(e) => { inicioTactil.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (inicioTactil.current === null) return;
        const recorrido = e.changedTouches[0].clientX - inicioTactil.current;
        if (Math.abs(recorrido) > 60) recorrido < 0 ? nav.siguiente() : nav.anterior();
        inicioTactil.current = null;
      }}
    >
      {/* Dos slots, no una lista. Montar las quince haría que todas las
          animaciones de entrada terminaran antes de que nadie las viera. */}
      <div className={styles.slot} key={`activa-${nav.secuencia}`}>
        <SlideRenderer slide={nav.slide} motivos={motivos} />
      </div>

      <p className={styles.contadorLaminas} aria-live="polite">
        {nav.indice + 1} / {TOTAL_SLIDES}
      </p>

      <button type="button" onClick={nav.anterior} disabled={nav.indice === 0}>
        Lámina anterior
      </button>
      <button type="button" onClick={nav.siguiente} disabled={nav.indice === TOTAL_SLIDES - 1}>
        Lámina siguiente
      </button>

      {/* Sin JS, o antes de hidratar, las quince láminas siguen siendo
          texto navegable: el deck se puede leer y se puede indexar. */}
      <noscript>
        {SLIDES.map((slide) => (
          <section key={slide.id} data-slide={slide.id} aria-label={slide.titulo}>
            <h2>{slide.titulo}</h2>
          </section>
        ))}
      </noscript>
    </div>
  );
}
```

- [ ] **Step 3: La envoltura de lámina y el renderer**

`src/components/deck/Slide.tsx`:

```tsx
import type { ReactNode } from "react";
import styles from "./deck.module.css";

export function Slide({
  id, titulo, children, etiqueta,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
  etiqueta?: string;
}) {
  return (
    <section className={styles.lamina} data-slide={id} aria-label={etiqueta ?? titulo}>
      {children}
    </section>
  );
}
```

`src/components/deck/SlideRenderer.tsx`:

```tsx
import type { DeckSlide } from "@/content/deck";
import { Slide } from "./Slide";

export function SlideRenderer({
  slide,
  motivos,
}: {
  slide: DeckSlide;
  motivos: readonly string[];
}) {
  // Sin `default` a propósito: TypeScript comprueba que están cubiertos
  // todos los kind, y añadir uno sin su rama rompe el build en vez de
  // pintar un hueco en producción.
  switch (slide.kind) {
    case "portada":
    case "problema":
    case "tesis":
    case "metodo":
    case "espejo":
    case "evidencia":
    case "puente":
    case "capacidades":
    case "como-empezamos":
    case "cierre":
      return <Slide id={slide.id} titulo={slide.titulo}><h2>{slide.titulo}</h2></Slide>;
    case "producto":
      return <Slide id={slide.id} titulo={slide.titulo}><h2>{slide.perfil.name}</h2></Slide>;
  }
}
```

- [ ] **Step 4: Montar el riel en la ruta**

`src/app/deck/presentacion/page.tsx`, reemplazando el `<main>` de la Tarea 4:

```tsx
import { PresentationDeck } from "@/components/deck/PresentationDeck.client";
import { leerMotivos } from "@/lib/banned-reasons.server";

// …metadata igual…

// La ruta es un componente de servidor: aquí, y solo aquí, se puede
// leer del disco. La Tarea 12 usa esta lista en la lámina 6.
export default async function PresentacionPage() {
  const motivos = await leerMotivos();

  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck motivos={motivos} />
    </main>
  );
}
```

⚠️ En esta tarea `leerMotivos()` todavía no existe (llega en la Tarea 12). Hasta entonces, pasar `motivos={[]}`; la lámina 6 aún no lo usa. Dejar el `async` puesto desde ya evita convertir la ruta después.

- [ ] **Step 5: Recorrer las quince a mano**

```bash
npm run dev -- -p 3210
```

En `http://localhost:3210/deck/presentacion`, comprobar: → avanza y ← retrocede; el hash cambia en cada paso; recargar en `#espejo` abre en la quinta; el contador dice `5 / 14`; un deslizamiento en móvil avanza; la consola está limpia.

- [ ] **Step 6: `npm run check` y commit**

```bash
npm run check
git add src/components/deck src/app/deck
git commit -m "feat(deck): riel de dos slots, teclado, gestos y hash

Solo hay una lámina montada más su saliente. Montar las quince haría
que las animaciones de entrada dispararan al cargar la página y no al
llegar a la lámina, que es justo lo que las hace argumentar.

El índice arranca en 0 y el hash se aplica en el primer efecto: leer
window durante el render rompería la hidratación."
```

---

### Tarea 6: El chrome del deck

**Files:**
- Create: `src/components/deck/chrome/TopBar.tsx`
- Create: `src/components/deck/chrome/ProgressRail.tsx`
- Create: `src/components/deck/chrome/IndexOverlay.client.tsx`
- Create: `src/components/deck/chrome/HelpOverlay.client.tsx`
- Create: `src/components/deck/chrome/chrome.module.css`
- Modify: `src/components/deck/PresentationDeck.client.tsx`

**Interfaces:**
- Consumes: `DeckNav` de la Tarea 5.
- Produces: constantes `ALTO_BARRA_SUPERIOR = 70` y `ALTO_BARRA_INFERIOR = 60`, exportadas desde `chrome/TopBar.tsx` y `chrome/ProgressRail.tsx`. **El arnés de la Tarea 7 las lee: si cambian aquí, cambian allá.**

- [ ] **Step 1: Barra superior y riel de progreso**

Barra superior: marca INPLUX a la izquierda, título de la lámina al centro, `n / 14` a la derecha. Alto fijo de 70 px, `position: fixed`, fondo `--off-white` con `border-bottom: 1px solid var(--border)`.

Riel de progreso: 14 segmentos de un hilo abajo, alto de banda 60 px. El segmento activo en `--teal`; los ya vistos en `--gray-400`; los pendientes en `--border`. Cada segmento es un `<button>` con `aria-label={"Ir a " + titulo}` que llama `nav.ir(i)`.

```tsx
export const ALTO_BARRA_SUPERIOR = 70;
```

```tsx
export const ALTO_BARRA_INFERIOR = 60;
```

- [ ] **Step 2: Índice y ayuda**

`IndexOverlay` se abre con `i` y lista las quince con su número y su título; al hacer clic llama `nav.ir(i)` y cierra. `HelpOverlay` se abre con `?` y lista los atajos: `→` / `←` / `espacio` / `inicio` / `fin` / `i` / `?` / `esc`.

Los dos usan `<dialog>` nativo con `showModal()`, igual que `src/components/site/ContactDialog.tsx`. Copiar de ahí el patrón de `onClose` y de foco, que ya está resuelto y verificado por `verifyContactExperience()`.

- [ ] **Step 3: Reservar el espacio de las barras**

En `deck.module.css`, la lámina vive **entre** las barras:

```css
.lamina {
  min-height: calc(100dvh - 130px);
  margin-block: 70px 60px;
  display: grid;
  place-content: center;
  padding-inline: clamp(1.5rem, 5vw, 6rem);
}
```

⚠️ `130px` es `70 + 60`. Una lámina puede caber en el viewport y quedar igual debajo de las barras: es el fallo que no se ve midiendo solo el alto, y es lo que comprueba el arnés.

- [ ] **Step 4: Verificar en los tres tamaños**

Con `npm run dev -- -p 3210`, a 1440×900, 1920×1080 y 390×844: las barras no tapan contenido, el riel de progreso es pulsable, `i` abre el índice y `esc` lo cierra.

- [ ] **Step 5: `npm run check` y commit**

```bash
npm run check
git add src/components/deck
git commit -m "feat(deck): barra superior, riel de progreso, índice y ayuda

Las dos barras miden 70 y 60 px y la lámina reserva su espacio con un
margen de bloque, no con padding del contenedor: así el arnés puede
comprobar que ninguna caja se mete debajo."
```

---

### Tarea 7: El arnés de QA

Va antes que el contenido. Un arnés escrito después de las láminas se escribe para aprobarlas.

**Files:**
- Create: `scripts/qa-deck.mjs`
- Create: `scripts/qa-reduce.mjs`
- Modify: `package.json` — `playwright` en devDependencies, scripts `qa:deck` y `qa:reduce`
- Modify: `.gitignore` — `qa-out/`

**Interfaces:**
- Consumes: `data-slide` de cada lámina; `ALTO_BARRA_SUPERIOR` / `ALTO_BARRA_INFERIOR` de la Tarea 6.
- Produces: `qa-out/<viewport>/<id>.png` y un informe por línea en stdout.

- [ ] **Step 1: Instalar Playwright**

```bash
npm install --save-dev playwright
npx playwright install chromium
```

Es la única dependencia nueva del deck, es de desarrollo y no entra al bundle.

En `package.json`:

```json
    "qa:deck": "node scripts/qa-deck.mjs",
    "qa:reduce": "node scripts/qa-reduce.mjs",
```

En `.gitignore`, una línea: `qa-out/`

- [ ] **Step 2: El arnés de medición**

`scripts/qa-deck.mjs`:

```js
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const SALIDA = "qa-out";
const IDS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["portada", "problema", "tesis", "metodo", "espejo", "evidencia", "puente"];

const VPS = [
  { n: "escritorio", width: 1440, height: 900 },
  { n: "proyector", width: 1920, height: 1080 },
  { n: "movil", width: 390, height: 844 },
];

// Se importan de `src/components/deck/chrome/altos.ts`, que no importa CSS
// justamente para que este arnés pueda leerlas. Copiarlas aquí a mano las
// deja divergir en silencio el día que el chrome cambie de alto.
import { ALTO_BARRA_SUPERIOR as BARRA_SUP, ALTO_BARRA_INFERIOR as BARRA_INF }
  from "../src/components/deck/chrome/altos.ts";

let fallos = 0;
const nav = await chromium.launch();

for (const vp of VPS) {
  await mkdir(`${SALIDA}/${vp.n}`, { recursive: true });
  const ctx = await nav.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "es-CO",
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(`PAGEERROR ${String(e).slice(0, 160)}`));
  p.on("console", (m) => m.type() === "error" && errs.push(`CONSOLE ${m.text().slice(0, 160)}`));

  for (const id of IDS) {
    await p.goto(`${BASE}/deck/presentacion#${id}`, { waitUntil: "networkidle" });
    // ⚠️ Durante la transición hay DOS [data-slide] montados: la entrante y
    // la saliente. `data-estado="activa"` vive en el SLOT, no en la section,
    // y es lo único que distingue cuál se está viendo. Medir sin ese filtro
    // devuelve la caja de la lámina equivocada la mitad de las veces —
    // contrato establecido por la Tarea 5, verificado en navegador.
    await p.waitForSelector(`[data-estado="activa"] section[data-slide="${id}"]`, { timeout: 15000 });

    // ⚠️ `waitForSelector` NO es condición de reposo. La lámina activa entra
    // con `animation-delay: 150ms` y `fill: both`: durante esos 150 ms está a
    // `opacity: 0` y lo que se ve es la SALIENTE. Medir ahí devuelve una caja
    // desplazada hasta ~3 rem. Esperar por reloj lo tapa a veces; esto no.
    await p.waitForFunction(
      () => document.getAnimations().every((a) => a.playState !== "running"),
      null,
      { timeout: 15000 },
    );

    const m = await p.evaluate(({ id, sup, inf }) => {
      const s = document.querySelector(`[data-estado="activa"] section[data-slide="${id}"]`);
      // Los hijos ocultos por breakpoint devuelven un rect en ceros y
      // contaminan el Math.min: hay que filtrarlos.
      const hijos = [...s.children].filter((c) => c.getBoundingClientRect().height > 0);
      if (hijos.length === 0) return { vacia: true };
      const cajas = hijos.map((c) => c.getBoundingClientRect());
      const top = Math.min(...cajas.map((c) => c.top));
      const bot = Math.max(...cajas.map((c) => c.bottom));
      const txt = s.innerText.replace(/\s+/g, " ").trim();
      return {
        top: Math.round(top),
        bot: Math.round(bot),
        choca: top < sup || bot > window.innerHeight - inf,
        palabras: txt ? txt.split(" ").length : 0,
        figuras: s.querySelectorAll("svg").length + s.querySelectorAll("img").length,
      };
    }, { id, sup: BARRA_SUP, inf: BARRA_INF });

    if (m.vacia) {
      console.log(`${vp.n} · ${id.padEnd(14)} ⚠️ SIN HIJOS VISIBLES`);
      fallos += 1;
    } else {
      const alerta = m.choca ? "⚠️ CHOCA CON LAS BARRAS" : "ok";
      if (m.choca) fallos += 1;
      console.log(
        `${vp.n} · ${id.padEnd(14)} ${String(m.palabras).padStart(3)} pal · ` +
        `${m.figuras} fig · caja ${m.top}→${m.bot} ${alerta}`,
      );
    }
    await p.screenshot({ path: `${SALIDA}/${vp.n}/${id}.png` });
  }

  if (errs.length) {
    console.log(`  errores (${vp.n}):`, [...new Set(errs)].slice(0, 5));
    fallos += errs.length;
  }
  await ctx.close();
}

await nav.close();
console.log(fallos ? `\n${fallos} problema(s)` : "\nsin choques ni errores");
process.exitCode = fallos ? 1 : 0;
```

⚠️ **Tres trampas de medición, las tres descubiertas ejecutando durante F1:**

1. **Con `document.visibilityState === "hidden"` nada se asienta.** La animación de la saliente queda congelada, `animationend` no dispara, la saliente sigue a `opacity: 1` ocupando el viewport y la activa a `opacity: 0`. Quedan **dos** `[data-slide]` en reposo y los píxeles visibles son los de la lámina equivocada. Playwright headless reporta `visible` y va bien; una corrida headful con la ventana en segundo plano produce exactamente el «ruido aleatorio» que este arnés existe para no generar.
2. **Un `tabId` apuntando a una pestaña no es una ventana enfocada.** En F1, una medición con la pestaña en background silenciaba las teclas **sin dar error**. Si automatizas con navegador real, activa la ventana antes de medir.
3. **`element.click()` no cambia la modalidad de entrada**, así que `:focus-visible` sigue activo y cualquier comprobación de indicador de foco da un falso positivo. Para eso hace falta un clic real (`Input.dispatchMouseEvent` por CDP).

- [ ] **Step 3: La barrera de movimiento reducido**

`scripts/qa-reduce.mjs`:

```js
import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const nav = await chromium.launch();
let fallos = 0;

for (const modo of ["reduce", "no-preference"]) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: modo,
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));

  await p.goto(`${BASE}/deck/presentacion#portada`, { waitUntil: "networkidle" });
  for (let i = 0; i < 15; i += 1) {
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(700);
  }

  console.log(`reducedMotion=${modo}:`, errs.length ? errs.slice(0, 5) : "SIN ERRORES");
  fallos += errs.length;
  await ctx.close();
}

await nav.close();
process.exitCode = fallos ? 1 : 0;
```

⚠️ **`qa:reduce` se corre contra build de producción**, no contra `dev`:

```bash
npm run build && npm run start -- -p 3210
QA_BASE=http://localhost:3210 npm run qa:reduce
```

- [ ] **Step 4: Correrlo sobre las láminas en blanco**

```bash
npm run dev -- -p 3210 &
QA_BASE=http://localhost:3210 npm run qa:deck
```

Esperado: 21 líneas (7 ids × 3 viewports), todas `ok`, con pocas palabras y 0 figuras. Es la línea base: si ya choca con las láminas vacías, el problema es el chrome, no el contenido.

- [ ] **Step 5: Commit**

```bash
git add scripts/qa-deck.mjs scripts/qa-reduce.mjs package.json package-lock.json .gitignore
git commit -m "test(deck): arnés que mide cajas, no capturas

Un arnés que solo toma capturas es ciego al texto pintado encima de
otro texto, que es justo el fallo que aparece al cambiar de tamaño.
Este mide la caja de cada lámina contra las dos barras, cuenta palabras
y figuras, y recoge los errores de consola.

Filtra los hijos con height 0: los ocultos por breakpoint devuelven un
rect en ceros y falsean cualquier Math.min sobre coordenadas."
```

---

# FASE 2 — La apertura (láminas 1 a 7)

Es el 70 % del valor del deck. Ninguna tarea de la Fase 3 empieza antes de que las siete estén verdes en el arnés.

**Criterio de aceptación, idéntico para las siete:**

- [ ] `npm run qa:deck` sin `⚠️` en 1440×900, 1920×1080 y 390×844
- [ ] ≤ 110 palabras; si pasa, revisar la jerarquía antes de cortar copy
- [ ] Al menos una figura, o una razón escrita en el commit de por qué no
- [ ] Su arquetipo no se repite en la lámina anterior ni en la siguiente
- [ ] Cero errores de consola

---

### Tarea 8: Envoltura tipográfica, portada y tesis

**Files:**
- Modify: `src/components/deck/deck.module.css`
- Create: `src/components/deck/slides/PortadaSlide.tsx`
- Create: `src/components/deck/slides/TesisSlide.tsx`
- Create: `src/components/deck/figures/MallaPortada.tsx`
- Create: `src/components/deck/figures/CurvasTesis.tsx`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `DECK_COPY` de la Tarea 3; `Slide` de la Tarea 5.
- Produces: las clases `.pregunta`, `.respuesta`, `.cuerpo`, `.pie` de `deck.module.css`, que usan **todas** las láminas siguientes.

- [ ] **Step 1: La escala tipográfica**

La jerarquía va al revés de lo obvio: la pregunta es el montaje, el titular es la **respuesta**. En `deck.module.css`:

```css
.pregunta {
  font-family: var(--font-mono);
  font-size: clamp(0.8rem, 1.1vw, 1rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-400);
  margin-bottom: clamp(1rem, 2vh, 2rem);
}

.respuesta {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: clamp(2rem, 5.2vw, 4.3rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  max-width: 22ch;
}

.cuerpo {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  line-height: 1.55;
  color: var(--text-muted, var(--gray-400));
  max-width: 58ch;
  margin-top: clamp(1rem, 2.5vh, 2rem);
}

.pie {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: auto;
  padding-top: clamp(1rem, 3vh, 2.5rem);
}
```

Medido en Tensor: bajar la pregunta de 4,1 rem a 1,6 rem y subir la respuesta de 2,1 rem a 4,3 rem permitió meter **el doble de texto pesando menos**, sin cortar una palabra. Cuando una lámina se vea cargada, mover tamaños antes que borrar copy.

- [ ] **Step 2: Portada**

Título en `--font-serif`, dos líneas de `DECK_COPY.portada.titulo`, con la segunda en `--font-serif-italic`. Bajada en `.cuerpo`. Antetítulo en `.pregunta`.

Figura de fondo: `MallaPortada` — una retícula de un solo hilo en `--border`, con cuatro nodos en `--teal` sobre la diagonal, que marcan los cuatro tiempos sin nombrarlos. `position: absolute`, `inset: 0`, `opacity: 0.5`, `aria-hidden="true"`, `pointer-events: none`.

⚠️ La opacidad vive en el SVG hijo, no en el contenedor: si mañana alguien anima el contenedor, la atenuación desaparecería.

- [ ] **Step 3: Tesis**

`.pregunta` = `DECK_COPY.tesis.pregunta`, `.respuesta` = `.respuesta`, `.cuerpo` = `.cuerpo`.

Figura `CurvasTesis`: dos curvas que salen del mismo punto. La de arriba —requisito escrito primero— sube rápido y se aplana lejos del objetivo. La de abajo —problema entendido primero— arranca más lenta y cruza a la otra. El cruce es el argumento; va marcado con un nodo hueco de contorno `--teal` y relleno `--off-white`.

⚠️ Nada de `preserveAspectRatio="none"` en un SVG con `<circle>`: al cambiar el ancho el círculo se deforma en óvalo. `viewBox` con relación fija y `max-width` explícito en el envoltorio.

- [ ] **Step 4: Conectar las dos ramas del renderer**

En `SlideRenderer.tsx`, sacar `portada` y `tesis` del grupo genérico:

```tsx
    case "portada":
      return <PortadaSlide id={slide.id} titulo={slide.titulo} />;
    case "tesis":
      return <TesisSlide id={slide.id} titulo={slide.titulo} />;
```

- [ ] **Step 5: Medir**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck portada tesis
```
Esperado: 6 líneas, todas `ok`, con ≥1 figura cada una.

- [ ] **Step 6: `npm run check` y commit**

```bash
git add src/components/deck
git commit -m "feat(deck): escala tipográfica del deck, portada y tesis

La pregunta baja a cuerpo de mono y la respuesta sube a 4,3 rem: la
jerarquía va al revés de lo obvio, porque el titular es la respuesta y
la pregunta es solo el montaje. Con eso cabe más texto pesando menos."
```

---

### Tarea 9: Lámina 2 — la cifra y su contador

La lámina que más trabaja del deck. El contador y la figura **tienen que terminar juntos**.

**Files:**
- Create: `src/components/deck/slides/ProblemaSlide.tsx`
- Create: `src/components/deck/figures/SeisBarras.tsx`
- Create: `src/components/deck/figures/seis-barras.module.css`
- Create: `src/components/deck/Contador.client.tsx`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `DECK_COPY.problema` (incluida `fuente`).
- Produces: `RITMO` y `T_CIFRA`, exportados desde `figures/SeisBarras.tsx`. El contador los importa; no se redefinen en ningún otro sitio.

- [ ] **Step 1: El compás, en un solo sitio**

En `src/components/deck/figures/SeisBarras.tsx`:

```ts
// El compás de la lámina 2 vive aquí y solo aquí. El contador se
// engancha con dos multiplicaciones para que la cifra llegue a 200
// exactamente cuando la sexta barra deja de crecer.
export const RITMO = {
  inicio: 0.35,        // s antes de que entre la primera barra
  total: 2.6,          // s de la secuencia completa
  arranqueCrecida: 0.25, // fracción de `total` en que la sexta empieza a desbordarse
  finCrecida: 0.95,      // fracción de `total` en que se detiene
} as const;

export const T_CIFRA = {
  retraso: RITMO.inicio + RITMO.arranqueCrecida * RITMO.total,
  duracion: (RITMO.finCrecida - RITMO.arranqueCrecida) * RITMO.total,
} as const;
```

- [ ] **Step 2: Las seis barras, en CSS**

Seis `<rect>` en un SVG con `viewBox` fijo. Las seis entran con el **mismo** `animation-duration` y el **mismo** `animation-delay` base; lo que las separa es un `--i` por barra que escala el retraso:

⚠️ **Dos correcciones a este CSS, las dos medidas durante la Tarea 9:**

1. **La segunda animación va `forwards`, no `both`.** Con `both`, su relleno **hacia atrás** aplica `from { scaleX(1) }` durante todo el retraso — y como `desbordar` va la última de la lista y las dos escriben `transform`, gana. Resultado: la sexta barra aparece **entera desde el fotograma 0** y nunca se la ve entrar. Medido: 177,3 px a t=0,05 s con `both`; 0 px con `forwards`.
2. **Hace falta `transform-box: fill-box`.** Sin él, `transform-origin: left center` se resuelve contra el `viewBox` y no contra la caja de la barra: la única que escala se desvía **60,8 px** (48 unidades de lienzo × 1,2664 px). Las cinco que terminan en `scaleX(1)` no se enteran, así que el defecto golpea exactamente a la barra de la que trata la lámina.

```css
.barra {
  transform-box: fill-box;
  transform-origin: left center;
  animation: entrar var(--dur) var(--ease-out) both;
  animation-delay: calc(var(--inicio) + var(--i) * 0.06s);
}

@keyframes entrar { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* La sexta es la única que sigue. Va lineal, igual que el contador. */
.barraDesbordada {
  animation:
    entrar var(--dur) var(--ease-out) both,
    desbordar var(--durCrecida) linear forwards;
  animation-delay: calc(var(--inicio) + 5 * 0.06s), var(--retrasoCrecida);
}

@keyframes desbordar { from { transform: scaleX(1); } to { transform: scaleX(3); } }

@media (prefers-reduced-motion: reduce) {
  .barra, .barraDesbordada { animation-duration: 0.01ms !important; }
}
```

⚠️ **Duración común y retraso escalado, nunca duraciones distintas por barra.** Medido en Tensor: una cascada con `duration` por celda descoordinó el contador — la cifra llegaba al final con sesenta casillas aún en pie.

⚠️ La sexta barra es un `<rect>`, no un `<circle>`, y la escala es solo en X: así el trazo no se deforma.

- [ ] **Step 3: El contador, sin trampa de hidratación**

`src/components/deck/Contador.client.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function Contador({
  hasta, retraso, duracion, sufijo = "",
}: {
  hasta: number;
  retraso: number;
  duracion: number;
  sufijo?: string;
}) {
  // Servidor y primer render del cliente pintan el valor FINAL. Por eso
  // no hay discrepancia de hidratación posible, y por eso quien tenga
  // movimiento reducido ve el dato completo desde el primer fotograma.
  const [valor, setValor] = useState(hasta);
  const nodo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    let arranque = 0;
    setValor(0);

    const paso = (ahora: number) => {
      if (!arranque) arranque = ahora;
      const t = (ahora - arranque) / 1000 - retraso;
      if (t < 0) { cuadro = requestAnimationFrame(paso); return; }
      // Lineal a propósito: una curva expo-out se lee atascada porque
      // alcanza el 99 % del valor a mitad de recorrido.
      const avance = Math.min(1, t / duracion);
      setValor(Math.round(avance * hasta));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };

    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [hasta, retraso, duracion]);

  // aria-hidden: la lámina ya declara el dato completo en su aria-label,
  // y un lector de pantalla no debe oír una cifra en movimiento.
  return <span ref={nodo} aria-hidden="true">{valor}{sufijo}</span>;
}
```

- [ ] **Step 4: La lámina**

```tsx
<Slide
  id={id}
  titulo={titulo}
  etiqueta="El promedio no es el riesgo: uno de cada seis proyectos de tecnología de la información se sale doscientos por ciento del presupuesto."
>
  <p className={styles.pregunta}>{DECK_COPY.problema.pregunta}</p>
  <p className={styles.respuesta}>{DECK_COPY.problema.respuesta}</p>
  <p className={styles.antetitulo}>{DECK_COPY.problema.cifra.antetitulo}</p>
  <p className={styles.cifra}>
    <Contador
      hasta={DECK_COPY.problema.cifra.valor}
      retraso={T_CIFRA.retraso}
      duracion={T_CIFRA.duracion}
      sufijo={DECK_COPY.problema.cifra.sufijo}
    />
  </p>
  <SeisBarras />
  <p className={styles.cuerpo}>{DECK_COPY.problema.cuerpo}</p>
  <p className={styles.pie}>
    {DECK_COPY.problema.fuente.label} · n=1.471 ·{" "}
    <a href={DECK_COPY.problema.fuente.url}>arXiv:1304.0265</a> · consultado{" "}
    {DECK_COPY.problema.fuente.verifiedAt}
  </p>
</Slide>
```

⚠️ El `etiqueta` (que va a `aria-label`) declara el dato **completo y en palabras**. Es la contraparte del `aria-hidden` del contador.

- [ ] **Step 5: Comprobar que terminan juntos**

A ojo, en `#problema`: la cifra tiene que llegar a `200 %` **en el mismo instante** en que la sexta barra deja de crecer. Si la cifra llega antes, `T_CIFRA` no está leyendo `RITMO`: alguien duplicó un número.

Con movimiento reducido (DevTools → Rendering → *Emulate prefers-reduced-motion*), la lámina muestra `200 %` y las seis barras en su posición final, sin animación.

- [ ] **Step 6: Medir y commit**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck problema
npm run check
git add src/components/deck
git commit -m "feat(deck): la lámina del uno de cada seis, con su contador acoplado

Se anima el mecanismo, no el resultado: cinco barras se detienen en su
marca y la sexta sigue creciendo. El compás vive solo en SeisBarras y el
contador se engancha con dos multiplicaciones, para que la cifra llegue
a 200 exactamente cuando la barra se detiene.

El contador va lineal —una curva expo-out se lee atascada— y renderiza
el valor final en servidor, así que no hay discrepancia de hidratación
ni cifra en movimiento para un lector de pantalla.

Fuente: Flyvbjerg y Budzier, n=1.471, arXiv:1304.0265."
```

---

### Tarea 10: Lámina 4 — el método, con el pulso

**Files:**
- Create: `src/components/deck/slides/MetodoSlide.tsx`
- Create: `src/components/deck/figures/LineaDeTiempo.tsx`
- Create: `src/components/deck/figures/linea-de-tiempo.module.css`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `method` de `src/content/home.ts` — los cuatro tiempos salen de ahí, no se reescriben.
- Produces: `LineaDeTiempo` acepta `{ pasos: readonly { number: string; title: string; copy: string }[] }`. La Tarea 15 la tiene disponible, pero **no la reutiliza**: «cómo empezamos» usa hub radial a propósito, para no repetir arquetipo.

- [ ] **Step 1: La figura**

Cuatro nodos en línea, gramática de fondo claro:

- Nodo: `<circle>` con `fill: var(--off-white)` y `stroke: var(--teal)`, `stroke-width` ≈ 6,5 % del diámetro.
- Conector: `stroke: var(--gray-400)`, `stroke-width: 0.7`, **recortado a unos puntos del borde de cada círculo** — no nace ni muere pegado al aro.
- Etiqueta del nodo en `--teal-on-soft`; descriptor secundario en `--gray-400`. Nunca negro.
- Cero rellenos sólidos, cero sombras, cero degradados, cero cajas.

⚠️ Si un texto no cabe en un nodo, se reduce el cuerpo o se parte en dos líneas. **Nunca** se agranda el círculo ni se saca la etiqueta con línea guía.

- [ ] **Step 2: El pulso**

Un `<circle>` pequeño en `--teal-bright` que recorre el conector de extremo a extremo, con `offset-path` sobre la misma trayectoria:

```css
.pulso {
  offset-path: path("M 40 60 L 560 60");
  animation: recorrer 3.2s var(--ease-out) infinite;
}
@keyframes recorrer { from { offset-distance: 0%; } to { offset-distance: 100%; } }
@media (prefers-reduced-motion: reduce) { .pulso { display: none; } }
```

⚠️ **No usar `pathLength` con `preserveAspectRatio="none"`**: la cola del trazo (~16 % del ancho) queda sin pintar. Si hiciera falta dibujar la línea, hacerlo con un `clipPath` que crece.

- [ ] **Step 3: Móvil**

Bajo 640 px la línea de tiempo cede a una lista numerada compacta, **por CSS**:

```css
@media (max-width: 640px) {
  .figura { display: none; }
  .lista { display: block; }
}
```

⚠️ Por CSS, no por rama de JavaScript: mismo DOM en los dos casos. Bajo el breakpoint las etiquetas del SVG caen por debajo de 8 px y dejan de leerse, pero el arnés mide los dos árboles — y por eso filtra los hijos de altura 0.

- [ ] **Step 4: Medir y commit**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck metodo
npm run check
git add src/components/deck
git commit -m "feat(deck): el método en cuatro tiempos, con el pulso que los recorre

Los cuatro tiempos salen de method en home.ts: el deck y el sitio dicen
lo mismo porque leen lo mismo. El pulso es la tesis literal del deck en
movimiento, y bajo 640 px la figura cede a una lista por CSS, con el
mismo DOM."
```

---

### Tarea 11: Lámina 5 — el espejo

**Files:**
- Create: `src/components/deck/slides/EspejoSlide.tsx`
- Create: `src/components/deck/figures/EspinaSimetrica.tsx`
- Create: `src/components/deck/slides/espejo.module.css`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `DECK_COPY.espejo`.
- Produces: nada que consuman otras tareas.

- [ ] **Step 1: La estructura**

Espina central vertical; a cada lado, las cuatro filas de `DECK_COPY.espejo.columnas`. Cabeceras «Empresa» y «Entidad» con el **mismo** peso y tamaño: la simetría es el argumento, y una columna más grande que la otra dice que hay una audiencia preferida.

- [ ] **Step 2: Los dos lados llegan a la vez**

```css
.fila { animation: aparecer 420ms var(--ease-out) both; }
.filaIzquierda, .filaDerecha { animation-delay: calc(0.4s + var(--i) * 0.12s); }
```

El mismo `--i` a los dos lados. Si un lado llegara antes, la lámina afirmaría una prioridad que el copy no tiene.

- [ ] **Step 3: Orden de lectura en móvil**

```css
.columna { display: contents; }
@media (min-width: 900px) { .columna { display: block; } }
```

⚠️ Sin esto la rejilla intercala las dos columnas en móvil y se lee «empresa, entidad, empresa, entidad». Con `display: contents` en el envoltorio de cada columna, el orden del DOM manda en móvil y la rejilla manda en escritorio.

- [ ] **Step 4: Comprobar el copy contra la puerta de contenido**

La columna de entidad **no puede insinuar cobertura territorial**: `alcance nacional` y `areaServed` están bloqueados. Ninguna columna promete plazos.

```bash
npm run check:content
```
Esperado: `Control editorial aprobado`.

- [ ] **Step 5: Medir y commit**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck espejo
npm run check
git add src/components/deck
git commit -m "feat(deck): la lámina espejo, empresa y entidad a la vez

El deck se presenta a los dos públicos, así que una lámina responde
'¿y esto cómo se ve desde mi lado?' para los dos sin duplicar el guion.
Los dos lados entran con el mismo retraso: si uno llegara antes, la
lámina afirmaría una prioridad que el copy no tiene."
```

---

### Tarea 12: Lámina 6 — las quince cosas

La lámina se muerde la cola: uno de sus trece motivos **es** una cadena que el propio verificador bloquea.

**Files:**
- Create: `src/lib/banned-reasons.server.ts`
- Create: `scripts/verify-deck-reasons.test.mjs`
- Create: `src/components/deck/slides/EvidenciaSlide.tsx`
- Create: `src/components/deck/slides/evidencia.module.css`
- Modify: `src/components/deck/SlideRenderer.tsx`
- Modify: `src/app/deck/presentacion/page.tsx` — sustituir `motivos={[]}` por la lectura real
- Modify: `package.json` — añadir `test:deck-reasons` a `check`

**Interfaces:**
- Consumes: `bannedPublicLanguage` de `scripts/verify-public-content.mjs`, leído como texto.
- Produces: `leerMotivos(): Promise<string[]>` desde `src/lib/banned-reasons.server.ts`.

⚠️ **`EvidenciaSlide` NO es `async` y NO lee del disco.** Recibe `motivos` como prop. `PresentationDeck` es un componente cliente, y un componente async de servidor no se puede renderizar desde uno cliente: la lectura vive en la ruta (Tarea 5, Step 4) y baja como prop.

- [ ] **Step 1: Confirmar la colisión antes de escribir nada**

```bash
node -e '
const p = /\b(?:agentic|ag[eé]ntic[oa]s?|multiagente)\b/giu;
console.log("jerga agéntica".match(p));
'
```
Esperado: `[ "agéntica" ]`.

Eso prueba que escribir los trece motivos como literales en un `.tsx` **falla el build en esa línea**. El lector de build no es una elegancia: es la única forma de construir esta lámina.

- [ ] **Step 2: La prueba que falla**

`scripts/verify-deck-reasons.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function leerMotivos() {
  const r = spawnSync(
    "npx",
    ["tsx", "--eval", `
      import { leerMotivos } from "./src/lib/banned-reasons.server.ts";
      leerMotivos().then((m) => process.stdout.write(JSON.stringify(m)));
    `],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(r.status, 0, `no se pudo leer los motivos:\n${r.stderr}`);
  return JSON.parse(r.stdout);
}

test("hay trece motivos, y el titular de la lámina dice trece", async () => {
  const motivos = leerMotivos();
  assert.equal(motivos.length, 13, "cambió el número de reglas: actualiza el titular de la lámina 6");

  const copy = await readFile(path.join(root, "src/content/deck.copy.ts"), "utf8");
  assert.match(copy, /Trece cosas que este sitio no puede decir/);
});

test("ningún motivo se coló como literal en src/", async () => {
  const motivos = leerMotivos();
  const archivos = [
    "src/components/deck/slides/EvidenciaSlide.tsx",
    "src/content/deck.copy.ts",
    "src/lib/banned-reasons.server.ts",
  ];
  for (const archivo of archivos) {
    const fuente = await readFile(path.join(root, archivo), "utf8");
    for (const motivo of motivos) {
      assert.ok(
        !fuente.includes(motivo),
        `«${motivo}» está escrito a mano en ${archivo}; tiene que venir de leerMotivos()`,
      );
    }
  }
});
```

⚠️ La segunda prueba comprueba **tres** archivos, no uno. El lector es el que más tienta a «documentar» la lista en un comentario, y un comentario también lo escanea el verificador.

- [ ] **Step 3: Verla fallar**

```bash
node --test scripts/verify-deck-reasons.test.mjs
```
Esperado: FAIL — `no se pudo leer los motivos`, porque `src/lib/banned-reasons.server.ts` no existe.

- [ ] **Step 4: El lector**

`src/lib/banned-reasons.server.ts`:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";

const origen = path.join(process.cwd(), "scripts", "verify-public-content.mjs");

/**
 * Devuelve los motivos de la lista de lenguaje bloqueado, leyéndolos del
 * verificador en tiempo de build.
 *
 * No se escriben aquí a mano —ni siquiera como ejemplo en un comentario—
 * porque uno de ellos coincide con su propio patrón bloqueado y este
 * archivo está bajo src/, que sí se escanea. Ese es el chiste de la
 * lámina 6 y también su restricción de implementación.
 */
export async function leerMotivos(): Promise<string[]> {
  const fuente = await readFile(origen, "utf8");
  const bloque = fuente
    .split("const bannedPublicLanguage = [")[1]
    ?.split("\n];")[0];

  if (!bloque) {
    throw new Error("no se encontró la lista de lenguaje bloqueado en el verificador");
  }

  return [...bloque.matchAll(/\[\s*"([^"]+)"\s*,/g)].map((m) => m[1]);
}
```

⚠️ `process.cwd()` y no una ruta relativa al módulo: en el build de Next este archivo se empaqueta y `import.meta.url` deja de apuntar a `src/lib/`.

⚠️ El sufijo `.server.ts` es una convención, no una garantía. Lo que impide que llegue al cliente es que solo lo importa la ruta, que es componente de servidor. Si alguien lo importa desde un `.client.tsx`, el build falla con `node:fs` no disponible — y ese fallo es correcto.

- [ ] **Step 5: La lámina, sincrónica, con los motivos por prop**

`EvidenciaSlide.tsx`:

```tsx
import { DECK_COPY } from "@/content/deck";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./evidencia.module.css";

export function EvidenciaSlide({
  id, titulo, motivos,
}: {
  id: string;
  titulo: string;
  motivos: readonly string[];
}) {
  return (
    <Slide
      id={id}
      titulo={titulo}
      etiqueta={`${motivos.length} reglas de lenguaje que el build de este sitio impide publicar.`}
    >
      <p className={deck.pregunta}>{DECK_COPY.evidencia.pregunta}</p>
      <p className={deck.respuesta}>{DECK_COPY.evidencia.respuesta}</p>

      <ol className={styles.registro}>
        {motivos.map((motivo, i) => (
          <li key={motivo} style={{ "--i": i } as React.CSSProperties}>
            <span className={styles.marca} aria-hidden="true">✗</span>
            <span className={styles.motivo}>{motivo}</span>
          </li>
        ))}
      </ol>

      <p className={styles.salida} aria-hidden="true">
        check:content — {motivos.length} reglas activas
      </p>
      <p className={deck.cuerpo}>{DECK_COPY.evidencia.cuerpo}</p>
      <p className={styles.remate}>{DECK_COPY.evidencia.remate}</p>
    </Slide>
  );
}
```

⚠️ **Nunca** pegar la lista en el componente. El build lo rechaza en la línea de la jerga — que es exactamente lo que la lámina está afirmando.

Y en `SlideRenderer.tsx`, la rama pasa la prop:

```tsx
    case "evidencia":
      return <EvidenciaSlide id={slide.id} titulo={slide.titulo} motivos={motivos} />;
```

Y en `src/app/deck/presentacion/page.tsx`, sustituir el `motivos={[]}` provisional de la Tarea 5 por la lectura real:

```tsx
import { leerMotivos } from "@/lib/banned-reasons.server";

export default async function PresentacionPage() {
  const motivos = await leerMotivos();
  return (
    <main id="main-content" tabIndex={-1}>
      <PresentationDeck motivos={motivos} />
    </main>
  );
}
```

- [ ] **Step 6: El log que corre**

En `evidencia.module.css`, las trece líneas entran escalonadas y la salida al final:

```css
.registro li {
  font-family: var(--font-mono);
  font-size: clamp(0.7rem, 0.95vw, 0.85rem);
  color: var(--gray-400);
  animation: linea 220ms var(--ease-out) both;
  animation-delay: calc(0.3s + var(--i) * 0.07s);
}
.marca { color: var(--teal-on-soft); }
.salida { animation-delay: calc(0.3s + 14 * 0.07s + 0.2s); }
@media (prefers-reduced-motion: reduce) {
  .registro li, .salida { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
}
```

Trece en móvil no caben en dos columnas legibles: bajo 640 px van en una sola, con `font-size` de 0,7 rem y la marca `✗` como viñeta.

- [ ] **Step 7: Verla pasar y registrar la prueba**

```bash
node --test scripts/verify-deck-reasons.test.mjs
```
Esperado: PASS × 2.

En `package.json`:

```json
    "test:deck-reasons": "node --test scripts/verify-deck-reasons.test.mjs",
```

y en `check`, entre `test:deck` y `build`:

```json
    "check": "npm run lint && npm run test:hero-inspector && npm run test:deck && npm run test:deck-reasons && npm run build && npm run check:http"
```

- [ ] **Step 8: Medir y commit**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck evidencia
npm run check
git add src/lib/banned-reasons.server.ts scripts/verify-deck-reasons.test.mjs src/components/deck src/app/deck package.json
git commit -m "feat(deck): la lámina de las quince cosas que el sitio no puede decir

Todo el mercado de fábricas de software enseña logos sin permiso y casos
sin fuente. Aquí el argumento no es un adjetivo: es que el build rechaza
publicar trece familias de frases, y eso un competidor no lo copia sin
reescribir su propio sitio.

La lista se lee de verify-public-content.mjs en build y nunca aparece
como literal bajo src/, porque uno de los motivos coincide con su propio
patrón bloqueado y rompería el build en su propia lista. Hay una prueba
que falla si el número deja de ser trece."
```

---

### Tarea 13: Lámina 7 — el puente

Sin esta lámina, lo que sigue son cuatro aplicaciones sueltas.

**Files:**
- Create: `src/components/deck/slides/PuenteSlide.tsx`
- Create: `src/components/deck/slides/puente.module.css`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `workProfiles`, `DECK_COPY.puente`.
- Produces: nada.

- [ ] **Step 1: La rejilla, derivada de `workProfiles`**

Una miniatura por perfil —hoy **cinco**— con `name` y `category`. Sin etiqueta de atribución aquí: las fichas de la Tarea 14 la llevan con su peso completo, y repetirla en cada miniatura la convierte en ruido.

La lámina dice en voz alta que la fábrica no es de un sector: **cinco dominios distintos —tributación, gestión pública, derecho, arbitraje y porcicultura—** y la misma forma de trabajar.

⚠️ **La rejilla se deriva del número de perfiles, no de un número escrito a mano.** En F0.5 este patrón rompió cuatro veces; ningún `repeat(N, …)` con N literal, ninguna regla que nombre una posición.

- [ ] **Step 2: Medir cuántas caben — no está medido**

⚠️ Medido en Tensor: nueve miniaturas apiladas no caben en 844 px de alto y la lámina se mete debajo de las dos barras. **Cuatro sí caben en 2×2 móvil / 4×1 escritorio; cinco NO están medidas.** Es tu trabajo medirlo, no asumirlo — y si cinco no caben en 390×844, la disposición cambia, no el contenido.

- [ ] **Step 3: Medir en los tres tamaños y commit**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck puente
npm run check
git add src/components/deck
git commit -m "feat(deck): la lámina puente, cuatro dominios y la misma fábrica

Sin ella lo que sigue son cuatro aplicaciones sueltas. Con ella, los
cuatro productos son la evidencia de una sola afirmación."
```

---

# FASE 3 — Productos y cierre

---

### Tarea 14: La lámina de producto

Una sola lámina, cuatro instancias generadas desde `workProfiles`.

**Files:**
- Create: `src/components/deck/slides/ProductoSlide.tsx`
- Create: `src/components/deck/slides/producto.module.css`
- Create: `src/components/deck/figures/InterfazProducto.tsx`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: el `perfil` de la lámina (`WorkProfile`): `name`, `category`, `headline`, `attribution.label`, `interface`, `access`, `sources`.
- Produces: nada.

- [ ] **Step 1: La ficha**

```tsx
<Slide id={perfil.slug} titulo={perfil.name} etiqueta={`${perfil.name}. ${perfil.headline}`}>
  <p className={deck.pregunta}>{perfil.category}</p>
  <h2 className={styles.nombre}>{perfil.name}</h2>
  <p className={deck.respuesta}>{perfil.headline}</p>

  {/* Con el mismo peso tipográfico que el nombre, no en letra pequeña
      al pie: la atribución es parte de la afirmación, no una nota. */}
  <p className={styles.atribucion}>{perfil.attribution.label}</p>

  <InterfazProducto interfaz={perfil.interface} />

  <ul className={styles.capacidades}>
    {perfil.capabilities.map((c) => <li key={c.title}>{c.title}</li>)}
  </ul>

  <p className={deck.pie}>
    <a href={perfil.access.href}>{perfil.access.label}</a>
    {" · "}
    {perfil.sources.length} fuentes · verificado {perfil.sources[0].verifiedAt}
  </p>
</Slide>
```

⚠️ **Nada aquí menciona socios.** El campo `perfil.partners` existe y Laudos lo tiene poblado; la lámina **no lo renderiza**. Es una decisión tomada el 11-ago-2026 y registrada en §2.1a del spec: el sitio conserva la atribución del socio, el deck no la muestra. No «arreglar» esto añadiendo `partners` al render.

⚠️ **No hay rama por `attribution.state`.** Tras la Tarea 2 los cinco son `confirmed`; una rama condicional aquí sería código muerto que reintroduce una segunda copia de la verdad.

- [ ] **Step 2: La interfaz, diferenciada por tema**

`InterfazProducto` pinta `interface.primaryMetric`, `metricLabel` e `items` con acentos según `interface.theme`. Los cuatro temas dan cuatro figuras visualmente distintas sin cuatro componentes: cambia la disposición de los `items` y el acento, no el marcado.

```ts
// Mapa de literales: el JIT no genera clases armadas por concatenación.
const CLASE_TEMA = {
  tributary: styles.temaTributario,
  civic: styles.temaCivico,
  legal: styles.temaLegal,
  arbitration: styles.temaArbitraje,
} as const;
```

- [ ] **Step 3: Comprobar que la serie se ve como serie y no como plantilla**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck tribai gobia kelsen laudos porkia
```
Esperado: 15 líneas `ok`. Mirar las cinco capturas de `qa-out/escritorio/` una al lado de otra: tienen que reconocerse como la misma familia y distinguirse entre sí. Si las cinco son idénticas salvo el texto, el tema no está haciendo nada.

⚠️ Porkia es el caso que más pone a prueba la figura: es el único producto que no es una herramienta jurídico-administrativa, y su interfaz real es una app de teléfono, no un panel. Si su ficha se ve forzada dentro del molde de las otras cuatro, el molde está mal, no Porkia.

- [ ] **Step 4: Commit**

```bash
npm run check
git add src/components/deck
git commit -m "feat(deck): la ficha de producto, generada desde los perfiles

Una sola lámina y cuatro instancias: añadir un producto a work.ts añade
su lámina y renumera el deck solo. La atribución va con el mismo peso
tipográfico que el nombre, no en letra pequeña al pie."
```

---

### Tarea 15: Capacidades, cómo empezamos y cierre

**Files:**
- Create: `src/components/deck/slides/CapacidadesSlide.tsx`
- Create: `src/components/deck/slides/ComoEmpezamosSlide.tsx`
- Create: `src/components/deck/slides/CierreSlide.tsx`
- Create: `src/components/deck/figures/Capas.tsx`
- Create: `src/components/deck/figures/HubRadial.tsx`
- Modify: `src/components/deck/SlideRenderer.tsx`

**Interfaces:**
- Consumes: `services` y `method` de `home.ts`; `DECK_COPY.capacidades`, `.comoEmpezamos`, `.cierre`; `LineaDeTiempo` de la Tarea 10.
- Produces: con esta tarea el `switch` de `SlideRenderer` queda **completo** — ya no tiene el grupo genérico y TypeScript comprueba la exhaustividad de verdad.

- [ ] **Step 1: Capacidades — capas apiladas**

Lo que comparten los cuatro productos por dentro. Capas horizontales apiladas, de abajo arriba: datos y fuentes → reglas del dominio → interfaz de trabajo → trazabilidad. Contorno de un hilo, sin rellenos sólidos.

- [ ] **Step 2: Cómo empezamos — hub radial**

Los cuatro tiempos de `method`, esta vez alrededor de un centro que dice «tu reto». Es el mismo contenido de la lámina 4 con **otro arquetipo**: repetir la línea de tiempo aquí haría que las dos se leyeran como plantilla.

- [ ] **Step 3: Cierre**

`DECK_COPY.cierre.respuesta` en grande, el correo como `mailto:` y la ciudad. Sin figura: es la única lámina del deck sin una, y la razón es que la última imagen que queda en la retina tiene que ser la dirección de correo.

- [ ] **Step 4: Quitar el grupo genérico del renderer**

Ahora `SlideRenderer` tiene una rama por `kind`, sin agrupaciones y sin `default`. Comprobar que si se añade un `kind` al tipo sin su rama, `npm run lint` y `next build` fallan.

- [ ] **Step 5: Recorrer las quince y medir todas**

```bash
QA_BASE=http://localhost:3210 npm run qa:deck portada problema tesis metodo espejo evidencia puente tribai gobia kelsen laudos porkia capacidades como-empezamos cierre
```
Esperado: 45 líneas, todas `ok`.

- [ ] **Step 6: Commit**

```bash
npm run check
git add src/components/deck
git commit -m "feat(deck): capacidades, cómo empezamos y cierre

Cómo empezamos repite el contenido del método con otro arquetipo —hub
radial en vez de línea de tiempo— porque dos láminas con la misma
figura se leen como plantilla.

El cierre es la única lámina sin figura: lo último que tiene que quedar
en la retina es la dirección de correo."
```

---

### Tarea 16: El índice `/deck`

**Files:**
- Modify: `src/app/deck/page.tsx`
- Create: `src/app/deck/deck-index.module.css`
- Modify: `scripts/verify-build-output.mjs` — metadatos definitivos de `/deck`

**Interfaces:**
- Consumes: `SLIDES`, `workProfiles`, `DECK_COPY`.
- Produces: nada.

- [ ] **Step 1: La página**

Hero con la tesis, la lista de las quince con enlace a su hash, y los cuatro perfiles con **salida doble**: al producto vivo (`perfil.access.href`) y a su lámina (`/deck/presentacion#<slug>`).

A diferencia de la presentación, esta página es estática y se lee de arriba abajo: es la que se manda por correo cuando alguien quiere el contenido sin recorrer quince láminas.

- [ ] **Step 2: Alinear los metadatos**

Actualizar en `verify-build-output.mjs` el `title`, `description`, `canonical` y —si la página los declara— `ogTitle`, `ogDescription`, `ogImage`, `ogImageAlt` de `deck`. Tienen que ser idénticos a los de `page.tsx`.

- [ ] **Step 3: `npm run check` y commit**

```bash
npm run check
git add src/app/deck scripts/verify-build-output.mjs
git commit -m "feat(deck): índice de /deck con salida doble

La presentación se recorre; el índice se lee. Cada producto sale a dos
sitios: al producto vivo y a su lámina."
```

---

# FASE 4 — La barrera de movimiento

---

### Tarea 17: Movimiento reducido, en build de producción

**Files:**
- Modify: los `*.module.css` a los que les falte el bloque de movimiento reducido

**Interfaces:**
- Consumes: `scripts/qa-reduce.mjs` de la Tarea 7.
- Produces: nada.

- [ ] **Step 1: Auditar los módulos del deck**

```bash
for f in $(git ls-files 'src/components/deck/**/*.module.css'); do
  grep -q "prefers-reduced-motion" "$f" || echo "SIN BLOQUE: $f"
done
```
Esperado: ninguna línea. Cada módulo que anime tiene que cerrar con su bloque.

- [ ] **Step 2: Correr la barrera contra producción**

```bash
npm run build
npm run start -- -p 3210 &
QA_BASE=http://localhost:3210 npm run qa:reduce
```
Esperado:
```
reducedMotion=reduce: SIN ERRORES
reducedMotion=no-preference: SIN ERRORES
```

⚠️ **En `dev` no se reproduce.** Tiene que ser build de producción, con los dos modos.

- [ ] **Step 3: Comprobar el contador a mano con movimiento reducido**

En DevTools → Rendering → *Emulate prefers-reduced-motion: reduce*, recargar `#problema`. La cifra tiene que mostrar `200 %` desde el primer fotograma, sin contar. Si cuenta, el `matchMedia` del efecto no está leyendo bien.

- [ ] **Step 4: Commit**

```bash
npm run check
git add src/components/deck
git commit -m "test(deck): cerrar la barrera de movimiento reducido

Cero errores de consola en los dos modos, en build de producción. El
contador muestra su valor final desde el primer fotograma cuando el
sistema pide movimiento reducido."
```

---

# FASE 5 — Revisión adversarial

---

### Tarea 18: Tres lecturas independientes

**Files:**
- Create: `docs/superpowers/reviews/deck-revision-adversarial.md` (con la fecha de la revisión como primera línea del documento, no en el nombre)

**Interfaces:**
- Consumes: el deck completo y las capturas de `qa-out/`.
- Produces: una lista de hallazgos, cada uno implementado o descartado **por escrito**.

- [ ] **Step 1: Cliente escéptico — ¿qué no me creo?**

Recorrer las quince preguntando, lámina por lámina, qué afirmación se puede rebatir en la sala. Anotar cada una con la lámina y la objeción concreta.

- [ ] **Step 2: Director de arte — ¿qué se ve barato?**

Mirar las 45 capturas de `qa-out/` sin leer el texto. Anotar densidades desiguales, figuras que no comparten grosor de trazo, láminas donde el aire está mal repartido.

⚠️ En Tensor esta lectura encontró que un plan B faltante proyectaba un rectángulo blanco **en vivo**. Comprobar explícitamente qué se ve si una figura no carga.

- [ ] **Step 3: Auditor de evidencia — ¿qué afirmación no tiene fuente?**

Recorrer cada cifra y cada afirmación del deck y comprobar que sale de `work.ts`, de `home.ts` o de `DECK_SOURCES`, con `verifiedAt`. Cualquiera que no, se quita o se verifica.

- [ ] **Step 4: Converger**

Lo que aparezca en dos de las tres lecturas se implementa. Lo que aparezca en una se decide y **se escribe la decisión**, con su porqué.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/reviews
git commit -m "docs(deck): revisión adversarial y decisiones tomadas"
```

---

# FASE 6 — Cierre

---

### Tarea 19: Merge y verificación en producción

- [ ] **Step 1: La corrida completa**

```bash
npm run check
```
Esperado: verde de punta a punta.

- [ ] **Step 2: El arnés completo, una última vez**

```bash
npm run build && npm run start -- -p 3210 &
QA_BASE=http://localhost:3210 npm run qa:deck portada problema tesis metodo espejo evidencia puente tribai gobia kelsen laudos porkia capacidades como-empezamos cierre
QA_BASE=http://localhost:3210 npm run qa:reduce
```
Esperado: 45 líneas `ok` y `SIN ERRORES` en los dos modos.

- [ ] **Step 3: PR y preview**

```bash
git push -u origin feat/deck
```
Abrir PR. Revisar el preview de Vercel en los tres tamaños **antes** de mergear.

- [ ] **Step 4: Merge**

Mergear a `main`. El despliegue es automático desde GitHub.

⚠️ **No correr `vercel deploy --prod` a mano.** Hacerlo desde el directorio equivocado es como se perdió el código en julio de 2026.

- [ ] **Step 5: Verificar producción con Playwright, no con `curl`**

```bash
QA_BASE=https://inplux.co npm run qa:deck portada problema tesis metodo espejo evidencia puente tribai gobia kelsen laudos porkia capacidades como-empezamos cierre
```

⚠️ **`curl` no sirve.** Las láminas más allá de la primera se renderizan en cliente y no aparecen en el HTML inicial: `curl` diría que el deck está vacío.

- [ ] **Step 6: Comprobar las tarjetas sociales**

Pegar `https://inplux.co/deck` y `https://inplux.co/deck/presentacion` en un validador de OG y comprobar que la tarjeta es la correcta.

---

## Notas de decisión registradas

Tres cosas que un implementador podría «arreglar» sin saber que son deliberadas:

1. **La lámina de producto no renderiza `perfil.partners`.** Laudos lo tiene poblado con REDEK. El sitio conserva esa atribución —y `verifyPortfolio()` la exige en `home.ts`— pero el deck no la muestra. Decisión del 11-ago-2026, spec §2.1a.

2. **El orden de los productos es el de `work.ts`** (Tribai, Gobia, Kelsen, Laudos), no el de `showcaseOrder` en `trabajo/page.tsx` (Gobia, Laudos, Tribai, Kelsen). Ese orden era «confirmados primero» y, con los cuatro confirmados, ya no significa nada. Cambiarlo es reordenar `workProfiles`, y eso mueve `/trabajo` también: es lo correcto, una sola fuente para el orden.

3. **No se instala framer-motion.** Ver la cabecera de este plan.
