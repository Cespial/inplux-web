"""Tanda «referentes» (24-oct-2026): posts propios según la tesis + colaboraciones con 10ampro.

Qué se toma de cada referente (revisados en Instagram el 24-oct):
  @use_croma   «Claude, conectado a [fuente]»: chips con logos → nodo → fuentes. Negro plano.   → A1 Tribai, A2 Kelsen
  @julioiero   comparativa partida en dos mitades.                                             → A3 chat vs sistema
  @dotcsv      el logo del modelo en grande + una idea.                                         → A4 «Un modelo, un dato»
  @victorpay   gráfica dibujada a mano sobre papel.                                             → A5 horizonte a mano
  @10ampro     su manifiesto (manifiesto.10am.pro), citado literal, como gancho de cada colab.  → B1, B2, B3

Regla de fondos (FONDOS.md): idea → estatua en trama · logos, diagrama o cifra → negro plano · estudio → marfil.
Dentro de un carrusel colab el fondo cambia por lámina según lo que muestra.
Midjourney está pausado (pago) desde el 24-oct: se usan las estatuas ya tramadas de dia-d-reglas/ y parrilla-romana/.
"""
import importlib.util
import re
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("posic", AQUI.parent / "posicionamiento" / "build.py")
posic = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(posic)
BLACK, IVORY, MUTED, DIM, TEAL, TEAL_OSC = posic.BLACK, posic.IVORY, posic.MUTED, posic.DIM, posic.TEAL, posic.TEAL_OSC
PAPEL, TINTA, GRIS, ALTO, MARCA = posic.PAPEL, posic.TINTA, posic.GRIS, posic.ALTO, posic.MARCA
pieza, titulo_claro, fuente_de = posic.pieza, posic.titulo_claro, posic.fuente_de
LINE = "rgba(246,242,236,.16)"
CLARO_CTA = PAPEL

EXTRA = f"""<style>
.chip{{display:inline-flex;align-items:center;gap:12px;border-radius:999px;white-space:nowrap;padding:12px 22px;font-size:23px;
  border:1.5px solid {LINE};background:rgba(12,12,11,.78);color:{IVORY}}}
.chip.clara{{background:{IVORY};color:{BLACK};border-color:{IVORY};font-weight:500;font-size:27px;padding:15px 30px}}
.nodo{{border-radius:50%;background:{BLACK};border:1.5px solid {LINE};display:grid;place-items:center;
  box-shadow:0 0 0 14px rgba(0,215,202,.05),0 0 90px rgba(0,215,202,.2)}}
.tallo{{width:1.5px;background:{LINE};margin:0 auto}}
.term{{background:#121210;border:1.5px solid {LINE};border-radius:16px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.7)}}
.term .barra{{height:46px;display:flex;align-items:center;gap:8px;padding:0 20px;border-bottom:1px solid {LINE}}}
.term .barra i{{width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)}}
.term pre{{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:25px;line-height:1.7;padding:26px 30px;color:#d8d2c8;white-space:pre-wrap}}
.term .k{{color:{MUTED}}} .term .v{{color:{IVORY}}} .term .t{{color:{TEAL}}}
.cita{{font-weight:500;letter-spacing:-.03em;line-height:1.02}}
</style>"""


# ---------- piezas sueltas ----------

def logo(nombre, alto=30, color=IVORY):
    """Logo monocromo de Simple Icons, en línea y con el color que se pida (solo como referencia, sin alterar la forma)."""
    svg = (AQUI / "logos" / f"{nombre}.svg").read_text()
    svg = re.sub(r"<title>.*?</title>", "", svg)
    return svg.replace("<svg ", f'<svg width="{alto}" height="{alto}" fill="{color}" style="display:block;flex:none" ', 1)


def bandera(alto=20):
    """Bandera de Colombia dibujada (sin emoji: el render de Chrome headless no siempre los trae)."""
    a = alto * 1.5
    return (f'<span style="display:inline-block;width:{a}px;height:{alto}px;border-radius:4px;overflow:hidden;flex:none;'
            f'background:linear-gradient(180deg,#FCD116 0 50%,#003893 50% 75%,#CE1126 75% 100%)"></span>')


def trama(img, izq, arriba, ancho, opacidad=.5, velo=True):
    v = (f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.86) 15%,'
         f'rgba(12,12,11,.25) 32%,transparent 46%,transparent 76%,rgba(12,12,11,.92) 91%,{BLACK} 100%)"></div>') if velo else ""
    return f'<img src="trama/{img}.png" style="position:absolute;left:{izq}px;top:{arriba}px;width:{ancho}px;opacity:{opacidad}">' + v


