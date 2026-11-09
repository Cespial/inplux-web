"""Coreografía: cuándo se coloca cada pieza, qué agente la coloca, por dónde va cada cursor y
dónde está la cámara. Puro Python, semilla fija.

Construcción: coordenadas en px CSS de la página (1440 de ancho).
CTA: coordenadas de pantalla (1080×1920); necesita out/cta_cajas.json, que escribe `montar.py capas`.

Uso: python3 coreografia.py   (escribe out/timeline.json e imprime un resumen)
"""
import json, math, random, sys
from pathlib import Path

D = Path(__file__).parent
OUT = D / "out"
ANCHO = 1440
W, H = 1080, 1920

DUR = 19.0
T_INI, T_FIN = 0.2, 9.6            # ventana de construcción
ESCALONES = [(-0.3, 6), (2.2, 12), (4.2, 24), (6.3, 48)]   # segundo → agentes activos (escénico)
T_ESTALLIDO = 6.3                  # los 24 nuevos brotan del centro
T_SALIDA = 9.7                     # los cursores se van
# caja de la página en pantalla (zona segura de historias: ni la barra de perfil ni la de respuesta)
BX, BY, BW, BH = 110, 560, 860, 920
VISTA_CSS = round(BH * 1440 / BW)  # alto de página visible durante la construcción (px CSS)
ANIM = .24                         # duración de la aparición de una pieza
# CTA
CTA_RECT = (BX, 660, BW, 720)
T_CTA, T_CONV, T_PRESS = 13.4, 16.1, 17.0
CTA_T = {"fondo": 13.7, "micro": 14.1, "titular": 14.5, "sub": 15.0, "boton": 15.4, "pie": 15.8}


def agentes_en(t):
    n = 0
    for t0, k in ESCALONES:
        if t >= t0: n = k
    return n


def cargar():
    d = json.loads((OUT / "piezas.json").read_text(encoding="utf-8"))
    dentro = lambda p: p["x"] >= -2 and p["x"] + p["w"] <= ANCHO + 2 and p["w"] >= 6 and p["h"] >= 6
    piezas = [dict(p, id=i, clase="pieza") for i, p in enumerate(d["piezas"]) if dentro(p)]
    fondos = [dict(f, id=i, clase="fondo") for i, f in enumerate(d["fondos"]) if f["w"] <= ANCHO + 4]
    for f in fondos:  # recorta a la página
        f["x"] = max(0, f["x"]); f["w"] = min(ANCHO - f["x"], f["w"])
    return d, piezas, fondos


def tiempos(piezas, rng, alto):
    """El frente baja por la página: lento en el hero (pocos agentes), constante después."""
    for p in piezas:
        u = min(1, max(0, (p["y"] + p["h"] * .3 + rng.uniform(-90, 90)) / alto))
        p["t"] = T_INI + (T_FIN - T_INI) * u ** .62 + rng.uniform(-.06, .06)
        p["t"] = min(T_FIN, max(T_INI + .05, p["t"]))
    return sorted(piezas, key=lambda p: p["t"])


def tiempos_fondos(fondos, piezas, rng):
    for f in fondos:
        dentro = [p["t"] for p in piezas if p["x"] >= f["x"] - 2 and p["y"] >= f["y"] - 2
                  and p["x"] + p["w"] <= f["x"] + f["w"] + 2 and p["y"] + p["h"] <= f["y"] + f["h"] + 2]
        if dentro:
            f["t"] = min(dentro) - .34 + .035 * f["prof"]
        else:  # sin hijos: lo coloca el frente cuando pasa por ahí
            cerca = sorted(piezas, key=lambda p: abs(p["y"] - f["y"]))[:3]
            f["t"] = sum(p["t"] for p in cerca) / len(cerca) - .2
        f["t"] = max(T_INI - .35, f["t"])


def camara(piezas, alto):
    """Altura de la cámara (px CSS, borde superior de la vista) por cuadro de 1/30 s."""
    puntos = sorted((p["t"], p["y"] + p["h"] / 2) for p in piezas)
    fps = 30
    n = int(DUR * fps) + 1
    frente = []
    for k in range(n):
        t = k / fps
        hechos = [y for (tp, y) in puntos if tp <= t + .25]
        frente.append(max(hechos[-12:]) if hechos else 0)
    for k in range(1, n): frente[k] = max(frente[k], frente[k - 1])
    lim = alto - VISTA_CSS
    obj = [min(max(0, f - .62 * VISTA_CSS), lim) for f in frente]
    for _ in range(3):  # suavizado de ida y vuelta
        sal = []
        for k in range(n):
            a, b = max(0, k - 18), min(n, k + 18)
            sal.append(sum(obj[a:b]) / (b - a))
        obj = sal
    for k in range(1, n): obj[k] = max(obj[k], obj[k - 1])
    return [min(max(0, c), lim) for c in obj]


