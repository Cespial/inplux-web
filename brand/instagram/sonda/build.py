"""Anuncio de Instagram «INPLUX, partner oficial de SONDA» (sonda.com).

Gramática del anuncio de Sudáfrica (../sudafrica/build.py: titular en dos tonos, píldoras, micro, wordmark,
INPLUX.CO abajo) con la estatuaria en trama de la parrilla romana (manos de ../dia-d-reglas/trama/).
Solo Rethink Sans y tokens v5. render.py pasa cada .html a PNG/JPG.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("za", AQUI.parent / "sudafrica/build.py")
za = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(za)
head, marcas_borde, MARCA = za.head, za.marcas_borde, za.MARCA
BLACK, IVORY, MUTED, DIM, TEAL, LINE = za.BLACK, za.IVORY, za.MUTED, za.DIM, za.TEAL, za.LINE

GRANO = '<div class="grano"></div>'


def trama(img, top, ancho=1240, izq=-80, opacidad=.55):
    return (f'<img src="trama/{img}" style="position:absolute;left:{izq}px;top:{top}px;width:{ancho}px;opacity:{opacidad}">')


def sello(escala=1.0):
    """Nodo INPLUX × píldora SONDA, unidos por un filete con punto teal al centro."""
    return f"""
<div style="display:flex;align-items:center;gap:0;transform:scale({escala});transform-origin:left center">
  <div class="nodo">{MARCA.format(s=62)}</div>
  <div style="position:relative;width:120px;height:1.5px;background:{LINE}">
    <i style="position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px;border-radius:50%;background:{TEAL};
      box-shadow:0 0 0 8px rgba(0,215,202,.12)"></i></div>
  <div class="pill oscura" style="padding:30px 44px"><img src="assets/sonda-white.png" style="height:44px;display:block"></div>
</div>"""


def portada():
    return head(1080, 1350) + f'<div class="velo" style="background:{BLACK}"></div>' + trama("manos.png", 760) + GRANO + f"""
<div class="velo" style="background:linear-gradient(180deg,{BLACK} 52%,rgba(12,12,11,0) 72%,rgba(12,12,11,.35) 100%)"></div>
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:100px"><span class="gris">INPLUX ahora es</span><br>partner oficial<br>de SONDA.</h1>
  <div style="margin-top:72px">{sello()}</div>
</div>{marcas_borde(84, arriba="→ Alianza")}
<div class="micro" style="position:absolute;right:84px;bottom:80px">Desliza →</div></div></body></html>"""


FILAS = [
    ("Implementamos", "Llevamos la IA a la operación: del diagnóstico al uso diario."),
    ("Desarrollamos a la medida", "Software propio, en producción en Colombia, Miami y Sudáfrica."),
    ("Capacitamos", "Talleres, laboratorios y cursos para que los equipos la usen bien."),
]


def lista():
    filas = "".join(f"""
  <div style="display:grid;grid-template-columns:76px 1fr;gap:0 10px;padding:32px 0;border-top:1.5px solid {LINE}">
    <div style="font-size:22px;color:{TEAL};padding-top:14px;letter-spacing:.08em">0{i}</div>
    <div><div style="font-size:46px;font-weight:500;letter-spacing:-.015em">{t}</div>
    <div style="font-size:27px;line-height:1.38;color:{MUTED};margin-top:10px;max-width:800px">{d}</div></div>
  </div>""" for i, (t, d) in enumerate(FILAS, 1))
    velo = f"radial-gradient(120% 80% at 80% 0%,rgba(0,215,202,.10),transparent 60%),{BLACK}"
    return head(1080, 1350) + f'<div class="velo" style="background:{velo}"></div>' + GRANO + f"""
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:76px"><span class="gris">Lo que hacemos,</span><br>ahora junto a SONDA.</h1>
  <p style="margin:34px 0 50px;font-size:28px;line-height:1.4;color:{MUTED};max-width:860px">SONDA lleva más de 50 años en
    transformación digital en América Latina. Nosotros sumamos inteligencia artificial aplicada.</p>
  {filas}
  <div style="border-top:1.5px solid {LINE}"></div>
</div>{marcas_borde(84, arriba="→ Qué sumamos")}</div></body></html>"""


def cierre():
    return head(1080, 1350) + f'<div class="velo" style="background:{BLACK}"></div>' + trama("toque.png", 820, ancho=1200, izq=-60) + GRANO + f"""
<div class="velo" style="background:linear-gradient(180deg,{BLACK} 50%,rgba(12,12,11,0) 70%)"></div>
<div class="capa" style="padding:150px 84px 0">
  <h1 class="titular" style="font-size:92px"><span class="gris">¿Tu organización</span><br>necesita IA<br>que funcione?</h1>
  <p style="margin-top:40px;font-size:32px;line-height:1.38;color:{IVORY};max-width:860px;opacity:.88">Hablemos. Ahora llegamos más lejos.</p>
  <div style="margin-top:52px"><span class="pill clara" style="padding:20px 40px;font-size:34px">{MARCA.replace('#fff', BLACK).replace('#15dcc4', '#007a72').format(s=40)}inplux.co</span></div>
</div>{marcas_borde(84, arriba="→ Hablemos")}</div></body></html>"""


def historia():
    return head(1080, 1920) + f'<div class="velo" style="background:{BLACK}"></div>' + trama("manos.png", 1180, ancho=1300, izq=-110) + GRANO + f"""
<div class="velo" style="background:linear-gradient(180deg,{BLACK} 58%,rgba(12,12,11,0) 74%)"></div>
<div class="capa" style="padding:330px 84px 0">
  <div class="micro">→ Alianza</div>
  <h1 class="titular" style="font-size:108px;margin-top:40px"><span class="gris">INPLUX ahora es</span><br>partner oficial<br>de SONDA.</h1>
  <div style="margin-top:90px">{sello()}</div>
</div>
<img class="wordmark" src="assets/wordmark-white.svg" style="position:absolute;top:200px;left:84px;height:28px">
<div class="micro" style="position:absolute;left:0;right:0;bottom:110px;text-align:center">inplux.co</div>
</div></body></html>"""


PIEZAS = {
    "sonda_01_portada": (portada, 1080, 1350),
    "sonda_02_que_sumamos": (lista, 1080, 1350),
    "sonda_03_cierre": (cierre, 1080, 1350),
    "historia_sonda": (historia, 1080, 1920),
}

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
        print("html", nombre)
