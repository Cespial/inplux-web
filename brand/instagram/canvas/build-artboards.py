#!/usr/bin/env python3
"""Genera los artboards .dc.html de la primera tanda de Instagram a partir de DESIGN.md.
Todo el copy es literal del sitio (src/content/*.ts) o de fuentes verificadas.
Las capturas JPG viven junto a los .dc.html para que un render local y el lienzo resuelvan el mismo nombre."""
import json, pathlib

FONTS = ('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;1,6..72,300'
         '&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap')
SERIF = "Newsreader, Georgia, 'Times New Roman', serif"
SANS = "Geist, system-ui, -apple-system, 'Helvetica Neue', sans-serif"
MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

T = {
  'paper': dict(bg='#f8f8f7', fg='#1a1918', muted='#6e6b68', line='#e5e3e0', accent='#0d7d74',
                card='#ffffff', bar='#f3f1ee', barfg='#6e6b68', dot='#d1cfcc'),
  'ink':   dict(bg='#1a1918', fg='#ffffff', muted='#a8a5a0', line='rgba(255,255,255,0.14)', accent='#15dcc4',
                card='#282726', bar='#3d3b39', barfg='#a8a5a0', dot='#545250'),
}

def head(t):
    return ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
            f'  <link rel="stylesheet" href="{FONTS}">\n'
            '  <style>\n    body { margin: 0; background: ' + t['bg'] + '; }\n'
            '    a { color: ' + t['accent'] + '; } a:hover { color: ' + t['accent'] + '; }\n'
            '    em { font-style: italic; }\n  </style>\n</helmet>\n')

TAIL = '</x-dc>\n</body>\n</html>\n'

def mark(size, bars, top):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}" role="img" aria-label="INPLUX">'
            f'<rect x="8" y="57" width="42" height="13" rx="6.5" fill="{bars}"></rect>'
            f'<rect x="29" y="39" width="42" height="13" rx="6.5" fill="{bars}"></rect>'
            f'<rect x="50" y="21" width="42" height="13" rx="6.5" fill="{top}"></rect></svg>')

def lockup(t):
    return (f'<div style="display: flex; align-items: center; gap: 14px;">{mark(44, t["fg"], t["accent"])}'
            f'<span style="font-family: {SANS}; font-weight: 600; font-size: 26px; line-height: 1; letter-spacing: 0.14em; color: {t["fg"]};">INPLUX</span></div>')

def kicker(text, t):
    return (f'<div style="font-family: {SANS}; font-weight: 500; font-size: 26px; line-height: 1; letter-spacing: 0.08em; '
            f'text-transform: uppercase; color: {t["muted"]};">{text}</div>')

def em(word, t):
    return f'<em style="font-style: italic; color: {t["accent"]};">{word}</em>'

def headline(html, t, size=96):
    return (f'<h1 style="margin: 0; font-family: {SERIF}; font-weight: 300; font-size: {size}px; line-height: 1.02; '
            f'letter-spacing: -0.02em; color: {t["fg"]}; text-wrap: pretty;">{html}</h1>')

def meta(text, t, size=24, color=None):
    return f'<div style="font-family: {MONO}; font-weight: 400; font-size: {size}px; line-height: 1.3; color: {color or t["muted"]};">{text}</div>'

def body(text, t, size=34, color=None):
    return f'<div style="font-family: {SANS}; font-weight: 300; font-size: {size}px; line-height: 1.4; color: {color or t["fg"]}; text-wrap: pretty;">{text}</div>'

def card(img, url, t):
    dots = ''.join(f'<span style="display: block; width: 12px; height: 12px; border-radius: 999px; background: {t["dot"]};"></span>' for _ in range(3))
    return (f'<div style="border-radius: 14px; border: 1px solid {t["line"]}; background: {t["card"]}; overflow: hidden;">'
            f'<div style="display: flex; align-items: center; gap: 18px; height: 56px; padding: 0 22px; background: {t["bar"]}; border-bottom: 1px solid {t["line"]};">'
            f'<div style="display: flex; gap: 8px;">{dots}</div>'
            f'<div style="font-family: {MONO}; font-size: 22px; line-height: 1; color: {t["barfg"]};">{url}</div></div>'
            f'<img src="{img}" alt="" style="display: block; width: 100%; height: auto;">'
            f'</div>')

