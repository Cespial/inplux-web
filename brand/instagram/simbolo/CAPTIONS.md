# Reel «Así nació el símbolo»

Referente: reel de Vetric (After Effects: el logo se dibuja con guías y cotas, se rellena y siguen cortes
rápidos de aplicaciones con el logo siempre centrado; mismo patrón que @obrazur).
Pieza: 1080×1920, 18 s, 30 fps, audio sintetizado. Todo renderizado (sin celular ni grabación de pantalla).

## Qué es (y qué no)

Es el **lanzamiento del símbolo E1 «Masa»** (Exploración 3 «una tinta», lockup horizontal asta 10).
Publicarlo = publicar el logo nuevo: antes hay que cambiarlo en inplux.co, en el avatar de IG y en LinkedIn.

Las nueve aplicaciones son renders «así se vería»; los textos que aparecen son reales del sitio y no hay
cifras inventadas (sin seguidores). La foto de la tarjeta web es el hero real de inplux.co recortado bajo la
cabecera. La camiseta sale de `~/inplux-camisetas-sf/build/mockups.py`.

## Guion

| t (s) | |
|---|---|
| 0–2,8 | «Un símbolo.» · retícula: 6 horizontales punteadas, cotas 74,4 · 14,61 · 5,58 · 55, diagonales 1/φ · 1/φ² |
| 2,8–4,8 | contorno de las tres plantas con punta de pluma (54,2 · 34) · corte a 45° de la cima |
| 4,8–7,0 | relleno marfil por barrido · «Tres estratos.» · respira · se aleja de 500 a 200 px |
| 7,0–13,75 | 9 cortes cada 0,75 s, el símbolo clavado en (540, 1010): favicon, web, Instagram, tríptico, LinkedIn, sticker, camiseta, app, membrete |
| 13,75–18 | el símbolo baja a 130 px y se corre; el wordmark a10 entra letra por letra · «Hecho en Medellín.» · inplux.co |

## Geometría

`geometria.py`: dos variantes del mismo símbolo, las dos leídas de `~/inplux-web-marca/brand/refinamiento/exploracion/`.
«claro» (plantas 14,61, hueco 5,58 = planta/φ²) es la que se dibuja con cotas; «oscuro» (14,17, corrección
óptica de claro sobre oscuro, la del lockup a10) se usa en las aplicaciones marfil y en el cierre.

## Rehacer

```
python3 escenas.py         # marco, rótulos, wordmark y 9 tarjetas (Chrome); necesita ../agentes/out/hero.png
python3 montar.py audio
python3 montar.py todo     # out/simbolo_inplux.mp4 + out/portada.jpg
python3 montar.py previa 2.5 4.6 10.8   # cuadros sueltos en out/previa/
```

Post 3:4: `ffmpeg -i out/simbolo_inplux.mp4 -vf crop=1080:1440:0:180 …` (sin barras laterales: las tarjetas
son a sangre).
