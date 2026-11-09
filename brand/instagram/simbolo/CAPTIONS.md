# Reel «Así nació el símbolo» (v3: 3D + Midjourney, 140 BPM)

Referente: reel de Vetric (el logo se dibuja con guías y cotas y siguen cortes rápidos con el logo siempre
centrado, mezclando dibujo, piezas impresas y renders 3D) + la arena de puntos de inplux.co/adeli.
Pieza: 1080×1920, 16 s, 30 fps, audio sintetizado a 140 BPM (B = 0,4286 s).

## Qué es

El símbolo vigente de INPLUX (`~/inplux-web/public/brand/logos/inplux-mark-*.svg`: tres barras 42×13, r 6,5,
paso 21×18, la superior teal) nace de una pila de arena, se construye con sus cotas reales y en el golpe se
vuelve 3D: placas de metal oscuro y la superior de vidrio teal (Blender 5.2, Cycles en Metal). Siguen doce
cortes al pulso con el símbolo clavado en (540, 1010): renders 3D propios, escenas de Midjourney (solo la
superficie: papel, portátil, letrero, camiseta, placa, cuaderno) con el símbolo compuesto encima por
homografía, y tres tarjetas de la v2 (portada web, perfil de IG, ícono de app). Cierra con el lockup sobre
Medellín de noche (Midjourney).

Midjourney nunca dibujó el logo. Los textos de las tarjetas son reales del sitio; no hay cifras inventadas
ni rostros. La v2 (arena, 20 s, 128 BPM) está en el commit 1dc1dee; la v1 (símbolo E1) en 532c189.

## Guion

| t (s) | B | |
|---|---|---|
| 0–2,9 | 0–6,8 | «Un símbolo.» · pila de granos → horizontales → verticales, diagonal 40,6°, cotas · pluma traza las barras |
| 2,9–3,43 | | la arena se vierte dentro de las barras |
| 3,43 | 8 | GOLPE 1: cuaja, destello, onda, «Tres estratos.» · el plano se funde (3 cuadros) en el render 3D |
| 3,43–4,71 | 8–11 | reveal 3D: de cenital ortográfica (= el 2D al píxel) a 3/4 en perspectiva, barrido de luz |
| 4,71–11,14 | 11–26 | 12 cortes (2·2·1,5·1,5·1·1·1·1·1·1·1·1 B): macro vidrio · papel · web · portátil · IG · letrero · mármol · camiseta · app · placa · cuaderno · vuelta 3D a cenital |
| 11,14 | 26 | GOLPE 2 (tras redoble): el símbolo estalla en granos |
| 11,44–12,86 | –30 | los granos forman el lockup; cuaja con campana; entra Medellín de noche |
| 13,3–16 | | «Hecho en Medellín.» · inplux.co · push-in |

## Archivos

- `geometria.py`, `arena.py`, `escenas.py`: como en la v2 (geometría, granos, tarjetas y rótulos).
- `tres_d.py`: escenas Blender `reveal` (39 cuadros), `macro` (26), `marmol` (13), `vuelta` (13) → `out/3d/<escena>/`.
  Vidrio: transmisión 0,2, emisión 0,3, rugosidad 0,18 (teal medido ≈ (24, 221, 196) frente a #15dcc4).
- `mj/PROMPTS.md` (prompts), `mj/originales/` (28 imágenes, 4 por escena), `mj/hoja_contacto.jpg`,
  `mj/planos.json` (esquinas medidas), `mj/componer.py` (homografía + modo por material + recentrado al ancla).
- `mj/receptor.py`: receptor local 127.0.0.1:8766 para traer las imágenes desde la pestaña de Midjourney.
- `montar.py`: construcción, reveal, cortes, cierre, cámara, sonido.

## Rehacer

```
python3 escenas.py
for e in reveal macro marmol vuelta; do blender -b -P tres_d.py -- $e; done   # ~10 min en M3 Max
python3 mj/componer.py
python3 montar.py audio
python3 montar.py todo     # out/simbolo_inplux.mp4 + out/portada.jpg
```

Post 3:4: `ffmpeg -i out/simbolo_inplux.mp4 -vf crop=1080:1440:0:180 …`.

## Verificado

- Reveal: cuadro 0 de Blender vs símbolo 2D a 440 px: misma caja (±1 px), 1,25 % de píxeles distintos.
- Vuelta: último cuadro vs 2D a 170 px: misma caja (±1 px).
- Escenas MJ: centroide del símbolo en (540 ± 6, 1010 ± 5) en cinco; en el cuaderno el centro de las barras
  está en el ancla por construcción, y la máscara medida se corre a (585, 971) por las guías del boceto; ancho 292–501 px (el letrero y el papel salen
  más grandes porque la foto tiene que cubrir el cuadro).
