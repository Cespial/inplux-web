"""Monta el reel «Así nació el símbolo» v3 (1080×1920, 30 fps, 16 s, pulso 140 BPM).

v3: construcción el doble de rápida; en el golpe el símbolo plano se vuelve 3D (Blender, `tres_d.py`:
placas de metal oscuro y vidrio teal); doce cortes que mezclan render 3D, escenas de Midjourney con el
símbolo compuesto encima (`mj/componer.py`) y tres tarjetas de la v2; cierre sobre Medellín de noche.


El símbolo actual de INPLUX (tres barras 42×13, la superior teal) nace de una pila de arena: los granos
forman la retícula, la pluma traza las barras, la arena las llena y en el golpe cuajan. Después queda
clavado en (540, 1010) mientras nueve aplicaciones cortan al pulso, cada vez más rápido; al final estalla
en granos que forman el lockup horizontal (como la última lámina de inplux.co/adeli).

Necesita las capas de Chrome (`python3 escenas.py`).

Uso:
  python3 montar.py previa 0.8 5.0 14.8   cuadros sueltos en out/previa/
  python3 montar.py audio                 out/sonido.wav
  python3 montar.py todo                  out/simbolo_inplux.mp4 + out/portada.jpg
"""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from geometria import (BARRAS, BW, BH, R, X0, Y0, X1, Y1, HORIZONTALES, VERTICALES, CENTROS, H_X, V_Y,
                       mapa, estadio, parcial)
import arena

D = Path(__file__).parent
OUT = D / "out"
W, H, FPS, DUR = 1080, 1920, 30, 16.0
BLACK, IVORY, TINTA = (12, 12, 11), (246, 242, 236), (26, 25, 24)
TEAL, TEAL_OSC, TEAL_UI = (21, 220, 196), (13, 125, 116), (0, 215, 202)
CX, CY = 540, 1010
ALTO_C, ALTO_A = 440, 170                     # construcción · aplicaciones

# ---- guion (s); 140 BPM, B = 0,4286 s; la construcción de la v2 comprimida ×0,65
BEAT = 60 / 140
K = .65
H_INI = [0.2 + i * .117 for i in range(6)]    # los granos forman las horizontales, de abajo arriba
V_INI = [1.04 + i * .104 for i in range(4)]   # verticales con pluma
T_DIAG = (1.56, .36)
PER = [(1.95 + i * .325, .3) for i in range(3)]  # contorno de las barras, de abajo arriba
T_VIERTE = 2.93                               # la arena se vierte dentro de las barras
T_GOLPE = 8 * BEAT                            # 3,43: cuaja y se vuelve 3D
T_APP = 11 * BEAT                             # 4,71: empiezan los cortes
T_ZOOM = (T_GOLPE + 2 * BEAT, T_APP)          # (solo para el sonido: subida antes de los cortes)
CORTES = [2, 2, 1.5, 1.5, 1, 1, 1, 1, 1, 1, 1, 1]
ESCENAS = [("3d", "macro"), ("mj", "papel"), ("tarjeta", "web"), ("mj", "portatil"), ("tarjeta", "instagram"),
           ("mj", "letrero"), ("3d", "marmol"), ("mj", "camiseta"), ("tarjeta", "app"), ("mj", "placa"),
           ("mj", "cuaderno"), ("3d", "vuelta")]
T_CORTE = [T_APP + sum(CORTES[:j]) * BEAT for j in range(len(CORTES))]
T_CIERRE = T_APP + sum(CORTES) * BEAT         # 26 B = 11,14: estallido
T_VIAJE = T_CIERRE + .3
T_CUAJA = 30 * BEAT                           # 12,86
T_R3, T_URL = T_CUAJA + .45, T_CUAJA + .95

# cotas: (texto, valor o None, ancla en unidades, ancla PIL, t de entrada, decimales)
COTAS = [
    ("84", 84.0, (50.0, 75.4), "ma", .55, 0),
    ("13", 13.0, (2.6, 63.5), "rm", .75, 0),
    ("18", 18.0, (2.6, 48.0), "rm", 1.05, 0),
    ("49", 49.0, (97.6, 45.5), "lm", 1.7, 0),
    ("21", 21.0, (39.5, 15.6), "mb", 2.2, 0),
    ("40,6°", 40.6, (31.0, 67.0), "lm", 2.8, 1),
    ("r 6,5", None, (26.6, 45.5), "rm", 3.85, 0),
    ("42", 42.0, (71.0, 30.4), "mm", 4.3, 0),
]
LINEAS_COTA = [                               # (a, b, t de entrada, duración) en unidades
    ((8, 73.4), (92, 73.4), .45, .35),
    ((5.2, 57), (5.2, 70), .7, .2),
    ((5.2, 39), (5.2, 57), 1.0, .25),
    ((96.0, 70), (96.0, 21), 1.25, .45),
    ((29, 17.6), (50, 17.6), 2.1, .25),
    ((50, 25.4), (92, 25.4), 4.15, .25),
]

