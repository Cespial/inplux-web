"""Parrilla INPLUX después del Día D: primera tanda (22-oct-2026).

Misma gramática que dia-d-reglas/ (v4, a partir de @use_croma): estatua romana en trama de
puntos, marco fino con «+», titular que se desvanece, subtítulo en versalitas, un protagonista
por lámina. Cristian aprobó el fondo romano como sello de la cuenta.

Ideas tomadas de los feeds (ver plan): de Croma, un sustantivo concreto por post y la captura
real como prueba; de @victorpay, la tabla de herramientas y la serie numerada.

Los datos de producto salen de src/content/work.ts y home.ts (fuente del sitio) y del acta
public/work/real-pages/capture-manifest.json. No se inventa ninguna cifra.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("base", AQUI.parent / "dia-d-reglas" / "build.py")
base = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(base)
BLACK, IVORY, MUTED, DIM, TEAL, LINE, MARCA = base.BLACK, base.IVORY, base.MUTED, base.DIM, base.TEAL, base.LINE, base.MARCA
head, trama, encabezado = base.head, base.trama, base.encabezado


def marco(pie, n=None, total=None):
    """Como el del carrusel 10ampro, pero con el sello solo de INPLUX y contador opcional."""
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    contador = (f'<div class="micro" style="position:absolute;right:84px;top:88px;letter-spacing:.2em">{n} / {total}</div>' if n else "")
    puntos = ("".join(f'<i style="width:9px;height:9px;border-radius:50%;background:{IVORY if i == n else "rgba(246,242,236,.28)"}"></i>'
                      for i in range(1, total + 1)) if n else "")
    return f"""<div class="grano"></div><div class="marco"></div>{cruces}
<div style="position:absolute;left:84px;top:70px;display:flex;align-items:center;gap:14px">{MARCA.format(s=40)}
  <img src="assets/wordmark-white.svg" style="height:22px;display:block"></div>{contador}
<div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro">{pie}</div><div style="display:flex;gap:9px">{puntos}</div><div class="micro">INPLUX.CO</div>
</div>"""


def lamina(cuerpo, pie, n=None, total=None):
    return head() + cuerpo + marco(pie, n, total) + "</div></body></html>"


def navegador(captura, url, fecha, ancho=840, arriba=600):
    """Captura real en marco de navegador oscuro, con la URL y la fecha del acta debajo."""
    alto = round(ancho * 960 / 1440)
    izq = (1080 - ancho) // 2
    puntos = "".join(f'<i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i>' for _ in range(3))
    return f"""<div style="position:absolute;left:{izq}px;top:{arriba}px;width:{ancho}px;border-radius:14px;overflow:hidden;
  border:1.5px solid {LINE};background:#151513;box-shadow:0 0 0 10px rgba(246,242,236,.03),0 40px 90px rgba(0,0,0,.75)">
  <div style="height:44px;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid {LINE}">{puntos}
    <span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{MUTED};letter-spacing:.02em">{url}</span></div>
  <img src="capturas/{captura}" style="display:block;width:{ancho}px;height:{alto}px;object-fit:cover;object-position:top">
</div>
<div class="micro" style="position:absolute;left:{izq}px;top:{arriba + alto + 44 + 22}px;font-size:15px">Captura real · {fecha}</div>"""


def filas(datos, ancho=912, arriba=640, tam=30):
    """Tarjeta marfil con filas «etiqueta · valor»; el valor resaltado va en teal oscuro."""
    renglones = "".join(
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:24px 0;'
        f'{"border-top:1px solid rgba(12,12,11,.12);" if i else ""}">'
        f'<span style="font-size:{tam}px;font-weight:500">{e}</span>'
        f'<span style="font-size:{tam - 4}px;color:{"#007a72" if acento else "#5d5850"};font-weight:{600 if acento else 400}">{v}</span></div>'
        for i, (e, v, acento) in enumerate(datos))
    return (f'<div style="position:absolute;left:{(1080 - ancho) // 2}px;top:{arriba}px;width:{ancho}px;background:{IVORY};color:{BLACK};'
            f'border-radius:16px;padding:12px 44px;box-shadow:0 0 0 10px rgba(246,242,236,.05),0 40px 90px rgba(0,0,0,.7)">{renglones}</div>')


# ---------- 1 · Tribai ----------

def tribai():
    return lamina(trama("escriba", 260, 230, 1050, opacidad=.62) + encabezado(
        "Criterio tributario<br>con la fuente a la vista.",
        "Cada respuesta muestra <b>de dónde sale</b> y si sigue vigente.", 80) + f"""
