# Handoff — 2026-05-29 (sesión Pinecone-tier glow-up)

## Objetivo de la sesión
Llevar inplux-web a un nivel "startup tech tipo Pinecone" sin perder la identidad editorial (serif italic + teal).

## Estado actual
- **Branch**: `feature/graphics-startup`
- **Cambios no committeados**:
  - `src/app/globals.css` — kit visual ampliado: vars de teal-accent / teal-electric, keyframes `vec-twinkle` / `vec-orbit-spin` / `vec-cursor-pulse`, clases `.tech-grid` / `.tech-grid-fade` / `.bracket-cta` / `.vec-*`, reduced-motion para los nuevos.
  - `src/app/page.tsx` — hero rehecho estilo Pinecone-híbrido: drop del `<video>`, layout 2 columnas, `VectorCloud` inline (240 puntos deterministas + cursor central + órbita), CTAs con `bracket-cta` (4 corner brackets), tech-grid de fondo. Headline h1 bajado a `text-[2.1rem]` en móvil para evitar overflow de "construimos.".
- **Último commit (en remoto)**: `be40c39` — "Glow-up visual de diagramas + og-image social" (en `origin/feature/graphics-startup`).
- **Producción** (`inplux.co`, rama `main`): en `2a8a256` (Narrativa v3). El glow-up de diagramas y el og-image ya están vivos. **El hero Pinecone-style NO está en producción** (ni en remoto), solo local.
- **Otro proyecto del usuario** (`Atlas Urabá`) ocupa `localhost:3000`. INPLUX corre en `localhost:3001`.

## Hecho en esta sesión
- Análisis comparativo Pinecone vs INPLUX y elección de dirección **híbrida** (serif italic conservado + moves técnicos Pinecone).
- Añadido kit CSS reutilizable: tech-grid, bracket-cta, keyframes y clases del vector cloud.
- Construido componente `VectorCloud` (PRNG Mulberry32 determinista, 240 puntos con halos borrosos vía filter blur + capa nítida + 5 puntos destacados + cursor/reticle central + órbita exterior con marcador y dashes).
- Reescrito hero a 2 columnas con texto a la izquierda y vector cloud a la derecha; cloud `hidden md:block` para móvil limpio.
- CTAs ("Ver el motor" / "Hablemos") envueltos en `.bracket-cta` con 4 corner brackets.
- Capturas headless verificadas en 1440 y 390 px; ajuste de `text-[2.1rem]` en móvil para evitar overflow.

## PRs abiertos relevantes
ninguno (la rama `feature/graphics-startup` está pusheada en `be40c39` pero sin PR abierto).

## Archivos clave
- `/Users/cristianespinal/Projects/inplux-web-gh/src/app/page.tsx` — helpers `makeVecPoints`, const `VEC_POINTS`/`VEC_HIGHLIGHT`, componente `VectorCloud`, hero rehecho. Resto de secciones (motor, frentes, fábrica, tecnología, etc.) intacto.
- `/Users/cristianespinal/Projects/inplux-web-gh/src/app/globals.css` — kit visual (líneas finales: tech-grid, bracket-cta, vec-* keyframes + reduced-motion).
- `/Users/cristianespinal/Projects/inplux-web-gh/public/og-image.png` — 1200×630 ya commiteado en `be40c39`, sirviendo en producción.
- `/Users/cristianespinal/Projects/inplux-web-gh/HANDOFF.md` — este archivo.

