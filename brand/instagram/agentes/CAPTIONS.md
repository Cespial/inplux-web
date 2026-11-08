# Historia «Así se ve el trabajo de los agentes»

Referente: reel «El poder de los agentes de IA» (cursores de agentes armando un video en un editor web).
Pieza: 1080×1920, 14 s, 30 fps, audio sintetizado. Rótulo y barra dentro de la zona segura de historias.

## Qué es (y qué no)

Es una **visualización**: la portada real de inplux.co (producción, 8-nov-2026) se arma pieza por pieza
mientras 48 cursores la colocan. Las 192 piezas son reales (161 elementos + 31 fondos leídos del DOM);
los agentes y los tiempos son escénicos. No decir «la construyeron en 14 segundos».

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
y se acerca al titular «Transformación con IA que llega a producción», con el texto «inplux.co».

## Rehacer

```
python3 piezas.py          # lee inplux.co (si cambia la portada, cambia el video)
python3 coreografia.py
python3 montar.py capas
python3 montar.py audio
python3 montar.py todo     # out/agentes_inplux.mp4 + out/portada.jpg
```
