"""Portada de la página de INPLUX en LinkedIn (1128×191), concepto «Estratos».

Gramática de Croma (casi negro, imagen grabada en gris, micro-rótulos
espaciados, «+» en las esquinas) y de Primero (una sola frase sobre una
textura ancha), con la identidad v5 de inplux.co. Se diseña en unidades de
1128×191 y se renderiza a 2× con `zoom`.

Zonas seguras: en escritorio el logo de la página tapa la esquina inferior
izquierda (≈0–200 × 110–191); en móvil la portada se recorta a ≈4:1 centrado,
así que el texto vive entre x≈190 y x≈940.
"""
from pathlib import Path

AQUI = Path(__file__).parent
W, H, ESCALA = 1128, 191, 2

BLACK, IVORY, MUTED, DIM, TEAL = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca"

GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")

TITULAR = '<span class="gris">Transformación con IA</span><br>que llega a producción.'


def head():
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html{{zoom:{ESCALA}}}
body{{width:{W}px;height:{H}px;overflow:hidden;background:{BLACK};color:{IVORY};
  font-family:"Rethink Sans",sans-serif;position:relative;-webkit-font-smoothing:antialiased}}
.fondo{{position:absolute;inset:0;background-size:cover;filter:grayscale(1) contrast(1.08)}}
.grano{{position:absolute;inset:0;background-image:{GRANO};background-size:120px;opacity:.10;mix-blend-mode:overlay}}
.titular{{font-weight:500;font-size:29px;line-height:1.08;letter-spacing:-.025em}}
.gris{{color:{MUTED}}}
.micro{{font-size:8.5px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:{MUTED}}}
.micro b{{color:{TEAL};font-weight:500}}
.mas{{position:absolute;width:9px;height:9px}}
.mas::before,.mas::after{{content:"";position:absolute;background:{DIM}}}
.mas::before{{left:4px;top:0;width:1px;height:9px}}
.mas::after{{top:4px;left:0;height:1px;width:9px}}
.capas{{position:absolute;display:grid;gap:5px}}
.capas i{{display:block;height:2px;border-radius:2px;background:rgba(246,242,236,.55)}}
.capas i:first-child{{background:{TEAL}}}
</style>"""


def esquinas(p=12):
    return "".join(f'<span class="mas" style="{v}:{p}px;{h}:{p}px"></span>'
                   for v in ("top", "bottom") for h in ("left", "right"))


def capas(x, y, largo=54):
    """Las tres barras del símbolo Estratos, escalonadas; la de arriba en teal."""
    return (f'<div class="capas" style="left:{x}px;top:{y}px">'
            f'<i style="width:{largo}px;margin-left:{largo * .5:.0f}px"></i>'
            f'<i style="width:{largo}px;margin-left:{largo * .25:.0f}px"></i>'
            f'<i style="width:{largo}px"></i></div>')


def izquierda():
    """V1: titular a la izquierda (fuera del logo) y estratos grabados que entran por la derecha."""
    return head() + f"""
<div class="fondo" style="left:430px;background-image:url(mj/estratos_1.jpeg);background-position:50% 55%;
  filter:grayscale(1) contrast(1.1) brightness(.62);
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 38%)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(12,12,11,.55),transparent 45%)"></div>
<div class="grano"></div>
{esquinas()}
<div style="position:absolute;left:232px;top:44px;display:grid;gap:14px">
  <p class="micro"><b>→</b> Desarrollo e implementación de IA</p>
  <h1 class="titular">{TITULAR}</h1>
</div>
<p class="micro" style="position:absolute;right:34px;top:26px;color:{IVORY}">inplux.co</p>
{capas(34, 24, 36)}
"""


def centro():
    """V2: terrazas andinas a todo el ancho, frase centrada como en el banner de Primero."""
    return head() + f"""
<div class="fondo" style="background-image:url(mj/terrazas_2.jpeg);background-position:60% 40%;
  filter:grayscale(1) contrast(1.15) brightness(.95)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 38% 70% at 50% 50%,rgba(12,12,11,.82),rgba(12,12,11,.25) 100%)"></div>
<div class="grano"></div>
{esquinas()}
<div style="position:absolute;left:0;right:0;top:46px;display:grid;gap:14px;justify-items:center;text-align:center">
  <p class="micro"><b>→</b> Desarrollo e implementación de IA</p>
  <h1 class="titular">{TITULAR}</h1>
</div>
<p class="micro" style="position:absolute;right:34px;top:26px;color:{IVORY}">inplux.co</p>
{capas(34, 24, 36)}
"""


PIEZAS = {
    "linkedin_estratos_izquierda": (izquierda, W * ESCALA, H * ESCALA),
    "linkedin_estratos_centro": (centro, W * ESCALA, H * ESCALA),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