def ramas(n, ancho, hacia="abajo", alto=80):
    xs = [ancho * (i + .5) / n for i in range(n)]
    if hacia == "abajo":
        c = "".join(f'<path d="M{ancho/2},0 C{ancho/2},{alto*.55} {x},{alto*.45} {x},{alto}" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
                    f'<circle cx="{x}" cy="{alto}" r="3" fill="{MUTED}"/>' for x in xs)
    else:
        c = "".join(f'<path d="M{x},0 C{x},{alto*.55} {ancho/2},{alto*.45} {ancho/2},{alto}" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
                    f'<circle cx="{x}" cy="0" r="3" fill="{MUTED}"/>' for x in xs)
    return f'<svg width="{ancho}" height="{alto + 4}" style="display:block;overflow:visible">{c}</svg>'


def fila_chips(chips, ancho):
    return (f'<div style="display:grid;grid-template-columns:repeat({len(chips)},1fr);width:{ancho}px">'
            + "".join(f'<div style="display:flex;justify-content:center">{c}</div>' for c in chips) + "</div>")


def conectado(arriba, nodo, centro, abajo, ancho=912, nodo_tam=150):
    """Patrón Croma: los modelos llegan a un nodo, el nodo abre una fuente con bandera y la fuente se abre en categorías."""
    return (f'<div style="display:flex;flex-direction:column;align-items:center">'
            f'{fila_chips(arriba, ancho)}<div style="height:6px"></div>{ramas(len(arriba), ancho, "arriba")}'
            f'<div class="nodo" style="width:{nodo_tam}px;height:{nodo_tam}px">{nodo}</div>'
            f'<div class="tallo" style="height:36px"></div><span class="chip clara">{bandera(22)}{centro}</span>'
            f'{ramas(len(abajo), ancho)}<div style="height:8px"></div>{fila_chips(abajo, ancho)}</div>')


def terminal(titulo, lineas):
    filas = "\n".join(lineas)
    return (f'<div class="term"><div class="barra"><i></i><i></i><i></i>'
            f'<span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{MUTED};letter-spacing:.04em">{titulo}</span></div>'
            f'<pre>{filas}</pre></div>')


def cta_oscuro(arriba=1110):
    marcador = f'<svg width="20" height="26" viewBox="0 0 20 26"><path d="M2 2h16v22l-8-6-8 6z" fill="{BLACK}"/></svg>'
    return f"""<div style="position:absolute;left:84px;right:84px;top:{arriba}px;display:flex;gap:16px">
  <span class="chip clara" style="font-size:25px">{marcador}Guarda este carrusel</span>
  <span class="chip" style="font-size:25px">Síguenos · @inplux_</span></div>"""


def titular(t, sub=None, tam=84, arriba=190, ancho=None):
    s = f'<p class="sub" style="margin-top:28px;max-width:880px">{sub}</p>' if sub else ""
    w = f"max-width:{ancho}px;" if ancho else ""
    return f'<div style="position:absolute;left:84px;right:84px;top:{arriba}px;{w}"><h1 class="titular funde" style="font-size:{tam}px">{t}</h1>{s}</div>'


def oscura(cuerpo, pie, n=None, total=None):
    return pieza(EXTRA + cuerpo, pie, n, total, claro=False, alto=ALTO)


# ---------- A1 · Claude, conectado al Estatuto Tributario (Tribai MCP, abierto desde el 13-oct-2026) ----------

MODELOS = [f'<span class="chip">{logo("claude", 26, "#D97757")}Claude</span>',
           f'<span class="chip">{logo("openai", 24)}ChatGPT</span>',
           f'<span class="chip">{logo("cursor", 24)}Cursor</span>',
           f'<span class="chip"><span style="font-family:ui-monospace,Menlo,monospace;color:{TEAL};font-size:20px">&gt;_</span>Claude Code</span>']
NODO_TRIBAI = f'<span style="font-size:34px;font-weight:600;letter-spacing:-.02em">Tribai</span>'
FUENTES_ET = [f'<span class="chip">{t}</span>' for t in ("Artículos ET", "Doctrina DIAN", "Consejo de Estado", "Leyes y decretos")]
TRIBAI_383 = [
    '<span class="t">&gt;</span> <span class="v">vigencia_articulo</span>("383", "2026-10-24")',
    "",
    '<span class="k">estado     </span> <span class="t">vigente</span>',
    '<span class="k">desde      </span> <span class="v">2022-12-13</span>',
    '<span class="k">norma      </span> <span class="v">Ley 2277 de 2022</span>',
    '<span class="k">historial  </span> <span class="v">12 versiones desde 1989</span>',
    '<span class="k">fuente     </span> <span class="v">co:decreto:624:1989#art_383</span>',
]