<div style="position:absolute;left:84px;right:84px;top:560px;display:flex;flex-direction:column;align-items:center">
  <span class="pill oscura">Una consulta tributaria</span><div class="tallo" style="height:36px"></div>
  <div class="nodo" style="width:150px;height:150px;font-size:30px;font-weight:600;letter-spacing:-.01em">Tribai</div>
  <div class="tallo" style="height:36px"></div></div>
""" + filas([("Art. 383 ET", "Vigente", True), ("Confianza", "88 % · Alta", False), ("Cálculo", "7/7 coincidencias", False)],
            arriba=910, tam=28) + f"""
<div class="micro" style="position:absolute;left:84px;top:1205px;color:{IVORY}">Público · app.tribai.co</div>""",
                  "Tributación")


# ---------- 2 · Kelsen ----------

def kelsen():
    return lamina(trama("justicia", 420, 120, 900, opacidad=.6) + encabezado(
        "Normas, jurisprudencia<br>y vigencia, juntas.",
        "Investigación jurídica con <b>trazabilidad a la fuente</b>.", 80)
        + navegador("kelsen-explorador-2026-07-21.png", "kelsen.io/explorador", "21 jul 2026", arriba=560)
        + f'<div class="micro" style="position:absolute;right:120px;top:1186px;color:{IVORY}">Acceso por solicitud</div>',
        "Derecho")


# ---------- 3 · Con qué construimos ----------

HERRAMIENTAS = [  # 🚨 confirmar con Jaime antes de publicar
    ("Claude Code", "Construcción y agentes", False),
    ("Codex", "Código y revisiones", False),
    ("GitHub", "Versiones y revisión", False),
    ("Vercel", "Despliegue", False),
    ("Midjourney · ElevenLabs", "Imagen y voz", False),
    ("Personas expertas", "Dirigen y validan", True),
]


def herramientas():
    return lamina(trama("artesano", 260, 330, 1000, opacidad=.6) + encabezado(
        "Con qué<br>construimos.",
        "La IA acelera el trabajo. <b>Personas expertas</b> dirigen y validan.", 92)
        + filas(HERRAMIENTAS, arriba=560, tam=29), "Fábrica / Herramientas")


# ---------- 4 · Serie «De un problema real a producción» ----------

SERIE = {
    "porkia": dict(
        parte=1, fig="granjero", col=(60, 300, 1150), area="Porcicultura",
        problema="La finca se llevaba<br>en un cuaderno.",
        sub="Lotes, cuido, sanidad y cuentas, <b>cada uno en una hoja distinta</b>.",
        captura=("porkia-demo-2026-08-11.png", "porkia.co/#demo", "11 ago 2026"),
        cifra="Por lote", cifra_txt="cada cerdo, seguido desde el día del parto",
        datos=[("Lotes", "Crías, peso y ceba", False), ("Cuido", "Bultos y consumo", False),
               ("Sanidad", "Plan programado", True), ("Cuentas", "Ingreso por lote", False)],
        estado="Beta cerrada · porkia.co"),
    "gobia": dict(
        parte=2, fig="arquitecto", col=(120, 280, 1200), area="Gestión pública",
        problema="El municipio se leía<br>por partes.",
        sub="Información repartida <b>entre dependencias y reportes</b>.",
        captura=("gobia-demo-2026-07-21.png", "gobia.co/demo", "21 jul 2026"),
        cifra="16+", cifra_txt="fuentes conectadas en un solo entorno",
        datos=[("Lectura municipal", "Una vista común", False), ("Seguimiento", "Asuntos y responsables", False),
               ("Trazabilidad", "Cómo avanza cada frente", True)],
        estado="Piloto activo · gobia.co/demo"),
    "laudos": dict(
        parte=3, fig="acueducto", col=(-300, -60, 1700), area="Arbitraje",
        problema="Miles de laudos,<br>sin estructura.",
        sub="Buscar criterio arbitral era <b>leer documento por documento</b>.",
        captura=("laudos-prediccion-2026-07-21.png", "laudos.co", "21 jul 2026"),
        cifra="5.447", cifra_txt="documentos del corpus",
        datos=[("Laudos", "2.660", True), ("Consejo de Estado", "2.787", False), ("Cobertura", "1985–2026", False)],
        estado="Beta abierta · laudos.co · criterio legal de REDEK"),
}


def serie(slug, i):
    s = SERIE[slug]
    nombre = slug.capitalize()
    pie = f"Pt. {s['parte']} · {nombre}"
    izq, arriba, ancho = s["col"]
    if i == 1:
        cuerpo = trama(s["fig"], izq, arriba, ancho, opacidad=.75 if slug == "laudos" else .6) + f"""
