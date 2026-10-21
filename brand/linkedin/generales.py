"""Seis portadas «generales» para LinkedIn (1512×256): una frase de la oferta de
valor de inplux.co por pieza y un estilo distinto en cada una, para que el
equipo elija.

Reutiliza head(), esquinas(), capas() y la zona segura de build.py. Todas las
frases salen del sitio (hero, lead y statement de src/content/copy/es.ts, y los
estados públicos de src/content/work.ts).
"""
from build import AQUI, W, H, ESCALA, BLACK, IVORY, MUTED, DIM, TEAL, SEGURA, head, esquinas, capas
import build

X0, X1 = SEGURA
TEAL_INK = "#007a72"

ESTILO = f"""<style>
.h{{font-weight:500;letter-spacing:-.028em;line-height:1.04}}
.s{{font-size:20px;line-height:1.25;letter-spacing:-.012em;color:{MUTED}}}
.consola{{position:absolute;border:1px solid rgba(246,242,236,.16);border-radius:10px;
  background:rgba(12,12,11,.74);backdrop-filter:blur(6px);overflow:hidden}}
.consola header{{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid rgba(246,242,236,.12)}}
.consola header i{{width:7px;height:7px;border-radius:50%;background:rgba(246,242,236,.25)}}
.consola header span{{margin-left:auto;margin-right:auto;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:{DIM}}}
.consola ol{{list-style:none;padding:6px 14px}}
.consola li{{display:grid;grid-template-columns:76px 1fr auto;gap:10px;align-items:baseline;padding:4.5px 0;font-size:12.5px}}
.consola li + li{{border-top:1px solid rgba(246,242,236,.07)}}
.consola b{{font-weight:500;color:{IVORY}}}
.consola em{{font-style:normal;color:{MUTED}}}
.consola small{{font-size:10px;letter-spacing:.06em;color:{TEAL}}}
.claro .micro{{color:#5c5751}} .claro .micro b{{color:{TEAL_INK}}}
.claro .mas::before,.claro .mas::after{{background:#b8b1a6}}
.claro .capas i{{background:rgba(12,12,11,.45)}} .claro .capas i:first-child{{background:{TEAL_INK}}}
</style>"""


def base(fondo, cuerpo, claro=False):
    """Capas comunes: fondo, grano, «+» y dominio dentro de la zona segura."""
    color = "#3d3a36" if claro else IVORY
    return (head() + ESTILO + f'<div class="{"claro" if claro else ""}" style="position:absolute;inset:0">'
            + fondo + '<div class="grano"></div>' + esquinas()
            + f'<p class="micro" style="position:absolute;right:{W - X1 + 8}px;top:32px;color:{color}">inplux.co</p>'
            + capas(X0 + 8, 34, 40) + cuerpo + "</div>")


def bloque(rotulo, titular, sub, *, izq=None, der=None, top=58, tam=44, centrado=False, ancho=None):
    izq = X0 + 150 if izq is None else izq
    caja = (f"left:{X0}px;right:{W - X1}px;justify-items:center;text-align:center" if centrado
            else f"left:{izq}px;" + (f"width:{ancho}px" if ancho else f"right:{W - (der or X1)}px"))
    return f"""<div style="position:absolute;{caja};top:{top}px;display:grid;gap:11px">
  <p class="micro"><b>→</b> {rotulo}</p>
  <h1 class="h" style="font-size:{tam}px">{titular}</h1>
  {f'<p class="s">{sub}</p>' if sub else ''}
</div>"""


def manos():
    """La IA acelera, las personas deciden: mano grabada a la derecha, como el póster de Croma."""
    fondo = f"""<div class="fondo" style="left:700px;background-image:url(mj/mano_3.jpeg);background-position:70% 60%;
  filter:grayscale(1) contrast(1.12) brightness(.8);-webkit-mask-image:linear-gradient(90deg,transparent,#000 35%)"></div>"""
    return base(fondo, bloque("Desarrollo e implementación de IA",
                              'La IA acelera.<br><span class="gris">Las personas deciden.</span>',
                              "", tam=42, top=56))


