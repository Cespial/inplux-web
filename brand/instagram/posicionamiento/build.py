"""Posicionamiento INPLUX: quiénes somos, tracción y valor (22-oct-2026).

Cristian: «no todo tiene que ser parrilla romana». El fondo lo decide lo que dice la pieza
(regla completa en FONDOS.md):
  - fotografía en B/N  → quiénes somos (somos_*): fotos del sitio, public/brand/{home,about};
  - negro plano        → tracción (clientes): los logos y las cifras son el protagonista;
  - papel marfil       → valor (cola_*): dibujo a línea, tono de cuaderno, se guarda;
  - estatuaria romana  → ideas y producto (parrilla-romana/).
Las tres comparten marco con «+», Rethink Sans y tokens v5, para que el grid se lea como una sola cuenta.

Copy: src/content/home.ts (servicios y método), team.ts (cargos), deck.copy.ts (estudio y espejo).
Logos: los diez de HomeSections.tsx, «Organizaciones con las que INPLUX ha trabajado».
"""
from pathlib import Path

AQUI = Path(__file__).parent
BLACK, IVORY, MUTED, DIM, TEAL, TEAL_OSC = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca", "#007a72"
PAPEL, TINTA, GRIS = "#f3eee6", "#1a1916", "#8a847a"
MARCA = ('<svg viewBox="0 0 100 100" width="{s}" height="{s}"><rect x="8" y="57" width="42" height="13" rx="6.5" fill="{c}"/>'
         '<rect x="29" y="39" width="42" height="13" rx="6.5" fill="{c}"/><rect x="50" y="21" width="42" height="13" rx="6.5" fill="#15dcc4"/></svg>')
GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")


