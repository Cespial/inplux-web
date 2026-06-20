# INPLUX — Brief para Claude Design

> Paquete de insumos para generar/expandir activos de marca. Todo lo aquí descrito
> debe ser **coherente con el sistema existente** (Editorial White System v3).
> No inventar una estética nueva.

---

## 1. Qué es INPLUX
- **Tagline:** *"Tributaristas que construyen tecnología."*
- Hub de inteligencia tributaria, consultoría financiera, IA y transformación digital.
- +25 años · +50 municipios · +100 proyectos · Medellín, Colombia · desde 2000.
- Tono: experto pero accesible, sobrio, moderno con raíz, colombiano. CTA: **"Hablemos"**.
- Productos: Tribai.co (estrella), Gobia, Fourier, Sistemas Aries, Think IT.

## 2. Sistema visual (USAR EXACTO)

### Color
| Token | Hex | Uso |
|-------|-----|-----|
| ink | `#1a1918` | texto, botones, fondo oscuro (NUNCA negro puro) |
| teal | `#0d7d74` | acento de marca (solo acento, no dominante) |
| teal-bright | `#15dcc4` | highlight sobre oscuro |
| teal-soft | `#e8f5f3` | fondo teal suave |
| white | `#ffffff` | fondo principal |
| off-white | `#f8f8f7` | secciones alternas |
| neutros | `#e8e6e3 #d1cfcc #a8a5a0 #8a8784 #6e6b68 #545250 #3d3b39 #282726` | escala cálida |
| border | `#e5e3e0` | divisores |

Ver `tokens.json` para el set completo.

### Tipografía
- **Display:** Instrument Serif (Regular + Italic) — titulares. Italic en teal para resaltar una palabra.
- **Body/UI:** Plus Jakarta Sans (300–800). Labels en uppercase + letter-spacing 0.08em.
- TTFs incluidos en `/fonts`. También en Google Fonts.

### Símbolo
- Marca **"Estratos"**: 3 barras ascendentes redondeadas (la superior teal) = *capas de la norma* + *impulso*. (Reemplazó al triángulo sólido, retirado abr-2026.)
- App-icon: cuadrado redondeado ink + barras blancas/teal-bright.

## 3. Qué YA está hecho (en este zip, `/logos /favicon /og`)
- ✅ Logo vectorial: símbolo, wordmark, lockups (horizontal/apilado, positivo/inverso/mono) — SVG.
- ✅ Set de favicon completo (16→512), maskable, favicon.ico, app-icon.svg.
- ✅ 4 plantillas OG 1200×630 (default, Tribai, Nosotros, Sector público) — PNG + SVG editable.
- ✅ Brandbook vivo (ruta `/marca` en el repo).

## 4. Qué falta / qué pedimos a Claude Design (TODO)
1. **Iconografía de producto** — set de íconos de línea (consultoría, IA, hacienda, municipios, datos) coherente con el trazo del símbolo. ~16–24 íconos SVG.
2. **Ilustración / spot graphics** — sistema de gráficos abstractos (estratos/órbitas teal) para secciones y blog.
3. **Plantillas OG extra** — una por cada producto restante (Gobia, Fourier, Aries) y plantilla "artículo de blog" con título dinámico.
4. **Banners sociales** — LinkedIn (cover 1584×396) + avatar 400×400 + plantilla post cuadrado 1080×1080 y story 1080×1920.
5. **Firma de correo** (HTML) + plantilla de presentación (portada + 2 layouts de slide).
6. **Papelería** — membrete carta y tarjeta de presentación (frente/reverso).
7. **Variantes de logo faltantes** — versión de una sola línea para favicon-text, y co-branding con aliados (lockup "INPLUX × aliado").

## 5. Reglas de uso (Sí/No)
- SÍ ink para texto · teal solo como acento · Instrument Serif solo titulares · radios 8px (botón) / 14px (card) · sombras sutiles · touch ≥44px.
- NO negro puro · NO teal dominante · NO fuentes alternativas · NO fondos fríos/azulados · NO esquinas >16px.

---
*Detalle completo en `INPLUX-Brand-Identity.md`. Fuentes en `/fonts`. Referencia del sitio en `/referencia`.*
