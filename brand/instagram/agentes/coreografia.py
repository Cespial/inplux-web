"""Coreografía: cuándo se coloca cada pieza, qué agente la coloca, por dónde va cada cursor y
dónde está la cámara. Puro Python, semilla fija. Todas las coordenadas en px CSS de la página.

Uso: python3 coreografia.py   (escribe out/timeline.json e imprime un resumen)
"""
import json, math, random
from pathlib import Path

D = Path(__file__).parent
OUT = D / "out"
ANCHO = 1440

T_INI, T_FIN = 1.0, 10.3           # ventana de construcción
ESCALONES = [(1.0, 6), (3.0, 12), (5.0, 24), (6.8, 48)]   # segundo → agentes activos (escénico)
T_SALIDA = 10.45                   # los cursores se van
# caja de la página en pantalla (zona segura de historias: ni la barra de perfil ni la de respuesta)
BX, BY, BW, BH = 110, 560, 860, 920
VISTA_CSS = round(BH * 1440 / BW)  # alto de página visible durante la construcción (px CSS)
ANIM = .24                         # duración de la aparición de una pieza


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
    n = int(14 * fps) + 1
    frente = []
    for k in range(n):
        t = k / fps
        hechos = [y for (tp, y) in puntos if tp <= t + .25]
        frente.append(max(hechos[-12:]) if hechos else 0)
    # monótono y suave
    for k in range(1, n): frente[k] = max(frente[k], frente[k - 1])
    lim = alto - VISTA_CSS
    obj = [min(max(0, f - .62 * VISTA_CSS), lim) for f in frente]
    cam, v = [0.0] * n, 0.0
    for _ in range(3):  # suavizado de ida y vuelta
        sal = []
        for k in range(n):
            a, b = max(0, k - 18), min(n, k + 18)
            sal.append(sum(obj[a:b]) / (b - a))
        obj = sal
    for k in range(1, n): obj[k] = max(obj[k], obj[k - 1])
    return [min(max(0, c), lim) for c in obj]


def asignar(piezas, cam, rng):
    """Cada pieza a un agente libre y cercano. Devuelve los tramos de cada cursor."""
    N = ESCALONES[-1][1]
    libre = {}
    ultimo = {}
    tramos = {i: [] for i in range(N)}
    alta = {}
    esc = BW / ANCHO
    def fuera(t):  # punto de entrada por los bordes del lienzo, en px CSS
        k = min(len(cam) - 1, int(t * 30))
        lado = rng.choice(["izq", "der", "der", "izq", "abajo"])
        if lado == "izq": sx, sy = -40, rng.uniform(BY, BY + BH)
        elif lado == "der": sx, sy = 1120, rng.uniform(BY, BY + BH)
        else: sx, sy = rng.uniform(100, 980), BY + BH + 160
        return ((sx - BX) / esc, cam[k] + (sy - BY) / esc)
    for p in sorted(piezas, key=lambda p: p["t"]):
        activos = agentes_en(p["t"])
        meta = (p["x"] + min(p["w"] * .3, 46) + rng.uniform(-6, 6), p["y"] + min(p["h"] * .5, 26) + rng.uniform(-4, 4))
        cand = [a for a in range(activos) if libre.get(a, -1) <= p["t"] - .32]
        if not cand: cand = sorted(range(activos), key=lambda a: libre.get(a, -1))[:3]
        def dist(a):
            if a not in ultimo: return 600
            return math.dist(ultimo[a], meta)
        a = min(cand, key=lambda a: dist(a) + rng.uniform(0, 260))
        if a not in ultimo:
            alta[a] = next(t0 for t0, k in ESCALONES if a < k)
            ultimo[a] = fuera(alta[a])
            libre[a] = alta[a]
        llega = p["t"] - .04
        sale = max(libre[a], llega - rng.uniform(.38, .62))
        tramos[a].append({"t0": sale, "t1": llega, "de": ultimo[a], "a": meta, "pieza": p["id"]})
        p["agente"] = a
        libre[a] = p["t"] + ANIM + .02
        ultimo[a] = (meta[0] + rng.uniform(-30, 30), meta[1] + rng.uniform(10, 40))
    # salida
    for a in tramos:
        if a in ultimo:
            t0 = T_SALIDA + rng.uniform(0, .45)
            dest = fuera(t0)
            tramos[a].append({"t0": max(t0, libre[a]), "t1": max(t0, libre[a]) + .55, "de": ultimo[a], "a": dest, "pieza": None})
    return tramos, alta


def main():
    rng = random.Random(7)
    d, piezas, fondos = cargar()
    piezas = tiempos(piezas, rng, d["alto"])
    tiempos_fondos(fondos, piezas, rng)
    cam = camara(piezas, d["alto"])
    tramos, alta = asignar(piezas, cam, rng)
    out = {"alto": d["alto"], "piezas": piezas, "fondos": fondos, "camara": cam,
           "tramos": {str(k): v for k, v in tramos.items()}, "alta": {str(k): v for k, v in alta.items()},
           "escalones": ESCALONES, "anim": ANIM, "vista_css": VISTA_CSS, "t_fin": T_FIN}
    (OUT / "timeline.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    ts = sorted(p["t"] for p in piezas)
    print(f"piezas {len(piezas)} fondos {len(fondos)} · primera {ts[0]:.2f}s última {ts[-1]:.2f}s")
    for s in range(1, 11):
        print(f"  {s:2d}s  colocadas {sum(t <= s for t in ts):3d}  cámara {cam[s * 30]:6.0f}")
    print("agentes usados", len([a for a in tramos if tramos[a]]))


if __name__ == "__main__":
    main()
