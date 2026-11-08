"""Monta la historia «Así se ve el trabajo de los agentes» (1080×1920, 30 fps, 14 s).

Necesita out/piezas.json + final.png + fondos.png + hero.png (piezas.py) y out/timeline.json (coreografia.py).

Uso:
  python3 montar.py capas            rótulo y marco como PNG transparentes (Chrome)
  python3 montar.py previa 2 6 9.5   cuadros sueltos en out/previa/
  python3 montar.py audio            out/sonido.wav
  python3 montar.py todo             out/agentes_inplux.mp4
"""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

D = Path(__file__).parent
OUT = D / "out"
W, H, FPS, DUR = 1080, 1920, 30, 14.0
ANCHO = 1440
BLACK, IVORY, TEAL = (12, 12, 11), (246, 242, 236), (0, 215, 202)
MUTED, DIM = (163, 157, 148), (119, 114, 107)

# caja de la página durante la construcción
from coreografia import BX, BY, BW, BH
ESC = BW / ANCHO                 # px de pantalla por px CSS
CANVAS = (470, 1530)             # franja vertical del lienzo
CY = BY + BH / 2

COLORES = [TEAL, (122, 167, 255), (255, 138, 91), TEAL, (197, 139, 255), (255, 209, 102), (255, 92, 138), (91, 227, 125), IVORY]

FUENTE = str(D / "assets/RethinkSans-Medium.ttf")
FUENTE_R = str(D / "assets/RethinkSans-Regular.ttf")
fnt = lambda s, r=False: ImageFont.truetype(FUENTE_R if r else FUENTE, s)


