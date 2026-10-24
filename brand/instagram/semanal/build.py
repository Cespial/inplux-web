"""Piezas recurrentes de la semana tipo (plan del 24-oct-2026, hasta el 18-dic):

  lun  actualidad(...)     Actualidad IA · lente Colombia      marfil 3:4   (Rundown + dotcsv)
  mié  portada_reel(...)   portada del reel «una idea» de Cristian   negro       (VictorPay + dotcsv)
  sáb  pregunta_real(...)  pregunta tributaria/jurídica real → Tribai/Kelsen   romana   (Croma)
  dom  changelog(...)      Esta semana en INPLUX                negro plano  (Croma «shipping accountability»)

Tokens, marco y cierres vienen de posicionamiento/build.py (sistema v5, 1080 × 1440, FONDOS.md).
Las estatuas en trama vienen de parrilla-romana/trama/ (Midjourney → trama.py).
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("posic", AQUI.parent / "posicionamiento" / "build.py")
posic = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(posic)
BLACK, IVORY, MUTED, DIM, TEAL, TEAL_OSC = posic.BLACK, posic.IVORY, posic.MUTED, posic.DIM, posic.TEAL, posic.TEAL_OSC
PAPEL, TINTA, GRIS, ALTO = posic.PAPEL, posic.TINTA, posic.GRIS, posic.ALTO
pieza, cta, titulo_claro, fuente_de = posic.pieza, posic.cta, posic.titulo_claro, posic.fuente_de
LINE = "rgba(246,242,236,.14)"


def trama(img, izq, arriba, ancho, opacidad=.5):
    """Estatua en puntos sobre el negro, con velos arriba y abajo para que el texto respire."""
    velos = (f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.85) 14%,'
             f'rgba(12,12,11,.25) 30%,transparent 45%,transparent 78%,rgba(12,12,11,.92) 92%,{BLACK} 100%)"></div>')
    return f'<img src="trama/{img}.png" style="position:absolute;left:{izq}px;top:{arriba}px;width:{ancho}px;opacity:{opacidad}">' + velos


def etiqueta(texto, arriba=190, claro=False):
    return f'<div class="micro" style="position:absolute;left:84px;top:{arriba}px;color:{TEAL_OSC if claro else TEAL}">{texto}</div>'


def navegador(captura, url, fecha, ancho=700, arriba=560, alto=None):
    """Captura real en marco de navegador oscuro; alto libre para recortes que no son 3:2."""
    alto = alto or round(ancho * 2 / 3)
    izq = (1080 - ancho) // 2
    puntos = "".join('<i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i>' for _ in range(3))
    return f"""<div style="position:absolute;left:{izq}px;top:{arriba}px;width:{ancho}px;border-radius:14px;overflow:hidden;
  border:1.5px solid {LINE};background:#151513;box-shadow:0 0 0 10px rgba(246,242,236,.03),0 40px 90px rgba(0,0,0,.75)">
  <div style="height:44px;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid {LINE}">{puntos}
    <span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{MUTED};letter-spacing:.02em">{url}</span></div>
  <img src="capturas/{captura}" style="display:block;width:{ancho}px;height:{alto}px;object-fit:cover;object-position:top">
</div>
<div class="micro" style="position:absolute;left:{izq}px;top:{arriba + alto + 44 + 20}px;font-size:15px">Captura real · {fecha}</div>"""


# ---------- sábado · Pregunta real ----------

def pregunta_real(pregunta, producto, captura, url, fecha, respuesta, estatua="justicia", alto_captura=430):
    """La pregunta literal arriba; la captura real como prueba; la respuesta en tres filas: artículo · vigencia · cifra."""
    filas = "".join(
        f'<div style="display:grid;grid-template-columns:150px 1fr;gap:20px;padding:15px 0;border-top:1px solid {LINE};align-items:baseline">'
        f'<span class="micro" style="font-size:15px">{e}</span><span style="font-size:27px;line-height:1.25;color:{TEAL if k == 0 else IVORY};font-weight:{600 if k == 0 else 400}">{v}</span></div>'
        for k, (e, v) in enumerate(respuesta))
    cuerpo = trama(estatua, 420, -40, 900, .42) + etiqueta(f"Pregunta real · {producto}") + f"""
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:240px;font-size:62px">{pregunta}</h1>
{navegador(captura, url, fecha, ancho=700, arriba=520, alto=alto_captura)}
<div style="position:absolute;left:84px;right:84px;top:{520 + 44 + alto_captura + 60}px">{filas}</div>"""
    return pieza(cuerpo, "Pregunta real", claro=False, alto=ALTO)


# ---------- miércoles · portada del reel ----------

def portada_reel(n, rotulo, sub, quien="Cristian Espinal · CTO de INPLUX"):
    play = (f'<div style="position:absolute;left:84px;top:1040px;width:92px;height:92px;border-radius:50%;border:2px solid {IVORY};'
            f'display:flex;align-items:center;justify-content:center"><svg width="30" height="34" viewBox="0 0 30 34"><path d="M3 2l25 15L3 32z" fill="{IVORY}"/></svg></div>')
    cuerpo = etiqueta(f"Reel · una idea · {n:02d}") + f"""
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:250px;font-size:96px">{rotulo}</h1>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:560px;max-width:820px">{sub}</p>
{play}<div style="position:absolute;left:206px;top:1058px"><div style="font-size:26px;font-weight:600">{quien}</div>
<div class="micro" style="margin-top:8px">40 segundos · con subtítulos</div></div>"""
    return pieza(cuerpo, "Una idea", claro=False, alto=ALTO)


# ---------- domingo · Esta semana en INPLUX ----------

def changelog(semana, rango, items):
    """Tres a cinco líneas de lo que salió a producción. items: (producto, qué salió)."""
    lineas = "".join(
        f'<div style="display:grid;grid-template-columns:170px 1fr;gap:24px;padding:26px 0;border-top:1px solid {LINE}">'
        f'<span style="font-size:26px;font-weight:600;color:{TEAL}">{p}</span><span style="font-size:28px;line-height:1.35;color:#d8d2c8">{q}</span></div>'
        for p, q in items)
    cuerpo = etiqueta(f"Esta semana en INPLUX · S{semana:02d} · {rango}") + f"""
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:240px;font-size:84px">Salió a<br><em>producción.</em></h1>
<div style="position:absolute;left:84px;right:84px;top:520px">{lineas}<div style="border-top:1px solid {LINE}"></div></div>
<p class="micro" style="position:absolute;left:84px;top:1180px">Lo que no está en producción no cuenta.</p>"""
    return pieza(cuerpo, "Esta semana", claro=False, alto=ALTO)


# ---------- lunes · Actualidad IA · lente Colombia ----------

def actualidad(semana, titular, dato, lente, fuente, imagen, pie_imagen=None, tam=64):
    alto_titular = tam * 1.0 * (titular.count("<br>") + 1)
    """Rundown con lente propia: imagen arriba, titular, un dato, y «qué cambia aquí» para Colombia."""
    img = (f'<div style="position:absolute;left:84px;right:84px;top:160px;height:380px;overflow:hidden;border-radius:14px">'
           f'<img src="{imagen}" style="width:100%;height:100%;object-fit:cover;object-position:50% 55%"></div>')
    pie = f'<div class="micro" style="position:absolute;left:84px;top:556px;font-size:14px">{pie_imagen}</div>' if pie_imagen else ""
    cuerpo = img + pie + f"""