## Hecho en sesión 2026-05-29/30 (deep-research Pinecone + moves)
- **Deep-research Pinecone** (workflow): reporte con hallazgos verificados 3-0 sobre posicionamiento (poseer categoría), narrativa outcome, copy noun-phrase, CTAs verbo-primero + dual acción/docs, announcement bar dismissible, secciones numeradas. Brecha: sistema visual fino no cubierto por claims (Pinecone NO usa brackets ni dot-grid — son interpretación propia de INPLUX). Nav primaria y patrón hero fueron REFUTADOS (no confiar).
- **Announcement bar dismissible** ✅ — barra ink fija arriba, punto teal, copy responsivo (full desktop / corto móvil), link "Ver más →", X de cierre con persistencia en `localStorage` (`inplux-banner-dismissed`). Nav baja a `top-10` y hero a `pt-[100px]` cuando está abierta. CSS `.announce-*` en globals.css; estado `bannerOpen` + `dismissBanner` en page.tsx.
- **Numeración 01–10** ✅ — componente `SectionKicker({n,children})` reemplaza los 10 eyebrows de sección en orden de scroll (01 Motor … 10 Contacto).
- **Brackets + CTA dual** ✅ — CTAs de Kelsen y Fábrica envueltos en `.bracket-cta.is-block` (nueva variante full-width) + link secundario ("Conoce Kelsen.io →" / "Ver el portafolio →").
- **tech-grid extendido** ✅ — a secciones #tecnologia y #contacto (las que no tienen SVG con dot-grid propio); `relative overflow-hidden` + div `.tech-grid.tech-grid-fade` absoluto.
- **Headline noun-phrase** — Motor: "Así funciona un agente que se mejora solo." → "Un agente que se mejora solo." (resto de headlines ya eran noun-phrase; serif italic conservado).
- **Hero rediseñado (deep-dive con workflow hero-redesign-explore)** ✅ — pivote estratégico: de "inteligencia tributaria" a **inteligencia LEGAL** posicionando a INPLUX como arquitectos del "cerebro legal de Colombia" (Kelsen = "Harvey colombiano"), a nivel HUB.
  - H1: "Construimos el **cerebro legal** de Colombia." ("cerebro legal" en teal serif italic). Reemplaza "La norma la conocemos / La tecnología la construimos."
  - Eyebrow: "Cerebro legal · Fábrica de software · Agentes con memoria" — declara los DOS frentes (cerebro legal + fábrica de software) + el motor compartido.
  - Subhead corto sobre Kelsen (tributario + arbitral + memoria + citación verificable).
  - CTAs: "Ver a Kelsen" (#legal) + "Hablemos" (#contacto), con brackets.
  - Columna derecha: nuevo componente `KelsenProof` — demo de producto donde la CITA normativa verificable es el héroe visual (estilo Decagon, resultado resuelto), con `VectorCloud` difuminado detrás como capa de memoria. Se muestra TAMBIÉN en móvil (ya no `hidden md:block`). CSS `.kelsen-caret` (blink) + `.kelsen-cite` (highlight) con guarda reduced-motion.
  - PENDIENTE/INNEGOCIABLE: la consulta y la cita del demo (`KELSEN_DEMO`: "¿Es válida esta cláusula compromisoria?" → Ley 1563 de 2012, Art. 3) son ILUSTRATIVAS — un abogado debe verificar vigencia antes de publicar a prod.
  - PESO A LA FÁBRICA DE SOFTWARE en el hero: (a) subhead con puente verbal ("el mismo motor agéntico es nuestra fábrica de software: del spec al deploy"); (b) tira `FABRICA_APPS` bajo la tarjeta de Kelsen con las .apps y su estado — Tribai/Gobia/Kelsen/Laudos (producción, teal, linkadas), Porkia (porkia.co) y MiMotoYa (en desarrollo, dashed). Cierre "Un motor, muchas .apps".
- QA visual headless a 1440/480 OK (a ≤460px el clipping del borde es el artefacto headless ya conocido, NO overflow real; confirmado a 480px donde cierra limpio). Compila sin errores.
- NOTA: el dev server en background se cae solo (se reaper); si pasa, relanzar con `PORT=3001 npm run dev` (o `!PORT=3001 npm run dev` para que viva en la sesión).

## Pendiente
- [ ] **search icon** en nav (pendiente; respaldo de investigación bajo — la claim de nav fue refutada).
- [ ] Revisar el headline noun-phrase de Motor y decidir si aplicar el tratamiento a más headlines (decisión de marca — fácil de revertir).
- [ ] Considerar brackets/tech-grid en más secciones si se valida el look (Stats, Capacidades).

### Auditoría de TODAS las secciones vs Linear/Pinecone (workflow wsrmwklxp) — aplicación
Veredicto: el "chrome" HTML ya estaba bien; la deuda de craft vive DENTRO de los diagramas SVG (teal saturado, micro-tipografía <8px, densidad, sombras/motion). Plan de 8 lotes.
APLICADO (lotes 1,2,5,7,8 + densidad-ruido global):
- [x] L1 globals: announce `--teal-electric`→`--teal-accent` + sin glow + foco blanco sobre oscuro + left-align (justify flex-start, label text-left, gap 12); `.svg-card` sombra → drop-shadow(0 2px 6px /0.06) (afecta TODOS los diagramas); `svg-lift:hover` sombra neutra; reduced-motion ampliado a clases `eco-*`/`kelsen-*`; `.nav-link-active` sin fondo (solo color+600); logos opacity 0.3→0.55 / hover 0.85 / gap 3.5rem / max-width 120px; `.form-input` borde → gray-200.
- [x] L2 AA: `fill="#8a8784"`→`#76716a` global en SVG.
- [x] L5 motion: `AnimatedNumber` respeta prefers-reduced-motion + dur 1400→900ms + tabular-nums.
- [x] L7 chrome: nav a 5 links (quitado Tecnología/Contacto) + gap-1 + px-3.5 py-2 + wordmark font-semibold/tracking-0.08; stats sin punto teal + rejilla border-light persistente + gaps grandes + detalle text-xs gray-400; hero items-start + dots de módulos en gris + ventana shadow-sm; tecnología chip neutro rounded-md + grid gap-5/6 + cierre left-align + text-sm; contacto labels legibles (no uppercase) + card bg-off-white + p-7/9 + space-y-5 + h3 mayor; footer 5 columnas (Productos/Aliados separados, +Porkia) + space-y-2.5 + copyright left-align móvil.
- [x] L6 (parcial) densidad: rejillas de puntos de fondo unificadas a #ebe8e4 (casi imperceptible) en todos los diagramas.
REFACTOR POR DIAGRAMA (lotes 3+4+6, uno a la vez con captura) — progreso:
- [x] **Motor** (segundo cerebro): bordes de tarjetas → hairline #e2dfdb; flechas → #c8c5c1; banda "SEGUNDO CEREBRO" tealGrad → inkGrad; piso 9px (quitadas 3as líneas diminutas); compartimentos título 11 / desc 9; teal solo en círculos 01-04 + LLM-Wiki + nodos grafo; py-24/32. Verificado.
- [x] **Capacidades** (4 pilares): diagonales + órbita exterior + pulsos de esquina ELIMINADOS; bordes pilares → #d1cfcc 1; headers → #f3f1ee; kickers → #6e6b68 9px; "& RAG" → gris; teal solo en hub + 4 conectores + pill de métrica por tarjeta. Verificado. (Pills internas siguen a 7px — floor menor pendiente.)
- [x] **Legal/Kelsen**: órbita interior fuera; conexiones a módulos → #c8c5c1; bordes Tribai/Laudos → hairline (header-strip + check + link siguen teal); piso 9px; pulsos decorativos fuera; orbit guía + py-24/32. Verificado.
- [x] **Fábrica**: pipeline border/header → neutral; conectores de pasos → gris; piso 9/11; eco-float quitado de las 8 app-cards; Porkia → activo; inactivos #a8a5a0/#b8b5b1 → #76716a/#9a958e; teal solo en motor + flechas de flujo + borde de app activa.
- [x] **Empresas**: 3 órbitas → 1 guía; pulsos decorativos fuera; conexiones → #c8c5c1; Kelsen/Gobia/Aries neutralizados (teal solo en INPLUX + Fourier); eco-glow quitado; piso 9px; py-24/32.
- [x] **Infraestructura**: capa IA recortada 13→5 pills y neutralizada (teal solo en su borde); headers neutros; conectores teal → gris; pulsos decorativos → gris; piso 9px; py-24/32. (Otras 3 capas ya eran neutras; sus micro-pills 7.5/8 quedan como floor menor.)
- [x] **Manifiesto** (puente): 6 pills de la tarjeta tech neutralizadas (borde/header/caption teal conservados como "lado tecnología"); piso 8.5.
- [x] **Timeline**: todos los `border-2` → `border`; cards Era 2 neutras (hover gris); key-milestone Era 1 por fondo warm; isLast por gradient suave; `hover:shadow-lg`→`md`; badge Era 2 `bg-teal`→`bg-ink` (teal solo en dot/línea/meta-label).
- GLOBAL extra durante el refactor: `fill="#8a8784"`→#76716a, `#a8a5a0`→#76716a, `#b8b5b1`→#9a958e, puntos decorativos teal (op .4/.3/.2) → grises; rejillas de fondo unificadas a #ebe8e4.
- VERIFICADO visualmente: Motor, Capacidades, Legal. Fábrica/Empresas/Infraestructura: mismo patrón, compila OK (página >8000px, sus capturas se salían del viewport — revisar en localhost). Floor menor pendiente: micro-pills 7-8px en capas 2-4 de Infraestructura y algunas pills de Capacidades.

- [x] **05 Fábrica de software — REDISEÑO** (SVG reemplazado, viewBox 0 0 1000 520). Se conservó Motor (núcleo, link #motor) + pipeline 01–04 (legible, cuenta spec→deploy). Cambios: la grilla plana de 8 cajas (con relleno "En desarrollo" x2) → **abanico fan-out**: conectores divergen desde un punto de salida del pipeline (600,280) hacia 7 chips (Tribai/Gobia/Kelsen/Laudos/Porkia en prod + MiMotoYa + "+ nuevas .apps" en dev) — dramatiza "un núcleo → muchas .apps". Añadido **bucle de auto-mejora** Deploy→Motor ("Cada release entrena al motor"). Teal calmado: barra de acento fina a la izquierda del chip activo en vez de círculo+check; conectores prod=teal suave #a9d6d0, dev=gris #e2dfdb dashed. Verificado aislado (/tmp/fab2.html → /tmp/fab2.png), tsc limpio, vivo en SSR.

PENDIENTE (resto lotes 3, 4, 6 — refactor PROFUNDO por diagrama, NO hacer a ciegas):
- [ ] L3 piso tipográfico 9px en los 6 SVG (motor, capacidades, legal, fabrica, infraestructura, empresas): subir fontSize <9 — REQUIERE ajustar posiciones para no solapar; hacer diagrama por diagrama con QA visual.
- [ ] L4 desaturar teal por diagrama: neutralizar bordes/headers/líneas/pills a hairline gris dejando UN acento por SVG (core/cita). NO usar replace_all (mataría los acentos intencionales).
- [ ] L6 estructural: rejillas circle→`<pattern>`, recortar pills (infra capa IA 13→5), quitar conectores/órbitas/pulsos decorativos.
Razón de no hacerlos a ciegas: las posiciones x/y de los SVG están tuneadas para el type actual; subir fontSize global o cambiar strokes con replace_all solapa texto y elimina acentos buenos. Hacer 1 diagrama a la vez con captura.

### Rediseño de gráficas a nivel Linear/Pinecone (workflow wzfcp7m33 → cerebro/supergrafo)
El usuario pidió que las 3 gráficas grandes (01 Motor, 02 Conocimiento, 03 Capacidades) sean mucho mejores, con efecto "wow". Workflow generó conceptos; el usuario pidió Motor como CEREBRO/SUPERGRAFO y unificar las 3 con lenguaje de grafo.
- [x] **01 Motor — CEREBRO/SUPERGRAFO** ✅: componente reutilizable `BrainGraph` (page.tsx, cerca de `makeBrainGraph`/`MOTOR_GRAPH`): grafo determinista (PRNG Mulberry32) de ~180 nodos + aristas a 2 vecinos cercanos, capa glow borrosa (#15dcc4), aristas teal (20% animadas con `.svg-flow`), nodos `.vec-dot` (twinkle), nodos destacados pulsantes (eco-node-pulse) + reticle de "recuperación". Layout = grid HTML `lg:grid-cols-[0.85fr_1.15fr]` (narrativa HTML a la izq, `<BrainGraph>` a la der) → en móvil APILA y el texto queda legible (resuelve el problema de texto-dentro-de-SVG). Verificado desktop 1440 + móvil 480. `BrainGraph` props: data/highlights/reticleId/uid/w/h.
- [x] **03 Capacidades** ✅: `makeClusterGraph` (4 lóbulos de ~30 nodos + nodo-hub central, `CAPAC_GRAPH`/`CAPAC_HILITE=[14,44,74,104]`, reticle=hub id 120). Layout HTML 2-col: narrativa = 4 dominios (numeral serif + nombre + métrica) + línea "nutre→genera→automatiza→retroalimenta"; `<BrainGraph>` a la derecha. Verificado.
- [x] **02 Conocimiento** ✅: `makeFlowGraph` (150 nodos, densidad sesgada a la izquierda que se abre a la derecha, `CONOC_GRAPH`; `CONOC_PRODUCTS` = 4 nodos más a la derecha como highlights). Layout: labels "Experiencia · 25 años" / "Producto" sobre el grafo full-width + legend "Cristaliza en producto: Tribai · Kelsen · Laudos · Gobia". Verificado.
- LOOK FIJADO por el usuario (no cambiar sin pedir): grafo teal uniforme, glow nebular (feGaussianBlur 5), ~20% aristas animadas (.svg-flow), nodos .vec-dot twinkle, highlights eco-node-pulse, reticle .vec-cursor. Los 3 comparten `BrainGraph`; tocar el componente afecta a los 3.
- Generadores en page.tsx (module-scope, deterministas, O(n²) a load): `makeBrainGraph` (blob), `makeClusterGraph` (lóbulos+hub), `makeFlowGraph` (flujo). Reemplazos hechos por splice de rango (python) por ser bloques SVG largos.
- PENDIENTE menor: QA móvil 480 de 02/03 (mismo patrón responsive ya verificado en 01; eyeball recomendado).
Nota: el `makeBrainGraph(seed,count,w,h)` es O(n²) a module-load (deterministico, ok). Highlights/reticle por id de nodo. Para variar cada diagrama: cambiar seed/count/región y la composición HTML.

### Interactividad nivel Linear con motion (workflows w3nyg9671 plan + wautqj9ct código)
TOOLING: `motion@12.40` instalado (import `motion/react`). `<LazyMotion features={domMax} strict>` + `<MotionConfig reducedMotion="user" transition={spring.smooth}>` envuelven el return de Home (page.tsx ~623/1900). Usar `m.*` (NO motion.*; strict). `domMax` (no domAnimation) porque el pill del nav usará layoutId.
- `src/lib/motion.ts`: presets spring (snappy/smooth/gentle/bouncy) export named + objeto `spring`; EASE_*, exitTween/revealTween; `pressable(reduced)` (whileHover y:-2 scale:1.01 + whileTap scale:0.98).
- `src/lib/use-prefers-reduced-motion.ts`: hook SSR-safe.
- globals.css tokens reescalados a escala asimétrica Linear (--motion-* enter + *-exit; --ease-out cubic-bezier(0.23,1,0.32,1)).
HECHO y verificado (compila, render OK; las animaciones/hover requieren prueba EN VIVO):
- [x] **Grafos interactivos (hover focus/dim)** — vanilla event-delegation + CSS data-attrs en BrainGraph (los 3 grafos). Hover ilumina nodo+vecinos+aristas, atenúa el resto. Gated `if(!assembled) return`.
- [x] **Scroll-assemble de los grafos** — BrainGraph ahora es m.svg con variants/whileInView(once, amount 0.4): nodos m.circle (stagger 0.004, spring, scale+opacity, NO r) + aristas m.line (pathLength 0→1). Al completar (`onAnimationComplete`) hace `setAssembled(true)` → swap a SVG plano (recupera twinkle/focus-dim sin estilos inline de Motion). Reduced-motion → estado final instantáneo.
- [x] **Springs** — hero CTAs (Ver a Kelsen, Hablemos) + nav Hablemos envueltos en `m.a` con `pressable(reducedMotion)`; `style.transitionProperty` override para que el CSS no transicione transform (motion lo controla). `const reducedMotion = !!useReducedMotion()` en Home.
HECHO (2do turno motion, integración directa — el workflow de codegen wo5ck31mz falló: agentes sin StructuredOutput):
- [x] **Barra de progreso de lectura**: `const { scrollYProgress } = useScroll()` + `m.div` fixed top-0 h-[2px] bg-teal z-[61] scaleX. En Home.
- [x] **Springs rollout**: CTAs Kelsen demo, Fábrica, y submit de contacto (`m.button`) → `pressable(reducedMotion)` + style.transitionProperty override.
- [x] **Nav pill deslizante (layoutId)**: link activo renderiza `<m.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-off-white -z-10">` (reemplaza el fondo de nav-link-active; el texto va text-ink font-semibold). Desliza entre secciones con scroll-spy (domMax cargado).
- [x] **Hero tilt 3D + glow magnético** (KelsenProof): wrapper `m.div` externo con rotateX/rotateY (useMotionValue+useSpring+useTransform, ±6°, transformPerspective 900) + onMouseMove/Leave; glow `useMotionTemplate` radial-gradient siguiendo el cursor en capa absolute. Gated por `reducedTilt = !!useReducedMotion()`. Card interior intacta.
- Imports motion ampliados: + AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useMotionValueEvent.
- [x] **Hero parallax** (KelsenProof): `const { scrollY }` + `cloudY = useTransform(scrollY,[0,800],[0,64])` (VectorCloud bg desciende lento) y `cardY = useTransform(scrollY,[0,800],[0,-30])` (card sube en contra). El `y: cardY` compone con rotateX/rotateY en el MISMO m.div de tilt (motion suma MotionValues, sin conflicto); VectorCloud bg pasó a `m.div` con `style={{ y: cloudY }}`. Gated por reducedTilt. Compila OK (tsc limpio).
- [x] **Reveal-stagger** — componentes `Reveal`/`Stagger`/`StaggerItem` (variants REVEAL_VARIANTS opacity+y20, STAGGER_PARENT staggerChildren 0.07) a nivel módulo antes de Home, con `useReducedMotion` (initial=false bajo reduced). Migradas 2 grids SIN grafo: STATS (4 métricas) y "por qué INPLUX" (3 cards). NO se tocó hero ni wrappers con BrainGraph. `.reveal`/useScrollReveal SIGUEN vivos (resto de secciones aún los usan). Compila OK.
- [x] **Announce bar centrado** — revertido el left-align del teardown Linear: `.announce-inner` justify-content center, `.announce-label` text-align center (sin margin-right auto), media móvil `justify-content center`. La X de cierre queda absolute a la derecha. Verificado visualmente (/tmp/inplux_top.png).
- [x] **Migración COMPLETA de .reveal/.stagger a motion** (script /tmp/migrate_reveal.py: matcher de profundidad de `<div>`, reemplazos sin cambiar conteo de líneas). 41 usos. Reparto:
  - **Hero copy** (eyebrow/h1/subhead/CTAs) → ESTÁTICO (sin reveal): mejor LCP, headline al instante. Card de producto (KelsenProof) → `<Reveal>`.
  - **Wrappers con BrainGraph** (Motor 970 / Conoc 1047 / Capac 1096): se quitó `reveal` del grid (el grafo se autoanima); narrativa de Motor/Capac envuelta en `<Reveal>` aparte — nunca el grafo.
  - Resto de headings/SVG-wrappers/timeline/contacto → `<Reveal>` (incl. `as="p"`); grids Tecnología + HUB → `<Stagger>`/`<StaggerItem>`.
  - **Sistema viejo ELIMINADO**: `useScrollReveal()` (hook+llamada) y CSS `.reveal`/`.reveal-left`/`.stagger`/`.visible` + override reduced-motion. `Reveal` maneja reduced-motion vía `initial={reduced?false:"hidden"}`. tsc limpio, HTTP 200, verificado (/tmp/rev_tall.png).
PENDIENTE:
- [ ] **Nav menú móvil AnimatePresence** (hoy es max-h/opacity CSS, funciona) + migrar scroll handler (setScrolled/setShowTop) a useMotionValueEvent (perf menor, no visible).
- [ ] Token CSS `--motion-reveal` quedó sin uso; inofensivo, limpiable.
NOTA: el workflow de codegen estructurado para piezas grandes de código falla (StructuredOutput con campo `codigo` enorme). Para el resto, integración directa con compile-check por paso.
GUARDRAILS (del verificador): imports unificados en un solo bloque; motion.ts exporta ambas formas; nunca envolver BrainGraph en Stagger; no migrar hero a Reveal; no borrar useScrollReveal/.reveal hasta migrar el último uso.

### Teardown visual vs Linear (capturas /tmp/linear-*.png, /tmp/teardown-sxs.png) — aplicado
Lección: Linear logra premium con whitespace, un acento a cuentagotas, left-align editorial, bordes hairline (casi sin sombras) y un screenshot de producto grande/realista. Aplicado (manteniendo light+serif+teal):
- [x] **Más aire en el hero**: `py-14 md:py-20` → `py-20 md:py-28 lg:py-36`; gaps `gap-12 lg:gap-20`.
- [x] **Disciplina de teal**: chips de la fábrica neutros (borde/texto gris) con teal solo en el punto de estado (antes pills teal-soft).
- [x] **Left-align intros**: los 6 intros `reveal mb-14 text-center` → `reveal mb-14` (sin `mx-auto` en h2/p). Más editorial.
- [x] **Sombras + logos**: Kelsen card y `.card:hover` `shadow-lg`→`shadow-md`; marquee logos 50→75s (desktop) / 30→48s (móvil).
- [x] **Producto de alta fidelidad**: la demo de Kelsen pasó de tarjeta simple a **ventana de app** (`KelsenProof`): barra de título (kelsen.io + "En producción"), sidebar (Espacio legal: Asuntos activo/Investigación/Memoria + Módulos: Tribai/Laudos/Gobia con iconos SVG), panel con breadcrumb "Asuntos / Cláusula compromisoria" + estado "Resuelto", hilo consulta (avatar CE) → respuesta (avatar K) y la cita "Fuente verificable" como héroe. `max-w-[560px]`, sidebar `hidden sm:flex` (colapsa en móvil), VectorCloud detrás a opacity-35. Verificado 1440/480.
- [ ] OPCIONAL: subir un punto la escala del H1 en desktop. La cita del demo sigue siendo ILUSTRATIVA — verificar con abogado antes de prod.

### Pulido "Pinecone-tier" (deep-research wk652gm30) — punch-list
Ya OK (no tocar): fuentes vía next/font (CLS-safe), `:focus-visible` teal ≥3:1, reduced-motion global (el per-elemento fue REFUTADO), animaciones mayormente transform/opacity, teal #0d7d74 sobre blanco = ~5:1 (pasa AA), SVGs con viewBox (reservan alto → sin CLS).
- [x] **P0 contraste**: `--gray-400` #8a8784 (3.6:1, fallaba) → #76716a (~4.8:1, pasa AA). Hecho.
- [x] **P1 motion**: tokens en `:root` (`--motion-fast/base/moderate/reveal`, `--ease-out/standard/in`); scroll-reveal 650→450ms; hovers de `.btn-dark/.btn-ghost` (standard 200ms) y `.card` (ease-out 240ms) sistematizados. Hecho.
- [x] **P1 measure**: los 3 párrafos intro de sección `max-w-2xl` → `max-w-xl` (~65ch). Hecho. (Quedan los 2 subtítulos de timeline en md:max-w-2xl, left-aligned — OK.)
- [x] **P2**: `node-pulse` ahora solo anima opacity (antes `r`); numeral del kicker `gray-300`→`gray-400` (legible). Serif: revisado, ya en spec (no se tocó). Pendiente menor: `svg-flow`/`glow-teal` (stroke-dashoffset/filter) se dejaron — costo bajo y son efectos deliberados.
- [ ] Confirmar la **hamburguesa móvil** en un teléfono real (QA dejó marcado como artefacto de headless en ≤460 px; necesita verificación de dispositivo).
- [ ] Variantes móviles de los diagramas densos (texto 7–8 px hoy queda chico con scroll horizontal).
- [ ] Pausar animaciones fuera de viewport (perf/batería) — IntersectionObserver con clase `paused`.
- [ ] Sombra (svg-card) también en tarjetas de aliados secundarios (Think IT, BBD, Alianza IT) para uniformidad total.
- [ ] Cuando el hero Pinecone-style esté validado: commit + push + opcionalmente PR / merge a `main`.

## Bloqueos
ninguno activo. Punto abierto del QA anterior: hamburguesa móvil invisible en headless `--window-size` ≤ 460; con `!flex !important` tampoco aparecía → casi certero artefacto de headless. Necesita verificación de dispositivo real para descartarlo 100%.

## Setup notes
- **Env vars necesarias**: ninguna nueva.
- **Comandos para reanudar entorno**:
  ```bash
  cd /Users/cristianespinal/Projects/inplux-web-gh
  git checkout feature/graphics-startup
  git status -sb           # debería listar globals.css y page.tsx modificados
  PORT=3001 npm run dev    # :3000 lo tiene Atlas Urabá; INPLUX va en :3001
  open http://localhost:3001
  ```

## Prompt para reanudar

> Pegá esto en una sesión nueva de Claude Code para continuar exactamente donde quedó.

```
Estoy retomando el rediseño Pinecone-tier de inplux-web en `/Users/cristianespinal/Projects/inplux-web-gh`. Branch actual: `feature/graphics-startup`.

Contexto: ya tengo el hero rediseñado estilo Pinecone-híbrido (texto serif italic + vector cloud nebular a la derecha + tech-grid + brackets en CTAs) funcionando en localhost:3001 (el :3000 lo ocupa Atlas Urabá). Producción (inplux.co, rama main en 2a8a256) tiene el glow-up de diagramas y og-image, pero NO el hero Pinecone. Los cambios del hero están sin commitear en globals.css y page.tsx.

Lo último que se hizo: ajustar el headline del hero a text-[2.1rem] en móvil para que "construimos." no se corte. Capturas validadas en 1440px y 390px.

El siguiente paso concreto es: decidir con el usuario qué move Pinecone aplico ahora — (a) announcement bar arriba, (b) search icon + reforzar CTA en nav, (c) brackets a los CTAs de Frente 1/2 y contacto, (d) extender tech-grid a más secciones. Antes de tocar, levantar dev con `PORT=3001 npm run dev` y abrir http://localhost:3001.

Lee primero `HANDOFF.md` en la raíz del proyecto para el detalle completo.
```
