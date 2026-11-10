"""Historia IG «Hoy en INMERXIA» (1080×1920, 30 fps, 15 s, SIN audio).

Charla «Del pliego al pago» de INPLUX en INMERXIA, 10-nov-2026. Material real de la sala en material/.
Cortes a 130 BPM (beat = 0,4615 s) para que cualquier tecno que se ponga en Instagram caiga encima.

Uso:
  python3 montar.py capas            logos SVG → PNG (Chrome) en out/capas/
  python3 montar.py cuadros          extrae los tramos de video a out/frames/
  python3 montar.py previa 0.5 4 9   cuadros sueltos en out/previa/
  python3 montar.py todo             out/inmerxia_historia.mp4 + out/portada.jpg
"""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

D = Path(__file__).parent
M, OUT = D / "material", D / "out"
W, H, FPS = 1080, 1920, 30
BEAT = 60 / 130
DUR = 32.5 * BEAT                       # 15,0 s
NF = round(DUR * FPS)
BLACK, IVORY, TEAL, MUTED = (12, 12, 11), (246, 242, 236), (0, 215, 202), (178, 172, 163)
FM, FR = str(D / "assets/RethinkSans-Medium.ttf"), str(D / "assets/RethinkSans-Regular.ttf")
fnt = lambda s, r=False: ImageFont.truetype(FR if r else FM, s)

# ------------------------------------------------------------------ guion (en beats)
# (beat_ini, beat_fin, fuente, foco_x, foco_y, zoom_ini, zoom_fin, bloque)
# fuente: foto .jpg, o ("v", video, seg_ini) vertical, o ("h", video, seg_ini) horizontal enmarcado.
PLANOS = [
    (0, 3,   ("v", "vid-v-04", 1.6),  .5, .5, 1.00, 1.00, "abre"),
    (3, 5,   "salon-03.jpg",          .50, .55, 1.04, 1.10, "titulo"),
    (5, 7,   "salon-02.jpg",          .48, .55, 1.10, 1.03, "titulo"),
    (7, 9,   "mapa-03.jpg",           .45, .55, 1.12, 1.04, "paises"),
    (9, 10,  ("v", "vid-v-01", 8.6),  .5, .5, 1.00, 1.00, "paises"),
    (10, 11, ("v", "vid-v-02", 3.0),  .5, .5, 1.00, 1.00, "paises"),
    (11, 13, "flujo-03.jpg",          .52, .62, 1.05, 1.12, "agentes"),
    (13, 14, "flujo-02.jpg",          .40, .62, 1.10, 1.06, "agentes"),
    (14, 15, "conectores-03.jpg",     .50, .66, 1.08, 1.12, "agentes"),
    (15, 17, "pantalla-conectores.jpg", .64, .62, 1.30, 1.45, "vivo"),
    (17, 19, "agentes-persona.jpg",   .55, .66, 1.12, 1.24, "persona"),
    (19, 21, "torre-4k.jpg",          .58, .74, 1.55, 1.70, "torre"),
    (21, 23, ("h", "vid-h-01", 8.9),  .5, .5, 1.00, 1.00, "demo"),
    (23, 25, ("v", "vid-h-02", 4.7),  .5, .5, 1.00, 1.00, "demo"),
    (25, 27, "charla-08.jpg",         .48, .62, 1.05, 1.12, "despues"),
    (27, 29, "charla-04.jpg",         .50, .60, 1.12, 1.05, "despues"),
    (29, 32.5, None,                  0, 0, 0, 0, "cierre"),
]
FLASH_BEATS = (3, 7, 15, 21, 25, 29)

# Textos por bloque: (micro, titular, acento_teal)
TEXTOS = {
    "abre":    ("INPLUX · 10 NOV 2026", "Hoy en\nINMERXIA.", None),
    "titulo":  ("NUESTRA CHARLA", "Del pliego\nal pago.", None),
    "paises":  ("ACTO I", "Diez países\nya empezaron.", None),
    "agentes": ("DEMO 1", "11 agentes y\n6 controles.", None),
    "vivo":    ("EN VIVO", "Demos\nen vivo.", None),
    "persona": ("GOBIA", "Agentes para toda\nla contratación,", "y una persona\nque decide."),
    "torre":   ("TORRE DE CONTROL", "Cada paso del método,\nencendido en orden.", None),
    "demo":    ("C4TA · MEDELLÍN", "Del pliego\nal pago.", None),
    "despues": ("Y DESPUÉS", "La conversación\nsigue.", None),
}


