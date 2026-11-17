"""Carrusel para pauta · «The State of the Art of AI in LATAM» · 10-dic-2026, 7:00 PM, Consulado de Colombia en San Francisco.

Seis láminas de 1080 × 1350 en el sistema blanco de la pieza elegida (build.d_blanco, versión «busto»):
  1 portada → 2 el gancho (15×) → 3 adopción vs. capital → 4 cinco brechas por sector → 5 quiénes hablan → 6 cierre.
Público: fundadores e inversionistas en San Francisco que quieren entender el ecosistema; por eso va en inglés.
Promesa: oírlo de primera mano de fundadores que construyen en América Latina, con los datos como gancho.

Todas las cifras están verificadas con página en ../soon-sf/FUENTES.md. En las láminas los números van en tinta
y el color solo en las barras (el teal es acento, no texto de datos).
uso: python3 carrusel.py   (escribe los HTML y renderiza a exports/carrusel/)
"""
import importlib.util, subprocess, sys
from pathlib import Path

AQUI = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("build", AQUI / "build.py")
b = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(b)
TINTA, GRIS, TEAL, FILETE, BLANCO = b.TINTA, b.GRIS, b.TEAL_OSC, b.FILETE, b.BLANCO
N = 6
EVENTO = "The State of the Art of AI in LATAM"
MICRO = f"font-size:15px;font-weight:600;letter-spacing:.22em;text-transform:uppercase"


def lamina(n, contenido, fondo=False):
    simbolo = b.g.MARCA.format(s=42).replace("#fff", TINTA).replace("#15dcc4", "#0d7d74")
    cabeza = b.g.head().replace(f"background:{b.BLACK}}}", f"background:{BLANCO}}}")
    return f"""{cabeza}{b.SUTIL.format("claro") if fondo else ""}
<div style="position:absolute;left:72px;right:72px;top:48px;height:88px;display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:10px">{simbolo}<img src="assets/wordmark-black.svg" style="height:25px;display:block"></div>
  <img src="assets/consulado-sf.png" style="height:88px;display:block">
</div>
<div style="position:absolute;left:72px;right:72px;top:156px;height:1.5px;background:{FILETE}"></div>
{contenido}
<div style="position:absolute;left:72px;right:72px;bottom:44px;display:flex;justify-content:space-between;align-items:center">
  <div style="{MICRO};font-size:14px;color:{GRIS}">{EVENTO} · Dec 10 · San Francisco</div>
  <div style="{MICRO};font-size:14px;color:{GRIS}">{n} / {N}</div>
</div>
<div style="position:absolute;left:0;right:0;bottom:0">{b.TRICOLOR.format(h=12, w="100%")}</div>
</div></body></html>"""


def kicker(texto, y=196):
    return f'<div style="position:absolute;left:72px;top:{y}px;{MICRO};color:{TEAL}">{texto}</div>'


def fuente(texto, y=1232):
    return f'<div style="position:absolute;left:72px;right:72px;top:{y}px;font-size:17px;line-height:1.35;color:{GRIS}">{texto}</div>'


def titular(texto, y, tam=74):
    return (f'<div style="position:absolute;left:68px;right:72px;top:{y}px;font-size:{tam}px;font-weight:500;'
            f'letter-spacing:-.045em;line-height:1.0;color:{TINTA}">{texto}</div>')


# ───────── 1 · portada: la pieza elegida, con la promesa en vez de la franja de datos ─────────
def l1_portada():
    def remate(suelo):
        return f"""<div style="position:absolute;left:72px;right:72px;top:{suelo + 172}px;border-top:1.5px solid {FILETE};padding-top:26px;display:flex;justify-content:space-between;align-items:flex-end">
  <div>
    <div style="font-size:38px;font-weight:600;letter-spacing:-.03em;line-height:1.08;color:{TINTA}">First-hand, from founders<br>building in Latin America.</div>
    <div style="margin-top:16px;font-size:23px;color:{GRIS}">{b.FECHA} · <span style="color:{TINTA};font-weight:600">{b.HORA}</span> · Consulate of Colombia, {b.CIUDAD}</div>
  </div>
  <div style="{MICRO};color:{TEAL};white-space:nowrap;padding-bottom:4px">Swipe →</div>
</div>"""
    return b.d_blanco(sutil=True, alto=318, techo=552, aire=24, remate=remate, contador=f"1 / {N}")


