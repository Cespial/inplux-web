"""Stills → nubes de puntos para escena.html.

Cada forma es un .bin en tmp/web/formas/: N registros de 8 bytes
  int16 x, int16 y (px de 1080×1920, origen al centro, y hacia arriba), int16 z (relieve), uint8 tamaño (0.1 px), uint8 objeto (0/1).
Receta de la trama (de ~/inplux-triptico-inmerxia/trama.py): autocontraste 1 %, UnsharpMask(2,120,2),
negro recortado en 0.14, gamma 1.1; punto de área proporcional a la luz en una celda de CELDA px.
"""
import json, sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps
sys.path.insert(0, str(Path(__file__).parent))
from figuras import FUENTES, OBJETO, AJUSTE, GANANCIA, CARA

D = Path(__file__).parent
W, H, CELDA = 1080, 1920, 6
PUNTO = 0.80  # diámetro fijo del punto / celda (folleto: 0.80 impreso; en pantalla más aire)
BAYER = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) + 0.5) / 16
OUT = D / "tmp/web/formas"; OUT.mkdir(parents=True, exist_ok=True)
REL = 240  # profundidad máxima del relieve en px


def recorte(f):
    im = ImageOps.grayscale(Image.open(f)); w, h = im.size; ch = round(w * 16 / 9)
    if ch <= h: y0 = (h - ch) // 2; im = im.crop((0, y0, w, y0 + ch))
    else: cw = round(h * 9 / 16); x0 = (w - cw) // 2; im = im.crop((x0, 0, x0 + cw, h))
    return im.resize((W, H), Image.LANCZOS)


def curva(im):
    im = ImageOps.autocontrast(im, cutoff=1).filter(ImageFilter.UnsharpMask(2, 120, 2))
    a = np.asarray(im, np.float32) / 255
    a = np.clip((a - 0.16) / 0.84, 0, 1) ** 1.2
    return a


def nube(a, objeto=(), relieve=None, umbral=0.05, celda=CELDA, jitter=0.0, semilla=1, bayer=True):
    gh, gw = H // celda, W // celda
    m = a[:gh * celda, :gw * celda].reshape(gh, celda, gw, celda).mean((1, 3))
    rel = m if relieve is None else relieve
    rb = np.asarray(Image.fromarray((rel * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4)), np.float32) / 255
    if bayer:  # trama binaria del folleto: punto fijo encendido si la luz supera el umbral de Bayer
        thr = np.tile(BAYER, (gh // 4 + 1, gw // 4 + 1))[:gh, :gw]
        ys, xs = np.nonzero((m > thr) & (m > umbral))
    else:
        ys, xs = np.nonzero(m > umbral)
    lum = m[ys, xs]
    cx = xs * celda + celda / 2; cy = ys * celda + celda / 2
    rng = np.random.default_rng(semilla)
    if jitter: cx = cx + rng.uniform(-jitter, jitter, cx.shape); cy = cy + rng.uniform(-jitter, jitter, cy.shape)
    tam = np.full(len(xs), celda * PUNTO) if bayer else celda * 0.92 * np.sqrt(lum)
    z = (rb[ys, xs] - 0.35) * REL
    ob = np.zeros(len(xs), np.uint8)
    for r in objeto:
        x0, y0, x1, y1 = r[:4]; tope = r[4] if len(r) > 4 else 1; piso = r[5] if len(r) > 5 else 0
        ob |= ((cx >= x0) & (cx <= x1) & (cy >= y0) & (cy <= y1) & (lum <= tope) & (lum >= piso)).astype(np.uint8)
    return cx - W / 2, H / 2 - cy, z, tam, ob


def guardar(nombre, cx, cy, z, tam, ob):
    r = np.zeros(len(cx), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1")])
    r["x"] = np.round(cx); r["y"] = np.round(cy); r["z"] = np.round(z)
    r["s"] = np.clip(np.round(tam * 10), 0, 255); r["o"] = ob
    # orden aleatorio fijo: así el emparejamiento por índice entre formas se ve como arena revuelta
    r = r[np.random.default_rng(7).permutation(len(r))]
    (OUT / f"{nombre}.bin").write_bytes(r.tobytes()); return len(r)


def logo_png():
    """Rasteriza el logo horizontal (svg) a 4× con Chromium; isotipo teal → objeto."""
    f = D / "tmp/logo_4x.png"
    if f.exists(): return f
    from playwright.sync_api import sync_playwright
    svg = (D / "assets/inplux-logo-horizontal-inverse.svg").read_text()
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1612, "height": 448})
        pg.set_content(f"<body style='margin:0;background:#000'><div style='width:1612px;height:448px'>{svg.replace('<svg ', '<svg width=1612 height=448 ', 1)}</div></body>")
        pg.screenshot(path=str(f)); b.close()
    return f


def logo(ancho=860, cy=900):
    im = Image.open(logo_png()).convert("RGB"); a = np.asarray(im, np.float32) / 255
    ys, xs = np.nonzero(a.max(2) > 0.5)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    esc = ancho / a.shape[1]; h = round(a.shape[0] * esc)
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((ancho, h), Image.LANCZOS), np.float32) / 255
    lienzo = np.zeros((H, W, 3), np.float32); x0 = (W - ancho) // 2; y0 = cy - h // 2
    lienzo[y0:y0 + h, x0:x0 + ancho] = a
    lum = lienzo.max(2); teal = (lienzo[..., 1] > 0.5) & (lienzo[..., 0] < 0.4)
    cel = 5
    cx, cy_, z, tam, _ = nube(lum, umbral=0.25, celda=cel, relieve=np.zeros((H // cel, W // cel)), bayer=False)
    gx = ((cx + W / 2) // 1).astype(int); gy = ((H / 2 - cy_) // 1).astype(int)
    ob = teal[np.clip(gy, 0, H - 1), np.clip(gx, 0, W - 1)].astype(np.uint8)
    tam = np.full_like(tam, cel * 0.9); z = np.zeros_like(z)
    return cx, cy_, z, tam, ob


def main():
    info = {}
    for k, f in FUENTES.items():
        im, obj = recorte(f), list(OBJETO.get(k, ()))
        if k in AJUSTE:  # escala la imagen (anclada arriba al centro) ANTES de tramar: la retícula queda pareja
            e, top = AJUSTE[k]; lienzo = Image.new("L", (W, H), 0)
            lienzo.paste(im.resize((round(W * e), round(H * e)), Image.LANCZOS), (round((W - W * e) / 2), round(top)))
            im = lienzo
            obj = [((r[0] - W / 2) * e + W / 2, top + r[1] * e, (r[2] - W / 2) * e + W / 2, top + r[3] * e, *r[4:]) for r in obj]
        a = np.clip(curva(im) * GANANCIA.get(k, 1), 0, 1)
        cx, cy, z, tam, ob = nube(a, obj)
        info[k] = guardar(k, cx, cy, z, tam, ob)
        if k in CARA:  # primer plano re-tramado a densidad completa
            x0, y0, w = CARA[k]; h = round(w * 16 / 9)
            c = recorte(f).crop((x0, y0, x0 + w, y0 + h)).resize((W, H), Image.LANCZOS)
            info[k + "_cara"] = guardar(k + "_cara", *nube(np.clip(curva(c) * GANANCIA.get(k, 1), 0, 1)))
    info["logo"] = guardar("logo", *logo(860, 860))
    (OUT / "info.json").write_text(json.dumps(info))
    print(info)


if __name__ == "__main__":
    main()