# ------------------------------------------------------------------ utilidades
def ease_out(u):
    u = min(1.0, max(0.0, u)); return 1 - (1 - u) ** 3


def ease_io(u):
    u = min(1.0, max(0.0, u)); return u * u * (3 - 2 * u)


def grado(a):
    """Grado uniforme: contraste +8 %, saturación −10 %, sombras levemente frías."""
    f = a.astype(np.float32) / 255
    lum = (f @ np.array([.299, .587, .114], np.float32))[..., None]
    f = lum + (f - lum) * 0.90
    f = (f - .5) * 1.08 + .5
    sombra = np.clip(1 - lum * 2.2, 0, 1)
    f += sombra * np.array([-.012, .004, .018], np.float32)
    return (np.clip(f, 0, 1) * 255).astype(np.uint8)


_cache = {}


def foto(nombre):
    if nombre not in _cache:
        im = ImageOps.exif_transpose(Image.open(M / nombre)).convert("RGB")
        _cache[nombre] = im
    return _cache[nombre]


def recorte(im, fx, fy, z):
    """Recorte 9:16 centrado en (fx, fy) normalizado, zoom z ≥ 1 sobre el recorte máximo."""
    sw, sh = im.size
    cw = min(sw, sh * 9 / 16); ch = cw * 16 / 9
    cw, ch = cw / z, ch / z
    cx = min(max(fx * sw, cw / 2), sw - cw / 2); cy = min(max(fy * sh, ch / 2), sh - ch / 2)
    box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
    return im.resize((W, H), Image.LANCZOS, box=box)


def frames_dir(video, seg):
    return OUT / "frames" / f"{video}-{seg:.2f}"


def cuadros():
    for b0, b1, src, *_ in PLANOS:
        if not isinstance(src, tuple):
            continue
        kind, video, seg = src
        d = frames_dir(video, seg); d.mkdir(parents=True, exist_ok=True)
        dur = (b1 - b0) * BEAT + 0.2
        vf = ("scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.7"
              if kind == "v" else "scale=984:-2:flags=lanczos,unsharp=5:5:0.6")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(seg), "-i", str(M / f"{video}.mp4"), "-t", f"{dur:.3f}",
                        "-vf", f"fps={FPS},{vf}", str(d / "%04d.png")], check=True)
    print("cuadros listos")


def capas():
    from playwright.sync_api import sync_playwright
    (OUT / "capas").mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(device_scale_factor=1)
        for svg, alto in (("inplux-logo-stacked-inverse.svg", 300), ("wordmark-white.svg", 34)):
            cod = (D / "assets" / svg).read_text().replace("<svg ", f'<svg id="i" style="height:{alto}px;display:block" ', 1)
            pg.set_content(f'<html><body style="margin:0;background:transparent">{cod}</body></html>')
            pg.wait_for_timeout(200)
            pg.locator("#i").screenshot(path=str(OUT / "capas" / svg.replace(".svg", ".png")), omit_background=True)
        b.close()
    print("capas listas")


# ------------------------------------------------------------------ texto y marco
def degradados():
    g = np.zeros((H, W, 4), np.uint8); g[..., :3] = BLACK
    y = np.arange(H)[:, None]
    top = np.clip(1 - y / 460, 0, 1) ** 1.5 * 0.70
    bot = np.clip((y - 880) / 520, 0, 1) ** 1.1 * 0.90
    g[..., 3] = (np.maximum(top, bot) * 255).astype(np.uint8).repeat(W, 1)
    return Image.fromarray(g, "RGBA")


DEG = None
WORDMARK = None
LOGO = None