def tribai(i):
    T = 4
    if i == 1:
        cuerpo = titular("Claude, conectado al<br><em>Estatuto Tributario.</em>",
                         "Tribai es un conector <b>abierto y sin cuenta</b>: cada respuesta llega con cita y vigencia.", 80) + \
            f'<div style="position:absolute;left:84px;right:84px;top:560px">{conectado(MODELOS, NODO_TRIBAI, "Estatuto Tributario", FUENTES_ET)}</div>'
    elif i == 2:
        cuerpo = titular("Una consulta real,<br><em>con la fuente a la vista.</em>", tam=76) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Tribai · 24 oct 2026", TRIBAI_383)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:960px;font-size:28px">El Art. 383 rige hoy con el texto de la Ley 2277 de 2022.
<b>Las herramientas no redactan:</b> devuelven solo lo que está en el corpus, con cita y vigencia. El criterio es de quien firma.</p>"""
    elif i == 3:
        filas = [("01", "consultar_tributario", "Una pregunta en lenguaje natural. Devuelve fragmentos citados del ET, doctrina DIAN, jurisprudencia y leyes."),
                 ("02", "vigencia_articulo", "El estado de un artículo en una fecha: vigente, derogado, inexequible o condicionado, y qué norma lo cambió."),
                 ("03", "jurisprudencia_ce", "Sentencias de la Sección Cuarta del Consejo de Estado por tema, artículo o expediente.")]
        f = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3 style="font-size:34px;font-family:ui-monospace,Menlo,monospace;letter-spacing:-.01em">{t}</h3><p>{d}</p></div></div>' for n, t, d in filas)
        cuerpo = titular("Tres herramientas.<br><em>Ninguna inventa.</em>", tam=84) + \
            f'<div style="position:absolute;left:84px;right:84px;top:470px">{f}<div style="border-top:1px solid {LINE}"></div></div>'
    else:
        pasos = [("Claude.ai o Desktop", "Ajustes → Conectores → conector personalizado con esta URL:"),
                 ("Claude Code", "Un comando en la terminal:"),
                 ("Cursor, VS Code, Codex", "La misma URL como servidor MCP (Streamable HTTP).")]
        cuerpo = titular("Conéctalo<br><em>en un minuto.</em>", tam=88) + f"""
<div style="position:absolute;left:84px;right:84px;top:440px">
  <div class="fila"><div class="n">01</div><div><h3 style="font-size:32px">{pasos[0][0]}</h3><p>{pasos[0][1]}</p>
    <p style="font-family:ui-monospace,Menlo,monospace;font-size:24px;color:{TEAL};margin-top:10px">tribai.co/api/mcp/public</p></div></div>
  <div class="fila"><div class="n">02</div><div><h3 style="font-size:32px">{pasos[1][0]}</h3><p>{pasos[1][1]}</p>
    <p style="font-family:ui-monospace,Menlo,monospace;font-size:19px;color:{IVORY};margin-top:10px;line-height:1.5">claude mcp add --transport http tribai<br>https://tribai.co/api/mcp/public</p></div></div>
  <div class="fila"><div class="n">03</div><div><h3 style="font-size:32px">{pasos[2][0]}</h3><p>{pasos[2][1]}</p></div></div>
  <div style="border-top:1px solid {LINE}"></div>
  <p class="micro" style="margin-top:22px;font-size:15px;line-height:1.7">Hasta 10 consultas por minuto · guía en tribai.co/mcp<br>Los conectores personalizados de Claude piden plan de pago</p>
