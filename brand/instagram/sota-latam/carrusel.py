"""Carrusel para pauta · «The State of the Art of AI in LATAM» · 10-dic-2026, 7:00 PM, Consulado de Colombia en San Francisco.

Siete láminas de 1080 × 1350 en el sistema blanco de la pieza elegida (build.d_blanco, versión «busto»):
  1 portada → 2 el gancho (15×) → 3 adopción vs. capital → 4 cinco brechas por sector → 5 gobierno (vertical principal
  de INPLUX) → 6 quiénes hablan → 7 cierre.
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
N = 7
EVENTO = "The State of the Art of AI in LATAM"   # el nombre del evento no se traduce
IDIOMA = "en"


def t(en, es):
    """Texto según el idioma activo (lo fija generar())."""
    return es if IDIOMA == "es" else en


PONENTES_ES = [("santiago", "Santiago Jiménez", "Investigador", "EAFIT"), ("cristian", "Cristian Espinal", "CTO", "INPLUX"),
               ("jaime", "Jaime Cano", "CEO", "INPLUX")]
FECHA_ES, HORA_ES = "Jue 10 dic 2026", "7:00 p. m."


def fecha(): return t(b.FECHA, FECHA_ES)
def hora(): return t(b.HORA, HORA_ES)
def ponentes(): return t(b.PONENTES, PONENTES_ES)
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
  <div style="{MICRO};font-size:14px;color:{GRIS}">{EVENTO} · {t("Dec 10", "10 dic")} · San Francisco</div>
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
    <div style="font-size:38px;font-weight:600;letter-spacing:-.03em;line-height:1.08;color:{TINTA}">{t("First-hand, from founders<br>building in Latin America.", "De primera mano, de fundadores<br>que construyen en América Latina.")}</div>
    <div style="margin-top:16px;font-size:23px;color:{GRIS}">{fecha()} · <span style="color:{TINTA};font-weight:600">{hora()}</span> · {t("Consulate of Colombia", "Consulado de Colombia")}, {b.CIUDAD}</div>
  </div>
  <div style="{MICRO};color:{TEAL};white-space:nowrap;padding-bottom:4px">{t("Swipe", "Desliza")} →</div>
</div>"""
    original = b.PONENTES
    b.PONENTES = ponentes()            # d_blanco lee los cargos del módulo
    try:
        html = b.d_blanco(sutil=True, alto=318, techo=552, aire=24, remate=remate, contador=f"1 / {N}")
    finally:
        b.PONENTES = original
    return html.replace("Dec 10<br>2026", t("Dec 10<br>2026", "10 dic<br>2026"))


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
    return lamina(2, kicker(t("Why this conversation", "Por qué esta conversación"))
                  + f'<div style="position:absolute;left:58px;top:206px;font-size:400px;font-weight:700;letter-spacing:-.06em;line-height:1;color:{TINTA}">15×</div>'
                  + titular(t("Latin America buys 15 times<br>more AI than it funds.", "América Latina compra 15 veces<br>más IA de la que financia."), 640, t(68, 64))
                  + barra(832, t("Share of the world’s paid AI app market", "Participación en el mercado mundial de apps de IA de pago"), t("more than 15%", "más del 15 %"), 640, TEAL)
                  + barra(960, t("Share of global private AI investment", "Participación en la inversión privada mundial en IA"), t("about 1%", "cerca del 1 %"), 43, "#a8a39b")
                  + f'<div style="position:absolute;left:72px;top:1110px;font-size:30px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">{t("The demand is there. The capital isn’t yet.", "La demanda ya está. El capital, todavía no.")}</div>'
                  + fuente(t("Source: Latin American AI Index (ILIA) 2026, CENIA–ECLAC, p. 66.", "Fuente: Índice Latinoamericano de Inteligencia Artificial (ILIA) 2026, CENIA–CEPAL, p. 66."), 1192))


