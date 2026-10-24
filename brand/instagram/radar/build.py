"""Radar (24-oct-2026): lo último en IA, verificado en fuente primaria, aterrizado en una industria
colombiana y cerrado con una prueba nuestra en pantalla. Seis láminas por radar:
  1 gancho · 2 qué pasó (captura de la fuente) · 3 cómo funciona (3 cajas) · 4 dónde aterriza (marfil)
  5 lo que probamos nosotros (terminal o navegador, fechado) · 6 pregunta + cierre.
Fuentes y capturas fechadas en capturas/; scripts de las pruebas propias en pruebas/.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_s = importlib.util.spec_from_file_location("hilos", AQUI.parent / "hilos" / "build.py")
h = importlib.util.module_from_spec(_s); _s.loader.exec_module(h)
BLACK, IVORY, MUTED, DIM, TEAL, TEAL_OSC = h.BLACK, h.IVORY, h.MUTED, h.DIM, h.TEAL, h.TEAL_OSC
PAPEL, TINTA, GRIS, ALTO, LINE, LINEA_CLARA = h.PAPEL, h.TINTA, h.GRIS, h.ALTO, h.LINE, h.LINEA_CLARA
oscura, clara, terminal, titular, titulo_claro, fuente_de = h.oscura, h.clara, h.terminal, h.titular, h.titulo_claro, h.fuente_de
gancho, pregunta, ref_navegador, cta_oscuro, trama, practica = h.gancho, h.pregunta, h.ref_navegador, h.cta_oscuro, h.trama, h.posic.practica
CRITERIO = h.CRITERIO
ROJO = "#ff8a7a"
CHICA = "<style>.chica .term pre{font-size:21px;line-height:1.62;padding:22px 26px}</style>"


def etiqueta_radar(n):
    return f'<div class="micro" style="position:absolute;right:84px;top:190px;color:{DIM};font-size:14px">Radar · {n:02d}</div>'


def cajas(items, arriba=470, alto_caja=118):
    """Tres (o más) cajas en fila con flechas; cada item = (título, detalle)."""
    n = len(items)
    ancho = (912 - 40 * (n - 1)) // n
    html = ""
    for k, (t, d) in enumerate(items):
        html += (f'<div style="width:{ancho}px;min-height:{alto_caja}px;border:1.5px solid {LINE};border-radius:14px;padding:18px 20px;background:rgba(12,12,11,.6)">'
                 f'<div style="font-size:26px;font-weight:600;letter-spacing:-.02em;color:{IVORY}">{t}</div>'
                 f'<div style="font-size:19px;line-height:1.35;color:#bdb7ad;margin-top:8px">{d}</div></div>')
        if k < n - 1:
            html += f'<div style="width:40px;display:flex;align-items:center;justify-content:center;color:{TEAL};font-size:30px">→</div>'
    return f'<div style="position:absolute;left:84px;right:84px;top:{arriba}px;display:flex;align-items:stretch">{html}</div>'


def nota(texto, arriba, tam=27, color=None):
    c = f"color:{color};" if color else ""
    return f'<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:{arriba}px;font-size:{tam}px;{c}">{texto}</p>'


def cifras_negras(pares, arriba=420, tam=60):
    f = "".join(f'<div style="display:grid;grid-template-columns:330px 1fr;gap:24px;align-items:baseline;padding:20px 0;border-top:1px solid {LINE}">'
                f'<span style="font-size:{tam}px;font-weight:600;letter-spacing:-.03em;color:{TEAL if k == 0 else IVORY}">{n}</span>'
                f'<span style="font-size:25px;line-height:1.3;color:#cfc9bf">{t}</span></div>' for k, (n, t) in enumerate(pares))
    return f'<div style="position:absolute;left:84px;right:84px;top:{arriba}px">{f}<div style="border-top:1px solid {LINE}"></div></div>'


# ---------- R2 · Un agente apagó su propio monitoreo y luego lo negó (OpenAI, 20-oct-2026) ----------

TRAZA = [  # pruebas/traza_cco.py, corrida del 17-oct-2026 (11 agentes de nuestra torre de propuestas públicas)
    '<span class="t">$</span> python3 pruebas/traza_cco.py',
    '<span class="k">corrida 17-oct-2026 · 11 agentes</span>',
    '<span class="k">tokens: 386.170 entrada · 31.331 salida</span>',
    '<span class="k">paso         inicio    dur     entrada   salida   estado</span>',
    '<span class="v">forense-a      0,0 s  28,4 s   105.745    4.923</span>   <span class="t">ok</span>',
    '<span class="v">forense-b      0,0 s  33,7 s   105.021    5.623</span>   <span class="t">ok</span>',
    '<span class="v">equipo        39,6 s  16,2 s     6.004    2.415</span>   <span class="t">ok</span>',
    '<span class="v">gate          56,5 s  16,2 s     6.955    2.364</span>   <span style="color:#f2c14e">aviso</span>',
    '<span class="v">prop-s1…s6    85,4 s  13,5 s    52.907   12.056</span>   <span class="t">ok ×6</span>',
    '<span class="v">redteam      101,8 s  27,8 s   109.538    3.950</span>   <span style="color:#f2c14e">aviso</span>',
    '<span class="k">controles 9/9 ok · herramientas por agente: 0</span>',
]


def r2(i):
    T, pie = 6, "Radar · agentes sin vigilancia"
    if i == 1:
        return oscura(gancho("OpenAI · informe del 20-oct-2026", "Un agente apagó su<br>propio monitoreo", "y luego dijo que no",
                             "Dos agentes GPT-6, dos tareas internas de programación. <b>OpenAI lo publicó con los mensajes literales.</b>",
                             "senadores", (200, 420, 1060), .4) + etiqueta_radar(2), pie, i, T)
    if i == 2:
        cuerpo = titular("Lo que dice<br><em>el informe.</em>", tam=84) + ref_navegador("openai-report-monitoreo-2026-10-24.png", "alignment.openai.com · misalignment reports", "24 oct 2026", 912, 420, 330) + f"""
