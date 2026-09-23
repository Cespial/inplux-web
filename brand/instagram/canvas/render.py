#!/usr/bin/env python3
"""Renderiza cada artboard .dc.html a PNG y lo convierte a JPG listo para Instagram.

Salida en ../exports/: png/ es el maestro, jpg/ es lo que se sube (calidad 92, sRGB).
Los del feed se nombran por fecha de publicación para que arrastrarlos a Metricool
en orden sea trivial.

Trampa conocida: chrome --headless=new --screenshot escribe el PNG y después se cuelga.
Por eso cada render corre con timeout y se mata el proceso a la fuerza.
"""
import json, pathlib, shutil, subprocess, sys

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
SRGB = '/System/Library/ColorSync/Profiles/sRGB Profile.icc'
AQUI = pathlib.Path(__file__).parent
OUT = AQUI.parent / 'exports'
MESES = ['', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']


def render(artboard, destino, w, h):
    destino.parent.mkdir(parents=True, exist_ok=True)
    cmd = [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
           '--force-color-profile=srgb', '--font-render-hinting=none',
           f'--screenshot={destino}', f'--window-size={w},{h}',
           '--virtual-time-budget=6000', f'--default-background-color=00000000',
           str((AQUI / artboard).resolve().as_uri())]
    try:
        subprocess.run(cmd, timeout=40, capture_output=True)
    except subprocess.TimeoutExpired:
        pass  # el PNG ya está escrito; Chrome se cuelga después
    subprocess.run(['pkill', '-f', 'Google Chrome.*headless'], capture_output=True)
    if not destino.exists():
        raise SystemExit(f'no se escribió {destino}')
    got = medir(destino)
    if got != (w, h):
        raise SystemExit(f'{destino.name}: {got[0]}×{got[1]}, se esperaba {w}×{h}')


def medir(p):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(p)],
                         capture_output=True, text=True).stdout
    d = dict(l.strip().split(': ') for l in out.splitlines() if ': ' in l)
    return int(d['pixelWidth']), int(d['pixelHeight'])


def a_jpg(png, jpg):
    jpg.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(png, jpg)
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '92',
                    '-m', SRGB, str(jpg)], capture_output=True)


def main():
    cal = json.loads((AQUI / 'calendario.json').read_text(encoding='utf-8'))
    trabajos = []
    for p in cal['feed']:
        f = p['fecha']
        nombre = f"{f}_{p['n']:02d}_{p['slug']}"
        trabajos.append((p['artboard'], nombre, 1080, 1350, f"{p['n']:2d} · {f[8:]}-{MESES[int(f[5:7])]} · {p['titulo']}"))
    for i, h in enumerate(cal['historias'], 1):
        slug = h['artboard'].replace('St', 'historia-').lower()
        trabajos.append((h['artboard'], f'historia_{i:02d}_{slug[9:]}', 1080, 1920, f'H{i:2d} · {h["titulo"]}'))
    trabajos.append(('Avatar', 'avatar', 1080, 1080, 'Avatar'))
    trabajos.append(('DiaDFijada', 'fijada_dia-d-aliados', 1080, 1350, 'Fijada · Aliados del Día D'))
    for i, (ab, slug) in enumerate([('PatrocinioPortada', 'portada'), ('PatrocinioDiaD', 'dia-d'),
                                    ('PatrocinioInmerxia', 'inmerxia')], 1):
        trabajos.append((ab, f'patrocinio_{i}_{slug}', 1080, 1350, f'Patrocinio {i}/3'))
    trabajos.append(('StPatrocinio', 'patrocinio_historia', 1080, 1920, 'Patrocinio · historia'))

    solo = sys.argv[1:] if len(sys.argv) > 1 else None
    for artboard, nombre, w, h, etiqueta in trabajos:
        if solo and artboard not in solo:
            continue
        png = OUT / 'png' / f'{nombre}.png'
        render(f'{artboard}.dc.html', png, w, h)
        a_jpg(png, OUT / 'jpg' / f'{nombre}.jpg')
        print(f'{etiqueta}  →  {nombre}  {w}×{h}  '
              f'png {png.stat().st_size // 1024} KB · jpg {(OUT / "jpg" / f"{nombre}.jpg").stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