# ───────── 3 · adopción por delante del capital ─────────
def l3_adopcion():
    def dato(y, num, texto, nota):
        return f"""<div style="position:absolute;left:72px;right:72px;top:{y}px;height:262px;border-top:1.5px solid {FILETE};display:flex;align-items:center;gap:36px">
  <div style="width:{t(400, 440)}px;font-size:150px;font-weight:700;letter-spacing:-.055em;line-height:1;color:{TINTA};white-space:nowrap">{num}</div>
  <div style="flex:1">
    <div style="font-size:33px;font-weight:600;letter-spacing:-.025em;line-height:1.14;color:{TINTA}">{texto}</div>
    <div style="margin-top:10px;font-size:22px;line-height:1.3;color:{GRIS}">{nota}</div>
  </div>
</div>"""
    return lamina(3, kicker(t("The state of play", "Dónde estamos"))
                  + titular(t("People adopted it.<br>Governments are moving.", "La gente ya la adoptó.<br>Los gobiernos se mueven."), 232, 74)
                  + dato(416, t("16.1%", "16,1\u202f%"), t("of people aged 15–64 actively use generative AI.", "de las personas de 15 a 64 años usa activamente IA generativa."),
                         t("Average of 20 countries.", "Promedio de 20 países."))
                  + dato(678, t("85%", "85\u202f%"), t("of countries have a national AI strategy, in force or in the works.", "de los países tiene una estrategia nacional de IA, vigente o en elaboración."),
                         t("Up from 63% in the previous edition.", "Frente al 63 % de la edición anterior."))
                  + dato(940, t("1.1%", "1,1\u202f%"), t("of global AI investment, for 8.8% of the world’s population.", "de la inversión mundial en IA, para el 8,8 % de la población del mundo."),
                         t("And 6.6% of world GDP.", "Y el 6,6 % del PIB mundial."))
                  + f'<div style="position:absolute;left:72px;right:72px;top:1202px;height:1.5px;background:{FILETE}"></div>'
                  + fuente(t("Sources: ILIA 2026 (CENIA–ECLAC), pp. 22 and 35; ILIA 2025, p. 5.", "Fuentes: ILIA 2026 (CENIA–CEPAL), pp. 22 y 35; ILIA 2025, p. 5."), 1218))


# ───────── 4 · cinco brechas ─────────
BRECHAS = [
    ("Small business", "6.8%", "of small firms use AI.", "Large firms: 27.6%."),
    ("Health", "2.0", "doctors per 1,000 people.", "OECD average: 3.5."),
    ("Agriculture", "78%", "of the region’s 2,656 agtechs", "are in one country: Brazil."),
    ("Finance", "3 in 10", "adults still have", "no financial account."),
    ("Justice", "≈ 2×", "Courts carry twice the cases", "they resolve in a year."),
]
BRECHAS_ES = [
    ("Pymes", "6,8\u202f%", "de las empresas pequeñas usa IA.", "Las grandes: 27,6 %."),
    ("Salud", "2,0", "médicos por 1.000 habitantes.", "Promedio OCDE: 3,5."),
    ("Agro", "78\u202f%", "de las 2.656 agtechs de la región", "está en un solo país: Brasil."),
    ("Finanzas", "3 de 10", "adultos siguen", "sin una cuenta financiera."),
    ("Justicia", "≈ 2×", "Los juzgados cargan el doble", "de lo que resuelven al año."),
]


def l4_brechas():
    es = IDIOMA == "es"
    alto, arriba = (138, 412) if es else (150, 352)      # en español el titular va en dos líneas

    def fila(i, sector, num, l1, l2):
        return f"""<div style="height:{alto}px;border-top:1.5px solid {FILETE};display:flex;align-items:center">
  <div style="width:{200 if es else 228}px">
    <div style="{MICRO};font-size:14px;color:{TEAL}">0{i}</div>
    <div style="margin-top:8px;font-size:28px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">{sector}</div>
  </div>
  <div style="width:{280 if es else 290}px;font-size:{74 if len(num) > 5 else 92}px;font-weight:700;letter-spacing:-.05em;line-height:1;color:{TINTA};white-space:nowrap">{num}</div>
  <div style="flex:1;font-size:26px;line-height:1.25;color:{TINTA};white-space:nowrap">{l1}<br><span style="color:{GRIS}">{l2}</span></div>
</div>"""
    filas = "".join(fila(i, *x) for i, x in enumerate(t(BRECHAS, BRECHAS_ES), 1))
    return lamina(4, kicker(t("Where the openings are", "Dónde están las oportunidades"))
                  + titular(t("Five gaps. Five openings.", "Cinco brechas.<br>Cinco oportunidades."), 232, 74)
                  + f'<div style="position:absolute;left:72px;right:72px;top:{arriba}px;border-bottom:1.5px solid {FILETE}">{filas}</div>'
                  + fuente(t("Sources: ILIA 2026 · OECD, Health at a Glance LAC 2023 · Radar Agtech LAC 2026 · "
                             "World Bank, Global Findex 2025 · CEJA, Judicial Congestion Index 2025.",
                             "Fuentes: ILIA 2026 · OCDE, Health at a Glance LAC 2023 · Radar Agtech LAC 2026 · "
                             "Banco Mundial, Global Findex 2025 · CEJA, Índice de Congestión Judicial 2025."), 1128)
                  + f'<div style="position:absolute;left:72px;top:1202px;font-size:26px;font-weight:600;letter-spacing:-.02em;color:{TINTA}">'
                    f'{t("We’ll walk through each one on Dec 10.", "El 10 de diciembre recorremos cada una.")}</div>')


