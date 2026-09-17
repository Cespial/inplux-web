#!/usr/bin/env python3
"""Arma el paquete que se le envía a la comunicadora: imágenes en el formato correcto,
un documento autocontenido que se abre en el navegador, los captions en texto plano y
una hoja de control. Se corre desde brand/instagram/canvas/.

Uso: python3 build-entrega.py [carpeta-destino]
"""
import csv
import html as H
import pathlib
import shutil
import sys
import zipfile

import captions as C

RAIZ = C.RAIZ
PUB = list(C.publicaciones())
HIST = C.historias()
DESTINO = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else RAIZ / 'entrega').resolve()
CARPETA = DESTINO / 'INPLUX-instagram-dia-d'
HORA = '7:30 a. m.'

# ---------------------------------------------------------------- imágenes

def copiar():
    for sub in ('publicaciones', 'historias', 'perfil'):
        (CARPETA / sub).mkdir(parents=True, exist_ok=True)
    for p in PUB:
        origen = RAIZ / 'exports' / p['ext'] / f"{p['base']}.{p['ext']}"
        shutil.copy(origen, CARPETA / 'publicaciones' / origen.name)
    for h in HIST:
        origen = RAIZ / 'exports' / h['ext'] / f"{h['base']}.{h['ext']}"
        shutil.copy(origen, CARPETA / 'historias' / origen.name)
    shutil.copy(RAIZ / 'exports' / 'png' / 'avatar.png',
                CARPETA / 'perfil' / 'avatar-inplux-1080.png')


# ---------------------------------------------------------------- texto plano

def texto_plano():
    lineas = ['INPLUX · Instagram · camino al Día D',
              'Captions en texto plano. El documento con las imágenes es EMPEZAR-AQUI.html',
              '=' * 72, '']
    for p in PUB:
        lineas += [f"{p['n']} · {p['dia']} {p['fecha_corta']} · {p['titulo']}",
                   f"imagen: publicaciones/{p['base']}.{p['ext']}", '',
                   p['caption'], '', p['tags'], '',
                   f"ALT: {p['alt']}"]
        if p['etiquetas']:
            lineas += ['', 'ETIQUETAR: ' + ' '.join(p['etiquetas'])]
        if p['pendientes']:
            lineas += ['', 'CONFIRMAR ANTES DE PUBLICAR:']
            lineas += [f'  - {x}' for x in p['pendientes']]
        lineas += ['', '-' * 72, '']
    (CARPETA / 'captions.txt').write_text('\n'.join(lineas), encoding='utf-8')


# ---------------------------------------------------------------- hoja de control

def hoja():
    with (CARPETA / 'control.csv').open('w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['#', 'Fecha', 'Día', 'Hora', 'Tipo', 'Imagen',
                    'Primera línea del caption', 'Hashtags', 'Pendiente', 'Publicada'])
        for p in PUB:
            w.writerow([p['n'], p['iso'], p['dia'], HORA,
                        'Día D' if p['diad'] else 'INPLUX',
                        f"publicaciones/{p['base']}.{p['ext']}",
                        p['caption'].split('\n')[0], p['tags'],
                        '; '.join(p['pendientes']), ''])
        for h in HIST:
            w.writerow(['H' + h['n'], '', '', '', 'Historia',
                        f"historias/{h['base']}.{h['ext']}", h['titulo'], '',
                        h['nota'] or '', ''])


# ---------------------------------------------------------------- lista de tomas

