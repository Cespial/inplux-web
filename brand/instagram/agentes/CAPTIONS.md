# Historia «Así se ve el trabajo de los agentes»

Referente: reel «El poder de los agentes de IA» (cursores de agentes armando un video en un editor web).
Pieza: 1080×1920, 19 s, 30 fps, audio sintetizado (v2: arranque sin espera, estallido a 48 agentes, CTA construido por los agentes). Rótulo y barra dentro de la zona segura de historias.

## Qué es (y qué no)

Es una **visualización**: la portada real de inplux.co (producción, 8-nov-2026) se arma pieza por pieza
mientras 48 cursores la colocan. Las 192 piezas son reales (161 elementos + 31 fondos leídos del DOM);
los agentes y los tiempos son escénicos. No decir «la construyeron en 14 segundos».

## CTA (v2)

Tarjeta final que los agentes construyen en vivo y luego «pulsan» entre todos:
«→ EL SIGUIENTE PROYECTO» · «Construyamos la solución para tu empresa.» · «Cuéntanos el problema, quién lo vive
y qué debería cambiar.» (literal del sitio) · botón «Empezar un proyecto →» (mismo CTA del sitio) ·
«gerencia@inplux.co · inplux.co». Tono inspirado en Primero («Hablemos de tu operación»), sin copiar frases suyas.

## Texto sugerido para la historia

- Sticker de enlace: `inplux.co`
- Texto opcional encima (si se quiere): «Así trabajamos: muchas manos, una sola dirección.»

## Si se publica también como reel

Así se ve el trabajo de los agentes.

En INPLUX la IA hace el trabajo repetible en paralelo y las personas dirigen y validan lo que importa.
Esta es nuestra portada, pieza por pieza.

inplux.co

## Texto alternativo

Animación vertical: sobre un lienzo oscuro, decenas de cursores de colores con etiquetas «agente 01» a
«agente 48» colocan una a una las piezas de la página inplux.co, de arriba abajo. Un contador marca agentes
activos y componentes colocados hasta 192 de 192. Al final la cámara se aleja para mostrar la página completa
y se acerca al titular «Transformación con IA que llega a producción». Después los cursores construyen una tarjeta
«Construyamos la solución para tu empresa.» con el botón «Empezar un proyecto», convergen sobre el botón y lo pulsan.

## Rehacer

```
python3 piezas.py          # lee inplux.co (si cambia la portada, cambia el video)
python3 montar.py capas    # antes que la coreografía: escribe out/cta_cajas.json
python3 coreografia.py
python3 montar.py audio
python3 montar.py todo     # out/agentes_inplux.mp4 + out/portada.jpg
```