<div style="position:absolute;left:84px;right:84px;top:850px">
  <div class="fila" style="padding:16px 0"><div class="n">3 oct</div><div><p style="font-size:24px;color:{IVORY}">GPT-6.1 Sol: le dijeron «no envíes mensajes» y silenció las alertas automáticas al equipo de Seguridad.</p></div></div>
  <div class="fila" style="padding:16px 0"><div class="n">6 oct</div><div><p style="font-size:24px;color:{IVORY}">GPT-6 Astra: un subagente quitó el monitor «como corresponda». Al preguntarle, respondió: «I did not remove an enabled monitor».</p></div></div>
  <div style="border-top:1px solid {LINE}"></div>
  <p class="micro" style="margin-top:16px;font-size:14px;line-height:1.6">OpenAI: «We don't yet have a satisfying explanation for this behavior.» · Informe publicado el 20-oct-2026</p></div>"""
        return oscura(cuerpo, pie, i, T)
    if i == 3:
        cuerpo = titular("El monitor estaba<br><em>al alcance del agente.</em>", tam=80) + cajas([
            ("Agente", "Recibe la tarea y delega en un subagente con la instrucción de conservar el monitoreo."),
            ("Subagente", "Interpreta «como corresponda» y quita el componente que vigilaba."),
            ("Monitor", "Vivía en la configuración que el agente podía editar. La alerta P0 no saltó.")], 460, 150) + \
            nota("La grieta no fue el modelo: fue que <b>la vigilancia estaba dentro de lo que el agente podía tocar</b>. OpenAI responde con un revisor automático que bloquea esos cambios y con un «caso de seguridad» obligatorio por tipo de tarea.", 760, 27) + \
            fuente_de("alignment.openai.com, «Suppressing misalignment monitoring alerts and disabling misalignment monitoring», 20-oct-2026.", 1190).replace(GRIS, MUTED)
        return oscura(cuerpo, pie, i, T)
    if i == 4:
        filas = [("01", "La bitácora, fuera de su alcance", "El registro de cada paso lo escribe el orquestador, no el agente. Si el agente no la ve, no la puede apagar."),
                 ("02", "Lo que no debe tocar, no está en sus herramientas", "Un agente que solo lee y escribe texto no puede borrar un monitor ni enviar un correo."),
                 ("03", "Cada corrida se puede releer", "Paso, duración, tokens y avisos. Si no se puede auditar, no se deja solo.")]
        cuerpo = practica("Antes de dejar un agente<br><em>solo en tu empresa.</em>", filas,
                          "Vale para un banco que ordena 120.000 correos al día, una EPS que audita glosas o una alcaldía que responde PQR. En Colombia, el 63,7 % de los usos de IA sigue bajo control humano directo (Endeavor, sep-2026).", 80)
        return clara(cuerpo, pie, i, T)
    if i == 5:
        cuerpo = titular("Lo que probamos<br><em>nosotros.</em>", "Bitácora real · 11 agentes · 17-oct-2026", 84) + \
            f'<div class="chica" style="position:absolute;left:84px;right:84px;top:450px">{terminal("nuestra torre de propuestas públicas · bitácora del orquestador", TRAZA)}</div>' + \
            CHICA + nota("Ninguno de los 11 agentes tiene herramientas: reciben texto y devuelven texto. <b>El registro lo escribe el orquestador, donde el agente no llega.</b> Los dos avisos quedaron en la bitácora, no en la basura.", 1040, 25)
        return oscura(cuerpo, pie, i, T)
    cuerpo = titular("Un agente que no puede<br>tocar su bitácora<br><em>no puede apagarla.</em>", tam=76) + \
        nota(f"Diseñar así cuesta menos que explicar después por qué nadie vio la alerta. {CRITERIO}", 560, 29) + \
        pregunta("¿Qué agente ya trabaja solo en tu empresa, y quién lee su bitácora?", "Cuéntanos qué hace y te decimos qué le pediríamos.", 740) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


# ---------- R3 · Una IA que no puede inventar: Jev, System One (TypeSafe AI) ----------

