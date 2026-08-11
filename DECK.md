# Deck INPLUX — pliego de construcción

> **Qué es esto.** El plan completo para construir `inplux.co/deck`: una presentación
> cinemática al nivel del deck de Tensor (`tensor.lat/deck/presentacion`), pero con la
> tesis, la paleta y —sobre todo— la disciplina de evidencia de INPLUX.
>
> **Cómo se usa.** Se puede leer de arriba abajo y ejecutar por fases (§12), o pegarse
> entero en Claude Code como encargo. Las secciones §2 y §5 son las que producen la
> calidad; si hay que recortar algo, que no sea eso.
>
> **Este archivo es `.md` a propósito.** `scripts/verify-public-content.mjs` escanea
> `.css .html .json .svg .ts .tsx .txt .webmanifest` — no `.md`. Por eso aquí se pueden
> citar literalmente las cadenas prohibidas de §4.2 sin romper el build. **No conviertas
> este archivo a `.txt`.**

---

## 1. El encargo en una frase

Una presentación de ~18 láminas, navegable con teclado y gestos, que convenza a una
empresa o entidad de contratar a INPLUX como su fábrica de software — **demostrando** la
tesis en vez de afirmarla, y sin reclamar un solo mérito que no se pueda sostener.

Tesis vertebral propuesta, tomada literal del sitio (`src/content/copy/es.ts`):

> **De un problema real a software en producción.**

Con su remate, también literal: *«La IA acelera el trabajo. Personas expertas dirigen y
validan las decisiones críticas.»*

No es una frase nueva: es la que ya está en la HOME. Que el deck y el sitio digan lo
mismo es un requisito, no una economía.

---

## 2. Las siete reglas que producen la calidad

Esto es lo transferible del deck de Tensor. No son preferencias estéticas: cada una
salió de un fallo concreto y medido.

### 2.1 Una tesis demostrada, no un catálogo

El deck existe para demostrar **una** afirmación. Los productos son su evidencia, no su
contenido. El orden no es negociable: la tesis va **antes** de cualquier producto. Al
revés es un catálogo, y un catálogo no persuade a nadie que no viniera ya convencido.

Consecuencia práctica: debe existir una lámina puente que diga en voz alta «esto no es
una técnica de un sector, es la forma de trabajar». Sin ella, lo que sigue son cuatro
aplicaciones sueltas.

### 2.2 La jerarquía va al revés de lo obvio

La pregunta es el montaje; el titular es la **respuesta**. Cuando una lámina se ve
cargada de texto, casi nunca sobra copy: lo que sobra es tamaño en el sitio equivocado.

Medido en la portada de Tensor: bajar la pregunta de 4,1 rem a 1,6 rem y subir la
respuesta de 2,1 rem a 4,3 rem permitió **meter el doble de texto pesando menos**. No se
cortó una palabra.

### 2.3 Lo que se mueve tiene que SER el argumento

Prohibido el movimiento decorativo. Si una lámina afirma «92 % de los proyectos fallan»,
lo que se anima es que 92 de 100 casillas caigan delante del espectador. Si afirma
«recalcula en tiempo real», lo que se anima es el recálculo.

Prueba para decidir si una animación entra: *¿el espectador entendería peor la lámina si
la quito?* Si la respuesta es no, no entra.

### 2.4 Cero cifras inventadas

Toda cifra sale de una pantalla viva o de una fuente citada con fecha de consulta, nunca
de un dossier ni de una estimación. Si no hay dato, la lámina se construye sin dato.

Corolario para la animación: **se anima el mecanismo, nunca un resultado**. Un TIR que
cambia en pantalla es mucho más espectacular y es mentira. Un pulso que viaja de una
palanca al centro muestra cómo funciona sin afirmar cuánto da.

### 2.5 Un arquetipo por lámina

Tres láminas seguidas con la misma figura se leen como plantilla. El deck de Tensor usa
hub radial, curvas cruzadas, waffle, espina simétrica y rejilla de miniaturas — cada
una una sola vez en la apertura.

Cuando toque repetir estructura, cambia el arquetipo antes que el contenido.

### 2.6 Medir el DOM, no mirar capturas

