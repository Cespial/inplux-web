"""Prepara las imágenes del cartel «The State of the Art of AI in LATAM» (10-dic-2026, San Francisco).

1. Figuras recortadas (recortar.swift, máscara de primer plano de Vision) → B/N, cabezas al mismo tamaño y a la misma altura.
2. Avatares circulares para la versión editorial.
3. Mapa de América Latina en puntos (soon-sf/reel/mapa.py, Natural Earth 1:50m), con Colombia aparte para pintarla en teal.

La foto de Santiago mide 200 px: se amplía ×1,9 y se le da grano igual que a las otras para que no desentone.
Pedir una foto de al menos 800 px antes de publicar.
uso: python3 prep.py
"""
import importlib.util
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageDraw

AQUI = Path(__file__).parent
# cabeza en la foto original: (x del centro, y de la coronilla, y del mentón)
CABEZA = {"santiago": (95, 3, 83), "cristian": (435, 126, 545), "jaime": (432, 100, 520)}


def gris(n):
    im = Image.open(AQUI / "recortes" / f"{n}.png").convert("RGBA")
    alfa = im.getchannel("A")
    g = ImageOps.autocontrast(ImageOps.grayscale(im.convert("RGB")), cutoff=(1, 1), mask=alfa)
    return g, alfa


def grano(g, fuerza, semilla):
    a = np.asarray(g, dtype=float) + np.random.default_rng(semilla).normal(0, fuerza, (g.height, g.width))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def figura(n, ancho=290, alto=420, cabeza=150, techo=30, nombre="fig"):
    g, alfa = gris(n)
    cx, y0, y1 = CABEZA[n]
    k = cabeza / (y1 - y0)
    tam = (round(g.width * k), round(g.height * k))
    g, alfa = g.resize(tam, Image.LANCZOS), alfa.resize(tam, Image.LANCZOS)
    if k > 1:
        g = g.filter(ImageFilter.UnsharpMask(1.6, 90, 2))
        # quita el borde claro del recorte ampliado, pero SOLO del mentón hacia abajo (camisa contra el follaje):
        # en la cabeza ese mismo ajuste se comía el contorno del pelo y Santiago quedaba «calvo» (17-nov)
        fino = alfa.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.3))
        fila = np.arange(alfa.height)[:, None]
        peso = np.clip((fila - y1 * k) / 26, 0, 1)                      # 0 en la cabeza, 1 desde 26 px bajo el mentón
        alfa = Image.fromarray((np.asarray(alfa) * (1 - peso) + np.asarray(fino) * peso).astype(np.uint8))
    g = grano(g, 7, 3)
    out = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
    capa = Image.merge("RGBA", (g, g, g, alfa))
    out.paste(capa, (round(ancho / 2 - cx * k), round(techo - y0 * k)), capa)
    out.save(AQUI / "recortes" / f"{nombre}_{n}.png", optimize=True)
    print("figura", n, f"escala {k:.2f}")


def avatar(n, lado=112, fondo=(217, 211, 200)):
    g, alfa = gris(n)
    cx, y0, y1 = CABEZA[n]
    r = (y1 - y0) * .78
    cy = (y0 + y1) / 2 + (y1 - y0) * .06
    caja = tuple(round(v) for v in (cx - r, cy - r, cx + r, cy + r))
    m = round(r)                                  # margen: la caja puede salirse de la foto (Santiago toca el borde de arriba)
    lienzo = Image.new("RGB", (g.width + 2 * m, g.height + 2 * m), fondo)
    lienzo.paste(Image.merge("RGB", (g, g, g)), (m, m), alfa)
    rec = lienzo.crop(tuple(v + m for v in caja)).resize((lado * 2, lado * 2), Image.LANCZOS)   # 2× para que el círculo salga limpio
    masc = Image.new("L", (lado * 2, lado * 2), 0)
    ImageDraw.Draw(masc).ellipse((0, 0, lado * 2 - 1, lado * 2 - 1), fill=255)
    rec.putalpha(masc)
    rec.save(AQUI / "recortes" / f"av_{n}.png", optimize=True)
    print("avatar", n)