def root(children, t, h=1350):
    return (f'<div style="position: relative; box-sizing: border-box; width: 1080px; height: {h}px; padding: 88px; display: flex; '
            f'flex-direction: column; justify-content: space-between; background: {t["bg"]}; color: {t["fg"]}; font-family: {SANS}; overflow: hidden;">'
            + ''.join(children) + '</div>\n')

def col(children, gap=40):
    return f'<div style="display: flex; flex-direction: column; gap: {gap}px;">' + ''.join(children) + '</div>'

def row(children, align='center'):
    return f'<div style="display: flex; justify-content: space-between; align-items: {align}; gap: 32px;">' + ''.join(children) + '</div>'

def page(name, theme, children, h=1350):
    t = T[theme]
    pathlib.Path(f'{name}.dc.html').write_text(head(t) + root(children, t, h) + TAIL, encoding='utf-8')

# ---------- familias ----------
def producto(name, theme, kick, title_html, img, url, meta_text):
    t = T[theme]
    page(name, theme, [
        col([kicker(kick, t), headline(title_html, t, 96)]),
        card(img, url, t),
        row([meta(meta_text, t), lockup(t)]),
    ])

def lista(name, theme, kick, title_html, items, foot='inplux.co'):
    t = T[theme]
    rows = ''.join(
        f'<div style="display: flex; gap: 32px; padding: 26px 0; border-top: 1px solid {t["line"]};">'
        f'<div style="flex: 0 0 64px; font-family: {MONO}; font-size: 24px; line-height: 1.6; color: {t["accent"]};">{n}</div>'
        f'<div style="display: flex; flex-direction: column; gap: 10px;">'
        f'<div style="font-family: {SERIF}; font-weight: 300; font-size: 50px; line-height: 1.1; letter-spacing: -0.01em; color: {t["fg"]};">{ttl}</div>'
        f'<div style="font-family: {SANS}; font-weight: 300; font-size: 26px; line-height: 1.35; color: {t["muted"]}; text-wrap: pretty;">{cp}</div>'
        f'</div></div>' for n, ttl, cp in items)
    page(name, theme, [
        col([kicker(kick, t), headline(title_html, t, 96)]),
        f'<div style="display: flex; flex-direction: column;">{rows}</div>',
        row([meta(foot, t), lockup(t)]),
    ])

def pieza(name, theme, kick, title_html, size, lines, label):
    t = T[theme]
    page(name, theme, [
        kicker(kick, t),
        headline(title_html, t, size),
        col([meta(lines, t, 26, t['fg']), row([meta(label, t, 22), lockup(t)])], 36),
    ])

VELO = ('<div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; '
        'background: linear-gradient(to top, rgba(26,25,24,0.97) 0%, rgba(26,25,24,0.82) 34%, rgba(26,25,24,0.38) 62%, rgba(26,25,24,0.12) 100%);"></div>'
        '<div style="position: absolute; top: 0; right: 0; left: 0; height: 360px; '
        'background: linear-gradient(to bottom, rgba(26,25,24,0.78) 0%, rgba(26,25,24,0.0) 100%);"></div>')


def credito_html(texto, t):
    """Crédito de licencia, discreto, arriba a la derecha. Vacío si la imagen es propia."""
    if not texto:
        return '<span></span>'
    return (f'<span style="font-family: {MONO}; font-size: 18px; line-height: 1; '
            f'color: rgba(255,255,255,0.55);">{texto}</span>')


VELO_ALTO = ('<div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; '
             'background: linear-gradient(to top, rgba(26,25,24,0.97) 0%, rgba(26,25,24,0.86) 30%, '
             'rgba(26,25,24,0.55) 55%, rgba(26,25,24,0.30) 100%);"></div>'
             '<div style="position: absolute; top: 0; right: 0; left: 0; height: 560px; '
             'background: linear-gradient(to bottom, rgba(26,25,24,0.82) 0%, rgba(26,25,24,0.0) 100%);"></div>')


def fondo(img):
    """Fotografía a sangre para una historia, con el mismo velo tinta del feed."""
    return [f'<img src="{img}" alt="" style="position: absolute; top: 0; left: 0; width: 1080px; '
            f'height: 1920px; object-fit: cover; display: block;">', VELO_ALTO]


def rel(html):
    return f'<div style="position: relative;">{html}</div>'