def texto_gradiente(lineas, size, color_top=IVORY, color_bot=(196, 190, 181)):
    f = fnt(size)
    lh = int(size * 1.0)
    ws = [f.getbbox(l)[2] for l in lineas]
    w, h = max(ws) + 8, lh * len(lineas) + int(size * .25)
    mask = Image.new("L", (w, h), 0); dm = ImageDraw.Draw(mask)
    for i, l in enumerate(lineas):
        dm.text((0, i * lh), l, font=f, fill=255)
    t = np.linspace(0, 1, h)[:, None, None]
    col = (np.array(color_top) * (1 - t * .7) + np.array(color_bot) * t * .7).astype(np.uint8)
    rgba = np.zeros((h, w, 4), np.uint8); rgba[..., :3] = col; rgba[..., 3] = np.array(mask)
    return Image.fromarray(rgba, "RGBA")


_tcache = {}


def bloque_texto(clave):
    if clave in _tcache:
        return _tcache[clave]
    micro, tit, acento = TEXTOS[clave]
    size = 104 if clave in ("abre", "titulo", "demo") else 84
    cap = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(cap)
    lineas = tit.split("\n") + (acento.split("\n") if acento else [])
    alto = int(size * 1.0) * len(lineas)
    y0 = 1500 - alto
    # micro con raya teal
    fm = fnt(22)
    d.rectangle((84, y0 - 52, 84 + 34, y0 - 49), fill=TEAL)
    x = 84 + 50
    for ch in micro:                                    # tracking a mano
        d.text((x, y0 - 64), ch, font=fm, fill=MUTED); x += fm.getlength(ch) + 5.5
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ds = ImageDraw.Draw(sombra)
    ds.rectangle((40, y0 - 90, W - 40, y0 + alto + 40), fill=(0, 0, 0, 120))
    cap.alpha_composite(sombra.filter(ImageFilter.GaussianBlur(70)))
    d = ImageDraw.Draw(cap)
    tl = texto_gradiente(tit.split("\n"), size)
    cap.alpha_composite(tl, (80, y0))
    if acento:
        f = fnt(size); yb = y0 + int(size * 1.0) * len(tit.split("\n"))
        for i, l in enumerate(acento.split("\n")):
            d.text((80, yb + i * int(size * 1.0)), l, font=f, fill=TEAL)
    _tcache[clave] = (cap, y0)
    return _tcache[clave]


def marco(img, t):
    img.alpha_composite(DEG)
    img.alpha_composite(WORDMARK, (84, 236))
    d = ImageDraw.Draw(img)
    fm = fnt(20); s = "INMERXIA 2026"; x = W - 88 - sum(fm.getlength(c) + 5 for c in s)
    for c in s:
        d.text((x, 240), c, font=fm, fill=(220, 214, 205)); x += fm.getlength(c) + 5
    f = fnt(26, True)
    for (px, py) in ((34, 196), (W - 50, 196), (34, H - 250), (W - 50, H - 250)):
        d.text((px, py), "+", font=f, fill=(246, 242, 236, 110))
    # barra de pulso: avanza por beats
    prog = min(1, t / (29 * BEAT))
    d.rectangle((84, 1560, W - 84, 1561), fill=(246, 242, 236, 50))
    d.rectangle((84, 1559, 84 + (W - 168) * prog, 1562), fill=TEAL)


# ------------------------------------------------------------------ composición
def plano_en(t):
    b = t / BEAT
    for p in PLANOS:
        if p[0] <= b < p[1]:
            return p
    return PLANOS[-1]


