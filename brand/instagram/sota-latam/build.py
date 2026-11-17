"""Cartel del evento «The State of the Art of AI in LATAM» · INPLUX × Cancillería de Colombia.
Jueves 10 de diciembre de 2026, Consulado General de Colombia en San Francisco.

Tres conceptos en 1080 × 1350 para elegir (17-nov-2026). Referencia pedida: @a16z. Lo que se toma de allá:
  - el titular ocupa media lámina y manda; nada compite con él;
  - los ponentes van como alineación (retrato recortado + nombre + cargo) o como lista con filetes finos
    («Serial Unicorn Founders»);
  - una figura en trama o grabado, y campos planos de color.
Identidad INPLUX: solo Rethink Sans, tokens v5, marco con «+», teal como único acento.

Texto en inglés porque el público es el de San Francisco. Sin hora ni dirección: el Consulado no las ha confirmado.
«Cancillería de Colombia» va escrita en nuestra tipografía: su logo oficial solo se monta con el archivo
y la autorización que envíe el Consulado.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("reglas", AQUI.parent / "dia-d-reglas/build.py")
g = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(g)
IVORY, MUTED, DIM, TEAL, BLACK, LINE = g.IVORY, g.MUTED, g.DIM, g.TEAL, g.BLACK, g.LINE
PAPEL, TINTA, GRIS, TEAL_OSC, FILETE = "#f3efe8", "#12110f", "#625d55", "#00706a", "rgba(18,17,15,.16)"

PONENTES = [
    ("santiago", "Santiago Jiménez", "Researcher", "EAFIT"),
    ("cristian", "Cristian Espinal", "CTO", "INPLUX"),
    ("jaime", "Jaime Cano", "CEO", "INPLUX"),
]
FECHA, FECHA_CORTA, CIUDAD = "Thu, Dec 10, 2026", "Dec 10", "San Francisco"
HORA, HORA_CORTA = "7:00 PM", "7 PM"   # confirmada por Cristian el 17-nov-2026
SEDE = "Consulate General of Colombia"
ALIADO = "Cancillería de Colombia"
FORMATO = "Talk · Panel · Networking"
SUTIL = '<img src="trama/fondo_sutil_{}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1350px;display:block">'
ALTO_SELLO = 86  # alto de la cabecera de logos
ASOMA = 124  # px que la cabeza sobresale por encima de la tarjeta
CUANDO = f'<b>{FECHA} · {HORA_CORTA}</b> <span style="color:{TEAL}">→</span> <b>{CIUDAD}</b>'


def sello(claro=False):
    """Cabecera conjunta: símbolo Estratos + INPLUX | logo de la Cancillería, que es el que usa el Consulado en su sitio.
    Los dos a la misma altura óptica. En oscuro, el de la Cancillería va en negativo (blanco) con su barra tricolor."""
    if claro:
        simbolo = g.MARCA.format(s=46).replace("#fff", TINTA).replace("#15dcc4", "#0d7d74")
        marca, canc, raya = "wordmark-black", "cancilleria-color", "rgba(18,17,15,.22)"
    else:
        simbolo, marca, canc, raya = g.MARCA.format(s=46), "wordmark-white", "cancilleria-blanco", "rgba(246,242,236,.24)"
    return (f'<div style="display:flex;align-items:center;gap:26px;height:{ALTO_SELLO}px">'
            f'<div style="display:flex;align-items:center;gap:10px">{simbolo}<img src="assets/{marca}.svg" style="height:27px;display:block"></div>'
            f'<i style="width:1.5px;height:58px;background:{raya}"></i>'
            f'<img src="assets/{canc}.png" style="height:{ALTO_SELLO}px;display:block"></div>')


def marco(derecha, pie_izq, pie_der="INPLUX.CO", claro=False):
    borde, cruz, micro = (("rgba(18,17,15,.14)", "rgba(18,17,15,.5)", GRIS) if claro
                          else ("rgba(246,242,236,.10)", "rgba(246,242,236,.45)", MUTED))
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px;color:{cruz}">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    return f"""<div class="grano"></div><div class="marco" style="border-color:{borde}"></div>{cruces}
<div style="position:absolute;left:84px;top:66px">{sello(claro)}</div>
<div class="micro" style="position:absolute;right:84px;top:100px;letter-spacing:.2em;color:{micro}">{derecha}</div>
<div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro" style="color:{micro};letter-spacing:.2em">{pie_izq}</div><div class="micro" style="color:{micro}">{pie_der}</div>
</div>"""


def fin(*partes, claro=False):
    cabeza = g.head()
    if claro:
        cabeza = cabeza.replace(f"background:{BLACK}}}", f"background:{PAPEL}}}")
    return cabeza + "".join(partes) + "</div></body></html>"


# ───────────────────────── A · Alineación (tinta, retratos recortados) ─────────────────────────
def a_alineacion(sutil=False):
    """El cartel de evento de startup: titular gigante y los tres ponentes asomando por encima de su tarjeta."""
    def tarjeta(i, clave, nombre, cargo, casa):
        img = f'<img src="recortes/fig_{clave}.png" style="position:absolute;left:0;top:{{}}px;width:290px;height:420px;display:block">'
        return f"""<div style="width:290px">
  <div style="position:relative;width:290px;height:420px">
    <div style="position:absolute;left:0;right:0;top:{ASOMA}px;bottom:0;overflow:hidden;border:1.5px solid {LINE};border-radius:14px;
      background:radial-gradient(120% 70% at 50% 0%,#3a3936 0%,#232221 55%,#191817 100%)">
      <div class="micro" style="position:absolute;left:18px;top:18px;color:{TEAL};letter-spacing:.14em">0{i}</div>
      {img.format(-ASOMA - 1.5)}
      <div style="position:absolute;left:0;right:0;bottom:0;height:130px;background:linear-gradient(180deg,rgba(25,24,23,0) 0%,#191817 90%)"></div>
    </div>
    <div style="position:absolute;left:0;right:0;top:0;height:{ASOMA + 1.5}px;overflow:hidden">{img.format(0)}</div>
  </div>
  <div style="margin-top:22px;font-size:33px;font-weight:600;letter-spacing:-.02em;line-height:1.05;white-space:nowrap">{nombre}</div>
  <div class="micro" style="margin-top:12px;font-size:16px;letter-spacing:.2em;white-space:nowrap">{cargo} · <span style="color:{IVORY}">{casa}</span></div>
</div>"""
    fila = "".join(tarjeta(i, *p) for i, p in enumerate(PONENTES, 1))
    return fin(SUTIL.format("noche") if sutil else "", f"""
<div style="display:{"none" if sutil else "block"};position:absolute;left:560px;top:142px;width:547px;height:592px;opacity:.16;background:{IVORY};
  -webkit-mask-image:url(trama/mapa_base.png);mask-image:url(trama/mapa_base.png)"></div>
<div style="display:{"none" if sutil else "block"};position:absolute;left:560px;top:142px;width:547px;height:592px;opacity:.9;background:{TEAL};
  -webkit-mask-image:url(trama/mapa_col.png);mask-image:url(trama/mapa_col.png)"></div>
<div style="position:absolute;left:78px;right:84px;top:200px">
  <h1 class="titular" style="font-size:122px;letter-spacing:-.045em;line-height:.98;padding-bottom:.1em">The State of<br>the Art of AI<br>in <span style="color:{TEAL};-webkit-text-fill-color:{TEAL}">LATAM.</span></h1>
  <p class="sub" style="margin:22px 0 0 6px">{CUANDO}</p>
</div>
<div style="position:absolute;left:84px;right:84px;top:690px;display:flex;justify-content:space-between">{fila}</div>
""", marco(FORMATO, SEDE))


# ───────────────────────── B · Editorial (papel, lista con filetes) ─────────────────────────
def b_editorial():
    """La lámina que se guarda: papel marfil, titular en tinta, mapa en puntos y los ponentes como lista."""
    def renglon(i, clave, nombre, cargo, casa):
        return f"""<div style="display:flex;align-items:center;gap:26px;height:120px;border-top:1.5px solid {FILETE}">
  <img src="recortes/av_{clave}.png" style="width:88px;height:88px;display:block">
  <div style="flex:1">
    <div style="font-size:40px;font-weight:600;letter-spacing:-.025em;line-height:1;color:{TINTA}">{nombre}</div>
    <div style="margin-top:11px;font-size:17px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:{GRIS}">{cargo} · <span style="color:{TINTA}">{casa}</span></div>
  </div>
  <div style="font-size:17px;font-weight:500;letter-spacing:.2em;color:{TEAL_OSC}">0{i} / 03</div>
</div>"""
    lista = "".join(renglon(i, *p) for i, p in enumerate(PONENTES, 1))
    return fin(f"""
<div style="position:absolute;left:520px;top:152px;width:547px;height:592px;opacity:.5;background:{TINTA};
  -webkit-mask-image:url(trama/mapa_base.png);mask-image:url(trama/mapa_base.png)"></div>
<div style="position:absolute;left:520px;top:152px;width:547px;height:592px;background:{TEAL_OSC};
  -webkit-mask-image:url(trama/mapa_col.png);mask-image:url(trama/mapa_col.png)"></div>
<div style="position:absolute;left:78px;top:198px">
  <h1 style="font-size:124px;font-weight:500;letter-spacing:-.05em;line-height:.96;color:{TINTA}">The State<br>of the Art<br>of AI in<br><span style="color:{TEAL_OSC}">LATAM.</span></h1>
</div>
<div style="position:absolute;left:84px;top:716px;font-size:17px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:{GRIS}">Speakers</div>
<div style="position:absolute;left:84px;right:84px;top:752px;border-bottom:1.5px solid {FILETE}">{lista}</div>
<div style="position:absolute;left:84px;right:84px;top:1146px;display:flex;justify-content:space-between;align-items:flex-end">
  <div style="font-size:54px;font-weight:500;letter-spacing:-.035em;line-height:1;color:{TINTA}">{FECHA_CORTA}, 2026 · {HORA_CORTA}</div>
  <div style="font-size:54px;font-weight:500;letter-spacing:-.035em;line-height:1;color:{TEAL_OSC}">{CIUDAD}</div>
</div>
""", marco(FORMATO, SEDE, claro=True), claro=True)


# ───────────────────────── C · Torre (tinta, trama; sigue la serie «Soon») ─────────────────────────
def c_torre():
    """Continúa la campaña «Soon»: la torre que se venía construyendo ya está completa y ahora trae el anuncio."""
    def renglon(i, _clave, nombre, cargo, casa):
        return (f'<span class="pill oscura" style="font-size:27px;padding:15px 28px;gap:16px;background:rgba(12,12,11,.92);backdrop-filter:none">'
                f'<span style="color:{TEAL};font-size:19px;letter-spacing:.1em">0{i}</span>{nombre}'
                f'<span style="color:{MUTED};font-size:17px;letter-spacing:.18em;text-transform:uppercase">{cargo} · {casa}</span></span>')
    lista = "".join(renglon(i, *p) for i, p in enumerate(PONENTES, 1))
    return fin(
        f'<img class="trama" src="trama/torre.png" style="left:215px;top:-250px;opacity:.74">' + g.VELOS,
        f'<div style="position:absolute;left:0;right:0;top:0;height:640px;background:linear-gradient(180deg,{BLACK} 66%,rgba(12,12,11,0) 100%)"></div>',
        f'<div style="position:absolute;left:0;top:0;bottom:0;width:800px;background:linear-gradient(90deg,{BLACK} 46%,rgba(12,12,11,0) 100%)"></div>',
        f"""<div style="position:absolute;left:78px;right:84px;top:200px">
  <h1 class="titular" style="font-size:122px;letter-spacing:-.045em;line-height:.98;padding-bottom:.1em">The State of<br>the Art of AI<br>in <span style="color:{TEAL};-webkit-text-fill-color:{TEAL}">LATAM.</span></h1>
  <p class="sub" style="margin:22px 0 0 6px">{CUANDO}</p>
</div>
<div class="micro" style="position:absolute;left:84px;bottom:398px;letter-spacing:.3em">Speakers</div>
<div style="position:absolute;left:84px;bottom:150px;display:flex;flex-direction:column;gap:14px;align-items:flex-start">{lista}</div>
""", marco(FORMATO, SEDE))


# ───────────────────────── D · Institucional (blanco, pieza conjunta) ─────────────────────────
BLANCO, AZUL = "#ffffff", "#1d3466"
TRICOLOR = ('<div style="display:flex;height:{h}px;width:{w}"><i style="flex:2;background:#fcd116"></i>'
            '<i style="flex:1;background:#003893"></i><i style="flex:1;background:#ce1126"></i></div>')
DIRECCION = "111 Pine St, Suite 1400"


def d_blanco(sutil=False, alto=None, techo=None, aire=0):
    """Blanco, como diagrama el Consulado sus piezas (@consulcolsfo: fondo blanco, logo arriba, barra tricolor),
    con la tipografía y el teal de INPLUX. La palabra LATAM va gigante y los tres ponentes se paran delante de ella."""
    alto, techo = alto or ALTO_D, techo or TECHO_D   # alto visible de las figuras y altura de la coronilla
    simbolo = g.MARCA.format(s=50).replace("#fff", TINTA).replace("#15dcc4", "#0d7d74")
    cabecera = f"""<div style="position:absolute;left:72px;right:72px;top:52px;height:104px;display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:11px">{simbolo}<img src="assets/wordmark-black.svg" style="height:30px;display:block"></div>
  <img src="assets/consulado-sf.png" style="height:104px;display:block">
</div>
<div style="position:absolute;left:72px;right:72px;top:178px;height:1.5px;background:{FILETE}"></div>"""

    titulo = f"""<div style="position:absolute;left:68px;top:206px;font-size:78px;font-weight:500;letter-spacing:-.045em;line-height:1;color:{TINTA}">The State of the Art<br>of AI in</div>
<div style="position:absolute;right:72px;top:206px;text-align:right;font-size:78px;font-weight:500;letter-spacing:-.045em;line-height:1;color:#a8a39b">Dec 10<br>2026</div>
<div style="position:absolute;left:53px;top:332px;font-size:329px;font-weight:700;letter-spacing:-.055em;line-height:1;color:{TEAL_OSC};white-space:nowrap">LATAM</div>"""

    centros = (238, 540, 842)
    figuras = "".join(
        f'<div style="position:absolute;left:{cx - 190}px;top:{techo}px;width:380px;height:{alto}px;overflow:hidden;z-index:{z};{FUNDIDO.get(clave, "")}">'
        f'<img src="recortes/pie_{clave}.png" style="width:380px;height:440px;display:block"></div>'
        for cx, z, (clave, *_r) in zip(centros, (1, 3, 2), PONENTES))
    suelo = techo + alto
    banda = (f'<div style="position:absolute;left:0;right:0;top:{suelo - 250}px;height:250px;'
             f'background:linear-gradient(180deg,rgba(236,234,229,0) 0%,#eceae5 70%)"></div>')
    linea = f'<div style="position:absolute;left:72px;right:72px;top:{suelo}px;height:2px;background:{TINTA};z-index:4"></div>'

    def ficha(i, _clave, nombre, cargo, casa):
        return f"""<div style="flex:1;padding-right:14px">
  <div style="font-size:15px;font-weight:600;letter-spacing:.2em;color:{TEAL_OSC}">0{i}</div>
  <div style="margin-top:10px;font-size:35px;font-weight:600;letter-spacing:-.03em;line-height:1;color:{TINTA};white-space:nowrap">{nombre}</div>
  <div style="margin-top:11px;font-size:15px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:{GRIS};white-space:nowrap">{cargo} · <span style="color:{TINTA}">{casa}</span></div>
</div>"""
    fichas = (f'<div style="position:absolute;left:72px;right:72px;top:{suelo + 24 + aire // 3}px;display:flex">'
              + "".join(ficha(i, *p) for i, p in enumerate(PONENTES, 1)) + '</div>')

    def celda(rotulo, valor, detalle, ancho):
        return f"""<div style="flex:{ancho};padding:22px 22px 0 0">
  <div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{GRIS}">{rotulo}</div>
  <div style="margin-top:11px;font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.15;color:{TINTA}">{valor}</div>
  <div style="margin-top:5px;font-size:19px;font-weight:400;line-height:1.25;color:{GRIS}">{detalle}</div>
</div>"""
    franja = (f'<div style="position:absolute;left:72px;right:72px;top:{suelo + 156 + aire}px;display:flex;border-top:1.5px solid {FILETE}">'
              + celda("When", FECHA, f'<span style="color:{TINTA};font-weight:600">{HORA}</span>', 1.0)
              + celda("Where", "Consulate of Colombia", f"{DIRECCION} · {CIUDAD}", 1.25)
              + celda("Format", "Talk · Panel", "+ Networking", .75) + '</div>')

    pie = f"""<div style="position:absolute;left:72px;right:72px;bottom:44px;display:flex;justify-content:space-between;align-items:center">
  <div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{GRIS}">INPLUX × Consulado de Colombia en San Francisco</div>
  <div style="font-size:14px;font-weight:600;letter-spacing:.24em;color:{GRIS}">INPLUX.CO</div>
</div>
<div style="position:absolute;left:0;right:0;bottom:0">{TRICOLOR.format(h=12, w="100%")}</div>"""

    cabeza = g.head().replace(f"background:{BLACK}}}", f"background:{BLANCO}}}")
    fondo = SUTIL.format("claro") if sutil else ""
    return cabeza + fondo + cabecera + titulo + ("" if sutil else banda) + figuras + linea + fichas + franja + pie + "</div></body></html>"


# la foto de Jaime está cortada en el borde derecho: se funde en vez de dejar el corte recto
FUNDIDO = {"jaime": "-webkit-mask-image:linear-gradient(90deg,#000 89%,transparent 98%);mask-image:linear-gradient(90deg,#000 89%,transparent 98%)"}
ALTO_D = 408   # alto visible de las figuras: el de la más corta (Santiago), para que todas lleguen a la línea
TECHO_D = 520  # y de la coronilla de las figuras en la versión blanca (pisan el pie de «LATAM»)


# ───────────────────────── E · Niebla (fondo fotográfico: Golden Gate → América Latina) ─────────────────────────
def e_niebla(noche=False):
    """El fondo manda: el Golden Gate entre la niebla se desvanece hacia Sudamérica de noche (fondo.py).
    Los ponentes pasan a una lista pequeña en la columna izquierda; sin retratos grandes."""
    if noche:
        fondo, tinta, gris, acento, filete, papel = "fondo_noche", IVORY, MUTED, TEAL, LINE, BLACK
        simbolo, marca, logo = g.MARCA.format(s=50), "wordmark-white", None
    else:
        fondo, tinta, gris, acento, filete, papel = "fondo_claro", TINTA, GRIS, TEAL_OSC, FILETE, BLANCO
        simbolo = g.MARCA.format(s=50).replace("#fff", TINTA).replace("#15dcc4", "#0d7d74")
        marca, logo = "wordmark-black", "consulado-sf"
    # sobre tinta el logo del Consulado va en una placa blanca: es una captura a color y no tiene versión en negativo
    consulado = ('<img src="assets/consulado-sf.png" style="height:104px;display:block">' if logo else
                 '<div style="background:#fff;border-radius:10px;padding:10px 16px"><img src="assets/consulado-sf.png" style="height:86px;display:block"></div>')
    cabecera = f"""<div style="position:absolute;left:72px;right:72px;top:52px;height:104px;display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:11px">{simbolo}<img src="assets/{marca}.svg" style="height:30px;display:block"></div>
  {consulado}
</div>"""
    titulo = f"""<div style="position:absolute;left:72px;top:214px;font-size:15px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{acento}">{FORMATO}</div>
<div style="position:absolute;left:67px;top:250px;font-size:106px;font-weight:500;letter-spacing:-.05em;line-height:.97;color:{tinta}">The State of<br>the Art of AI<br>in <span style="color:{acento}">LATAM.</span></div>"""

    def renglon(i, clave, nombre, cargo, casa):
        return f"""<div style="display:flex;align-items:center;gap:18px;height:66px;border-top:1.5px solid {filete}">
  <img src="recortes/av_{clave}.png" style="width:46px;height:46px;display:block;border-radius:50%">
  <div style="font-size:27px;font-weight:600;letter-spacing:-.025em;color:{tinta};white-space:nowrap">{nombre}</div>
  <div style="font-size:14px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:{gris};white-space:nowrap;margin-left:auto">{cargo} · <span style="color:{tinta}">{casa}</span></div>
</div>"""
    lista = (f'<div style="position:absolute;left:72px;top:596px;width:500px">'
             f'<div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{gris};margin-bottom:14px">Speakers</div>'
             + "".join(renglon(i, *p) for i, p in enumerate(PONENTES, 1))
             + f'<div style="border-top:1.5px solid {filete}"></div></div>')

    def celda(rotulo, valor, detalle):
        return f"""<div>
  <div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{gris}">{rotulo}</div>
  <div style="margin-top:9px;font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.15;color:{tinta};white-space:nowrap">{valor}</div>
  <div style="margin-top:4px;font-size:18px;line-height:1.25;color:{gris};white-space:nowrap">{detalle}</div>
</div>"""
    datos = (f'<div style="position:absolute;left:72px;top:850px;display:flex;gap:46px">'
             + celda("When", FECHA, f'<span style="color:{tinta};font-weight:600">{HORA}</span>')
             + celda("Where", "Consulate of Colombia", f"{DIRECCION} · {CIUDAD}") + '</div>')
    pie = f'<div style="position:absolute;left:0;right:0;bottom:0">{TRICOLOR.format(h=12, w="100%")}</div>'
    cabeza = g.head().replace(f"background:{BLACK}}}", f"background:{papel}}}")
    return (cabeza + f'<img src="trama/{fondo}.jpg" style="position:absolute;left:0;top:0;width:1080px;height:1350px;display:block">'
            + cabecera + titulo + lista + datos + pie + "</div></body></html>")


# ───────────────────────── G · Combinada (niebla + «LATAM» gigante) ─────────────────────────
def g_combinada(noche=False):
    """Une las dos que le gustaron a Cristian: el fondo de niebla (E) y la palabra LATAM a todo el ancho (D).
    La palabra va en medio de las capas: delante del papel y del planeta, detrás del puente, que la cruza por la derecha."""
    if noche:
        suf, tinta, gris, acento, filete, papel = "noche", IVORY, MUTED, TEAL, LINE, BLACK
        simbolo, marca = g.MARCA.format(s=50), "wordmark-white"
        consulado = '<div style="background:#fff;border-radius:10px;padding:10px 16px"><img src="assets/consulado-sf.png" style="height:86px;display:block"></div>'
    else:
        suf, tinta, gris, acento, filete, papel = "claro", TINTA, GRIS, TEAL_OSC, FILETE, BLANCO
        simbolo = g.MARCA.format(s=50).replace("#fff", TINTA).replace("#15dcc4", "#0d7d74")
        marca, consulado = "wordmark-black", '<img src="assets/consulado-sf.png" style="height:104px;display:block">'
    capa = 'position:absolute;left:0;top:0;width:1080px;height:1350px;display:block'
    cabecera = f"""<div style="position:absolute;left:72px;right:72px;top:52px;height:104px;display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:11px">{simbolo}<img src="assets/{marca}.svg" style="height:30px;display:block"></div>
  {consulado}
</div>"""
    titulo = f"""<div style="position:absolute;left:72px;top:198px;font-size:15px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{acento}">{FORMATO}</div>
<div style="position:absolute;left:68px;top:230px;font-size:78px;font-weight:500;letter-spacing:-.045em;line-height:1;color:{tinta}">The State of the Art<br>of AI in</div>"""
    palabra = f'<div style="position:absolute;left:53px;top:352px;font-size:329px;font-weight:700;letter-spacing:-.055em;line-height:1;color:{acento};white-space:nowrap">LATAM</div>'

    def renglon(i, clave, nombre, cargo, casa):
        return f"""<div style="display:flex;align-items:center;gap:18px;height:64px;border-top:1.5px solid {filete}">
  <img src="recortes/av_{clave}.png" style="width:46px;height:46px;display:block;border-radius:50%">
  <div style="font-size:27px;font-weight:600;letter-spacing:-.025em;color:{tinta};white-space:nowrap">{nombre}</div>
  <div style="font-size:14px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:{gris};white-space:nowrap;margin-left:auto">{cargo} · <span style="color:{tinta}">{casa}</span></div>
</div>"""
    lista = (f'<div style="position:absolute;left:72px;top:672px;width:500px">'
             f'<div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{gris};margin-bottom:13px">Speakers</div>'
             + "".join(renglon(i, *p) for i, p in enumerate(PONENTES, 1))
             + f'<div style="border-top:1.5px solid {filete}"></div></div>')

    def celda(rotulo, valor, detalle):
        return f"""<div>
  <div style="font-size:14px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:{gris}">{rotulo}</div>
  <div style="margin-top:9px;font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.15;color:{tinta};white-space:nowrap">{valor}</div>
  <div style="margin-top:4px;font-size:18px;line-height:1.25;color:{gris};white-space:nowrap">{detalle}</div>
</div>"""
    datos = (f'<div style="position:absolute;left:72px;top:918px;display:flex;gap:46px">'
             + celda("When", FECHA, f'<span style="color:{tinta};font-weight:600">{HORA}</span>')
             + celda("Where", "Consulate of Colombia", f"{DIRECCION} · {CIUDAD}") + '</div>')
    pie = f'<div style="position:absolute;left:0;right:0;bottom:0">{TRICOLOR.format(h=12, w="100%")}</div>'
    cabeza = g.head().replace(f"background:{BLACK}}}", f"background:{papel}}}")
    return (cabeza + f'<img src="trama/planeta_{suf}.jpg" style="{capa}">' + palabra
            + f'<img src="trama/puente_{suf}.png" style="{capa}">'
            + cabecera + titulo + lista + datos + pie + "</div></body></html>")


PIEZAS = {
    "sota_a_alineacion": (a_alineacion, 1080, 1350),
    "sota_b_editorial": (b_editorial, 1080, 1350),
    "sota_c_torre": (c_torre, 1080, 1350),
    "sota_d_blanco": (d_blanco, 1080, 1350),
    "sota_e_niebla": (e_niebla, 1080, 1350),
    "sota_f_noche": (lambda: e_niebla(noche=True), 1080, 1350),
    "sota_g_combinada": (g_combinada, 1080, 1350),
    "sota_h_combinada_noche": (lambda: g_combinada(noche=True), 1080, 1350),
    "sota_i_blanco_sutil": (lambda: d_blanco(sutil=True), 1080, 1350),
    # K · como I, con los cuerpos recortados a la altura del pecho (pedido de Cristian, 17-nov)
    "sota_k_blanco_busto": (lambda: d_blanco(sutil=True, alto=318, techo=552, aire=24), 1080, 1350),
    "sota_j_alineacion_sutil": (lambda: a_alineacion(sutil=True), 1080, 1350),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
