"""Arena de puntos: la receta de inplux.co/adeli (deck/arena.js + scripts/formas.py) en numpy.
Granos = cuadrados pequeños que viajan y forman figuras; los que sobran quedan como polvo."""
import numpy as np

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0 + 1 / 32
MAXP = 7000


def trama(mascara, celda, origen=(0, 0), tope=MAXP, rng=None):
    """Puntos de una máscara L (0–255) tramada con Bayer 4×4 a `celda` px: devuelve xs, ys en píxeles."""
    a = np.asarray(mascara, dtype=np.float32) / 255.0
    h, w = a.shape
    ch, cw = h // celda, w // celda
    if ch == 0 or cw == 0:
        return np.zeros(0), np.zeros(0)
    b = a[:ch * celda, :cw * celda].reshape(ch, celda, cw, celda).mean(axis=(1, 3))
    um = np.tile(BAYER, (ch // 4 + 1, cw // 4 + 1))[:ch, :cw]
    ys, xs = np.nonzero(b > um)
    xs = origen[0] + (xs + .5) * celda
    ys = origen[1] + (ys + .5) * celda
    if len(xs) > tope:
        rng = rng or np.random.default_rng(1)
        sel = np.sort(rng.choice(len(xs), tope, replace=False))
        xs, ys = xs[sel], ys[sel]
    return xs.astype(np.float32), ys.astype(np.float32)


def emparejar(ax, ay, bx, by, semilla):
    """A cada destino le asigna un punto de origen por franjas horizontales y, dentro de cada una, de izquierda a derecha:
    la forma se transforma en vez de volverse una nube. Devuelve (origen de cada destino, orígenes sobrantes).
    (Copiado de soon-sf/reel/reel2.py.)"""
    rng = np.random.default_rng(semilla)
    orden = lambda x, y: np.lexsort((x + rng.normal(0, 45, len(x)), np.floor((y + rng.normal(0, 40, len(y))) / 130)))
    oa, ob = orden(ax, ay), orden(bx, by)
    n = len(bx)
    fuente = np.empty(n, int)
    fuente[ob] = oa[np.linspace(0, len(ax) - 1, n).astype(int)]
    return fuente, np.setdiff1d(np.arange(len(ax)), fuente)


def pila(n, W, H, rng, alto=.22, ancho=1.15, y0=None):
    """Montón de arena al pie del lienzo (arranque de arena.js)."""
    a, b = rng.uniform(size=n), rng.uniform(size=n)
    u = (a + b) / 2 - .5
    xs = W / 2 + u * W * ancho
    ys = (H if y0 is None else y0) - rng.uniform(size=n) ** 1.6 * (1 - np.abs(u) * 2).clip(0, 1) * H * alto
    return xs.astype(np.float32), ys.astype(np.float32)


def ease_np(u):
    u = np.clip(u, 0, 1)
    return np.where(u < .5, 4 * u ** 3, 1 - (-2 * u + 2) ** 3 / 2)


def vuelo(sx, sy, tx, ty, t, retraso, dur, curva):
    """Posición de cada grano en el instante t (s): sale de (sx, sy) tras `retraso`, llega a (tx, ty) en `dur`,
    con un arco lateral `curva` (px) y un leve levantamiento. Devuelve xs, ys, avance e (0–1)."""
    e = ease_np((t - retraso) / np.maximum(dur, 1e-6))
    k = np.sin(np.pi * e)
    xs = sx + (tx - sx) * e + curva * k * .6
    ys = sy + (ty - sy) * e - np.abs(curva) * k * .35
    return xs, ys, e


def pintar(arr, xs, ys, tam, color, alfa=1.0, mask=None):
    """Pinta cuadrados de `tam` px en el array RGB (H×W×3, uint8) sin bucles por punto."""
    if mask is not None:
        xs, ys = xs[mask], ys[mask]
    if len(xs) == 0:
        return
    H, W = arr.shape[:2]
    x0 = np.round(xs - tam / 2).astype(int); y0 = np.round(ys - tam / 2).astype(int)
    col = np.array(color, dtype=np.float32)
    for dy in range(tam):
        for dx in range(tam):
            x, y = x0 + dx, y0 + dy
            ok = (x >= 0) & (x < W) & (y >= 0) & (y < H)
            if alfa >= 1:
                arr[y[ok], x[ok]] = col
            else:
                v = arr[y[ok], x[ok]].astype(np.float32)
                arr[y[ok], x[ok]] = (v + (col - v) * alfa).astype(np.uint8)


if __name__ == "__main__":
    from PIL import Image, ImageDraw
    m = Image.new("L", (400, 120), 0); ImageDraw.Draw(m).rounded_rectangle([20, 20, 380, 100], 40, fill=255)
    xs, ys = trama(m, 6)
    rng = np.random.default_rng(1)
    px, py = pila(len(xs), 480, 300, rng)
    f, _ = emparejar(px, py, xs, ys, 3)
    arr = np.full((300, 480, 3), 12, np.uint8)
    for t, col in ((0.0, (90, 90, 90)), (0.5, (160, 160, 160)), (1.0, (246, 242, 236))):
        x, y, _ = vuelo(px[f], py[f], xs + 40, ys + 40, t, rng.uniform(0, .2, len(xs)), .8, rng.normal(0, 40, len(xs)))
        pintar(arr, x, y, 3, col)
    Image.fromarray(arr).save("/private/tmp/claude-501/-Users-cristianespinal/3d58e9c2-27e2-4927-80e9-e8c85f54c406/scratchpad/arena_test.png")
    print("puntos", len(xs))