def foto(name, kick, title_html, meta_text, label, img, credito='', size=96, alto=1350):
    """Reconocimiento / evento: fotografía a sangre, degradado tinta desde abajo, titular en serif."""
    t = T['ink']
    photo = (f'<img src="{img}" alt="" style="position: absolute; top: 0; left: 0; width: 1080px; '
             f'height: {alto}px; object-fit: cover; display: block;">')
    top = f'<div style="position: relative;">{row([kicker(kick, t), credito_html(credito, t)])}</div>'
    bottom = ('<div style="position: relative; display: flex; flex-direction: column; gap: 36px;">'
              + headline(title_html, t, size) + meta(meta_text, t, 24, t['fg'])
              + row([meta(label, t, 22), lockup(t)]) + '</div>')
    page(name, 'ink', [photo, VELO, top, bottom], h=alto)

# ---------- artboards ----------
t = T['ink']
page('Main', 'ink', [
    mark(320, t['fg'], t['accent']),
    col([kicker('Fábrica de software a la medida · Medellín', t),
         headline(f'De un problema real a software en {em("producción", t)}.', t, 112),
         row([meta('inplux.co', t), f'<span style="font-family: {SANS}; font-weight: 600; font-size: 26px; letter-spacing: 0.14em; color: {t["fg"]};">INPLUX</span>'])]),
])

producto('Tribai', 'paper', 'Trabajo / Tributación · Público',
         f'Encontrar criterio tributario sin perder la {em("fuente", T["paper"])}.',
         'tribai.jpg', 'app.tribai.co', 'Tribai · captura real · 21 JUL 2026')

producto('Gobia', 'paper', 'Trabajo / Gestión pública · Piloto activo',
         f'Hacer visible la operación de un {em("municipio", T["paper"])}.',
         'gobia.jpg', 'gobia.co/demo', 'Gobia · captura real · 21 JUL 2026')

producto('Kelsen', 'paper', 'Trabajo / Derecho · Por solicitud',
         f'Trabajar conocimiento jurídico con una ruta {em("verificable", T["paper"])}.',
         'kelsen.jpg', 'kelsen.io/explorador?vigencia=modificado', 'Kelsen · captura real · 21 JUL 2026')

producto('Laudos', 'paper', 'Trabajo / Arbitraje · Beta abierta',
         f'Explorar conocimiento arbitral con {em("estructura", T["paper"])}.',
         'laudos.jpg', 'laudos.co/?view=predecir', 'Laudos · con REDEK · captura real · 21 JUL 2026')

pieza('Commonplace', 'ink', 'Prensa / Selección editorial externa',
      'Dos investigaciones sobre IA y trabajo, destacadas por The Commonplace.', 88,
      'The Commonplace · Workforce Futures · 06 ABR 2026', 'Selección editorial externa')

foto('Columna', 'Columna / Al Poniente',
     f'Lo que la máquina no puede {em("firmar", T["ink"])}.',
     'Jaime Alonso Cano Pino · 12 JUN 2026', 'Columna firmada · publicación del equipo',
     'banco-mesa-de-criterio.jpg', '', 112)

lista('Metodo', 'paper', 'Fábrica / Cómo trabajamos', f'Cómo {em("trabajamos", T["paper"])}.', [
    ('01', 'Entendemos el reto', 'Hablamos con las personas involucradas, revisamos el contexto y definimos qué debería cambiar.'),
    ('02', 'Definimos el producto', 'Convertimos el reto en prioridades, flujos y criterios claros para construir la primera versión útil.'),
    ('03', 'Construimos y probamos', 'Diseñamos la experiencia, desarrollamos el software y revisamos su funcionamiento, sus riesgos y su utilidad.'),
    ('04', 'Lanzamos y evolucionamos', 'Ponemos una versión útil en producción, observamos cómo funciona y decidimos contigo qué mejorar después.'),
])

lista('Servicios', 'ink', 'Fábrica / Qué construimos', f'Qué {em("construimos", T["ink"])}.', [
    ('01', 'Lanzar un producto digital', 'Convertimos una oportunidad o una idea en una primera versión útil, preparada para aprender, crecer y evolucionar.'),
    ('02', 'Mejorar una operación', 'Construimos herramientas que conectan personas, procesos, reglas y datos alrededor de la forma real de trabajar.'),
    ('03', 'Automatizar trabajo y conocimiento', 'Convertimos tareas repetitivas y conocimiento disperso en flujos trazables, con revisión humana donde importa.'),
])

