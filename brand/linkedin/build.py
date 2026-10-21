"""Portada de la página de INPLUX en LinkedIn (1512×256, medida oficial de LinkedIn), concepto «Estratos».

Gramática de Croma (casi negro, imagen grabada en gris, micro-rótulos
espaciados, «+» en las esquinas) y de Primero (una sola frase sobre una
textura ancha), con la identidad v5 de inplux.co. Se diseña en unidades de
1512×256 y se renderiza a 2× con `zoom`.

Zonas seguras: en escritorio el logo de la página tapa la esquina inferior
izquierda; en móvil la portada se recorta a ≈4:1 centrado (ver SEGURA).
"""
from pathlib import Path

AQUI = Path(__file__).parent
W, H, ESCALA = 1512, 256, 2

BLACK, IVORY, MUTED, DIM, TEAL = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca"

GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")

# Gancho en marfil y propuesta en gris debajo.
FRASES = {
    "es": ("No hacemos demos.", "Software con IA que llega a producción.", "Desarrollo e implementación de IA"),
    # La versión general, con el titular del sitio en dos tonos y sin gancho.
    "general": ('<span class="gris">Transformación con IA</span><br>que llega a producción.', "",
                "Desarrollo e implementación de IA"),
    "en": ("We don\u2019t ship slides.", "AI transformation that reaches production.", "AI development and implementation"),
}

# Zona segura: en móvil LinkedIn recorta la portada a ≈4:1 centrado, así que
# todo lo que debe leerse vive entre SEGURA[0] y SEGURA[1].
SEGURA = (W - H * 4) // 2 + 24, (W + H * 4) // 2 - 24

def head():
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html{{zoom:{ESCALA}}}
body{{width:{W}px;height:{H}px;overflow:hidden;background:{BLACK};color:{IVORY};
  font-family:"Rethink Sans",sans-serif;position:relative;-webkit-font-smoothing:antialiased}}
.fondo{{position:absolute;inset:0;background-size:cover;filter:grayscale(1) contrast(1.08)}}
.grano{{position:absolute;inset:0;background-image:{GRANO};background-size:120px;opacity:.10;mix-blend-mode:overlay}}
.gancho{{font-weight:500;font-size:50px;line-height:1;letter-spacing:-.03em}}
.gancho.dos{{font-size:38px;line-height:1.08;letter-spacing:-.025em}}
.propuesta{{font-weight:400;font-size:22px;line-height:1.2;letter-spacing:-.015em;color:{MUTED}}}
.gris{{color:{MUTED}}}
.micro{{font-size:10.5px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:{MUTED}}}
.micro b{{color:{TEAL};font-weight:500}}
.mas{{position:absolute;width:9px;height:9px}}
.mas::before,.mas::after{{content:"";position:absolute;background:{DIM}}}
.mas::before{{left:4px;top:0;width:1px;height:9px}}
.mas::after{{top:4px;left:0;height:1px;width:9px}}
.capas{{position:absolute;display:grid;gap:6px}}
.capas i{{display:block;height:3px;border-radius:2px;background:rgba(246,242,236,.55)}}
.capas i:first-child{{background:{TEAL}}}
</style>"""


def esquinas(p=14):
    """«+» en las esquinas de la zona segura, para que no se pierdan en móvil."""
    x0, x1 = SEGURA
    return "".join(f'<span class="mas" style="{v}:{p}px;left:{x}px"></span>'
                   for v in ("top", "bottom") for x in (x0 - 4, x1 - 5))


def capas(x, y, largo=54):
    """Las tres barras del símbolo Estratos, escalonadas; la de arriba en teal."""
    return (f'<div class="capas" style="left:{x}px;top:{y}px">'
            f'<i style="width:{largo}px;margin-left:{largo * .5:.0f}px"></i>'
            f'<i style="width:{largo}px;margin-left:{largo * .25:.0f}px"></i>'
            f'<i style="width:{largo}px"></i></div>')


def texto(frase, centrado):
    gancho, propuesta, rotulo = FRASES[frase]
    x0, x1 = SEGURA
    caja = (f"left:{x0}px;right:{W - x1}px;justify-items:center;text-align:center" if centrado
            else f"left:{x0 + 150}px;right:{W - x1}px")
    return f"""
<div style="position:absolute;{caja};top:58px;display:grid;gap:12px">
  <p class="micro"><b>→</b> {rotulo}</p>
  <h1 class="gancho{'' if propuesta else ' dos'}">{gancho}</h1>
  {f'<p class="propuesta">{propuesta}</p>' if propuesta else ''}
</div>
<p class="micro" style="position:absolute;right:{W - x1 + 8}px;top:32px;color:{IVORY}">inplux.co</p>
{capas(x0 + 8, 34, 40)}"""


def izquierda(frase="es"):
    """V1: texto a la izquierda de la zona segura y estratos grabados entrando por la derecha."""
    return head() + f"""
<div class="fondo" style="left:640px;background-image:url(mj/estratos_1.jpeg);background-position:50% 55%;
  filter:grayscale(1) contrast(1.1) brightness(.62);
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 40%)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(12,12,11,.55),transparent 45%)"></div>
<div class="grano"></div>
{esquinas()}{texto(frase, False)}
"""


def centro(frase="es"):
    """V2: terrazas andinas a todo el ancho y frase centrada, como el banner de Primero."""
    return head() + f"""
<div class="fondo" style="background-image:url(mj/terrazas_2.jpeg);background-position:60% 40%;
  filter:grayscale(1) contrast(1.15) brightness(.95)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 36% 72% at 50% 52%,rgba(12,12,11,.85),rgba(12,12,11,.25) 100%)"></div>
<div class="grano"></div>
{esquinas()}{texto(frase, True)}
"""


PIEZAS = {
    f"linkedin_{forma.__name__}_{frase}": ((lambda f=forma, fr=frase: f(fr)), W * ESCALA, H * ESCALA)
    for forma in (izquierda, centro) for frase in FRASES
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
