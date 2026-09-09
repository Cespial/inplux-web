# INPLUX · Instagram — sistema de diseño

> Fuente de verdad: **inplux.co en producción** (`src/app/layout.tsx`, `src/app/tokens/*.css`,
> `src/content/copy/es.ts`, `src/content/home.ts`, `src/content/work.ts`, `src/content/press.ts`).
> Los documentos `brand/INPLUX-Brand-Identity.md` y `design-system/readme.md` están
> desactualizados (posicionamiento y tipografía anteriores) y **no gobiernan** este sistema.
> Este archivo es el insumo de `/design` para cada tanda nueva de publicaciones.

Última revisión: 2026-09-08.

---

## 1. Posicionamiento y voz

**Qué somos en Instagram:** una fábrica de software a la medida. Los productos
(Tribai, Gobia, Kelsen, Laudos, Porkia) no se venden en el feed: se **enseñan como
evidencia** de que llevamos un problema real a software en producción.

**Tesis (literal del sitio, no se reescribe):**
> De un problema real a software en producción.

**Remate (literal):**
> La IA acelera el trabajo. Personas expertas dirigen y validan las decisiones críticas.

**Eyebrow canónico:** `FÁBRICA DE SOFTWARE A LA MEDIDA` (puede cerrar con `· MEDELLÍN`).
Los kickers de método y servicios van como `FÁBRICA / …`, sin la numeración de secciones del
sitio: en Instagram un `02 /` se lee como número de publicación.
**Pie canónico:** «Software con criterio y dirección humana.»

**Voz:** primera persona plural. Frases cortas, con verbo. Sin hipérbole, sin promesas.
Mostramos lo hecho, con fecha. Colombiano, sobrio, experto. **Cero emoji.**
CTA: «Hablemos» o el enlace del perfil. Nunca «Cotiza», «Compra», «Agenda ya».

**Frases prohibidas** (las bloquea `scripts/verify-public-content.mjs` en el sitio; aquí
aplican igual): «hub de inteligencia tributaria», «tributaristas que construyen
tecnología», y cualquier autodescripción como consultora, holding o «integramos
finanzas, gestión y tecnología».

---

## 2. Formatos

| Pieza | Tamaño | Notas |
|---|---|---|
| Publicación en feed | **1080 × 1350** (4:5) | Formato único del feed. Instagram recorta la miniatura del grid a 3:4: el contenido esencial vive dentro de los **1080 × 1200 centrales** (75 px de aire arriba y abajo). |
| Carrusel | 1080 × 1350 por lámina | Máximo 6 láminas. Primera lámina = titular; última = pie con enlace. |
| Historia / Reel | 1080 × 1920 | Zonas seguras: 250 px arriba, 320 px abajo. |
| Avatar | 1080 × 1080 | Disco ink con la marca Estratos al 62 % del ancho (`avatar-inplux-1080.png`). |
| Portada de highlight | 1080 × 1080 | Disco ink, símbolo Estratos mono blanco al 40 %. |

---

## 3. Tokens (a escala 1080)

### Color
Dos superficies, como el sitio. Teal **solo** como acento: una palabra, una barra, un dato.

| Rol | Papel (claro) | Tinta (oscuro) |
|---|---|---|
| Fondo | `#f8f8f7` off-white | `#1a1918` ink (nunca `#000`) |
| Texto principal | `#1a1918` | `#ffffff` |
| Texto secundario | `#6e6b68` | `#a8a5a0` |
| Divisor | `#e5e3e0` | `rgba(255,255,255,.14)` |
| Acento | `#0d7d74` teal | `#15dcc4` teal-bright |
| Tarjeta / marco | `#ffffff` | `#282726` |
| Barra de navegador | `#f3f1ee` | `#3d3b39` |

Prohibido: verde lima, degradados, fondos fríos o azulados, sombras duras.

### Tipografía (Google Fonts en /design; locales en el sitio)
| Rol | Fuente | Peso | Tamaño | Interlínea | Tracking |
|---|---|---|---|---|---|
| Titular | **Newsreader** (opsz 72) | 300 | 96–128 px | 1.02 | −0.02em |
| Palabra acentuada | Newsreader *italic* | 300 | = titular | | color acento |
| Kicker / eyebrow | **Geist** | 500 | 26 px | 1 | +0.08em, MAYÚSCULAS, separador `·` o `/` |
| Cuerpo | Geist | 300–400 | 30–34 px | 1.4 | 0 |
| Texto de ítem en listas | Geist | 300 | 26 px | 1.35 | 0 |
| Título de ítem | Newsreader | 300 | 48–56 px | 1.1 | −0.01em |
| Meta / pie / URL | **Geist Mono** | 400 | 22–24 px | 1 | 0 |
| Wordmark | Geist | 600 | 26 px | 1 | +0.14em, `INPLUX` |

Regla firma del sitio: un titular en serif con **exactamente una** palabra en itálica de color acento.
Los titulares terminan en punto. **Excepción:** los títulos de prensa y de columnas ajenas se citan tal
cual; solo se acentúa una palabra cuando el título es nuestro. Un título largo de prensa puede bajar a 88 px.

### Retícula
- Margen: **88 px** en los cuatro lados. Columna útil: 904 px.
- Ritmo vertical: múltiplos de 8. Gap kicker → titular: 40 px.
- Marcos: radio 14 px, borde 1 px. Botones o pills: radio 8 px o cápsula.
- Nada por encima de 16 px de radio.

