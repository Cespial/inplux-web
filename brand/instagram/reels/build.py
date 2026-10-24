"""Portadas 3:4 y rótulos para los reels «pantalla + cara» (GUIONES.md, 24-oct-2026).

- portada(n, rotulo, cifra, sub): 1080 × 1440 para el grid. Deja la mitad inferior libre para la cara de Cristian
  (la foto real se pega en CapCut o aquí cuando exista; hasta entonces un velo negro y el rótulo arriba).
- rotulo(rotulo, cifra): 1080 × 1920 con fondo transparente, para quemar en el primer segundo del reel en CapCut.
  Es nuestra versión de la píldora roja de @victorpay y del amarillo condensado de @10ampro: píldora marfil, cifra en teal.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("posic", AQUI.parent / "posicionamiento" / "build.py")
posic = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(posic)
BLACK, IVORY, MUTED, DIM, TEAL, MARCA, ALTO = posic.BLACK, posic.IVORY, posic.MUTED, posic.DIM, posic.TEAL, posic.MARCA, posic.ALTO
pieza = posic.pieza
LINE = "rgba(246,242,236,.16)"


def pildora(rotulo, cifra, tam=58, ancho=900):
    """Rótulo en dos bloques: la frase en píldora marfil, la cifra en teal sobre negro."""
    return f"""<div style="display:flex;flex-direction:column;align-items:flex-start;gap:14px;max-width:{ancho}px">
  <span style="display:inline-block;background:{IVORY};color:{BLACK};font-weight:600;font-size:{tam}px;line-height:1.08;letter-spacing:-.02em;
    padding:18px 30px;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6)">{rotulo}</span>
  <span style="display:inline-block;background:{BLACK};color:{TEAL};font-weight:600;font-size:{tam * 1.15:.0f}px;line-height:1.05;letter-spacing:-.03em;
    padding:16px 30px;border-radius:18px;border:1.5px solid {LINE}">{cifra}</span></div>"""


def portada(n, rotulo, cifra, sub):
    play = (f'<div style="position:absolute;right:84px;top:1040px;width:92px;height:92px;border-radius:50%;border:2px solid {IVORY};'
            f'display:flex;align-items:center;justify-content:center"><svg width="30" height="34" viewBox="0 0 30 34"><path d="M3 2l25 15L3 32z" fill="{IVORY}"/></svg></div>')
    cuerpo = f"""
<div style="position:absolute;left:0;top:640px;width:1080px;height:710px;background:linear-gradient(180deg,{BLACK},#161614)"></div>
<div class="micro" style="position:absolute;left:84px;top:1080px;color:{MUTED}">Aquí va la cara de Cristian · 40 % inferior</div>
<div class="micro" style="position:absolute;left:84px;top:190px;color:{TEAL}">Reel · pantalla + cara · {n:02d}</div>
<div style="position:absolute;left:84px;top:250px">{pildora(rotulo, cifra, 62, 912)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1140px;font-size:27px;max-width:760px">{sub}</p>{play}"""
    return pieza(cuerpo, "Cristian Espinal · CTO de INPLUX", claro=False, alto=ALTO)


def rotulo(rotulo_txt, cifra):
    """Lienzo 1080 × 1920 transparente; el rótulo ocupa la zona segura superior (debajo de los 250 px de interfaz)."""
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;background:transparent}}
body{{font-family:"Rethink Sans",sans-serif;-webkit-font-smoothing:antialiased}}</style></head><body>
<div style="position:absolute;left:60px;top:300px">{pildora(rotulo_txt, cifra, 64, 960)}</div>
<div style="position:absolute;left:60px;bottom:360px;display:flex;align-items:center;gap:12px">{MARCA.format(s=40, c="#fff")}
  <img src="assets/wordmark-white.svg" style="height:22px;display:block"></div></body></html>"""


REELS = [
    (1, "Conecté Claude al<br>Estatuto Tributario", "¿Tengo que declarar? · $69.719.000", "Art. 592 ET: 1.400 UVT de ingresos y 4.500 de patrimonio. Vigente."),
    (2, "Lo que nadie te contó del<br>impuesto al patrimonio 2026", "$3.770 M · empresas $10.475 M", "Tres cambios en tres meses: Decreto 1474, C-079 de 2026, Decreto 173."),
    (3, "Le pedí a Claude que leyera<br>2.660 laudos arbitrales", "5.447 documentos · 1985–2026", "Laudos: búsqueda y predicción con precedentes. Beta abierta."),
    (4, "Un municipio de 2,62 millones<br>de habitantes en una pantalla", "16 comunas · 349 barrios", "Gobia: TerriData, datos.gov.co, FUT y SECOP juntos. Demo pública."),
    (5, "Le pedí a la IA una norma<br>que no existe", "Respuesta: NO ENCONTRADA", "Kelsen verifica la cita antes de que la uses."),
    (6, "La finca se llevaba<br>en un cuaderno", "Cada cerdo desde el día del parto", "Porkia funciona sin conexión. Beta cerrada en Antioquia."),
]

PIEZAS = {}
for n, r, c, s in REELS:
    PIEZAS[f"portada_reel_{n:02d}"] = ((lambda r=r, c=c, s=s, n=n: portada(n, r, c, s)), 1080, ALTO)
    PIEZAS[f"rotulo_reel_{n:02d}"] = ((lambda r=r, c=c: rotulo(r, c)), 1080, 1920)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
    print(len(PIEZAS), "piezas escritas")
