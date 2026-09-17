#!/usr/bin/env python3
"""Genera tablero.html a partir de CAPTIONS.md, para que la página y el documento
nunca se desincronicen. Se corre desde brand/instagram/canvas/."""
import html as H
import json
import pathlib
import re

AQUI = pathlib.Path(__file__).parent.parent
CAP = (AQUI / 'CAPTIONS.md').read_text(encoding='utf-8')
CAL = json.loads((AQUI / 'canvas' / 'calendario.json').read_text(encoding='utf-8'))

DIAS = {'lun': 'lunes', 'mar': 'martes', 'mié': 'miércoles', 'jue': 'jueves',
        'vie': 'viernes', 'sáb': 'sábado', 'dom': 'domingo'}


def entradas():
    for bloque in CAP.split('\n### ')[1:]:
        lineas = bloque.split('\n')
        cab = lineas[0].strip()
        if '·' not in cab:
            continue
        partes = [p.strip() for p in cab.split(' · ')]
        n, fecha, titulo = partes[0], partes[1], ' · '.join(partes[2:])
        cuerpo = '\n'.join(lineas[1:]).split('\n---')[0]
        archivo = re.search(r'`([\w\-\.]+\.jpg)`', cuerpo)
        if not archivo:
            continue
        resto = cuerpo[archivo.end():]
        alt = ''
        m = re.search(r'\*\*Alt:\*\*\s*(.+)', resto)
        if m:
            alt = m.group(1).strip()
            resto = resto[:m.start()]
        tags, notas, caption = '', [], []
        for p in [x.strip() for x in resto.split('\n\n') if x.strip()]:
            if p.startswith('`#'):
                tags = p.strip('`')
            elif p.startswith('`[ ]`') or p.startswith('Etiquetar'):
                notas.append(re.sub(r'`\[ \]`\s*', '', p).replace('**', ''))
            else:
                caption.append(p)
        yield dict(n=n, fecha=fecha, titulo=titulo, archivo=archivo.group(1),
                   caption='\n\n'.join(caption), alt=alt, tags=tags, notas=notas)


FEED = [e for e in entradas()]
HIST = CAL['historias']
CUANDO = {p['slug']: p['fecha'] for p in CAL['feed']}


def tarjeta(e):
    dia, resto = e['fecha'].split(' ', 1)
    diad = 'Día D' in e['titulo']
    pend = bool(e['notas'])
    clases = 'pieza' + (' es-diad' if diad else '') + (' es-pendiente' if pend else '')
    notas = ''.join(f'<li>{H.escape(x)}</li>' for x in e['notas'])
    return f'''<article class="{clases}" data-diad="{int(diad)}" data-pend="{int(pend)}">
  <div class="lamina"><img src="exports/jpg/{e['archivo']}" alt="{H.escape(e['alt'])}" loading="lazy" width="1080" height="1350"></div>
  <div class="texto">
    <header>
      <span class="num">{H.escape(e['n'])}</span>
      <span class="cuando">{DIAS.get(dia, dia)} {H.escape(resto)}</span>
      <span class="etiqueta{' t-diad' if diad else ''}">{H.escape(e['titulo'])}</span>
    </header>
    <div class="copy" id="c{e['n']}">{H.escape(e['caption'])}</div>
    <button class="copiar" data-obj="c{e['n']}">Copiar caption</button>
    <p class="tags">{H.escape(e['tags'])}</p>
    <p class="alt"><b>Alt</b> {H.escape(e['alt'])}</p>
    {f'<ul class="notas">{notas}</ul>' if notas else ''}
    <p class="archivo">exports/jpg/{e['archivo']} &middot; exports/png/{e['archivo'][:-4]}.png</p>
  </div>
</article>'''


def historia(i, h):
    slug = h['artboard'].replace('St', '').lower()
    arch = sorted((AQUI / 'exports' / 'jpg').glob(f'historia_{i:02d}_*.jpg'))
    nombre = arch[0].name if arch else ''
    return f'''<figure class="hist">
  <img src="exports/jpg/{nombre}" alt="{H.escape(h['titulo'])}" loading="lazy" width="1080" height="1920">
  <figcaption>{H.escape(h['titulo'].replace('Historia · ', ''))}</figcaption>
</figure>'''