def asignar(piezas, cam, rng):
    """Cada pieza a un agente libre y cercano. Devuelve los tramos de cada cursor (px CSS)."""
    N = ESCALONES[-1][1]
    libre, ultimo, alta = {}, {}, {}
    tramos = {i: [] for i in range(N)}
    esc = BW / ANCHO
    def fuera(t):  # punto de entrada/salida por los bordes del lienzo, en px CSS
        k = max(0, min(len(cam) - 1, int(t * 30)))
        lado = rng.choice(["izq", "der", "der", "izq", "abajo"])
        if lado == "izq": sx, sy = -40, rng.uniform(BY, BY + BH)
        elif lado == "der": sx, sy = 1120, rng.uniform(BY, BY + BH)
        else: sx, sy = rng.uniform(100, 980), BY + BH + 160
        return ((sx - BX) / esc, cam[k] + (sy - BY) / esc)
    k_est = min(len(cam) - 1, int(T_ESTALLIDO * 30))
    origen = (ANCHO / 2, cam[k_est] + VISTA_CSS / 2)
    orden = sorted(piezas, key=lambda p: p["t"])
    # estallido: los 24 nuevos salen todos del centro hacia las primeras piezas que siguen al 6,3
    nuevos = [a for a in range(N) if next(t0 for t0, k in ESCALONES if a < k) == T_ESTALLIDO]
    candidatas = [p for p in orden if T_ESTALLIDO + .3 <= p["t"] <= T_ESTALLIDO + 1.6][:len(nuevos)]
    pre = {p["id"]: a for a, p in zip(nuevos, candidatas)}
    for p in orden:
        meta = (p["x"] + min(p["w"] * .3, 46) + rng.uniform(-6, 6), p["y"] + min(p["h"] * .5, 26) + rng.uniform(-4, 4))
        llega = p["t"] - .04
        if p["id"] in pre:
            a = pre[p["id"]]
            alta[a] = T_ESTALLIDO
            tramos[a].append({"t0": T_ESTALLIDO + rng.uniform(0, .05), "t1": llega, "de": origen, "a": meta, "pieza": p["id"], "estallido": True})
        else:
            activos = agentes_en(p["t"])
            elegibles = [a for a in range(activos) if a not in nuevos or a in alta]
            cand = [a for a in elegibles if libre.get(a, -1) <= p["t"] - .32]
            if not cand: cand = sorted(elegibles, key=lambda a: libre.get(a, -1))[:3]
            def dist(a):
                if a not in ultimo: return 600
                return math.dist(ultimo[a], meta)
            a = min(cand, key=lambda a: dist(a) + rng.uniform(0, 260))
            if a not in alta:
                alta[a] = next(t0 for t0, k in ESCALONES if a < k)
                ultimo[a] = fuera(alta[a])
                libre[a] = alta[a]
            sale = max(libre[a], llega - rng.uniform(.38, .62))
            tramos[a].append({"t0": sale, "t1": llega, "de": ultimo[a], "a": meta, "pieza": p["id"]})
        p["agente"] = a
        libre[a] = p["t"] + ANIM + .02
        ultimo[a] = (meta[0] + rng.uniform(-30, 30), meta[1] + rng.uniform(10, 40))
    # nuevos que no alcanzaron pieza: se dispersan desde el centro igual
    for a in nuevos:
        if a not in alta:
            ang = rng.uniform(0, 2 * math.pi); r = rng.uniform(250, 600)
            dest = (origen[0] + r * math.cos(ang), origen[1] + r * math.sin(ang))
            alta[a] = T_ESTALLIDO
            tramos[a].append({"t0": T_ESTALLIDO, "t1": T_ESTALLIDO + .4, "de": origen, "a": dest, "pieza": None, "estallido": True})
            ultimo[a] = dest; libre[a] = T_ESTALLIDO + .45
    # salida
    for a in tramos:
        if a in ultimo:
            t0 = max(T_SALIDA + rng.uniform(0, .45), libre[a])
            tramos[a].append({"t0": t0, "t1": t0 + .55, "de": ultimo[a], "a": fuera(t0), "pieza": None})
    return tramos, alta, origen