def mapa(k=6.4, celda=8, radio=2.5, sup=4):
    spec = importlib.util.spec_from_file_location("mapa", AQUI.parent / "soon-sf/reel/mapa.py")
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    m.K = k
    ancho, alto = int(86 * m.COS * k) + celda * 2, int(90 * k) + celda * 2
    x, y, cod = m.puntos(0, 0, celda, ancho, alto)
    for nombre, sel in (("mapa_base", cod != "COL"), ("mapa_col", cod == "COL")):
        im = Image.new("L", (ancho * sup, alto * sup), 0)
        d = ImageDraw.Draw(im)
        for a, b in zip(x[sel] + celda / 2, y[sel] + celda / 2):
            d.ellipse(((a - radio) * sup, (b - radio) * sup, (a + radio) * sup, (b + radio) * sup), fill=255)
        im = im.resize((ancho, alto), Image.LANCZOS)
        out = Image.new("RGBA", (ancho, alto), (255, 255, 255, 0)); out.putalpha(im)
        out.save(AQUI / "trama" / f"{nombre}.png", optimize=True)
    print("mapa", ancho, alto, len(x), "puntos;", int((cod == "COL").sum()), "de Colombia")


def logo_cancilleria():
    """Logo «Cancillería» tal como lo usa el sitio del Consulado (sanfrancisco.consulado.gov.co, visto el 17-nov-2026).
    color: el original recortado a su caja, sin tocar. blanco: versión en negativo para fondo oscuro
    (escudo y palabra en blanco, la barra tricolor conserva sus colores)."""
    im = Image.open(AQUI / "assets/cancilleria-original.png").convert("RGBA")
    a = np.asarray(im).copy()
    ys, xs = np.nonzero(a[..., 3] > 8)
    caja = (xs.min() - 2, ys.min() - 2, xs.max() + 3, ys.max() + 3)
    im.crop(caja).save(AQUI / "assets/cancilleria-color.png", optimize=True)
    vacias = [y for y in range(300, int(ys.max())) if not (a[y, :, 3] > 8).any()]   # hueco entre la palabra y la barra tricolor
    corte = max(vacias)
    a[:corte, :, :3] = 255
    Image.fromarray(a).crop(caja).save(AQUI / "assets/cancilleria-blanco.png", optimize=True)
    print("logo cancillería", caja, "barra desde fila", corte)


def logo_consulado():
    """Logo propio del Consulado (escudo a color + «Consulado de Colombia en San Francisco» + barra tricolor).
    PROVISIONAL: es una captura de su publicación de Instagram del 18-oct-2026 (@consulcolsfo, «Consulados móviles»),
    986 px de ancho y con compresión. Sirve para la maqueta; para publicar hay que pedirles el archivo oficial.
    Solo se limpia el fondo (casi blanco → transparente) y se recorta a su caja; no se redibuja nada."""
    im = Image.open(AQUI / "assets/consulado-sf-captura.png").convert("RGB")
    a = np.asarray(im, dtype=float)
    fondo = np.median(a[:12].reshape(-1, 3), 0)                       # el blanco de la publicación no es 255 exacto
    dist = np.abs(a - fondo).max(-1)
    alfa = np.clip((dist - 6) / 26, 0, 1)
    ys, xs = np.nonzero(alfa > .5)
    caja = (max(xs.min() - 6, 0), max(ys.min() - 6, 0), xs.max() + 7, ys.max() + 7)
    # quita el velo del fondo: color = (pixel − fondo·(1−α)) / α
    al = np.maximum(alfa, 1e-3)[..., None]
    color = np.clip((a - 255 * (1 - al) * (fondo / 255)) / al, 0, 255)
    out = Image.fromarray(np.dstack([color, alfa * 255]).astype(np.uint8), "RGBA").crop(caja)
    out.save(AQUI / "assets/consulado-sf.png", optimize=True)
    print("logo consulado", out.size)


if __name__ == "__main__":
    logo_cancilleria()
    logo_consulado()
    for n in CABEZA:
        figura(n, ancho=380, alto=440, cabeza=165, techo=8, nombre="pie")
    for n in CABEZA:
        figura(n); avatar(n)
    mapa()
