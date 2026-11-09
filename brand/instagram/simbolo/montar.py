"""Monta el reel «Así nació el símbolo» (1080×1920, 30 fps, 18 s).

El símbolo E1 «Masa» se construye con retícula y cotas, se rellena, se aleja y queda clavado en
(540, 1010) mientras nueve aplicaciones cambian alrededor; cierra con el lockup a10 horizontal.

Necesita las capas de Chrome (`python3 escenas.py`).

Uso:
  python3 montar.py previa 0.4 2.5 5.0   cuadros sueltos en out/previa/
  python3 montar.py audio                out/sonido.wav
  python3 montar.py todo                 out/simbolo_inplux.mp4 + out/portada.jpg
"""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from geometria import ANCHO, ALTO, PLANTAS, CHAFLAN_X, HORIZONTALES, H_X, DIAGONALES, mapa, poligono, perimetro, recorte_x, parcial

D = Path(__file__).parent
OUT = D / "out"
W, H, FPS, DUR = 1080, 1920, 30, 18.0
BLACK, IVORY, TEAL, TINTA = (12, 12, 11), (246, 242, 236), (0, 215, 202), (26, 25, 24)
MUTED = (163, 157, 148)
CX, CY = 540, 1010
ALTO_C, ALTO_A, ALTO_F = 500, 200, 130        # construcción · aplicaciones · lockup final

# ---- guion (s)
H_INI = [0.15, 0.62, 0.88, 1.14, 1.40, 1.66]  # horizontales de abajo arriba
H_DUR = [0.45, .36, .36, .36, .36, .36]
T_55 = (1.5, 1.95)                            # cota vertical total
DIAG = [(2.0, .6), (2.15, .6)]
PER = [(2.8 + i * .47, .42) for i in range(3)]
T_CHAF = (4.2, 4.45, 4.75)                    # traza el corte · se va la esquina · listo
T_FILL = [(4.8 + i * .15, .15) for i in range(3)]
T_GUIAS = (4.8, 5.25)                         # guías y cotas se apagan
T_R2 = 5.0
T_RESP = (5.4, 6.4)
T_ZOOM = (6.4, 7.0)
T_APP, PASO = 7.0, .75                        # 9 cortes: 7,00 → 13,75
T_CIERRE = T_APP + 9 * PASO
T_MOV = (T_CIERRE, T_CIERRE + .45)
LETRAS_U = [(95.39, 105.09), (118.09, 159.09), (172.09, 204.09), (209.92, 236.92), (238.53, 276.53), (280.43, 324.91)]
T_LETRA = [14.15 + i * .16 for i in range(6)]
T_CAMPANA = T_LETRA[-1] + .14
T_R3, T_URL = 15.4, 15.8
LOCKUP_W = 324.91

# cotas: (texto, valor o None, ancla en unidades, ancla PIL, t de entrada, decimales)
COTAS = [
    ("74,4", 74.39, (37.2, 60.6), "ma", .35, 1),
    ("14,61", 14.61, (-5.2, 47.7), "rm", .85, 2),
    ("5,58", 5.58, (-5.2, 37.6), "rm", 1.1, 2),
    ("55", 55.0, (81.6, 27.5), "lm", 1.95, 0),
    ("1/φ", None, (8.6, 27.5), "rm", 2.55, 0),
    ("1/φ²", None, (68.4, 27.5), "lm", 2.7, 0),
    ("54,2", 54.19, (39.6, 29.6), "mm", 3.62, 1),
    ("34", 34.0, (41.96, 6.2), "mm", 4.08, 0),
    ("45°", None, (55.2, 4.6), "mm", 4.45, 0),
]
# líneas de cota: (a, b, t de entrada, duración) en unidades
LINEAS_COTA = [
    ((0, 58.6), (74.39, 58.6), .3, .35),
    ((-3, 40.39), (-3, 55), .8, .25),
    ((-3, 34.81), (-3, 40.39), 1.05, .2),
    ((78.4, 55), (78.4, 0), T_55[0], T_55[1] - T_55[0]),
    ((12.48, 25.0), (66.67, 25.0), 3.4, .25),
    ((24.96, 9.8), (58.96, 9.8), 3.86, .22),
]