# Avatar 1080×1080
t = T['ink']
pathlib.Path('Avatar.dc.html').write_text(head(t) +
    f'<div style="box-sizing: border-box; width: 1080px; height: 1080px; display: flex; align-items: center; justify-content: center; background: {t["bg"]}; overflow: hidden;">'
    f'<div style="margin-top: 36px;">{mark(800, t["fg"], t["accent"])}</div></div>\n' + TAIL, encoding='utf-8')


def cita(name, theme, kick, quote_html, lines, label):
    """Nos mencionan: cita textual de un tercero, entre comillas angulares."""
    t = T[theme]
    page(name, theme, [
        kicker(kick, t),
        headline('&#171;' + quote_html + '&#187;', t, 84),
        col([meta(lines, t, 26, t['fg']), row([meta(label, t, 22), lockup(t)])], 36),
    ])

foto('Harvard', 'Reconocimiento / ODR 2026 · Boston',
     f'Amparo.help ganó un lugar en el hackathon de ODR {em("2026", T["ink"])}.',
     'American Arbitration Association · odr.com · Suffolk University · JUN 2026',
     'Encuentro ODR 2026 · Harvard Business School', 'harvard.jpg')

cita('Mencion', 'ink', 'Nos mencionan / @10ampro',
     'El cerebro tributario de Colombia construido con AI por los Alphas de 10ampro',
     'Reel de @10ampro con Hernán Jaramillo (holdmybirra)', 'Sobre Tribai · app.tribai.co')

foto('DiaD', 'Aliados / El Día D · 10ampro',
     f'Somos aliados de El {em("Día D", T["ink"])}.',
     'Miércoles 14 de octubre de 2026 · Auditorio Fundadores · Universidad EAFIT · Medellín · 10:00 a. m. – 5:00 p. m.',
     'Software · De un problema real a producción · eldiad.10am.pro', 'medellin.jpg')

foto('Segovia', 'Trabajo / Participación ciudadana · Segovia, Antioquia',
     f'La gente de Segovia votó las obras de su vereda desde el {em("celular", T["ink"])}.',
     'Presupuesto participativo · Alcaldía de Segovia · votación cerrada el 13 SEP 2026',
     'participativo-segovia.vercel.app', 'segovia.jpg')

cita('Egonomista', 'paper', 'Nos mencionan / @egonomista',
     'Hay plataformas que organizan su información, hacen buena parte de los cálculos y lo llevan paso a paso',
     'Reel de @egonomista sobre 3 plataformas para declarar renta · 05 SEP 2026', 'Tribai entre las tres · app.tribai.co')

producto('Porkia', 'paper', 'Trabajo / Porcicultura · Por solicitud',
         f'Llevar una finca porcícola sin volver al {em("cuaderno", T["paper"])}.',
         'porkia.jpg', 'porkia.co/#demo', 'Porkia · captura real · 11 AGO 2026')

# ---------- Día D · 14 de octubre de 2026 ----------
# Todo el contenido es literal de eldiad.10am.pro, consultada el 17 SEP 2026.
# INPLUX es aliado con la etiqueta «Software»: no anunciamos agenda propia, stand ni tarima.

FUENTE = 'El Día D · 14 OCT 2026 · eldiad.10am.pro'
CUANDO = 'Miércoles 14 de octubre de 2026 · 10:00 a. m. – 5:00 p. m. · Auditorio Fundadores · EAFIT · Medellín'

def tabla(name, theme, kick, title_html, filas, foot):
    """Aliados: categoría en mono a la izquierda, nombre en serif a la derecha."""
    t = T[theme]
    rows = ''.join(
        f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 32px; '
        f'padding: 24px 0; border-top: 1px solid {t["line"]};">'
        f'<div style="font-family: {MONO}; font-size: 23px; line-height: 1.3; letter-spacing: 0.06em; '
        f'text-transform: uppercase; color: {t["muted"]};">{cat}</div>'
        f'<div style="font-family: {SERIF}; font-weight: 300; font-size: 46px; line-height: 1.1; '
        f'letter-spacing: -0.01em; color: {t["accent"] if mio else t["fg"]};">{quien}</div>'
        f'</div>' for cat, quien, mio in filas)
    page(name, theme, [
        col([kicker(kick, t), headline(title_html, t, 88)]),
        f'<div style="display: flex; flex-direction: column;">{rows}</div>',
        row([meta(foot, t, 22), lockup(t)]),
    ])