def cta(rng):
    """Los 48 vuelven, seis colocan las piezas del CTA, todos convergen en el botón. Px de pantalla."""
    ruta = OUT / "cta_cajas.json"
    if not ruta.exists():
        sys.exit("falta out/cta_cajas.json: corre antes `python3 montar.py capas`")
    cajas = json.loads(ruta.read_text(encoding="utf-8"))
    cx, cy, cw, ch = CTA_RECT
    piezas = []
    for nombre, t in CTA_T.items():
        x, y, w, h = cajas[nombre]
        piezas.append({"nombre": nombre, "x": x, "y": y, "w": w, "h": h, "t": t + rng.uniform(-.05, .05)})
    colocan = rng.sample(range(48), len(piezas))
    tramos = {a: [] for a in range(48)}
    pos, libre = {}, {}
    def borde():
        lado = rng.choice(["izq", "der", "abajo", "izq", "der"])
        if lado == "izq": return (-60.0, rng.uniform(cy, cy + ch))
        if lado == "der": return (W + 60.0, rng.uniform(cy, cy + ch))
        return (rng.uniform(80, W - 80), cy + ch + 150.0)
    def libre_en_tarjeta():   # márgenes de la tarjeta, lejos de la columna de texto
        if rng.random() < .7: return (rng.uniform(cx + 660, cx + cw + 20), rng.uniform(cy + 30, cy + ch - 30))
        return (rng.uniform(cx + 20, cx + cw - 160), rng.uniform(cy + ch + 25, cy + ch + 70))
    for a in range(48):   # entrada
        t0 = T_CTA + rng.uniform(0, .5)
        dest = libre_en_tarjeta()
        tramos[a].append({"t0": t0, "t1": t0 + rng.uniform(.5, .75), "de": borde(), "a": dest, "pieza": None})
        pos[a] = dest; libre[a] = t0 + .8
    for p, a in zip(piezas, colocan):   # colocación
        meta = (p["x"] + min(p["w"] * .3, 46), p["y"] + min(p["h"] * .5, 26))
        llega = p["t"] - .04
        sale = max(libre[a], llega - rng.uniform(.45, .7))
        tramos[a].append({"t0": sale, "t1": llega, "de": pos[a], "a": meta, "pieza": p["nombre"]})
        p["agente"] = a
        pos[a] = (meta[0] + rng.uniform(-30, 30), meta[1] + rng.uniform(10, 40)); libre[a] = p["t"] + ANIM + .05
    for a in range(48):   # merodeo mientras tanto
        t = libre[a] + rng.uniform(.2, .6)
        while True:
            d = rng.uniform(.5, .9)
            if t + d > T_CONV - .15: break
            dest = libre_en_tarjeta()
            tramos[a].append({"t0": t, "t1": t + d, "de": pos[a], "a": dest, "pieza": None})
            pos[a] = dest; t += d + rng.uniform(.3, .8)
            libre[a] = t
    bx, by, bw, bh = cajas["boton"]
    centro = (bx + bw / 2, by + bh / 2)
    for a in range(48):   # convergencia
        t0 = max(libre[a], T_CONV + rng.uniform(0, .5))
        meta = (centro[0] + rng.uniform(-70, 70), centro[1] + rng.uniform(-26, 26))
        tramos[a].append({"t0": t0, "t1": t0 + .45, "de": pos[a], "a": meta, "pieza": "convergencia"})
    return {"piezas": piezas, "tramos": {str(k): v for k, v in tramos.items()}, "boton": centro,
            "t_cta": T_CTA, "t_conv": T_CONV, "t_press": T_PRESS}


def main():
    rng = random.Random(7)
    d, piezas, fondos = cargar()
    piezas = tiempos(piezas, rng, d["alto"])
    tiempos_fondos(fondos, piezas, rng)
    cam = camara(piezas, d["alto"])
    tramos, alta, origen = asignar(piezas, cam, rng)
    out = {"alto": d["alto"], "piezas": piezas, "fondos": fondos, "camara": cam,
           "tramos": {str(k): v for k, v in tramos.items()}, "alta": {str(k): v for k, v in alta.items()},
           "escalones": ESCALONES, "anim": ANIM, "vista_css": VISTA_CSS, "t_fin": T_FIN,
           "dur": DUR, "t_estallido": T_ESTALLIDO, "t_salida": T_SALIDA, "origen_estallido": origen,
           "cta": cta(rng)}
    (OUT / "timeline.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    ts = sorted(p["t"] for p in piezas)
    print(f"piezas {len(piezas)} fondos {len(fondos)} · primera {ts[0]:.2f}s última {ts[-1]:.2f}s")
    for s in range(0, 11):
        print(f"  {s:2d}s  colocadas {sum(t <= s for t in ts):3d}  cámara {cam[s * 30]:6.0f}  agentes {agentes_en(s)}")
    est = sum(1 for a in tramos for tr in tramos[a] if tr.get("estallido"))
    print(f"estallido: {est} cursores desde el centro · agentes usados {len(alta)}")
    c = out["cta"]
    print("cta:", ", ".join(f"{p['nombre']} {p['t']:.2f}s ag{p['agente'] + 1:02d}" for p in c["piezas"]))


if __name__ == "__main__":
    main()