# ───────── 5 · gobierno, la vertical principal de INPLUX ─────────
def l5_gobierno():
    """Cifras: OCDE, Government at a Glance: Latin America and the Caribbean 2024, sección 7.1 «Size of public procurement»
    (leída el 17-nov-2026): compras públicas = 17,4 % del gasto público total (2021) y 6,6 % del PIB (2019-2021);
    41,7 % de esas compras las hacen los gobiernos locales y 33,5 % el nivel central (2021).
    Gobia: «Hacer visible la operación de un municipio» y «centro de mando» son textos del sitio (src/content/work.ts)."""
    def dato(y, num, texto, nota):
        return f"""<div style="position:absolute;left:72px;right:72px;top:{y}px;height:222px;border-top:1.5px solid {FILETE};display:flex;align-items:center;gap:36px">
  <div style="width:{t(410, 450)}px;font-size:150px;font-weight:700;letter-spacing:-.055em;line-height:1;color:{TINTA};white-space:nowrap">{num}</div>
  <div style="flex:1">
    <div style="font-size:33px;font-weight:600;letter-spacing:-.025em;line-height:1.14;color:{TINTA}">{texto}</div>
    <div style="margin-top:10px;font-size:22px;line-height:1.3;color:{GRIS}">{nota}</div>
  </div>
</div>"""
    tarjeta = f"""<div style="position:absolute;left:72px;right:72px;top:872px;background:{TINTA};border-radius:18px;padding:34px 40px">
  <div style="{MICRO};color:#15dcc4">{t("That’s where INPLUX works", "Ahí trabaja INPLUX")}</div>
  <div style="margin-top:14px;font-size:35px;font-weight:500;letter-spacing:-.025em;line-height:1.16;color:#fff">{t(
      "We build Gobia: a command center that makes a municipality’s operation visible.",
      "Construimos Gobia: un centro de mando que hace visible la operación de un municipio.")}</div>
</div>"""
    return lamina(5, kicker(t("Government · INPLUX’s main vertical", "Gobierno · la vertical principal de INPLUX"))
                  + titular(t("The biggest buyer in the region<br>is the State.", "El mayor comprador de la región<br>es el Estado."), 232, 66)
                  + dato(400, t("17.4%", "17,4\u202f%"), t("of all government spending is public procurement.", "de todo el gasto público son compras públicas."),
                         t("That is 6.6% of the region’s GDP.", "Es el 6,6 % del PIB de la región."))
                  + dato(622, t("41.7%", "41,7\u202f%"), t("of that procurement is done by local governments.", "de esas compras las hacen los gobiernos locales."),
                         t("Central governments: 33.5%.", "Los gobiernos centrales: 33,5 %."))
                  + f'<div style="position:absolute;left:72px;right:72px;top:844px;height:1.5px;background:{FILETE}"></div>'
                  + tarjeta
                  + f'<div style="position:absolute;left:72px;right:72px;top:1118px;font-size:26px;font-weight:600;letter-spacing:-.02em;line-height:1.25;color:{TINTA}">'
                    f'{t("On Dec 10: what it takes to sell and ship AI to governments in Latin America.", "El 10 de diciembre: qué exige venderle y entregarle IA al Estado en América Latina.")}</div>'
                  + fuente(t("Source: OECD, Government at a Glance: Latin America and the Caribbean 2024, section 7.1 (2021 data).",
                             "Fuente: OCDE, Government at a Glance: Latin America and the Caribbean 2024, sección 7.1 (datos de 2021)."), 1218))


