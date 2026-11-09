"""Monta la historia «Así se ve el trabajo de los agentes» (1080×1920, 30 fps, 19 s).

Necesita out/piezas.json + final.png + fondos.png + hero.png (piezas.py), las capas de Chrome
(`montar.py capas`) y out/timeline.json (coreografia.py, que lee out/cta_cajas.json de las capas).

Uso:
  python3 montar.py capas            rótulo, marco y piezas del CTA como PNG transparentes (Chrome)
  python3 montar.py previa 2 6 9.5   cuadros sueltos en out/previa/
  python3 montar.py audio            out/sonido.wav
  python3 montar.py todo             out/agentes_inplux.mp4 + out/portada.jpg
"""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from coreografia import BX, BY, BW, BH, DUR, CTA_RECT, CTA_T

D = Path(__file__).parent
OUT = D / "out"
W, H, FPS = 1080, 1920, 30
ANCHO = 1440
BLACK, IVORY, TEAL = (12, 12, 11), (246, 242, 236), (0, 215, 202)
MUTED, DIM = (163, 157, 148), (119, 114, 107)

ESC = BW / ANCHO                 # px de pantalla por px CSS
CANVAS = (470, 1530)             # franja vertical del lienzo
CY = BY + BH / 2
T_Z = (9.9, 10.8, 11.3, 12.2)    # zoom-out · página entera · zoom al hero · hero quieto
T_HERO_FIN = 12.9                # el hero se va; a las 13,4 empieza el CTA

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
    cx, cy, cw, ch = CTA_RECT
    pad = 64
    y_tit = cy + pad + 54
    piezas_cta = {
        "fondo": (f'<div style="position:absolute;left:{cx}px;top:{cy}px;width:{cw}px;height:{ch}px;background:#101010;'
                  f'border:1px solid rgba(246,242,236,.10);box-sizing:border-box"></div>'
                  f'<div style="position:absolute;left:{cx}px;top:{cy}px;width:{cw}px;height:3px;background:#00d7ca"></div>'),
        "micro": f'<div class="micro" style="position:absolute;left:{cx + pad}px;top:{cy + pad}px">→ El siguiente proyecto</div>',
        "titular": (f'<h1 class="titular" style="position:absolute;left:{cx + pad}px;top:{y_tit}px;width:{cw - 2 * pad}px;font-size:74px">'
                    f'Construyamos la solución para <span style="-webkit-text-fill-color:#00d7ca">tu empresa</span>.</h1>'),
        "sub": (f'<p style="position:absolute;left:{cx + pad}px;top:{y_tit + 236}px;width:{cw - 2 * pad - 60}px;margin:0;'
                f'font-size:30px;line-height:1.35;color:#a39d94;font-weight:400">Cuéntanos el problema, quién lo vive y qué debería cambiar.</p>'),
        "boton": (f'<div style="position:absolute;left:{cx + pad}px;top:{y_tit + 236 + 122}px;background:#f6f2ec;color:#1a1916;'
                  f'border-radius:999px;padding:20px 36px;font-size:30px;font-weight:500;letter-spacing:-.01em;white-space:nowrap">Empezar un proyecto →</div>'),
        "pie": (f'<div style="position:absolute;left:{cx + pad}px;top:{cy + ch - pad - 22}px;font-size:20px;color:#a39d94;letter-spacing:.02em">'
                f'gerencia@inplux.co &nbsp;&nbsp;·&nbsp;&nbsp; inplux.co</div>'),
    }
    tmp = D / "_capa.html"
    cajas = {}
    with sync_playwright() as pw:
        br = pw.chromium.launch(channel="chrome"); pg = br.new_page(viewport={"width": W, "height": H})
        def toma(nombre, html):
            tmp.write_text(f"<!doctype html><html><head><meta charset=utf-8><style>{CSS}</style></head><body>{html}</body></html>", encoding="utf-8")
            pg.goto(tmp.as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(200)
            pg.screenshot(path=str(OUT / f"capa_{nombre}.png"), omit_background=True)
        toma("marco", marco); toma("titulo", titulo)
        for nombre, html in piezas_cta.items():
            toma(f"cta_{nombre}", html)
            im = Image.open(OUT / f"capa_cta_{nombre}.png").convert("RGBA")
            bb = im.getbbox()
            im.crop(bb).save(OUT / f"capa_cta_{nombre}.png")
            cajas[nombre] = [bb[0], bb[1], bb[2] - bb[0], bb[3] - bb[1]]
        br.close()
    tmp.unlink()
    (OUT / "cta_cajas.json").write_text(json.dumps(cajas), encoding="utf-8")
    print("capas listas:", {k: v[2:] for k, v in cajas.items()})


# ---------------------------------------------------------------- datos
class Escena:
    def __init__(self):
        tl = json.loads((OUT / "timeline.json").read_text(encoding="utf-8"))
        self.tl = tl
        self.alto = tl["alto"]
        self.anim = tl["anim"]
        self.vista = tl["vista_css"]
        self.cam = tl["camara"]
        self.t_est = tl["t_estallido"]; self.t_sal = tl["t_salida"]
        self.origen = tl["origen_estallido"]
        self.cta_d = tl["cta"]
        self.t_cta, self.t_conv, self.t_press = self.cta_d["t_cta"], self.cta_d["t_conv"], self.cta_d["t_press"]
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
        # base: página vacía (alámbrica) del mismo tamaño
        self.base = Image.new("RGB", self.final.size, (19, 19, 18))
        dr = ImageDraw.Draw(self.base)
        for y in range(0, self.final.height, 48):
            dr.line([(0, y), (BW, y)], fill=(24, 24, 23))
        self.capas = {n: Image.open(OUT / f"capa_{n}.png").convert("RGBA") for n in ("marco", "titulo")}
        self.cta_img = {n: Image.open(OUT / f"capa_cta_{n}.png").convert("RGBA") for n in CTA_T}
        self.cta_piezas = sorted(self.cta_d["piezas"], key=lambda p: p["t"])
        self.cursores = [self.sprite(i) for i in range(48)]
        rng = np.random.default_rng(3)
        self.grano = [Image.fromarray((rng.normal(0, 1, (H // 2, W // 2)) * 9 + 128).clip(0, 255).astype(np.uint8)).resize((W, H)) for _ in range(4)]

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
        return im.resize((240, 70), Image.LANCZOS)

    # ------------------------------------------------------------ página en el tiempo t
    def pagina(self, t):
        """Página (BW px de ancho) con todo lo asentado hasta t; devuelve también las piezas en animación."""
        asentada = self.base.copy()
        vivas = []
        for it in self.items:
            if it["t"] > t: break
            u = (t - it["t"]) / self.anim
            if u >= 1: asentada.paste(it["rec"], it["px"][:2])
            else: vivas.append((it, u))
        return asentada, vivas

    # ------------------------------------------------------------ cursores
    @staticmethod
    def _en_tramos(tramos, t, a, alta=None):
        if not tramos or (alta is not None and t < alta - .01): return None, None
        prev = tramos[0]["de"]
        for tr in tramos:
            if t < tr["t0"]:
                return Escena.deriva(prev, t, a), None
            if t <= tr["t1"]:
                u = (t - tr["t0"]) / max(1e-3, tr["t1"] - tr["t0"])
                return Escena.curva(tr["de"], tr["a"], u, a), tr
            prev = tr["a"]
        if tramos[-1]["pieza"] is None and tramos is not None and tramos[-1].get("estallido") is None and prev == tramos[-1]["a"] and tramos[-1]["t1"] > 9.5:
            return None, None   # salió por el borde (construcción)
        return Escena.deriva(prev, t, a), None

    def posicion(self, a, t):
        """Construcción: (x, y) en px CSS y el tramo activo."""
        return self._en_tramos(self.tl["tramos"][str(a)], t, a, self.tl["alta"].get(str(a)))

    def posicion_cta(self, a, t):
        """CTA: (x, y, alfa) en px de pantalla."""
        tramos = self.cta_d["tramos"][str(a)]
        if t < tramos[0]["t0"]: return None
        if t >= self.t_press:
            u = (t - self.t_press) / .35
            if u >= 1: return None
            fin = tramos[-1]["a"]; c = self.cta_d["boton"]
            dx, dy = fin[0] - c[0], fin[1] - c[1]
            L = math.hypot(dx, dy) + 1e-6
            r = 260 * ease_out(u)
            return (fin[0] + dx / L * r, fin[1] + dy / L * r, 1 - u)
        p, _ = self._en_tramos(tramos, t, a)
        return None if p is None else (p[0], p[1], 1.0)

    @staticmethod
    def curva(p, q, u, semilla):
        e = ease_io(u)
        dx, dy = q[0] - p[0], q[1] - p[1]
        L = math.hypot(dx, dy) + 1e-6
        nx, ny = -dy / L, dx / L
        arco = math.sin(math.pi * e) * min(140, L * .18) * (1 if semilla % 2 else -1)
        s = e + .06 * math.sin(math.pi * min(1, u * 1.15)) * (u > .8)   # sobreimpulso leve al llegar
        return (p[0] + dx * s + nx * arco, p[1] + dy * s + ny * arco)

    @staticmethod
    def deriva(p, t, a):
        return (p[0] + 7 * math.sin(t * 2.1 + a * 1.7), p[1] + 5 * math.sin(t * 2.7 + a * .9))

    def pegar_cursor(self, f, a, sx, sy, alfa=1.0):
        if not (-80 < sx < W + 20 and BY - 14 < sy < CANVAS[1] + 30): return
        spr = self.cursores[a]
        if alfa < 1:
            spr = spr.copy(); spr.putalpha(spr.getchannel("A").point(lambda v: int(v * alfa)))
        f.paste(spr, (int(sx - 4), int(sy - 3)), spr)

    # ------------------------------------------------------------ cuadro
    def cuadro(self, t):
        f = Image.new("RGB", (W, H), BLACK)
        k = min(len(self.cam) - 1, int(round(t * FPS)))
        oy = self.cam[k]
        self.rejilla(f, oy if t < T_Z[0] else self.cam[-1])
        if t < T_Z[0]:
            self.construccion(f, t, oy)
        elif t < T_HERO_FIN:
            self.cierre(f, t)
        elif t < self.t_cta:
            self.transicion(f, t)
        else:
            self.cta(f, t)
        g = self.grano[k % 4]
        f = Image.blend(f, Image.merge("RGB", (g, g, g)), .035)
        f.paste(self.capas["marco"], (0, 0), self.capas["marco"])
        a = ease_out((t + .3) / .45)
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

    def artboard(self, f, rect, alfa, etiqueta, contenido=None):
        """Sombra, contenido (o base vacía), borde y etiquetas de un artboard."""
        x, y, w, h = rect
        capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sombra = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
        ImageDraw.Draw(sombra).rectangle([40, 50, w + 40, h + 40], fill=(0, 0, 0, 170))
        capa.paste(sombra.filter(ImageFilter.GaussianBlur(22)), (x - 40, y - 40))
        if contenido is None:
            contenido = Image.new("RGB", (w, h), (19, 19, 18))
            d0 = ImageDraw.Draw(contenido)
            for yy in range(0, h, 48): d0.line([(0, yy), (w, yy)], fill=(24, 24, 23))
        capa.paste(contenido.convert("RGBA"), (x, y))
        dr = ImageDraw.Draw(capa)
        dr.rectangle([x - 1, y - 1, x + w, y + h], outline=(58, 56, 52, 255))
        dr.text((x, y - 30), etiqueta, font=fnt(18, True), fill=MUTED + (255,))
        dr.text((x + w, y - 30), f"{w} × {h}", font=fnt(16, True), fill=DIM + (255,), anchor="ra")
        if alfa < 1: capa.putalpha(capa.getchannel("A").point(lambda v: int(v * alfa)))
        f.paste(capa, (0, 0), capa)

    def seleccion(self, dr, caja, color, t, t_pieza, etiqueta, clip=None):
        sx0, sy0, sx1, sy1 = caja
        if clip and (sy1 < clip[0] - 4 or sy0 > clip[1] + 4): return
        u = (t - (t_pieza - .16)) / .1
        al = int(255 * min(1, max(0, u)) * (1 - ease((t - t_pieza - self.anim) / .14)))
        if al <= 0: return
        dr.rectangle([sx0, sy0, sx1, sy1], outline=color + (al,), width=2)
        for hx, hy in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)):
            dr.rectangle([hx - 4, hy - 4, hx + 4, hy + 4], fill=(255, 255, 255, al), outline=color + (al,), width=2)
        fe = fnt(14)
        tw = dr.textlength(etiqueta, font=fe)
        cx = (sx0 + sx1) / 2
        dr.rounded_rectangle([cx - tw / 2 - 7, sy1 + 7, cx + tw / 2 + 7, sy1 + 27], radius=5, fill=color + (al,))
        dr.text((cx, sy1 + 9), etiqueta, font=fe, fill=(12, 12, 11, al) if sum(color) > 420 else (255, 255, 255, al), anchor="ma")

    def onda(self, f, centro, t0, t, radios=(440,), retrasos=(0,), dur=.5, glow=True):
        """Anillos teal que se expanden desde `centro` a partir de t0, con resplandor."""
        if t < t0 or t > t0 + dur + max(retrasos): return
        capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dr = ImageDraw.Draw(capa)
        cx, cy = centro
        for r_max, ret in zip(radios, retrasos):
            u = (t - t0 - ret) / dur
            if not 0 <= u <= 1: continue
            r = r_max * ease_out(u); al = int(255 * (1 - u))
            dr.ellipse([cx - r, cy - r, cx + r, cy + r], outline=TEAL + (al,), width=3)
        if glow:
            u = (t - t0) / dur
            if 0 <= u <= 1:
                g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
                r = 60 + 120 * u
                ImageDraw.Draw(g).ellipse([cx - r, cy - r, cx + r, cy + r], fill=TEAL + (int(110 * (1 - u)),))
                capa = Image.alpha_composite(g.filter(ImageFilter.GaussianBlur(30)), capa)
        f.paste(capa, (0, 0), capa)

    def construccion(self, f, t, oy):
        # sacudida al estallar
        ox = oyy = 0
        if self.t_est <= t < self.t_est + .35:
            u = (t - self.t_est) / .35
            ox = int(8 * (1 - u) * math.sin(43 * t)); oyy = int(6 * (1 - u) * math.sin(37 * t + 1))
        bx, by = BX + ox, BY + oyy
        pag, vivas = self.pagina(t)
        y0 = int(oy * ESC)
        alto_caja = int(self.vista * ESC)
        vista = pag.crop((0, y0, BW, y0 + alto_caja))
        for it, u in vivas:
            x0, py0, x1, py1 = it["px"]
            a = ease_out(u)
            m = Image.new("L", it["rec"].size, int(255 * a))
            vista.paste(it["rec"], (x0, py0 - y0 + int(10 * (1 - a))), m)
        # fogonazo del artboard en el estallido
        if self.t_est <= t < self.t_est + .15:
            vista = Image.blend(vista, Image.new("RGB", vista.size, (255, 255, 255)), .3 * (1 - (t - self.t_est) / .15))
        self.artboard(f, (bx, by, BW, alto_caja), 1.0, "Inicio  ·  inplux.co", vista)
        dr = ImageDraw.Draw(f, "RGBA")
        for it in self.items:   # selecciones
            if it["clase"] != "pieza" or not (it["t"] - .16 <= t <= it["t"] + self.anim + .14): continue
            x0, py0, x1, py1 = it["px"]
            self.seleccion(dr, (bx + x0, by + py0 - y0, bx + x1, by + py1 - y0), COLORES[it["agente"] % len(COLORES)],
                           t, it["t"], f"{round(it['w'])} × {round(it['h'])}", clip=(by, by + alto_caja))
        # estallido: onda desde el centro y estelas de los 24 nuevos
        o = (bx + self.origen[0] * ESC, by + (self.origen[1] - oy) * ESC)
        self.onda(f, o, self.t_est, t, radios=(440, 300), retrasos=(0, .1), dur=.55)
        cur = []
        for a in range(48):
            p, tr = self.posicion(a, t)
            if p is None: continue
            sx, sy = bx + p[0] * ESC, by + (p[1] - oy) * ESC
            if tr and tr.get("estallido") and t <= tr["t1"] + .1:
                u = (t - self.t_est) / .5
                if u < 1:
                    dr.line([o, (sx, sy)], fill=COLORES[a % len(COLORES)] + (int(170 * (1 - u)),), width=2)
            cur.append((a, sx, sy))
        for a, sx, sy in cur: self.pegar_cursor(f, a, sx, sy)

    def cierre(self, f, t, alfa=1.0, dy=0):
        T_Z1, T_Z2, T_Z3, T_Z4 = T_Z
        pag, _ = self.pagina(t)
        alto_px = pag.height
        build = (self.cam[-1], self.vista, BW)
        full = (0, self.alto, ANCHO * (BH + 40) / self.alto)
        hero = (0, 1000, 1000)
        if t < T_Z2:
            u = ease_io((t - T_Z1) / (T_Z2 - T_Z1)); A, B = build, full
        elif t < T_Z3:
            u = 1; A, B = full, full
        else:
            u = ease_io((t - T_Z3) / (T_Z4 - T_Z3)); A, B = full, hero
        top = A[0] + (B[0] - A[0]) * u
        alto = math.exp(math.log(A[1]) + (math.log(B[1]) - math.log(A[1])) * u)
        ancho = math.exp(math.log(A[2]) + (math.log(B[2]) - math.log(A[2])) * u)
        if t < T_Z2:   # alejarse anclado al pie de la página
            pie = (A[0] + A[1]) + ((B[0] + B[1]) - (A[0] + A[1])) * u
            top = max(0, pie - alto)
        top = min(top, self.alto - alto)
        alto_caja = ancho * alto / ANCHO
        x = (W - ancho) / 2
        y = (BY + (CY - alto_caja / 2 - BY) * u) if t < T_Z2 else CY - alto_caja / 2
        k = BW / ANCHO
        rec = pag.crop((0, int(top * k), BW, int(min(alto_px, (top + alto) * k))))
        w_i, h_i = max(1, int(round(ancho))), max(1, int(round(alto_caja)))
        img = rec.resize((w_i, h_i), Image.LANCZOS)
        if t >= T_Z3 and alto < 1900:   # cerca del hero: fuente nítida
            hz = self.hero.crop((0, int(top * 1.5), self.hero.width, int(min(self.hero.height, (top + alto) * 1.5))))
            img = Image.blend(img, hz.resize((w_i, h_i), Image.LANCZOS), ease((1900 - alto) / 700))
        capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sombra = Image.new("RGBA", (w_i + 80, h_i + 80), (0, 0, 0, 0))
        ImageDraw.Draw(sombra).rectangle([40, 50, w_i + 40, h_i + 40], fill=(0, 0, 0, 170))
        capa.paste(sombra.filter(ImageFilter.GaussianBlur(22)), (int(x) - 40, int(y + dy) - 40))
        capa.paste(img.convert("RGBA"), (int(x), int(y + dy)))
        dr = ImageDraw.Draw(capa)
        dr.rectangle([int(x) - 1, int(y + dy) - 1, int(x) + w_i, int(y + dy) + h_i], outline=(58, 56, 52, 255))
        if T_Z2 - .3 <= t <= T_Z3 + .3:   # aro teal con la página entera
            a = int(150 * (1 - abs(t - (T_Z2 + T_Z3) / 2) / ((T_Z3 - T_Z2) / 2 + .3)))
            dr.rectangle([int(x) - 6, int(y) - 6, int(x) + w_i + 5, int(y) + h_i + 5], outline=TEAL + (max(0, a),), width=2)
        if alfa < 1: capa.putalpha(capa.getchannel("A").point(lambda v: int(v * alfa)))
        f.paste(capa, (0, 0), capa)

    def transicion(self, f, t):
        u = ease_io((t - T_HERO_FIN) / (self.t_cta - T_HERO_FIN))
        self.cierre(f, t, alfa=1 - u, dy=int(-30 * u))
        a = ease((t - (T_HERO_FIN + .2)) / (self.t_cta - T_HERO_FIN - .2))
        if a > 0: self.artboard(f, CTA_RECT, a, "Nuevo  ·  tu proyecto")

    def cta(self, f, t):
        cx, cy, cw, ch = CTA_RECT
        cont = Image.new("RGB", (cw, ch), (19, 19, 18))
        d0 = ImageDraw.Draw(cont)
        for yy in range(0, ch, 48): d0.line([(0, yy), (cw, yy)], fill=(24, 24, 23))
        cont = cont.convert("RGBA")
        for p in self.cta_piezas:
            if t < p["t"]: break
            u = (t - p["t"]) / self.anim
            a = ease_out(u)
            im = self.cta_img[p["nombre"]]
            x, y = p["x"] - cx, p["y"] - cy + int(10 * (1 - a))
            if p["nombre"] == "boton" and self.t_press <= t < self.t_press + .25:   # se hunde y vuelve
                s = 1 - .06 * math.sin(math.pi * (t - self.t_press) / .25)
                im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
                x += (p["w"] - im.width) // 2; y += (p["h"] - im.height) // 2
            if a < 1:
                im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
            cont.alpha_composite(im, (x, y))
        if self.t_press <= t < self.t_press + .15:
            cont = Image.blend(cont, Image.new("RGBA", cont.size, (255, 255, 255, 255)), .25 * (1 - (t - self.t_press) / .15))
        self.artboard(f, CTA_RECT, 1.0, "Nuevo  ·  tu proyecto", cont)
        dr = ImageDraw.Draw(f, "RGBA")
        for p in self.cta_piezas:
            if p["t"] - .16 <= t <= p["t"] + self.anim + .14:
                self.seleccion(dr, (p["x"], p["y"], p["x"] + p["w"], p["y"] + p["h"]), COLORES[p["agente"] % len(COLORES)],
                               t, p["t"], f"{p['w']} × {p['h']}")
        self.onda(f, self.cta_d["boton"], self.t_press, t, radios=(520, 380), retrasos=(0, .12), dur=.6)
        for a in range(48):
            q = self.posicion_cta(a, t)
            if q is None: continue
            self.pegar_cursor(f, a, q[0], q[1], q[2])

    def barra(self, f, t):
        dr = ImageDraw.Draw(f, "RGBA")
        colocados = sum(1 for it in self.items if it["t"] + self.anim * .5 <= t)
        activos, ultimo = 0, -9
        for t0, k in self.tl["escalones"]:
            if t >= t0: activos, ultimo = k, t0
        if t >= self.t_sal: activos = max(0, int(48 * (1 - ease((t - self.t_sal) / .8))))
        salto = 1 - ease((t - ultimo) / .3) if ultimo > 0 else 0   # el número salta al subir de escalón
        fin = ease((t - T_Z[3] - .22) / .35)
        y = 1556
        a1 = 1 - ease((t - T_Z[3]) / .16)
        if a1 > 0:
            al = int(255 * a1)
            f1, f2 = fnt(30), fnt(30, True)
            partes = [(f"{activos}", TEAL, f1), ("  agentes   ·   ", MUTED, f2),
                      (f"{colocados}", TEAL, f1), (f" / {self.total}  componentes", MUTED, f2)]
            ancho = 64 + sum(dr.textlength(s, font=fo) for s, _, fo in partes) + 40
            x = (W - ancho) / 2
            dr.rounded_rectangle([x, y, x + ancho, y + 66], radius=33, fill=(26, 26, 24, al), outline=(60, 58, 54, al), width=2)
            for i, c in enumerate(COLORES[:5]):
                dr.ellipse([x + 22 + i * 8, y + 26, x + 36 + i * 8, y + 40], fill=c + (al,), outline=(26, 26, 24, al), width=2)
            cx = x + 84
            for i, (s, c, fo) in enumerate(partes):
                if i == 0 and salto > 0:
                    fg = fnt(int(30 * (1 + .35 * salto)))
                    dr.text((cx + dr.textlength(s, font=fo) / 2, y + 33), s, font=fg, fill=c + (al,), anchor="mm")
                else:
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


def ease_np(u):
    u = np.clip(u, 0, 1)
    return u * u * (3 - 2 * u)


def audio():
    tl = json.loads((OUT / "timeline.json").read_text(encoding="utf-8"))
    T_EST, T_SAL = tl["t_estallido"], tl["t_salida"]
    cta = tl["cta"]; T_CTA, T_CONV, T_PRESS = cta["t_cta"], cta["t_conv"], cta["t_press"]
    n = int(DUR * SR); t = np.arange(n) / SR; rng = np.random.default_rng(5)
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
        tic = ruido(dur, alta=3500) * np.exp(-u * 260)
        return tic * .5 + np.sin(2 * np.pi * fq * u) * np.exp(-u * dec) * .22
    # clic por pieza: nota de una pentatónica que sube con el avance
    escala = [0, 2, 4, 7, 9]
    piezas = sorted(tl["piezas"], key=lambda p: p["t"])
    for i, p in enumerate(piezas):
        grado = escala[i % 5] + 12 * ((i // 5) % 3)
        pan = (p["x"] + p["w"] / 2) / ANCHO * 1.2 - .6
        pone(clic(523.25 * 2 ** (grado / 12)), p["t"] - .02, .32, pan, rev=.25)
    # pad grave que se abre con los agentes activos
    act = np.zeros(n)
    for t0, k in tl["escalones"]: act[t >= t0] = k
    act[t >= T_SAL] = 0
    act = np.convolve(act, np.ones(int(.4 * SR)) / int(.4 * SR), mode="same")
    pad = sum(np.sin(2 * np.pi * fq * t + i) for i, fq in enumerate((55, 82.4, 110, 110.3, 164.8, 220, 329.6)))
    oscuro, claro = filtro(pad, baja=200), filtro(pad, baja=1800)
    mez = act / 48
    env = ease_np((t + .3) / .8) * (.25 + .75 * mez) * (1 - ease_np((t - T_SAL - .1) / .5))
    for c in (0, 1): seco[:, c] += (oscuro * (1 - mez) + claro * mez * .6) * env * .2
    # pulso a 120 BPM desde 24 agentes, doble desde 48
    for en in np.arange(4.2, T_SAL - .2, .5): pone(golpe(.25, 130, 46), en, .5, 0, rev=.1)
    for en in np.arange(T_EST + .25, T_SAL - .2, .25):
        u = np.arange(int(.03 * SR)) / SR
        pone(ruido(.03, alta=7000) * np.exp(-u * 140), en, .12, float(rng.uniform(-.3, .3)))
    # estallido: succión, golpe, ráfaga de ruido y 24 clics rapidísimos
    u = np.arange(int(.3 * SR)) / SR
    pone(ruido(.3, baja=5000) * (u / .3) ** 2.5, T_EST - .3, .5, 0, rev=.3)
    pone(golpe(.5, 180, 50, 7), T_EST, 1.1, 0, rev=.4)
    u = np.arange(int(.35 * SR)) / SR
    pone(ruido(.35, baja=3000) * np.exp(-u * 12), T_EST, .5, 0, rev=.8)
    for i in range(24):
        en = T_EST + .05 + .4 * (i / 24) ** 1.4
        pone(clic(880 * 2 ** (escala[i % 5] / 12), .04, 80), en, .3, float(rng.uniform(-.8, .8)), rev=.3)
    # subida y golpe al terminar la página
    sub = ease_np((t - (T_SAL - 1.9)) / 1.9) ** 2 * (1 - ease_np((t - T_SAL + .02) / .03))
    for c in (0, 1): seco[:, c] += filtro(rng.normal(size=n), baja=6000) * sub * .14
    pone(golpe(2.2, 96, 34, 2.0), T_SAL, 1.4, 0, rev=.35)
    u = np.arange(int(.6 * SR)) / SR
    pone(ruido(.6, baja=2600) * np.exp(-u * 9), T_SAL, .5, 0, rev=.9)
    # zoom: barrido suave; golpe blando cuando queda la página entera; acorde en el hero
    bar = ease_np((t - T_Z[0]) / (T_Z[1] - T_Z[0])) * (1 - ease_np((t - T_Z[1]) / .4))
    for c in (0, 1): seco[:, c] += filtro(rng.normal(size=n), baja=900) * bar * .08
    pone(golpe(.6, 120, 40, 6), T_Z[1], .5, 0, rev=.5)
    acorde = sum(np.sin(2 * np.pi * fq * t) for fq in (220, 277.2, 329.6, 440))
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1200) * ease_np((t - T_Z[2]) / .6) * (1 - ease_np((t - T_HERO_FIN) / .4)) * .045
    # CTA: clics graves y espaciados, subida de la convergencia, pulsación
    for i, p in enumerate(cta["piezas"]):
        pone(clic(261.6 * 2 ** (escala[i % 5] / 12), .07, 40), p["t"] - .02, .45, (p["x"] + p["w"] / 2) / W * 1.2 - .6, rev=.35)
    conv = ease_np((t - T_CONV) / (T_PRESS - T_CONV)) ** 2 * (1 - ease_np((t - T_PRESS + .02) / .03))
    barr = np.sin(2 * np.pi * np.cumsum(180 + 620 * ease_np((t - T_CONV) / (T_PRESS - T_CONV))) / SR)
    for c in (0, 1): seco[:, c] += (filtro(rng.normal(size=n), baja=4000) * .12 + barr * .03) * conv
    pone(golpe(2.0, 96, 34, 2.0), T_PRESS, 1.3, 0, rev=.35)
    u = np.arange(int(.5 * SR)) / SR
    pone(ruido(.5, baja=2600) * np.exp(-u * 10), T_PRESS, .45, 0, rev=.9)
    u = np.arange(int(3.0 * SR)) / SR
    campana = sum(np.sin(2 * np.pi * fq * u) * np.exp(-u * d) / (j + 1) for j, (fq, d) in enumerate(((880, 1.6), (1318.5, 2.2), (1760, 3.0), (2637, 4.5))))
    pone(campana, T_PRESS + .02, .38, 0, rev=.8)
    for c in (0, 1): seco[:, c] += filtro(acorde, baja=1200) * ease_np((t - T_PRESS) / .5) * (1 - ease_np((t - (DUR - .45)) / .3)) * .055
    # reverberación, fundido final y limitador
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