</div>""" + cta_oscuro(1130)
    return oscura(cuerpo, "Tribai · conector MCP", i, T)


# ---------- A2 · Kelsen, conectado a tu Claude (acceso por solicitud) ----------

KELSEN_240 = [
    '<span class="t">&gt;</span> <span class="v">verificar_cita</span>("artículo 240 del Estatuto Tributario")',
    "",
    '<span class="k">veredicto  </span> <span class="t">EXISTE</span>',
    '<span class="k">fuente     </span> <span class="v">Estatuto Tributario (Decreto 624/1989)</span>',
    '<span class="k">confirmado </span> <span class="v">por etiqueta de artículo</span>',
    '<span class="k">vigencia   </span> <span class="v">sin dato · verifíquelo en la fuente</span>',
]


NODO_KELSEN = '<span style="font-size:32px;font-weight:600;letter-spacing:-.02em">Kelsen</span>'


def kelsen(i):
    T = 3
    if i == 1:
        abajo = [f'<span class="chip" style="font-size:21px;padding:11px 18px">{t}</span>' for t in ("Normas", "Jurisprudencia", "Artículo", "Vigencia", "Cita verificada")]
        cuerpo = titular("Kelsen, conectado<br><em>a tu Claude.</em>",
                         "Normas y jurisprudencia de Colombia, <b>con la fuente de cada resultado</b>.", 86) + \
            f'<div style="position:absolute;left:84px;right:84px;top:560px">{conectado(MODELOS[:2] + MODELOS[3:], NODO_KELSEN, "Derecho colombiano", abajo)}</div>'
    elif i == 2:
        cuerpo = titular("Una IA que dice<br><em>lo que no sabe.</em>", tam=86) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Kelsen · 24 oct 2026", KELSEN_240)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:950px;font-size:28px">La cita existe y se confirma contra el artículo.
La vigencia no tiene respaldo en el corpus, <b>y Kelsen lo dice</b> en vez de adivinarla.</p>"""
    else:
        f = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3 style="font-size:32px;font-family:ui-monospace,Menlo,monospace">{t}</h3><p>{d}</p></div></div>'
                    for n, t, d in [("01", "verificar_cita", "¿Existe la norma o la sentencia que citó la IA? ¿Sigue vigente?"),
                                    ("02", "vigencia", "El estado de una norma y qué la afectó."),
                                    ("03", "buscar_normas · buscar_jurisprudencia", "Búsqueda con enlace al documento del que sale cada resultado.")])
        cuerpo = titular("Cinco herramientas.<br><em>Acceso por solicitud.</em>", tam=80) + \
            f'<div style="position:absolute;left:84px;right:84px;top:440px">{f}<div style="border-top:1px solid {LINE}"></div>' \
            f'<p class="micro" style="margin-top:22px;font-size:15px">Solicitud y enlace de conector en kelsen.io/mcp</p></div>' + cta_oscuro(1130)
    return oscura(cuerpo, "Kelsen · conector MCP", i, T)


# ---------- A3 · El chat llega. El sistema, casi nunca. (comparativa partida, romana) ----------

def chat_vs_sistema():
    lado = lambda items, c: "".join(f'<div style="display:flex;gap:16px;align-items:baseline;padding:9px 0"><span style="color:{c};font-size:22px">{"×" if c == MUTED else "+"}</span>'
                                    f'<span style="font-size:29px;color:{IVORY if c != MUTED else "#bdb7ad"}">{t}</span></div>' for t in items)
    chat = ["Responde en segundos", "No sabe quién pregunta", "No sabe qué norma rige hoy", "Nadie firma"]
    sistema = ["Usa los datos de tu operación", "Sabe quién puede ver qué", "Responde con la norma vigente a la fecha", "Deja rastro de cada respuesta", "Una persona experta firma"]
    cuerpo = f"""
<div style="position:absolute;left:0;top:0;width:1080px;height:675px;overflow:hidden">
  <img src="trama/orador.png" style="position:absolute;left:470px;top:-60px;width:720px;opacity:.42"></div>
<div style="position:absolute;left:0;top:675px;width:1080px;height:675px;overflow:hidden">
  <img src="trama/arquitecto.png" style="position:absolute;left:520px;top:-150px;width:640px;opacity:.5"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.5) 14%,transparent 30%,transparent 88%,{BLACK} 100%)"></div>
<div style="position:absolute;left:84px;right:84px;top:170px"><div class="micro">Un chat</div>{lado(chat, MUTED)}</div>
<div style="position:absolute;left:0;right:0;top:560px;height:230px;background:linear-gradient(180deg,transparent,rgba(12,12,11,.92) 30%,rgba(12,12,11,.92) 70%,transparent)"></div>
<div style="position:absolute;left:84px;right:84px;top:586px;border-top:1px solid {LINE}"></div>
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:616px;font-size:70px">El chat llega.<br><em>El sistema, casi nunca.</em></h1>
<div style="position:absolute;left:84px;right:84px;top:820px"><div class="micro" style="color:{TEAL}">Un sistema en producción</div>{lado(sistema, TEAL)}</div>"""
    return oscura(cuerpo, "Una idea")


# ---------- A4 · Un modelo, un dato (dotcsv) ----------

METR = "METR, «Time Horizon 1.1», ene-2026, y «Frontier Risk Report», may-2026 · tareas de software, ML y ciberseguridad; intervalos amplios"


def modelo_dato(n, marca, nombre, cifra, que, lente):
    marca_html = (f'<div style="position:absolute;left:84px;top:200px">{logo(marca, 150, "#D97757" if marca == "claude" else IVORY)}</div>' if marca else
                  f'<div style="position:absolute;left:84px;top:300px"><span class="chip">El mejor modelo público medido</span></div>')
    cuerpo = marca_html + f"""
<div class="micro" style="position:absolute;left:84px;top:400px;color:{TEAL}">Un modelo, un dato · {n:02d}</div>
<div style="position:absolute;left:84px;top:440px;font-size:40px;font-weight:500;letter-spacing:-.02em">{nombre}</div>
<div class="titular" style="position:absolute;left:78px;top:500px;font-size:250px;letter-spacing:-.06em;color:{IVORY}">{cifra}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:790px;font-size:30px">{que}</p>
<div style="position:absolute;left:84px;right:84px;top:960px;padding-top:22px;border-top:1px solid {LINE}">
  <div class="micro" style="color:{TEAL}">Qué cambia para tu proyecto</div>
  <p style="font-size:28px;line-height:1.38;margin-top:12px;color:{IVORY}">{lente}</p></div>
<p style="position:absolute;left:84px;right:84px;top:1190px;font-size:17px;color:{DIM};line-height:1.45">Fuente: {METR}</p>"""
    return oscura(cuerpo, "Un modelo, un dato")