Un arnés que solo toma capturas es ciego al texto pintado encima de otro texto, que es
justo el fallo que aparece al cambiar de tamaño. El arnés de §10 mide cajas, cuenta
elementos y compara coordenadas; las capturas son para juzgar, no para verificar.

⚠️ Y el arnés miente en un caso: los hijos ocultos por breakpoint (`display:none`)
devuelven un rect en ceros y contaminan cualquier `Math.min` sobre coordenadas. Filtra
por `height > 0` antes de medir.

### 2.7 Movimiento reducido: el flag va dentro de la animación, nunca en la estructura

`useReducedMotion()` devuelve el valor real ya en el primer render del cliente pero
`false`/`null` en SSR. Si ese valor decide **qué se renderiza**, el HTML del servidor
deja de coincidir con el primer render del cliente → **React #418, solo para usuarios
con `prefers-reduced-motion`**, invisible en dev y determinista en producción.

Seguro: usar el flag dentro de props de motion (`animate`, `transition`) y en gates de
comportamiento (un `setInterval` que no arranca). Prohibido: `if (reduce) return <otro/>`,
`key={reduce ? …}`, elementos condicionales.

Se verifica **en build de producción**, con los dos modos. En dev no se reproduce.

---

## 3. Lo que NO se puede copiar de Tensor

Copiar el deck de Tensor lámina por lámina produciría algo peor que empezar de cero.
Tres diferencias estructurales:

| | Tensor | INPLUX |
|---|---|---|
| **Fondo** | Negro (`#0A0A0A`), teal luminoso | **Claro** (`--off-white #f8f8f7`, tinta `#1a1918`) |
| **Evidencia** | 9 productos propios | 4 perfiles, **2 con atribución confirmada** |
| **Tesis** | Máximo Producto Virtual (concepto propio) | Fábrica de software a la medida (categoría conocida) |
| **Espina** | «La misma tesis, nueve veces» | No aplica: con cuatro, «nueve veces» no existe |

### 3.1 El fondo claro cambia el motor visual

En negro, el WOW lo da la luz: halos, teal que brilla, trazos que se encienden. En claro
eso no existe. **El WOW en claro es precisión**: aire, retículas de un solo hilo, trazos
hairline, y movimiento que demuestra un mecanismo.

Buena noticia: la gramática original de `estilo-s50` (`~/hospital-alma-mater-ruta-2050/estilo-s50/SKILL.md`)
está definida sobre **fondo blanco** — círculo de relleno blanco con contorno del color
del nodo, conectores grises, cero rellenos sólidos, cero sombras. El deck de Tensor fue
la traducción de esa gramática a negro; INPLUX puede usarla casi tal cual.

### 3.2 La tesis no puede ser un concepto inventado

«Máximo producto virtual» funciona porque Tensor acuñó el término y el deck entero lo
sostiene. «Fábrica de software a la medida» es una categoría que el cliente ya conoce y
en la que ya tiene prejuicios. El deck de INPLUX no tiene que **definir** una categoría:
tiene que **diferenciarse dentro** de una.

El diferenciador honesto está en §5.

---

## 4. Restricciones duras del repo — rompen el build si se ignoran

Todo lo de esta sección es verificable hoy en `~/inplux-web`.

### 4.1 Puertas de build

`npm run build` corre `check:content` → `next build` → `check:output`.

- **Toda ruta nueva se registra** en `scripts/verify-build-output.mjs`, en
  `pageDefinitions` **y** en `expectedSitemapUrls`. Si el deck vive en `/deck` y
  `/deck/presentacion`, van las dos.
- **El sitemap omite a propósito** `lastmod`, `changefreq` y `priority`, y **excluye
  `/marca`**. El verificador falla si se añaden. No los añadas «de paso».
- `npm run check` es la corrida completa: `lint` + `test:hero-inspector` + `build` +
  `check:http`. Es la que hay que pasar antes de mergear.

### 4.2 Lenguaje prohibido en contenido público

`scripts/verify-public-content.mjs` **falla el build** si aparecen estas cadenas en
`.css .html .json .svg .ts .tsx .txt .webmanifest`. Son las trampas más probables al
redactar copy de deck:

| Se bloquea | Por qué |
|---|---|
| `+25 años`, `+31 años` | cifra de trayectoria sin evidencia |
| `+50 municipios`, `+100 proyectos`, `44 estatutos` | cifras sin evidencia |
| `en días`, `en semanas` | promesa genérica de velocidad |
| `hub de inteligencia tributaria` | posicionamiento anterior |
| `tributaristas que construyen tecnología` | posicionamiento anterior |
| `agentic`, `agéntico/a`, `multiagente` | jerga agéntica |
| `agentes de IA`, `se mejoran solos` | afirmación autónoma no aprobada |
| `alcance nacional`, `areaServed` | cobertura geográfica no aprobada |
| `Porkia` | producto fuera del portafolio |
| `Parque Arví`, `Think IT`, `Fourier`, `Observatorio de Datos` | logo o relación sin permiso |
| `confían en nosotros` | prueba social anterior |
| `resultados medibles`, `impacto medible` | impacto no demostrado |

Dos excepciones ya aprobadas: `Parque Arví Corporación` y `Think IT` se permiten **solo**
en `SoftwareFactoryExperience.tsx` y `HomeSections.tsx`, con los `alt` exactos que la
lista aprueba. **Un deck nuevo no hereda esa excepción.**

> **Lee esta lista como diagnóstico, no como censura.** Casi todas son cosas que un deck
> comercial diría por reflejo. Que estén bloqueadas es la razón por la que el sitio de
> INPLUX es creíble, y el deck tiene que sostener el mismo listón.

### 4.3 Despliegue

`productionBranch: main` con **auto-deploy desde GitHub**. Una rama de trabajo no
despliega: se ve en el preview de Vercel y sale a producción al mergear. No hace falta
`vercel deploy --prod` a mano, y hacerlo desde el directorio equivocado es como se perdió
el código en julio de 2026 (ver `HANDOFF.md` y la memoria del incidente).

### 4.4 Marca

**No asumas co-marca «INPLUX × Tensor».** Tensor es socio en algunos encargos y en otros
no tiene nada que ver. El deck de la fábrica es de INPLUX solo, salvo instrucción
expresa. Donde haya socio real y confirmado (REDEK en Laudos), se nombra como el sitio ya
lo nombra.

---

## 5. La disciplina de evidencia — el diferenciador, y es innegociable

`src/content/work.ts` tiene un campo que casi ningún portafolio del mercado tiene:

```ts
attribution: {
  state: "confirmed" | "unconfirmed";
  label: string;
  statement: string;
}
```

Estado actual de los cuatro perfiles:

| Producto | Estado | Etiqueta publicada |
|---|---|---|
| **Gobia** | `confirmed` | Solución de INPLUX |
| **Laudos** | `confirmed` | Desarrollo técnico de INPLUX (cocreada con REDEK) |
| **Tribai** | `unconfirmed` | Atribución pública no confirmada |
| **Kelsen** | `unconfirmed` | Atribución pública no confirmada |

Y cada perfil lleva `sources[]` con `verifiedAt`.

### 5.1 La regla

**El deck no puede reclamar como trabajo de INPLUX ningún perfil marcado `unconfirmed`.**
Ni por omisión de la etiqueta, ni por contexto, ni por ponerlo en una fila titulada
«nuestro trabajo». El sitio publica la salvedad; un deck que la borre convierte una
política de honestidad en una mentira selectiva.

### 5.2 Y aquí está el diferenciador

No lo trates como una limitación que hay que disimular. **Es la lámina más fuerte que
tiene INPLUX.**

Todo el mercado de fábricas de software enseña logos sin permiso y casos sin fuente. Un
deck que dedique una lámina a decir *«estos dos son nuestros; estos dos los observamos y
no nos los atribuimos; cada dato lleva fuente y fecha»* dice sobre el rigor de INPLUX más
que cualquier adjetivo — y lo dice de una forma que un competidor **no puede copiar sin
reescribir su propio portafolio**.

Es el equivalente INPLUX de la lámina del 92 %: un golpe de credibilidad, no de volumen.

Propuesta de lámina, para afinar: título **«Lo que no reclamamos»**, dos columnas
—confirmado / observado— y el pie *«Cada afirmación de este deck tiene fuente y fecha de
verificación.»*