def ponente(name, title_html, quien, papel, img=None):
    """Día D: el tema en serif, la persona en la línea de datos. Nunca el retrato ajeno;
    cuando hay imagen es una atmósfera que dice algo del tema, no la cara de nadie."""
    if img:
        foto(name, 'El Día D / Quién habla', title_html, f'{quien} · {papel}', FUENTE, img)
    else:
        pieza(name, 'ink', 'El Día D / Quién habla', title_html, 104,
              f'{quien} · {papel}', FUENTE)

tabla('DiaDAliados', 'ink', 'El Día D / Aliados',
      f'Siete aliados. Nosotros somos el {em("software", T["ink"])}.', [
          ('Capital', 'Veronorte', False),
          ('Sede', 'Universidad EAFIT', False),
          ('Logística', 'Makeno', False),
          ('Sociedades en el exterior', 'MBS &amp; Associates', False),
          ('Epistemic Capital', 'MacroWise', False),
          ('Energía', 'Celsia', False),
          ('Software', 'INPLUX', True),
      ], FUENTE)

ponente('DiaDMcCann', f'Capital en IA, robótica, defensa y {em("energía", T["ink"])}.',
        'Joe McCann', 'trader e inversionista', 'banco-solution-product.jpg')

ponente('DiaDSantos', f'El PIB que ya ocurre {em("onchain", T["ink"])}.',
        'Santiago Santos', 'inversionista en Ethereum y Solana')

ponente('DiaDSierra', f'Celsia y el {em("Energy Valley", T["ink"])}.',
        'Ricardo Sierra', 'CEO de Celsia', 'banco-sector-public.jpg')

ponente('DiaDJoffroy', f'Infraestructura de carga {em("eléctrica", T["ink"])}.',
        'André Joffroy', 'founder y CIO de Zaps', 'banco-sector-private.jpg')

ponente('DiaDLongevidad', f'Péptidos y {em("longevidad", T["ink"])}.',
        'Camilo Ospina y Andrés Palacio', 'médicos', 'banco-solution-knowledge.jpg')

lista('DiaDPrincipios', 'ink', 'El Día D / Cómo opera',
      f'Tres reglas del {em("Día D", T["ink"])}.', [
          ('01', 'Open Source Capital', 'Compartir tesis y aprendizajes en vez de guardarlos.'),
          ('02', 'Collective Intelligence', 'La sincronización de personas inteligentes en un mismo lugar.'),
          ('03', 'Network Sharing', 'Activar las redes propias para acelerar a la gente correcta.'),
      ], FUENTE)

cita('DiaDPublico', 'ink', 'El Día D / Para quién es',
     'Estar cerca de las mejores conversaciones es una forma de capital',
     'Fundadores, inversionistas, operadores, médicos, builders',
     FUENTE)

# Sin foto: la única del campus con licencia limpia (Bloque 38, 2002) no es el Auditorio
# Fundadores y su amarillo pelea con la paleta. Mejor tipográfico que una foto que no prueba nada.
pieza('DiaDLugar', 'ink', 'El Día D / Dónde',
      f'Auditorio Fundadores, {em("EAFIT", T["ink"])}.', 104,
      CUANDO, FUENTE)

pieza('DiaDSoftware', 'paper', 'El Día D / Por qué estamos',
      f'Después de las conversaciones, alguien tiene que {em("construirlo", T["paper"])}.', 96,
      'INPLUX es el aliado de software del Día D · De un problema real a producción',
      'inplux.co')

pieza('DiaDFaltan2', 'ink', 'El Día D / Cuenta regresiva',
      f'Faltan {em("dos", T["ink"])} días.', 128, CUANDO, FUENTE)

pieza('DiaDManana', 'ink', 'El Día D / Cuenta regresiva',
      f'{em("Mañana", T["ink"])} es el Día&nbsp;D.', 120, CUANDO, FUENTE)

foto('DiaDHoy', 'El Día D / Hoy',
     f'Hoy es el {em("Día D", T["ink"])}.',
     CUANDO, FUENTE, 'banco-solution-public-service.jpg', '', 120)

# ---------- historias 1080 × 1920 ----------
# Zonas seguras: 250 px arriba, 320 px abajo (DESIGN.md §2).