TOMAS = [
    ('Antes del 10 de octubre', [
        ('El Auditorio Fundadores por fuera',
         'Con el nombre visible si lo hay. De día o al atardecer. El campus de EAFIT es abierto.',
         'Hoy la publicación 24 es solo tipografía porque no existe una foto del auditorio con '
         'licencia usable. Con esta foto esa pieza pasa a ser evidencia.'),
        ('Retratos de Jaime y Cristian',
         'Plano medio, luz natural, fondo neutro, uno por persona. Y una de los dos trabajando, '
         'sin posar.',
         'Habilita la publicación de equipo, que está diseñada desde hace semanas y no se puede '
         'armar sin fotos reales. Nunca se publica con foto de banco.'),
    ]),
    ('El 14 de octubre, durante el evento', [
        ('La valla o pantalla de aliados con el logo de INPLUX visible',
         'De frente, que se lea. Es la toma más importante del día.',
         'Es la prueba de que fuimos aliados. Sin ella, el cierre del evento se cuenta de oídas.'),
        ('El auditorio lleno desde atrás, antes de arrancar',
         'Horizontal y vertical. Sin rostros identificables en primer plano.',
         'Va en la historia de cierre y en la publicación posterior al evento.'),
        ('El escenario en uso, desde el público',
         'Contraluz está bien. No hace falta que se distinga quién habla.',
         'Sirve para historias en vivo durante la jornada.'),
        ('Detalles del día',
         'La escarapela, la agenda impresa, el café, la entrada. Cosas, no personas.',
         'Son las texturas que rellenan las historias sin tener que mostrar caras ajenas.'),
        ('Alguien del equipo en el evento',
         'Plano medio, sin posar, haciendo algo.',
         'Es lo único que permite decir «estuvimos» en primera persona.'),
        ('La salida, al cierre',
         'El auditorio vaciándose, o la ciudad al salir.',
         'Cierra la serie el 15 de octubre.'),
    ]),
]

REGLAS_FOTO = [
    'Vertical, 4:5 o 9:16. Nada cuadrado ni horizontal si se puede evitar.',
    'Dejar aire arriba y abajo del encuadre: ahí va el texto y no puede tapar lo importante.',
    'Luz natural o la del lugar. Sin flash directo.',
    'Sin filtros, sin retoque de color, sin marcos. El tratamiento se lo damos nosotros.',
    'Enviar el archivo original de la cámara o del celular, por Drive o AirDrop. '
    'Por WhatsApp no, porque lo comprime y no hay vuelta atrás.',
    'Nombrar así: fecha-lugar-tema.jpg, por ejemplo 2026-10-14-eafit-valla-aliados.jpg',
]


def tomas_txt():
    lineas = ['INPLUX · Instagram · fotos que faltan',
              'Lo que no podemos resolver sin cámara.', '=' * 72, '']
    for bloque, items in TOMAS:
        lineas += [bloque.upper(), '']
        for titulo, como, para in items:
            lineas += [f'  {titulo}', f'    Cómo: {como}', f'    Para qué: {para}', '']
        lineas += ['-' * 72, '']
    lineas += ['CÓMO ENTREGARLAS', '']
    lineas += [f'  - {r}' for r in REGLAS_FOTO]
    (CARPETA / 'fotos-que-faltan.txt').write_text('\n'.join(lineas), encoding='utf-8')


def tomas_html():
    bloques = ''
    for titulo_bloque, items in TOMAS:
        filas = ''.join(
            f'<div class="toma"><b>{H.escape(t)}</b>'
            f'<p class="como">{H.escape(c)}</p>'
            f'<p class="para"><span>Para qué</span> {H.escape(pa)}</p></div>'
            for t, c, pa in items)
        bloques += f'<div class="bloque-tomas"><h3>{H.escape(titulo_bloque)}</h3>{filas}</div>'
    reglas = ''.join(f'<li>{H.escape(r)}</li>' for r in REGLAS_FOTO)
    return (f'<div class="tomas">{bloques}</div>'
            f'<div class="panel" style="margin-top:20px"><h3>Cómo entregarlas</h3><ul>{reglas}</ul></div>')


# ---------------------------------------------------------------- documento

def tarjeta(p):
    pend = ''.join(f'<li>{H.escape(x)}</li>' for x in p['pendientes'])
    etiq = ' '.join(H.escape(x) for x in p['etiquetas'])
    return f'''<article class="pieza{' es-diad' if p['diad'] else ''}" data-diad="{int(p['diad'])}" data-pend="{int(bool(p['pendientes']))}">
  <div class="lamina"><img src="publicaciones/{p['base']}.{p['ext']}" alt="{H.escape(p['alt'])}" loading="lazy" width="1080" height="1350"></div>
  <div class="texto">
    <header>
      <span class="num">{p['n']}</span>
      <span class="cuando">{p['dia']} {H.escape(p['fecha_corta'])} &middot; {HORA}</span>
      <span class="etiqueta{' t-diad' if p['diad'] else ''}">{H.escape(p['titulo'])}</span>
    </header>
    <div class="copy" id="c{p['n']}">{H.escape(p['caption'])}</div>
    <button class="copiar" data-obj="c{p['n']}">Copiar caption</button>
    <p class="tags">{H.escape(p['tags'])}</p>
    <p class="alt"><b>Texto alternativo</b> {H.escape(p['alt'])}</p>
    {f'<p class="alt"><b>Etiquetar</b> {etiq}</p>' if etiq else ''}
    {f'<div class="notas"><b>Confirmar antes de publicar</b><ul>{pend}</ul></div>' if pend else ''}
    <p class="archivo">publicaciones/{p['base']}.{p['ext']}</p>
  </div>
</article>'''


