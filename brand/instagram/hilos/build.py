"""Hilos: los ganchos de los reels, como carruseles (24-oct-2026).

Cristian no se graba por ahora. Lo que hace viral a los referentes (cifra pública reconocible,
la máquina haciendo la tarea, pregunta abierta al final) pasa a carruseles de miércoles.
Fondos por lámina (FONDOS.md): terminal y captura en negro, tabla que se guarda en marfil, idea en romano.

Respuestas de conector verificadas el 24-oct-2026:
  Tribai vigencia_articulo("592")   → modificado desde 2016-12-29, Ley 1819 de 2016, 5 versiones desde 1989.
  Tribai vigencia_articulo("294-3") → Ley 2277 (2022-12-13) · D. 1474/2025 Art. 4, inexequible (2025-12-30)
                                      · Ley 2277 (2026-01-29) · Decreto 173 de 2026 (2026-02-25).
  Tribai Art. 868 ET: pesos redondeados al múltiplo de mil más cercano.
  Kelsen verificar_cita: Ley 2277/2022 art. 412 → NO_ENCONTRADA · art. 36 → EXISTE · C-079/2026 → EXISTE.
El corpus no dice qué sentencia tumbó el D. 1474: la lámina dice «la Corte lo declaró inexequible», sin número.
"""
import importlib.util
from pathlib import Path

AQUI = Path(__file__).parent


def _carga(nombre, ruta):
    spec = importlib.util.spec_from_file_location(nombre, ruta)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


ref = _carga("ref", AQUI.parent / "referentes" / "build.py")
reels = _carga("reels", AQUI.parent / "reels" / "build.py")
posic = ref.posic
BLACK, IVORY, MUTED, DIM, TEAL, TEAL_OSC = ref.BLACK, ref.IVORY, ref.MUTED, ref.DIM, ref.TEAL, ref.TEAL_OSC
PAPEL, TINTA, GRIS, ALTO, LINE = ref.PAPEL, ref.TINTA, ref.GRIS, ref.ALTO, ref.LINE
pieza, titulo_claro, fuente_de = posic.pieza, posic.titulo_claro, posic.fuente_de
terminal, titular, oscura, trama, cta_oscuro = ref.terminal, ref.titular, ref.oscura, ref.trama, ref.cta_oscuro
pildora = reels.pildora
LINEA_CLARA = "rgba(26,25,22,.14)"
CRITERIO = "El criterio es de quien firma."


def pesos(uvt, valor):
    """Art. 868 ET: por encima de $10.000 se aproxima al múltiplo de mil más cercano."""
    exacto = uvt * valor
    redondo = (exacto + 500) // 1000 * 1000
    return "$" + f"{redondo:,}".replace(",", ".")


def uvt_txt(n):
    return f"{n:,}".replace(",", ".")


def clara(cuerpo, pie, n, total):
    return pieza(ref.EXTRA + cuerpo, pie, n, total, claro=True, alto=ALTO)


def micro(texto, arriba=190, claro=False):
    return f'<div class="micro" style="position:absolute;left:84px;top:{arriba}px;color:{TEAL_OSC if claro else TEAL}">{texto}</div>'


def gancho(etq, rotulo, cifra, sub, img=None, colocacion=(330, 330, 900), opacidad=.42):
    fondo = trama(img, *colocacion, opacidad) if img else ""
    return fondo + micro(etq) + f"""
<div style="position:absolute;left:84px;top:250px">{pildora(rotulo, cifra, 66, 912)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1010px;font-size:31px;max-width:820px">{sub}</p>"""


def pregunta(texto, sub, arriba=760, claro=False):
    c = TEAL_OSC if claro else TEAL
    return f"""<div style="position:absolute;left:84px;right:84px;top:{arriba}px;border-top:1.5px solid {c};padding-top:30px">
  <div class="micro" style="color:{c};font-size:16px">Te leemos en los comentarios</div>
  <p style="font-size:44px;font-weight:500;letter-spacing:-.02em;line-height:1.12;margin-top:16px">{texto}</p>
  <p class="cuerpo" style="font-size:25px;margin-top:14px">{sub}</p></div>"""