### 5.3 Cifras del deck

Misma fuente única que el sitio: `src/content/work.ts` y `src/content/home.ts`, con su
`verifiedAt`. Ninguna cifra nueva entra al deck sin pasar antes por el contenido del
sitio. Si el deck necesita un dato que el sitio no tiene, **primero se verifica y se
agrega al sitio**, después se usa en el deck.

---

## 6. Arquitectura técnica

Se replica la del deck de Tensor, que ya está probada en producción. Referencia viva:
`~/tensor-web/src/components/portfolio-deck/`.

### 6.1 Rutas

| Ruta | Qué es |
|---|---|
| `/deck` | Índice puntual: hero, tesis, los perfiles con su etiqueta de atribución, salida doble (producto vivo + lámina) |
| `/deck/presentacion` | La presentación cinemática, hash por lámina |

Ambas se registran en `verify-build-output.mjs` (§4.1).

### 6.2 Modelo de datos

Una sola fuente para el orden y el contenido. **Las láminas de producto no se escriben a
mano: se generan recorriendo los perfiles.** Agregar un producto renumera el deck solo.

```ts
// src/content/deck.ts
import { workProfiles } from "./work";

export type DeckSlideKind =
  | "portada" | "problema" | "tesis" | "metodo"
  | "evidencia"          // la lámina de §5.2
  | "puente" | "separador" | "producto" | "capacidades" | "cierre";

export type DeckSlide =
  | { n: number; id: string; kind: Exclude<DeckSlideKind, "producto" | "separador"> }
  | { n: number; id: string; kind: "separador"; acto: ActoId }
  | { n: number; id: string; kind: "producto"; perfil: (typeof workProfiles)[number] };

function construir(): DeckSlide[] { /* apertura + actos + cierre */ }

export const SLIDES: readonly DeckSlide[] = construir();
export const TOTAL_SLIDES = SLIDES.length;
```

Con una prueba que falle si un perfil se queda sin lámina — en Tensor esa comprobación
atrapó un producto huérfano:

```ts
if (PRODUCT_SLIDE_COUNT !== workProfiles.length) throw new Error(/* … */);
```

### 6.3 Componentes

```
src/components/deck/
  PresentationDeck.tsx     ← riel, teclado, gestos, hash, índice
  SlideRenderer.tsx        ← switch por kind, SIN default (véase abajo)
  slides/                  ← una lámina por archivo
  figures/                 ← una figura por archivo, gramática de §8.3
  Contador.tsx             ← cifra que sube; ver §9.3
  chrome/                  ← barra superior, riel de progreso, índice, ayuda
```

⚠️ El `switch` de `SlideRenderer` **no lleva `default`** a propósito: sin él TypeScript
comprueba que están cubiertos todos los `kind`, y añadir un tipo de lámina sin su rama
rompe el build en vez de pintar un hueco en producción.

### 6.4 El riel

Solo **dos** láminas montadas a la vez, con `key` por secuencia. Es lo que hace que las
animaciones de entrada disparen al llegar a la lámina y no al cargar la página — si se
montan las veinte, todo termina antes de que el espectador llegue.

`<MotionConfig reducedMotion="user">` envuelve el deck entero.

⚠️ En Tensor, `AnimatePresence mode="sync"` montaba un nodo nuevo por pulsación y
acumulaba salientes; se resolvió a mano con dos slots que se sustituyen. No repitas ese
camino: arranca con los dos slots.

---

## 7. El guion

Propuesta de 18 láminas. Los `[VERIFICAR]` son decisiones o datos que faltan, no
sugerencias de relleno.

### Apertura — la tesis (6)

| # | id | Lámina | Figura |
|---|---|---|---|
| 1 | `portada` | *De un problema real a software en producción.* Bajada: la IA acelera, las personas dirigen. | Fondo: el flujo de la fábrica, tomado de `SoftwareFactoryExperience` |
| 2 | `problema` | Por qué el software a la medida falla tan seguido | Cifra grande + figura de datos — **`[VERIFICAR]` la cifra, §7.1** |
| 3 | `tesis` | El software empieza en el problema | Curva o diagrama de dos tiempos |
| 4 | `metodo` | Los cuatro tiempos: Entender → Definir → Construir → Lanzar | Línea de tiempo (`lineaDeTiempo` de estilo-s50) |
| 5 | `evidencia` | **Lo que no reclamamos** (§5.2) | Espina simétrica: confirmado / observado |
| 6 | `puente` | La fábrica no es de un sector | Los cuatro perfiles como serie |

