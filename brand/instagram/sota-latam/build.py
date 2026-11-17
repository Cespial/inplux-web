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
SEDE = "Consulate General of Colombia"
ALIADO = "Cancillería de Colombia"
FORMATO = "Talk · Panel · Networking"
ASOMA = 124  # px que la cabeza sobresale por encima de la tarjeta
CUANDO = f'<b>{FECHA}</b> <span style="color:{TEAL}">→</span> <b>{CIUDAD}</b>'


def sello(claro=False):
    """INPLUX × Cancillería de Colombia. El segundo nombre es texto, no logo (ver la nota de arriba)."""
    marca, tinta, aspa = ("wordmark-black", TINTA, GRIS) if claro else ("wordmark-white", IVORY, DIM)
    return (f'<div style="display:flex;align-items:center;gap:16px">'
            f'<img src="assets/{marca}.svg" style="height:22px;display:block">'
            f'<span style="color:{aspa};font-size:22px;line-height:1">×</span>'
            f'<span style="font-size:21px;font-weight:600;letter-spacing:.01em;color:{tinta};white-space:nowrap">{ALIADO}</span></div>')


def marco(derecha, pie_izq, pie_der="INPLUX.CO", claro=False):
    borde, cruz, micro = (("rgba(18,17,15,.14)", "rgba(18,17,15,.5)", GRIS) if claro
                          else ("rgba(246,242,236,.10)", "rgba(246,242,236,.45)", MUTED))
    cruces = "".join(f'<div class="cruz" style="{v}:21px;{h}:21px;color:{cruz}">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    return f"""<div class="grano"></div><div class="marco" style="border-color:{borde}"></div>{cruces}
<div style="position:absolute;left:84px;top:82px">{sello(claro)}</div>
<div class="micro" style="position:absolute;right:84px;top:86px;letter-spacing:.2em;color:{micro}">{derecha}</div>
<div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;align-items:center;justify-content:space-between">
  <div class="micro" style="color:{micro};letter-spacing:.2em">{pie_izq}</div><div class="micro" style="color:{micro}">{pie_der}</div>
</div>"""


def fin(*partes, claro=False):
    cabeza = g.head()
    if claro:
        cabeza = cabeza.replace(f"background:{BLACK}}}", f"background:{PAPEL}}}")
    return cabeza + "".join(partes) + "</div></body></html>"


# ───────────────────────── A · Alineación (tinta, retratos recortados) ─────────────────────────
def a_alineacion():
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
    return fin(f"""
<div style="position:absolute;left:560px;top:120px;width:547px;height:592px;opacity:.16;background:{IVORY};
  -webkit-mask-image:url(trama/mapa_base.png);mask-image:url(trama/mapa_base.png)"></div>
<div style="position:absolute;left:560px;top:120px;width:547px;height:592px;opacity:.9;background:{TEAL};
  -webkit-mask-image:url(trama/mapa_col.png);mask-image:url(trama/mapa_col.png)"></div>
<div style="position:absolute;left:78px;right:84px;top:176px">
  <h1 class="titular" style="font-size:122px;letter-spacing:-.045em;line-height:.98;padding-bottom:.1em">The State of<br>the Art of AI<br>in <span style="color:{TEAL};-webkit-text-fill-color:{TEAL}">LATAM.</span></h1>
  <p class="sub" style="margin:22px 0 0 6px">{CUANDO}</p>
</div>
<div style="position:absolute;left:84px;right:84px;top:690px;display:flex;justify-content:space-between">{fila}</div>
""", marco(FORMATO, SEDE))


# ───────────────────────── B · Editorial (papel, lista con filetes) ─────────────────────────
def b_editorial():
    """La lámina que se guarda: papel marfil, titular en tinta, mapa en puntos y los ponentes como lista."""
    def renglon(i, clave, nombre, cargo, casa):
        return f"""<div style="display:flex;align-items:center;gap:26px;height:124px;border-top:1.5px solid {FILETE}">
  <img src="recortes/av_{clave}.png" style="width:88px;height:88px;display:block">
  <div style="flex:1">
    <div style="font-size:40px;font-weight:600;letter-spacing:-.025em;line-height:1;color:{TINTA}">{nombre}</div>
    <div style="margin-top:11px;font-size:17px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:{GRIS}">{cargo} · <span style="color:{TINTA}">{casa}</span></div>
  </div>
  <div style="font-size:17px;font-weight:500;letter-spacing:.2em;color:{TEAL_OSC}">0{i} / 03</div>
</div>"""
    lista = "".join(renglon(i, *p) for i, p in enumerate(PONENTES, 1))
    return fin(f"""
<div style="position:absolute;left:520px;top:128px;width:547px;height:592px;opacity:.5;background:{TINTA};
  -webkit-mask-image:url(trama/mapa_base.png);mask-image:url(trama/mapa_base.png)"></div>
<div style="position:absolute;left:520px;top:128px;width:547px;height:592px;background:{TEAL_OSC};
  -webkit-mask-image:url(trama/mapa_col.png);mask-image:url(trama/mapa_col.png)"></div>
<div style="position:absolute;left:78px;top:178px">
  <h1 style="font-size:124px;font-weight:500;letter-spacing:-.05em;line-height:.96;color:{TINTA}">The State<br>of the Art<br>of AI in<br><span style="color:{TEAL_OSC}">LATAM.</span></h1>
</div>
<div style="position:absolute;left:84px;top:700px;font-size:17px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:{GRIS}">Speakers</div>
<div style="position:absolute;left:84px;right:84px;top:738px;border-bottom:1.5px solid {FILETE}">{lista}</div>
<div style="position:absolute;left:84px;right:84px;top:1140px;display:flex;justify-content:space-between;align-items:flex-end">
  <div style="font-size:54px;font-weight:500;letter-spacing:-.035em;line-height:1;color:{TINTA}">{FECHA}</div>
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
        f"""<div style="position:absolute;left:78px;right:84px;top:176px">
  <h1 class="titular" style="font-size:122px;letter-spacing:-.045em;line-height:.98;padding-bottom:.1em">The State of<br>the Art of AI<br>in <span style="color:{TEAL};-webkit-text-fill-color:{TEAL}">LATAM.</span></h1>
  <p class="sub" style="margin:22px 0 0 6px">{CUANDO}</p>
</div>
<div class="micro" style="position:absolute;left:84px;bottom:398px;letter-spacing:.3em">Speakers</div>
<div style="position:absolute;left:84px;bottom:150px;display:flex;flex-direction:column;gap:14px;align-items:flex-start">{lista}</div>
""", marco(FORMATO, SEDE))


PIEZAS = {
    "sota_a_alineacion": (a_alineacion, 1080, 1350),
    "sota_b_editorial": (b_editorial, 1080, 1350),
    "sota_c_torre": (c_torre, 1080, 1350),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
