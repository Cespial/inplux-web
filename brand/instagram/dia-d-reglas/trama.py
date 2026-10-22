"""Convierte los fondos de mj-bn/ en trama de puntos (dithering ordenado), como la estatuaria de Croma.

Fuente: mj-bn/ a resolución completa de Midjourney (1968×2464), para que el punto quede fino al reducir.
Salida: PNG transparente con puntos marfil. La opacidad y el desvanecido los pone el HTML.
uso: python3 trama.py [celda=3]
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageFilter

AQUI = Path(__file__).parent
CELDA = int(sys.argv[1]) if len(sys.argv) > 1 else 3
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0

for src in sorted((AQUI / "mj-bn").glob("*.jpg")):
    im = Image.open(src).convert("L")
    w, h = im.size
    peq = im.resize((w // CELDA, h // CELDA), Image.LANCZOS)
    peq = ImageOps.autocontrast(peq, cutoff=1).filter(ImageFilter.UnsharpMask(2, 120, 2))
    a = np.asarray(peq, dtype=float) / 255.0
    a = np.clip((a - 0.14) / 0.86, 0, 1) ** 1.1    # negro limpio: sin rejilla de puntos en el fondo
    ty, tx = a.shape
    umbral = np.tile(BAYER, (ty // 4 + 1, tx // 4 + 1))[:ty, :tx]
    puntos = (a > umbral).astype(np.uint8) * 255
    alfa = Image.fromarray(puntos).resize((tx * CELDA, ty * CELDA), Image.NEAREST)
    # punto un poco más chico que la celda: se lee como trama y no como bloque
    if CELDA >= 3:
        rej = np.ones((ty * CELDA, tx * CELDA), dtype=np.uint8) * 255
        rej[CELDA - 1::CELDA, :] = 0; rej[:, CELDA - 1::CELDA] = 0
        alfa = Image.fromarray(np.minimum(np.asarray(alfa), rej))
    out = Image.new("RGBA", alfa.size, (246, 242, 236, 0)); out.putalpha(alfa)
    out = out.crop(alfa.getbbox())  # solo la figura: el HTML la coloca por su caja
    out.save(AQUI / "trama" / (src.stem + ".png"), optimize=True)
    print("trama", src.stem, out.size)
