"""Compone el símbolo INPLUX sobre las escenas de Midjourney (mj/originales) con homografía y un modo por
material, y recentra cada foto para que el símbolo caiga en el ancla (540, 1010) con ~292 px de ancho
(= 170 px de alto, como en los cortes). Midjourney nunca dibuja el logo: solo pone la superficie.

  python3 mj/componer.py          → out/escena_<nombre>.png (1080×1920) + out/fondo_medellin.png + hoja
"""
import json, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent))
from geometria import BARRAS, BW, BH, R, X0, Y0, X1, Y1, CENTROS  # noqa: E402

W, H = 1080, 1920
ANCLA = (540.0, 1010.0)
ANCHO_OBJ = 170 * (X1 - X0) / (Y1 - Y0)            # 291,4 px
SS = 2                                              # supermuestreo de la salida
OUT = AQUI.parent / "out"

IVORY, TEAL = (246, 242, 236), (21, 220, 196)
TINTA, TEAL_OSC = (20, 20, 20), (13, 125, 116)


# ------------------------------------------------------------------ geometría proyectiva
def homografia(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
    b = np.array(dst, float).ravel()
    h = np.linalg.solve(np.array(A, float), b)
    return np.append(h, 1).reshape(3, 3)


def aplicar(M, x, y):
    p = M @ np.array([x, y, 1.0])
    return p[:2] / p[2]


# ------------------------------------------------------------------ dibujo del símbolo en el plano local
def capas_simbolo(lw, lh, cx, cy, ancho, k):
    """Máscaras L (base, cima) del símbolo en un lienzo local de lw×lh unidades a k px/unidad.
    (cx, cy) centro y `ancho` en unidades del plano."""
    esc = ancho / (X1 - X0)
    ox, oy = cx - (X0 + X1) / 2 * esc, cy - (Y0 + Y1) / 2 * esc
    tam = (int(lw * k), int(lh * k))
    base, cima = Image.new("L", tam, 0), Image.new("L", tam, 0)
    for i, (bx, by) in enumerate(BARRAS):
        d = ImageDraw.Draw(cima if i == 2 else base)
        x0, y0 = (ox + bx * esc) * k, (oy + by * esc) * k
        d.rounded_rectangle([x0, y0, x0 + BW * esc * k, y0 + BH * esc * k], radius=R * esc * k, fill=255)
    return base, cima, esc, (ox, oy)


def contorno_lapiz(lw, lh, cx, cy, ancho, k, rng):
    """Boceto: contorno de las barras, horizontales guía y diagonal por los centros, en grafito."""
    esc = ancho / (X1 - X0)
    ox, oy = cx - (X0 + X1) / 2 * esc, cy - (Y0 + Y1) / 2 * esc
    tam = (int(lw * k), int(lh * k))
    trazo, teal = Image.new("L", tam, 0), Image.new("L", tam, 0)
    d = ImageDraw.Draw(trazo)
    P = lambda x, y: ((ox + x * esc) * k, (oy + y * esc) * k)  # noqa: E731
    g = max(1, int(.55 * esc * k))
    for yy in (21, 34, 39, 52, 57, 70):                 # guías finas, un poco más largas que la caja
        d.line([P(2, yy), P(98, yy)], fill=120, width=max(1, g // 2))
    for xx in (8, 29, 50, 92):
        d.line([P(xx, 14), P(xx, 77)], fill=120, width=max(1, g // 2))
    (ax, ay), (bx, by) = CENTROS[0], CENTROS[2]
    d.line([P(ax - 10, ay + 10 * 18 / 21), P(bx + 10, by - 10 * 18 / 21)], fill=170, width=max(1, g // 2))
    for i, (x, y) in enumerate(BARRAS):
        for rep in range(2):                            # dos pasadas desplazadas = trazo a mano
            j = rng.normal(0, .18, 2)
            x0, y0 = P(x + j[0], y + j[1]); x1, y1 = P(x + BW + j[0], y + BH + j[1])
            d.rounded_rectangle([x0, y0, x1, y1], radius=R * esc * k, outline=235, width=g)
        if i == 2:                                      # la superior, rellena con lápiz teal (rayado)
            dt = ImageDraw.Draw(teal)
            x0, y0 = P(x, y); x1, y1 = P(x + BW, y + BH)
            m = Image.new("L", tam, 0); ImageDraw.Draw(m).rounded_rectangle([x0, y0, x1, y1], radius=R * esc * k, fill=255)
            paso = max(3, int(1.1 * esc * k))
            for t in range(int(x0 - (y1 - y0)), int(x1), paso):
                dt.line([(t, y1), (t + (y1 - y0), y0)], fill=200, width=max(1, paso // 2))
            teal = Image.fromarray(np.minimum(np.asarray(teal), np.asarray(m)))
    return trazo, teal


# ------------------------------------------------------------------ composición
def componer(nombre, cfg, rng):
    foto = Image.open(AQUI / "originales" / cfg["img"]).convert("RGB")
    FW, FH = foto.size
    lw, lh = cfg["wh"]
    ancho = cfg["ancho"] * lw
    cx, cy = cfg["centro"][0] * lw, cfg["centro"][1] * lh
    Hm = homografia([(0, 0), (lw, 0), (lw, lh), (0, lh)], cfg["quad"])

    # tamaño y centro del símbolo proyectado (en la foto)
    esc = ancho / (X1 - X0)
    oy = cy - (Y0 + Y1) / 2 * esc
    ymed = oy + (Y0 + Y1) / 2 * esc
    pl, pr = aplicar(Hm, cx - ancho / 2, ymed), aplicar(Hm, cx + ancho / 2, ymed)
    c = aplicar(Hm, cx, cy)
    ancho_px = float(np.hypot(*(pr - pl)))

    # escala y desplazamiento: símbolo en el ancla, foto cubriendo todo el cuadro
    s = max(ANCHO_OBJ / ancho_px, W / FW, H / FH,
            ANCLA[0] / c[0], (W - ANCLA[0]) / (FW - c[0]), ANCLA[1] / (c[1] - cfg.get("ocultar_y", 0)), (H - ANCLA[1]) / (FH - c[1]))
    tx, ty = ANCLA[0] - c[0] * s, ANCLA[1] - c[1] * s
    S = np.array([[s, 0, tx], [0, s, ty], [0, 0, 1]])

    # fondo
    fondo = foto.transform((W * SS, H * SS), Image.AFFINE, (1 / (s * SS), 0, -tx / s, 0, 1 / (s * SS), -ty / s),
                           resample=Image.BICUBIC)

    # capas del símbolo en el plano local, proyectadas a la salida
    k = 2400 / max(lw, lh)                              # px por unidad local
    if cfg["modo"] == "lapiz":
        capas = contorno_lapiz(lw, lh, cx, cy, ancho, k, rng)
    else:
        capas = capas_simbolo(lw, lh, cx, cy, ancho, k)[:2]
    L = np.array([[k, 0, 0], [0, k, 0], [0, 0, 1]])
    F = np.diag([SS, SS, 1]) @ S @ Hm @ np.linalg.inv(L)          # lienzo local (px) → salida (px)
    Fi = np.linalg.inv(F); Fi = Fi / Fi[2, 2]
    coef = tuple(Fi.ravel()[:8])
    proy = [np.asarray(m.transform((W * SS, H * SS), Image.PERSPECTIVE, coef, resample=Image.BICUBIC),
                       float) / 255 for m in capas]

    img = np.asarray(fondo, float)
    lum = img.mean(2)
    suave = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(10 * SS)), float)
    fino = lum - np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2 * SS)), float)
    mask_tot = np.clip(proy[0] + proy[1], 0, 1)
    ref = np.median(suave[mask_tot > .5]) if (mask_tot > .5).any() else suave.mean()
    luz = np.clip(suave / max(ref, 1), .55, 1.5)[..., None]

    def mezcla(img, m, col, alfa=1.0):
        return img * (1 - m[..., None] * alfa) + col * m[..., None] * alfa

    modo = cfg["modo"]
    if modo == "tinta":                                  # impresión sobre superficie clara: multiplicar
        for m, col in zip(proy, (TINTA, TEAL_OSC)):
            mult = img * np.array(col, float) / 255
            img = mezcla(img, m, mult)
    elif modo in ("sticker", "serigrafia", "grabado"):
        if modo == "sticker":                           # troquel blanco + sombra corta
            ancha = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(60 * SS)), float)
            luz = np.clip(ancha / max(np.median(ancha[mask_tot > .5]), 1), .9, 1.1)[..., None]
            borde = Image.fromarray((mask_tot * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * (5 * SS) + 1))
            borde = np.asarray(borde, float) / 255
            sombra = np.asarray(Image.fromarray((borde * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3 * SS)), float) / 255
            sombra = np.roll(sombra, (2 * SS, 2 * SS), (0, 1))
            img = img * (1 - .45 * sombra[..., None])
            img = mezcla(img, borde, np.array((14, 14, 14), float) * luz)
            img = mezcla(img, proy[0], np.array(IVORY, float) * .97 * luz)
            img = mezcla(img, proy[1], np.array(TEAL, float) * .97 * luz)
        elif modo == "serigrafia":                       # tinta plastisol sobre algodón negro
            textura = np.clip(1 + fino[..., None] / 40, .7, 1.3)
            img = mezcla(img, proy[0], np.array(IVORY, float) * 1.0 * np.clip(luz, .8, 1.2) * textura, .95)
            img = mezcla(img, proy[1], np.array(TEAL, float) * 1.0 * np.clip(luz, .8, 1.2) * textura, .95)
        else:                                            # grabado sobre placa negra: marfil mate + bisel
            m = mask_tot
            arriba = np.clip(m - np.roll(m, (SS, SS), (0, 1)), 0, 1)
            abajo = np.clip(m - np.roll(m, (-SS, -SS), (0, 1)), 0, 1)
            img = mezcla(img, proy[0], np.array((214, 210, 202), float) * luz)
            img = mezcla(img, proy[1], np.array(TEAL, float) * .92 * luz)
            img = img * (1 - .35 * abajo[..., None]) + 255 * .25 * arriba[..., None]
    elif modo == "lapiz":                                # grafito y lápiz teal, multiplicados, con grano
        grano = rng.uniform(.55, 1.0, proy[0].shape)
        gris = np.array((48, 50, 54), float) / 255
        a = np.clip(proy[0] * 1.6, 0, 1) * grano * .95
        img = img * (1 - a[..., None] * (1 - gris))
        t = proy[1] * grano * .9
        img = img * (1 - t[..., None] * (1 - np.array(TEAL_OSC, float) / 255))

    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)
    out.save(OUT / f"escena_{nombre}.png")

    # verificación: centroide y ancho del símbolo compuesto
    mm = np.asarray(Image.fromarray((mask_tot * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) > 128
    ys, xs = np.nonzero(mm)
    return dict(escala=round(s, 3), centroide=(round(xs.mean(), 1), round(ys.mean(), 1)),
                ancho=int(xs.max() - xs.min() + 1), alto=int(ys.max() - ys.min() + 1))


def fondo_cubrir(cfg):
    foto = Image.open(AQUI / "originales" / cfg["img"]).convert("RGB")
    s = max(W / foto.width, H / foto.height)
    f = foto.resize((round(foto.width * s), round(foto.height * s)), Image.LANCZOS)
    x0, y0 = (f.width - W) // 2, (f.height - H) // 2
    f.crop((x0, y0, x0 + W, y0 + H)).save(OUT / "fondo_medellin.png")


if __name__ == "__main__":
    planos = json.loads((AQUI / "planos.json").read_text())
    rng = np.random.default_rng(7)
    hechos = []
    for nombre, cfg in planos.items():
        if nombre.startswith("_"):
            continue
        if cfg.get("fondo"):
            fondo_cubrir(cfg); continue
        r = componer(nombre, cfg, rng); hechos.append(nombre)
        print(nombre, r)
    tiles = [Image.open(OUT / f"escena_{n}.png").resize((270, 480)) for n in hechos]
    hoja = Image.new("RGB", (270 * len(tiles), 480))
    for i, t in enumerate(tiles):
        hoja.paste(t, (270 * i, 0))
    hoja.save(OUT / "hoja_escenas_mj.jpg", quality=90)