<div class="micro" style="position:absolute;left:84px;top:600px;color:{TEAL_OSC}">Actualidad IA · semana {semana:02d} · lente Colombia</div>
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:646px;font-size:{tam}px">{titular}</h1>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:{646 + alto_titular + 24}px;font-size:26px">{dato}</p>
<div style="position:absolute;left:84px;right:84px;top:{646 + alto_titular + 150}px;padding-top:20px;border-top:1px solid rgba(26,25,22,.14)">
  <div class="micro" style="color:{TEAL_OSC}">Qué cambia aquí</div>
  <p style="font-size:25px;line-height:1.35;margin-top:10px;color:{TINTA}">{lente}</p></div>""" + fuente_de(fuente, 1210)
    return pieza(cuerpo, "Actualidad IA", claro=True, alto=ALTO)


# ---------- Semana 1 (26-oct → 1-nov-2026) ----------

PIEZAS = {
    "s1_sab_pregunta-patrimonio": (lambda: pregunta_real(
        "¿Sigue vigente el umbral<br>de 40.000 UVT del impuesto<br>al patrimonio para 2026?",
        "Tributario · Tribai", "tribai-patrimonio-2026-10-23.jpg", "app.tribai.co", "23 OCT 2026", alto_captura=280, respuesta=[
            ("Respuesta", "No. Rige el de 72.000 UVT: $3.770.928.000 al 1 de enero de 2026."),
            ("Artículo", "Art. 294-3 del Estatuto Tributario, adicionado por la Ley 2277 de 2022."),
            ("Vigencia", "El Decreto 1474 de 2025, que lo bajaba a 40.000 UVT, fue declarado inexequible (C-079 de 2026)."),
        ]), 1080, ALTO),
    "s1_mie_portada-reel-01": (lambda: portada_reel(
        1, "Lo que la máquina<br><em>no puede firmar.</em>",
        "La IA redacta, calcula y resume. La responsabilidad sigue teniendo nombre y apellido."), 1080, ALTO),
    "s1_dom_changelog-ejemplo": (lambda: changelog(1, "26 OCT – 1 NOV", [  # 🚨 ejemplo de formato: los ítems los confirma Jaime cada viernes
        ("Tribai", "Normograma DIAN limpio, con URN por documento, en producción."),
        ("Kelsen", "Verificación de citas con estado de vigencia a una fecha."),
        ("Gobia", "Plan de paso de beta a producción cerrado con el primer municipio."),
    ]), 1080, ALTO),
    "s2_lun_actualidad-ejemplo": (lambda: actualidad(  # 🚨 ejemplo de formato con un dato ya verificado (Deloitte 2026)
        2, "3 de cada 4 empresas quieren<br>crecer con IA.<br><em>1 de cada 5 lo logra.</em>",
        "Deloitte encuestó a 3.235 líderes en 24 países: 74 % espera crecer en ingresos con IA y 20 % ya lo hace. Dos de cada tres ya ven ganancias de productividad.",
        "Para una empresa o un municipio en Colombia la pregunta ya no es si usar IA: es qué número del negocio o de la operación debe moverse en seis meses, y quién lo mide.",
        "Deloitte, «The State of AI in the Enterprise», 2026 · encuesta ago–sep 2025", "mj/manos.jpg",
        "Ilustración: INPLUX"), 1080, ALTO),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