def tarjeta_hist(h):
    nota = f'<span class="hnota">{H.escape(h["nota"])}</span>' if h['nota'] else ''
    return f'''<figure class="hist">
  <img src="historias/{h['base']}.{h['ext']}" alt="{H.escape(h['titulo'])}" loading="lazy" width="1080" height="1920">
  <figcaption><b>{H.escape(h['titulo'])}</b><span>{H.escape(h['cuando'])}</span>{nota}</figcaption>
</figure>'''


CSS = '''
:root {
  --papel:#f8f8f7; --texto:#1a1918; --suave:#6e6b68; --linea:#e5e3e0;
  --acento:#0d7d74; --tarjeta:#fff; --alza:rgba(13,125,116,.07); --aviso:rgba(180,83,9,.09);
  --avisoborde:#b45309;
  --serif:Newsreader,Georgia,'Times New Roman',serif;
  --sans:Geist,system-ui,-apple-system,'Helvetica Neue',sans-serif;
  --mono:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --papel:#141312; --texto:#f2f1ef; --suave:#a8a5a0; --linea:rgba(255,255,255,.13);
  --acento:#15dcc4; --tarjeta:#1f1e1d; --alza:rgba(21,220,196,.09);
  --aviso:rgba(251,191,36,.1); --avisoborde:#fbbf24;
}}
:root[data-theme="dark"]{
  --papel:#141312; --texto:#f2f1ef; --suave:#a8a5a0; --linea:rgba(255,255,255,.13);
  --acento:#15dcc4; --tarjeta:#1f1e1d; --alza:rgba(21,220,196,.09);
  --aviso:rgba(251,191,36,.1); --avisoborde:#fbbf24;
}
*{box-sizing:border-box}
body{margin:0;background:var(--papel);color:var(--texto);font-family:var(--sans);
  font-weight:300;font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.envoltura{max-width:1120px;margin:0 auto;padding-inline:20px;padding-block:56px 96px}
h1{font-family:var(--serif);font-weight:300;font-size:clamp(40px,7.5vw,74px);line-height:1.02;
  letter-spacing:-.02em;margin:0 0 22px;text-wrap:balance}
h1 em,h2 em{font-style:italic;color:var(--acento)}
h2{font-family:var(--serif);font-weight:300;font-size:clamp(30px,5vw,42px);letter-spacing:-.02em;
  margin:72px 0 14px;text-wrap:balance}
h3{font:500 12px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--suave);
  margin:0 0 14px}
.sobre{font:500 13px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;
  color:var(--suave);margin:0 0 20px}
p{max-width:64ch}
.entrada{color:var(--suave);font-size:16px;margin:0 0 14px}
.entrada b,li b{color:var(--texto);font-weight:500}
.paneles{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;margin:32px 0 0}
.panel{background:var(--tarjeta);border:1px solid var(--linea);border-radius:12px;padding:22px}
.panel ol,.panel ul{margin:0;padding-left:20px}
.panel li+li{margin-top:9px}
.panel.ojo{background:var(--aviso);border-color:var(--avisoborde)}
.cifras{display:flex;flex-wrap:wrap;gap:30px;margin:34px 0 0;padding-top:26px;border-top:1px solid var(--linea)}
.cifra b{display:block;font-family:var(--serif);font-weight:300;font-size:40px;line-height:1;letter-spacing:-.02em}
.cifra span{font-family:var(--mono);font-size:12px;color:var(--suave)}
.barra{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;display:flex;flex-wrap:wrap;
  gap:8px;align-items:center;margin:40px 0 26px;padding-block:12px;background:var(--papel);
  border-bottom:1px solid var(--linea)}
.filtro{font:500 12px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;padding:9px 15px;
  border-radius:999px;border:1px solid var(--linea);background:transparent;color:var(--suave);cursor:pointer}
.filtro[aria-pressed="true"]{background:var(--texto);color:var(--papel);border-color:var(--texto)}
.filtro:focus-visible,.copiar:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
.lista{display:flex;flex-direction:column;gap:16px}
.pieza{display:grid;grid-template-columns:232px 1fr;gap:26px;padding:22px;background:var(--tarjeta);
  border:1px solid var(--linea);border-radius:12px}
.pieza.es-diad{background:var(--alza)}
.lamina img{display:block;width:100%;height:auto;border-radius:6px;border:1px solid var(--linea)}
.texto{display:flex;flex-direction:column;gap:12px;min-width:0}
.texto header{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px}
.num{font-family:var(--serif);font-size:34px;font-weight:300;line-height:1;letter-spacing:-.02em;
  color:var(--acento);font-variant-numeric:tabular-nums}
.cuando{font-family:var(--mono);font-size:12px;color:var(--suave)}
.etiqueta{font:500 11px/1 var(--sans);letter-spacing:.07em;text-transform:uppercase;color:var(--suave);
  padding:5px 9px;border:1px solid var(--linea);border-radius:4px}
.etiqueta.t-diad{color:var(--acento);border-color:var(--acento)}
.copy{font-size:15px;line-height:1.55;white-space:pre-wrap;padding:15px 16px;background:var(--papel);
  border:1px solid var(--linea);border-radius:8px;user-select:all;overflow-wrap:anywhere}
.copiar{align-self:flex-start;font:500 11px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;
  padding:8px 13px;border-radius:6px;border:1px solid var(--linea);background:transparent;
  color:var(--suave);cursor:pointer}
.copiar:hover{color:var(--texto);border-color:var(--texto)}
.tags{font-family:var(--mono);font-size:12px;color:var(--acento);margin:0;overflow-wrap:anywhere}
.alt{font-size:13px;color:var(--suave);margin:0}
.alt b{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;
  color:var(--texto);margin-right:6px}
.notas{border-left:3px solid var(--avisoborde);background:var(--aviso);border-radius:8px;
  padding:12px 14px;font-size:13px}
.notas b{display:block;font:500 11px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;
  color:var(--texto);margin-bottom:8px}
.notas ul{margin:0;padding-left:18px}
.notas li+li{margin-top:6px}
.archivo{font-family:var(--mono);font-size:11px;color:var(--suave);margin:0;padding-top:10px;
  border-top:1px solid var(--linea);overflow-wrap:anywhere}
.rejilla{display:grid;grid-template-columns:repeat(auto-fill,minmax(178px,1fr));gap:20px;margin-top:28px}
.hist{margin:0}
.hist img{display:block;width:100%;height:auto;border-radius:8px;border:1px solid var(--linea)}
.hist figcaption{margin-top:9px;display:flex;flex-direction:column;gap:3px}
.hist figcaption b{font-weight:500;font-size:13px}
.hist figcaption span{font-family:var(--mono);font-size:11px;color:var(--suave)}
.hist .hnota{color:var(--avisoborde)}
.tomas{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-top:28px}
.bloque-tomas{background:var(--tarjeta);border:1px solid var(--linea);border-radius:12px;padding:22px}
.bloque-tomas h3{margin-bottom:18px}
.toma{padding:14px 0;border-top:1px solid var(--linea)}
.toma:first-of-type{border-top:0;padding-top:0}
.toma b{display:block;font-weight:500;font-size:16px;margin-bottom:5px}
.toma p{margin:0;max-width:none}
.toma .como{font-size:14px;color:var(--suave)}
.toma .para{font-size:13px;color:var(--suave);margin-top:6px}
.toma .para span{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.06em;
  color:var(--acento);margin-right:5px}
@media (max-width:720px){.pieza{grid-template-columns:1fr}.lamina{max-width:280px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
'''