PAGINA = f'''<title>Camino al Día D</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
:root {{
  --papel: #f8f8f7; --tinta: #1a1918; --texto: #1a1918; --suave: #6e6b68;
  --linea: #e5e3e0; --acento: #0d7d74; --tarjeta: #ffffff; --alza: rgba(13,125,116,.07);
  --serif: Newsreader, Georgia, 'Times New Roman', serif;
  --sans: Geist, system-ui, -apple-system, 'Helvetica Neue', sans-serif;
  --mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --papel: #141312; --tinta: #f8f8f7; --texto: #f2f1ef; --suave: #a8a5a0;
    --linea: rgba(255,255,255,.13); --acento: #15dcc4; --tarjeta: #1f1e1d; --alza: rgba(21,220,196,.09);
  }}
}}
:root[data-theme="dark"] {{
  --papel: #141312; --tinta: #f8f8f7; --texto: #f2f1ef; --suave: #a8a5a0;
  --linea: rgba(255,255,255,.13); --acento: #15dcc4; --tarjeta: #1f1e1d; --alza: rgba(21,220,196,.09);
}}
* {{ box-sizing: border-box; }}
body {{
  margin: 0; background: var(--papel); color: var(--texto);
  font-family: var(--sans); font-weight: 300; font-size: 15px; line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}}
.envoltura {{ max-width: 1120px; margin: 0 auto; padding-inline: 20px; padding-block: 56px 96px; }}
h1 {{
  font-family: var(--serif); font-weight: 300; font-size: clamp(42px, 8vw, 78px);
  line-height: 1.02; letter-spacing: -.02em; margin: 0 0 22px; text-wrap: balance;
}}
h1 em {{ font-style: italic; color: var(--acento); }}
.sobre {{ font-family: var(--sans); font-weight: 500; font-size: 13px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--suave); margin: 0 0 20px; }}
.entrada {{ max-width: 62ch; color: var(--suave); font-size: 16px; margin: 0 0 12px; }}
.entrada b {{ color: var(--texto); font-weight: 500; }}
.cifras {{ display: flex; flex-wrap: wrap; gap: 30px; margin: 34px 0 0;
  padding-top: 26px; border-top: 1px solid var(--linea); }}
.cifra b {{ display: block; font-family: var(--serif); font-weight: 300; font-size: 40px;
  line-height: 1; letter-spacing: -.02em; }}
.cifra span {{ font-family: var(--mono); font-size: 12px; color: var(--suave); }}
.barra {{ position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5;
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  margin: 44px 0 30px; padding-block: 12px; background: var(--papel);
  border-bottom: 1px solid var(--linea); }}
.filtro {{ font: 500 12px/1 var(--sans); letter-spacing: .06em; text-transform: uppercase;
  padding: 9px 15px; border-radius: 999px; border: 1px solid var(--linea);
  background: transparent; color: var(--suave); cursor: pointer; }}
.filtro[aria-pressed="true"] {{ background: var(--texto); color: var(--papel); border-color: var(--texto); }}
.filtro:focus-visible {{ outline: 2px solid var(--acento); outline-offset: 2px; }}
.lista {{ display: flex; flex-direction: column; gap: 16px; }}
.pieza {{ display: grid; grid-template-columns: 232px 1fr; gap: 26px;
  padding: 22px; background: var(--tarjeta); border: 1px solid var(--linea); border-radius: 12px; }}
.pieza.es-diad {{ background: var(--alza); }}
.lamina img {{ display: block; width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--linea); }}
.texto {{ display: flex; flex-direction: column; gap: 12px; min-width: 0; }}
.texto header {{ display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; }}
.num {{ font-family: var(--serif); font-size: 34px; font-weight: 300; line-height: 1;
  letter-spacing: -.02em; color: var(--acento); font-variant-numeric: tabular-nums; }}
.cuando {{ font-family: var(--mono); font-size: 12px; color: var(--suave); }}
.etiqueta {{ font: 500 11px/1 var(--sans); letter-spacing: .07em; text-transform: uppercase;
  color: var(--suave); padding: 5px 9px; border: 1px solid var(--linea); border-radius: 4px; }}
.etiqueta.t-diad {{ color: var(--acento); border-color: var(--acento); }}
.copy {{ font-family: var(--sans); font-size: 15px; line-height: 1.55; white-space: pre-wrap;
  padding: 15px 16px; background: var(--papel); border: 1px solid var(--linea);
  border-radius: 8px; user-select: all; overflow-wrap: anywhere; }}
.copiar {{ align-self: flex-start; font: 500 11px/1 var(--sans); letter-spacing: .06em;
  text-transform: uppercase; padding: 8px 13px; border-radius: 6px;
  border: 1px solid var(--linea); background: transparent; color: var(--suave); cursor: pointer; }}
.copiar:hover {{ color: var(--texto); border-color: var(--texto); }}
.copiar:focus-visible {{ outline: 2px solid var(--acento); outline-offset: 2px; }}
.tags {{ font-family: var(--mono); font-size: 12px; color: var(--acento); margin: 0; overflow-wrap: anywhere; }}
.alt {{ font-size: 13px; color: var(--suave); margin: 0; }}
.alt b {{ font-family: var(--mono); font-size: 11px; text-transform: uppercase;
  letter-spacing: .06em; color: var(--texto); margin-right: 6px; }}
.notas {{ margin: 0; padding: 12px 14px 12px 30px; border-radius: 8px;
  border-left: 3px solid var(--acento); background: var(--alza); font-size: 13px; }}
.notas li + li {{ margin-top: 6px; }}
.archivo {{ font-family: var(--mono); font-size: 11px; color: var(--suave); margin: 0;
  padding-top: 10px; border-top: 1px solid var(--linea); overflow-wrap: anywhere; }}
h2 {{ font-family: var(--serif); font-weight: 300; font-size: 42px; letter-spacing: -.02em;
  margin: 76px 0 8px; }}
h2 em {{ font-style: italic; color: var(--acento); }}
.rejilla {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 18px; margin-top: 28px; }}
.hist {{ margin: 0; }}
.hist img {{ display: block; width: 100%; height: auto; border-radius: 8px; border: 1px solid var(--linea); }}
.hist figcaption {{ font-family: var(--mono); font-size: 11px; color: var(--suave); margin-top: 8px; }}
.vacio {{ color: var(--suave); font-size: 14px; padding: 30px 0; }}
@media (max-width: 720px) {{
  .pieza {{ grid-template-columns: 1fr; }}
  .lamina {{ max-width: 280px; }}
}}
@media (prefers-reduced-motion: reduce) {{ * {{ transition: none !important; }} }}
</style>

<div class="envoltura">
  <p class="sobre">INPLUX &middot; @inplux_ &middot; del 17 de septiembre al 14 de octubre de 2026</p>
  <h1>Veintiocho publicaciones camino al <em>Día D</em>.</h1>
  <p class="entrada">Una publicación diaria hasta el <b>miércoles 14 de octubre</b>, cuando el Día D de 10ampro reúne a fundadores, inversionistas, operadores, médicos y builders en el Auditorio Fundadores de EAFIT. INPLUX figura en la lista de aliados con la etiqueta <b>Software</b>.</p>
  <p class="entrada">Cada pieza está lista para subir. El caption se copia tal cual; el texto alternativo va en el campo de accesibilidad de Instagram. Las piezas marcadas tienen algo pendiente que solo el equipo puede cerrar.</p>

  <div class="cifras">
    <div class="cifra"><b>28</b><span>publicaciones</span></div>
    <div class="cifra"><b>14</b><span>del Día D</span></div>
    <div class="cifra"><b>14</b><span>historias</span></div>
    <div class="cifra"><b>3</b><span>con pendientes</span></div>
  </div>

  <div class="barra" role="group" aria-label="Filtrar publicaciones">
    <button class="filtro" data-f="todas" aria-pressed="true">Todas</button>
    <button class="filtro" data-f="diad" aria-pressed="false">Solo Día D</button>
    <button class="filtro" data-f="pend" aria-pressed="false">Con pendientes</button>
  </div>

  <div class="lista" id="lista">
{chr(10).join(tarjeta(e) for e in FEED)}
  </div>

  <h2>Catorce <em>historias</em>.</h2>
  <p class="entrada">Verticales de 1080 &times; 1920, todas del Día D. Se publican el mismo día que su publicación hermana, salvo la cuenta regresiva. En todas: sticker de enlace a eldiad.10am.pro y mención a @10ampro, que es lo que permite que 10ampro las repostee. Las dos últimas son plantillas: la foto real del día se pega encima desde la app.</p>
  <div class="rejilla">
{chr(10).join(historia(i, h) for i, h in enumerate(HIST, 1))}
  </div>
</div>

<script>
(function () {{
  var lista = document.getElementById('lista');
  var piezas = Array.prototype.slice.call(lista.querySelectorAll('.pieza'));
  var botones = Array.prototype.slice.call(document.querySelectorAll('.filtro'));

  botones.forEach(function (b) {{
    b.addEventListener('click', function () {{
      botones.forEach(function (o) {{ o.setAttribute('aria-pressed', String(o === b)); }});
      var f = b.dataset.f;
      piezas.forEach(function (p) {{
        p.hidden = (f === 'diad' && p.dataset.diad !== '1') ||
                   (f === 'pend' && p.dataset.pend !== '1');
      }});
    }});
  }});

  lista.addEventListener('click', function (ev) {{
    var b = ev.target.closest('.copiar');
    if (!b) return;
    var texto = document.getElementById(b.dataset.obj).textContent;
    var previo = b.textContent;
    function avisar(msg) {{
      b.textContent = msg;
      setTimeout(function () {{ b.textContent = previo; }}, 1600);
    }}
    try {{
      navigator.clipboard.writeText(texto).then(
        function () {{ avisar('Copiado'); }},
        function () {{ seleccionar(b); }}
      );
    }} catch (e) {{ seleccionar(b); }}
  }});

  function seleccionar(b) {{
    var nodo = document.getElementById(b.dataset.obj);
    var r = document.createRange();
    r.selectNodeContents(nodo);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    b.textContent = 'Seleccionado, copia con Cmd+C';
    setTimeout(function () {{ b.textContent = 'Copiar caption'; }}, 2600);
  }}
}})();
</script>
'''

(AQUI / 'tablero.html').write_text(PAGINA, encoding='utf-8')
print(f'tablero.html · {len(FEED)} publicaciones · {len(HIST)} historias')
for e in FEED:
    if not (AQUI / 'exports' / 'jpg' / e['archivo']).exists():
        print('  FALTA imagen:', e['archivo'])
    if not e['caption'] or not e['tags'] or not e['alt']:
        print('  INCOMPLETA:', e['n'], e['titulo'])