FUENTE = str(D / "assets/RethinkSans-Medium.ttf")
FUENTE_R = str(D / "assets/RethinkSans-Regular.ttf")


def ease(u):
    u = min(1.0, max(0.0, u)); return u * u * (3 - 2 * u)


def ease_out(u):
    u = min(1.0, max(0.0, u)); return 1 - (1 - u) ** 3


def ease_io(u):
    u = min(1.0, max(0.0, u)); return 4 * u ** 3 if u < .5 else 1 - (-2 * u + 2) ** 3 / 2


def prog(t, t0, dur):
    return min(1.0, max(0.0, (t - t0) / dur))


def con_alfa(im, a):
    if a >= 1: return im
    im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a))); return im


def simbolo(alto, cx, cy, color, v="claro", alfa=1.0, ss=4):
    """Símbolo rasterizado con superposición 4× y filtro caja; devuelve (RGBA, (x, y))."""
    f, k = mapa(alto, cx, cy)
    x0, y0 = f(0, 0); x1, y1 = f(ANCHO, ALTO)
    ix0, iy0, ix1, iy1 = math.floor(x0) - 1, math.floor(y0) - 1, math.ceil(x1) + 1, math.ceil(y1) + 1
    m = Image.new("L", ((ix1 - ix0) * ss, (iy1 - iy0) * ss), 0)
    dr = ImageDraw.Draw(m)
    for i in range(3):
        dr.polygon([((f(x, y)[0] - ix0) * ss, (f(x, y)[1] - iy0) * ss) for x, y in poligono(i, v)], fill=255)
    m = m.reduce(ss)
    if alfa < 1: m = m.point(lambda p: int(p * alfa))
    capa = Image.new("RGBA", m.size, color + (255,)); capa.putalpha(m)
    return capa, (ix0, iy0)


