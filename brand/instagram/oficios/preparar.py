"""Stills → nubes de puntos de «Tres oficios» (tmp/web/formas/*.bin).

Registro de 9 bytes: int16 x, y, z · uint8 tamaño (0,1 px) · uint8 objeto (teal) · uint8 a (golpe de llegada / grada, 255 = nunca).
La trama es la de Panteón (Bayer 4×4, punto fijo): se importan recorte, curva, nube y logo de ../panteon/preparar.py.

    python3 preparar.py          # todas las formas + info.json
    python3 preparar.py hoja     # además tmp/formas.jpg con una miniatura de cada forma
"""
import importlib.util, json, math, sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

D = Path(__file__).parent
_s = importlib.util.spec_from_file_location("panteon_preparar", D.parent / "panteon/preparar.py")
P = importlib.util.module_from_spec(_s); sys.path.insert(0, str(D.parent / "panteon")); _s.loader.exec_module(P)
recorte, curva, nube, W, H = P.recorte, P.curva, P.nube, P.W, P.H
OUT = D / "tmp/web/formas"; OUT.mkdir(parents=True, exist_ok=True)
MJ, PR = Path.home() / "inplux-triptico-inmerxia/assets/mj", D.parent / "parrilla-romana/mj-bn"
FIG = {"ingeniero": MJ / "arquitecto.jpg", "escriba": PR / "escriba.jpg", "orador": MJ / "orador.jpg"}
ACUEDUCTO = MJ / "acueducto.jpg"
# primer plano (x0, y0, ancho) en px del original 1968×2464; alto = ancho·16/9
CARA = {"ingeniero": (520, 220, 800), "escriba": (600, 110, 800), "orador": (520, 260, 820)}
ARCO1 = (0, 330, 640)
GANANCIA = {"ingeniero": 1.3, "escriba": 1.35, "orador": 1.3, "acueducto": 1.6, "arco1": 1.3}
PILAS = [300, 570, 755, 905, 1050, 1200, 1320]  # x de las pilas en el original: 8 grupos de arcos (perspectiva)
ACU_TOP = 110 
ANF = dict(cy=1350, r0=300, paso=125, k=0.62)  # cávea: centro de la orquesta, radio interior, ancho de grada, achatamiento
                                   # y del acueducto colocado (ancho 1080 → alto 1352)


