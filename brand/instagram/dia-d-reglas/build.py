"""Carrusel de colaboración INPLUX × 10ampro: las tres reglas de su comunidad (v4).

Historia: v1 barroco (Newsreader), v2 gramática de Sudáfrica, v3 estatuaria romana en B/N
sin Día D y con el logo de 10ampro. v4 (22-oct-2026): Cristian pidió «algo más interesante»
mirando @use_croma. Lo que se toma de Croma (post «¿Qué rige hoy Open Finance en Colombia?»):
  - la estatua NO va como foto: va en trama de puntos (trama.py), gigante, recortada y tenue;
  - marco fino con «+» en las esquinas, contador «1 / 5», barra inferior con paginador;
  - titular que se desvanece de marfil a gris; subtítulo en versalitas con palabras resaltadas;
  - un elemento protagonista por lámina (aquí, un diagrama de píldoras y nodo como el de Sudáfrica).
Identidad: solo Rethink Sans y tokens v5 de inplux.co. Logo de 10ampro sin alterar.
"""
from pathlib import Path

AQUI = Path(__file__).parent
BLACK, IVORY, MUTED, DIM, TEAL = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca"
LINE = "rgba(246,242,236,.16)"
TOTAL = 5
MARCA = ('<svg viewBox="0 0 100 100" width="{s}" height="{s}"><rect x="8" y="57" width="42" height="13" rx="6.5" fill="#fff"/>'
         '<rect x="29" y="39" width="42" height="13" rx="6.5" fill="#fff"/><rect x="50" y="21" width="42" height="13" rx="6.5" fill="#15dcc4"/></svg>')
GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")