JS = '''
(function(){
  var lista=document.getElementById('lista');
  var piezas=[].slice.call(lista.querySelectorAll('.pieza'));
  [].slice.call(document.querySelectorAll('.filtro')).forEach(function(b,_,todos){
    b.addEventListener('click',function(){
      todos.forEach(function(o){o.setAttribute('aria-pressed',String(o===b));});
      var f=b.dataset.f;
      piezas.forEach(function(p){
        p.hidden=(f==='diad'&&p.dataset.diad!=='1')||(f==='pend'&&p.dataset.pend!=='1');
      });
    });
  });
  lista.addEventListener('click',function(ev){
    var b=ev.target.closest('.copiar'); if(!b) return;
    var nodo=document.getElementById(b.dataset.obj), previo='Copiar caption';
    function ok(){b.textContent='Copiado';setTimeout(function(){b.textContent=previo;},1600);}
    function manual(){
      var r=document.createRange();r.selectNodeContents(nodo);
      var s=window.getSelection();s.removeAllRanges();s.addRange(r);
      b.textContent='Seleccionado, copia con Cmd+C';
      setTimeout(function(){b.textContent=previo;},2800);
    }
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(nodo.textContent).then(ok,manual);
      } else { manual(); }
    }catch(e){manual();}
  });
})();
'''