---

## 4. Anatomía de una publicación

```
┌ 88 px ─────────────────────────────┐
│ KICKER · CONTEXTO                  │  Geist 500 26 px mayúsculas
│                                    │
│ Titular en Newsreader 300          │  una palabra en itálica acento
│ que termina en punto.              │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ ● app.tribai.co              │   │  marco de navegador con URL real
│ │ [captura real del producto]  │   │
│ └──────────────────────────────┘   │
│                                    │
│ meta · fecha de captura   ▬▬ INPLUX│  Geist Mono + lockup
└────────────────────────────────────┘
```

El lockup del pie es **símbolo Estratos (44 px) + `INPLUX`**. En el post de marca sola el
símbolo va grande (≥ 300 px) y el pie lleva solo el wordmark, sin el lockup pequeño.

---

## 5. Familias de publicación

| Familia | Superficie | Qué lleva | Regla de honestidad |
|---|---|---|---|
| **Marca** | Tinta | Símbolo grande + tesis literal | 1 de cada 9 publicaciones, no más. |
| **Trabajo** (producto real) | Papel (1 de 4 en tinta) | Kicker `TRABAJO / SECTOR · ESTADO`, titular de `work.ts`, captura real en marco con URL, pie con fecha de captura | Solo capturas del acta `public/work/real-pages/capture-manifest.json`. Estado tal cual el sitio: Público, Piloto activo, Beta abierta, Por solicitud, En desarrollo. |
| **Prensa** (externa) | Tinta | Titular de la pieza en serif, medio, fecha | Solo piezas con `editorialStatus` externo. |
| **Columna** (firmada) | Tinta o papel | Título de la columna, autor, medio, fecha | Kicker dice `COLUMNA / AL PONIENTE`. Es publicación del equipo, nunca se presenta como cobertura. |
| **Método / Qué construimos** | Papel o tinta | Lista numerada 01–04 con copy literal de `home.ts` | Sin cifras inventadas. |
| **Equipo** | Papel | Fotografía real, nombre completo, rol | Requiere foto real. Sin foto real no se publica. |
| **Evento** (Día D, paneles) | Tinta | Fecha, lugar, rol de INPLUX | Datos verificados en la fuente del evento. |

---

## 6. Ritmo del grid

- Se piensa en **tandas de 9** (3 filas). En cada tanda: 4 Trabajo, 2 Prensa/Columna,
  2 Método/Qué construimos/Equipo, 1 Marca.
- Alternar tinta y papel para que el grid no forme bloques del mismo tono.
- La primera tanda (2026-09-09 → 2026-09-28) está en `canvas/` y su orden en `CAPTIONS.md`.
- Nunca dos publicaciones seguidas del mismo producto.

---

## 7. Imagen

1. **Capturas reales** de producto, siempre en marco de navegador con la URL viva y la
   fecha del acta en el pie. Son la prueba. Nunca mockups inventados.
2. **Fotografía real** de eventos y personas: color natural o blanco y negro. Sin tinte.
3. **Imagen generada (Midjourney)** solo como **textura o atmósfera**, en la línea de las
   que ya usa el sitio (`public/brand/about/*.webp`: bodegones de papel y aluminio,
   arquitectura entre niebla). Nunca personas generadas, nunca «oficina feliz» de stock.
4. Prohibido: fotos de stock teñidas, flechas decorativas, íconos emoji, mosaicos de logos.

---

## 8. Captions

- Primera línea = el titular o un hecho concreto. Sin «¡Hola comunidad!».
- 2 a 5 frases. Una sola idea. Termina con la URL viva o con «Hablemos».
- Texto alternativo (alt) en cada imagen: qué se ve, sin adjetivos.
- Hashtags: máximo 5, al final, en minúsculas. Fijos: `#fábricadesoftware #medellín`.
  Rotativos según la pieza: `#legaltech #govtech #softwarealamedida #ia`.
- Etiquetar solo cuentas reales involucradas (medio, evento, aliado, cliente).
- Sin emoji. Sin mayúsculas sostenidas fuera del kicker.

---

## 9. Video (fase posterior)

Referencia del usuario: video de presentación al estilo de la cuenta de Harvey. Pipeline
previsto: guion → locución **ElevenLabs** (voz neutra colombiana, sin música épica) →
planos **Midjourney** solo de textura y arquitectura + capturas de pantalla reales
grabadas → montaje con el sistema tipográfico de este documento (Newsreader para las
frases, Geist Mono para los datos). Duración objetivo: 45–60 s. Sin voz sobre
personas generadas. El post de referencia (`/p/DcL1zDnnA_x/`) no se pudo leer sin sesión:
pendiente describirlo o guardarlo antes de guionizar.

---

## 10. Archivos

```
brand/instagram/
├── DESIGN.md                  ← este documento
├── PERFIL.md                  ← nombre, bio, categoría, enlace, highlights, a quién seguir
├── METRICOOL.md               ← conexión, calendario y checklist
├── CAPTIONS.md                ← textos, alt y hashtags de la primera tanda
├── avatar-inplux-1080.png     ← avatar listo para subir
├── avatar-inplux-1080.svg
├── avatar-inplux-preview-circle.png
└── canvas/                    ← artboards de /design (fuente de la primera tanda)
    ├── build-artboards.py     ← genera los .dc.html
    ├── *.dc.html              ← un artboard por publicación
    ├── canvas.json
    └── img/                   ← capturas reales reducidas (< 70 KB)
```