def head():
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1350px;overflow:hidden;background:{BLACK}}}
body{{font-family:"Rethink Sans",sans-serif;color:{IVORY};-webkit-font-smoothing:antialiased}}
.lienzo{{position:relative;width:1080px;height:1350px;overflow:hidden;background:{BLACK}}}
.trama{{position:absolute;display:block}}
.grano{{position:absolute;inset:0;background-image:{GRANO};opacity:.06;mix-blend-mode:overlay}}
.marco{{position:absolute;inset:30px;border:1px solid rgba(246,242,236,.10)}}
.cruz{{position:absolute;width:18px;height:18px;color:rgba(246,242,236,.45);font-size:22px;line-height:18px;text-align:center;font-weight:300}}
.titular{{font-weight:500;letter-spacing:-.03em;line-height:1.0;
  background:linear-gradient(90deg,{IVORY} 0%,{IVORY} 45%,#8d877e 100%);-webkit-background-clip:text;background-clip:text;color:transparent}}
.sub{{font-size:21px;letter-spacing:.22em;text-transform:uppercase;line-height:1.7;color:{DIM};font-weight:500}}
.sub b{{color:{IVORY};font-weight:600}}
.micro{{font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:{MUTED};font-weight:500}}
.pill{{display:inline-flex;align-items:center;gap:12px;border-radius:999px;white-space:nowrap}}
.pill.oscura{{background:rgba(12,12,11,.7);border:1.5px solid {LINE};padding:14px 28px;font-size:26px;backdrop-filter:blur(2px)}}
.pill.rama{{border:1.5px solid {LINE};background:rgba(12,12,11,.72);padding:11px 20px;font-size:21px}}
.pill.clara{{background:{IVORY};color:{BLACK};padding:16px 32px;font-size:30px;font-weight:500;
  box-shadow:0 0 0 8px rgba(246,242,236,.06),0 20px 60px rgba(0,0,0,.6)}}
.nodo{{width:116px;height:116px;border-radius:50%;background:{BLACK};border:1.5px solid {LINE};display:grid;place-items:center;
  box-shadow:0 0 0 14px rgba(0,215,202,.05),0 0 80px rgba(0,215,202,.18)}}
.tallo{{width:1.5px;background:{LINE};margin:0 auto}}
.tarjeta{{background:{IVORY};color:{BLACK};border-radius:14px;display:flex;justify-content:space-between;align-items:center;padding:30px 36px}}
</style></head><body><div class="lienzo">"""


VELOS = (f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.85) 14%,rgba(12,12,11,.25) 30%,'
         f'transparent 45%,transparent 80%,rgba(12,12,11,.9) 92%,{BLACK} 100%)"></div>')


def trama(img, izq, arriba, ancho, mascara="none", opacidad=.55):
    """Estatua en puntos, desbordando el lienzo. mascara: degradado CSS que la desvanece."""
    return (f'<img class="trama" src="trama/{img}.png" style="left:{izq}px;top:{arriba}px;width:{ancho}px;'
            f'opacity:{opacidad};-webkit-mask-image:{mascara};mask-image:{mascara}">') + VELOS


def sello(alto=22, logo=50):
    return (f'<div style="display:flex;align-items:center;gap:16px">'
            f'<img src="assets/wordmark-white.svg" style="height:{alto}px;display:block">'
            f'<span style="color:{DIM};font-size:{alto}px;line-height:1">×</span>'
            f'<img src="assets/10ampro.png" style="height:{logo}px;width:{logo}px;display:block"></div>')


def marco(n, pie):
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    puntos = "".join(f'<i style="width:9px;height:9px;border-radius:50%;background:{IVORY if i == n else "rgba(246,242,236,.28)"}"></i>'
                     for i in range(1, TOTAL + 1))
    return f"""<div class="grano"></div><div class="marco"></div>{cruces}
<div style="position:absolute;left:84px;top:70px">{sello()}</div>
<div class="micro" style="position:absolute;right:84px;top:88px;letter-spacing:.2em">{n} / {TOTAL}</div>
<div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro">{pie}</div><div style="display:flex;gap:9px">{puntos}</div><div class="micro">INPLUX.CO</div>
</div>"""


def ramas(etiquetas, ancho, hacia="abajo"):
    """Píldoras que salen del nodo (hacia='abajo') o que llegan a él (hacia='arriba')."""
    n = len(etiquetas)
    xs = [ancho * (i + 0.5) / n for i in range(n)]
    if hacia == "abajo":
        curvas = "".join(f'<path d="M{ancho/2},0 C{ancho/2},48 {x},40 {x},88" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
                         f'<circle cx="{x}" cy="88" r="3" fill="{MUTED}"/>' for x in xs)
    else:
        curvas = "".join(f'<path d="M{x},0 C{x},48 {ancho/2},40 {ancho/2},88" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
                         f'<circle cx="{x}" cy="0" r="3" fill="{MUTED}"/>' for x in xs)
    svg = f'<svg width="{ancho}" height="92" style="display:block;overflow:visible">{curvas}</svg>'
    fila = (f'<div style="display:grid;grid-template-columns:repeat({n},1fr);width:{ancho}px">'
            + "".join(f'<div style="display:flex;justify-content:center"><span class="pill rama">{e}</span></div>' for e in etiquetas) + '</div>')
    return (svg + f'<div style="margin-top:6px">{fila}</div>') if hacia == "abajo" else (fila + f'<div style="margin-top:6px">{svg}</div>')


NODO_10 = f'<div class="nodo"><img src="assets/10ampro.png" style="width:84px;height:84px;display:block"></div>'


def encabezado(titular, sub, tam=86):
    return f"""<div style="position:absolute;left:84px;right:84px;top:190px">
  <h1 class="titular" style="font-size:{tam}px">{titular}</h1>
  <p class="sub" style="margin-top:30px;max-width:860px">{sub}</p>
</div>"""


def portada():
    mascara = "linear-gradient(180deg,transparent 0%,#000 32%,#000 82%,transparent 100%)"
    return head() + trama("galeria", 150, 250, 1250, opacidad=.6) + encabezado(
        "Tres reglas de la<br>comunidad 10ampro.",
        "Lo que <b>se comparte</b>, lo que <b>se piensa en grupo</b> y lo que <b>se mueve por la red</b>.", 92) + f"""
<div style="position:absolute;left:84px;bottom:150px;display:flex;flex-direction:column;gap:14px;align-items:flex-start">
  <span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">01</span>Open Source Capital</span>
  <span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">02</span>Collective Intelligence</span>
  <span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">03</span>Network Sharing</span>
</div>
<div class="micro" style="position:absolute;right:84px;bottom:150px;color:{IVORY}">Desliza →</div>
""" + marco(1, "Comunidad 10ampro") + "</div></body></html>"


def regla(i, img, colocacion, titular, sub, diagrama):
    izq, arriba, ancho = colocacion
    mascara = "linear-gradient(180deg,transparent 0%,#000 30%,#000 80%,transparent 100%)"
    return head() + trama(img, izq, arriba, ancho, opacidad=.5) + encabezado(titular, sub) + f"""
<div style="position:absolute;left:84px;right:84px;top:610px;display:flex;flex-direction:column;align-items:center">{diagrama}</div>
""" + marco(i + 1, f"Regla 0{i}") + "</div></body></html>"


def d_open():
    return (f'<span class="pill clara">Una tesis</span><div class="tallo" style="height:40px"></div>{NODO_10}'
            + ramas(["Founders", "Inversionistas", "Operadores", "Builders"], 900))


def d_collective():
    return (ramas(["Una pregunta", "Un dato", "Una duda", "Una apuesta"], 900, hacia="arriba") + NODO_10 +
            f'<div class="tallo" style="height:40px"></div><span class="pill clara">Un mismo lugar</span>')


def d_network():
    nodo_chico = f'<div style="width:22px;height:22px;border-radius:50%;border:1.5px solid {LINE};background:{BLACK}"></div>'
    return (f'<span class="pill oscura">Tu red</span><div class="tallo" style="height:34px"></div>{NODO_10}'
            f'<div class="tallo" style="height:34px"></div>{nodo_chico}<div class="tallo" style="height:34px"></div>'
            f'<span class="pill clara">La gente correcta <span style="color:#007a72">→</span></span>')


def cierre():
    return head() + trama("antorcha", 200, 470, 740, opacidad=.75) + encabezado(
        "Las ideas crecen<br>cuando se comparten.",
        "Gracias a <b>10ampro</b> por abrir la conversación. Seguimos <b>construyendo en comunidad</b>.", 90) + f"""
<div style="position:absolute;left:84px;top:540px;display:flex;gap:16px;align-items:center">
  <span class="pill clara" style="font-size:28px;padding:12px 28px 12px 12px"><img src="assets/10ampro.png" style="width:48px;height:48px">10am.pro</span>
  <span class="pill oscura" style="font-size:28px;padding:14px 28px">{MARCA.format(s=36)}inplux.co</span>
</div>
""" + marco(5, "Juntos") + "</div></body></html>"


PIEZAS = {
    "reglas10am_01_portada": (portada, 1080, 1350),
    "reglas10am_02_open": (lambda: regla(1, "orador", (250, 250, 1100), "Open Source<br>Capital.",
                                         "Compartir <b>tesis y aprendizajes</b> en vez de guardarlos.", d_open()), 1080, 1350),
    "reglas10am_03_collective": (lambda: regla(2, "senadores", (-210, 430, 1500), "Collective<br>Intelligence.",
                                               "La sincronización de <b>personas inteligentes</b> en un mismo lugar.", d_collective()), 1080, 1350),
    "reglas10am_04_network": (lambda: regla(3, "manos", (-320, 560, 1720), "Network<br>Sharing.",
                                            "Activar <b>las redes propias</b> para acelerar a la gente correcta.", d_network()), 1080, 1350),
    "reglas10am_05_cierre": (cierre, 1080, 1350),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
