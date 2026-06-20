---
name: inplux-design
description: Use this skill to generate well-branded interfaces and assets for INPLUX (inplux.co) — a Medellín, Colombia tax-intelligence + technology hub ("Tributaristas que construyen tecnología") — for production or throwaway prototypes/mocks. Contains the Editorial White System v3: colors, type, fonts, logos, and a UI-kit component library for prototyping.
user-invocable: true
---

# INPLUX — Design Skill

Read **`readme.md`** first — it is the full design guide (brand context, content/voice,
visual foundations, iconography, and an index of every file). Then explore the files you
need.

## Quick facts
- **System:** Editorial White System v3 — warm white surfaces, **ink** text (`#1a1918`,
  never pure black), **teal** (`#0d7d74`) as **accent only**.
- **Display type:** Instrument Serif (headings only; one word in *italic teal*).
  **Body/UI:** Plus Jakarta Sans. **Labels:** uppercase, tracking 0.08em.
- **Radii:** 8px buttons / 14px cards / 16px max. **Shadows:** subtle, warm.
- **Voice:** Spanish (es_CO), sober, expert-but-accessible, inclusive "nosotros".
  CTA is always **"Hablemos"**. No emoji.

## What's here
- `styles.css` — link this one file; it `@import`s all tokens + `@font-face`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `fonts/` — Instrument Serif + Plus Jakarta Sans (TTF) + `fonts.css`.
- `assets/` — `logos/` (marks, wordmarks, lockups), `favicon/`, `og/` (social templates).
- `components/core/` + `components/brand/` — React primitives: `Button`, `Badge`, `Pill`,
  `Stat`, `Card`, `Input`/`Field`, `Eyebrow`, `Logo`, `OrbitGraphic`. Each has a
  `.prompt.md` with usage.
- `ui_kits/marketing-website/` — inplux.co homepage recreation.
- `ui_kits/tribai/` — Tribai.co agent workspace recreation.
- `guidelines/` — foundation specimen cards.

## How to work
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets you need
  out of `assets/`, link `styles.css` (or inline the token values), and write static HTML
  for the user to view. Reuse the component patterns in `components/*/*.prompt.md`.
- **Production code:** copy assets and read the rules here to design as an INPLUX expert.
- **Icons:** the brand kit ships no icon set yet — use **Lucide** (CDN) as the documented
  substitute, matching the rounded-triangle stroke feel. Flag the substitution.

If invoked with no other guidance, ask the user what they want to build, ask a few
focused questions, then act as an expert INPLUX designer — outputting HTML artifacts or
production code as the need dictates.
