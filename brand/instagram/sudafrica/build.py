"""Piezas de Instagram «Software de INPLUX en producción en Sudáfrica» (seagricolas.com).

Gramática de los posts de país de Croma (titular en dos tonos y diagrama
origen → nodo → destino → ramas) con la identidad viva de inplux.co: solo
Rethink Sans y los tokens de src/app/tokens/v5.css. Escribe un .html
autocontenido por pieza; render.py los pasa a PNG/JPG.
"""
from pathlib import Path

AQUI = Path(__file__).parent

# Tokens de inplux.co (src/app/tokens/v5.css, oct-2026)
BLACK, IVORY, MUTED, DIM, TEAL = "#0c0c0b", "#f6f2ec", "#a39d94", "#77726b", "#00d7ca"
LINE = "rgba(246,242,236,.16)"

# Símbolo Estratos (public/brand/logos/inplux-mark-white.svg)
MARCA = ('<svg viewBox="0 0 100 100" width="{s}" height="{s}"><rect x="8" y="57" width="42" height="13" rx="6.5" fill="#fff"/>'
         '<rect x="29" y="39" width="42" height="13" rx="6.5" fill="#fff"/><rect x="50" y="21" width="42" height="13" rx="6.5" fill="#15dcc4"/></svg>')

BANDERA_ZA = ('<svg viewBox="0 0 800 534" width="{w}" height="{h}" style="border-radius:4px;display:block">'
              '<rect width="800" height="534" fill="#001489"/><rect width="800" height="267" fill="#E03C31"/>'
              '<path d="M0,0H133.5L400,178H800V356H400L133.5,534H0Z" fill="#fff"/>'
              '<path d="M0,0H80L373.5,222.5H800V311.5H373.5L80,534H0Z" fill="#007749"/>'
              '<path d="M0,60V474L310,267Z" fill="#FFB81C"/><path d="M0,89V445L267,267Z" fill="#000"/></svg>')

RAMAS = ["Flota con operador", "Tarifas por hectárea", "Mapa de zonas", "Solicitudes en línea"]

GRANO = ("url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter>"
         "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")")


def head(w, h):
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{w}px;height:{h}px;overflow:hidden;background:{BLACK}}}
body{{font-family:"Rethink Sans",sans-serif;color:{IVORY};-webkit-font-smoothing:antialiased}}
.lienzo{{position:relative;width:{w}px;height:{h}px;overflow:hidden}}
.fondo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.velo{{position:absolute;inset:0}}
.grano{{position:absolute;inset:0;background-image:{GRANO};opacity:.07;mix-blend-mode:overlay}}
.capa{{position:absolute;inset:0;display:flex;flex-direction:column}}
.titular{{font-weight:500;letter-spacing:-.025em;line-height:1.02}}
.titular .gris{{color:{MUTED}}}
.micro{{font-size:19px;letter-spacing:.3em;text-transform:uppercase;color:{MUTED};font-weight:500}}
.wordmark{{height:24px;display:block}}
.pill{{display:inline-flex;align-items:center;gap:14px;border-radius:999px;white-space:nowrap}}
.pill.oscura{{background:rgba(246,242,236,.07);border:1.5px solid {LINE};padding:18px 34px;font-size:30px}}
.pill.clara{{background:{IVORY};color:{BLACK};padding:18px 36px 18px 22px;font-size:34px;font-weight:500;
  box-shadow:0 0 0 8px rgba(246,242,236,.06),0 20px 60px rgba(0,0,0,.5)}}
.pill.rama{{border:1.5px solid {LINE};background:rgba(12,12,11,.55);padding:12px 20px;font-size:20px;color:{IVORY}}}
.nodo{{width:124px;height:124px;border-radius:50%;background:{BLACK};border:1.5px solid {LINE};display:grid;place-items:center;
  box-shadow:0 0 0 14px rgba(0,215,202,.05),0 0 80px rgba(0,215,202,.18)}}