# ---------- A5 · Gráfica a mano (VictorPay) · marfil ----------

def grafica_mano():
    import math
    pts = [(2023.2, 3.5, "GPT-4", "3,5 min"), (2025.6, 214, "GPT-5", "3,6 h"), (2025.9, 320, "Claude Opus 4.5", "5,3 h"), (2026.15, 720, "frontera pública", "~12 h")]
    x = lambda f: 60 + (f - 2023) * 255
    y = lambda m: 470 - math.log10(m) * 140
    trazo = f'stroke="{TINTA}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#lapiz)"'
    d = "M" + " Q".join([f"{x(2023.2)},{y(3.5)}"] + [f"{(x(a[0]) + x(b[0])) / 2 - 20},{(y(a[1]) + y(b[1])) / 2 + 30} {x(b[0])},{y(b[1])}" for a, b in zip(pts, pts[1:])])
    marcas = ""
    for k, (f, m, t, lab) in enumerate(pts):
        ult = k == len(pts) - 1
        c = TEAL_OSC if ult else TINTA
        ancla, dx, dy = [("start", 6, 54), ("end", -22, -30), ("middle", 0, 58), ("end", -26, -34)][k]
        marcas += (f'<circle cx="{x(f)}" cy="{y(m)}" r="{11 if ult else 8}" fill="{c}" filter="url(#lapiz)"/>'
                   f'<text x="{x(f) + dx}" y="{y(m) + dy}" text-anchor="{ancla}" font-family="Rethink Sans" font-size="34" font-weight="600" fill="{c}">{lab}</text>'
                   f'<text x="{x(f) + dx}" y="{y(m) + dy + 30}" text-anchor="{ancla}" font-family="Rethink Sans" font-size="21" fill="{GRIS}">{t}</text>')
    anios = "".join(f'<text x="{x(a)}" y="540" text-anchor="middle" font-family="Rethink Sans" font-size="22" fill="{GRIS}" letter-spacing="3">{a}</text>' for a in (2023, 2024, 2025, 2026))
    flecha = (f'<path d="M640,600 C700,560 760,520 800,470" {trazo} stroke="{TEAL_OSC}" stroke-dasharray="1 0"/>'
              f'<path d="M780,470 L803,466 L796,490" {trazo} stroke="{TEAL_OSC}"/>')
    return f"""<svg width="912" height="560" viewBox="0 0 912 560" style="display:block;overflow:visible">
  <defs><filter id="lapiz"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/>
    <feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs>
  <path d="M40,500 L890,504" {trazo}/><path d="M42,502 L38,40" {trazo}/><path d="M28,58 L38,36 L50,58" {trazo}/>
  <text x="58" y="60" font-family="Rethink Sans" font-size="21" fill="{GRIS}">duración de la tarea (escala log)</text>
  <path d="{d}" {trazo} stroke-dasharray="3 10" stroke-width="4"/>{marcas}{anios}
  </svg>"""