def story(name, theme, children):
    t = T[theme]
    pathlib.Path(f'{name}.dc.html').write_text(
        head(t) +
        f'<div style="position: relative; box-sizing: border-box; width: 1080px; height: 1920px; '
        f'padding: 250px 88px 320px; display: flex; flex-direction: column; justify-content: space-between; '
        f'background: {t["bg"]}; color: {t["fg"]}; font-family: {SANS}; overflow: hidden;">'
        + ''.join(children) + '</div>\n' + TAIL, encoding='utf-8')

def story_cuenta(dias):
    t = T['ink']
    if dias == 0:
        grande, pie, px = em('Hoy', t), 'es el Día D.', 240
    elif dias == 1:
        grande, pie, px = em('Mañana', t), 'es el Día D.', 170
    else:
        grande, pie, px = em(str(dias), t), 'días para el Día D.', 300
    num = (f'<div style="font-family: {SERIF}; font-weight: 300; font-size: {px}px; line-height: 0.9; '
           f'letter-spacing: -0.03em; color: {t["fg"]};">{grande}</div>')
    cuerpo = [
        rel(kicker('El Día D / 14 de octubre', t)),
        rel(col([num, headline(pie, t, 64)], 48)),
        rel(col([meta(CUANDO, t, 24, t['fg']), row([meta(FUENTE, t, 22), lockup(t)])], 32)),
    ]
    img = 'banco-solution-public-service.jpg' if dias == 0 else None
    story(f'StCuenta{dias:02d}', 'ink', (fondo(img) + cuerpo) if img else cuerpo)

for d in (14, 7, 3, 1, 0):
    story_cuenta(d)

def story_ponente(name, title_html, quien, papel, img=None):
    t = T['ink']
    cuerpo = [
        rel(row([kicker('El Día D / Quién habla', t), credito_html('', t)])),
        rel(col([headline(title_html, t, 96), meta(f'{quien} · {papel}', t, 30, t['fg'])], 44)),
        rel(col([meta(CUANDO, t, 24), row([meta(FUENTE, t, 22), lockup(t)])], 32)),
    ]
    story(name, 'ink', (fondo(img) + cuerpo) if img else cuerpo)

story_ponente('StMcCann', f'Capital en IA, robótica, defensa y {em("energía", T["ink"])}.',
              'Joe McCann', 'trader e inversionista', 'banco-solution-product.jpg')
story_ponente('StSantos', f'El PIB que ya ocurre {em("onchain", T["ink"])}.',
              'Santiago Santos', 'inversionista en Ethereum y Solana')
story_ponente('StSierra', f'Celsia y el {em("Energy Valley", T["ink"])}.',
              'Ricardo Sierra', 'CEO de Celsia', 'banco-sector-public.jpg')
story_ponente('StJoffroy', f'Infraestructura de carga {em("eléctrica", T["ink"])}.',
              'André Joffroy', 'founder y CIO de Zaps', 'banco-sector-private.jpg')
story_ponente('StLongevidad', f'Péptidos y {em("longevidad", T["ink"])}.',
              'Camilo Ospina y Andrés Palacio', 'médicos', 'banco-solution-knowledge.jpg')

t = T['ink']
_pr = ''.join(
    f'<div style="display: flex; gap: 30px; padding: 30px 0; border-top: 1px solid {t["line"]};">'
    f'<div style="flex: 0 0 60px; font-family: {MONO}; font-size: 24px; line-height: 1.5; color: {t["accent"]};">{n}</div>'
    f'<div style="font-family: {SERIF}; font-weight: 300; font-size: 52px; line-height: 1.15; color: {t["fg"]};">{ttl}</div>'
    f'</div>' for n, ttl in [('01', 'Open Source Capital'), ('02', 'Collective Intelligence'), ('03', 'Network Sharing')])
story('StPrincipios', 'ink', [
    col([kicker('El Día D / Cómo opera', t), headline(f'Tres reglas del {em("Día D", t)}.', t, 88)]),
    f'<div style="display: flex; flex-direction: column;">{_pr}</div>',
    col([meta(CUANDO, t, 24), row([meta(FUENTE, t, 22), lockup(t)])], 32),
])