<div class="micro" style="position:absolute;left:84px;top:190px;color:{TEAL}">De un problema real a producción</div>
""" + encabezado(s["problema"], s["sub"], 92).replace("top:190px", "top:250px") + f"""
<div style="position:absolute;left:84px;bottom:150px;display:flex;gap:14px">
  <span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">01</span>El problema</span></div>
<div class="micro" style="position:absolute;right:84px;bottom:165px;color:{IVORY}">Desliza →</div>"""
    elif i == 2:
        cap, url, fecha = s["captura"]
        cuerpo = trama(s["fig"], izq, arriba, ancho, opacidad=.22) + encabezado(
            f"{nombre}.", f"<b>{s['area']}</b> · la pantalla, tal como está en línea.", 92) + navegador(cap, url, fecha, arriba=470)
        cuerpo += f'<div style="position:absolute;left:84px;bottom:150px"><span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">02</span>La pantalla</span></div>'
    else:
        cuerpo = trama(s["fig"], izq, arriba + (0 if slug == "laudos" else 220), ancho, opacidad=.5) + f"""
<div style="position:absolute;left:84px;right:84px;top:190px">
  <div class="titular" style="font-size:{170 if len(s['cifra']) < 7 else 130}px;letter-spacing:-.05em">{s['cifra']}</div>
  <p class="sub" style="margin-top:22px">{s['cifra_txt']}</p></div>
""" + filas(s["datos"], arriba=560, tam=29) + f"""
<div style="position:absolute;left:84px;bottom:150px;display:flex;align-items:center;gap:20px">
  <span class="pill oscura"><span style="color:{TEAL};font-size:20px;letter-spacing:.1em">03</span>En producción</span>
  <span class="micro" style="color:{IVORY};letter-spacing:.18em">{s['estado']}</span></div>"""
    return lamina(cuerpo, pie, i, 3)


PIEZAS = {
    "parrilla_tribai": (tribai, 1080, 1350),
    "parrilla_kelsen": (kelsen, 1080, 1350),
    "parrilla_herramientas": (herramientas, 1080, 1350),
}
for _slug in SERIE:
    for _i, _n in ((1, "problema"), (2, "pantalla"), (3, "produccion")):
        PIEZAS[f"serie_{_slug}_{_i}_{_n}"] = ((lambda s=_slug, i=_i: serie(s, i)), 1080, 1350)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
