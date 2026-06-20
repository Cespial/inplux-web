# INPLUX S.A.S. — Identidad de Marca

> **Tributaristas que construyen tecnologia.**
> Hub de inteligencia tributaria, consultoria y tecnologia con IA. +25 anos de experiencia en Colombia.

---

## 1. Esencia de Marca

| Atributo | Valor |
|----------|-------|
| **Nombre legal** | INPLUX S.A.S. |
| **Dominio** | inplux.co |
| **Fundacion** | 2000 |
| **Sede** | Calle 23 # 43 A 66, Local 141 — Medellin, Antioquia, Colombia |
| **Contacto** | (+57) 313 889 36 15 · gerencia@inplux.co |
| **Locale** | es_CO |

### Tagline principal
**"Tributaristas que construyen tecnologia"**

### Subtitulo
Hub que integra consultoria tributaria y financiera, inteligencia artificial y transformacion digital.

### Cifras de autoridad
+25 anos · +50 municipios · +100 proyectos · Creadores de Tribai.co

---

## 2. Pilares de Marca

### Filosofia (3 pilares)
1. **"Primero la norma, despues el codigo"** — El conocimiento regulatorio guia la tecnologia.
2. **"Entregamos productos, no horas de consultoria"** — Entrega orientada a producto.
3. **"Medimos impacto, no cobramos por estar"** — Enfoque en resultados.

### Valores (3 valores)
1. **Integracion** — Conectamos consultoria, tecnologia e inteligencia artificial en una sola propuesta de valor.
2. **Inteligencia** — 25 anos de conocimiento tributario y financiero convertidos en modelos de IA y productos digitales.
3. **Impulso** — Aceleramos la transformacion de las organizaciones con soluciones que generan resultados medibles.

### Mision
Acompanar a nuestros clientes en el logro de sus metas institucionales y empresariales, integrando servicios de consultoria de alta calidad con soluciones tecnologicas innovadoras.

---

## 3. Paleta de Color

### Sistema: Editorial White System v3

#### Colores primarios

| Token | Hex | Uso |
|-------|-----|-----|
| `--white` | `#ffffff` | Fondo principal |
| `--off-white` | `#f8f8f7` | Fondo secundario / secciones alternas |
| `--warm-50` | `#f3f1ee` | Neutro calido |
| `--ink` | `#1a1918` | Texto principal, botones primarios |
| `--teal` | `#0d7d74` | Acento de marca — enlaces, hover, focus, tecnologia |
| `--teal-soft` | `#e8f5f3` | Fondo teal suave |

#### Escala de grises (neutrales calidos)

| Token | Hex |
|-------|-----|
| `--gray-100` | `#e8e6e3` |
| `--gray-200` | `#d1cfcc` |
| `--gray-300` | `#a8a5a0` |
| `--gray-400` | `#8a8784` |
| `--gray-500` | `#6e6b68` |
| `--gray-600` | `#545250` |
| `--gray-700` | `#3d3b39` |
| `--gray-800` | `#282726` |
| `--gray-900` | `#1a1918` |
| `--gray-950` | `#0d0c0c` |

#### Bordes y divisores

| Token | Hex |
|-------|-----|
| `--border` | `#e5e3e0` |
| `--border-light` | `#f0eeeb` |

#### Sombras

