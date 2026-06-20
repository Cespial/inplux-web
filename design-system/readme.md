# INPLUX — Design System

> **"Tributaristas que construyen tecnología."**
> *(Tax experts who build technology.)*
> The **Editorial White System v3** — warm white surfaces, ink text, teal as accent.

INPLUX S.A.S. is a Medellín, Colombia tax-intelligence and technology hub: 25+ years
of tributary/financial consulting converted into AI agents and digital products.
Authority figures: **+25 años · +50 municipios · +100 proyectos**. Founded 2000.
Flagship product **Tribai.co**; ecosystem includes Gobia, Fourier, Sistemas Aries,
Think IT, BBD Soluciones, Observatorio de Datos.

This design system reproduces that visual language so agents can generate on-brand
interfaces, slides, marketing pages and assets. **Do not invent a new aesthetic** —
everything here is coherent with the existing system.

## Source materials
This project was built from the official **INPLUX Brand Kit** (`uploads/INPLUX-brand-kit.zip`):
- `BRIEF-CLAUDE-DESIGN.md` — design brief (what's done / TODO).
- `INPLUX-Brand-Identity.md` — full identity doc (color, type, components, tone).
- `tokens.json` — machine-readable token set.
- `/logos`, `/favicon`, `/og`, `/fonts` — vector logos, favicon set, OG templates, TTF webfonts.
- `referencia/og-image-actual.png` — live-site reference frame.

Originating product: **inplux-web** (the marketing site at inplux.co). The brandbook
lives at route `/marca` in that repo. No live codebase or Figma was attached — visuals
were reconstructed from the brand kit assets and reference frames above.

---

## CONTENT FUNDAMENTALS — voice & copy

**Language:** Spanish (es_CO), Colombian. Sober, expert-but-accessible, no hyperbole.
The data and results speak. Modern but rooted; technology anchored in deep regulatory
knowledge.

**Person:** Inclusive **"nosotros"** — the client is part of the team. Address the
reader with confidence, never salesy.

**Casing:** Sentence case for body and most headings. **UPPERCASE** only for tracked
labels/eyebrows (`letter-spacing: 0.08em`) and the wordmark `INPLUX` (tracked ~0.14em).

**Punctuation motif:** Headlines often end in a **period** and split a statement across
two clauses, emphasising ONE word set in *italic teal*:
- *"La norma la conocemos. La tecnología la **construimos**."*
- *"Inteligencia tributaria que **aprende**."*
- *"Tributaristas que construyen tecnología."*

**Eyebrows / kickers** use middot separators, uppercase, muted:
`AGENTES DE IA · CEREBRO LEGAL · FÁBRICA DE SOFTWARE` · `PRODUCTO · TRIBAI.CO`

**Pillars (verbatim, useful as copy blocks):**
1. "Primero la norma, después el código."
2. "Entregamos productos, no horas de consultoría."
3. "Medimos impacto, no cobramos por estar."

**Manifesto line:** *"Tributaristas y financieros que escriben código."*

**CTA:** Always **"Hablemos"** — never "Cotizar", "Comprar", "Get started".

**Lead with experience, not the product.** Prefer action verbs over abstract nouns.
Never promise — show what was already done (+50 municipios, +100 proyectos).

**Emoji:** None. Not part of the brand. Use tracked labels, middots and the triangle
mark instead of decorative emoji.

---

## VISUAL FOUNDATIONS

**Color vibe.** Two worlds. (1) **Editorial white** — warm whites (`--white #ffffff`,
`--off-white #f8f8f7`, `--warm-50 #f3f1ee`), ink text (`--ink #1a1918`, never pure
black), a warm-grey neutral scale. (2) **Dark ink** — near-black warm background
(`--ink` / `--gray-950 #0d0c0c`) with a subtle **teal radial glow** and a faint dotted
texture. **Teal is ACCENT ONLY** (`--teal #0d7d74`; `--teal-bright #15dcc4` on dark;
`--teal-soft #e8f5f3` fills). Never let teal dominate. **Never cold/bluish** anything.

**Typography.** Display = **Instrument Serif** 400 (normal + italic), headings only,
slightly tightened tracking (`-0.02em`), line-height ~1.02. Body/UI = **Plus Jakarta
Sans** 300–800. Labels uppercase, weight 500–600, `letter-spacing 0.08em`. The signature
move: a serif headline with exactly one word in *italic teal*.

**Spacing.** 8px base rhythm; generous editorial section padding
(`--section-y: clamp(4rem … 9rem)`). Default page width `--container-lg 72rem`.

**Backgrounds.** Mostly flat warm white. Alternate sections in `--off-white`. Dark
sections use ink with a teal radial glow + low-opacity dotted grid (NOT gradients of
blue/purple). No photographic hero by default; the hero motif is the **orbit graphic**
(see Iconography).

**Borders.** Hairline `--border #e5e3e0` (or `--border-light` for subtler). On dark,
`rgba(255,255,255,0.12)`.

**Radii.** 8px buttons/inputs (`--radius-sm`), 14px cards (`--radius-lg`), 16px max —
**never exceed 16px** on rectangles; pills/capsules use `--radius-pill` (full).

**Shadows.** Subtle, progressive, warm-neutral — `--shadow-xs … --shadow-lg`
(`0 12px 40px rgba(0,0,0,0.07)` is the heaviest). No hard or very-dark shadows.
Focus ring: `0 0 0 3px rgba(13,125,116,0.18)`.

**Cards.** White, 1px `--border`, 14px radius, ~2rem padding. Hover: border → `--gray-200`,
`--shadow-lg`, `translateY(-2px)`.

**Capsules / pills.** Full-radius outline pills, often with the number/keyword in teal:
`+25 años`, `+50 municipios`, `+100 proyectos` · tag pills `IA tributaria · NIC/NIIF`.

**Nav.** Frosted: `rgba(255,255,255,0.88)` + `backdrop-filter: blur(16px) saturate(1.3)`;
on scroll gains a `--border` bottom + `--shadow-xs`. Transparency/blur is used here and
sparingly elsewhere — not everywhere.

**Animation.** Easing `cubic-bezier(0.25, 1, 0.5, 1)`. Scroll reveals = fade-up/left
0.65s, stagger +80ms/child. Hover lifts: buttons `translateY(-1px)` 0.2s, cards
`translateY(-2px)` 0.3s. Decorative: orbit 20s, node pulse 3s, teal glow 4s, gentle
float 6s. **All disabled** under `prefers-reduced-motion: reduce`. No bounces, no linear
easings.

**Hover states.** Primary button bg `--ink → --gray-800` + shadow-md + lift. Ghost
button bg → `--off-white`, border → `--gray-200`. Links → `--teal`.

**Press states.** Settle the lift back to 0 (no shrink/scale gimmicks).

---

## ICONOGRAPHY

**The mark — “Estratos” (ascending bars ↗).** Three rounded horizontal bars rising in a
staircase = *capas de la norma* (layers of the statute) + *impulso* (upward momentum).
The top bar is the teal accent. This is the primary symbol; it replaced the earlier solid
triangle (retired April 2026) because the triangle read too close to generic defaults.
Forms in `assets/logos/`:
- **Primary mark** — `inplux-mark-teal.svg` (ink bars, teal top — for light surfaces).
- **On dark** — `inplux-mark-white.svg` (white bars, teal-bright top).
- **Mono** — `inplux-mark-ink.svg` (single ink) · `inplux-mark-flux-teal.svg` (all-teal two-tone).
- **App icon** — rounded-square ink tile + white/teal-bright bars (`inplux-appicon.svg`,
  plus full-bleed `inplux-appicon-maskable.svg`).
- **Favicons** — `assets/favicon/` PNG 16→512, `icon-180.png` (apple-touch), `maskable-512.png`,
  `favicon.ico` (PNG-embedded). All regenerated from the Estratos mark.

**Wordmark & lockups** (all SVG, in `assets/logos/`): horizontal & stacked, each in
positive / inverse / mono — the Estratos mark + the INPLUX wordmark paths.
`inplux-wordmark-ink.svg` / `-white.svg` for type-only.

**The orbit graphic** is the brand's signature spot illustration — concentric dotted
circles with small teal nodes orbiting a central labelled node ("Agente / SELF-IMPROVING").
It stands in for hero imagery on dark sections. Recreated as the `OrbitGraphic` component.

**Line icons.** The brand kit ships **no product icon set yet** (it's an open TODO: a
~16–24 line-icon set in the mark's stroke style is requested). Until those exist, this
system uses **[Lucide](https://lucide.dev)** (CDN) as the substitute — clean 1.75–2px
line icons, rounded joins. **⚠️ Substitution flagged:** swap to the official INPLUX icon set
when delivered. Pair icons with teal only as an accent; default icon color is
`--ink` / `--gray-600`.

**Emoji / unicode:** not used as icons. The ascending-bars mark and the middot · are the
only glyph-level marks.

**OG / social templates** (`assets/og/`): 1200×630 dark frames (default, Tribai,
Nosotros, Sector público) — PNG + editable SVG. ⚠️ These still carry the **old triangle**
in the corner; regenerate them with the Estratos mark when convenient.

---

## INDEX — what's in this system

**Root**
- `styles.css` — global entry (link this one file). `@import`s everything below.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills wrapper.

**`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `effects.css`
(CSS custom properties; base values + semantic aliases).

**`fonts/`** — `fonts.css` + Instrument Serif (`IS-Regular.ttf`, `IS-Italic.ttf`) and
Plus Jakarta Sans variable (`PJS-var.ttf`).

**`assets/`** — `logos/` (marks, wordmarks, lockups), `favicon/`, `og/` (social
templates), `reference/` (live-site frame).

**`components/core/`** + **`components/brand/`** — reusable React primitives: `Button`,
`Badge`, `Pill`, `Stat`, `Card`, `Input`, `Label`, `Eyebrow`, `Logo`, `OrbitGraphic`,
`MarkAnimated` (the animated Estratos mark for hero/loading). Each has `.jsx` + `.d.ts`
+ `.prompt.md`, with a `@dsCard` HTML specimen.

**`ui_kits/`**
- `marketing-website/` — INPLUX.co marketing site recreation (hero, ecosystem, products, CTA).
- `tribai/` — Tribai.co product app recreation (tax-intelligence chat/agent workspace).

**`slides/`** — sample presentation slides (title, statement, comparison, ecosystem, closing).

**Foundation specimen cards** — small `@dsCard` HTML files throughout (Colors, Type,
Spacing, Effects, Brand) that render in the Design System tab.

---

## Quick rules (Sí / No)
- **SÍ** `--ink` for text · teal as accent only · Instrument Serif for headings · Plus
  Jakarta Sans for body · warm white backgrounds · 8px/14px radii · subtle shadows ·
  touch ≥44px · `cubic-bezier(0.25,1,0.5,1)`.
- **NO** pure black · teal dominant · alternate fonts · cold/bluish backgrounds · hard
  shadows · corners >16px · emoji · linear/abrupt easings.