# ───────── 2 · el gancho ─────────
def l2_gancho():
    def barra(y, rotulo, valor, ancho, color):
        return f"""<div style="position:absolute;left:72px;right:72px;top:{y}px">
  <div style="font-size:25px;color:{GRIS}">{rotulo}</div>
  <div style="margin-top:12px;display:flex;align-items:center;gap:20px">
    <i style="display:block;width:{ancho}px;height:40px;background:{color};border-radius:0 4px 4px 0"></i>
    <span style="font-size:36px;font-weight:600;letter-spacing:-.02em;color:{TINTA};white-space:nowrap">{valor}</span>
  </div>
</div>"""
    return lamina(2, kicker("Why this conversation")
                  + f'<div style="position:absolute;left:58px;top:206px;font-size:400px;font-weight:700;letter-spacing:-.06em;line-height:1;color:{TINTA}">15×</div>'
                  + titular("Latin America buys 15 times<br>more AI than it funds.", 640, 68)
                  + barra(832, "Share of the world’s paid AI app market", "more than 15%", 640, TEAL)
                  + barra(960, "Share of global private AI investment", "about 1%", 43, "#a8a39b")
                  + f'<div style="position:absolute;left:72px;top:1110px;font-size:30px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">The demand is there. The capital isn’t yet.</div>'
                  + fuente("Source: Latin American AI Index (ILIA) 2026, CENIA–ECLAC, p. 66.", 1192))


# ───────── 3 · adopción por delante del capital ─────────
def l3_adopcion():
    def dato(y, num, texto, nota):
        return f"""<div style="position:absolute;left:72px;right:72px;top:{y}px;height:262px;border-top:1.5px solid {FILETE};display:flex;align-items:center;gap:36px">
  <div style="width:400px;font-size:150px;font-weight:700;letter-spacing:-.055em;line-height:1;color:{TINTA};white-space:nowrap">{num}</div>
  <div style="flex:1">
    <div style="font-size:33px;font-weight:600;letter-spacing:-.025em;line-height:1.14;color:{TINTA}">{texto}</div>
    <div style="margin-top:10px;font-size:22px;line-height:1.3;color:{GRIS}">{nota}</div>
  </div>
</div>"""
    return lamina(3, kicker("The state of play")
                  + titular("People adopted it.<br>Governments are moving.", 232, 74)
                  + dato(416, "16.1%", "of people aged 15–64 actively use generative AI.", "Average of 20 countries.")
                  + dato(678, "85%", "of countries have a national AI strategy, in force or in the works.", "Up from 63% in the previous edition.")
                  + dato(940, "1.1%", "of global AI investment, for 8.8% of the world’s population.", "And 6.6% of world GDP.")
                  + f'<div style="position:absolute;left:72px;right:72px;top:1202px;height:1.5px;background:{FILETE}"></div>'
                  + fuente("Sources: ILIA 2026 (CENIA–ECLAC), pp. 22 and 35; ILIA 2025, p. 5.", 1218))


# ───────── 4 · cinco brechas ─────────
BRECHAS = [
    ("Small business", "6.8%", "of small firms use AI.", "Large firms: 27.6%."),
    ("Health", "2.0", "doctors per 1,000 people.", "OECD average: 3.5."),
    ("Agriculture", "78%", "of the region’s 2,656 agtechs", "are in one country: Brazil."),
    ("Finance", "3 in 10", "adults still have", "no financial account."),
    ("Justice", "≈ 2×", "Courts carry twice the cases", "they resolve in a year."),
]


def l4_brechas():
    def fila(i, sector, num, l1, l2):
        return f"""<div style="height:150px;border-top:1.5px solid {FILETE};display:flex;align-items:center">
  <div style="width:228px">
    <div style="{MICRO};font-size:14px;color:{TEAL}">0{i}</div>
    <div style="margin-top:8px;font-size:28px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">{sector}</div>
  </div>
  <div style="width:290px;font-size:{74 if len(num) > 5 else 92}px;font-weight:700;letter-spacing:-.05em;line-height:1;color:{TINTA};white-space:nowrap">{num}</div>
  <div style="flex:1;font-size:26px;line-height:1.25;color:{TINTA}">{l1}<br><span style="color:{GRIS}">{l2}</span></div>
</div>"""
    filas = "".join(fila(i, *x) for i, x in enumerate(BRECHAS, 1))
    return lamina(4, kicker("Where the openings are")
                  + titular("Five gaps. Five openings.", 232, 74)
                  + f'<div style="position:absolute;left:72px;right:72px;top:352px;border-bottom:1.5px solid {FILETE}">{filas}</div>'
                  + fuente("Sources: ILIA 2026 · OECD, Health at a Glance LAC 2023 · Radar Agtech LAC 2026 · "
                           "World Bank, Global Findex 2025 · CEJA, Judicial Congestion Index 2025.", 1128)
                  + f'<div style="position:absolute;left:72px;top:1202px;font-size:26px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">'
                    f'We’ll walk through each one on Dec 10.</div>')


# ───────── 5 · quiénes hablan ─────────
TEMAS = [  # PROPUESTA de Claude: confirmar con Cristian, Jaime y Santiago que este es el temario
    "Where the demand is, sector by sector",
    "What it takes to ship AI in production in the region",
    "How to get in: partners, talent and the public sector",
]


