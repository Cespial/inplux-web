
## E1 · Imágenes de hero por sector (20-oct-2026, PR C)

Estilo común (como `/industries/*` de PRIMERO): fotografía documental, 35 mm, luz natural cálida de
ventana lateral, paleta sobria (negros cálidos, marfil, un acento frío), personas reales trabajando
sin mirar a cámara, profundidad de campo media, grano fino. Sin texto, sin logos, sin pantallas con
hologramas. Latinoamérica reconocible sin caer en cliché. Salida 3:2 ≥2400 px → WebP ≤300 KB.
Midjourney: `--ar 3:2 --style raw --v 7 --s 120`. ChatGPT (gpt-image): mismo texto, 1536×1024.

| # | Sector | Prompt |
|---|---|---|
| E1-1 | Sector público | A municipal office in a Colombian town, a public servant at a service counter reviewing a printed file with a citizen seen from behind, filing cabinets and a Colombian flag softly out of focus, warm late-afternoon window light, documentary photography, 35mm, muted palette, no faces to camera |
| E1-2 | Salud | A clinician in a Latin American clinic reading a tablet beside a patient monitor, corridor light from a tall window, scrubs in muted teal, calm, documentary photography, 35mm, shallow depth of field, no faces to camera, no text on screens |
| E1-3 | Legal y tributario | A tax advisor at a wooden desk annotating a thick printed statute with a pen, stacked case files and a laptop, bookshelf with legal codes in the background, warm desk lamp and window light, documentary photography, 35mm, no faces to camera |
| E1-4 | Empresas | A plant supervisor walking a production floor with a tablet, machines and yellow safety lines in soft focus, early morning skylight, cinematic but restrained, documentary photography, 35mm, no faces to camera |

Respaldo (stock gratis, Pexels fotos 4K): buscar «government office Colombia», «clinic corridor
nurse tablet», «lawyer desk documents», «factory supervisor tablet» con orientación horizontal y
licencia Pexels; descartar poses a cámara y fondos de color plano.

### E1 generadas (20-oct-2026, Midjourney V8, cuenta INPLUX)
| Sector | Job | Índice | Archivo |
|---|---|---|---|
| Público | daa9917a-7264-4044-ac6a-904ed019409e | 1 | `sector-publico.webp` |
| Salud | 98a6cfd2-b510-44ae-90d7-af30f401b5af | 1 | `sector-salud.webp` |
| Legal y tributario | 19b42ed1-0c2c-42c3-97b1-03b1561ba477 | 3 | `sector-legal.webp` |
| Empresas | 5fb8fd3b-9964-4190-a1f7-d1d550a36d9d | 0 | `sector-empresas.webp` |
Originales PNG 2688×1792 en `~/Downloads/inplux-sector-*.png`; WebP 2400 px listos para `public/sectores/` (PR C).

## E11 · Tarjetas verticales de sector para la portada (20-oct-2026, PR J)

Mismo estilo que E1, recompuesto para tarjeta 3:4 (como las de industria de PRIMERO): una sola persona
trabajando, el tercio inferior despejado para el nombre del sector, nadie mirando a cámara.
Midjourney V8: `--ar 3:4 --style raw --s 120`. Salida 1904×2544 → WebP 900×1200 en
`public/sectores/card-<slug>.webp`.

| # | Sector | Prompt |
|---|---|---|
| E11-1 | Sector público | Vertical portrait composition, a public servant at a service counter in a municipal office in a Colombian town, reviewing a printed file, filing cabinets and a Colombian flag softly out of focus, warm late-afternoon window light from the side, calm empty space in the lower third, documentary photography, 35mm, muted palette, no faces to camera, no text, no logos |
| E11-2 | Salud | Vertical portrait composition, a clinician in scrubs in muted teal reading a tablet beside a patient monitor in a Latin American clinic, tall window light from the side, calm empty space in the lower third, documentary photography, 35mm, shallow depth of field, no faces to camera, no text on screens, no logos |
| E11-3 | Legal y tributario | Vertical portrait composition, a tax advisor at a wooden desk annotating a thick printed statute with a pen, stacked case files and a laptop, bookshelf with legal codes in the background, warm desk lamp and window light, calm empty space in the lower third, documentary photography, 35mm, no faces to camera, no text, no logos |
| E11-4 | Empresas | Vertical portrait composition, a plant supervisor seen from behind and in three-quarter view, walking along a production line while checking a tablet, looking at the machines and never at the camera, machines and yellow safety lines in soft focus, early morning skylight, calm empty floor in the lower third, cinematic but restrained, documentary photography, 35mm, candid, no eye contact, no text, no logos |

La primera tanda de E11-4 (job 417d4e34-6b69-480a-8ed8-e5dc8daa04b5, «standing on a production floor») se
descartó: las cuatro variantes miraban a cámara.

### E11 generadas (Midjourney V8, cuenta INPLUX)
| Sector | Job | Índice | Archivo |
|---|---|---|---|
| Público | 66519110-07de-4068-888d-54bbbc9abe0a | 2 | `card-publico.webp` |
| Salud | dbe0cf9b-622c-400d-8035-5fe889535d3b | 2 | `card-salud.webp` |
| Legal y tributario | ec72287a-c6d0-462d-a6f6-b16224037303 | 1 | `card-legal-tributario.webp` |
| Empresas | 5e8a4d41-956d-4b9c-9a7b-5aa1fd078c42 | 0 | `card-empresas.webp` |
Originales PNG 1904×2544 en `~/Downloads/inplux-card-*.png`.

## E12 · Foto de la tarjeta para compartir (20-oct-2026, PR N)

Foto a sangre para la tarjeta Open Graph de la portada (`og-home.jpg`, `og-home-en.jpg`): gente trabajando,
mitad izquierda tranquila para el título, Medellín reconocible por las montañas. Midjourney V8:
`--ar 191:100 --style raw` (la proporción 1,91:1 de las tarjetas).

| # | Uso | Prompt |
|---|---|---|
| E12-1 | Tarjeta de la portada | small team of three people working together at desks with large monitors… modern office in Medellin… --ar 191:100 --style raw |

El prompt completo no quedó guardado en el repositorio; arriba va el extracto registrado al elegirla.

### E12 generadas (Midjourney V8, cuenta INPLUX)
| Uso | Job | Índice | Archivo |
|---|---|---|---|
| Portada | e1f2a514-d297-4967-a40e-5778c82b0f0c | 3 | `public/brand/og/fuentes/equipo-medellin.webp` |
Originales PNG 3040×1600 en `~/Downloads/inplux-og-equipo-{0..3}.png`; Cristian eligió la opción 4 (índice 3).
Imagen sintética: no representa la oficina ni el equipo de INPLUX.