def consola():
    """Productos propios y equipos: ventana con lo que está publicado, sobre satén negro (Croma «Connections»)."""
    filas = [("Tribai", "Tributación", "Producto público"), ("Kelsen", "Derecho", "Explorador público"),
             ("Laudos", "Arbitraje", "Beta abierta"), ("Gobia", "Gestión pública", "Piloto activo")]
    lis = "".join(f"<li><b>{n}</b><em>{c}</em><small>● {e}</small></li>" for n, c, e in filas)
    fondo = """<div class="fondo" style="background-image:url(mj/saten_0.jpeg);background-position:50% 40%;
  filter:grayscale(1) contrast(1.05) brightness(.85)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,12,11,.7),rgba(12,12,11,.15))"></div>"""
    ventana = f"""<div class="consola" style="left:{X1 - 352}px;width:344px;top:62px">
  <header><i></i><i></i><i></i><span>Productos INPLUX</span></header><ol>{lis}</ol></div>"""
    return base(fondo, bloque("Productos propios · Equipos de implementación",
                              'Productos propios.<br><span class="gris">Equipos que los implementan.</span>',
                              "", izq=X0 + 120, ancho=440, tam=32, top=62) + ventana)


def problema():
    """El software empieza en el problema: versión clara, montañas en tinta sobre papel marfil."""
    fondo = f"""<div style="position:absolute;inset:0;background:{IVORY}"></div>
<div class="fondo" style="left:560px;background-image:url(mj/topo_0.jpeg);background-position:60% 60%;
  filter:grayscale(1) sepia(.12) contrast(1.05);mix-blend-mode:multiply;-webkit-mask-image:linear-gradient(90deg,transparent,#000 30%)"></div>"""
    titular = f'<span style="color:{BLACK}">El software empieza<br>en el problema.</span>'
    return base(fondo, bloque("Desarrollo e implementación de IA", titular, "", tam=42, top=56)
                .replace(f'class="s"', 'class="s" style="color:#5c5751"'), claro=True)


def pintura():
    """IA para Latinoamérica: textura pictórica en teal, frase centrada como el banner de Primero."""
    fondo = """<div class="fondo" style="background-image:url(mj/pintura_1.jpeg);background-position:50% 50%;filter:saturate(.9) brightness(.8)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 40% 75% at 50% 52%,rgba(8,20,19,.78),rgba(8,20,19,.2))"></div>"""
    return base(fondo, bloque("Productos propios y equipos de implementación",
                              "IA para empresas e instituciones<br>de Latinoamérica.", "", centrado=True, tam=38, top=58))


def tierra():
    """Hecho en Medellín, en producción fuera: la Tierra de noche con las Américas y África."""
    fondo = """<div class="fondo" style="right:auto;width:900px;left:-60px;background-image:url(mj/tierra_0.jpeg);
  background-size:auto 100%;background-position:30% 0;filter:grayscale(1) brightness(1.05)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,rgba(12,12,11,.9) 55%)"></div>"""
    return base(fondo, bloque("Software con IA en producción",
                              'Hecho en Medellín.<br><span class="gris">En producción de Colombia a Sudáfrica.</span>',
                              "", izq=690, tam=30, top=62))


PIEZAS = {
    "general_1_terrazas": build.PIEZAS["linkedin_centro_general"],
    "general_2_manos": (manos, W * ESCALA, H * ESCALA),
    "general_3_productos": (consola, W * ESCALA, H * ESCALA),
    "general_4_problema": (problema, W * ESCALA, H * ESCALA),
    "general_5_latam": (pintura, W * ESCALA, H * ESCALA),
    "general_6_mundo": (tierra, W * ESCALA, H * ESCALA),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
