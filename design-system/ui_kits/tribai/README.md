# UI Kit — Tribai.co (product app)

**Tribai.co** is INPLUX's flagship product: *inteligencia tributaria y financiera con
IA que aprende*. This kit recreates its agent workspace.

## What it shows
- **Login** (`Login`) — split screen: dark ink panel with the brand statement + orbit
  texture, white form panel.
- **Workspace**
  - **Sidebar** (`Sidebar`) — dark ink rail: Tribai lockup, "Nueva consulta", nav
    (Consultas · Estatuto vivo · Documentos · Observatorio), recent threads, user footer.
  - **Chat** (`Chat`) — empty state with suggested prompts → user/agent turns. Agent
    answers cite the **norma viva** in a citation card. Composer with Enter-to-send and a
    "thinking" state.

## Interactivity
- Login → workspace; logout returns to login.
- Suggested prompt or typed question → user bubble → 1.1s "Consultando la norma…" →
  agent answer with a Ley 1575/2012 citation card.
- Sidebar nav active state; auto-scroll to newest message.

## Iconography
Uses **Lucide** (CDN, `lucide@0.460.0`) — a **documented substitute** for the pending
official INPLUX line-icon set (the brand kit ships none yet). Swap to the official set
when delivered; icons are rendered via `<i data-lucide="…">` + `lucide.createIcons()`.

## Built from
The brand identity doc's product description + the Editorial White System tokens. No
production Tribai codebase/Figma was attached, so the workspace is an on-brand
reconstruction of a plausible core view rather than a copy of the shipping app — flagged
for the user to correct against the real product.

## Components used
`Login`, `Sidebar`, `Chat` (`app.jsx`) composing DS `Button`, `Input`, `Badge`, `Logo`.