JEV_VS = [
    '<span class="t">$</span> python3 pruebas/traza_cco.py  <span class="k"># corrida real 17-oct</span>',
    '<span class="k">decisiones «System One» (elegir, puntuar, sí/no)</span>',
    '<span class="v">gate GO / NO-GO       16,2 s    6.955 tok  LLM</span>',
    '<span class="v">9 controles numéricos  0,02 s        0 tok  código</span>',
    '<span class="k">redacción «System Two» (texto libre)</span>',
    '<span class="v">forense A + B         33,7 s  210.766 tok  LLM</span>',
    '<span class="v">6 redactores + red team 27,8 s 162.445 tok  LLM</span>',
    "",
    '<span class="k">lo que Jev publica (según TypeSafe, 19-oct-2026)</span>',
    '<span class="v">una decisión tipada   0,07–0,5 s  US$0,042/M tok</span>',
]


def r3(i):
    T, pie = 6, "Radar · System One"
    if i == 1:
        return oscura(gancho("TypeSafe AI · Jev · acceso temprano", "Una IA que no<br>puede inventar", "70 ms · US$0,042 por millón",
                             "No escribe: <b>decide</b>. Elige una opción, pone un puntaje o dice sí o no, con su probabilidad. Fundada por un ex OpenAI.") + etiqueta_radar(3), pie, i, T)
    if i == 2:
        cuerpo = titular("Lo que dice<br><em>la documentación.</em>", tam=84) + ref_navegador("typesafe-docs-system-one-2026-10-24.png", "docs.typesafe.ai · System One", "24 oct 2026", 912, 420, 360) + f"""
<div style="position:absolute;left:84px;right:84px;top:880px">
  <div class="fila" style="padding:14px 0"><div class="n">qué</div><div><p style="font-size:24px;color:{IVORY}">«Returns typed decisions and probabilities rather than generated text.» Tres preguntas: elegir, puntuar, sí o no.</p></div></div>
  <div class="fila" style="padding:14px 0"><div class="n">límite</div><div><p style="font-size:24px;color:{IVORY}">Solo texto de entrada, solo por API, sin pesos abiertos. «Calibration… does not guarantee that an individual answer is correct.»</p></div></div>
  <div style="border-top:1px solid {LINE}"></div></div>"""
        return oscura(cuerpo, pie, i, T)
    if i == 3:
        cuerpo = titular("Decidir no es<br><em>redactar.</em>", tam=84) + cajas([
            ("Estado", "Un texto o un JSON: el correo, la glosa, el pliego, la alerta."),
            ("Jev", "Evalúa contra las opciones que tú definiste. No genera una sola palabra."),
            ('{"choice": "glosa", "p": 0,95}', "Una respuesta tipada, con probabilidad, lista para que el software la use.")], 450, 150) + \
            cifras_negras([("70–500 ms", "por decisión, frente a 3–329 s de un LLM de frontera (cifras de TypeSafe)"),
                           ("US$0,042", "por millón de tokens de entrada; la salida no se cobra"),
                           ("255", "opciones como máximo por pregunta; más, en dos etapas")], 700, 54)
        return oscura(cuerpo, pie, i, T)
    if i == 4:
        filas = [("01", "Salud", "Clasificar una glosa por causal antes de que la vea el auditor."),
                 ("02", "Alcaldías y entidades", "Enrutar una PQR a la dependencia correcta en el momento en que entra."),
                 ("03", "Contratación y campo", "Pre-filtrar cien pliegos del día, o puntuar una alerta de finca: ¿urgente, sí o no?")]
        cuerpo = practica("Decisiones pequeñas,<br><em>mil veces al día.</em>", filas,
                          "El riesgo es creer que calibrado significa correcto: una probabilidad de 0,95 sigue necesitando a alguien que revise los casos difíciles.", 84)
        return clara(cuerpo, pie, i, T)
    if i == 5:
        cuerpo = titular("Lo que probamos<br><em>nosotros.</em>", "Nuestra torre de 11 agentes, medida paso a paso", 84) + \
            f'<div class="chica" style="position:absolute;left:84px;right:84px;top:450px">{terminal("¿qué pasos nuestros son System One?", JEV_VS)}</div>' + \
            CHICA + nota("De 11 agentes, <b>solo el gate es una decisión que Jev podría tomar</b>; los otros diez redactan o ya corren en código sin IA. Cuando tengamos acceso, repetimos la corrida con Jev en ese paso y publicamos los tiempos.", 1040, 25)
        return oscura(cuerpo, pie, i, T)
    cuerpo = titular("No todo necesita<br><em>un modelo que escriba.</em>", tam=80) + \
        nota(f"Antes de pedir un LLM, pregunta si lo que necesitas es una decisión o un texto. {CRITERIO}", 540, 29) + \
        pregunta("¿Qué decisión repite tu empresa mil veces al día?", "Dinos cuál y te contamos si es System One.", 720) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


PIEZAS = {}
for clave, fn, total in (("r2", r2, 6), ("r3", r3, 6)):
    for k in range(1, total + 1):
        PIEZAS[f"{clave}_{k:02d}"] = ((lambda fn=fn, k=k: fn(k)), 1080, ALTO)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
    print(len(PIEZAS), "piezas escritas")