def fondo_plano(p, t):
    b0, b1, src, fx, fy, z0, z1, _ = p
    t0, t1 = b0 * BEAT, b1 * BEAT
    u = (t - t0) / (t1 - t0)
    if isinstance(src, str):
        z = z0 + (z1 - z0) * ease_io(u)
        return recorte(foto(src), fx, fy, z)
    kind, video, seg = src
    d = frames_dir(video, seg)
    n = min(int((t - t0) * FPS) + 1, len(list(d.glob("*.png"))))
    fr = Image.open(d / f"{n:04d}.png").convert("RGB")
    if kind == "v":
        return fr
    bg = fr.resize((54, 96), box=(fr.width / 2 - fr.height * 9 / 32, 0, fr.width / 2 + fr.height * 9 / 32, fr.height))
    bg = bg.filter(ImageFilter.GaussianBlur(3)).resize((W, H), Image.BICUBIC)
    bg = Image.blend(bg, Image.new("RGB", (W, H), BLACK), 0.45)
    sc = 1.0 + 0.04 * ease_io(u)
    fw, fh = int(fr.width * sc), int(fr.height * sc)
    frs = fr.resize((fw, fh), Image.LANCZOS)
    y = 600 - fh // 2 + 120
    bg.paste((255, 255, 255), ((W - fw) // 2 - 2, y - 2, (W + fw) // 2 + 2, y + fh + 2))
    bg.paste(frs, ((W - fw) // 2, y))
    return bg


def cierre(t):
    t0 = 29 * BEAT
    u = (t - t0) / (DUR - t0)
    img = Image.new("RGBA", (W, H), BLACK + (255,))
    s = 0.86 + 0.14 * ease_out(u * 2.2)
    lg = LOGO.resize((int(LOGO.width * s), int(LOGO.height * s)), Image.LANCZOS)
    a = ease_out(u * 3)
    lg.putalpha(lg.getchannel("A").point(lambda v: int(v * a)))
    img.alpha_composite(lg, ((W - lg.width) // 2, 790 - lg.height // 2))
    d = ImageDraw.Draw(img)
    a2 = int(255 * ease_out((u - .18) * 3))
    f = fnt(40)
    tx = "inplux.co"; d.text(((W - f.getlength(tx)) / 2, 1010), tx, font=f, fill=IVORY + (a2,))
    fm = fnt(21); s2 = "DEL PLIEGO AL PAGO · INMERXIA 2026"
    wtot = sum(fm.getlength(c) + 5 for c in s2); x = (W - wtot) / 2
    for c in s2:
        d.text((x, 1090), c, font=fm, fill=MUTED + (int(a2 * .9),)); x += fm.getlength(c) + 5
    d.rectangle(((W - 34) / 2, 1150, (W + 34) / 2, 1153), fill=TEAL + (a2,))
    return img


def cuadro(i):
    t = i / FPS
    p = plano_en(t)
    if p[7] == "cierre":
        img = cierre(t)
    else:
        img = Image.fromarray(grado(np.asarray(fondo_plano(p, t)))).convert("RGBA")
        marco(img, t)
        cap, _ = bloque_texto(p[7])
        # entrada del texto cuando cambia el bloque
        ini = min(q[0] for q in PLANOS if q[7] == p[7]) * BEAT
        u = ease_out((t - ini) / 0.30)
        dy = int((1 - u) * 38)
        if u < 1:
            c2 = cap.copy(); c2.putalpha(cap.getchannel("A").point(lambda v: int(v * u)))
            img.alpha_composite(c2, (0, dy))
        else:
            img.alpha_composite(cap)
    # flash en cambios de bloque
    for fb in FLASH_BEATS:
        k = round(fb * BEAT * FPS)
        if k <= i < k + 3:
            alpha = (0.70, 0.35, 0.12)[i - k]
            img.alpha_composite(Image.new("RGBA", (W, H), IVORY + (int(255 * alpha),)))
    if i < 4 and p[7] != "cierre":                       # el primer cuadro arranca ya con todo
        pass
    return img.convert("RGB")


def preparar():
    global DEG, WORDMARK, LOGO
    DEG = degradados()
    WORDMARK = Image.open(OUT / "capas/wordmark-white.png").convert("RGBA")
    WORDMARK = WORDMARK.resize((int(WORDMARK.width * 30 / WORDMARK.height), 30), Image.LANCZOS)
    LOGO = Image.open(OUT / "capas/inplux-logo-stacked-inverse.png").convert("RGBA")


def previa(ts):
    preparar(); (OUT / "previa").mkdir(parents=True, exist_ok=True)
    for t in ts:
        cuadro(round(float(t) * FPS)).save(OUT / "previa" / f"t{float(t):05.2f}.jpg", quality=90)
    print("previa lista")


def todo():
    preparar()
    out = OUT / "inmerxia_historia.mp4"
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "17",
                           "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", str(out)],
                          stdin=subprocess.PIPE)
    for i in range(NF):
        im = cuadro(i)
        if i == round(1.0 * FPS):
            im.save(OUT / "portada.jpg", quality=92)
        ff.stdin.write(im.tobytes())
    ff.stdin.close(); ff.wait()
    print(out, NF, "cuadros")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "todo"
    {"capas": capas, "cuadros": cuadros, "todo": todo}.get(cmd, lambda: previa(sys.argv[2:]))()