COTAS = [(tx, v, an, ap, t0 * K, d) for tx, v, an, ap, t0, d in COTAS]
LINEAS_COTA = [(a, b, t0 * K, du * K) for a, b, t0, du in LINEAS_COTA]

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


def simbolo(alto, cx, cy, base, cima, alfa=1.0, ss=4):
    """Las tres barras redondeadas (superior en `cima`), rasterizadas a 4× con filtro caja: (RGBA, (x, y))."""
    f, k = mapa(alto, cx, cy)
    (x0, y0), (x1, y1) = f(X0, Y0), f(X1, Y1)
    ix0, iy0, ix1, iy1 = math.floor(x0) - 1, math.floor(y0) - 1, math.ceil(x1) + 1, math.ceil(y1) + 1
    w, h = (ix1 - ix0) * ss, (iy1 - iy0) * ss
    capa = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dr = ImageDraw.Draw(capa)
    for i, (bx, by) in enumerate(BARRAS):
        (ax, ay), (bx2, by2) = f(bx, by), f(bx + BW, by + BH)
        dr.rounded_rectangle([(ax - ix0) * ss, (ay - iy0) * ss, (bx2 - ix0) * ss - 1, (by2 - iy0) * ss - 1],
                             radius=R * k * ss, fill=(cima if i == 2 else base) + (255,))
    capa = capa.reduce(ss)
    if alfa < 1: capa = con_alfa(capa, alfa)
    return capa, (ix0, iy0)


def mascara_simbolo(alto, cx, cy):
    """Máscara L del símbolo en el lienzo completo y otra solo de la barra superior (para granos teal)."""
    m, mt = Image.new("L", (W, H), 0), Image.new("L", (W, H), 0)
    f, k = mapa(alto, cx, cy)
    for i, (bx, by) in enumerate(BARRAS):
        (ax, ay), (bx2, by2) = f(bx, by), f(bx + BW, by + BH)
        for mm in ((m, mt) if i == 2 else (m,)):
            ImageDraw.Draw(mm).rounded_rectangle([ax, ay, bx2, by2], radius=R * k, fill=255)
    return m, mt