### Los tres actos — la evidencia (9)

Actos tomados de `services` en `home.ts`, que es como el cliente se reconoce a sí mismo:

- **Acto I — Lanzar un producto digital**
- **Acto II — Mejorar una operación**
- **Acto III — Automatizar trabajo y conocimiento**

Cada acto abre con un separador y contiene sus perfiles. Cada ficha de producto lleva
**la etiqueta de atribución visible**, con el mismo peso tipográfico que el nombre. No en
letra pequeña al pie.

`[VERIFICAR]` — el reparto de los cuatro perfiles entre los tres actos lo tiene que
confirmar quien conoce cada encargo. Mi lectura del contenido del sitio:
Gobia → II, Laudos → III, Tribai → III, Kelsen → III. Eso deja el Acto I vacío, lo que
sugiere que **falta un caso de «lanzar un producto digital»** (¿MiMotoYa, hoy «En
desarrollo»?) o que los actos deben ser otros.

### Cierre (3)

| # | id | Lámina |
|---|---|---|
| 16 | `capacidades` | Lo que comparten los cuatro: la fábrica por dentro |
| 17 | `como-empezamos` | Los cuatro tiempos aplicados a *tu* reto |
| 18 | `cierre` | Contacto — `gerencia@inplux.co`, Medellín |

### 7.1 La lámina 2 necesita una cifra con fuente

Es la lámina que instala el problema y la que más trabaja. Necesita el equivalente del
92 % de Flyvbjerg: un dato duro, público, citable, sobre fracaso de proyectos de software
a la medida.

**No inventes uno.** Candidatos a verificar contra fuente primaria y con fecha de
consulta antes de usarlos. Si ninguno se sostiene, **la lámina se construye sin cifra**:
una afirmación cualitativa bien dicha vale más que un porcentaje que un CTO puede
desmentir en la sala.

Y ojo con §4.2: la redacción de esta lámina no puede prometer velocidad («en semanas») ni
«resultados medibles».

---

## 8. Sistema visual

### 8.1 Tokens — los del sitio, sin inventar

Ya existen en `src/app/globals.css`. **No crees una paleta de deck.**

```
--off-white #f8f8f7   fondo
--ink       #1a1918   texto (nunca negro puro)
--teal      #0d7d74   acento, relleno
--teal-accent #0fb3a1 trazo fino sobre claro
--teal-soft #e8f5f3   fondos de bloque
--border    #e5e3e0   hairline
```

Contraste: verifica cada par sobre `--off-white`, no sobre blanco puro. En Tensor el teal
de marca daba 3,04:1 y **no alcanzaba AA**, lo que obligó a un token aparte solo para
texto. Haz la misma comprobación aquí antes de pintar texto en `--teal`.

### 8.2 Tipografía — las del sitio

`--font-body` Geist (100–900) · `--font-serif` Newsreader Display 300 · `--font-mono`
Geist Mono. La jerarquía se resuelve con **peso y tamaño**, no con color.

### 8.3 Gramática de figuras

De `estilo-s50`, en su versión original para fondo claro:

- Nodo: relleno del fondo, contorno del color del nodo, grosor ≈ 6–7 % del diámetro.
- Conector: 0,7 pt gris, **recortado a unos puntos del borde de cada círculo** — no
  nace ni muere pegado al aro.
- Etiqueta del nodo: del color del nodo. Descriptor secundario: gris. Nunca negro.
- Cero rellenos sólidos, cero sombras, cero degradados de fondo, cero cajas.
- Si un texto no cabe en un nodo: reduce el cuerpo o parte en dos líneas. **Nunca**
  agrandes el círculo ni saques la etiqueta con línea guía.

Generadores del catálogo, útiles aquí: `lineaDeTiempo` (el método en 4 tiempos),
`hubRadial` (capacidades), `capas` (la fábrica por dentro), `cronograma`.

