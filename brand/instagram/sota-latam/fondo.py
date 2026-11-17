"""Fondo del cartel: el Golden Gate entre la niebla (arriba) se desvanece hacia América Latina vista de noche (abajo).

- Puente: fotos/golden-gate-niebla.jpg = «Golden Gate Bridge tower in fog (July 2022)», Wikimedia Commons, CC0.
- América Latina: fotos/tierra-noche.jpeg = imagen propia de la marca (Midjourney, la del banner de LinkedIn «Latinoamérica»).
Dos salidas de 1080 × 1350: trama/fondo_claro.jpg (blanco institucional) y trama/fondo_noche.jpg (tinta).
uso: python3 fondo.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageFilter

AQUI = Path(__file__).parent
W, H = 1080, 1350


def rampa(v, a, b):
    return np.clip((v - a) / (b - a), 0, 1)


def suave(t):
    return t * t * (3 - 2 * t)


def puente(k=.30, cx=818, techo=286):
    """Torre a la derecha. Devuelve en el lienzo cuánta «estructura» hay en cada punto (0 = niebla, 1 = acero)."""
    im = ImageOps.exif_transpose(Image.open(AQUI / "fotos/golden-gate-niebla.jpg")).convert("RGB")
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    rgb = np.asarray(im, dtype=float) / 255
    rojo = np.clip((rgb[..., 0] - rgb[..., 2]) * 2.4, 0, 1)          # el rojo de la torre contra la niebla gris azulada
    lum = rgb.mean(-1)
    niebla = np.percentile(lum, 70)
    oscuro = np.clip((niebla - lum) / niebla * 1.5, 0, 1)             # todo lo más oscuro que la niebla (cables, farolas)
    est = np.clip(np.maximum(rojo * .95, oscuro), 0, 1)
    lienzo = np.zeros((H, W))
    x0, y0 = round(cx - 1960 * k), round(techo - 1780 * k)
    ys, xs = np.mgrid[0:H, 0:W]
    sy, sx = ys - y0, xs - x0
    ok = (sy >= 0) & (sy < est.shape[0]) & (sx >= 0) & (sx < est.shape[1])
    lienzo[ok] = est[sy[ok], sx[ok]]
    return lienzo


def bruma(semilla=4):
    """Ruido suave de baja frecuencia (0–1) para que el borde de la niebla no sea una línea perfecta."""
    r = np.random.default_rng(semilla).random((H // 30 + 2, W // 30 + 2))
    im = Image.fromarray((r * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    a = np.asarray(im, dtype=float)
    return (a - a.min()) / (a.max() - a.min())


def tierra(escala=.56, cx=560, cima=915, velo=100):
    """Arco de la Tierra en la base. Devuelve luminancia 0–1 y cuánto se ve el planeta en cada punto:
    0 fuera del limbo y junto a él (lo tapa la niebla), 1 planeta pleno «velo» px más adentro."""
    im = Image.open(AQUI / "fotos/tierra-noche.jpeg").convert("L")
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    g = np.asarray(im, dtype=float) / 255
    ox, oy, r = 1960 * escala, 1521 * escala, 1408 * escala      # círculo del limbo medido en la imagen original
    x0, y0 = round(cx - 1650 * escala), round(cima - 112 * escala)
    lienzo = np.zeros((H, W))
    ys, xs = np.mgrid[0:H, 0:W]
    sy, sx = ys - y0, xs - x0
    ok = (sy >= 0) & (sy < g.shape[0]) & (sx >= 0) & (sx < g.shape[1])
    lienzo[ok] = g[sy[ok], sx[ok]]
    hondo = r - np.hypot(xs - (x0 + ox), ys - (y0 + oy))          # px hacia adentro desde el limbo
    ver = suave(rampa(hondo + (bruma() - .5) * 46, 4, velo))
    return lienzo, ver


def guardar(a, nombre):
    Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(AQUI / "trama" / nombre, quality=93, subsampling=0)
    print("fondo", nombre)


def componer(papel, acero, espacio, nombre, fuerza=1.0):
    ys, xs = np.mgrid[0:H, 0:W]
    est = puente()
    # el puente se queda a la derecha; arriba sale de la niebla y abajo se disuelve en la misma niebla que cubre el planeta
    pres = suave(rampa(xs, 500, 690)) * suave(rampa(ys, 215, 330)) * (1 - suave(rampa(ys, 850, 965)))
    t = (est * pres * fuerza)[..., None]
    img = np.array(papel)[None, None] * (1 - t) + np.array(acero)[None, None] * t
    g, ver = tierra()
    luces = (np.clip(g * 1.55, 0, 1) ** .9)[..., None]
    planeta = np.array(espacio)[None, None] + luces * (np.array([.985, .98, .96])[None, None] - np.array(espacio)[None, None])
    img = img * (1 - ver[..., None]) + planeta * ver[..., None]
    guardar(img, nombre)


def claro():
    """Blanco institucional: la niebla es el blanco del papel y el planeta asoma abajo, de noche, con sus luces."""
    componer((1, 1, 1), (.33, .39, .43), (.045, .047, .05), "fondo_claro.jpg")


def noche():
    """Tinta: el puente emerge claro arriba y el planeta ocupa la base."""
    componer((.047, .047, .043), (.60, .61, .59), (.047, .047, .043), "fondo_noche.jpg", fuerza=.9)


def capas(papel, acero, espacio, sufijo, fuerza=1.0, cima=962):
    """Para la versión con «LATAM» gigante: el planeta va en el fondo y el puente en una capa aparte con transparencia,
    de modo que la palabra queda ENTRE los dos (detrás de la torre, delante del papel)."""
    ys, xs = np.mgrid[0:H, 0:W]
    g, ver = tierra(cima=cima)
    luces = (np.clip(g * 1.55, 0, 1) ** .9)[..., None]
    planeta = np.array(espacio)[None, None] + luces * (np.array([.985, .98, .96])[None, None] - np.array(espacio)[None, None])
    img = np.array(papel)[None, None] * (1 - ver[..., None]) + planeta * ver[..., None]
    guardar(img, f"planeta_{sufijo}.jpg")
    est = puente()
    pres = suave(rampa(xs, 500, 690)) * suave(rampa(ys, 215, 330)) * (1 - suave(rampa(ys, cima - 80, cima + 30)))
    alfa = np.clip(est * pres * fuerza, 0, 1)
    rgba = np.dstack([np.broadcast_to(np.array(acero)[None, None], (H, W, 3)), alfa])
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(AQUI / "trama" / f"puente_{sufijo}.png", optimize=True)
    print("capa", f"puente_{sufijo}.png")


if __name__ == "__main__":
    claro(); noche()
    capas((1, 1, 1), (.33, .39, .43), (.045, .047, .05), "claro")
    capas((.047, .047, .043), (.60, .61, .59), (.047, .047, .043), "noche", fuerza=.9)
