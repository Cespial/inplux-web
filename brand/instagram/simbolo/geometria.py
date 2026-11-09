"""Geometría del símbolo E1 «Masa» en sus unidades (viewBox 74,39 × 55; y crece hacia abajo).

Dos variantes, las dos de ~/inplux-web-marca/brand/refinamiento/exploracion/:
- «claro» (masa-E1-claro.svg, tinta sobre claro): plantas 14,61, hueco 5,58 = planta/φ². Es la
  geometría que se dibuja con cotas.
- «oscuro» (masa-E1-oscuro.svg y el lockup a10): la misma con corrección óptica para claro sobre
  oscuro (plantas 14,17; cada borde interior entra 0,22).
"""
import math

PHI = (1 + 5 ** .5) / 2
ANCHO, ALTO = 74.39, 55.0
PLANTA, HUECO, PASO = 14.61, 5.58, 12.48
# plantas de abajo arriba: (x0, y0, x1, y1); la cima lleva el chaflán de CHAFLAN[v][0] a (58,96, y1)
PLANTAS = {
    "claro": [(0.0, 40.39, 74.39, 55.0), (12.48, 20.19, 66.67, 34.81), (24.96, 0.0, 58.96, 14.61)],
    "oscuro": [(0.0, 40.83, 74.39, 55.0), (12.48, 20.41, 66.67, 34.59), (24.96, 0.0, 58.96, 14.17)],
}
CHAFLAN_X = {"claro": 44.35, "oscuro": 44.79}
HORIZONTALES = [55.0, 40.39, 34.81, 20.19, 14.61, 0.0]   # de abajo arriba (retícula, claro)
H_X = (-5.2, 79.59)
DIAGONALES = [((-4.02, 61.5), (38.01, -6.5)), ((76.87, 61.5), (50.9, -6.5))]


def poligono(i, v="claro", chaflan=True):
    x0, y0, x1, y1 = PLANTAS[v][i]
    if i == 2 and chaflan:
        return [(x0, y1), (x0, y0), (CHAFLAN_X[v], y0), (x1, y1)]
    return [(x0, y1), (x0, y0), (x1, y0), (x1, y1)]


def perimetro(i, v="claro", chaflan=False):
    """Polilínea cerrada de la planta i, desde abajo-izquierda en sentido horario."""
    p = poligono(i, v, chaflan)
    return p + [p[0]]


def recorte_x(i, xs, v="claro", chaflan=True):
    """Polígono de la planta i recortado a x ≤ xs (para el relleno por barrido)."""
    x0, y0, x1, y1 = PLANTAS[v][i]
    xs = min(xs, x1)
    if xs <= x0:
        return []
    if i == 2 and chaflan:
        cx = CHAFLAN_X[v]
        if xs <= cx:
            return [(x0, y1), (x0, y0), (xs, y0), (xs, y1)]
        return [(x0, y1), (x0, y0), (cx, y0), (xs, y0 + (xs - cx)), (xs, y1)]
    return [(x0, y1), (x0, y0), (xs, y0), (xs, y1)]


def mapa(alto_px, cx=540, cy=1010):
    """f(x, y) pasa unidades a píxeles con el símbolo de `alto_px` centrado en (cx, cy)."""
    k = alto_px / ALTO
    ox, oy = cx - ANCHO * k / 2, cy - ALTO * k / 2
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
    for v, P in PLANTAS.items():
        print(v, "base", P[0][2] - P[0][0], "altura", P[0][3] - P[2][1],
              "plantas", [round(p[3] - p[1], 2) for p in P],
              "huecos", round(P[0][1] - P[1][3], 2), round(P[1][1] - P[2][3], 2))
    print("planta/φ²", round(PLANTA / PHI ** 2, 2), "cima", 58.96 - 24.96, "paso", 12.48, 24.96 - 12.48,
          "chaflán 45°:", 58.96 - 44.35 == 14.61)