story('StAliados', 'ink', [
    kicker('El Día D / Aliados', t),
    col([headline(f'Somos el {em("software", t)} del Día D.', t, 96),
         meta('Veronorte · EAFIT · Makeno · MBS &amp; Associates · MacroWise · Celsia · INPLUX', t, 26, t['fg'])], 44),
    col([meta(CUANDO, t, 24), row([meta(FUENTE, t, 22), lockup(t)])], 32),
])

# Plantillas para el 14 de octubre: la foto real se pega encima en la app de historias.
_hueco = (f'<div style="flex: 1; margin: 44px 0; border-radius: 14px; border: 1px dashed {t["line"]}; '
          f'display: flex; align-items: center; justify-content: center;">'
          f'<span style="font-family: {MONO}; font-size: 24px; color: {t["muted"]};">[ foto real del día ]</span></div>')
story('StVivo', 'ink', [
    kicker('El Día D / En vivo', t), _hueco,
    col([meta('Auditorio Fundadores · EAFIT · Medellín', t, 26, t['fg']),
         row([meta(FUENTE, t, 22), lockup(t)])], 32),
])
story('StCierre', 'ink', [
    col([kicker('El Día D / Cierre', t), headline(f'Lo que vimos en el {em("Día D", t)}.', t, 96)]),
    _hueco,
    col([meta('14 de octubre de 2026 · Medellín', t, 26, t['fg']),
         row([meta('inplux.co', t, 22), lockup(t)])], 32),
])

# ---------- calendario: una publicación diaria del 17 SEP al 14 OCT de 2026 ----------
# Las piezas del Día D no van dos días seguidos hasta el 7 de octubre; del 8 al 14 sí,
# porque esa es la semana del evento.
CALENDARIO = [
    ('2026-09-17', 'Main',           'Marca',                          'marca'),
    ('2026-09-18', 'Harvard',        'Reconocimiento · ODR 2026',      'reconocimiento-odr-2026'),
    ('2026-09-19', 'Tribai',         'Trabajo · Tribai',               'tribai'),
    ('2026-09-20', 'DiaDAliados',    'Día D · Siete aliados',          'dia-d-aliados'),
    ('2026-09-21', 'Mencion',        'Nos mencionan · @10ampro',       'nos-mencionan-10ampro'),
    ('2026-09-22', 'Gobia',          'Trabajo · Gobia',                'gobia'),
    ('2026-09-23', 'DiaDMcCann',     'Día D · Joe McCann',             'dia-d-mccann'),
    ('2026-09-24', 'Columna',        'Columna · Al Poniente',          'columna'),
    ('2026-09-25', 'Kelsen',         'Trabajo · Kelsen',               'kelsen'),
    ('2026-09-26', 'DiaDPrincipios', 'Día D · Tres reglas',            'dia-d-principios'),
    ('2026-09-27', 'Commonplace',    'Prensa · The Commonplace',       'commonplace'),
    ('2026-09-28', 'Laudos',         'Trabajo · Laudos',               'laudos'),
    ('2026-09-29', 'DiaD',           'Día D · Somos aliados',          'dia-d-somos-aliados'),
    ('2026-09-30', 'Metodo',         'Cómo trabajamos',                'como-trabajamos'),
    ('2026-10-01', 'DiaDSantos',     'Día D · Santiago Santos',        'dia-d-santos'),
    ('2026-10-02', 'Egonomista',     'Nos mencionan · @egonomista',    'nos-mencionan-egonomista'),
    ('2026-10-03', 'DiaDSierra',     'Día D · Ricardo Sierra',         'dia-d-sierra'),
    ('2026-10-04', 'Servicios',      'Qué construimos',                'que-construimos'),
    ('2026-10-05', 'Segovia',        'Trabajo · Segovia',              'segovia'),
    ('2026-10-06', 'DiaDPublico',    'Día D · Para quién es',          'dia-d-publico'),
    ('2026-10-07', 'Porkia',         'Trabajo · Porkia',               'porkia'),
    ('2026-10-08', 'DiaDJoffroy',    'Día D · André Joffroy',          'dia-d-joffroy'),
    ('2026-10-09', 'DiaDLongevidad', 'Día D · Longevidad',             'dia-d-longevidad'),
    ('2026-10-10', 'DiaDLugar',      'Día D · El lugar',               'dia-d-lugar'),
    ('2026-10-11', 'DiaDSoftware',   'Día D · Por qué estamos',        'dia-d-por-que-estamos'),
    ('2026-10-12', 'DiaDFaltan2',    'Día D · Faltan dos días',        'dia-d-faltan-2'),
    ('2026-10-13', 'DiaDManana',     'Día D · Mañana',                 'dia-d-manana'),
    ('2026-10-14', 'DiaDHoy',        'Día D · Hoy',                    'dia-d-hoy'),
]