### 8.4 Móvil: mismo DOM, decide el CSS

Las figuras ceden a listas compactas por CSS, no por rama de JavaScript. Bajo el
breakpoint, las etiquetas de un SVG caen por debajo de 8 px y dejan de leerse; ahí manda
la lista.

⚠️ Medido en Tensor: nueve miniaturas apiladas no caben en 844 px de alto y la lámina se
mete bajo las dos barras del deck.

---

## 9. Movimiento

### 9.1 Curvas y tiempos

Del sitio: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)` para entradas. Escalona las
entradas con retrasos de 0,06–0,12 s entre elementos hermanos.

### 9.2 Las tres animaciones que valen la pena

Ordenadas por relación argumento/esfuerzo:

1. **La cifra de la lámina 2 sube mientras su figura ocurre.** Ver §9.3.
2. **El flujo de la fábrica avanza** — Entender → Definir → Construir → Lanzar, con un
   pulso que recorre la línea. Es la tesis del deck, literal.
3. **La espina de «lo que no reclamamos»** se dibuja y cada lado recibe su marca. La
   simetría es el argumento: los dos lados llegan **a la vez**.

### 9.3 Contador acoplado a una cascada — la trampa

Si la cifra sube y una figura cae al mismo tiempo, **tienen que terminar juntas**. Dos
fallos, los dos medidos:

- Una cascada hecha con **duraciones distintas por celda** descoordina el contador: la
  cifra llegaba a 92 con sesenta casillas aún en pie. Correcto: `duration` y `delay`
  comunes, y mover el instante de cada caída con `times`.
- Un contador con curva **expo-out** se lee atascado: alcanza el 99 % del valor a mitad
  de recorrido. Un contador que corre contra una cascada va **lineal**.

El compás vive en **un solo sitio** y se exporta desde la figura, para que la cifra se
enganche con dos multiplicaciones:

```ts
export const RITMO = { inicio: 0.35, total: 2.6, arranqueCaida: 0.25, finCaida: 0.95 } as const;
export const T_CIFRA = {
  retraso: RITMO.inicio + RITMO.arranqueCaida * RITMO.total,
  duracion: (RITMO.finCaida - RITMO.arranqueCaida) * RITMO.total,
} as const;
```

Y el contador va `aria-hidden`: la lámina ya declara el dato completo en su `aria-label`,
y un lector de pantalla no debe oír una cifra en movimiento.

`<MotionConfig reducedMotion="user">` cubre las props de motion, **no** lo imperativo: un
`animate()` llamado a mano o un `setInterval` tienen que leer el flag y apagarse (§2.7).

---

## 10. Arnés de QA

Guárdalo como `scripts/qa-deck.mjs` y córrelo con el dev server arriba. **Mide**; las
capturas son para juzgar.

```js
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.QA_BASE ?? "http://localhost:3000";
const SALIDA = "qa-out";
const IDS = ["portada", "problema", "tesis", "metodo", "evidencia", "puente"];
const VPS = [
  { n: "escritorio", width: 1440, height: 900 },
  { n: "proyector", width: 1920, height: 1080 },
  { n: "movil", width: 390, height: 844 },
];
// Alto de las barras del deck. Una lámina puede "caber" en el viewport y
// quedar igual debajo de ellas: es el fallo que no se ve midiendo solo el alto.
const BARRA_SUP = 70;
const BARRA_INF = 60;

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
    await p.waitForSelector(`section[data-slide="${id}"]`, { timeout: 15000 });
    await p.waitForTimeout(2800);

    const m = await p.evaluate(({ id, sup, inf }) => {
      const s = document.querySelector(`section[data-slide="${id}"]`);
      // Los hijos ocultos por breakpoint devuelven un rect en ceros y
      // contaminan el Math.min: hay que filtrarlos.
      const hijos = [...s.children].filter((c) => c.getBoundingClientRect().height > 0);
      const top = Math.min(...hijos.map((c) => c.getBoundingClientRect().top));
      const bot = Math.max(...hijos.map((c) => c.getBoundingClientRect().bottom));
      const txt = s.innerText.replace(/\s+/g, " ").trim();
      return {
        top: Math.round(top),
        bot: Math.round(bot),
        choca: top < sup || bot > window.innerHeight - inf,
        palabras: txt.split(" ").length,
        figuras: s.querySelectorAll("svg").length + s.querySelectorAll("img").length,
      };
    }, { id, sup: BARRA_SUP, inf: BARRA_INF });

    console.log(
      `${vp.n} · ${id.padEnd(12)} ${String(m.palabras).padStart(3)} pal · ` +
      `${m.figuras} fig · caja ${m.top}→${m.bot} ${m.choca ? "⚠️ CHOCA CON LAS BARRAS" : "ok"}`,
    );
    await p.screenshot({ path: `${SALIDA}/${vp.n}/${id}.png` });
  }
  if (errs.length) console.log(`  errores (${vp.n}):`, [...new Set(errs)].slice(0, 5));
  await ctx.close();
}
await nav.close();
```

Requisito: cada `<section>` de lámina lleva `data-slide="<id>"`. Sin eso hay que adivinar
cuál es la lámina visible, y adivinar falla justo cuando hay dos montadas.

### 10.1 Barrera de hidratación — en build de producción

```js
// scripts/qa-reduce.mjs — corre contra `npm run build && npm run start`
for (const modo of ["reduce", "no-preference"]) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: modo });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
  await p.goto(`${BASE}/deck/presentacion#portada`, { waitUntil: "networkidle" });
  for (let i = 0; i < 8; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(700); }
  console.log(`reducedMotion=${modo}:`, errs.length ? errs.slice(0, 5) : "SIN ERRORES");
  await ctx.close();
}
```

**En dev no se reproduce.** Tiene que ser build de producción.

### 10.2 Criterios de aceptación por lámina

- [ ] No choca con las barras en 1440×900, 1920×1080 y 390×844.
- [ ] ≤ 110 palabras en las láminas de apertura. Si pasa, revisa §2.2 antes de cortar.
- [ ] Al menos una figura, o una razón escrita de por qué no.
- [ ] Su arquetipo no se repite en la lámina anterior ni en la siguiente.
- [ ] Toda cifra tiene fuente en `work.ts`/`home.ts` con `verifiedAt`.
- [ ] Cero errores de consola y cero React #418 en los dos modos de movimiento.

---

## 11. Catálogo de trampas

Todas medidas, ninguna teórica.

| Trampa | Síntoma | Salida |
|---|---|---|
| Estructura condicional por `useReducedMotion` | React #418 solo con movimiento reducido, solo en producción | Flag dentro de props de motion (§2.7) |
| `pathLength` con `preserveAspectRatio="none"` | La cola del trazo (~16 % del ancho) queda sin pintar | Barrido con `clipPath` que crece, o animar opacidad |
| `<circle>` bajo `preserveAspectRatio="none"` | Se deforma en óvalo al cambiar el ancho | `<rect>` corto |
| framer pisa la clase de opacidad del contenedor | La atenuación desaparece al animar | Que la opacidad viva en el hijo SVG |
| Figura sin tope de ancho | Crece de alto en proporción y mete la lámina bajo las barras | `max-w` explícito en el envoltorio |
| Arnés que mide `Math.min` sobre todos los hijos | Reporta `top: 0` falso | Filtrar por `height > 0` (§2.6) |
| Orden de lectura ≠ orden visual | La rejilla intercala dos columnas en móvil | `lg:contents` en el envoltorio de cada columna |
| Clases de Tailwind armadas por concatenación | El JIT no las genera y el estilo no aplica | Mapa de literales (`{2:'lg:grid-cols-2', …}`) |
| Conector anclado a un `top` fijo | Se desalinea cuando el `clamp` del titular cambia | `calc(pad + clamp(…) * 0.69)` |
| Azar en geometría de SSR | Rompe la hidratación | Geometría determinista a nivel de módulo |
| Puerto 3000 ocupado por otro proyecto | «Ready» en 3000 pero responde otra app y el arnés ve láminas vacías | Levantar en otro puerto (`-p 3210`) |

---

## 12. Plan de ejecución

Cada fase termina en algo que se puede mirar. No se pasa a la siguiente sin cerrar la
anterior.

**F0 · Decidir (sin código).**
Cerrar las preguntas de §13. Sin la cifra de la lámina 2 y sin el reparto de actos, lo
que se construya después hay que rehacerlo.
→ *Cierra cuando:* el guion de §7 no tiene `[VERIFICAR]`.

**F1 · Andamiaje.**
Rutas `/deck` y `/deck/presentacion` registradas en `verify-build-output.mjs`. Modelo de
datos de §6.2 con su prueba. Riel de dos slots, teclado, gestos, hash, índice. Láminas en
blanco con su `data-slide`.
→ *Cierra cuando:* `npm run check` pasa y se recorren las 18 láminas vacías con →.

**F2 · Apertura (láminas 1–6).**
Es el 70 % del valor del deck. Construirla completa —con sus figuras— antes de tocar los
actos.
→ *Cierra cuando:* el arnés de §10 da verde en los tres viewports y las 6 láminas
cumplen §10.2.

**F3 · Actos y cierre (7–18).**
Generadas desde `workProfiles`. Etiqueta de atribución visible en cada ficha.
→ *Cierra cuando:* la prueba de perfil huérfano pasa y ninguna ficha `unconfirmed` se
presenta como trabajo de INPLUX.

**F4 · Movimiento.**
Las tres animaciones de §9.2, y solo esas. Después, la barrera de hidratación de §10.1.
→ *Cierra cuando:* cero #418 en los dos modos, en build de producción.

**F5 · Revisión adversarial.**
Tres lecturas independientes antes de mergear: **cliente escéptico** (¿qué no me creo?),
**director de arte** (¿qué se ve barato?), **auditor de evidencia** (¿qué afirmación no
tiene fuente?). En Tensor esta fase encontró que un plan B faltante proyectaba un
rectángulo blanco en vivo.
→ *Cierra cuando:* lo convergente entre las tres lecturas está implementado o descartado
por escrito.

**F6 · Cierre.**
`npm run check` completo, merge a `main`, verificar en producción con Playwright —no con
`curl`: las láminas más allá de la primera se renderizan en cliente y no aparecen en el
HTML inicial.

---

## 13. Preguntas abiertas — para ti, no para el que construya

1. **La cifra de la lámina 2.** ¿Hay un dato sobre fracaso de proyectos de software que
   INPLUX ya use y pueda citar con fuente? Si no, ¿construimos la lámina sin cifra?
2. **El reparto de actos.** Con los cuatro perfiles actuales, el Acto I («Lanzar un
   producto digital») queda vacío. ¿Entra MiMotoYa, cambiamos los actos, o el deck va sin
   actos y con una sola serie de cuatro?
3. **«Lo que no reclamamos» (§5.2).** Es la propuesta más arriesgada de este pliego:
   convierte una salvedad legal en argumento de venta. ¿Va?
4. **Audiencia.** ¿El deck es para empresa privada, entidad pública, o los dos? En Tensor
   la doble audiencia obligó a una lámina espejo entera; conviene saberlo antes de
   escribir el guion, no después.
5. **Idioma.** El sitio ya tiene capa bilingüe (`src/content/copy/`). ¿El deck nace
   bilingüe o solo en español?
6. **Marca.** Confirmar que este deck es de INPLUX solo (§4.4).

---

## 14. Referencias

- **Deck de referencia:** `~/tensor-web/src/components/portfolio-deck/` — riel, figuras,
  índice, arnés. Vivo en `tensor.lat/deck/presentacion`.
- **Gramática de figuras:** `~/hospital-alma-mater-ruta-2050/estilo-s50/SKILL.md`, y sus
  generadores en `assets/figuras.js`.
- **Contenido y disciplina de evidencia:** `src/content/work.ts`, `src/content/home.ts`,
  `src/content/copy/es.ts` en este repo.
- **Puertas de build:** `scripts/verify-public-content.mjs`, `scripts/verify-build-output.mjs`.
- **Componente reutilizable:** `src/components/site/SoftwareFactoryExperience.tsx` — el
  flujo de la fábrica ya está construido y animado. La lámina 4 debería partir de ahí en
  vez de reinventarlo.
