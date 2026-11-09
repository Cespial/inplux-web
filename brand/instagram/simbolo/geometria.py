"""Geometría del símbolo actual de INPLUX (public/brand/logos/inplux-mark-*.svg, caja 100×100):
tres barras redondeadas 42×13 (r 6,5) en (8,57) · (29,39) · (50,21); paso 21×18; la superior en teal."""
import math

BARRAS = [(8.0, 57.0), (29.0, 39.0), (50.0, 21.0)]     # de abajo arriba, esquina superior izquierda
BW, BH, R = 42.0, 13.0, 6.5
PASO_X, PASO_Y = 21.0, 18.0
X0, Y0, X1, Y1 = 8.0, 21.0, 92.0, 70.0                  # caja útil 84×49
ANCHO, ALTO = X1 - X0, Y1 - Y0
HORIZONTALES = [70.0, 57.0, 52.0, 39.0, 34.0, 21.0]     # de abajo arriba
VERTICALES = [8.0, 29.0, 50.0, 92.0]
CENTROS = [(x + BW / 2, y + BH / 2) for x, y in BARRAS]
ANGULO = math.degrees(math.atan2(PASO_Y, PASO_X))       # 40,6°
H_X = (2.0, 98.0)
V_Y = (14.0, 77.0)


def caja(i):
    x, y = BARRAS[i]
    return x, y, x + BW, y + BH


def estadio(i, n=14):
    """Perímetro de la barra i como polilínea cerrada: empieza en el punto inferior izquierdo del
    tramo recto y recorre en sentido horario (izquierda, arriba, derecha, abajo)."""
    x0, y0, x1, y1 = caja(i)
    cl, cr, cy = x0 + R, x1 - R, y0 + R
    pts = []
    for k in range(n + 1):                  # tapa izquierda: de abajo (90°) por la izquierda (180°) a arriba (270°)
        a = math.radians(90 + 180 * k / n)
        pts.append((cl + R * math.cos(a), cy + R * math.sin(a)))
    for k in range(n + 1):                  # tapa derecha: de arriba (270°) a abajo (450°)
        a = math.radians(270 + 180 * k / n)
        pts.append((cr + R * math.cos(a), cy + R * math.sin(a)))
    pts.append(pts[0])
    return pts


def mapa(alto_px, cx=540, cy=1010):
    """f(x, y): unidades → píxeles con la caja útil de `alto_px` de alto centrada en (cx, cy); y la escala k."""
    k = alto_px / ALTO
    ox, oy = cx - ANCHO * k / 2 - X0 * k, cy - ALTO * k / 2 - Y0 * k
    return (lambda x, y: (ox + x * k, oy + y * k)), k


def parcial(poli, u):
    """Prefijo de la polilínea que cubre la fracción u de su longitud."""
    if u <= 0:
        return []
    if u >= 1:
        return list(poli)
    largos = [math.dist(poli[i], poli[i + 1]) for i in range(len(poli) - 1)]
    meta = u * sum(largos)
    out = [poli[0]]
    for i, L in enumerate(largos):
        if meta >= L:
            out.append(poli[i + 1]); meta -= L
        else:
            a, b = poli[i], poli[i + 1]
            out.append((a[0] + (b[0] - a[0]) * meta / L, a[1] + (b[1] - a[1]) * meta / L))
            break
    return out


if __name__ == "__main__":
    print("caja útil", ANCHO, "×", ALTO, "paso", BARRAS[1][0] - BARRAS[0][0], BARRAS[0][1] - BARRAS[1][1],
          "ángulo %.1f°" % ANGULO, "centros", CENTROS)
    f, k = mapa(500)
    print("a 500 px:", f(X0, Y0), f(X1, Y1), "k", k, "perímetro pts", len(estadio(0)))