# ───────── 6 · quiénes hablan ─────────
TEMAS = [  # PROPUESTA de Claude: confirmar con Cristian, Jaime y Santiago que este es el temario
    "Where the demand is, sector by sector",
    "What it takes to ship AI in production in the region",
    "How to get in: partners, talent and the public sector",
]
TEMAS_ES = [
    "Dónde está la demanda, sector por sector",
    "Qué exige llevar IA a producción en la región",
    "Cómo entrar: aliados, talento y sector público",
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
    personas = "".join(persona(i, *p) for i, p in enumerate(ponentes(), 1))
    temas = "".join(f'<div style="display:flex;gap:16px;margin-top:18px;font-size:33px;line-height:1.25;color:{TINTA}">'
                    f'<span style="color:{TEAL};font-weight:600">→</span><span>{x}</span></div>' for x in t(TEMAS, TEMAS_ES))
    return lamina(6, kicker(t("Who you’ll hear from", "A quiénes vas a oír"))
                  + titular(t("Not a report.<br>Founders who build there.", "No es un informe.<br>Fundadores que construyen allá."), 232, t(74, 66))
                  + f'<div style="position:absolute;left:72px;right:72px;top:404px;font-size:28px;line-height:1.32;color:{GRIS}">'
                    f'{t("A talk, a panel and an open conversation with people building and studying AI in Latin America.", "Una charla, un panel y una conversación abierta con quienes construyen y estudian la IA en América Latina.")}</div>'
                  + f'<div style="position:absolute;left:72px;right:72px;top:520px;border-bottom:1.5px solid {FILETE}">{personas}</div>'
                  + f'<div style="position:absolute;left:72px;right:72px;top:1030px"><div style="{MICRO};color:{GRIS}">{t("What you’ll leave with", "Lo que te llevas")}</div>{temas}</div>')


# ───────── 7 · cierre ─────────
def l6_cierre():
    def celda(rotulo, valor, detalle):
        return f"""<div style="padding:26px 0;border-top:1.5px solid {FILETE};display:flex;align-items:baseline">
  <div style="width:190px;{MICRO};color:{GRIS}">{rotulo}</div>
  <div><div style="font-size:40px;font-weight:600;letter-spacing:-.03em;line-height:1.05;color:{TINTA}">{valor}</div>
  <div style="margin-top:8px;font-size:25px;color:{GRIS}">{detalle}</div></div>
</div>"""
    return lamina(7, kicker(t("Join us", "Te esperamos"))
                  + titular(t("Come hear it<br>first-hand.", "Ven a oírlo<br>de primera mano."), 232, t(128, 112))
                  + f'<div style="position:absolute;left:72px;right:72px;top:560px;border-bottom:1.5px solid {FILETE}">'
                  + celda(t("When", "Cuándo"), f"{fecha()} · {hora()}", t("Talk · Panel · Networking", "Charla · Panel · Networking"))
                  + celda(t("Where", "Dónde"), t("Consulate General of Colombia", "Consulado General de Colombia"), f"{b.DIRECCION} · {b.CIUDAD}")
                  + celda(t("Hosts", "Anfitriones"), "INPLUX × Consulado de Colombia", "en San Francisco") + '</div>'
                  + f'<div style="position:absolute;left:72px;top:1060px;display:flex;align-items:center;gap:22px">'
                    f'<span style="display:inline-block;background:{TINTA};color:#fff;border-radius:999px;padding:20px 38px;font-size:30px;font-weight:600;letter-spacing:-.01em">{t("Save your seat", "Reserva tu cupo")} →</span>'
                    f'<span style="font-size:24px;color:{TINTA}">{t("Limited seats. RSVP at the link.", "Cupos limitados. Regístrate en el enlace.")}</span></div>', fondo=True)


PIEZAS = {
    "carrusel_1_portada": l1_portada, "carrusel_2_gancho": l2_gancho, "carrusel_3_adopcion": l3_adopcion,
    "carrusel_4_brechas": l4_brechas, "carrusel_5_gobierno": l5_gobierno, "carrusel_6_quienes": l5_quienes,
    "carrusel_7_cierre": l6_cierre,
}
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if __name__ == "__main__":
    # uso: python3 carrusel.py [en|es]   (sin argumento genera los dos idiomas)
    png, jpg = AQUI / "exports/carrusel/png", AQUI / "exports/carrusel/jpg"
    png.mkdir(parents=True, exist_ok=True); jpg.mkdir(parents=True, exist_ok=True)
    for IDIOMA in sys.argv[1:] or ("en", "es"):
        for base, fn in PIEZAS.items():
            nombre = base if IDIOMA == "en" else base.replace("carrusel_", "carrusel_es_")
            (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
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
