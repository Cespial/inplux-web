"""Fuentes de cada figura. Coordenadas de objeto en el cuadro 1080×1920 (x0, y0, x1, y1)."""
from pathlib import Path
D = Path(__file__).parent
TRIP = Path.home() / "inplux-triptico-inmerxia/assets/mj"
MJ = D / "mj/originales"
FUENTES = {
    "g1": TRIP / "busto-audifonos-1.jpg", "g2": TRIP / "busto-vr-1.jpg",
    "g3": TRIP / "busto-celular-3.jpg", "g4": TRIP / "busto-gafas-griego-1.jpg",
    "gobia": TRIP / "busto-laptop-1.jpg", "tribai": MJ / "mj-tribai-1.jpg", "kelsen": MJ / "mj-kelsen-1.jpg",
    "laudos": MJ / "mj-laudos-1.jpg", "porkia": MJ / "mj-porkia-1.jpg", "mimotoya": MJ / "mj-mimotoya-3.jpg",
    "friso": MJ / "mj-friso-1.jpg",
}

# Objeto que se enciende en teal: rectángulos en el cuadro 1080×1920 + luz máxima (1 = todo; <1 = solo lo oscuro, metal) + luz mínima opcional (solo lo claro, papel)
OBJETO = {
    "gobia": [(430, 750, 1040, 1180, .5)],
    "tribai": [(620, 1030, 870, 1160, .55), (880, 1490, 1060, 1590, 1)],
    "kelsen": [(650, 330, 1030, 830, .5)],
    "laudos": [(260, 850, 990, 1060, 1, .78)],
    "porkia": [(820, 890, 990, 1080, 1)],
    "mimotoya": [(120, 1180, 1020, 1760, .62)],
}

# Escala y borde superior (px) para figuras cuyo objeto caería bajo el texto
AJUSTE = {"mimotoya": (0.74, 110), "friso": (1.14, -400)}

# Ganancia de luz para los bustos del gancho (las fuentes son más oscuras)
GANANCIA = {"g1": 1.35, "g2": 1.35, "g3": 1.25, "g4": 1.35, "friso": 1.6, "mimotoya": 1.25}

# Primer plano del rostro (épico): caja 9:16 en el cuadro 1080×1920 (x0, y0, ancho) que se re-trama a cuadro completo
CARA = {"gobia": (165, 0, 560), "tribai": (180, 0, 600), "kelsen": (300, 80, 560), "laudos": (220, 40, 560),
        "porkia": (160, 60, 600), "mimotoya": (200, 60, 760)}