def l5_quienes():
    def persona(i, clave, nombre, cargo, casa):
        return f"""<div style="height:156px;border-top:1.5px solid {FILETE};display:flex;align-items:center;gap:30px">
  <img src="recortes/av_{clave}.png" style="width:108px;height:108px;display:block;border-radius:50%">
  <div style="flex:1">
    <div style="font-size:42px;font-weight:600;letter-spacing:-.03em;line-height:1;color:{TINTA}">{nombre}</div>
    <div style="margin-top:11px;{MICRO};color:{GRIS}">{cargo} · <span style="color:{TINTA}">{casa}</span></div>
  </div>
  <div style="{MICRO};color:{TEAL}">0{i}</div>
</div>"""
    personas = "".join(persona(i, *p) for i, p in enumerate(b.PONENTES, 1))
    temas = "".join(f'<div style="display:flex;gap:16px;margin-top:18px;font-size:33px;line-height:1.25;color:{TINTA}">'
                    f'<span style="color:{TEAL};font-weight:600">→</span><span>{t}</span></div>' for t in TEMAS)
    return lamina(5, kicker("Who you’ll hear from")
                  + titular("Not a report.<br>Founders who build there.", 232, 74)
                  + f'<div style="position:absolute;left:72px;right:72px;top:404px;font-size:28px;line-height:1.32;color:{GRIS}">'
                    f'A talk, a panel and an open conversation with people building and studying AI in Latin America.</div>'
                  + f'<div style="position:absolute;left:72px;right:72px;top:520px;border-bottom:1.5px solid {FILETE}">{personas}</div>'
                  + f'<div style="position:absolute;left:72px;right:72px;top:1030px"><div style="{MICRO};color:{GRIS}">What you’ll leave with</div>{temas}</div>')


# ───────── 6 · cierre ─────────
def l6_cierre():
    def celda(rotulo, valor, detalle):
        return f"""<div style="padding:26px 0;border-top:1.5px solid {FILETE};display:flex;align-items:baseline">
  <div style="width:190px;{MICRO};color:{GRIS}">{rotulo}</div>
  <div><div style="font-size:40px;font-weight:600;letter-spacing:-.03em;line-height:1.05;color:{TINTA}">{valor}</div>
  <div style="margin-top:8px;font-size:25px;color:{GRIS}">{detalle}</div></div>
</div>"""
    return lamina(6, kicker("Join us")
                  + titular("Come hear it<br>first-hand.", 232, 128)
                  + f'<div style="position:absolute;left:72px;right:72px;top:560px;border-bottom:1.5px solid {FILETE}">'
                  + celda("When", f"{b.FECHA} · {b.HORA}", "Talk · Panel · Networking")
                  + celda("Where", "Consulate General of Colombia", f"{b.DIRECCION} · {b.CIUDAD}")
                  + celda("Hosts", "INPLUX × Consulado de Colombia", "en San Francisco") + '</div>'
                  + f'<div style="position:absolute;left:72px;top:1060px;display:flex;align-items:center;gap:22px">'
                    f'<span style="display:inline-block;background:{TINTA};color:#fff;border-radius:999px;padding:20px 38px;font-size:30px;font-weight:600;letter-spacing:-.01em">Save your seat →</span>'
                    f'<span style="font-size:24px;color:{TINTA}">Limited seats. RSVP at the link.</span></div>', fondo=True)


PIEZAS = {
    "carrusel_1_portada": l1_portada, "carrusel_2_gancho": l2_gancho, "carrusel_3_adopcion": l3_adopcion,
    "carrusel_4_brechas": l4_brechas, "carrusel_5_quienes": l5_quienes, "carrusel_6_cierre": l6_cierre,
}
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if __name__ == "__main__":
    png, jpg = AQUI / "exports/carrusel/png", AQUI / "exports/carrusel/jpg"
    png.mkdir(parents=True, exist_ok=True); jpg.mkdir(parents=True, exist_ok=True)
    for nombre in sys.argv[1:] or PIEZAS:
        (AQUI / f"{nombre}.html").write_text(PIEZAS[nombre](), encoding="utf-8")
        p, j = png / f"{nombre}.png", jpg / f"{nombre}.jpg"
        p.unlink(missing_ok=True)
        try:
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={p}",
                            "--window-size=1080,1350", "--virtual-time-budget=6000", "--force-color-profile=srgb",
                            "--allow-file-access-from-files", (AQUI / f"{nombre}.html").as_uri()], timeout=40, capture_output=True)
        except subprocess.TimeoutExpired:
            pass
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92", "--matchTo",
                        "/System/Library/ColorSync/Profiles/sRGB Profile.icc", str(p), "--out", str(j)], capture_output=True)
        print("ok" if p.exists() else "FALLÓ", nombre)
