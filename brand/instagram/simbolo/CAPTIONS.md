# Reel «Así nació el símbolo» (v2, logo actual)

Referente: reel de Vetric (After Effects: el logo se dibuja con guías y cotas y siguen cortes rápidos con el
logo siempre centrado) + la arena de puntos de inplux.co/adeli (`~/inplux-adeli/deck/arena.js`).
Pieza: 1080×1920, 20 s, 30 fps, audio sintetizado con pulso de 128 BPM. Todo renderizado.

## Qué es

El símbolo vigente de INPLUX (`~/inplux-web/public/brand/logos/inplux-mark-*.svg`: tres barras 42×13, r 6,5,
paso 21×18, la superior teal) nace de una pila de arena y se construye con sus cotas reales. Las nueve
aplicaciones son renders «así se vería»; los textos de las tarjetas son reales del sitio y no hay cifras
inventadas. La v1 (símbolo E1 «Masa») está en el historial de git (commit 532c189).

## Guion

| t (s) | |
|---|---|
| 0–1,6 | «Un símbolo.» · una pila de granos sube y forma las 6 horizontales punteadas; cotas 84 · 13 · 18 · 49 |
| 1,6–4,6 | verticales, diagonal de 40,6° por los centros, contorno de las barras con punta de pluma (21 · r 6,5 · 42) |
| 4,6–5,25 | la arena se vierte dentro de las barras (trama Bayer, de abajo arriba) |
| 5,25 | GOLPE: cuajan, destello, onda teal, sacudida, «Tres estratos.» · respira · se aleja a 170 px |
| 7,125–13,69 | 9 cortes al pulso (2·2·2·2·1,5·1,5·1·1·1 tiempos), símbolo clavado en (540, 1010) |
| 13,69–15,56 | el símbolo estalla en granos que viajan y forman el lockup horizontal; cuajan con campana |
| 15,9–20 | «Hecho en Medellín.» · inplux.co · push-in lento |

## Archivos

- `geometria.py`: barras, retícula, diagonal, perímetro de estadio para la pluma.
- `arena.py`: trama Bayer 4×4 (receta de `~/inplux-adeli/scripts/formas.py`), `emparejar` por franjas
  (copiado de `soon-sf/reel/reel2.py`), pila, vuelo con arco lateral, pintado de granos en numpy.
- `escenas.py`: marco, rótulos, lockup a 4 px/unidad y las 9 tarjetas (Chrome).
- `montar.py`: construcción, aplicaciones, cierre, cámara, sonido.

## Rehacer

```
python3 escenas.py         # necesita ../agentes/out/hero.png y ~/inplux-camisetas-sf/build/mockups.py
python3 montar.py audio
python3 montar.py todo     # out/simbolo_inplux.mp4 + out/portada.jpg
python3 montar.py previa 1.0 5.0 15.2
```

Post 3:4: `ffmpeg -i out/simbolo_inplux.mp4 -vf crop=1080:1440:0:180 …`.