class Escena:
    def __init__(self):
        tj = json.loads((OUT / "tarjetas.json").read_text(encoding="utf-8"))
        self.orden = tj["orden"]
        self.tarjetas = [Image.open(OUT / f"tarjeta_{n}.png").convert("RGB") for n, _ in self.orden]
        self.marco = Image.open(OUT / "marco.png").convert("RGBA")
        self.rotulos = [Image.open(OUT / f"rotulo_{i}.png").convert("RGBA") for i in (1, 2, 3)]
        self.url = Image.open(OUT / "inplux_co.png").convert("RGBA")
        # wordmark al tamaño final y recortado por letra
        kf = ALTO_F / 55.0
        wm = Image.open(OUT / "lockup_2x.png").convert("RGBA")
        esc = kf / tj["lockup_k"]
        wm = wm.resize((round(wm.width * esc), round(wm.height * esc)), Image.LANCZOS)
        self.lock_x0 = (W - LOCKUP_W * kf) / 2                    # 156
        self.lock_y0 = CY - ALTO_F / 2                           # tope de las mayúsculas
        self.letras = []
        for a, b in LETRAS_U:
            xa, xb = max(0, round((a - 95.39) * kf) - 2), min(wm.width, round((b - 95.39) * kf) + 2)
            self.letras.append((wm.crop((xa, 0, xb, wm.height)), self.lock_x0 + 95.39 * kf + xa))
        self.sim_fin_cx = self.lock_x0 + ANCHO / 2 * kf
        # fondo: negro con rejilla de puntos
        self.fondo = Image.new("RGB", (W, H), BLACK)
        dr = ImageDraw.Draw(self.fondo)
        for y in range(15, H, 30):
            for x in range(15, W, 30):
                dr.point((x, y), fill=(40, 39, 37))
        rng = np.random.default_rng(3)
        self.grano = [Image.fromarray((rng.normal(0, 1, (H // 2, W // 2)) * 9 + 128).clip(0, 255).astype(np.uint8)).resize((W, H)) for _ in range(4)]
        self.f2 = {s: ImageFont.truetype(FUENTE_R, s) for s in (52, 46)}
        # Rethink Sans no trae φ: solo esa letra sale de Helvetica Neue
        self.f_phi = {s: ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", s) for s in (52, 46)}
        self.cache = {}

    # ------------------------------------------------------------ construcción (a 2×, en una franja)
    R0, R1, SS = 520, 1500, 2

    def construccion(self, f, t):
        ss, r0 = self.SS, self.R0
        alto = ALTO_C
        if t >= T_RESP[0]:
            alto = ALTO_C * (1 - .015 * math.sin(math.pi * prog(t, *T_RESP[:1], T_RESP[1] - T_RESP[0])))
        if t >= T_ZOOM[0]:
            alto = ALTO_C + (ALTO_A - ALTO_C) * ease_io(prog(t, T_ZOOM[0], T_ZOOM[1] - T_ZOOM[0]))
        fill_fin = T_FILL[-1][0] + T_FILL[-1][1]
        if t >= fill_fin:
            sim, pos = simbolo(alto, CX, CY, IVORY)
            # destello al completar el relleno
            br = 1 - ease_out(prog(t, fill_fin, .5))
            if br > 0:
                glow = sim.filter(ImageFilter.GaussianBlur(26))
                glow = con_alfa(Image.merge("RGBA", (*Image.new("RGB", glow.size, TEAL).split(), glow.getchannel("A"))), .55 * br)
                f.paste(glow, pos, glow)
            f.paste(sim, pos, sim)
            return
        fm, k = mapa(ALTO_C, CX, CY)
        P = lambda x, y: ((fm(x, y)[0]) * ss, (fm(x, y)[1] - r0) * ss)
        capa = Image.new("RGBA", (W * ss, (self.R1 - r0) * ss), (0, 0, 0, 0))
        dr = ImageDraw.Draw(capa)   # ojo: sobre RGBA, PIL reemplaza píxeles (no mezcla): el orden importa
        g = 1 - ease(prog(t, T_GUIAS[0], T_GUIAS[1] - T_GUIAS[0]))           # guías
        go = 1 - ease(prog(t, T_FILL[-1][0], fill_fin - T_FILL[-1][0] + .05))  # contornos bajo el relleno
        # punto inicial que parpadea
        if t < H_INI[0] + .2:
            a = .5 + .5 * math.sin(t * 40)
            x, y = P(H_X[0], 55)
            dr.ellipse([x - 9 * ss, y - 9 * ss, x + 9 * ss, y + 9 * ss], fill=TEAL + (int(255 * a),))
        # horizontales punteadas
        for i, (y, t0, du) in enumerate(zip(HORIZONTALES, H_INI, H_DUR)):
            u = ease_io(prog(t, t0, du))
            if u <= 0: continue
            self.punteada(dr, P(H_X[0], y), P(H_X[1], y), u, TEAL + (int(120 * g),), 2 * ss, 12 * ss, 9 * ss)
            if u < 1:
                x, yy = P(H_X[0] + (H_X[1] - H_X[0]) * u, y)
                dr.ellipse([x - 6 * ss, yy - 6 * ss, x + 6 * ss, yy + 6 * ss], fill=TEAL + (255,))
        # diagonales a 1/φ
        for (a, b), (t0, du) in zip(DIAGONALES, DIAG):
            u = ease_io(prog(t, t0, du))
            if u <= 0: continue
            pa = P(*a); pb = P(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)
            self.punteada(dr, pa, pb, 1, TEAL + (int(95 * g),), 2 * ss, 6 * ss, 7 * ss)
        # líneas de cota con topes
        for a, b, t0, du in LINEAS_COTA:
            u = ease_out(prog(t, t0, du))
            if u <= 0: continue
            pa, pb = P(*a), P(*b)
            pm = (pa[0] + (pb[0] - pa[0]) * u, pa[1] + (pb[1] - pa[1]) * u)
            col = TEAL + (int(200 * g),)
            dr.line([pa, pm], fill=col, width=2 * ss)
            ang = math.atan2(pb[1] - pa[1], pb[0] - pa[0]) + math.pi / 2
            for q in (pa, pm):
                dx, dy = math.cos(ang) * 9 * ss, math.sin(ang) * 9 * ss
                dr.line([(q[0] - dx, q[1] - dy), (q[0] + dx, q[1] + dy)], fill=col, width=2 * ss)
        # el corte a 45°
        u = ease_io(prog(t, T_CHAF[0], T_CHAF[1] - T_CHAF[0]))
        if u > 0 and t < T_CHAF[2] + .3:
            a, b = (42.85, -1.5), (60.46, 16.11)
            pa, pb = P(*a), P(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)
            at = 1 - ease(prog(t, T_CHAF[2], .3))
            dr.line([pa, pb], fill=TEAL + (int(255 * at),), width=3 * ss)
            if u < 1:
                dr.ellipse([pb[0] - 7 * ss, pb[1] - 7 * ss, pb[0] + 7 * ss, pb[1] + 7 * ss], fill=TEAL + (255,))
            if t >= T_CHAF[1]:
                c = P(58.96, 14.61); r = 46 * ss
                dr.arc([c[0] - r, c[1] - r, c[0] + r, c[1] + r], 180, 225, fill=TEAL + (int(220 * g),), width=2 * ss)
        # contornos de las plantas con punta de pluma
        for i, (t0, du) in enumerate(PER):
            u = ease_io(prog(t, t0, du))
            if u <= 0: continue
            if i == 2 and t >= T_CHAF[1]:
                cx_ = CHAFLAN_X["claro"]; x0, y0, x1, y1 = PLANTAS["claro"][2]
                principal = [(cx_, y0), (x0, y0), (x0, y1), (x1, y1)]
                esquina = [(cx_, y0), (x1, y0), (x1, y1)]
                ae = 1 - ease(prog(t, T_CHAF[1], T_CHAF[2] - T_CHAF[1]))
                tri = 1 - ease(prog(t, T_CHAF[1], T_CHAF[2] - T_CHAF[1]))
                if tri > 0:
                    dr.polygon([P(*p) for p in esquina], fill=TEAL + (int(70 * tri),))
                dr.line([P(*p) for p in principal], fill=IVORY + (int(255 * go),), width=3 * ss, joint="curve")
                if ae > 0:
                    dr.line([P(*p) for p in esquina], fill=IVORY + (int(255 * ae * go),), width=3 * ss, joint="curve")
                dr.line([P(cx_, y0), P(x1, y1)], fill=IVORY + (int(255 * go),), width=3 * ss)
                continue
            pts = parcial(perimetro(i, "claro", chaflan=False), u)
            if len(pts) > 1:
                dr.line([P(*p) for p in pts], fill=IVORY + (int(255 * go),), width=3 * ss, joint="curve")
            if 0 < u < 1:
                x, y = P(*pts[-1])
                dr.ellipse([x - 16 * ss, y - 16 * ss, x + 16 * ss, y + 16 * ss], fill=TEAL + (60,))
                dr.ellipse([x - 7 * ss, y - 7 * ss, x + 7 * ss, y + 7 * ss], fill=TEAL + (255,))
        # cotas (números que cuentan)
        for texto, valor, (ux, uy), anc, t0, dec in COTAS:
            u = prog(t, t0, .3)
            if u <= 0: continue
            if valor is not None and u < 1:
                texto = f"{valor * ease_out(u):.{dec}f}".replace(".", ",")
            col = TEAL + (int(255 * min(1, u * 3) * g),)
            self.texto(dr, P(ux, uy), texto, 52 if len(texto) < 5 else 46, col, anc)
        # relleno por barrido, planta por planta
        for i, (t0, du) in enumerate(T_FILL):
            u = ease_io(prog(t, t0, du))
            if u <= 0: continue
            x0, _, x1, _ = PLANTAS["claro"][i]
            pol = recorte_x(i, x0 + (x1 - x0) * u)
            if pol: dr.polygon([P(*p) for p in pol], fill=IVORY + (255,))
        capa = capa.resize((W, self.R1 - r0), Image.LANCZOS)
        f.paste(capa, (0, r0), capa)

    def texto(self, dr, pos, texto, tam, col, anc):
        """Texto con φ de respaldo; anclas l/m/r en x y m/a en y, como PIL."""
        trozos = [(c, self.f_phi[tam] if c == "φ" else self.f2[tam]) for c in texto]
        ancho = sum(fn.getlength(c) for c, fn in trozos)
        x = pos[0] - {"l": 0, "m": ancho / 2, "r": ancho}[anc[0]]
        alto_cap = -self.f2[tam].getbbox("1", anchor="ls")[1]
        base = pos[1] + (alto_cap / 2 if anc[1] == "m" else alto_cap)
        for c, fn in trozos:
            dr.text((x, base), c, font=fn, fill=col, anchor="ls"); x += fn.getlength(c)

    @staticmethod
    def punteada(dr, a, b, u, col, ancho, on, off):
        L = math.dist(a, b) * u
        if L <= 0: return
        dx, dy = (b[0] - a[0]) / math.dist(a, b), (b[1] - a[1]) / math.dist(a, b)
        s = 0.0
        while s < L:
            e = min(L, s + on)
            dr.line([(a[0] + dx * s, a[1] + dy * s), (a[0] + dx * e, a[1] + dy * e)], fill=col, width=ancho)
            s = e + off

    # ------------------------------------------------------------ aplicaciones
    def aplicacion(self, t):
        j = min(8, int((t - T_APP) / PASO))
        t0 = T_APP + j * PASO
        nombre, color = self.orden[j]
        tar = self.tarjetas[j]
        s = 1 + .035 * (1 - ease_out((t - t0) / .5))
        if s > 1.0005:
            w2, h2 = round(W * s), round(H * s)
            big = tar.resize((w2, h2), Image.BICUBIC)
            ox, oy = round(CX * s - CX), round(CY * s - CY)
            tar = big.crop((ox, oy, ox + W, oy + H))
        f = tar.copy()
        clave = ("app", color)
        if clave not in self.cache:
            self.cache[clave] = simbolo(ALTO_A, CX, CY, IVORY if color == "marfil" else TINTA, "oscuro" if color == "marfil" else "claro",
                                        alfa=.93 if nombre == "camiseta" else 1.0)
        if nombre == "camiseta":
            self.cache[("cam",)] = self.cache.get(("cam",)) or simbolo(ALTO_A, CX, CY, IVORY, "oscuro", alfa=.9)
            sim, pos = self.cache[("cam",)]
        else:
            sim, pos = self.cache[clave]
        f.paste(sim, pos, sim)
        return f

    # ------------------------------------------------------------ cierre
    def cierre(self, f, t):
        u = ease_io(prog(t, T_MOV[0], T_MOV[1] - T_MOV[0]))
        alto = ALTO_A + (ALTO_F - ALTO_A) * u
        cx = CX + (self.sim_fin_cx - CX) * u
        sim, pos = simbolo(alto, cx, CY, IVORY, "oscuro")
        f.paste(sim, pos, sim)
        for (im, x), t0 in zip(self.letras, T_LETRA):
            a = ease_out(prog(t, t0, .32))
            if a <= 0: continue
            dy = 26 * (1 - a)
            f.paste(con_alfa(im, a), (round(x), round(self.lock_y0 + dy)), con_alfa(im, a))
        a = ease_out(prog(t, T_URL, .45))
        if a > 0:
            im = con_alfa(self.url, a)
            f.paste(im, (0, round(1150 + 14 * (1 - a))), im)

    # ------------------------------------------------------------ cuadro
    def cuadro(self, t):
        k = int(round(t * FPS))
        if T_APP <= t < T_CIERRE:
            f = self.aplicacion(t)
            g = self.grano[k % 4]
            return Image.blend(f, Image.merge("RGB", (g, g, g)), .025)
        f = self.fondo.copy()
        if t < T_APP:
            self.construccion(f, t)
        else:
            self.cierre(f, t)
        g = self.grano[k % 4]
        f = Image.blend(f, Image.merge("RGB", (g, g, g)), .035)
        f.paste(self.marco, (0, 0), self.marco)
        # rótulos
        if t < T_R2:
            a = ease_out((t + .15) / .45) * (1 - ease(prog(t, T_R2 - .15, .15)))
            self.rotulo(f, 0, a)
        elif t < T_APP:
            self.rotulo(f, 1, ease_out(prog(t, T_R2, .35)))
        elif t >= T_R3:
            self.rotulo(f, 2, ease_out(prog(t, T_R3, .45)))
        return f

    def rotulo(self, f, i, a):
        if a <= 0: return
        im = con_alfa(self.rotulos[i], a)
        f.paste(im, (0, int(18 * (1 - a))), im)


# ---------------------------------------------------------------- sonido
SR = 48000


def filtro(x, baja=None, alta=None):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    if baja: X = X / np.sqrt(1 + (fr / baja) ** 4)
    if alta: X = X * (1 - 1 / np.sqrt(1 + (fr / alta) ** 4))
    return np.fft.irfft(X, len(x))


def ease_np(u):
    u = np.clip(u, 0, 1); return u * u * (3 - 2 * u)


def audio():
    n = int(DUR * SR); t = np.arange(n) / SR; rng = np.random.default_rng(7)
    seco, envio = np.zeros((n, 2)), np.zeros((n, 2))

    def pone(x, en, g=1.0, pan=0.0, rev=0.0):
        i = int(max(0, en) * SR)
        if i >= n: return
        x = x[:n - i]
        iz, de = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        for c, kk in ((0, iz), (1, de)):
            seco[i:i + len(x), c] += x * g * kk; envio[i:i + len(x), c] += x * g * kk * rev
    golpe = lambda dur, f1, f2, q=9.0: (lambda u: np.sin(2 * np.pi * np.cumsum(f2 + (f1 - f2) * np.exp(-u * 22)) / SR) * np.exp(-u * q))(np.arange(int(dur * SR)) / SR)

    def ruido(dur, baja=None, alta=None):
        x = rng.normal(size=int(dur * SR) + 4096)
        return filtro(x, baja, alta)[:int(dur * SR)]

    def clic(fq, dur=.05, dec=55):
        u = np.arange(int(dur * SR)) / SR
        return ruido(dur, alta=3500) * np.exp(-u * 260) * .5 + np.sin(2 * np.pi * fq * u) * np.exp(-u * dec) * .22

    def tramo(t0, t1):
        return ease_np((t - t0) / .04) * (1 - ease_np((t - t1) / .06))
    escala = [0, 2, 4, 7, 9]
    # pad grave: crece con la construcción, se abre en las aplicaciones, acorde al final
    pad = sum(np.sin(2 * np.pi * fq * t + i) for i, fq in enumerate((55, 82.4, 110, 110.4, 164.8)))
    env = ease_np((t + .2) / 1.2) * (.35 + .4 * ease_np((t - 2) / 3)) * (1 - .5 * ease_np((t - T_APP) / .2)) * (1 - ease_np((t - T_CIERRE + .1) / .2))
    for c in (0, 1): seco[:, c] += filtro(pad, baja=380) * env * .16
    # tic por horizontal y por cota
    for i, t0 in enumerate(H_INI):
        pone(clic(659.3 * 2 ** (escala[i % 5] / 12), .05, 60), t0, .32, -.4 + i * .16, rev=.3)
    for i, c in enumerate(COTAS):
        pone(clic(1318.5 * 2 ** (escala[i % 5] / 12), .03, 90), c[4], .14, .3 if c[2][0] > 37 else -.3, rev=.2)
    for i, (t0, _) in enumerate(DIAG): pone(clic(493.9, .06, 40), t0, .25, -.3 + .6 * i, rev=.3)
    # pluma: ruido filtrado mientras se trazan las líneas y los contornos
    pluma = np.zeros(n)
    for t0, du in zip(H_INI, H_DUR): pluma += tramo(t0, t0 + du) * .35
    for t0, du in PER: pluma += tramo(t0, t0 + du)
    pluma = np.clip(pluma, 0, 1)
    rasp = filtro(rng.normal(size=n), baja=5200, alta=1600) * (1 + .4 * np.sin(2 * np.pi * 23 * t))
    for c in (0, 1): seco[:, c] += rasp * pluma * .06
    for t0, du in PER: pone(clic(392 * 2 ** (escala[PER.index((t0, du)) * 2 % 5] / 12), .08, 30), t0 + du, .35, 0, rev=.35)
    # el corte: «snip» y clic seco
    u = np.arange(int(.12 * SR)) / SR
    pone(ruido(.12, alta=4500) * np.exp(-u * 30), T_CHAF[0], .35, .3, rev=.2)
    pone(clic(1760, .04, 120), T_CHAF[1], .55, .3, rev=.25)
    # relleno: tres golpes ascendentes y golpe principal
    for i, (t0, _) in enumerate(T_FILL):
        pone(golpe(.45, 150 + 40 * i, 55 + 18 * i, 8), t0, .55 + .15 * i, 0, rev=.3)
    fin = T_FILL[-1][0] + T_FILL[-1][1]
    pone(golpe(1.8, 110, 38, 2.4), fin, 1.25, 0, rev=.4)
    u = np.arange(int(.5 * SR)) / SR
    pone(ruido(.5, baja=2800) * np.exp(-u * 10), fin, .4, 0, rev=.9)
    acorde = sum(np.sin(2 * np.pi * fq * t) for fq in (220, 277.2, 329.6, 440))
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1200) * ease_np((t - fin) / .4) * (1 - ease_np((t - T_ZOOM[0]) / .5)) * .035
    # zoom: barrido que sube hasta el primer corte
    bar = ease_np((t - T_ZOOM[0]) / (T_APP - T_ZOOM[0])) ** 2 * (1 - ease_np((t - T_APP + .02) / .03))
    for c in (0, 1): seco[:, c] += filtro(rng.normal(size=n), baja=5000) * bar * .13
    # aplicaciones: bombo en cada corte, hat a contratiempo, nota que sube
    for j in range(9):
        en = T_APP + j * PASO
        pone(golpe(.35, 140, 44, 7), en, 1.0, 0, rev=.12)
        pone(clic(523.25 * 2 ** ((escala[j % 5] + 12 * (j // 5)) / 12), .09, 25), en, .28, -.5 + j / 8, rev=.35)
        uu = np.arange(int(.035 * SR)) / SR
        pone(ruido(.035, alta=7000) * np.exp(-uu * 120), en + PASO / 2, .16, .25 if j % 2 else -.25)
    bajo = filtro(np.sign(np.sin(2 * np.pi * 55 * t)), baja=300)
    for c in (0, 1): seco[:, c] += bajo * tramo(T_APP, T_CIERRE) * .05
    # cierre: golpe blando, tics por letra, campana, acorde sostenido
    pone(golpe(1.2, 100, 40, 3), T_CIERRE, .8, 0, rev=.5)
    for i, t0 in enumerate(T_LETRA):
        pone(clic(880 * 2 ** (escala[i % 5] / 12), .05, 70), t0, .3, -.5 + i * .2, rev=.35)
    u = np.arange(int(3.2 * SR)) / SR
    campana = sum(np.sin(2 * np.pi * fq * u) * np.exp(-u * d) / (j + 1) for j, (fq, d) in enumerate(((880, 1.4), (1318.5, 2.0), (1760, 2.8), (2637, 4.2))))
    pone(campana, T_CAMPANA, .42, 0, rev=.8)
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1400) * ease_np((t - T_CAMPANA) / .5) * .05
    # reverberación, fundido y limitador
    ir = rng.normal(size=int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR / .6)
    ir = filtro(np.pad(ir, (0, n - len(ir))), baja=4200)
    IR = np.fft.rfft(ir / np.sqrt((ir ** 2).sum()))
    mix = seco + np.stack([np.fft.irfft(np.fft.rfft(envio[:, c]) * IR, n) for c in (0, 1)], 1) * .5
    mix = np.stack([filtro(mix[:, c], alta=30) for c in (0, 1)], 1)
    mix = mix * (1 - ease_np((t - (DUR - .25)) / .25))[:, None]
    mix = np.tanh(mix / np.abs(mix).max() * 1.5) * .89
    with wave.open(str(OUT / "sonido.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print("audio", n / SR, "s")


def todo():
    es = Escena()
    n = int(DUR * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-i", str(OUT / "sonido.wav"),
                           "-map_metadata", "-1", "-fflags", "+bitexact", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                           "-profile:v", "high", "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                           "-movflags", "+faststart", "-shortest", str(OUT / "simbolo_inplux.mp4")], stdin=subprocess.PIPE)
    for k in range(n):
        im = es.cuadro(k / FPS)
        ff.stdin.write(im.tobytes())
        if k == n - 1: im.save(OUT / "portada.jpg", quality=93)
        if k % 90 == 0: print("cuadro", k, "/", n, flush=True)
    ff.stdin.close(); ff.wait()
    print("listo", ff.returncode)


if __name__ == "__main__":
    modo = sys.argv[1]
    if modo == "audio": audio()
    elif modo == "previa":
        es = Escena(); (OUT / "previa").mkdir(exist_ok=True)
        for s in sys.argv[2:]:
            es.cuadro(float(s)).save(OUT / "previa" / f"t{float(s):05.2f}.jpg", quality=90)
        print("previa lista")
    elif modo == "todo": todo()