class Escena:
    def __init__(self):
        tj = json.loads((OUT / "tarjetas.json").read_text(encoding="utf-8"))
        self.color = dict(tj["orden"])
        self.tarjetas = {n: Image.open(OUT / f"tarjeta_{n}.png").convert("RGB") for k, n in ESCENAS if k == "tarjeta"}
        self.mj = {n: Image.open(OUT / f"escena_{n}.png").convert("RGB") for k, n in ESCENAS if k == "mj"}
        self.n3d = {n: len(list((OUT / "3d" / n).glob("*.png"))) for n in ("reveal", "macro", "marmol", "vuelta")}
        med = Image.open(OUT / "fondo_medellin.png").convert("RGB")
        yy, xx = np.mgrid[0:H, 0:W]
        vin = 1 - .55 * np.clip(np.hypot((xx - CX) / 760, (yy - CY) / 1100), 0, 1) ** 2
        calla = 1 - .5 * np.exp(-(((xx - CX) / 520) ** 2 + ((yy - CY) / 170) ** 2))   # oscurece detrás del lockup
        self.medellin = Image.fromarray(np.clip(np.asarray(med, float) * (.5 * vin * calla)[..., None], 0, 255).astype(np.uint8))
        self.marco = Image.open(OUT / "marco.png").convert("RGBA")
        self.rotulos = [Image.open(OUT / f"rotulo_{i}.png").convert("RGBA") for i in (1, 2, 3)]
        self.url = Image.open(OUT / "inplux_co.png").convert("RGBA")
        self.fondo = Image.new("RGB", (W, H), BLACK)
        dr = ImageDraw.Draw(self.fondo)
        for y in range(15, H, 30):
            for x in range(15, W, 30):
                dr.point((x, y), fill=(40, 39, 37))
        rng = np.random.default_rng(3)
        self.grano = [Image.fromarray((rng.normal(0, 1, (H // 2, W // 2)) * 9 + 128).clip(0, 255).astype(np.uint8)).resize((W, H)) for _ in range(4)]
        self.fnt = {s: ImageFont.truetype(FUENTE_R, s) for s in (52, 46)}
        self.cache = {}
        self._granos_construccion()
        self._lockup()
        self._granos_cierre()

    @staticmethod
    def frame3d(nombre, k):
        return Image.open(OUT / "3d" / nombre / f"{k:04d}.png").convert("RGBA")

    # ------------------------------------------------------------ granos de la construcción
    def _granos_construccion(self):
        rng = np.random.default_rng(11)
        f, k = mapa(ALTO_C, CX, CY)
        self.fC, self.kC = f, k
        N = 6000
        px, py = arena.pila(N, W, H, rng, alto=.10)
        # etapa 1: líneas punteadas de granos (las 6 horizontales) + polvo flotando
        lx, ly, li = [], [], []
        xa, xb = f(H_X[0], 0)[0], f(H_X[1], 0)[0]
        for i, yu in enumerate(HORIZONTALES):
            y = f(0, yu)[1]
            for x in np.arange(xa, xb, 4.0):
                if (x - xa) % 23 < 14:
                    lx.append(x); ly.append(y); li.append(i)
        lx, ly, li = np.array(lx, np.float32), np.array(ly, np.float32), np.array(li)
        fuente, _ = arena.emparejar(px, py, lx, ly, 3)
        t1x, t1y = rng.uniform(0, W, N).astype(np.float32), rng.uniform(430, 1590, N).astype(np.float32)
        ret1 = .2 + rng.uniform(0, .65, N); dur1 = rng.uniform(.7, 1.15, N)
        es_linea = np.zeros(N, bool); es_linea[fuente] = True
        t1x[fuente], t1y[fuente] = lx, ly
        ret1[fuente] = np.array([H_INI[i] for i in li]) + (lx - xa) / (xb - xa) * .15
        dur1[fuente] = rng.uniform(.3, .4, len(fuente))
        self.g1 = dict(sx=px, sy=py, tx=t1x, ty=t1y, ret=ret1, dur=dur1, cur=rng.normal(0, 70, N).astype(np.float32),
                       linea=es_linea, fase=rng.uniform(0, 6.28, N), vel=rng.uniform(.4, 1.0, N))
        # etapa 2: la arena se vierte en las barras (trama Bayer de la máscara del símbolo)
        m, mt = mascara_simbolo(ALTO_C, CX, CY)
        bx, by = arena.trama(m, 5)
        bt = np.asarray(mt)[by.astype(int), bx.astype(int)] > 128
        ox, oy = self._pos1(T_VIERTE)
        fuente2, _ = arena.emparejar(ox, oy, bx, by, 4)
        # barrido de abajo arriba: cada barra entra a su turno
        fila = np.where(by > f(0, BARRAS[1][1] + BH)[1], 0, np.where(by > f(0, BARRAS[2][1] + BH)[1], 1, 2))
        self.g2 = dict(sx=ox[fuente2], sy=oy[fuente2], tx=bx, ty=by, teal=bt,
                       ret=T_VIERTE + fila * .1 + rng.uniform(0, .06, len(bx)), dur=rng.uniform(.17, .21, len(bx)),
                       cur=rng.normal(0, 60, len(bx)).astype(np.float32))
        usados = np.zeros(N, bool); usados[fuente2] = True
        self.polvo2 = ~usados

    def _pos1(self, t):
        g = self.g1
        x, y, _ = arena.vuelo(g["sx"], g["sy"], g["tx"], g["ty"], t, g["ret"], g["dur"], g["cur"])
        polvo = ~g["linea"]
        deriva = np.clip(t - g["ret"] - g["dur"], 0, None)
        x = x + np.where(polvo, np.sin(t * .9 + g["fase"]) * 7, 0)
        y = y - np.where(polvo, deriva * 9 * g["vel"], 0)
        return x, y

    def granos_construccion(self, arr, t):
        g = self.g1
        if t < T_VIERTE:
            x, y = self._pos1(t)
            e = arena.ease_np((t - g["ret"]) / g["dur"])
            lin = g["linea"]
            arena.pintar(arr, x, y, 2, IVORY, .2, mask=~lin)
            arena.pintar(arr, x, y, 3, TEAL_UI, .75, mask=lin & (e > .97))
            arena.pintar(arr, x, y, 3, IVORY, .8, mask=lin & (e <= .97))
            return
        # polvo que no entra en las barras: sigue flotando y se apaga después del golpe
        x, y = self._pos1(t)
        ap = .2 * (1 - ease(prog(t, T_GOLPE, 1.6)))
        if ap > .01:
            arena.pintar(arr, x, y, 2, IVORY, ap, mask=self.polvo2)
        if t >= T_GOLPE:
            return
        g2 = self.g2
        xs, ys, e = arena.vuelo(g2["sx"], g2["sy"], g2["tx"], g2["ty"], t, g2["ret"], g2["dur"], g2["cur"])
        teal = (e > .6) & g2["teal"]
        arena.pintar(arr, xs, ys, 3, TEAL, 1.0, mask=teal)
        arena.pintar(arr, xs, ys, 3, IVORY, 1.0, mask=~teal)

    # ------------------------------------------------------------ lockup y granos del cierre
    def _lockup(self):
        lk = Image.open(OUT / "lockup_4x.png").convert("RGBA")
        bb = lk.getbbox()
        esc = 860 / (bb[2] - bb[0])
        lk = lk.resize((round(lk.width * esc), round(lk.height * esc)), Image.LANCZOS)
        bb = lk.getbbox()
        self.lock = lk
        self.lock_pos = (round(CX - (bb[0] + bb[2]) / 2), round(CY - (bb[1] + bb[3]) / 2))
        self.lock_bot = self.lock_pos[1] + bb[3]

    def _granos_cierre(self):
        rng = np.random.default_rng(21)
        m, mt = mascara_simbolo(ALTO_A, CX, CY)
        sx, sy = arena.trama(m, 2)
        st = np.asarray(mt)[sy.astype(int), sx.astype(int)] > 128
        # estallido: hacia afuera desde el centro del símbolo
        ang = np.arctan2(sy - CY, sx - CX) + rng.normal(0, .35, len(sx))
        dist = rng.uniform(120, 520, len(sx)) * rng.choice([1, 1, 1, 1.6], len(sx))
        ex, ey = sx + np.cos(ang) * dist, sy + np.sin(ang) * dist * .8
        # destino: trama del lockup (granos teal donde el lockup es teal)
        a = np.zeros((H, W), np.uint8); col = np.zeros((H, W, 3), np.uint8)
        lx, ly = self.lock_pos
        la = np.asarray(self.lock)
        a[ly:ly + la.shape[0], lx:lx + la.shape[1]] = la[..., 3]
        col[ly:ly + la.shape[0], lx:lx + la.shape[1]] = la[..., :3]
        tx, ty = arena.trama(Image.fromarray(a), 3)
        c = col[ty.astype(int), tx.astype(int)].astype(int)
        tt = (c[:, 1] - c[:, 0]) > 60
        fuente, resto = arena.emparejar(ex, ey, tx, ty, 6)
        bot, top = ty.max(), ty.min()
        self.gc = dict(sx=sx, sy=sy, ex=ex, ey=ey, st=st, src=fuente, tx=tx, ty=ty, tt=tt,
                       ret=T_VIAJE + (1 - (ty - top) / max(1, bot - top)) * .45 + rng.uniform(0, .2, len(tx)),
                       dur=rng.uniform(.55, .72, len(tx)), cur=rng.normal(0, 110, len(tx)).astype(np.float32),
                       resto=resto, caida=rng.uniform(40, 160, len(resto)), fase=rng.uniform(0, 6.28, len(resto)))

    def granos_cierre(self, arr, t):
        g = self.gc
        u = ease_out(prog(t, T_CIERRE, .35))
        if t < T_VIAJE:
            x = g["sx"] + (g["ex"] - g["sx"]) * u; y = g["sy"] + (g["ey"] - g["sy"]) * u
            arena.pintar(arr, x, y, 3, TEAL, 1.0, mask=g["st"])
            arena.pintar(arr, x, y, 3, IVORY, 1.0, mask=~g["st"])
            return
        if t < T_CUAJA + .3:
            a = 1 - ease(prog(t, T_CUAJA, .25))
            src = g["src"]
            x, y, e = arena.vuelo(g["ex"][src], g["ey"][src], g["tx"], g["ty"], t, g["ret"], g["dur"], g["cur"])
            tl = np.where(e > .6, g["tt"], g["st"][src])
            arena.pintar(arr, x, y, 3, TEAL, a, mask=tl)
            arena.pintar(arr, x, y, 3, IVORY, a, mask=~tl)
        # los granos que sobran caen como polvo
        r = g["resto"]
        if len(r):
            d = t - T_VIAJE
            ap = .35 * (1 - ease(prog(t, T_CUAJA, 2.0)))
            if ap > .01:
                x = g["ex"][r] + np.sin(t * 1.3 + g["fase"]) * 6
                y = g["ey"][r] + d * g["caida"]
                arena.pintar(arr, x, y, 2, IVORY, ap)

    # ------------------------------------------------------------ construcción vectorial (a 2×, en una franja)
    R0, R1, SS = 560, 1460, 2

    def vectores(self, f, t):
        ss, r0, fm = self.SS, self.R0, self.fC
        P = lambda x, y: (fm(x, y)[0] * ss, (fm(x, y)[1] - r0) * ss)
        g = 1 - ease(prog(t, T_GOLPE, .35))
        if g <= 0: return
        capa = Image.new("RGBA", (W * ss, (self.R1 - r0) * ss), (0, 0, 0, 0))
        dr = ImageDraw.Draw(capa)   # sobre RGBA, PIL reemplaza píxeles (no mezcla): el orden importa
        # verticales punteadas
        for xu, t0 in zip(VERTICALES, V_INI):
            u = ease_io(prog(t, t0, .38))
            if u <= 0: continue
            self.punteada(dr, P(xu, V_Y[1]), P(xu, V_Y[0]), u, TEAL_UI + (int(110 * g),), 2 * ss, 12 * ss, 9 * ss)
        # diagonal por los centros (40,6°)
        u = ease_io(prog(t, *T_DIAG))
        if u > 0:
            (cx0, cy0), (cx2, cy2) = CENTROS[0], CENTROS[2]
            dx, dy = cx2 - cx0, cy2 - cy0
            a = (cx0 - dx * .3, cy0 - dy * .3); b = (cx2 + dx * .3, cy2 + dy * .3)
            pb = (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)
            self.punteada(dr, P(*a), P(*pb), 1, TEAL_UI + (int(140 * g),), 2 * ss, 6 * ss, 6 * ss)
            for c in CENTROS:
                if (c[0] - a[0]) / (b[0] - a[0]) <= u:
                    x, y = P(*c); dr.ellipse([x - 5 * ss, y - 5 * ss, x + 5 * ss, y + 5 * ss], fill=TEAL_UI + (int(255 * g),))
            if t >= COTAS[5][4]:
                base_x = cx0 + (70 - cy0) * dx / dy
                c = P(base_x, 70); r = 7 * self.kC * ss
                dr.arc([c[0] - r, c[1] - r, c[0] + r, c[1] + r], -40.6, 0, fill=TEAL_UI + (int(220 * g),), width=2 * ss)
        # líneas de cota con topes
        for a, b, t0, du in LINEAS_COTA:
            u = ease_out(prog(t, t0, du))
            if u <= 0: continue
            pa, pb = P(*a), P(*b)
            pm = (pa[0] + (pb[0] - pa[0]) * u, pa[1] + (pb[1] - pa[1]) * u)
            col = TEAL_UI + (int(200 * g),)
            dr.line([pa, pm], fill=col, width=2 * ss)
            ang = math.atan2(pb[1] - pa[1], pb[0] - pa[0]) + math.pi / 2
            for q in (pa, pm):
                ddx, ddy = math.cos(ang) * 9 * ss, math.sin(ang) * 9 * ss
                dr.line([(q[0] - ddx, q[1] - ddy), (q[0] + ddx, q[1] + ddy)], fill=col, width=2 * ss)
        # cotas que cuentan (antes que los contornos: quedan debajo)
        for texto, valor, (ux, uy), anc, t0, dec in COTAS:
            u = prog(t, t0, .3)
            if u <= 0: continue
            if valor is not None and u < 1:
                texto = f"{valor * ease_out(u):.{dec}f}".replace(".", ",") + ("°" if "°" in texto else "")
            dr.text(P(ux, uy), texto, font=self.fnt[52 if len(texto) < 5 else 46], fill=TEAL_UI + (int(255 * min(1, u * 3) * g),), anchor=anc)
        # contornos de las barras con punta de pluma; la superior en teal
        for i, (t0, du) in enumerate(PER):
            u = ease_io(prog(t, t0, du))
            if u <= 0: continue
            pts = parcial(estadio(i), u)
            col = (TEAL if i == 2 else IVORY) + (int(255 * g),)
            if len(pts) > 1:
                dr.line([P(*p) for p in pts], fill=col, width=3 * ss, joint="curve")
            if 0 < u < 1:
                x, y = P(*pts[-1])
                dr.ellipse([x - 16 * ss, y - 16 * ss, x + 16 * ss, y + 16 * ss], fill=TEAL_UI + (60,))
                dr.ellipse([x - 7 * ss, y - 7 * ss, x + 7 * ss, y + 7 * ss], fill=TEAL_UI + (255,))
        capa = capa.resize((W, self.R1 - r0), Image.LANCZOS)
        f.paste(capa, (0, r0), capa)

    @staticmethod
    def punteada(dr, a, b, u, col, ancho, on, off):
        L0 = math.dist(a, b); L = L0 * u
        if L <= 0: return
        dx, dy = (b[0] - a[0]) / L0, (b[1] - a[1]) / L0
        s = 0.0
        while s < L:
            e = min(L, s + on)
            dr.line([(a[0] + dx * s, a[1] + dy * s), (a[0] + dx * e, a[1] + dy * e)], fill=col, width=ancho)
            s = e + off

    def construccion(self, f, t):
        if t < T_GOLPE:
            self.vectores(f, t)
            arr = np.array(f); self.granos_construccion(arr, t)
            return Image.fromarray(arr)
        # golpe: cuaja y se vuelve 3D (cuadro 0 de Blender = el símbolo plano al píxel)
        k = min(self.n3d["reveal"] - 1, int(round((t - T_GOLPE) * FPS)))
        uo = prog(t, T_GOLPE, .6)
        if uo < 1:                                   # onda teal
            capa = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(capa)
            for rr, aa in ((260 + 620 * ease_out(uo), 1.0), (200 + 420 * ease_out(prog(t, T_GOLPE + .08, .6)), .6)):
                dr.ellipse([CX - rr, CY - rr * .62, CX + rr, CY + rr * .62], outline=TEAL_UI + (int(200 * aa * (1 - uo)),), width=4)
            f.paste(capa, (0, 0), capa)
        self.vectores(f, t)
        arr = np.array(f); self.granos_construccion(arr, t); f = Image.fromarray(arr)
        td = self.frame3d("reveal", k)
        f.paste(td, (0, 0), td)
        if k < 3:                                    # fundido de 3 cuadros del plano marfil al metal
            sim, pos = simbolo(ALTO_C, CX, CY, IVORY, TEAL, alfa=1 - k / 3)
            f.paste(sim, pos, sim)
        return f

    # ------------------------------------------------------------ aplicaciones
    def aplicacion(self, t):
        j = max(i for i in range(len(CORTES)) if T_CORTE[i] <= t + 1e-6)
        t0 = T_CORTE[j]
        tipo, nombre = ESCENAS[j]
        if tipo == "3d":                             # el render trae su propio movimiento de cámara
            k = min(self.n3d[nombre] - 1, int((t - t0) * FPS + 1e-6))
            f = self.fondo.copy(); td = self.frame3d(nombre, k)
            f.paste(td, (0, 0), td)
        else:
            tar = self.mj[nombre] if tipo == "mj" else self.tarjetas[nombre]
            amp = .08 if CORTES[j] == 1 else .05
            s = 1 + amp * (1 - ease_out((t - t0) / .3))
            if s > 1.0005:
                w2, h2 = round(W * s), round(H * s)
                big = tar.resize((w2, h2), Image.BICUBIC)
                ox, oy = round(CX * s - CX), round(CY * s - CY)
                tar = big.crop((ox, oy, ox + W, oy + H))
            f = tar.copy()
            if tipo == "tarjeta":
                color = self.color[nombre]
                if color not in self.cache:
                    base, cima = (IVORY, TEAL) if color == "marfil" else (TINTA, TEAL_OSC)
                    self.cache[color] = simbolo(ALTO_A, CX, CY, base, cima)
                sim, pos = self.cache[color]
                f.paste(sim, pos, sim)
        if j >= 8 and t - t0 < 1 / FPS:
            f = Image.blend(f, Image.new("RGB", (W, H), (255, 255, 255)), .35)
        return f

    # ------------------------------------------------------------ cierre
    def cierre(self, f, t):
        am = ease(prog(t, T_CUAJA - .1, .7))
        if am > 0:                                   # Medellín de noche entra al cuajar, con push-in propio
            z = 1 + .05 * ease(prog(t, T_CUAJA, DUR - T_CUAJA))
            fondo = self.camara(self.medellin, z)
            f = Image.blend(f, fondo, am)
        if t < T_CUAJA:
            arr = np.array(f); self.granos_cierre(arr, t); return Image.fromarray(arr)
        a = ease(prog(t, T_CUAJA, .25))
        lk = con_alfa(self.lock, a)
        f.paste(lk, self.lock_pos, lk)
        arr = np.array(f); self.granos_cierre(arr, t); f = Image.fromarray(arr)
        a = ease_out(prog(t, T_URL, .45))
        if a > 0:
            im = con_alfa(self.url, a)
            f.paste(im, (0, round(self.lock_bot + 56 + 14 * (1 - a))), im)
        return f

    # ------------------------------------------------------------ cámara, destellos y cuadro
    @staticmethod
    def camara(f, s, dx=0.0, dy=0.0):
        if abs(s - 1) < 1e-4 and abs(dx) < .3 and abs(dy) < .3:
            return f
        ox, oy = CX * s - CX - dx, CY * s - CY - dy
        return f.transform((W, H), Image.AFFINE, (1 / s, 0, ox / s, 0, 1 / s, oy / s), resample=Image.BICUBIC, fillcolor=BLACK)

    def cuadro(self, t):
        k = int(round(t * FPS))
        if T_APP <= t < T_CIERRE:
            f = self.aplicacion(t)
            g = self.grano[k % 4]
            return Image.blend(f, Image.merge("RGB", (g, g, g)), .025)
        f = self.fondo.copy()
        f = self.construccion(f, t) if t < T_APP else self.cierre(f, t)
        # cámara: push-in lento tras el golpe y al final; sacudidas en el golpe, el estallido y al cuajar
        s, dx, dy = 1.0, 0.0, 0.0
        if t >= T_URL:
            s = 1 + .03 * ease(prog(t, T_URL, DUR - T_URL))
        for t0, amp in ((T_GOLPE, 7), (T_CIERRE, 9), (T_CUAJA, 4)):
            x = t - t0
            if 0 <= x < .5:
                dec = amp * math.exp(-x * 9)
                dx += dec * math.sin(x * 83); dy += dec * math.cos(x * 71)
        f = self.camara(f, s, dx, dy)
        g = self.grano[k % 4]
        f = Image.blend(f, Image.merge("RGB", (g, g, g)), .035)
        for t0, aa in ((T_GOLPE, .55), (T_CUAJA, .35), (T_CIERRE, .25)):
            if 0 <= t - t0 < 2 / FPS:
                f = Image.blend(f, Image.new("RGB", (W, H), (255, 255, 255)), aa * (1 - (t - t0) * FPS / 2))
        f.paste(self.marco, (0, 0), self.marco)
        if t < T_GOLPE:
            self.rotulo(f, 0, ease_out((t + .15) / .45) * (1 - ease(prog(t, T_GOLPE - .15, .15))))
        elif t < T_APP:
            self.rotulo(f, 1, ease_out(prog(t, T_GOLPE, .3)))
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
    # arena: siseo granular mientras los granos suben, se vierten y viajan
    sis = filtro(rng.normal(size=n), baja=9000, alta=2500) * (rng.uniform(size=n) < .08)
    sis = filtro(sis, baja=7000)
    env_a = ease_np((t - .2) / .3) * (1 - ease_np((t - 1.9) / .5)) * .9 + tramo(T_VIERTE, T_GOLPE) * 1.3
    for c in (0, 1): seco[:, c] += sis * env_a * .5
    # pad grave que crece hasta el golpe
    pad = sum(np.sin(2 * np.pi * fq * t + i) for i, fq in enumerate((55, 82.4, 110, 110.4, 164.8)))
    env = ease_np((t + .2) / 1.2) * (.35 + .5 * ease_np((t - 1) / 4)) * (1 - ease_np((t - T_GOLPE) / .05) * .6) * (1 - ease_np((t - T_APP + .1) / .2))
    for c in (0, 1): seco[:, c] += filtro(pad, baja=380) * env * .16
    # tic por línea de granos, por vertical y por cota
    for i, t0 in enumerate(H_INI):
        pone(clic(659.3 * 2 ** (escala[i % 5] / 12), .05, 60), t0 + .45, .3, -.4 + i * .16, rev=.3)
    for i, t0 in enumerate(V_INI):
        pone(clic(493.9 * 2 ** (escala[i % 5] / 12), .05, 50), t0, .22, -.45 + i * .3, rev=.3)
    for i, c in enumerate(COTAS):
        pone(clic(1318.5 * 2 ** (escala[i % 5] / 12), .03, 90), c[4], .13, .3 if c[2][0] > 50 else -.3, rev=.2)
    pone(clic(392, .07, 35), T_DIAG[0], .25, 0, rev=.3)
    # pluma en los contornos
    pluma = sum(tramo(t0, t0 + du) for t0, du in PER)
    rasp = filtro(rng.normal(size=n), baja=5200, alta=1600) * (1 + .4 * np.sin(2 * np.pi * 23 * t))
    for c in (0, 1): seco[:, c] += rasp * np.clip(pluma, 0, 1) * .06
    for i, (t0, du) in enumerate(PER): pone(clic(392 * 2 ** (escala[i * 2 % 5] / 12), .08, 30), t0 + du, .35, 0, rev=.35)
    # riser hasta el golpe y golpe principal con sub
    sub_r = ease_np((t - T_VIERTE) / (T_GOLPE - T_VIERTE)) ** 2 * (1 - ease_np((t - T_GOLPE + .01) / .02))
    barr = np.sin(2 * np.pi * np.cumsum(120 + 900 * ease_np((t - T_VIERTE) / (T_GOLPE - T_VIERTE))) / SR)
    for c in (0, 1): seco[:, c] += (filtro(rng.normal(size=n), baja=6000) * .16 + barr * .04) * sub_r
    pone(golpe(2.2, 120, 36, 2.2), T_GOLPE, 1.5, 0, rev=.45)
    u = np.arange(int(.7 * SR)) / SR
    pone(ruido(.7, baja=2800) * np.exp(-u * 8), T_GOLPE, .5, 0, rev=.9)
    acorde = sum(np.sin(2 * np.pi * fq * t) for fq in (220, 277.2, 329.6, 440))
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1200) * ease_np((t - T_GOLPE) / .3) * (1 - ease_np((t - T_ZOOM[0]) / .4)) * .04
    # pulso a 128 BPM desde el golpe
    for en in np.arange(T_GOLPE + BEAT, T_APP - .01, BEAT): pone(golpe(.3, 130, 46), en, .55, 0, rev=.1)
    u = np.arange(int(2.4 * SR)) / SR             # reveal 3D: brillo metálico + soplo filtrado
    brillo = sum(np.sin(2 * np.pi * fq * u) * np.exp(-u * d) for fq, d in ((1046.5, 2.0), (1568.0, 2.8), (2093.0, 3.6), (3136.0, 5.0)))
    pone(brillo, T_GOLPE + 2 / FPS, .2, .2, rev=.9)
    u = np.arange(int(1.3 * SR)) / SR
    pone(ruido(1.3, baja=9000, alta=5000) * np.sin(np.pi * np.clip(u / 1.3, 0, 1)) ** 2, T_GOLPE + .05, .5, -.2, rev=.6)
    for i in range(4):                            # redoble de 4 golpes antes del estallido
        u = np.arange(int(.14 * SR)) / SR
        sn = ruido(.14, baja=7000, alta=1200) * np.exp(-u * 28) + golpe(.14, 230, 185, 26) * .5
        pone(sn, T_CIERRE - (4 - i) * BEAT / 2, .3 + .1 * i, 0, rev=.25)
    bar = ease_np((t - T_ZOOM[0]) / (T_APP - T_ZOOM[0])) ** 2 * (1 - ease_np((t - T_APP + .02) / .03))
    for c in (0, 1): seco[:, c] += filtro(rng.normal(size=n), baja=5000) * bar * .15
    # aplicaciones: bombo fuerte en cada corte, suave en los tiempos intermedios, hat a contratiempo
    for j, en in enumerate(T_CORTE):
        pone(golpe(.35, 150, 44, 7), en, 1.05, 0, rev=.12)
        pone(clic(523.25 * 2 ** ((escala[j % 5] + 12 * (j // 5)) / 12), .09, 25), en, .3, -.5 + j / 8, rev=.35)
    for en in np.arange(T_APP, T_CIERRE - .01, BEAT / 2):
        if min(abs(en - c) for c in T_CORTE) > .01 and abs((en - T_APP) / BEAT - round((en - T_APP) / BEAT)) < .01:
            pone(golpe(.25, 120, 46), en, .5, 0, rev=.1)
        uu = np.arange(int(.035 * SR)) / SR
        pone(ruido(.035, alta=7000) * np.exp(-uu * 120), en + BEAT / 4, .15, .25)
    bajo = filtro(np.sign(np.sin(2 * np.pi * 55 * t)), baja=300)
    for c in (0, 1): seco[:, c] += bajo * tramo(T_APP, T_CIERRE) * .055
    # cierre: estallido, viaje de los granos, campana al cuajar el lockup
    pone(golpe(1.6, 90, 32, 2.6), T_CIERRE, 1.3, 0, rev=.5)
    u = np.arange(int(.5 * SR)) / SR
    pone(ruido(.5, baja=4000) * np.exp(-u * 7), T_CIERRE, .55, 0, rev=.8)
    via = tramo(T_VIAJE, T_CUAJA) * ease_np((t - T_VIAJE) / (T_CUAJA - T_VIAJE))
    for c in (0, 1): seco[:, c] += sis * via * .9
    u = np.arange(int(3.4 * SR)) / SR
    campana = sum(np.sin(2 * np.pi * fq * u) * np.exp(-u * d) / (j + 1) for j, (fq, d) in enumerate(((880, 1.3), (1318.5, 1.9), (1760, 2.7), (2637, 4.0))))
    pone(campana, T_CUAJA, .45, 0, rev=.8)
    pone(golpe(1.4, 110, 40, 3), T_CUAJA, .7, 0, rev=.4)
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1400) * ease_np((t - T_CUAJA) / .5) * .05
    # reverberación, fundido y limitador
    ir = rng.normal(size=int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR / .6)
    ir = filtro(np.pad(ir, (0, n - len(ir))), baja=4200)
    IR = np.fft.rfft(ir / np.sqrt((ir ** 2).sum()))
    mix = seco + np.stack([np.fft.irfft(np.fft.rfft(envio[:, c]) * IR, n) for c in (0, 1)], 1) * .5
    mix = np.stack([filtro(mix[:, c], alta=30) for c in (0, 1)], 1)
    mix = mix * (1 - ease_np((t - (DUR - .3)) / .3))[:, None]
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