HISTORIAS = [
    ('StAliados',    'Historia · Somos el software del Día D'),
    ('StPrincipios', 'Historia · Tres reglas'),
    ('StMcCann',     'Historia · Joe McCann'),
    ('StSantos',     'Historia · Santiago Santos'),
    ('StSierra',     'Historia · Ricardo Sierra'),
    ('StJoffroy',    'Historia · André Joffroy'),
    ('StLongevidad', 'Historia · Longevidad'),
    ('StCuenta14',   'Historia · Faltan 14 días'),
    ('StCuenta07',   'Historia · Faltan 7 días'),
    ('StCuenta03',   'Historia · Faltan 3 días'),
    ('StCuenta01',   'Historia · Mañana'),
    ('StCuenta00',   'Historia · Hoy'),
    ('StVivo',       'Historia · Plantilla en vivo'),
    ('StCierre',     'Historia · Plantilla de cierre'),
]

pathlib.Path('calendario.json').write_text(json.dumps(
    {'feed': [dict(n=i + 1, fecha=f, artboard=a, titulo=t, slug=s)
              for i, (f, a, t, s) in enumerate(CALENDARIO)],
     'historias': [dict(artboard=a, titulo=t) for a, t in HISTORIAS]},
    ensure_ascii=False, indent=2), encoding='utf-8')

# canvas.json — se lee como el grid de Instagram (más reciente arriba a la izquierda)
W, H, GX, GY = 1080, 1350, 100, 120
def at(cx, ry, w=W, h=H): return dict(x=cx * (W + GX), y=ry * (H + GY), w=w, h=h)

total = len(CALENDARIO)
artboards = []
for i, (fecha, ab, titulo, _slug) in enumerate(CALENDARIO):
    idx = total - (i + 1)                     # 0 = publicación más reciente
    artboards.append(dict(file=f'{ab}.dc.html',
                          title=f'{i + 1} · {fecha[8:]}-{["","ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"][int(fecha[5:7])]} · {titulo}',
                          **at(idx % 3, idx // 3)))

fila_hist = (total + 2) // 3 + 1
for j, (ab, titulo) in enumerate(HISTORIAS):
    artboards.append(dict(file=f'{ab}.dc.html', title=titulo,
                          **at(j % 3, fila_hist + j // 3, h=1920)))

artboards.append(dict(file='Avatar.dc.html', title='Avatar 1080 × 1080',
                      **at(0, fila_hist + (len(HISTORIAS) + 2) // 3 + 1, h=1080)))

canvas = {
  'artboards': artboards,
  'annotations': [
    dict(id='orden', x=0, y=-300, w=1500,
         text='FEED — se lee como el grid de Instagram: la publicación más reciente arriba a la izquierda.\n'
              'Una publicación diaria del 17 de septiembre al 14 de octubre de 2026 (28 en total), con el Día D de 10ampro como remate.\n'
              'Catorce piezas son del Día D; no van dos días seguidos hasta el 7 de octubre. Del 8 al 14 sí, porque es la semana del evento.\n'
              'Exportar cada artboard como PNG 1080 × 1350. Captions, alt y hashtags en brand/instagram/CAPTIONS.md.'),
    dict(id='historias', x=0, y=(fila_hist * (H + GY)) - 300, w=1500,
         text='HISTORIAS 1080 × 1920 — zonas seguras de 250 px arriba y 320 px abajo.\n'
              'La cuenta regresiva se publica los días 30 de septiembre (faltan 14), 7, 11, 13 y 14 de octubre.\n'
              'Las dos últimas son plantillas: la foto real del día se pega encima desde la app de Instagram.\n'
              'En todas, sticker de enlace a eldiad.10am.pro y mención a @10ampro.'),
  ],
  'launch': {'view': 'canvas'},
}
pathlib.Path('canvas.json').write_text(json.dumps(canvas, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'artboards: {len(list(pathlib.Path(".").glob("*.dc.html")))} · feed {total} · historias {len(HISTORIAS)}')