.tallo{{width:1.5px;background:{LINE};margin:0 auto}}
</style></head><body><div class="lienzo">"""


def fondo(img, velo):
    if not img:
        return f'<div class="velo" style="background:{velo}"></div><div class="grano"></div>'
    return f'<img class="fondo" src="mj/{img}"><div class="velo" style="background:{velo}"></div><div class="grano"></div>'


def diagrama(ancho, escala=1.0):
    """Origen → nodo INPLUX → destino con bandera → cuatro ramas (como el de Croma)."""
    # Ramas: curvas desde el centro del destino hasta el centro de cada píldora.
    n = len(RAMAS)
    ancho += 60  # la retícula de ramas desborda el tronco; curvas y píldoras comparten ancho
    xs = [ancho * (i + 0.5) / n for i in range(n)]
    curvas = "".join(
        f'<path d="M{ancho/2},0 C{ancho/2},48 {x},40 {x},88" fill="none" stroke="{LINE}" stroke-width="1.5"/>'
        f'<circle cx="{x}" cy="88" r="3" fill="{MUTED}"/>' for x in xs)
    return f"""
<div style="display:flex;flex-direction:column;align-items:center;transform:scale({escala});transform-origin:top center">
  <div class="pill oscura"><span style="color:{MUTED}">SE Holdings</span><span style="color:{DIM}">·</span>Johannesburgo</div>
  <div class="tallo" style="height:44px"></div>
  <div class="nodo">{MARCA.format(s=62)}</div>
  <div class="tallo" style="height:44px"></div>
  <div class="pill clara">{BANDERA_ZA.format(w=48, h=32)}seagricolas.com</div>
  <svg width="{ancho}" height="92" style="display:block;overflow:visible">{curvas}</svg>
  <div style="display:grid;grid-template-columns:repeat({n},1fr);width:{ancho}px;margin-top:6px">
    {''.join(f'<div style="display:flex;justify-content:center"><span class="pill rama">{r}</span></div>' for r in RAMAS)}
  </div>
</div>"""


def marcas_borde(pad, arriba="", abajo="INPLUX.CO"):
    return (f'<img class="wordmark" src="assets/wordmark-white.svg" style="position:absolute;top:{pad}px;right:{pad}px">'
            f'<div class="micro" style="position:absolute;left:{pad}px;bottom:{pad - 4}px">{abajo}</div>'
            + (f'<div class="micro" style="position:absolute;left:{pad}px;top:{pad}px">{arriba}</div>' if arriba else ""))


def portada():
    velo = (f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.9) 34%,rgba(12,12,11,.45) 70%,rgba(12,12,11,.6) 100%)")
    return head(1080, 1350) + fondo("69b6cfce_1.jpg", velo) + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:88px"><span class="gris">Software de INPLUX,</span><br>en producción<br>en Sudáfrica.</h1>
  <div style="margin-top:84px">{diagrama(860)}</div>
</div>{marcas_borde(84, arriba="→ Proyecto")}</div></body></html>"""


def producto():
    velo = f"radial-gradient(120% 80% at 80% 0%,rgba(0,215,202,.10),transparent 60%),{BLACK}"
    return head(1080, 1350) + fondo(None, velo) + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:66px"><span class="gris">Para SE Holdings:</span><br>renta de maquinaria agrícola,<br>con operador incluido.</h1>
  <div style="margin-top:64px;border-radius:18px;overflow:hidden;border:1.5px solid {LINE};box-shadow:0 40px 100px rgba(0,0,0,.6)">
    <div style="height:46px;background:#1c1c1a;display:flex;align-items:center;gap:9px;padding:0 18px">
      <i style="width:12px;height:12px;border-radius:50%;background:#3a3936"></i><i style="width:12px;height:12px;border-radius:50%;background:#3a3936"></i><i style="width:12px;height:12px;border-radius:50%;background:#3a3936"></i>
      <span style="margin-left:18px;flex:1;height:28px;border-radius:8px;background:#2a2927;color:{MUTED};font-size:16px;display:flex;align-items:center;padding:0 14px">seagricolas.com</span>
    </div>
    <img src="capturas/inicio.png" style="display:block;width:100%;height:600px;object-fit:cover;object-position:top">
  </div>
  <div style="margin-top:44px;display:flex;align-items:center;gap:26px">
    <div style="background:{IVORY};border-radius:14px;padding:14px 22px"><img src="assets/se-holdings-logo.png" style="height:52px;display:block"></div>
    <div style="font-size:24px;line-height:1.35;color:{MUTED}">Servicios Empresaviales Holdings<br><span style="color:{IVORY}">Johannesburgo, Sudáfrica</span></div>
  </div>
