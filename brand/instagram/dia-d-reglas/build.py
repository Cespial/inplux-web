"""Carrusel de colaboración INPLUX × 10ampro: las tres reglas de su comunidad.

22-oct-2026: Cristian pidió fondos de estatuaria romana en blanco y negro (no barroco),
no mencionar el Día D y una pieza pensada para publicar como colaboración con @10ampro,
con su logo (círculo verde «A 10 M PRO», tomado de manifiesto.10am.pro/logo.jpg, sin alterar).

Misma gramática que sudafrica/build.py: micro «→ X» en versalitas espaciadas,
titular en dos tonos (gris → marfil), wordmark arriba a la derecha, INPLUX.CO
abajo, grano y fondo de Midjourney con velo. Solo Rethink Sans y tokens v5.
Fondos: estatuaria romana en blanco y negro (Midjourney, 22-oct-2026, carpeta mj-bn/).
"""
from pathlib import Path

AQUI = Path(__file__).parent
BLACK, IVORY, MUTED, DIM, TEAL = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca"
LINE = "rgba(246,242,236,.16)"
MARCA = ('<svg viewBox="0 0 100 100" width="{s}" height="{s}"><rect x="8" y="57" width="42" height="13" rx="6.5" fill="#fff"/>'
         '<rect x="29" y="39" width="42" height="13" rx="6.5" fill="#fff"/><rect x="50" y="21" width="42" height="13" rx="6.5" fill="#15dcc4"/></svg>')
GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")

REGLAS = [
    ("Open Source Capital", "Compartir tesis y aprendizajes en vez de guardarlos.", "orador.jpg", "center", 300),
    ("Collective Intelligence", "La sincronización de personas inteligentes en un mismo lugar.", "senadores.jpg", "center", 0),
    ("Network Sharing", "Activar las redes propias para acelerar a la gente correcta.", "manos.jpg", "center", 0),
]


def head(w, h):
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{w}px;height:{h}px;overflow:hidden;background:{BLACK}}}
body{{font-family:"Rethink Sans",sans-serif;color:{IVORY};-webkit-font-smoothing:antialiased}}
.lienzo{{position:relative;width:{w}px;height:{h}px;overflow:hidden}}
.fondo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.velo,.grano{{position:absolute;inset:0}}
.grano{{background-image:{GRANO};opacity:.07;mix-blend-mode:overlay}}
.capa{{position:absolute;inset:0;display:flex;flex-direction:column}}
.titular{{font-weight:500;letter-spacing:-.025em;line-height:1.02}}
.gris{{color:{MUTED}}}
.micro{{font-size:19px;letter-spacing:.3em;text-transform:uppercase;color:{MUTED};font-weight:500}}
.wordmark{{height:24px;display:block}}
.pill{{display:inline-flex;align-items:center;gap:14px;border-radius:999px;white-space:nowrap}}
.pill.clara{{background:{IVORY};color:{BLACK};padding:18px 36px 18px 22px;font-size:34px;font-weight:500;
  box-shadow:0 0 0 8px rgba(246,242,236,.06),0 20px 60px rgba(0,0,0,.5)}}
.pill.oscura{{background:rgba(246,242,236,.07);border:1.5px solid {LINE};padding:16px 30px;font-size:26px}}
</style></head><body><div class="lienzo">"""


def fondo(img, velo, pos="center", bajar=0):
    """bajar: px que la imagen se desplaza hacia abajo para sacar la figura de debajo del titular."""
    return (f'<img class="fondo" src="mj-bn/{img}" style="object-position:{pos};transform:translateY({bajar}px)">'
            f'<div class="velo" style="background:{velo}"></div><div class="grano"></div>')


def sello(alto=24, logo=56):
    """INPLUX × 10ampro, alineado por el centro: wordmark, aspa fina y el círculo de 10ampro."""
    return (f'<div style="display:flex;align-items:center;gap:18px">'
            f'<img src="assets/wordmark-white.svg" style="height:{alto}px;display:block">'
            f'<span style="color:{DIM};font-size:{alto}px;line-height:1">×</span>'
            f'<img src="assets/10ampro.png" style="height:{logo}px;width:{logo}px;display:block"></div>')


def bordes(arriba, pad=84):
    return (f'<div style="position:absolute;top:{pad - 16}px;right:{pad}px">{sello()}</div>'
            f'<div class="micro" style="position:absolute;left:{pad}px;top:{pad}px">{arriba}</div>'
            f'<div class="micro" style="position:absolute;left:{pad}px;bottom:{pad - 4}px">INPLUX.CO <span style="color:{DIM}">·</span> 10AM.PRO</div>')


def portada():
    velo = f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.9) 30%,rgba(12,12,11,.1) 60%,rgba(12,12,11,.7) 100%)"
    return head(1080, 1350) + fondo("galeria.jpg", velo, "center 80%") + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:96px"><span class="gris">Tres reglas</span><br>de la comunidad<br>10ampro.</h1>
</div>
<div class="micro" style="position:absolute;right:84px;bottom:80px;color:{IVORY}">Desliza →</div>
{bordes("→ En colaboración")}</div></body></html>"""


def regla(i):
    t, d, img, pos, bajar = REGLAS[i]
    velo = f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.9) 32%,rgba(12,12,11,.1) 62%,rgba(12,12,11,.65) 100%)"
    return head(1080, 1350) + fondo(img, velo, pos, bajar) + f"""
<div class="capa" style="padding:150px 84px 0">
  <div style="font-size:24px;color:{TEAL};letter-spacing:.08em">0{i + 1} <span style="color:{DIM}">/ 03</span></div>
  <h1 class="titular" style="font-size:100px;margin-top:26px">{t.replace(" ", "<br>", 1)}</h1>
  <p style="margin-top:34px;font-size:32px;line-height:1.38;color:{MUTED};max-width:820px">{d}</p>
</div>{bordes("→ Regla 0" + str(i + 1))}</div></body></html>"""


def cierre():
    velo = f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.88) 36%,rgba(12,12,11,.15) 66%,rgba(12,12,11,.6) 100%)"
    return head(1080, 1350) + fondo("antorcha.jpg", velo, "center", 140) + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:92px"><span class="gris">Las ideas crecen</span><br>cuando se comparten.</h1>
  <div style="margin-top:60px">{sello(alto=40, logo=96)}</div>
  <div style="margin-top:48px;display:flex;gap:18px;align-items:center">
    <span class="pill clara" style="padding:18px 34px;font-size:30px">{MARCA.replace('#fff', BLACK).replace('#15dcc4', '#007a72').format(s=36)}inplux.co</span>
    <span class="pill oscura">10am.pro</span>
  </div>
</div>{bordes("→ Juntos")}</div></body></html>"""


PIEZAS = {
    "reglas10am_01_portada": (portada, 1080, 1350),
    "reglas10am_02_open": (lambda: regla(0), 1080, 1350),
    "reglas10am_03_collective": (lambda: regla(1), 1080, 1350),
    "reglas10am_04_network": (lambda: regla(2), 1080, 1350),
    "reglas10am_05_cierre": (cierre, 1080, 1350),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
