# La misma pregunta tributaria a cuatro IA · resultados (borrador)

Prueba corrida el 23-oct-2026, entre las 16:50 y las 17:05 (hora de Colombia), según el PREREGISTRO.md (commit c147642). Capturas en `respuestas/`.

**Condiciones reales:**
- **ChatGPT:** chat temporal, «esfuerzo de razonamiento: High», cuenta de Cristian. El chat temporal puede consultar la memoria y las instrucciones personalizadas; queda anotado.
- **Gemini:** modo «Pro», cuenta de Cristian, chat normal (no se activó un chat temporal).
- **Tribai:** app.tribai.co sin iniciar sesión, «Agente · Rápido» por defecto.
- **Claude:** pendiente. La extensión de Chrome no puede operar claude.ai; Cristian la corre a mano en un chat de incógnito.

## Clave (fuentes oficiales)
1. **1.400 UVT del año gravable 2025** (Art. 592 num. 1 ET; DUR 1625/2016 art. 1.6.1.13.2.7). UVT 2025 = $49.799 (Res. DIAN 000193 del 4-dic-2024). 1.400 × 49.799 = $69.718.600, que con el Art. 868 ET se aproxima a **$69.719.000**.
2. **UVT 2026 = $52.374**, Resolución DIAN **000238 del 15-dic-2025**.
3. **72.000 UVT** de patrimonio líquido al 1-ene-2026 (Art. 294-3 ET, Ley 2277/2022) = **$3.770.928.000**. El D.L. 1474/2025 lo bajó a 40.000 UVT. El Auto 084 de 2026 lo suspendió y la **Sentencia C-079 de 2026** (comunicado del 15-abr-2026) lo declaró inexequible por consecuencia, con efectos modulados. La regla de 72.000 UVT está vigente.

🚨 La clave la debe validar una persona del equipo con formación tributaria antes de publicar.

## Puntaje provisional (norma · vigencia · cifra · fuente)
| | P1 renta | P2 UVT | P3 patrimonio | Total |
|---|---|---|---|---|
| ChatGPT | 1·1·1·1 = 4 | 1·1·1·1 = 4 | 1·1·1·1 = 4 | **12** |
| Gemini | 1·1·1·0 = 3 (sin enlace) | 1·1·1·1 = 4 | 0·1·1·1 = 3 (cita la Ley 2277, no el artículo) | **10** |
| Tribai | 0·1·1·1 = 3 (no recuperó el Art. 592; citó el de independientes y pidió aclarar) | 0·1·1·0 = 2 (cifra bien, no encontró la Res. 000238) | 1·1·1·1 = 4 (Art. 294-3, C-079, cifra) | **9** |
| Claude | pendiente | pendiente | pendiente | — |

## Lo que esto le dice a Tribai (para el equipo, no para el post)
- En modo «Rápido», la búsqueda no trajo el Art. 592 ET para la pregunta más común del año y se fue al régimen de independientes.
- No tiene la Resolución DIAN 000238 de 2025 en su corpus, aunque usa bien el valor $52.374.
- En la respuesta aparece el texto de relleno «la norma citada» en lugar del nombre de la norma (P1 y P3).
- En la P3 supone «persona jurídica, según su perfil» sin que haya sesión iniciada.
- Donde la vigencia es difícil (P3, decreto suspendido y luego inexequible), acierta y lo explica mejor que Gemini.