def horizonte_mano():
    cuerpo = titulo_claro("¿Cuánto trabaja solo<br><em>un agente de IA?</em>",
                          "Tareas que completa la mitad de las veces, medidas en el tiempo que le toman a una persona", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{grafica_mano()}</div>
<div style="position:absolute;left:84px;right:84px;top:1030px;display:flex;gap:28px;align-items:baseline">
  <span style="white-space:nowrap;font-size:58px;font-weight:600;letter-spacing:-.03em;color:{TEAL_OSC}">131 días</span>
  <span style="font-size:25px;line-height:1.35;color:{TINTA}">es lo que tarda en duplicarse desde 2023. La otra mitad de las veces la revisa una persona.</span></div>""" + fuente_de(METR, 1170)
    return pieza(cuerpo, "Dibujado a mano", claro=True, alto=ALTO)


# ---------- B · Colaboraciones INPLUX × 10ampro (citas literales de manifiesto.10am.pro) ----------

def sello(alto=22, logo_10=50):
    return (f'<div style="display:flex;align-items:center;gap:16px">{MARCA.format(s=36, c="#fff")}'
            f'<img src="assets/wordmark-white.svg" style="height:{alto}px;display:block">'
            f'<span style="color:{DIM};font-size:{alto}px;line-height:1">×</span>'
            f'<img src="assets/10ampro.png" style="height:{logo_10}px;width:{logo_10}px;display:block"></div>')


def colab(cuerpo, pie, n, total=5):
    """Mismo marco v5 en 3:4, con el sello INPLUX × 10ampro en lugar del logo solo."""
    html = posic.head(False, ALTO) + EXTRA + f'<div style="position:absolute;left:0;top:45px;width:1080px;height:1350px">{cuerpo}</div>'
    m = 115
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    puntos = "".join(f'<i style="width:9px;height:9px;border-radius:50%;background:{IVORY if i == n else "rgba(246,242,236,.28)"}"></i>' for i in range(1, total + 1))
    derecha = f'<div class="micro" style="color:{IVORY}">Desliza →</div>' if n == 1 else '<div class="micro">INPLUX.CO · 10AM.PRO</div>'
    return html + f"""<div class="grano"></div><div class="marco"></div>{cruces}
<div style="position:absolute;left:84px;top:{m - 10}px">{sello()}</div>
<div class="micro" style="position:absolute;right:84px;top:{m + 8}px;letter-spacing:.2em">{n} / {total}</div>
<div style="position:absolute;left:84px;right:84px;bottom:{m}px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro">{pie}</div><div style="display:flex;gap:9px">{puntos}</div>{derecha}</div></div></body></html>"""


def portada_cita(cita, origen, img, colocacion, tam=110, opacidad=.55):
    izq, arriba, ancho = colocacion
    return trama(img, izq, arriba, ancho, opacidad) + f"""
<div class="micro" style="position:absolute;left:84px;top:200px;color:{TEAL}">Manifiesto 10ampro</div>
<h1 class="cita titular funde" style="position:absolute;left:84px;right:84px;top:250px;font-size:{tam}px">«{cita}»</h1>
<div class="micro" style="position:absolute;left:84px;top:1150px">{origen}</div>"""


def cierre_colab(frase, sub):
    return trama("galeria", 150, 260, 1250, .25) + f"""
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px;padding:0 84px 30px">
  <div style="display:flex;align-items:center;gap:26px">{MARCA.format(s=110, c="#fff")}<img src="assets/wordmark-white.svg" style="height:66px"></div>
  <div style="display:flex;align-items:center;gap:26px;width:560px"><i style="flex:1;height:1.5px;background:linear-gradient(90deg,transparent,{LINE})"></i>
    <span style="font-size:70px;line-height:1;color:{TEAL}">×</span><i style="flex:1;height:1.5px;background:linear-gradient(90deg,{LINE},transparent)"></i></div>
  <img src="assets/10ampro.png" style="width:220px;height:220px;display:block;border-radius:50%;box-shadow:0 0 0 16px rgba(246,242,236,.03),0 0 0 17px {LINE}">
  <h2 class="titular" style="font-size:52px;text-align:center;margin-top:20px">{frase}</h2>
  <p class="sub" style="text-align:center">{sub}</p></div>"""


def b1(i):
    """«Una idea encerrada se pudre.» → por eso Tribai es un conector abierto."""
    pie = "Una idea abierta"
    if i == 1:
        c = portada_cita("Una idea<br>encerrada<br>se pudre.", "Carta fundacional · manifiesto.10am.pro", "antorcha", (-120, 330, 1400), 128, .8)
    elif i == 2:
        lineas = ["Capital es una tesis.", "Capital es un deal.", "Capital es una lectura temprana.", "Capital es un contacto.", "Capital es una alerta."]
        c = trama("orador", 330, 220, 1000, .4) + titular("El capital<br><em>no es solo plata.</em>", tam=92) + \
            f'<div style="position:absolute;left:84px;top:520px">' + "".join(f'<div style="font-size:38px;line-height:1.75;color:{IVORY if k == 0 else "#bdb7ad"}">{t}</div>' for k, t in enumerate(lineas)) + "</div>" + \
            f'<div class="micro" style="position:absolute;left:84px;top:1000px">Manifiesto 10ampro · I. Open Source Capital</div>' + \
            f'<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:29px">Para nosotros, <b>capital también es criterio tributario</b> que cualquiera pueda consultar.</p>'
    elif i == 3:
        c = titular("Por eso Tribai<br><em>es un conector abierto.</em>", "Claude, ChatGPT o Cursor consultan el Estatuto Tributario <b>sin cuenta</b>.", 76) + \
            f'<div style="position:absolute;left:84px;right:84px;top:560px">{conectado(MODELOS, NODO_TRIBAI, "Estatuto Tributario", FUENTES_ET)}</div>'
    elif i == 4:
        c = titular("Abierta,<br><em>pero con la fuente a la vista.</em>", tam=76) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Tribai · 24 oct 2026", TRIBAI_383)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:960px;font-size:28px">Compartir no es soltar cualquier cosa: <b>cada respuesta dice de dónde sale</b> y si la norma sigue vigente. Hasta 10 consultas por minuto, sin cuenta.</p>"""
    else:
        c = cierre_colab("Una idea abierta se usa.", "Conéctalo: <b>tribai.co/mcp</b>")
    return colab(c, pie, i)


def b2(i):
    """«El grupo no existe para tener más mensajes. Existe para tener mejor señal.» → con la IA pasa igual."""
    pie = "Mejor señal"
    if i == 1:
        c = portada_cita("El grupo no existe para tener más mensajes.<br><em>Existe para tener mejor señal.</em>",
                         "Manifiesto 10ampro · III. Collective Intelligence", "senadores", (-260, 640, 1600), 84)
    elif i == 2:
        mas = ["Un texto largo que suena bien", "Sin artículo", "Sin fecha", "Nadie responde por él"]
        mejor = ["La respuesta en una línea", "El artículo que la sostiene", "La vigencia a la fecha", "Una persona que firma"]
        col = lambda t, items, c: (f'<div><div class="micro" style="color:{c}">{t}</div>' + "".join(
            f'<div style="font-size:29px;line-height:1.35;padding:16px 0;border-top:1px solid {LINE};color:{IVORY if c == TEAL else "#bdb7ad"}">{x}</div>' for x in items) + "</div>")
        c = trama("orador", 380, 300, 900, .3) + titular("Con la IA<br><em>pasa igual.</em>", tam=96) + \
            f'<div style="position:absolute;left:84px;right:84px;top:540px;display:grid;grid-template-columns:1fr 1fr;gap:48px">{col("Más mensajes", mas, MUTED)}{col("Mejor señal", mejor, TEAL)}</div>'
    elif i == 3:
        filas = [("Respuesta", "Para personas naturales rige el umbral de 72.000 UVT: $3.770.928.000 al 1 de enero de 2026."),
                 ("Artículo", "Art. 294-3 del Estatuto Tributario, adicionado por la Ley 2277 de 2022."),
                 ("Vigencia", "El Decreto 1474 de 2025, que lo bajaba a 40.000 UVT, fue declarado inexequible (C-079 de 2026).")]
        f = "".join(f'<div style="display:grid;grid-template-columns:150px 1fr;gap:20px;padding:14px 0;border-top:1px solid {LINE};align-items:baseline">'
                    f'<span class="micro" style="font-size:15px">{e}</span><span style="font-size:25px;line-height:1.3;color:{TEAL if k == 0 else IVORY}">{v}</span></div>' for k, (e, v) in enumerate(filas))
        c = titular("Una señal se ve así.", "¿Sigue vigente el umbral de 40.000 UVT del impuesto al patrimonio?", 80) + f"""
<div style="position:absolute;left:190px;top:470px;width:700px;border-radius:14px;overflow:hidden;border:1.5px solid {LINE};background:#151513">
  <div style="height:42px;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid {LINE}">
    <i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i><i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i><i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i>
    <span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{MUTED}">app.tribai.co</span></div>
  <img src="capturas/tribai-patrimonio-2026-10-23.jpg" style="display:block;width:700px;height:280px;object-fit:cover;object-position:top"></div>
<div class="micro" style="position:absolute;left:190px;top:806px;font-size:14px">Captura real · 23 oct 2026</div>
<div style="position:absolute;left:84px;right:84px;top:850px">{f}</div>"""
    elif i == 4:
        nodos = ["Una pregunta real", "La fuente", "La vigencia a la fecha", "Una persona experta"]
        c = trama("senadores", -300, 700, 1700, .28) + titular("Señal es lo que<br><em>se puede verificar.</em>", tam=86) + \
            f'<div style="position:absolute;left:84px;right:84px;top:520px;display:flex;flex-direction:column;align-items:center">' + \
            "".join(f'<span class="chip{" clara" if k == 3 else ""}" style="font-size:28px">{t}</span>' + ('<div class="tallo" style="height:46px"></div>' if k < 3 else "") for k, t in enumerate(nodos)) + \
            '</div><p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:28px;text-align:center">La IA acelera el trabajo. <b>Personas expertas dirigen y validan</b> las decisiones críticas.</p>'
    else:
        c = cierre_colab("Menos texto. Más señal.", "Gracias a <b>10ampro</b> por escribirlo primero.")
    return colab(c, pie, i)


def b3(i):
    """«La cultura es el firewall.» → en software, el firewall es quién revisa, valida y firma."""
    pie = "El firewall"
    if i == 1:
        c = portada_cita("La cultura<br>es el<br><em>firewall.</em>", "Manifiesto 10ampro · VIII. La regla de fondo", "galeria", (120, 380, 1250), 140)
    elif i == 2:
        c = trama("acueducto", 200, 300, 1000, .42) + titular("En software<br><em>también.</em>", tam=104) + \
            f'<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:520px;font-size:38px;line-height:1.35;max-width:840px">' \
            f'El firewall no es solo código. Es <b>quién revisa, quién valida y quién firma</b> antes de que algo salga a producción.</p>'
    elif i == 3:
        pasos = [("Un problema real", False), ("Construcción con IA", False), ("Revisión de una persona experta", True), ("Producción", False)]
        c = trama("arquitecto", 560, 250, 760, .3) + titular("Dónde va<br><em>el firewall.</em>", tam=96) + \
            f'<div style="position:absolute;left:84px;top:500px;display:flex;flex-direction:column;align-items:flex-start">' + \
            "".join((f'<span class="chip clara" style="font-size:30px;box-shadow:0 0 0 10px rgba(0,215,202,.10),0 0 60px rgba(0,215,202,.35)">{t}</span>' if f
                     else f'<span class="chip" style="font-size:30px">{t}</span>') +
                    ('<div style="width:1.5px;height:56px;background:' + LINE + ';margin-left:40px"></div>' if k < 3 else "") for k, (t, f) in enumerate(pasos)) + "</div>" + \
            f'<div class="micro" style="position:absolute;left:600px;top:768px;color:{TEAL}">← aquí</div>'
    elif i == 4:
        filas = [("01", "¿Quién revisó?", "Una persona con nombre, no «el sistema»."),
                 ("02", "¿Contra qué fuente?", "La norma, el dato o el contrato que sostiene la decisión, con fecha."),
                 ("03", "¿Quién firma?", "La responsabilidad no se delega en un modelo.")]
        f = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3>{t}</h3><p>{d}</p></div></div>' for n, t, d in filas)
        c = titular("Tres preguntas antes<br><em>de salir a producción.</em>", tam=80) + \
            f'<div style="position:absolute;left:84px;right:84px;top:470px">{f}<div style="border-top:1px solid {LINE}"></div></div>' + \
            f'<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1010px;font-size:28px">Si alguna no tiene respuesta, <b>no está lista</b>.</p>'
    else:
        c = cierre_colab("La IA acelera el trabajo.<br>Personas expertas lo validan.", "Gracias a <b>10ampro</b> por la regla de fondo.")
    return colab(c, pie, i)


PIEZAS = {}
for k in range(1, 5):
    PIEZAS[f"a1_tribai_{k}"] = ((lambda k=k: tribai(k)), 1080, ALTO)
for k in range(1, 4):
    PIEZAS[f"a2_kelsen_{k}"] = ((lambda k=k: kelsen(k)), 1080, ALTO)
PIEZAS["a3_chat-vs-sistema"] = (chat_vs_sistema, 1080, ALTO)
PIEZAS["a4_modelo_1_opus"] = (lambda: modelo_dato(1, "claude", "Claude Opus 4.5", "5,3 h",
    "Tareas que a una persona experta le toman 5 horas y 20 minutos: <b>las completa solo, la mitad de las veces.</b>",
    "La otra mitad la revisa alguien. Diseña ese paso desde el día uno, no cuando falle."), 1080, ALTO)
PIEZAS["a4_modelo_2_gpt5"] = (lambda: modelo_dato(2, "openai", "GPT-5", "3,6 h",
    "Tareas de 3 horas y 34 minutos de una persona experta: <b>las completa solo, la mitad de las veces.</b>",
    "Elegir modelo importa menos que medir: prueba con tus tareas reales antes de comprometer un proceso."), 1080, ALTO)
PIEZAS["a4_modelo_3_frontera"] = (lambda: modelo_dato(3, None, "La frontera pública · feb–mar 2026", "~12 h",
    "Al 50 % de acierto. <b>Si exiges 80 %, la tarea baja a unos 90 minutos.</b>",
    "Lo que puedes automatizar depende de cuánto error aguanta tu proceso, no del titular del lanzamiento."), 1080, ALTO)
PIEZAS["a5_horizonte-mano"] = (horizonte_mano, 1080, ALTO)
for k in range(1, 6):
    PIEZAS[f"b1_idea-abierta_{k}"] = ((lambda k=k: b1(k)), 1080, ALTO)
    PIEZAS[f"b2_mejor-senal_{k}"] = ((lambda k=k: b2(k)), 1080, ALTO)
    PIEZAS[f"b3_firewall_{k}"] = ((lambda k=k: b3(k)), 1080, ALTO)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
    print(len(PIEZAS), "piezas escritas")