| Token | Valor |
|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.03)` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)` |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.05)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,0.07)` |

#### Selection
```css
::selection { background: rgba(13, 125, 116, 0.12); color: #0d0c0c; }
```

---

## 4. Tipografia

### Display (titulos, headings, brand statements)
- **Familia:** Instrument Serif (Google Fonts)
- **Peso:** 400 (Regular)
- **Estilos:** Normal, Italic
- **CSS Variable:** `--font-serif`
- **Fallback:** `"Instrument Serif", Georgia, serif`

### Body (texto, navegacion, UI)
- **Familia:** Plus Jakarta Sans (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700, 800
- **CSS Variable:** `--font-body`
- **Fallback:** `"Plus Jakarta Sans", system-ui, sans-serif`

### Escala tipografica

| Elemento | Tamano mobile | Tamano desktop |
|----------|--------------|----------------|
| H1 (hero) | `2.25rem` (36px) | `5rem` (80px) |
| H2 (seccion) | `2rem` (32px) | `2.75rem` (44px) |
| H3 (subseccion) | `1.15rem` (18.4px) | `1.15rem` (18.4px) |
| Body | `1rem` (16px) | `1.25rem` (20px) |
| Label (uppercase) | `0.6875rem` (11px) | `0.6875rem` (11px) |
| Button | `0.875rem` (14px) | `0.875rem` (14px) |

### Regla tipografica
- Headings siempre en **Instrument Serif** (`.font-serif`)
- Body siempre en **Plus Jakarta Sans**
- Labels en uppercase con `letter-spacing: 0.08em`, peso 500-600
- Antialiasing: `-webkit-font-smoothing: antialiased`

---

## 5. Componentes UI

### Boton Primario (`.btn-dark`)
```css
background: #1a1918;     /* --ink */
color: #ffffff;
font-weight: 600;
font-size: 0.875rem;
padding: 12px 24px;
min-height: 44px;
border-radius: 8px;
letter-spacing: 0.01em;
/* Hover: bg #282726, shadow-md, translateY(-1px) */
```

### Boton Secundario (`.btn-ghost`)
```css
background: transparent;
color: #1a1918;          /* --gray-900 */
border: 1px solid #e5e3e0; /* --border */
font-weight: 600;
font-size: 0.875rem;
padding: 12px 24px;
min-height: 44px;
border-radius: 8px;
/* Hover: bg off-white, border gray-200, translateY(-1px) */
```

### Cards (`.card`)
```css
background: #ffffff;
border: 1px solid #e5e3e0; /* --border */
border-radius: 14px;
padding: 2rem;
/* Hover: border gray-200, shadow-lg, translateY(-2px) */
```

### Navegacion (`.nav-wrap`)
```css
background: rgba(255, 255, 255, 0.88);
backdrop-filter: blur(16px) saturate(1.3);
/* Al scroll: border-bottom --border, shadow-xs */
```

### Form Inputs (`.form-input`)
```css
background: #ffffff;
border: 1px solid #e5e3e0;
border-radius: 8px;
padding: 14px 16px;
min-height: 48px;
/* Focus: border gray-800, box-shadow 0 0 0 3px rgba(0,0,0,0.04) */
```

---

## 6. Animaciones y Movimiento

| Animacion | Duracion | Uso |
|-----------|----------|-----|
| Scroll Reveal (fade up) | 0.65s | Secciones al hacer scroll |
| Scroll Reveal (fade left) | 0.65s | Elementos laterales |
| Stagger children | +80ms por hijo | Listas y grids |
| Logo carousel | 50s (30s mobile) | Scroll continuo de logos |
| Card hover lift | 0.3s | Elevacion al hover |
| Button hover lift | 0.2s | Micro-elevacion |
| SVG orbit | 20s | Diagrama ecosistema |
| SVG node pulse | 3s | Nodos del ecosistema |
| SVG glow teal | 4s | Resplandor teal |
| Float gentle | 6s | Elementos flotantes |

**Easing:** `cubic-bezier(0.25, 1, 0.5, 1)` (para reveals)

**Reduced Motion:** Todas las animaciones se desactivan con `prefers-reduced-motion: reduce`.

---

## 7. Logos y Assets

### Símbolo — "Estratos" (barras ascendentes ↗)
Tres barras horizontales redondeadas que ascienden en escalera = *capas de la norma*
(estratos del estatuto) + *impulso* (momento ascendente). La barra superior es el acento
teal. Es el símbolo primario; **reemplazó al triángulo sólido (retirado abr-2026)** porque
el triángulo leía demasiado cerca de defaults genéricos.

### Sistema de logo (SVG vectorial — `brand/logos/`)
| Archivo | Uso |
|---------|-----|
| `inplux-mark-teal.svg` | Símbolo primario (barras ink, superior teal) — fondo claro |
| `inplux-mark-white.svg` | Símbolo sobre oscuro (barras blancas, superior teal-bright) |
| `inplux-mark-ink.svg` / `inplux-mark-flux-teal.svg` | Mono ink / dos tonos teal |
| `inplux-logo-horizontal.svg` | Lockup horizontal (símbolo + wordmark) — positivo |
| `inplux-logo-horizontal-inverse.svg` | Lockup horizontal sobre oscuro |
| `inplux-logo-horizontal-mono(-white).svg` | Lockup mono (claro / oscuro) |
| `inplux-logo-stacked(-inverse).svg` | Lockup apilado |
| `inplux-wordmark-ink.svg` / `-white.svg` | Solo wordmark (paths) |
| `inplux-appicon.svg` / `inplux-appicon-maskable.svg` | App icon (tile ink + barras) |

### Favicon e iconos (`brand/favicon/`)
`favicon.ico` + PNG 16→512, `icon-180.png` (apple-touch), `maskable-512.png` — todos
regenerados desde la marca Estratos. Servidos vía App Router (`src/app/icon.svg`,
`apple-icon.png`, `favicon.ico`) + `manifest.ts`.

### Plantillas OG (`brand/og/`)
1200×630, una por producto/sección (default, Tribai, Nosotros, Sector público) — PNG +
SVG editable. Tema oscuro: serif + acento teal + chips + marca Estratos.

### Video hero (`brand/video/`)
`hero.webm` (moderno) + `hero.mp4` (fallback).

### Logos de clientes/aliados (carousel — `public/logos/`)
Vegachí (Hospital San Camilo de Lelis), Hospital San Pío X, Politécnico Colombiano JIC,
Cisneros, Alcaldía de Andes, CIS, Parque Arví, Think IT, Alianza IT, EDU, Sistemas Aries,
Navarro Ospina, Rentan, entre otros.

> El sistema vivo completo (tokens, componentes, UI kits) está en `design-system/`;
> `design-system/readme.md` es la guía canónica. El brandbook navegable vive en `/marca`.

---

## 8. Ecosistema de Productos

| Producto | Descripcion |
|----------|-------------|
| **Tribai.co** | Inteligencia tributaria y financiera con IA (producto estrella) |
| **Gobia** | Plataforma de gobernanza municipal |
| **Fourier** | Arquitectura de software e infraestructura cloud (fourier.dev) |
| **Sistemas Aries** | ERP financiera modular (+31 anos) |
| **Think IT** | Ingenieria de software y consultoria tech |
| **BBD Soluciones** | Analitica de datos e inteligencia de negocios |
| **Alianza IT** | Integracion tecnologica y servicios IT |
| **Observatorio de Datos** | Datos y analitica para toma de decisiones |

---

## 9. Estructura Organizacional

- Direccion de Consultoria Tributaria & Financiera
- Direccion de Tecnologia & Producto
- Direccion de Gestion de Proyectos
- Direccion Institucional & Gobernanza

---

## 10. Tono y Voz

### Personalidad
- **Experto pero accesible** — 25 anos de conocimiento, comunicado con claridad.
- **Confiable y sobrio** — Sin hiperboles. Los datos y resultados hablan.
- **Moderno pero con raiz** — Tecnologia de punta anclada en conocimiento regulatorio profundo.
- **Colombiano** — Lenguaje local, contexto local, problemas locales.

### Principios de comunicacion
1. Liderar con la experiencia, no con el producto.
2. Preferir verbos de accion sobre sustantivos abstractos.
3. Usar "nosotros" inclusivo — el cliente es parte del equipo.
4. CTA principal: **"Hablemos"** (no "Cotizar", no "Comprar").
5. Nunca prometer — mostrar lo que ya se hizo (+50 municipios, +100 proyectos).

### Manifiesto
> *"Nuestra historia empezo en la gestion tributaria. Llevamos 25 anos entre estatutos, NIC/NIIF y hacienda publica colombiana. Hoy convertimos ese conocimiento en tecnologia e inteligencia artificial."*

> *"Tributaristas y financieros que escriben codigo."*

---

## 11. Reglas de Uso

### Si / No

| Si | No |
|----|-----|
| Usar `--ink` (#1a1918) para texto, nunca negro puro (#000000) | Usar negro puro en ningun contexto |
| Usar `--teal` (#0d7d74) como acento de tecnologia/innovacion | Usar teal como color dominante — siempre es acento |
| Instrument Serif para headings | Instrument Serif para body text |
| Plus Jakarta Sans para body/UI | Fuentes alternativas sin autorizacion |
| Fondos blancos calidos (`--white`, `--off-white`) | Fondos frios o azulados |
| Sombras sutiles y progresivas | Sombras duras o muy oscuras |
| Border-radius 8px (botones) o 14px (cards) | Esquinas muy redondeadas (>16px) o cuadradas |
| Minimo 44px para touch targets | Botones o enlaces mas pequenos que 44px |
| `cubic-bezier(0.25, 1, 0.5, 1)` para transiciones | Easings lineales o bruscos |

---

*Documento generado a partir de inplux-web (Editorial White System v3). Abril 2026.*