</div>{marcas_borde(84, arriba="→ El producto")}</div></body></html>"""


FILAS = [
    ("Flota con operador", "37 unidades en catálogo. Ninguna máquina sale sola: cada renta lleva su operador."),
    ("Tarifas por hectárea", "Precio por servicio en rand por hectárea, con el tractor incluido."),
    ("Mapa de zonas", "Dónde trabaja la flota, en un mapa abierto y sin cuentas de por medio."),
    ("Solicitudes en línea", "Se pide por mes y no por fecha, porque la siembra espera la primera lluvia."),
]


def lista():
    velo = f"linear-gradient(180deg,{BLACK} 55%,rgba(12,12,11,.86) 100%)"
    filas = "".join(f"""
  <div style="display:grid;grid-template-columns:76px 1fr;gap:0 10px;padding:30px 0;border-top:1.5px solid {LINE}">
    <div style="font-size:22px;color:{TEAL};padding-top:12px;letter-spacing:.08em">0{i}</div>
    <div><div style="font-size:42px;font-weight:500;letter-spacing:-.015em">{t}</div>
    <div style="font-size:25px;line-height:1.38;color:{MUTED};margin-top:10px;max-width:780px">{d}</div></div>
  </div>""" for i, (t, d) in enumerate(FILAS, 1))
    return head(1080, 1350) + fondo("69b6cfce_3.jpg", velo) + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:84px">Qué<br>construimos</h1>
  <div class="micro" style="margin:34px 0 46px;display:flex;align-items:center;gap:16px">{BANDERA_ZA.format(w=36, h=24)}Para el campo sudafricano</div>
  {filas}
  <div style="border-top:1.5px solid {LINE}"></div>
</div>{marcas_borde(84, arriba="→ El alcance")}</div></body></html>"""


def cierre():
    velo = f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.88) 34%,rgba(12,12,11,.25) 70%,rgba(12,12,11,.55) 100%)"
    return head(1080, 1350) + fondo("cbd86e0f_3.jpg", velo) + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:96px"><span class="gris">¿Tu operación</span><br>cruza fronteras?</h1>
  <p style="margin-top:40px;font-size:32px;line-height:1.38;color:{IVORY};max-width:860px;opacity:.88">Construimos software a la medida y lo dejamos en producción, dentro y fuera de Colombia.</p>
  <div style="margin-top:56px"><span class="pill clara" style="padding:20px 40px;font-size:34px">{MARCA.replace('#fff', BLACK).replace('#15dcc4', '#007a72').format(s=40)}inplux.co</span></div>
</div>{marcas_borde(84, arriba="→ Hablemos")}</div></body></html>"""


def historia():
    velo = (f"linear-gradient(180deg,{BLACK} 0%,rgba(12,12,11,.9) 38%,rgba(12,12,11,.4) 72%,rgba(12,12,11,.7) 100%)")
    return head(1080, 1920) + fondo("6becba7e_2.jpg", velo) + f"""
<div class="capa" style="padding:300px 84px 0">
  <h1 class="titular" style="font-size:100px"><span class="gris">Software de INPLUX,</span><br>en producción<br>en Sudáfrica.</h1>
  <div style="margin-top:110px">{diagrama(860)}</div>
</div>
<img class="wordmark" src="assets/wordmark-white.svg" style="position:absolute;top:200px;left:84px;height:28px">
<div class="micro" style="position:absolute;left:0;right:0;bottom:400px;text-align:center">Toca el enlace para ver la plataforma</div>
</div></body></html>"""


PIEZAS = {
    "sudafrica_01_portada": (portada, 1080, 1350),
    "sudafrica_02_producto": (producto, 1080, 1350),
    "sudafrica_03_alcance": (lista, 1080, 1350),
    "sudafrica_04_cierre": (cierre, 1080, 1350),
    "historia_sudafrica": (historia, 1080, 1920),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("escrito", nombre)