def head(claro=False):
    fondo, texto = (PAPEL, TINTA) if claro else (BLACK, IVORY)
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1350px;overflow:hidden;background:{fondo}}}
body{{font-family:"Rethink Sans",sans-serif;color:{texto};-webkit-font-smoothing:antialiased}}
.lienzo{{position:relative;width:1080px;height:1350px;overflow:hidden;background:{fondo}}}
.grano{{position:absolute;inset:0;background-image:{GRANO};opacity:{.10 if claro else .06};mix-blend-mode:{"multiply" if claro else "overlay"}}}
.marco{{position:absolute;inset:30px;border:1px solid {"rgba(26,25,22,.12)" if claro else "rgba(246,242,236,.10)"}}}
.cruz{{position:absolute;width:18px;height:18px;color:{"rgba(26,25,22,.45)" if claro else "rgba(246,242,236,.45)"};font-size:22px;line-height:18px;text-align:center;font-weight:300}}
.titular{{font-weight:500;letter-spacing:-.03em;line-height:1.0}}
.titular.funde{{background:linear-gradient(90deg,{IVORY} 0%,{IVORY} 45%,#8d877e 100%);-webkit-background-clip:text;background-clip:text;color:transparent}}
.titular em{{font-style:normal;color:{TEAL_OSC if claro else TEAL}}}
.sub{{font-size:21px;letter-spacing:.22em;text-transform:uppercase;line-height:1.7;color:{GRIS if claro else DIM};font-weight:500}}
.sub b{{color:{texto};font-weight:600}}
.micro{{font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:{GRIS if claro else MUTED};font-weight:500}}
.cuerpo{{font-size:31px;line-height:1.38;letter-spacing:-.005em;color:{"#4a463f" if claro else "#cfc9bf"}}}
.cuerpo b{{color:{texto};font-weight:600}}
.pill{{display:inline-flex;align-items:center;gap:12px;border-radius:999px;white-space:nowrap;padding:13px 26px;font-size:25px;
  border:1.5px solid {"rgba(26,25,22,.18)" if claro else "rgba(246,242,236,.18)"};background:{"rgba(255,255,255,.4)" if claro else "rgba(12,12,11,.6)"}}}
.pill i{{font-style:normal;color:{TEAL_OSC if claro else TEAL};font-size:19px;letter-spacing:.1em}}
.fila{{display:grid;grid-template-columns:90px 1fr;padding:26px 0;border-top:1px solid {"rgba(26,25,22,.14)" if claro else "rgba(246,242,236,.14)"}}}
.fila .n{{font-size:20px;letter-spacing:.12em;color:{TEAL_OSC if claro else TEAL};padding-top:8px}}
.fila h3{{font-size:38px;font-weight:500;letter-spacing:-.02em}}
.fila p{{font-size:24px;line-height:1.4;color:{GRIS if claro else "#bdb7ad"};margin-top:8px}}
.foto{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.12) brightness(.72)}}
</style></head><body><div class="lienzo">"""


def marco(pie, n=None, total=None, claro=False):
    c = TINTA if claro else "#fff"
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    off, on = ("rgba(26,25,22,.25)", TINTA) if claro else ("rgba(246,242,236,.28)", IVORY)
    contador = f'<div class="micro" style="position:absolute;right:84px;top:88px;letter-spacing:.2em">{n} / {total}</div>' if n else ""
    puntos = "".join(f'<i style="width:9px;height:9px;border-radius:50%;background:{on if i == n else off}"></i>'
                     for i in range(1, total + 1)) if n else ""
    return f"""<div class="grano"></div><div class="marco"></div>{cruces}
<div style="position:absolute;left:84px;top:70px;display:flex;align-items:center;gap:14px">{MARCA.format(s=40, c=c)}
  <img src="assets/wordmark-{"black" if claro else "white"}.svg" style="height:22px;display:block"></div>{contador}
<div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro">{pie}</div><div style="display:flex;gap:9px">{puntos}</div><div class="micro">INPLUX.CO</div></div>"""


def pieza(cuerpo, pie, n=None, total=None, claro=False):
    return head(claro) + cuerpo + marco(pie, n, total, claro) + "</div></body></html>"


def foto(nombre, velo="linear-gradient(180deg,rgba(12,12,11,.92) 0%,rgba(12,12,11,.35) 26%,rgba(12,12,11,.2) 45%,rgba(12,12,11,.88) 72%,#0c0c0b 100%)"):
    return f'<img class="foto" src="fotos/{nombre}.jpg"><div style="position:absolute;inset:0;background:{velo}"></div>'


# ---------- Quiénes somos · fotografía en B/N · carrusel 4 ----------

SERVICIOS = [  # home.ts · services
    ("01", "Lanzar un producto digital", "Una idea convertida en una primera versión útil, lista para aprender y crecer."),
    ("02", "Mejorar una operación", "Herramientas que conectan personas, procesos, reglas y datos."),
    ("03", "Automatizar trabajo y conocimiento", "Flujos trazables, con revisión humana donde importa."),
]
METODO = ["Entendemos el reto", "Definimos el producto", "Construimos y probamos", "Lanzamos y evolucionamos"]  # home.ts · method
PRODUCTOS = ["Tribai", "Gobia", "Kelsen", "Laudos", "Porkia", "MiMotoYa"]  # home.ts


def somos(i):
    T = 4
    if i == 1:
        cuerpo = foto("sector-public") + f"""
<div class="micro" style="position:absolute;left:84px;top:190px;color:{TEAL}">Fábrica de software a la medida · Medellín</div>
<div style="position:absolute;left:84px;right:84px;bottom:170px">
  <h1 class="titular funde" style="font-size:168px;letter-spacing:-.045em">Somos<br>INPLUX.</h1>
  <p class="sub" style="margin-top:34px">De un problema real a <b>software en producción</b>.</p></div>
<div class="micro" style="position:absolute;right:84px;bottom:182px;color:{IVORY}">Desliza →</div>"""
        return pieza(cuerpo, "Quiénes somos", 1, T)
    if i == 2:
        filas = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3>{t}</h3><p>{c}</p></div></div>' for n, t, c in SERVICIOS)
        cuerpo = foto("sector-private", "linear-gradient(180deg,rgba(12,12,11,.9) 0%,rgba(12,12,11,.4) 30%,rgba(12,12,11,.85) 52%,#0c0c0b 70%)") + f"""
<div style="position:absolute;left:84px;right:84px;top:190px">
  <h1 class="titular funde" style="font-size:96px">Qué hacemos.</h1>
  <p class="sub" style="margin-top:26px">Software a la medida para <b>empresas, entidades</b> y nuevos negocios.</p></div>
<div style="position:absolute;left:84px;right:84px;top:690px">{filas}</div>"""
        return pieza(cuerpo, "Quiénes somos", 2, T)
    if i == 3:
        pasos = "".join(f'<span class="pill"><i>0{k}</i>{p}</span>' for k, p in enumerate(METODO, 1))
        cuerpo = foto("mesa-de-criterio", "linear-gradient(180deg,rgba(12,12,11,.92) 0%,rgba(12,12,11,.55) 30%,rgba(12,12,11,.6) 55%,#0c0c0b 82%)") + f"""
<div style="position:absolute;left:84px;right:84px;top:190px">
  <h1 class="titular funde" style="font-size:96px">Cómo<br>trabajamos.</h1></div>
<div style="position:absolute;left:84px;right:84px;top:640px;display:flex;flex-wrap:wrap;gap:14px;max-width:820px">{pasos}</div>
<div style="position:absolute;left:84px;right:84px;top:880px">
  <p class="cuerpo" style="font-size:40px;line-height:1.3;color:{IVORY};letter-spacing:-.015em">La IA acelera el trabajo.<br>
  <span style="color:{TEAL}">Personas expertas</span> dirigen y validan<br>las decisiones críticas.</p></div>"""
        return pieza(cuerpo, "Quiénes somos", 3, T)
    gente = "".join(f'<div class="fila" style="grid-template-columns:1fr auto;align-items:baseline"><h3>{n}</h3>'
                    f'<span class="micro" style="color:{TEAL}">{c}</span></div>'
                    for n, c in (("Jaime Alonso Cano Pino", "CEO y fundador"), ("Cristian Espinal Maya", "CTO")))
    prods = "".join(f'<span class="pill">{p}</span>' for p in PRODUCTOS)
    cuerpo = foto("contexto-medellin", "linear-gradient(180deg,rgba(12,12,11,.92) 0%,rgba(12,12,11,.5) 28%,rgba(12,12,11,.85) 50%,#0c0c0b 68%)") + f"""
<div style="position:absolute;left:84px;right:84px;top:190px">
  <h1 class="titular funde" style="font-size:96px">Quiénes<br>somos.</h1></div>
<div style="position:absolute;left:84px;right:84px;top:640px">{gente}</div>
<div class="micro" style="position:absolute;left:84px;top:900px">Seis productos propios</div>
<div style="position:absolute;left:84px;right:84px;top:948px;display:flex;flex-wrap:wrap;gap:12px">{prods}</div>
<div style="position:absolute;left:84px;right:84px;bottom:150px;display:flex;justify-content:space-between;align-items:center">
  <span class="cuerpo" style="color:{IVORY}">Hablemos.</span><span class="micro" style="color:{IVORY}">inplux.co</span></div>"""
    return pieza(cuerpo, "Quiénes somos", 4, T)


# ---------- Tracción · negro plano · post único ----------

LOGOS = [  # HomeSections.tsx · clientLogos (mismo orden)
    ("parque-arvi", "Parque Arví Corporación"), ("think-it", "Think IT"),
    ("experience-03", "Corporación Interuniversitaria de Servicios"), ("politecnico-jaime-isaza", "Politécnico Colombiano Jaime Isaza Cadavid"),
    ("experience-04", "Provincia del Agua, Bosques y el Turismo"), ("experience-05", "Rentan"),
    ("experience-06", "Empresa de Desarrollo Urbano"), ("experience-07", "Sistemas Aries"),
    ("municipio-cisneros", "Municipio de Cisneros"), ("experience-08", "Municipio de Vegachí"),
]


def clientes():
    celdas = "".join(
        f'<div style="background:{IVORY};border-radius:14px;height:116px;display:grid;place-items:center;padding:16px 34px">'
        f'<img src="logos/{f}.png" alt="{n}" style="max-width:64%;max-height:88px;object-fit:contain;filter:grayscale(1) contrast(1.2){" invert(1)" if f == "think-it" else ""};mix-blend-mode:multiply"></div>'
        for f, n in LOGOS)
    cuerpo = f"""
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 100%,rgba(0,215,202,.07),transparent 70%)"></div>
<div style="position:absolute;left:84px;right:84px;top:190px">
  <h1 class="titular funde" style="font-size:88px">Con quiénes<br>hemos trabajado.</h1>
  <p class="sub" style="margin-top:26px">Empresas, entidades públicas y <b>municipios de Antioquia</b>.</p></div>
<div style="position:absolute;left:84px;right:84px;top:500px;display:grid;grid-template-columns:1fr 1fr;gap:14px">{celdas}</div>"""
    return pieza(cuerpo, "Experiencia y alianzas")


# ---------- Valor · papel marfil · carrusel 5 ----------

FUENTE = "Flyvbjerg y Budzier, «Why Your IT Project Might Be Riskier Than You Think», arXiv:1304.0265 · n = 1.471"
TRAZO = f'fill="none" stroke="{TINTA}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'


def fuente(arriba=1168):
    return f'<p style="position:absolute;left:84px;right:84px;top:{arriba}px;font-size:16px;letter-spacing:.04em;color:{GRIS};line-height:1.5">Fuente: {FUENTE}</p>'


def barras():
    """Seis proyectos contra la línea del presupuesto: cinco rozan la línea, uno la triplica (200 % de sobrecosto)."""
    base, u, w, gap, x0 = 600, 150, 80, 36, 232  # u = alto de 1,0 × presupuesto
    linea = base - u
    altos = [1.1, 0.95, 1.25, 1.05, 1.2, 3.0]
    barras_svg = "".join(
        f'<rect x="{x0 + k * (w + gap)}" y="{base - a * u}" width="{w}" height="{a * u}" rx="6" '
        f'fill="{TEAL_OSC if a > 2 else "none"}" stroke="{TEAL_OSC if a > 2 else TINTA}" stroke-width="3"/>' for k, a in enumerate(altos))
    xl = x0 + 5 * (w + gap) + w / 2
    xa, xb = x0, x0 + 5 * (w + gap) - gap  # los cinco que rozan el presupuesto
    return f"""<svg width="912" height="640" viewBox="0 0 912 640" style="display:block;overflow:visible">
  <line x1="20" y1="{base}" x2="892" y2="{base}" {TRAZO}/>
  {barras_svg}
  <line x1="196" y1="{linea}" x2="892" y2="{linea}" stroke="{TINTA}" stroke-width="2" stroke-dasharray="10 9"/>
  <text x="20" y="{linea + 8}" text-anchor="start" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">PRESUPUESTO</text>
  <path d="M{xa},{base + 22} L{xa},{base + 32} L{xb},{base + 32} L{xb},{base + 22}" fill="none" stroke="{GRIS}" stroke-width="2"/>
  <text x="{(xa + xb) / 2}" y="{base + 68}" text-anchor="middle" font-family="Rethink Sans" font-size="22" fill="{GRIS}">5 de cada 6 · cerca del presupuesto</text>
  <text x="{xl}" y="{base + 68}" text-anchor="middle" font-family="Rethink Sans" font-size="22" font-weight="600" fill="{TEAL_OSC}">el triple</text>
  <text x="{xl}" y="{base - 3 * u - 22}" text-anchor="middle" font-family="Rethink Sans" font-size="30" font-weight="600" fill="{TEAL_OSC}">+200 %</text>
</svg>"""


def cola():
    """Curva de distribución con cola larga: el promedio vive en la panza, el riesgo en la cola."""
    return f"""<svg width="912" height="420" viewBox="0 0 912 420" style="display:block;overflow:visible">
  <line x1="20" y1="380" x2="892" y2="380" {TRAZO}/>
  <path d="M30,378 C90,370 120,80 200,70 C280,60 300,300 420,340 C560,372 720,366 890,372" {TRAZO}/>
  <path d="M600,365 C700,366 800,368 890,372 L890,380 L600,380 Z" fill="{TEAL_OSC}" opacity=".85"/>
  <line x1="215" y1="40" x2="215" y2="380" stroke="{TINTA}" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="235" y="52" font-family="Rethink Sans" font-size="24" fill="{TINTA}">lo típico · 27 %</text>
  <path d="M600,318 L600,308 L890,308 L890,318" fill="none" stroke="{TEAL_OSC}" stroke-width="2.5"/>
  <text x="745" y="290" text-anchor="middle" font-family="Rethink Sans" font-size="24" font-weight="600" fill="{TEAL_OSC}">1 de cada 6 · 200 %</text>
</svg>"""


def caminos():
    """Dos proyectos: el que arranca por el requisito descubre el problema tarde; el que arranca por el problema, temprano."""
    return f"""<svg width="912" height="400" viewBox="0 0 912 400" style="display:block;overflow:visible">
  <line x1="20" y1="360" x2="892" y2="360" {TRAZO}/>
  <line x1="20" y1="360" x2="20" y2="20" {TRAZO}/>
  <text x="34" y="30" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">COSTO DE CAMBIAR</text>
  <text x="892" y="392" text-anchor="end" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">TIEMPO →</text>
  <path d="M30,345 C300,340 560,300 700,190 C770,130 820,80 870,50" {TRAZO}/>
  <text x="760" y="56" text-anchor="end" font-family="Rethink Sans" font-size="26" font-weight="600" fill="{TINTA}">Requisito primero</text>
  <path d="M30,250 C160,215 260,240 420,268 C600,296 760,300 870,302" fill="none" stroke="{TEAL_OSC}" stroke-width="4" stroke-linecap="round"/>
  <text x="870" y="340" text-anchor="end" font-family="Rethink Sans" font-size="26" font-weight="600" fill="{TEAL_OSC}">Problema primero</text>
</svg>"""


PREGUNTAS = [  # deck.copy.ts · espejo.empresa
    ("01", "Quién decide y con qué información"),
    ("02", "Qué versión mínima es útil este trimestre"),
    ("03", "Cómo se integra con lo que ya opera"),
    ("04", "Cómo se observa el uso real para ajustar"),
]


def titulo_claro(t, sub=None, tam=84, arriba=190):
    s = f'<p class="sub" style="margin-top:26px">{sub}</p>' if sub else ""
    return f'<div style="position:absolute;left:84px;right:84px;top:{arriba}px"><h1 class="titular" style="font-size:{tam}px">{t}</h1>{s}</div>'


def lamina_cola(i):
    T = 5
    if i == 1:
        cuerpo = titulo_claro("<em>1 de cada 6</em> proyectos<br>de TI termina costando,<br>en promedio, el triple.", tam=90) + f"""
<div style="position:absolute;left:84px;top:470px">{barras()}</div>""" + fuente(1196)
    elif i == 2:
        cuerpo = titulo_claro("El promedio<br>no es el riesgo.",
                              "Lo típico: <b>27 %</b> · La cola: <b>200 %</b>") + f"""
<div style="position:absolute;left:84px;top:620px">{cola()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1080px;font-size:27px">Con un 27 % se puede vivir. El problema es la cola: <b>200 % de sobrecosto en promedio y casi 70 % de sobreplazo</b>.</p>""" + fuente(1196)
    elif i == 3:
        cuerpo = titulo_claro("El software empieza<br>en el problema,<br><em>no en el requisito.</em>", tam=80) + f"""
<div style="position:absolute;left:84px;top:600px">{caminos()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1050px;font-size:27px">Un requisito escrito antes de entender el problema no es un plan: <b>es una apuesta con forma de documento</b>.</p>"""
    elif i == 4:
        filas = "".join(f'<div class="fila"><div class="n">{n}</div><h3 style="font-size:36px">{t}</h3></div>' for n, t in PREGUNTAS)
        cuerpo = titulo_claro("Cuatro preguntas<br>antes de escribir<br>una línea de código.", tam=80) + f"""
<div style="position:absolute;left:84px;right:84px;top:580px">{filas}<div style="border-top:1px solid rgba(26,25,22,.14)"></div></div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:27px">Si nadie las puede responder, el proyecto todavía no tiene un problema: <b>tiene una lista de requisitos</b>.</p>"""
    else:
        cuerpo = titulo_claro("Antes de firmar,<br>pregunta qué pasa<br>si tu proyecto<br><em>cae en la cola.</em>", tam=88) + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:740px">Así trabajamos: una primera versión útil en producción, <b>uso real observado</b> y decisiones tomadas contigo con esa evidencia.</p>
<div style="position:absolute;left:84px;right:84px;top:1110px;display:flex;gap:16px">
  <span class="pill" style="background:{TINTA};color:{PAPEL};border-color:{TINTA}">Hablemos</span>
  <span class="pill">Guárdalo para tu próximo contrato</span></div>"""
    return pieza(cuerpo, "Riesgo en software", i, T, claro=True)


# ---------- IA en producción · papel marfil · carrusel 5 ----------
# Fuentes primarias leídas el 23-oct-2026: MIT NANDA, «The GenAI Divide» (jul-2025, pp. 3, 6, 18, 23) y
# deloitte.com «The State of AI in the Enterprise» 2026 (3.235 líderes, 24 países, ago–sep 2025).

NANDA = "MIT NANDA, «The GenAI Divide: State of AI in Business 2025», jul-2025 · hallazgos preliminares: 52 entrevistas, 153 encuestas, 300+ iniciativas"
DELOITTE = "Deloitte, «The State of AI in the Enterprise», 2026 · 3.235 líderes en 24 países, encuesta ago–sep 2025"


def fuente_de(texto, arriba=1196):
    return f'<p style="position:absolute;left:84px;right:84px;top:{arriba}px;font-size:16px;letter-spacing:.04em;color:{GRIS};line-height:1.5">Fuente: {texto}</p>'


def puntos_100():
    """De cada 100 organizaciones: 60 evaluaron IA a la medida, 20 la pilotearon, 5 llegaron a producción (NANDA p. 3)."""
    c, r = 58, 19
    celdas = []
    for k in range(100):
        x, y = 30 + (k % 10) * c, 30 + (k // 10) * c
        if k < 5:
            celdas.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{TEAL_OSC}"/>')
        elif k < 20:
            celdas.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{TINTA}"/>')
        elif k < 60:
            celdas.append(f'<circle cx="{x}" cy="{y}" r="{r - 1.5}" fill="none" stroke="{TINTA}" stroke-width="2.5"/>')
        else:
            celdas.append(f'<circle cx="{x}" cy="{y}" r="4" fill="{GRIS}" opacity=".55"/>')
    def clave(y, num, txt, color, forma):
        return (f'{forma.format(y=y)}<text x="700" y="{y + 16}" font-family="Rethink Sans" font-size="58" font-weight="600" fill="{color}" letter-spacing="-1">{num}</text>'
                f'<text x="700" y="{y + 52}" font-family="Rethink Sans" font-size="23" fill="{GRIS}">{txt}</text>')
    leyenda = (clave(20, "60", "evaluaron", TINTA, f'<circle cx="660" cy="{{y}}" r="15" fill="none" stroke="{TINTA}" stroke-width="2.5"/>')
               + clave(190, "20", "hicieron piloto", TINTA, f'<circle cx="660" cy="{{y}}" r="16" fill="{TINTA}"/>')
               + clave(360, "5", "en producción", TEAL_OSC, f'<circle cx="660" cy="{{y}}" r="16" fill="{TEAL_OSC}"/>'))
    return f'<svg width="912" height="580" viewBox="0 0 912 580" style="display:block;overflow:visible">{"".join(celdas)}{leyenda}</svg>'


def dos_embudos():
    """Chat de uso general frente a IA a la medida, del interés a la producción (NANDA p. 6)."""
    xs, y0, u = [60, 450, 840], 400, 4.2
    def serie(vals, color, ancho):
        pts = [(x, y0 - v * u) for x, v in zip(xs, vals)]
        d = "M" + " L".join(f"{x},{y}" for x, y in pts)
        nodos = "".join(f'<circle cx="{x}" cy="{y}" r="9" fill="{color}"/>'
                        f'<text x="{x}" y="{y - 22}" text-anchor="middle" font-family="Rethink Sans" font-size="26" font-weight="600" fill="{color}">{v} %</text>'
                        for (x, y), v in zip(pts, vals))
        return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{ancho}" stroke-linecap="round" stroke-linejoin="round"/>{nodos}'
    ejes = "".join(f'<text x="{x}" y="{y0 + 50}" text-anchor="middle" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">{t}</text>'
                   for x, t in zip(xs, ["EVALUARON", "PILOTO", "PRODUCCIÓN"]))
    return f"""<svg width="912" height="470" viewBox="0 0 912 470" style="display:block;overflow:visible">
  <line x1="20" y1="{y0}" x2="892" y2="{y0}" {TRAZO}/>{ejes}
  {serie([80, 50, 40], TINTA, 3)}{serie([60, 20, 5], TEAL_OSC, 4)}
  <text x="300" y="{y0 - 66 * u - 30}" text-anchor="middle" font-family="Rethink Sans" font-size="24" fill="{TINTA}">Chat de uso general</text>
  <text x="235" y="{y0 - 38 * u + 52}" text-anchor="middle" font-family="Rethink Sans" font-size="24" font-weight="600" fill="{TEAL_OSC}">IA a la medida</text>
</svg>"""


def brecha_2026():
    """Deloitte 2026: 74 % espera crecer en ingresos con IA; 20 % ya lo hace."""
    def barra(y, v, txt, color, lleno):
        w = v * 9
        rect = (f'<rect x="20" y="{y}" width="{w}" height="70" rx="8" fill="{color}"/>' if lleno else
                f'<rect x="21.5" y="{y + 1.5}" width="{w - 3}" height="67" rx="8" fill="none" stroke="{color}" stroke-width="3"/>')
        return (rect + f'<text x="{20 + w + 22}" y="{y + 50}" font-family="Rethink Sans" font-size="48" font-weight="600" fill="{color}" letter-spacing="-1">{v} %</text>'
                f'<text x="20" y="{y - 18}" font-family="Rethink Sans" font-size="24" fill="{GRIS}">{txt}</text>')
    return (f'<svg width="912" height="300" viewBox="0 0 912 300" style="display:block;overflow:visible">'
            + barra(40, 74, "Espera crecer en ingresos con IA", TINTA, False)
            + barra(210, 20, "Ya crece en ingresos con IA", TEAL_OSC, True) + '</svg>')


CAUSAS = [  # NANDA p. 3: «brittle workflows, lack of contextual learning, and misalignment with day-to-day operations»
    ("01", "Flujos frágiles", "Funcionan en la demo y se rompen con el primer caso raro."),
    ("02", "No aprende del contexto", "Olvida lo que el equipo ya le corrigió la semana pasada."),
    ("03", "No encaja en la operación", "Vive al lado del trabajo, no dentro de él."),
]


def lamina_ia(i):
    T = 5
    if i == 1:
        cuerpo = titulo_claro("De cada 100 empresas,<br><em>5</em> tienen IA a la medida<br>en producción.", tam=84) + f"""
<div style="position:absolute;left:84px;top:530px">{puntos_100()}</div>""" + fuente_de(NANDA)
    elif i == 2:
        cuerpo = titulo_claro("El chat llega.<br><em>El sistema, casi nunca.</em>", "Del interés a la producción", tam=84) + f"""
<div style="position:absolute;left:84px;top:520px">{dos_embudos()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1050px;font-size:27px">ChatGPT y Copilot ayudan a cada persona, pero <b>no mueven el estado de resultados</b>. Lo que sí lo mueve, la IA dentro de los procesos, es lo que se queda en piloto.</p>""" + fuente_de(NANDA)
    elif i == 3:
        filas = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3 style="font-size:38px">{t}</h3><p>{d}</p></div></div>' for n, t, d in CAUSAS)
        cuerpo = titulo_claro("El problema<br>no es el modelo.", "Es cómo se implementa") + f"""
<div style="position:absolute;left:84px;right:84px;top:560px">{filas}<div style="border-top:1px solid rgba(26,25,22,.14)"></div></div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:27px">Según el estudio, la brecha no parece venir de la calidad del modelo ni de la regulación: <b>viene del enfoque</b>.</p>""" + fuente_de(NANDA)
    elif i == 4:
        cuerpo = titulo_claro("2026: tres de cada cuatro<br>quieren crecer con IA.<br><em>Uno de cada cinco lo logra.</em>", tam=76) + f"""
<div style="position:absolute;left:84px;top:560px">{brecha_2026()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:940px;font-size:27px">En la encuesta más reciente de Deloitte, la brecha sigue ahí. Dos de cada tres empresas ya ven <b>ganancias de productividad</b>; el crecimiento todavía es una aspiración.</p>""" + fuente_de(DELOITTE)
    else:
        cuerpo = titulo_claro("Una IA que no aprende<br>de tu operación<br><em>se queda en piloto.</em>", tam=84) + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:600px">Así trabajamos: la construimos dentro de tu operación, con <b>revisión humana donde importa</b>, y medimos su uso real para ajustarla.</p>
<div style="position:absolute;left:84px;right:84px;top:820px;padding:30px 0;border-top:1px solid rgba(26,25,22,.14);border-bottom:1px solid rgba(26,25,22,.14);display:grid;grid-template-columns:200px 1fr;gap:28px;align-items:center">
  <div style="font-size:80px;font-weight:600;letter-spacing:-.03em;color:{TEAL_OSC};line-height:1">2×</div>
  <p style="font-size:24px;line-height:1.45;color:#4a463f">En el estudio, lo que se hizo con un aliado externo llegó a producción el doble de veces que lo construido solo en casa (≈67 % frente a ≈33 %, autorreportado).</p></div>
<div style="position:absolute;left:84px;right:84px;top:1110px;display:flex;gap:16px">
  <span class="pill" style="background:{TINTA};color:{PAPEL};border-color:{TINTA}">Hablemos</span>
  <span class="pill">Guárdalo para tu próximo proyecto de IA</span></div>"""
    return pieza(cuerpo, "IA en producción", i, T, claro=True)


# ---------- Medir la IA · papel marfil · carrusel 5 ----------
# Fuentes primarias leídas el 23-oct-2026 en metr.org: estudio jul-2025 (16 desarrolladores, 246 tareas),
# actualización 24-feb-2026 (57 desarrolladores, 800+ tareas) y encuesta 11-may-2026 (349 personas técnicas).

METR25 = "METR, «Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity», jul-2025 · 16 desarrolladores, 246 tareas"
METR26 = "METR, «We are Changing our Developer Productivity Experiment Design», feb-2026 · 57 desarrolladores, 800+ tareas · IC 95 %"
METR26E = "METR, «Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity», may-2026 · 349 personas, muestra por conveniencia"


def sentir_medir():
    """Barras divergentes desde cero: lo que esperaban (+24 %), lo que creyeron (+20 %) y lo que se midió (−19 %)."""
    x0, u = 456, 12
    def fila(y, v, txt, color, lleno):
        w = abs(v) * u
        x = x0 if v > 0 else x0 - w
        rect = (f'<rect x="{x}" y="{y}" width="{w}" height="64" rx="8" fill="{color}"/>' if lleno else
                f'<rect x="{x + 1.5}" y="{y + 1.5}" width="{w - 3}" height="61" rx="8" fill="none" stroke="{color}" stroke-width="3"/>')
        num = (f'<text x="{x + w + 18}" y="{y + 46}" font-family="Rethink Sans" font-size="40" font-weight="600" fill="{color}">+{v} %</text>' if v > 0 else
               f'<text x="{x - 18}" y="{y + 46}" text-anchor="end" font-family="Rethink Sans" font-size="40" font-weight="600" fill="{color}">−{-v} %</text>')
        lab = (f'<text x="{x0 - 22}" y="{y + 42}" text-anchor="end" font-family="Rethink Sans" font-size="24" fill="{GRIS}">{txt}</text>' if v > 0 else
               f'<text x="{x0 + 22}" y="{y + 42}" font-family="Rethink Sans" font-size="24" fill="{GRIS}">{txt}</text>')
        return rect + num + lab
    return f"""<svg width="912" height="420" viewBox="0 0 912 420" style="display:block;overflow:visible">
  <line x1="{x0}" y1="0" x2="{x0}" y2="380" stroke="{TINTA}" stroke-width="2"/>
  {fila(20, 24, "Esperaban, antes", TINTA, False)}{fila(140, 20, "Creyeron, después", TINTA, False)}{fila(260, -19, "Se midió", TEAL_OSC, True)}
  <text x="{x0 - 20}" y="412" text-anchor="end" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">← MÁS LENTO</text>
  <text x="{x0 + 20}" y="412" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">MÁS RÁPIDO →</text>
</svg>"""


def intervalos():
    """Velocidad con IA (= −cambio en el tiempo por tarea que reporta METR), con su IC de 95 %; misma dirección que la portada."""
    x0, u = 470, 9  # 0 % en x0; 1 punto = 9 px
    X = lambda v: x0 + v * u
    def fila(y, est, lo, hi, txt, color):
        return (f'<line x1="{X(lo)}" y1="{y}" x2="{X(hi)}" y2="{y}" stroke="{color}" stroke-width="4" stroke-linecap="round"/>'
                f'<line x1="{X(lo)}" y1="{y - 12}" x2="{X(lo)}" y2="{y + 12}" stroke="{color}" stroke-width="3"/>'
                f'<line x1="{X(hi)}" y1="{y - 12}" x2="{X(hi)}" y2="{y + 12}" stroke="{color}" stroke-width="3"/>'
                f'<circle cx="{X(est)}" cy="{y}" r="13" fill="{color}"/>'
                f'<text x="{X(est)}" y="{y - 30}" text-anchor="middle" font-family="Rethink Sans" font-size="30" font-weight="600" fill="{color}" stroke="{PAPEL}" stroke-width="10" paint-order="stroke">{"+" if est > 0 else "−"}{abs(est)} %</text>'
                f'<text x="20" y="{y + 56}" font-family="Rethink Sans" font-size="22" fill="{GRIS}">{txt}</text>')
    return f"""<svg width="912" height="480" viewBox="0 0 912 480" style="display:block;overflow:visible">
  <line x1="{x0}" y1="10" x2="{x0}" y2="440" stroke="{TINTA}" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="{x0 - 20}" y="472" text-anchor="end" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">← MÁS LENTO</text>
  <text x="{x0 + 20}" y="472" font-family="Rethink Sans" font-size="20" fill="{GRIS}" letter-spacing="3">MÁS RÁPIDO →</text>
  {fila(70, -19, -39, -2, "2025 · herramientas de inicios de 2025", TINTA)}
  {fila(215, 18, -9, 38, "2026 · los mismos desarrolladores", TEAL_OSC)}
  {fila(360, 4, -9, 15, "2026 · desarrolladores nuevos", TEAL_OSC)}
</svg>"""


def dicen_vs_valor():
    """Encuesta METR 2026: mediana autorreportada de velocidad 3× y de valor 1,4–2×."""
    u = 230
    return f"""<svg width="912" height="330" viewBox="0 0 912 330" style="display:block;overflow:visible">
  <text x="20" y="22" font-family="Rethink Sans" font-size="24" fill="{GRIS}">Velocidad que dicen tener</text>
  <rect x="21.5" y="45.5" width="{3 * u - 3}" height="67" rx="8" fill="none" stroke="{TINTA}" stroke-width="3"/>
  <text x="{20 + 3 * u + 22}" y="96" font-family="Rethink Sans" font-size="48" font-weight="600" fill="{TINTA}">3×</text>
  <text x="20" y="202" font-family="Rethink Sans" font-size="24" fill="{GRIS}">Valor que dicen producir</text>
  <rect x="20" y="225" width="{1.4 * u}" height="70" rx="8" fill="{TEAL_OSC}"/>
  <rect x="{20 + 1.4 * u}" y="225" width="{0.6 * u}" height="70" rx="0" fill="{TEAL_OSC}" opacity=".35"/>
  <text x="{20 + 2 * u + 22}" y="276" font-family="Rethink Sans" font-size="48" font-weight="600" fill="{TEAL_OSC}">1,4–2×</text>
</svg>"""


def lamina_medir(i):
    T = 5
    if i == 1:
        cuerpo = titulo_claro("Creían ir 20 % más<br>rápido con IA.<br><em>Iban 19 % más lento.</em>", tam=86) + f"""
<div style="position:absolute;left:84px;top:600px">{sentir_medir()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:25px">Experimento controlado con programadores expertos en sus propios proyectos, usando Cursor con Claude 3.5 y 3.7 Sonnet.</p>""" + fuente_de(METR25)
    elif i == 2:
        cuerpo = titulo_claro("Casi 40 puntos entre<br>lo que se siente<br><em>y lo que se mide.</em>", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:560px;padding:34px 0;border-top:1px solid rgba(26,25,22,.14);border-bottom:1px solid rgba(26,25,22,.14);display:grid;grid-template-columns:1fr 1fr;gap:40px">
  <div><div class="micro">Sintieron</div><div style="font-size:120px;font-weight:600;letter-spacing:-.04em;line-height:1.1;margin-top:10px">+20 %</div></div>
  <div><div class="micro">Se midió</div><div style="font-size:120px;font-weight:600;letter-spacing:-.04em;line-height:1.1;margin-top:10px;color:{TEAL_OSC}">−19 %</div></div></div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:900px;font-size:27px">Los autores son claros: es una foto de inicios de 2025, en un solo contexto. <b>No prueba que la IA haga más lento a todo el mundo.</b> Prueba que la sensación no sirve como medida.</p>""" + fuente_de(METR25)
    elif i == 3:
        cuerpo = titulo_claro("En 2026 la IA<br>probablemente ya acelera.<br><em>Cuánto, aún no se sabe.</em>", tam=76) + f"""
<div style="position:absolute;left:84px;top:520px">{intervalos()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1040px;font-size:25px">Las barras de 2026 cruzan el cero. Y entre <b>30 % y 50 %</b> de los participantes dejó tareas por fuera porque no quería hacerlas sin IA.</p>""" + fuente_de(METR26)
    elif i == 4:
        cuerpo = titulo_claro("Dicen ir 3× más rápido.<br><em>El valor, entre 1,4× y 2×.</em>", tam=80) + f"""
<div style="position:absolute;left:84px;top:520px">{dicen_vs_valor()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:940px;font-size:27px">Es lo que reportan 349 personas técnicas en 2026. El propio METR advierte que <b>la velocidad suele exagerar el valor</b> y que estas respuestas no están necesariamente ancladas en la realidad.</p>""" + fuente_de(METR26E)
    else:
        cuerpo = titulo_claro("Si no lo mides,<br>lo que tienes<br><em>es una sensación.</em>", tam=88) + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:640px">Así trabajamos: antes de construir acordamos <b>qué vamos a medir</b>, y después de lanzar miramos el uso real, no la impresión.</p>
<div style="position:absolute;left:84px;right:84px;top:850px;border-top:1px solid rgba(26,25,22,.14)">
  <div class="fila" style="border-top:none"><div class="n">01</div><h3 style="font-size:32px">Tiempo por tarea, antes y después</h3></div>
  <div class="fila"><div class="n">02</div><h3 style="font-size:32px">Errores que llegan a revisión humana</h3></div></div>
<div style="position:absolute;left:84px;right:84px;top:1110px;display:flex;gap:16px">
  <span class="pill" style="background:{TINTA};color:{PAPEL};border-color:{TINTA}">Hablemos</span>
  <span class="pill">Guárdalo para medir tu IA</span></div>"""
    return pieza(cuerpo, "Medir la IA", i, T, claro=True)


PIEZAS = {}
for _i, _n in enumerate(["portada", "que-hacemos", "como-trabajamos", "quienes"], 1):
    PIEZAS[f"somos_{_i}_{_n}"] = ((lambda i=_i: somos(i)), 1080, 1350)
PIEZAS["clientes_muro"] = (clientes, 1080, 1350)
for _i, _n in enumerate(["portada", "promedio", "problema", "preguntas", "cierre"], 1):
    PIEZAS[f"cola_{_i}_{_n}"] = ((lambda i=_i: lamina_cola(i)), 1080, 1350)
for _i, _n in enumerate(["portada", "chat-vs-sistema", "causas", "2026", "cierre"], 1):
    PIEZAS[f"ia_{_i}_{_n}"] = ((lambda i=_i: lamina_ia(i)), 1080, 1350)
for _i, _n in enumerate(["portada", "brecha", "2026", "encuesta", "cierre"], 1):
    PIEZAS[f"medir_{_i}_{_n}"] = ((lambda i=_i: lamina_medir(i)), 1080, 1350)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
