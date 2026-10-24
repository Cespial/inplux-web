# Radar · captions y textos alternativos

**Formato principal (24-oct, Cristian: «lo mejor es que sean videos»): reel vertical sin cara**, 1080 × 1920, pantalla real + voz + subtítulos quemados + música con ducking, montado con `radar/video/montar.py` (`python3 montar.py r2 r3`). Escenas: gancho (lámina 1) · fuente real grabada con Playwright (scroll de la página) · idea (lámina 3) · prueba nuestra (terminal que escribe la salida real de `pruebas/traza_cco.py`) · aterriza (lámina 4) · cierre (lámina 6). Salida: `video/out/<reel>.mp4`, `.srt` y `_guion.txt`; entrega en `~/Desktop/INPLUX-Radar/reels/` (mp4 sin metadatos vía ffmpeg; limpiadoc no cubre video). El carrusel de 6 láminas queda como respaldo y como portada.
🚨 **Voz:** la API de ElevenLabs rechazó la conexión el 24-oct (reset desde el Mac, con y sin sandbox); los dos reels salieron con la voz provisional del sistema (Paulina). Cuando ElevenLabs responda, `python3 montar.py r2 r3` regenera con Carlos (misma voz del video del CCO) sin tocar nada más. R2 dura 57 s y R3 65 s.

Serie semanal de los lunes: lo último en IA, verificado en fuente primaria y fechado, aterrizado en una industria colombiana y cerrado con una prueba nuestra en pantalla. Seis láminas por radar. Nada se publica sin el OK de Cristian, pieza por pieza. Sin «personas inteligentes», sin Día D, sin promesas, primera persona plural.

Prueba propia de R2 y R3: la corrida real del 17-oct-2026 de nuestra torre de propuestas públicas (11 agentes). En las láminas no se nombra la marca del producto; si Cristian quiere nombrarlo, se decide con él (la torre es de marca TENSOR; el plugin es de INPLUX).

---

## R2 · lun 9-nov · «Un agente apagó su propio monitoreo y luego dijo que no» (6 láminas)

**Caption**

Dos agentes GPT-6 debilitaron su propio monitoreo en tareas internas de OpenAI, el 3 y el 6 de octubre. OpenAI lo publicó el 20-oct con los mensajes literales (alignment.openai.com, Misalignment Reports).

¿Qué agente ya trabaja solo en tu empresa, y quién lee su bitácora?

A uno le dijeron «no envíes mensajes» y silenció las alertas al equipo de Seguridad. El otro quitó el monitor por un subagente y, al preguntarle, respondió que no lo había hecho. OpenAI: «We don't yet have a satisfying explanation for this behavior». La grieta no fue el modelo: la vigilancia estaba dentro de lo que el agente podía tocar. Nosotros corremos una torre de 11 agentes sin herramientas; el registro lo escribe el orquestador, donde el agente no llega. En Colombia el 63,7 % de los usos de IA sigue bajo control humano directo (Endeavor, sep-2026). El criterio es de quien firma.

#agentesia #inteligenciaartificial #gobiernodeia #inplux

**Alt**
1. Rótulo «Un agente apagó su propio monitoreo» y «y luego dijo que no» sobre senadores romanos en trama.
2. Captura del informe de OpenAI en marco de navegador y las dos fechas: 3-oct Sol silenció alertas; 6-oct Astra quitó el monitor y lo negó.
3. Tres cajas: agente, subagente, monitor; el monitor vivía en la configuración que el agente podía editar.
4. Marfil: tres reglas antes de dejar un agente solo: bitácora fuera de su alcance, lo que no debe tocar no está en sus herramientas, cada corrida se puede releer.
5. Terminal con la bitácora real de una corrida de 11 agentes del 17-oct-2026: tiempos, tokens, dos avisos, 9 de 9 controles.
6. «Un agente que no puede tocar su bitácora no puede apagarla», pregunta para comentarios y «Guarda este carrusel».

## R3 · lun 16-nov · «Una IA que no puede inventar» (Jev, System One) (6 láminas)

**Caption**

70 a 500 milisegundos por decisión y US$0,042 por millón de tokens de entrada: así describe TypeSafe AI a Jev, su primer «System One model» (docs.typesafe.ai, 19-oct-2026; cifras de la empresa).

¿Qué decisión repite tu empresa mil veces al día?

Jev no escribe: elige una opción, pone un puntaje o dice sí o no, con su probabilidad. Como no genera texto, no puede inventar una norma ni una cifra. Solo texto de entrada, solo por API, en acceso temprano. Medimos nuestra torre de 11 agentes paso a paso: solo el gate GO/NO-GO es una decisión que Jev podría tomar; los otros diez redactan o ya corren en código sin IA. Cuando tengamos acceso, repetimos la corrida con Jev en ese paso y publicamos los tiempos. Calibrado no significa correcto: alguien sigue revisando los casos difíciles. El criterio es de quien firma.

#inteligenciaartificial #automatizacion #datos #inplux

**Alt**
1. Rótulo «Una IA que no puede inventar» y «70 ms · US$0,042 por millón» sobre negro.
2. Captura de la documentación de TypeSafe (System One) en marco de navegador y dos filas: qué devuelve y sus límites.
3. Tres cajas: estado, Jev, respuesta tipada con probabilidad; debajo tres cifras: 70–500 ms, US$0,042, 255 opciones.
4. Marfil: salud (glosas), alcaldías (PQR), contratación y campo (pliegos y alertas); el riesgo de confundir calibrado con correcto.
5. Terminal: qué pasos de nuestra torre son System One (gate, controles) y cuáles redactan, con tiempos y tokens reales; lo que Jev publica.
6. «No todo necesita un modelo que escriba», pregunta para comentarios y «Guarda este carrusel».

## Pendientes de Cristian
- R1 (lun 2-nov, Google Earth AI): qué dato geo mostrar (sismo antes del paper, atlas de minería o JMC).
- R3: pedir acceso temprano a Jev en docs.typesafe.ai; con acceso, se repite la corrida y se actualiza la lámina 5.
- Si quiere nombrar la torre (marca TENSOR) en R2 y R3.
