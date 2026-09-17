#!/usr/bin/env python3
"""Lee CAPTIONS.md y calendario.json. Fuente única para el tablero interno y la entrega."""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).parent.parent

DIAS = {'lun': 'lunes', 'mar': 'martes', 'mié': 'miércoles', 'jue': 'jueves',
        'vie': 'viernes', 'sáb': 'sábado', 'dom': 'domingo'}

def formato(base):
    """En las piezas tipográficas el PNG pesa menos que el JPG y no ensucia los remates
    finos de la Newsreader. En las que llevan fotografía se dispara por encima del mega y
    ahí gana el JPG. El umbral decide solo, sin listas que se desactualicen."""
    png = RAIZ / 'exports' / 'png' / f'{base}.png'
    return 'jpg' if png.exists() and png.stat().st_size > 500_000 else 'png'


def calendario():
    return json.loads((RAIZ / 'canvas' / 'calendario.json').read_text(encoding='utf-8'))


def publicaciones():
    texto = (RAIZ / 'CAPTIONS.md').read_text(encoding='utf-8')
    for bloque in texto.split('\n### ')[1:]:
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
        # Un `[ ]` es un bloqueo: algo que hay que confirmar antes de publicar.
        # Una línea de «Etiquetar» o «Comentar» es rutina, no bloquea nada.
        tags, pendientes, etiquetas, caption = '', [], [], []
        for p in [x.strip() for x in resto.split('\n\n') if x.strip()]:
            if p.startswith('`#'):
                tags = p.strip('`')
            elif p.startswith('`[ ]`') or p.startswith('Etiquetar'):
                for linea in p.split('\n'):
                    bloqueo = linea.startswith('`[ ]`')
                    linea = re.sub(r'`\[ \]`\s*', '', linea).replace('**', '').strip()
                    if not linea:
                        continue
                    (pendientes if bloqueo else etiquetas).append(linea)
            else:
                caption.append(p)
        base = archivo.group(1)[:-4]
        dia, resto_fecha = fecha.split(' ', 1)
        yield dict(
            n=n.zfill(2), fecha=fecha, dia=DIAS.get(dia, dia), fecha_corta=resto_fecha,
            titulo=titulo, base=base, ext=formato(base),
            caption='\n\n'.join(caption), alt=alt, tags=tags,
            pendientes=pendientes, etiquetas=etiquetas,
            diad='Día D' in titulo, iso=base[:10])


def historias():
    """El cuándo y la nota de cada historia salen de la tabla al final de CAPTIONS.md."""
    texto = (RAIZ / 'CAPTIONS.md').read_text(encoding='utf-8')
    tabla = {}
    for fila in re.finditer(r'^\|\s*`(historia_\d+_[\w\-]+)\.jpg`\s*\|([^|]*)\|([^|]*)\|',
                            texto, re.M):
        tabla[fila.group(1)] = (fila.group(2).strip(), fila.group(3).strip())

    salida = []
    for i, h in enumerate(calendario()['historias'], 1):
        encontrados = sorted((RAIZ / 'exports' / 'png').glob(f'historia_{i:02d}_*.png'))
        if not encontrados:
            continue
        base = encontrados[0].stem
        cuando, nota = tabla.get(base, ('', ''))
        salida.append(dict(n=f'{i:02d}', base=base, cuando=cuando, ext=formato(base),
                           nota=nota.replace('**', ''),
                           titulo=h['titulo'].replace('Historia · ', '')))
    return salida