# ---------- H1 · ¿Tengo que declarar renta? ----------

UVT_2025, UVT_2026 = 49_799, 52_374
TOPES = [("Ingresos brutos", 1_400, "menos de", "Art. 592"),
         ("Patrimonio bruto a 31 de diciembre", 4_500, "hasta", "Art. 592"),
         ("Consumos con tarjeta de crédito", 1_400, "hasta", "Art. 594-3"),
         ("Compras y consumos totales", 1_400, "hasta", "Art. 594-3"),
         ("Consignaciones, depósitos e inversiones", 1_400, "hasta", "Art. 594-3")]

TRIBAI_592 = [
    '<span class="t">&gt;</span> <span class="v">vigencia_articulo</span>("592", "2026-10-24")',
    "",
    '<span class="k">estado     </span> <span class="t">modificado · rige</span>',
    '<span class="k">desde      </span> <span class="v">2016-12-29</span>',
    '<span class="k">norma      </span> <span class="v">Ley 1819 de 2016</span>',
    '<span class="k">historial  </span> <span class="v">5 versiones desde 1989</span>',
    '<span class="k">fuente     </span> <span class="v">co:decreto:624:1989#art_592</span>',
]


def tabla_topes(anio, declara, uvt):
    filas = "".join(
        f'<div style="display:grid;grid-template-columns:1fr 150px 300px;gap:18px;align-items:baseline;padding:21px 0;border-top:1px solid {LINEA_CLARA}">'
        f'<div><div style="font-size:28px;line-height:1.2;color:{TINTA}">{c}</div><div class="micro" style="font-size:15px;margin-top:6px">{art} · {cmp}</div></div>'
        f'<div style="font-size:22px;color:{GRIS};text-align:right">{uvt_txt(n)} UVT</div>'
        f'<div style="font-size:36px;font-weight:600;letter-spacing:-.02em;text-align:right;color:{TEAL_OSC if k == 0 else TINTA}">{pesos(n, uvt)}</div></div>'
        for k, (c, n, cmp, art) in enumerate(TOPES))
    return titulo_claro(f"Año gravable {anio}<br><em>declaras en {declara}.</em>", f"UVT {anio}: <b>${uvt_txt(uvt)}</b> · cinco topes", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:480px">{filas}<div style="border-top:1px solid {LINEA_CLARA}"></div></div>""" + \
        fuente_de("Arts. 592, 594-3 y 868 ET · conector de Tribai, 24-oct-2026.", 1200)


def h1(i):
    T, pie = 6, "¿Tengo que declarar renta?"
    if i == 1:
        return oscura(gancho("Claude + Tribai · Estatuto Tributario", "¿Tengo que declarar<br>renta en 2026?", pesos(1_400, UVT_2025),
                             "Es el tope de ingresos del año gravable 2025. <b>Hay cuatro topes más</b> y basta con pasarte en uno.",
                             "escriba", (380, 300, 820), .3), pie, i, T)
    if i == 2:
        cuerpo = titular("Se lo preguntamos<br><em>al Estatuto.</em>", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Tribai · 24 oct 2026", TRIBAI_592)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:950px;font-size:28px">El Art. 592 rige con el texto de la Ley 1819 de 2016.
Los topes salen de ahí y del Art. 594-3. <b>Los pesos cambian cada año con la UVT.</b></p>"""
        return oscura(cuerpo, pie, i, T)
    if i == 3:
        return clara(tabla_topes(2025, 2026, UVT_2025), pie, i, T)
    if i == 4:
        return clara(tabla_topes(2026, 2027, UVT_2026), pie, i, T)
    if i == 5:
        filas = [("01", "Basta con pasarte en uno solo", "Los cinco topes se miden por separado. Si superas cualquiera, declaras aunque los otros cuatro estén por debajo."),
                 ("02", "Y no ser responsable de IVA", "Para quedar por fuera también debes no ser responsable de IVA (Art. 592, numeral 1)."),
                 ("03", "El año que cuenta es el anterior", "En 2026 declaras lo que pasó en 2025, con la UVT de 2025. Por eso la cifra no es la de este año.")]
        return clara(posic.practica("Basta con pasarte<br><em>en uno solo.</em>", filas,
                                    f"Esto es lo que dice la norma. Tu caso lo revisa tu contador: {CRITERIO.lower()}", 84), pie, i, T)
    cuerpo = titular("Pregúntale tú<br><em>al Estatuto.</em>", "Conector abierto · <b>sin cuenta</b> · con cita y vigencia", 88) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">
  <div class="micro" style="font-size:15px">Pega esta URL como conector en Claude, ChatGPT o Cursor</div>
  <p style="font-family:ui-monospace,Menlo,monospace;font-size:34px;color:{TEAL};margin-top:16px">tribai.co/api/mcp/public</p>
  <p class="micro" style="font-size:15px;margin-top:18px">La guía está en tribai.co/mcp</p></div>""" + \
        pregunta("¿Qué otra pregunta le harías al Estatuto?", "La contestamos con la fuente en un próximo hilo.", 720) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


# ---------- H2 · El impuesto al patrimonio cambió tres veces en tres meses ----------

EVENTOS_294_3 = [("13 dic 2022", "Ley 2277 de 2022", "Crea el impuesto: personas naturales desde 72.000 UVT a 1 de enero.", "rige"),
                 ("30 dic 2025", "Decreto 1474 de 2025", "Lo modifica por emergencia. La Corte lo declaró inexequible.", "cayó"),
                 ("29 ene 2026", "Vuelve la Ley 2277", "Sin el decreto, regresa el texto original.", "rige"),
                 ("25 feb 2026", "Decreto 173 de 2026", "Agrega a las empresas, solo para 2026, desde 200.000 UVT a 1 de marzo.", "rige hoy")]


def linea_tiempo(eventos):
    x, alto_fila = 34, 168
    puntos = ""
    for k, (fecha, norma, que, estado) in enumerate(eventos):
        y = k * alto_fila
        cayo, hoy = estado == "cayó", estado == "rige hoy"
        c = GRIS if cayo else (TEAL_OSC if hoy else TINTA)
        relleno = PAPEL if cayo else c
        tachado = "text-decoration:line-through;text-decoration-thickness:2px;" if cayo else ""
        puntos += f"""<div style="position:absolute;left:0;top:{y}px;width:{x * 2}px;display:flex;justify-content:center">
  <i style="display:block;width:{30 if hoy else 22}px;height:{30 if hoy else 22}px;border-radius:50%;margin-top:{6 if hoy else 10}px;background:{relleno};border:3px solid {c}"></i></div>
<div style="position:absolute;left:{x * 2 + 26}px;right:0;top:{y}px">
  <div style="display:flex;gap:18px;align-items:baseline"><span class="micro" style="font-size:15px;color:{c}">{fecha}</span>
    <span class="micro" style="font-size:13px;letter-spacing:.2em;color:{c};border:1.5px solid {c};border-radius:999px;padding:3px 12px">{estado}</span></div>
  <div style="font-size:36px;font-weight:600;letter-spacing:-.02em;margin-top:8px;color:{TINTA};{tachado}">{norma}</div>
  <div style="font-size:24px;line-height:1.35;color:{GRIS};margin-top:6px;max-width:760px">{que}</div></div>"""
    largo = (len(eventos) - 1) * alto_fila + 20
    return f"""<div style="position:relative;height:{len(eventos) * alto_fila}px">
<svg width="{x * 2}" height="{largo}" style="position:absolute;left:0;top:20px"><path d="M{x},0 L{x},{largo}" stroke="{TINTA}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/></svg>{puntos}</div>"""


def cifra_patrimonio(titulo, sub, uvt_n, fecha_corte, filas, nota_fuente):
    f = "".join(f'<div class="fila"><div class="n">{n}</div><div><h3 style="font-size:32px">{t}</h3><p>{d}</p></div></div>' for n, t, d in filas)
    return titulo_claro(titulo, sub, tam=80) + f"""
<div style="position:absolute;left:84px;right:84px;top:440px">
  <div style="display:flex;align-items:baseline;gap:22px"><span style="font-size:96px;font-weight:600;letter-spacing:-.04em;color:{TEAL_OSC}">{pesos(uvt_n, UVT_2026)}</span></div>
  <div class="micro" style="font-size:15px;margin-top:6px">{uvt_txt(uvt_n)} UVT × ${uvt_txt(UVT_2026)} · patrimonio líquido a {fecha_corte}</div></div>
<div style="position:absolute;left:84px;right:84px;top:660px">{f}<div style="border-top:1px solid {LINEA_CLARA}"></div></div>""" + fuente_de(nota_fuente, 1190)


def h2(i):
    T, pie = 5, "Impuesto al patrimonio 2026"
    if i == 1:
        return oscura(gancho("Claude + Tribai · Art. 294-3 ET", "El impuesto al patrimonio<br>cambió tres veces", "en tres meses",
                             "Si alguien te dio un solo número para 2026, <b>pregúntale de qué fecha es.</b>",
                             "escriba", (330, 330, 900), .45), pie, i, T)
    if i == 2:
        cuerpo = titulo_claro("Cuatro textos<br><em>para un mismo artículo.</em>", "Historial del Art. 294-3 ET · consulta del 24-oct-2026", tam=80) + \
            f'<div style="position:absolute;left:84px;right:84px;top:470px">{linea_tiempo(EVENTOS_294_3)}</div>' + \
            fuente_de("Tribai, vigencia_articulo(«294-3», 2026-10-24). URN co:decreto:624:1989#art_294-3.", 1190)
        return clara(cuerpo, pie, i, T)
    if i == 3:
        filas = [("01", "Quiénes", "Personas naturales y sucesiones ilíquidas contribuyentes de renta (Art. 292-3, numeral 1)."),
                 ("02", "Desde cuánto", "Patrimonio líquido igual o superior a 72.000 UVT al 1 de enero (Art. 294-3)."),
                 ("03", "Tarifa", "Marginal: 0,5 %, 1 % y 1,5 % por tramos; el 1,5 % rige hasta 2026 (Art. 296-3).")]
        return clara(cifra_patrimonio("Personas<br><em>naturales.</em>", "Año 2026", 72_000, "1 de enero de 2026", filas,
                                      "Arts. 292-3, 294-3 y 296-3 ET. UVT 2026 $52.374. Conector de Tribai, 24-oct-2026."), pie, i, T)
    if i == 4:
        filas = [("01", "Quiénes, solo en 2026", "Personas jurídicas y sociedades de hecho declarantes de renta, y establecimientos permanentes (numeral 6 del Art. 292-3)."),
                 ("02", "Tarifa", "0,5 %. Financieras, aseguradoras, carbón y petróleo: 1,6 % (Art. 296-3, parágrafo transitorio)."),
                 ("03", "Fecha de corte", "1 de marzo de 2026, no 1 de enero. Para establecimientos permanentes, 31 de marzo.")]
        return clara(cifra_patrimonio("Empresas,<br><em>solo en 2026.</em>", "Decreto 173 de 2026 · ajustado por el Decreto 240", 200_000, "1 de marzo de 2026", filas,
                                      "Arts. 292-3 (texto del D. 240 de 2026, Art. 15), 294-3 y 296-3 ET. Conector de Tribai, 24-oct-2026."), pie, i, T)
    cuerpo = titular("Un solo número<br><em>no alcanza.</em>", tam=92) + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:440px;font-size:31px;max-width:860px">Para el mismo artículo hubo cuatro textos en tres años.
<b>La pregunta útil no es cuánto, sino desde cuándo.</b> Nosotros la hacemos con fecha de corte; {CRITERIO.lower()}</p>""" + \
        pregunta("¿Te tocó pagarlo, o te enteraste tarde?", "Cuéntanos qué fecha te dieron.", 720) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


# ---------- H3 · 2.660 laudos arbitrales ----------

def h3(i):
    T, pie = 4, "Laudos · arbitraje colombiano"
    if i == 1:
        return oscura(gancho("laudos.co · beta abierta", "Pusimos a una máquina a<br>leer 2.660 laudos", "esto fue lo que hizo",
                             "¿Cuánto tarda un abogado en leerlos todos? <b>Nadie lo ha hecho.</b>",
                             "acueducto", (240, 380, 1000), .5), pie, i, T)
    if i == 2:
        nav = ref_navegador("laudos-2026-10-24.jpg", "laudos.co", "24 oct 2026", 912, 470, 393)
        cuerpo = titular("Todo el arbitraje,<br><em>en una búsqueda.</em>", tam=84) + nav + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:990px;font-size:28px">Búsqueda gratuita en beta abierta. <b>Las predicciones citan los precedentes</b> de los que salen.</p>"""
        return oscura(cuerpo, pie, i, T)
    if i == 3:
        cifras = [("2.660", "laudos arbitrales"), ("2.787", "providencias del Consejo de Estado"), ("1985–2026", "el rango de fechas del corpus")]
        c = "".join(f'<div style="display:grid;grid-template-columns:330px 1fr;gap:24px;align-items:baseline;padding:22px 0;border-top:1px solid {LINE}">'
                    f'<span style="font-size:{64 if k < 2 else 52}px;font-weight:600;letter-spacing:-.03em;color:{TEAL if k == 0 else IVORY}">{n}</span>'
                    f'<span style="font-size:27px;color:#cfc9bf">{t}</span></div>' for k, (n, t) in enumerate(cifras))
        filas = "".join(f'<div class="fila" style="padding:18px 0"><div class="n">{n}</div><div><h3 style="font-size:30px">{t}</h3><p style="font-size:22px">{d}</p></div></div>'
                        for n, t, d in [("01", "Búsqueda semántica", "Escribe el problema como lo dirías: «cláusula penal en contrato de obra»."),
                                        ("02", "Predicción con precedentes", "Una estimación del resultado, con los laudos que la sostienen.")])
        cuerpo = titular("Lo que lee,<br><em>y lo que devuelve.</em>", tam=80) + f"""
<div style="position:absolute;left:84px;right:84px;top:420px">{c}<div style="border-top:1px solid {LINE}"></div></div>
<div style="position:absolute;left:84px;right:84px;top:850px">{filas}</div>
<p class="micro" style="position:absolute;left:84px;top:1190px;font-size:14px">5.447 documentos en total · laudos.co, 24-oct-2026</p>"""
        return oscura(cuerpo, pie, i, T)
    cuerpo = trama("acueducto", 240, 520, 1000, .32) + titular("La máquina lee.<br><em>El abogado decide.</em>",
                                                                 "Desarrollo de INPLUX · criterio legal de REDEK", 92) + \
        pregunta("¿Qué cláusula buscarías primero?", f"Beta abierta en laudos.co. {CRITERIO}", 700) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


def ref_navegador(captura, url, fecha, ancho, arriba, alto):
    izq = (1080 - ancho) // 2
    puntos = "".join('<i style="width:11px;height:11px;border-radius:50%;background:rgba(246,242,236,.22)"></i>' for _ in range(3))
    return f"""<div style="position:absolute;left:{izq}px;top:{arriba}px;width:{ancho}px;border-radius:14px;overflow:hidden;
  border:1.5px solid {LINE};background:#151513;box-shadow:0 0 0 10px rgba(246,242,236,.03),0 40px 90px rgba(0,0,0,.75)">
  <div style="height:44px;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid {LINE}">{puntos}
    <span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{MUTED};letter-spacing:.02em">{url}</span></div>
  <img src="capturas/{captura}" style="display:block;width:{ancho}px;height:{alto}px;object-fit:cover;object-position:top">
</div>
<div class="micro" style="position:absolute;left:{izq}px;top:{arriba + alto + 44 + 18}px;font-size:14px">Captura real · {fecha}</div>"""


# ---------- H4 · Le pedí a la IA una norma que no existe ----------

KELSEN_412 = [
    '<span class="t">&gt;</span> <span class="v">verificar_cita</span>("Ley 2277 de 2022 artículo 412")',
    "",
    '<span class="k">veredicto  </span> <span style="color:#ff8a7a">NO_ENCONTRADA</span>',
    '<span class="k">fuente     </span> <span class="v">null</span>',
    '<span class="k">vigencia   </span> <span class="v">null</span>',
]
KELSEN_36 = [
    '<span class="t">&gt;</span> <span class="v">verificar_cita</span>("Ley 2277 de 2022 artículo 36")',
    '<span class="k">veredicto  </span> <span class="t">EXISTE</span>',
    '<span class="k">url        </span> <span class="v">secretariasenado.gov.co</span>',
    "",
    '<span class="t">&gt;</span> <span class="v">verificar_cita</span>("Sentencia C-079 de 2026")',
    '<span class="k">veredicto  </span> <span class="t">EXISTE</span>',
    '<span class="k">url        </span> <span class="v">corteconstitucional.gov.co/relatoria</span>',
]


def h4(i):
    T, pie = 4, "Kelsen · verificar la cita"
    if i == 1:
        return oscura(gancho("Claude + Kelsen · derecho colombiano", "Le pedimos a la IA una<br>norma que no existe", "Respuesta: no encontrada",
                             "Le pedimos el artículo 412 de la reforma tributaria de 2022. <b>Esto respondió.</b>", "senadores", (200, 420, 1060), .4), pie, i, T)
    if i == 2:
        cuerpo = titular("No la encontró,<br><em>y lo dijo.</em>", tam=88) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Kelsen · 24 oct 2026", KELSEN_412)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:870px;font-size:28px">Sin fuente, sin vigencia, sin texto inventado.
<b>Una IA que dice «no lo encontré» vale más que una que redacta un artículo que no existe.</b></p>"""
        return oscura(cuerpo, pie, i, T)
    if i == 3:
        cuerpo = titular("Las que sí existen,<br><em>con su enlace.</em>", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px">{terminal("Claude · conector Kelsen · 24 oct 2026", KELSEN_36)}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1000px;font-size:28px">Cada «existe» trae el documento oficial del que sale, <b>para que lo abras antes de citarlo.</b></p>"""
        return oscura(cuerpo, pie, i, T)
    cuerpo = titular("Verifica la cita<br><em>antes de firmarla.</em>", "Kelsen · conector MCP · <b>acceso por solicitud</b>", 88) + f"""
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:470px;font-size:30px;max-width:860px">Normas y jurisprudencia de Colombia con la fuente de cada resultado.
Solicitud y enlace del conector en <b>kelsen.io/mcp</b>. {CRITERIO}</p>""" + \
        pregunta("¿Alguna vez una IA te inventó una norma?", "Cuéntanos cuál. La verificamos.", 720) + cta_oscuro(1130)
    return oscura(cuerpo, pie, i, T)


PIEZAS = {}
for clave, fn, total in (("h1", h1, 6), ("h2", h2, 5), ("h3", h3, 4), ("h4", h4, 4)):
    for k in range(1, total + 1):
        PIEZAS[f"{clave}_{k:02d}"] = ((lambda fn=fn, k=k: fn(k)), 1080, ALTO)

if __name__ == "__main__":
    for nombre, (fn, _, _) in PIEZAS.items():
        (AQUI / f"{nombre}.html").write_text(fn(), encoding="utf-8")
    print(len(PIEZAS), "piezas escritas")