def ease(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


def ease_out(u):
    u = min(1.0, max(0.0, u))
    return 1 - (1 - u) ** 3


def ease_io(u):
    u = min(1.0, max(0.0, u))
    return 4 * u ** 3 if u < .5 else 1 - (-2 * u + 2) ** 3 / 2


# ---------------------------------------------------------------- capas de Chrome
CSS = f"""
@font-face{{font-family:"Rethink Sans";src:url(assets/RethinkSans.woff2);font-weight:400 800}}
html,body{{margin:0;width:{W}px;height:{H}px;background:transparent;font-family:"Rethink Sans";-webkit-font-smoothing:antialiased}}
.titular{{font-weight:500;letter-spacing:-.035em;line-height:.98;margin:0;font-size:84px;
  background:linear-gradient(180deg,#f6f2ec 0%,#f6f2ec 52%,#8d877e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.1em}}
.micro{{font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:#a39d94}}
.cruz{{position:absolute;color:rgba(246,242,236,.35);font-size:22px;font-weight:300;line-height:1}}
"""


def capas():
    from playwright.sync_api import sync_playwright
    cruces = "".join(f'<div class="cruz" style="{v}:26px;{h}:30px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    marco = (f'<div style="position:absolute;left:0;right:0;top:0;height:{CANVAS[0] + 60}px;'
             f'background:linear-gradient(180deg,#0c0c0b 0%,#0c0c0b 80%,rgba(12,12,11,0) 100%)"></div>'
             f'<div style="position:absolute;left:0;right:0;top:{CANVAS[1] - 10}px;bottom:0;'
             f'background:linear-gradient(180deg,rgba(12,12,11,0) 0%,#0c0c0b 22%,#0c0c0b 100%)"></div>'
             f'{cruces}<img src="assets/wordmark-white.svg" style="position:absolute;left:84px;top:228px;height:26px">'
             f'<div class="micro" style="position:absolute;right:88px;top:232px">Medellín · 2026</div>')
    titulo = ('<div style="position:absolute;left:84px;right:84px;top:284px">'
              '<h1 class="titular">Así se ve el trabajo<br>de los agentes.</h1></div>')
    tmp = D / "_capa.html"
    with sync_playwright() as pw:
        br = pw.chromium.launch(channel="chrome"); pg = br.new_page(viewport={"width": W, "height": H})
        for nombre, html in (("marco", marco), ("titulo", titulo)):
            tmp.write_text(f"<!doctype html><html><head><meta charset=utf-8><style>{CSS}</style></head><body>{html}</body></html>", encoding="utf-8")
            pg.goto(tmp.as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(200)
            pg.screenshot(path=str(OUT / f"capa_{nombre}.png"), omit_background=True)
        br.close()
    tmp.unlink()
    print("capas listas")


# ---------------------------------------------------------------- datos
class Escena:
    def __init__(self):
        tl = json.loads((OUT / "timeline.json").read_text(encoding="utf-8"))
        self.tl = tl
        self.alto = tl["alto"]
        self.anim = tl["anim"]
        self.vista = tl["vista_css"]
        self.cam = tl["camara"]
        k = BW / Image.open(OUT / "final.png").width
        rs = lambda im: im.convert("RGB").resize((BW, round(im.height * k)), Image.LANCZOS)
        self.final = rs(Image.open(OUT / "final.png"))
        self.fondos = rs(Image.open(OUT / "fondos.png"))
        self.hero = Image.open(OUT / "hero.png").convert("RGB")
        # ítems: fondos primero, luego piezas; cada uno con su recorte
        self.items = []
        for f in tl["fondos"]:
            self.items.append(dict(f, fuente=self.fondos))
        for p in tl["piezas"]:
            self.items.append(dict(p, fuente=self.final))
        for it in self.items:
            x0, y0 = int(it["x"] * ESC), int(it["y"] * ESC)
            x1, y1 = int(math.ceil((it["x"] + it["w"]) * ESC)), int(math.ceil((it["y"] + it["h"]) * ESC))
            x1, y1 = min(BW, x1), min(self.final.height, y1)
            it["px"] = (x0, y0, x1, y1)
            it["rec"] = it["fuente"].crop(it["px"])
        self.items.sort(key=lambda it: it["t"])
        self.total = len(self.items)
        self.n_piezas = len(tl["piezas"])
        # base: página vacía (alámbrica) del mismo tamaño
        self.base = Image.new("RGB", self.final.size, (19, 19, 18))
        dr = ImageDraw.Draw(self.base)
        for y in range(0, self.final.height, 48):
            dr.line([(0, y), (BW, y)], fill=(24, 24, 23))
        self.capas = {n: Image.open(OUT / f"capa_{n}.png").convert("RGBA") for n in ("marco", "titulo")}
        self.cursores = [self.sprite(i) for i in range(48)]
        rng = np.random.default_rng(3)
        self.grano = [Image.fromarray((rng.normal(0, 1, (H // 2, W // 2)) * 9 + 128).clip(0, 255).astype(np.uint8)).resize((W, H)) for _ in range(4)]
        self.cache_t = None

    def sprite(self, i):
        color = COLORES[i % len(COLORES)]
        ss = 2
        im = Image.new("RGBA", (240 * ss, 70 * ss), (0, 0, 0, 0))
        dr = ImageDraw.Draw(im)
        flecha = [(0, 0), (0, 25), (7, 19), (11.5, 29), (16, 27), (11.8, 17.6), (21, 17.6)]
        pts = [(x * ss + 4 * ss, y * ss + 3 * ss) for x, y in flecha]
        dr.polygon(pts, fill=color, outline=(255, 255, 255), width=int(1.6 * ss))
        etiqueta = f"agente {i + 1:02d}"
        f = fnt(17 * ss)
        tw = dr.textlength(etiqueta, font=f)
        x0, y0 = 22 * ss, 27 * ss
        dr.rounded_rectangle([x0, y0, x0 + tw + 20 * ss, y0 + 28 * ss], radius=8 * ss, fill=color)
        oscuro = sum(color) > 420
        dr.text((x0 + 10 * ss, y0 + 4 * ss), etiqueta, font=f, fill=(12, 12, 11) if oscuro else (255, 255, 255))
        im = im.resize((240, 70), Image.LANCZOS)
        return im

    # ------------------------------------------------------------ página en el tiempo t
    def pagina(self, t):
        """Página (900 px de ancho) con todo lo asentado hasta t; devuelve también las piezas en animación."""
        asentada = self.base.copy()
        vivas = []
        for it in self.items:
            if it["t"] > t: break
            u = (t - it["t"]) / self.anim
            if u >= 1: asentada.paste(it["rec"], it["px"][:2])
            else: vivas.append((it, u))
        return asentada, vivas

    # ------------------------------------------------------------ cursores
    def posicion(self, a, t):
        tramos = self.tl["tramos"][str(a)]
        if not tramos: return None
        alta = self.tl["alta"].get(str(a))
        if alta is None or t < alta - .01: return None
        prev = tramos[0]["de"]
        for tr in tramos:
            if t < tr["t0"]:
                return self.deriva(prev, t, a)
            if t <= tr["t1"]:
                u = (t - tr["t0"]) / max(1e-3, tr["t1"] - tr["t0"])
                return self.curva(tr["de"], tr["a"], u, a)
            prev = tr["a"]
        if tramos[-1]["pieza"] is None: return None   # ya salió
        return self.deriva(prev, t, a)

    @staticmethod
    def curva(p, q, u, semilla):
        e = ease_io(u)
        dx, dy = q[0] - p[0], q[1] - p[1]
        L = math.hypot(dx, dy) + 1e-6
        nx, ny = -dy / L, dx / L
        arco = math.sin(math.pi * e) * min(140, L * .18) * (1 if semilla % 2 else -1)
        # sobreimpulso leve al llegar
        s = e + .06 * math.sin(math.pi * min(1, u * 1.15)) * (u > .8)
        return (p[0] + dx * s + nx * arco, p[1] + dy * s + ny * arco)

    @staticmethod
    def deriva(p, t, a):
        return (p[0] + 7 * math.sin(t * 2.1 + a * 1.7), p[1] + 5 * math.sin(t * 2.7 + a * .9))

    # ------------------------------------------------------------ cuadro
    def cuadro(self, t):
        f = Image.new("RGB", (W, H), BLACK)
        k = min(len(self.cam) - 1, int(round(t * FPS)))
        oy = self.cam[k]
        self.rejilla(f, oy if t < 10.9 else self.cam[-1])
        T_Z1, T_Z2, T_Z3, T_Z4 = 10.9, 11.9, 12.45, 13.35
        if t < T_Z1:
            self.construccion(f, t, oy)
        else:
            self.cierre(f, t, (T_Z1, T_Z2, T_Z3, T_Z4))
        # grano
        g = self.grano[k % 4]
        f = Image.blend(f, Image.merge("RGB", (g, g, g)), .035)
        # marco y rótulo encima de todo
        f.paste(self.capas["marco"], (0, 0), self.capas["marco"])
        a = ease_out((t - .15) / .6)
        if a > 0:
            tit = self.capas["titulo"]
            if a < 1:
                tit = tit.copy(); tit.putalpha(tit.getchannel("A").point(lambda v: int(v * a)))
            f.paste(tit, (0, int(18 * (1 - a))), tit)
        self.barra(f, t)
        return f

    def rejilla(self, f, oy):
        dr = ImageDraw.Draw(f)
        paso = 30
        desp = int(oy * ESC * .35) % paso
        for y in range(CANVAS[0] - desp, CANVAS[1] + paso, paso):
            for x in range(15, W, paso):
                dr.point((x, y), fill=(44, 43, 40))

    def construccion(self, f, t, oy):
        pag, vivas = self.pagina(t)
        y0 = int(oy * ESC)
        alto_caja = int(self.vista * ESC)
        vista = pag.crop((0, y0, BW, y0 + alto_caja))
        selecciones = []
        for it, u in vivas:
            x0, py0, x1, py1 = it["px"]
            a = ease_out(u)
            rec = it["rec"]
            dy = int(10 * (1 - a))
            m = Image.new("L", rec.size, int(255 * a))
            vista.paste(rec, (x0, py0 - y0 + dy), m)
        # piezas seleccionadas: desde que el cursor llega hasta poco después de soltar
        for it in self.items:
            if it["clase"] != "pieza": continue
            if it["t"] - .16 <= t <= it["t"] + self.anim + .14:
                selecciones.append(it)
        # sombra + caja
        sombra = Image.new("RGBA", (BW + 80, alto_caja + 80), (0, 0, 0, 0))
        ImageDraw.Draw(sombra).rectangle([40, 50, BW + 40, alto_caja + 40], fill=(0, 0, 0, 170))
        sombra = sombra.filter(ImageFilter.GaussianBlur(22))
        f.paste(sombra, (BX - 40, BY - 40), sombra)
        f.paste(vista, (BX, BY))
        dr = ImageDraw.Draw(f, "RGBA")
        dr.rectangle([BX - 1, BY - 1, BX + BW, BY + alto_caja], outline=(58, 56, 52))
        dr.text((BX, BY - 30), "Inicio  ·  inplux.co", font=fnt(18, True), fill=MUTED)
        dr.text((BX + BW, BY - 30), f"{BW} × {alto_caja}", font=fnt(16, True), fill=DIM, anchor="ra")
        # selecciones
        for it in selecciones:
            color = COLORES[it["agente"] % len(COLORES)]
            x0, py0, x1, py1 = it["px"]
            sx0, sy0, sx1, sy1 = BX + x0, BY + py0 - y0, BX + x1, BY + py1 - y0
            if sy1 < BY - 4 or sy0 > BY + alto_caja + 4: continue
            u = (t - (it["t"] - .16)) / .1
            al = int(255 * min(1, u) * (1 - ease((t - it["t"] - self.anim) / .14)))
            dr.rectangle([sx0, sy0, sx1, sy1], outline=color + (al,), width=2)
            for hx, hy in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)):
                dr.rectangle([hx - 4, hy - 4, hx + 4, hy + 4], fill=(255, 255, 255, al), outline=color + (al,), width=2)
            etiqueta = f"{round(it['w'])} × {round(it['h'])}"
            fe = fnt(14)
            tw = dr.textlength(etiqueta, font=fe)
            cx = (sx0 + sx1) / 2
            dr.rounded_rectangle([cx - tw / 2 - 7, sy1 + 7, cx + tw / 2 + 7, sy1 + 27], radius=5, fill=color + (al,))
            dr.text((cx, sy1 + 9), etiqueta, font=fe, fill=(12, 12, 11, al) if sum(color) > 420 else (255, 255, 255, al), anchor="ma")
        # cursores
        for a in range(48):
            p = self.posicion(a, t)
            if p is None: continue
            sx = BX + p[0] * ESC
            sy = BY + (p[1] - oy) * ESC
            if not (-80 < sx < W + 20 and BY - 14 < sy < CANVAS[1] + 30): continue
            spr = self.cursores[a]
            f.paste(spr, (int(sx - 4), int(sy - 3)), spr)

    def cierre(self, f, t, tz):
        T_Z1, T_Z2, T_Z3, T_Z4 = tz
        pag, _ = self.pagina(t)
        alto_px = pag.height
        # vista: (top_css, alto_css, ancho_caja)
        build = (self.cam[-1], self.vista, BW)
        alto_canvas = BH + 40
        full = (0, self.alto, ANCHO * alto_canvas / self.alto)
        hero = (0, 1000, 1000)
        if t < T_Z2:
            u = ease_io((t - T_Z1) / (T_Z2 - T_Z1)); A, B = build, full
        elif t < T_Z3:
            u = 1; A, B = full, full
        else:
            u = ease_io((t - T_Z3) / (T_Z4 - T_Z3)); A, B = full, hero
        # interpolación logarítmica del ancho para un zoom natural
        top = A[0] + (B[0] - A[0]) * u
        alto = math.exp(math.log(A[1]) + (math.log(B[1]) - math.log(A[1])) * u)
        ancho = math.exp(math.log(A[2]) + (math.log(B[2]) - math.log(A[2])) * u)
        if t < T_Z2:   # alejarse anclado al pie de la página: la vista no sube antes de abrirse
            pie = (A[0] + A[1]) + ((B[0] + B[1]) - (A[0] + A[1])) * u
            top = max(0, pie - alto)
        top = min(top, self.alto - alto)
        alto_caja = ancho * alto / ANCHO
        x = (W - ancho) / 2
        if t < T_Z2:   # de la caja de construcción al centro
            y = (BY + (CY - alto_caja / 2 - BY) * u)
        else:
            y = CY - alto_caja / 2
        k = BW / ANCHO
        rec = pag.crop((0, int(top * k), BW, int(min(alto_px, (top + alto) * k))))
        w_i, h_i = max(1, int(round(ancho))), max(1, int(round(alto_caja)))
        img = rec.resize((w_i, h_i), Image.LANCZOS)
        if t >= T_Z3 and alto < 1900:   # cerca del hero: fuente nítida
            hz = self.hero.crop((0, int(top * 1.5), self.hero.width, int(min(self.hero.height, (top + alto) * 1.5))))
            nit = hz.resize((w_i, h_i), Image.LANCZOS)
            img = Image.blend(img, nit, ease((1900 - alto) / 700))
        sombra = Image.new("RGBA", (w_i + 80, h_i + 80), (0, 0, 0, 0))
        ImageDraw.Draw(sombra).rectangle([40, 50, w_i + 40, h_i + 40], fill=(0, 0, 0, 170))
        sombra = sombra.filter(ImageFilter.GaussianBlur(22))
        f.paste(sombra, (int(x) - 40, int(y) - 40), sombra)
        f.paste(img, (int(x), int(y)))
        ImageDraw.Draw(f).rectangle([int(x) - 1, int(y) - 1, int(x) + w_i, int(y) + h_i], outline=(58, 56, 52))
        # resplandor teal muy leve cuando queda la página entera
        if T_Z2 - .3 <= t <= T_Z3 + .3:
            dr = ImageDraw.Draw(f, "RGBA")
            a = int(150 * (1 - abs(t - (T_Z2 + T_Z3) / 2) / ((T_Z3 - T_Z2) / 2 + .3)))
            dr.rectangle([int(x) - 6, int(y) - 6, int(x) + w_i + 5, int(y) + h_i + 5], outline=TEAL + (max(0, a),), width=2)

    def barra(self, f, t):
        dr = ImageDraw.Draw(f, "RGBA")
        colocados = sum(1 for it in self.items if it["t"] + self.anim * .5 <= t)
        activos = 0
        for t0, k in self.tl["escalones"]:
            if t >= t0: activos = k
        if t >= 10.45: activos = max(0, int(48 * (1 - ease((t - 10.45) / .8))))
        fin = ease((t - 12.6) / .45)
        y = 1556
        # píldora de estado
        a1 = 1 - fin
        if a1 > 0:
            al = int(255 * a1)
            f1, f2 = fnt(30), fnt(30, True)
            partes = [(f"{activos}", TEAL, f1), ("  agentes   ·   ", MUTED, f2),
                      (f"{colocados}", TEAL, f1), (f" / {self.total}  componentes", MUTED, f2)]
            ancho = 64 + sum(dr.textlength(s, font=fo) for s, _, fo in partes) + 40
            x = (W - ancho) / 2
            dr.rounded_rectangle([x, y, x + ancho, y + 66], radius=33, fill=(26, 26, 24, al), outline=(60, 58, 54, al), width=2)
            for i, c in enumerate(COLORES[:5]):   # puntitos de agentes como en el referente
                dr.ellipse([x + 22 + i * 8, y + 26, x + 36 + i * 8, y + 40], fill=c + (al,), outline=(26, 26, 24, al), width=2)
            cx = x + 84
            for s, c, fo in partes:
                dr.text((cx, y + 15), s, font=fo, fill=c + (al,))
                cx += dr.textlength(s, font=fo)
            dr.text((W / 2, y + 96), "INPLUX.CO", font=fnt(17, True), fill=DIM + (al,), anchor="ma")
        if fin > 0:
            al = int(255 * fin)
            fo = fnt(66)
            tw = dr.textlength("inplux.co", font=fo)
            dy = int(14 * (1 - fin))
            dr.ellipse([W / 2 - tw / 2 - 40, y + 28 + dy, W / 2 - tw / 2 - 20, y + 48 + dy], fill=TEAL + (al,))
            dr.text((W / 2 + 4, y + 2 + dy), "inplux.co", font=fo, fill=IVORY + (al,), anchor="ma")
            dr.text((W / 2, y + 100 + dy), "SOFTWARE CON CRITERIO Y DIRECCIÓN HUMANA", font=fnt(17, True), fill=MUTED + (al,), anchor="ma")


# ---------------------------------------------------------------- sonido
SR = 48000


def filtro(x, baja=None, alta=None):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    if baja: X = X / np.sqrt(1 + (fr / baja) ** 4)
    if alta: X = X * (1 - 1 / np.sqrt(1 + (fr / alta) ** 4))
    return np.fft.irfft(X, len(x))


def audio():
    tl = json.loads((OUT / "timeline.json").read_text(encoding="utf-8"))
    n = int(DUR * SR); t = np.arange(n) / SR; rng = np.random.default_rng(5)
    seco, envio = np.zeros((n, 2)), np.zeros((n, 2))
    def pone(x, en, g=1.0, pan=0.0, rev=0.0):
        i = int(en * SR)
        if i >= n: return
        x = x[:n - i]
        iz, de = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        for c, kk in ((0, iz), (1, de)):
            seco[i:i + len(x), c] += x * g * kk; envio[i:i + len(x), c] += x * g * kk * rev
    golpe = lambda dur, f1, f2, q=9.0: (lambda u: np.sin(2 * np.pi * np.cumsum(f2 + (f1 - f2) * np.exp(-u * 22)) / SR) * np.exp(-u * q))(np.arange(int(dur * SR)) / SR)
    # clic por pieza: tic de ratón (ruido corto) + nota de una escala pentatónica que sube con el avance
    escala = [0, 2, 4, 7, 9]
    piezas = sorted(tl["piezas"], key=lambda p: p["t"])
    for i, p in enumerate(piezas):
        u = np.arange(int(.05 * SR)) / SR
        tic = filtro(np.pad(rng.normal(size=len(u)), (0, 4096)), alta=3500)[:len(u)] * np.exp(-u * 260)
        grado = escala[i % 5] + 12 * ((i // 5) % 3)
        fq = 523.25 * 2 ** (grado / 12)
        nota = np.sin(2 * np.pi * fq * u) * np.exp(-u * 55)
        pan = (p["x"] + p["w"] / 2) / ANCHO * 1.2 - .6
        pone(tic * .5 + nota * .22, p["t"] - .02, .32, pan, rev=.25)
    # pad grave que se abre con los agentes activos
    act = np.zeros(n)
    for t0, k in tl["escalones"]: act[t >= t0] = k
    act[t >= 10.45] = 0
    act = np.convolve(act, np.ones(int(.4 * SR)) / int(.4 * SR), mode="same")
    pad = sum(np.sin(2 * np.pi * fq * t + i) for i, fq in enumerate((55, 82.4, 110, 110.3, 164.8, 220, 329.6)))
    oscuro, claro = filtro(pad, baja=200), filtro(pad, baja=1800)
    mez = act / 48
    env = ease_np(t / 1.0) * (.25 + .75 * mez) * (1 - ease_np((t - 10.6) / .5))
    for c in (0, 1): seco[:, c] += (oscuro * (1 - mez) + claro * mez * .6) * env * .2
    # pulso a 120 BPM desde que hay 24 agentes, doble desde 48
    for en in np.arange(5.0, 10.4, .5): pone(golpe(.25, 130, 46), en, .5, 0, rev=.1)
    for en in np.arange(6.75, 10.4, .25):
        u = np.arange(int(.03 * SR)) / SR
        pone(filtro(np.pad(rng.normal(size=len(u)), (0, 4096)), alta=7000)[:len(u)] * np.exp(-u * 140), en, .12, float(rng.uniform(-.3, .3)))
    # subida y golpe al terminar
    ruido = rng.normal(size=n)
    sub = ease_np((t - 8.6) / 1.9) ** 2 * (1 - ease_np((t - 10.48) / .03))
    for c in (0, 1): seco[:, c] += filtro(ruido, baja=6000) * sub * .14
    pone(golpe(2.2, 96, 34, 2.0), 10.5, 1.4, 0, rev=.35)
    u = np.arange(int(.6 * SR)) / SR
    pone(filtro(np.pad(rng.normal(size=len(u)), (0, 4096)), baja=2600)[:len(u)] * np.exp(-u * 9), 10.5, .5, 0, rev=.9)
    # zoom: barrido suave; campana en «inplux.co»
    bar = ease_np((t - 10.9) / 1.0) * (1 - ease_np((t - 11.9) / .4))
    for c in (0, 1): seco[:, c] += filtro(ruido, baja=900) * bar * .08
    u = np.arange(int(3.2 * SR)) / SR
    campana = sum(np.sin(2 * np.pi * fq * u) * np.exp(-u * d) / (j + 1) for j, (fq, d) in enumerate(((880, 1.6), (1318.5, 2.2), (1760, 3.0), (2637, 4.5))))
    pone(campana, 12.6, .38, 0, rev=.8)
    acorde = sum(np.sin(2 * np.pi * fq * t) for fq in (220, 277.2, 329.6, 440))
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1200) * ease_np((t - 12.5) / .6) * (1 - ease_np((t - 13.6) / .4)) * .05
    # reverberación
    ir = rng.normal(size=int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR / .6)
    ir = filtro(np.pad(ir, (0, n - len(ir))), baja=4200)
    IR = np.fft.rfft(ir / np.sqrt((ir ** 2).sum()))
    mix = seco + np.stack([np.fft.irfft(np.fft.rfft(envio[:, c]) * IR, n) for c in (0, 1)], 1) * .5
    mix = np.stack([filtro(mix[:, c], alta=30) for c in (0, 1)], 1)
    mix = mix * (1 - ease_np((t - 13.75) / .25))[:, None]
    mix = np.tanh(mix / np.abs(mix).max() * 1.5) * .89
    with wave.open(str(OUT / "sonido.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print("audio", n / SR, "s")


def ease_np(u):
    u = np.clip(u, 0, 1)
    return u * u * (3 - 2 * u)


def todo():
    es = Escena()
    n = int(DUR * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-i", str(OUT / "sonido.wav"),
                           "-map_metadata", "-1", "-fflags", "+bitexact", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                           "-profile:v", "high", "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                           "-movflags", "+faststart", "-shortest", str(OUT / "agentes_inplux.mp4")], stdin=subprocess.PIPE)
    for k in range(n):
        im = es.cuadro(k / FPS)
        ff.stdin.write(im.tobytes())
        if k == n - 1: im.save(OUT / "portada.jpg", quality=93)
        if k % 60 == 0: print("cuadro", k, "/", n, flush=True)
    ff.stdin.close(); ff.wait()
    print("listo", ff.returncode)


if __name__ == "__main__":
    modo = sys.argv[1]
    if modo == "capas": capas()
    elif modo == "audio": audio()
    elif modo == "previa":
        es = Escena(); (OUT / "previa").mkdir(exist_ok=True)
        for s in sys.argv[2:]:
            es.cuadro(float(s)).save(OUT / "previa" / f"t{float(s):05.2f}.jpg", quality=90)
        print("previa lista")
    elif modo == "todo": todo()
