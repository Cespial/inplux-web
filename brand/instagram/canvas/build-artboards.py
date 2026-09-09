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

def lista(name, theme, kick, title_html, items):
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
        row([meta('inplux.co', t), lockup(t)]),
    ])

def pieza(name, theme, kick, title_html, size, lines, label):
    t = T[theme]
    page(name, theme, [
        kicker(kick, t),
        headline(title_html, t, size),
        col([meta(lines, t, 26, t['fg']), row([meta(label, t, 22), lockup(t)])], 36),
    ])

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

producto('Gobia', 'ink', 'Trabajo / Gestión pública · Piloto activo',
         f'Hacer visible la operación de un {em("municipio", T["ink"])}.',
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

pieza('Columna', 'ink', 'Columna / Al Poniente',
      f'Lo que la máquina no puede {em("firmar", T["ink"])}.', 112,
      'Jaime Alonso Cano Pino · 12 JUN 2026', 'Columna firmada · publicación del equipo')

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

t = T['ink']
page('DiaD', 'ink', [
    kicker('Aliados / El Día D · 10ampro', t),
    col([headline(f'Somos aliados de El {em("Día D", t)}.', t, 112),
         body('Miércoles 14 de octubre de 2026<br>Auditorio Fundadores · Universidad EAFIT · Medellín<br>10:00 a. m. – 5:00 p. m.', t, 34)], 48),
    col([meta('eldiad.10am.pro', t, 26, t['fg']), row([meta('Software · De un problema real a producción', t, 22), lockup(t)])], 36),
])

# Avatar 1080×1080
t = T['ink']
pathlib.Path('Avatar.dc.html').write_text(head(t) +
    f'<div style="box-sizing: border-box; width: 1080px; height: 1080px; display: flex; align-items: center; justify-content: center; background: {t["bg"]}; overflow: hidden;">'
    f'<div style="margin-top: 36px;">{mark(800, t["fg"], t["accent"])}</div></div>\n' + TAIL, encoding='utf-8')

# canvas.json — se lee como el grid de Instagram (más reciente arriba a la izquierda)
W, H, GX, GY = 1080, 1350, 100, 120
def at(cx, ry, h=H): return dict(x=cx * (W + GX), y=ry * (H + GY), w=W, h=h)
canvas = {
  'artboards': [
    dict(file='Laudos.dc.html',      title='9 · Trabajo · Laudos',       **at(0, 0)),
    dict(file='Servicios.dc.html',   title='8 · Qué construimos',        **at(1, 0)),
    dict(file='Kelsen.dc.html',      title='7 · Trabajo · Kelsen',       **at(2, 0)),
    dict(file='Columna.dc.html',     title='6 · Columna · Al Poniente',  **at(0, 1)),
    dict(file='Metodo.dc.html',      title='5 · Cómo trabajamos',        **at(1, 1)),
    dict(file='Gobia.dc.html',       title='4 · Trabajo · Gobia',        **at(2, 1)),
    dict(file='Commonplace.dc.html', title='3 · Prensa · The Commonplace', **at(0, 2)),
    dict(file='Tribai.dc.html',      title='2 · Trabajo · Tribai',       **at(1, 2)),
    dict(file='Main.dc.html',        title='1 · Marca',                  **at(2, 2)),
    dict(file='DiaD.dc.html',        title='10 · Evento · Día D (Parte 5)', **at(0, 3)),
    dict(file='Avatar.dc.html',      title='Avatar 1080 × 1080',         **at(1, 3, 1080)),
  ],
  'annotations': [
    dict(id='orden', x=0, y=-260, w=1400,
         text='Se lee como el grid de Instagram: la publicación más reciente arriba a la izquierda.\n'
              'Orden de publicación: 1 Marca · 2 Tribai · 3 Commonplace · 4 Gobia · 5 Método · 6 Columna · 7 Kelsen · 8 Qué construimos · 9 Laudos.\n'
              'Exportar cada artboard como PNG (1080 × 1350). Captions y alt en brand/instagram/CAPTIONS.md.'),
    dict(id='diad', x=2360, y=4410, w=640,
         text='Día D: reservada para la Parte 5. La fecha de publicación se decide con el plan de 36 días.'),
  ],
  'launch': {'view': 'canvas'},
}
pathlib.Path('canvas.json').write_text(json.dumps(canvas, ensure_ascii=False, indent=2), encoding='utf-8')
print('artboards:', sorted(p.name for p in pathlib.Path('.').glob('*.dc.html')))