def guardar(nombre, cx, cy, z, tam, ob, a=None):
    r = np.zeros(len(cx), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1"), ("a", "u1")])
    r["x"] = np.round(cx); r["y"] = np.round(cy); r["z"] = np.round(z)
    r["s"] = np.clip(np.round(tam * 10), 0, 255); r["o"] = ob; r["a"] = 0 if a is None else a
    r = r[np.random.default_rng(7).permutation(len(r))]
    (OUT / f"{nombre}.bin").write_bytes(r.tobytes()); return len(r)


def plano(im, e, x0, y0):
    """Coloca una imagen L (ya 1080×1920 o cualquiera) escalada e en un lienzo negro 1080×1920."""
    l = Image.new("L", (W, H), 0); l.paste(im.resize((round(im.width * e), round(im.height * e)), Image.LANCZOS), (round(x0), round(y0))); return l


def cara(f, caja, g):
    x0, y0, w = caja; h = round(w * 16 / 9)
    from PIL import ImageOps
    c = ImageOps.grayscale(Image.open(f)).crop((x0, y0, x0 + w, y0 + h)).resize((W, H), Image.LANCZOS)
    return nube(np.clip(curva(c) * g, 0, 1))


def acueducto():
    from PIL import ImageOps
    im = ImageOps.grayscale(Image.open(ACUEDUCTO)); e = W / im.width
    a = np.clip(curva(plano(im, e, 0, ACU_TOP)) * GANANCIA["acueducto"], 0, 1)
    cx, cy, z, tam, _ = nube(a)
    px = cx + W / 2; py = H / 2 - cy
    xo = px / e                                         # x en el original
    grupo = np.searchsorted(PILAS, xo).astype(np.uint8)  # 0–7
    # canal: los puntos de la hilada superior (≤ 34 px bajo el borde de arriba de cada columna)
    col = (px // 6).astype(int); techo = np.full(col.max() + 1, 1e9)
    np.minimum.at(techo, col, py)
    ob = ((py - techo[col]) < 34).astype(np.uint8)
    return cx, cy, z, tam, ob, grupo


def anfiteatro():
    """Cávea semicircular procedural (8 gradas, de abajo arriba) + el orador al frente, sin gradas detrás de él."""
    cel = 6; gh, gw = H // cel, W // cel
    ys, xs = np.mgrid[0:gh, 0:gw]; px = xs * cel + cel / 2; py = ys * cel + cel / 2
    cx0, cy0, k, r0, paso = W / 2, ANF["cy"], ANF["k"], ANF["r0"], ANF["paso"]
    rx = np.hypot((px - cx0), (py - cy0) / k)
    t = (rx - r0) / paso; grada = np.floor(t).astype(int); fr = t - grada
    ang = np.degrees(np.arctan2(cy0 - py, px - cx0))
    pasillo = (np.abs(((ang - 18) % 36) - 18) < 1.2 + 0.5 * (grada < 3))
    dentro = (grada >= 0) & (grada < 8) & (py < cy0 + 40) & ~pasillo & (fr > 0.12)
    lum = np.where(fr < 0.34, 0.92, 0.42 + 0.25 * (1 - fr))
    lum = lum * (0.82 + 0.18 * np.cos(np.radians(ang - 90))) * (1 - 0.03 * grada)
    # orador al frente
    o = recorte(FIG["orador"]); e = 0.38
    lo = plano(o, e, (W - W * e) / 2, 1440 - H * e)
    a = np.clip(curva(lo) * 1.45, 0, 1)
    sil = np.asarray(Image.fromarray(((a > 0.08) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(25)), np.float32) / 255
    silg = sil[:gh * cel, :gw * cel].reshape(gh, cel, gw, cel).max((1, 3)) > 0.5
    thr = np.tile(P.BAYER, (gh // 4 + 1, gw // 4 + 1))[:gh, :gw]
    m = dentro & (lum > thr) & ~silg
    gx, gy, g = px[m], py[m], grada[m]
    z = -g * 40.0
    ox, oy, oz, ot, _ = nube(a)
    cx = np.concatenate([gx - W / 2, ox]); cy = np.concatenate([H / 2 - gy, oy]); zz = np.concatenate([z, oz * 0.3 + 80])
    tam = np.full(len(cx), cel * P.PUNTO); ob = np.concatenate([np.ones(len(gx), np.uint8), np.zeros(len(ox), np.uint8)])
    aa = np.concatenate([g.astype(np.uint8), np.full(len(ox), 255, np.uint8)])
    return cx, cy, zz, tam, ob, aa


VENTANAS = [(90 + c * 480, 560 + f * 290, 420, 262) for f in range(3) for c in range(2)]  # x, y, w, h (16:10)


def fachada():
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    d.polygon([(40, 470), (540, 260), (1040, 470)], fill=150)            # frontón
    d.polygon([(120, 452), (540, 300), (960, 452)], fill=70)             # tímpano
    d.rectangle([30, 470, 1050, 520], fill=215)                          # cornisa
    d.rectangle([60, 520, 1020, 1420], fill=110)                         # muro
    for x in [52, 517, 982]: d.rectangle([x, 520, x + 46, 1420], fill=205)  # pilastras
    for x, y, w, h in VENTANAS: d.rectangle([x - 14, y - 14, x + w + 14, y + h + 14], fill=235); d.rectangle([x, y, x + w, y + h], fill=0)
    for i, y in enumerate([1420, 1452, 1484]): d.rectangle([40 - i * 18, y, 1040 + i * 18, y + 26], fill=195 - i * 22)  # gradas
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    a = np.asarray(im, np.float32) / 255
    return nube(a)


BASE = 1240  # y del borde superior de los pedestales del friso


def friso3():
    """Ingeniero · escriba · orador en tres pedestales, tramados como una sola imagen."""
    l = Image.new("L", (W, H), 0); d = ImageDraw.Draw(l)
    caja = {"ingeniero": (300, 200, 1500, 2464), "escriba": (300, 300, 1700, 2464), "orador": (60, 200, 1700, 2464)}
    from PIL import ImageOps
    for k, (n, f) in enumerate(FIG.items()):
        im = ImageOps.grayscale(Image.open(f)).crop(caja[n]); e = 340 / im.width; h = round(im.height * e)
        im = im.resize((340, h), Image.LANCZOS); x = 15 + k * 355; y = BASE - h
        l.paste(im, (x, y))
        d.rectangle([x + 10, BASE, x + 330, BASE + 70], fill=170); d.rectangle([x - 5, BASE + 70, x + 345, BASE + 100], fill=210)
    return nube(np.clip(curva(l) * 1.5, 0, 1))


def hoja(info):
    nombres = list(info); cols = 6; w, h = 270, 480; filas = math.ceil(len(nombres) / cols)
    S = Image.new("RGB", (cols * w, filas * (h + 30)), (12, 12, 11)); d = ImageDraw.Draw(S)
    for i, n in enumerate(nombres):
        r = np.frombuffer((OUT / f"{n}.bin").read_bytes(), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1"), ("a", "u1")])
        im = Image.new("RGB", (W, H), (12, 12, 11)); dd = ImageDraw.Draw(im)
        for x, y, s, o, a in zip(r["x"], r["y"], r["s"], r["o"], r["a"]):
            px, py, rr = x + W / 2, H / 2 - y, s / 20
            col = (0, 215, 202) if o else ((246, 242, 236) if a in (0, 255) else (246 - a * 18, 242 - a * 10, 236))
            dd.ellipse([px - rr, py - rr, px + rr, py + rr], fill=col)
        S.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * (h + 30))); d.text(((i % cols) * w + 8, (i // cols) * (h + 30) + h + 6), f"{n} {info[n]}", fill=(200, 200, 200))
    S.save(D / "tmp/formas.jpg", quality=85); print("tmp/formas.jpg")


def main():
    info = {}
    info["arco1"] = guardar("arco1", *cara(ACUEDUCTO, ARCO1, GANANCIA["arco1"]))
    info["acueducto"] = guardar("acueducto", *acueducto())
    for n, f in FIG.items():
        info[n + "_cara"] = guardar(n + "_cara", *cara(f, CARA[n], GANANCIA[n]))
    e = 0.84  # escriba entero, abajo, mirando al plano que se dibuja arriba
    info["escriba"] = guardar("escriba", *nube(np.clip(curva(plano(recorte(FIG["escriba"]), e, (W - W * e) / 2 + 80, 800)) * 1.6, 0, 1)))
    info["fachada"] = guardar("fachada", *fachada())
    info["anfiteatro"] = guardar("anfiteatro", *anfiteatro())
    info["friso3"] = guardar("friso3", *friso3())
    info["logo"] = guardar("logo", *P.logo(860, 860))
    (OUT / "info.json").write_text(json.dumps(info)); print(info)
    if sys.argv[1:] == ["hoja"]: hoja(info)


if __name__ == "__main__":
    main()