def documento(artefacto=False):
    """El mismo documento en dos envases: archivo suelto para la carpeta que se envía,
    y cuerpo sin <html> para publicarlo como artefacto (la plataforma pone el esqueleto)."""
    pend = sum(1 for p in PUB if p['pendientes'])
    diad = sum(1 for p in PUB if p['diad'])
    cabeza = ('' if artefacto else '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
''') + '''<title>Instagram de INPLUX · camino al Día D</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
''' + f'<style>{CSS}</style>' + ('' if artefacto else '\n</head>\n<body>')
    doc = f'''{cabeza}
<div class="envoltura">
  <p class="sobre">INPLUX &middot; @inplux_ &middot; del 17 de septiembre al 14 de octubre de 2026</p>
  <h1>Veintiocho publicaciones camino al <em>Día D</em>.</h1>
  <p class="entrada">Todo lo que hay que publicar está en esta carpeta: la imagen, el texto y el
  texto alternativo de cada una. <b>Una publicación por día</b>, de hoy hasta el miércoles
  14 de octubre, que es cuando se hace el Día D de 10ampro en el Auditorio Fundadores de
  EAFIT. INPLUX está en la lista de aliados de ese evento con la etiqueta <b>Software</b>, y
  catorce de las publicaciones cuelgan de ahí.</p>
  <p class="entrada">Las imágenes ya están en el tamaño y el formato que Instagram necesita.
  No hay que recortarlas, redimensionarlas ni pasarlas por otra herramienta: cualquiera de
  esas cosas daña la tipografía.</p>

  <div class="cifras">
    <div class="cifra"><b>{len(PUB)}</b><span>publicaciones</span></div>
    <div class="cifra"><b>{diad}</b><span>del Día D</span></div>
    <div class="cifra"><b>{len(HIST)}</b><span>historias</span></div>
    <div class="cifra"><b>{pend}</b><span>con algo por confirmar</span></div>
  </div>

  <div class="paneles">
    <div class="panel">
      <h3>Qué hay en la carpeta</h3>
      <ul>
        <li><b>publicaciones/</b> las {len(PUB)} imágenes del feed, nombradas por la fecha en
        que salen, así que ordenadas por nombre quedan en orden.</li>
        <li><b>historias/</b> las {len(HIST)} verticales.</li>
        <li><b>perfil/</b> el avatar de la cuenta.</li>
        <li><b>captions.txt</b> los mismos textos, en plano, por si preferís copiarlos de ahí.</li>
        <li><b>control.csv</b> una hoja para ir marcando lo publicado.</li>
      </ul>
    </div>
    <div class="panel">
      <h3>Cómo se publica cada una</h3>
      <ol>
        <li>La hora es <b>{HORA} de Colombia</b>, todos los días.</li>
        <li>Subir la imagen tal cual, sin filtros ni recortes.</li>
        <li>Copiar el texto de esta página y pegarlo como pie de publicación.</li>
        <li>El <b>texto alternativo</b> va en el campo de accesibilidad, nunca dentro del pie.</li>
        <li>Etiquetar solo las cuentas que dice cada ficha. Ninguna más.</li>
      </ol>
    </div>
    <div class="panel ojo">
      <h3>Tres cosas que no se dicen</h3>
      <ul>
        <li><b>El precio de la boleta.</b> El dato está en conflicto entre fuentes y nosotros
        no vendemos entradas del evento.</li>
        <li><b>Que tenemos estand o que hablamos en tarima.</b> INPLUX aparece como aliado con
        su logo, nada más. Nada de «vení a buscarnos».</li>
        <li><b>La fiesta de cierre en el rooftop de El Zarzo.</b> Está reservada a un grupo de
        suscriptores del organizador; no es nuestra para ofrecerla.</li>
      </ul>
    </div>
    <div class="panel">
      <h3>El tono de la cuenta</h3>
      <ul>
        <li><b>Cero emoji</b>, en el pie y en las respuestas.</li>
        <li>Primera persona del plural: nosotros hacemos, nosotros construimos.</li>
        <li>Nada de «¡Hola comunidad!», «Cotiza ya» ni signos de admiración.</li>
        <li>Si alguien comenta o escribe, responder con un hecho y un enlace, sin promesas.</li>
      </ul>
    </div>
  </div>

  <h2>Las {len(PUB)} <em>publicaciones</em>.</h2>
  <p class="entrada">Las marcadas en amarillo tienen algo por confirmar antes de salir. Si
  llega el día y no está confirmado, se corre esa publicación y se adelanta la siguiente.</p>

  <div class="barra" role="group" aria-label="Filtrar publicaciones">
    <button class="filtro" data-f="todas" aria-pressed="true">Todas</button>
    <button class="filtro" data-f="diad" aria-pressed="false">Solo Día D</button>
    <button class="filtro" data-f="pend" aria-pressed="false">Por confirmar</button>
  </div>

  <div class="lista" id="lista">
{chr(10).join(tarjeta(p) for p in PUB)}
  </div>

  <h2>Las {len(HIST)} <em>historias</em>.</h2>
  <p class="entrada">Verticales, todas del Día D. Cada una sale el día que dice su ficha. En
  todas hay que poner el <b>sticker de enlace a eldiad.10am.pro</b> y <b>mencionar a
  @10ampro</b>: esa mención es lo que le permite al organizador reposteárnoslas. Guardalas
  todas en una historia destacada nueva llamada <b>Día D</b>.</p>
  <p class="entrada">Las dos últimas son plantillas: tienen un recuadro punteado donde va la
  foto real del día. Se sube la plantilla como fondo y encima se pega la foto desde la app,
  ajustada al recuadro, para que todas queden iguales.</p>
  <div class="rejilla">
{chr(10).join(tarjeta_hist(h) for h in HIST)}
  </div>

  <h2>Las fotos que <em>faltan</em>.</h2>
  <p class="entrada">Estas no las podemos resolver nosotros: hay que ir y tomarlas. Las del 14
  de octubre son de ese día y no se pueden repetir, así que conviene que alguien llegue con el
  encargo claro. Está también en <b>fotos-que-faltan.txt</b>, por si hay que reenviarlo suelto.</p>
  {tomas_html()}

  <h2>Si algo se <em>traba</em>.</h2>
  <p class="entrada">Las publicaciones marcadas dependen de datos que están por confirmar con
  terceros. Ninguna bloquea a las demás: si una no se puede publicar el día que le toca, se
  corre y sigue el calendario. Cualquier cambio de texto o de imagen se pide antes de
  publicar, no después.</p>
</div>
<script>{JS}</script>''' + ('' if artefacto else '\n</body>\n</html>') + '\n'
    destino = (RAIZ / 'tablero.html') if artefacto else (CARPETA / 'EMPEZAR-AQUI.html')
    destino.write_text(doc, encoding='utf-8')


def comprimir():
    zip_path = DESTINO / 'INPLUX-instagram-dia-d.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for f in sorted(CARPETA.rglob('*')):
            if f.is_file():
                z.write(f, f.relative_to(DESTINO))
    return zip_path


if __name__ == '__main__':
    if CARPETA.exists():
        shutil.rmtree(CARPETA)
    copiar()
    texto_plano()
    tomas_txt()
    hoja()
    documento()
    documento(artefacto=True)
    z = comprimir()
    n_img = len(list((CARPETA / 'publicaciones').iterdir())) + len(list((CARPETA / 'historias').iterdir()))
    print(f'{z}  ·  {z.stat().st_size / 1_048_576:.1f} MB  ·  {n_img} imágenes')
