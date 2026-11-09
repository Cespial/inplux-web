"""Capas de Chrome para el reel «Así nació el símbolo» (1080×1920).

Escribe en out/: marco.png, rotulo_{1,2,3}.png, inplux_co.png, lockup_2x.png (wordmark del lockup a10),
tarjeta_<nombre>.png (9 aplicaciones, opacas, con el hueco del símbolo vacío) y tarjetas.json.
El símbolo NUNCA va en una tarjeta: montar.py lo pinta encima, en el mismo píxel, en todas.

Uso: python3 escenas.py
"""
import json, sys
from pathlib import Path
from geometria import mapa, poligono, ANCHO, ALTO

D = Path(__file__).parent
OUT = D / "out"
W, H = 1080, 1920
ALTO_APP = 200                       # alto del símbolo en las aplicaciones
f_app, k_app = mapa(ALTO_APP)
SX0, SY0 = f_app(0, 0)
SX1, SY1 = f_app(ANCHO, ALTO)        # caja del símbolo: 404,7–675,3 × 910–1110

LOCKUP_K = 4.0                       # px por unidad del lockup en lockup_2x.png (130 px de símbolo × 2 / 55 ≈ 4,73)
LOCKUP_W = 324.91

CSS = """
@font-face{font-family:"Rethink Sans";src:url(../assets/RethinkSans.woff2);font-weight:400 800}
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:"Rethink Sans";-webkit-font-smoothing:antialiased;overflow:hidden}
.abs{position:absolute}
.titular{font-weight:500;letter-spacing:-.035em;line-height:.98;margin:0;font-size:84px;
  background:linear-gradient(180deg,#f6f2ec 0%,#f6f2ec 52%,#8d877e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.1em}
.micro{font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:#a39d94}
.cruz{position:absolute;color:rgba(246,242,236,.35);font-size:22px;font-weight:300;line-height:1}
"""

LOCKUP_SVG = (D / "assets/lockup3-E1-a10-horizontal-oscuro.svg").read_text()
WORDMARK_D = LOCKUP_SVG.split('<path d="')[4].split('"')[0]     # 4.º path = las seis letras


def wordmark(color, alto_px):
    """Solo las letras del lockup a10 (sin símbolo), a `alto_px` de alto de mayúscula."""
    k = alto_px / 55.0
    return (f'<svg viewBox="95.39 0 229.52 55.66" width="{229.52 * k:.2f}" height="{55.66 * k:.2f}" style="display:block;overflow:visible">'
            f'<path d="{WORDMARK_D}" fill="{color}"/></svg>')


def sticker_svg():
    """Troquel con la silueta del símbolo dilatada (placa negra + borde blanco), en px del lienzo."""
    pts = lambda i: " ".join(f"{f_app(x, y)[0]:.2f},{f_app(x, y)[1]:.2f}" for x, y in poligono(i, "claro"))
    polys = "".join(f'<polygon points="{pts(i)}"/>' for i in range(3))
    borde, placa = 19 * k_app, 11 * k_app
    return (f'<svg class="abs" style="left:0;top:0" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'<defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%">'
            f'<feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity=".55"/></filter></defs>'
            f'<g filter="url(#s)" fill="#ffffff" stroke="#ffffff" stroke-width="{borde:.1f}" stroke-linejoin="round">{polys}</g>'
            f'<g fill="#0c0c0b" stroke="#0c0c0b" stroke-width="{placa:.1f}" stroke-linejoin="round">{polys}</g></svg>')


def camiseta():
    sys.path.insert(0, str(Path.home() / "inplux-camisetas-sf/build"))
    import mockups
    svg = mockups.camiseta("negra", "frente", pos=(-9000, 0))
    esc = 2.2
    # el centro del pecho (500, 300 en unidades de la prenda) cae en el ancla del símbolo
    left, top = 540 - 500 * esc, 1010 - 300 * esc
    svg = svg.replace('class="tee"', f'class="tee" width="{1000 * esc}" height="{880 * esc}"', 1)
    return f'<div class="abs" style="left:{left}px;top:{top}px">{svg}</div>'


def tarjetas():
    cx, cy = 540, 1010
    hueco = dict(x0=SX0, y0=SY0, x1=SX1, y1=SY1)
    titulo_sitio = "INPLUX | Transformación con IA que llega a producción"
    t = {}

    # 1 · favicon: pestaña de Chrome a escala 12×
    t["favicon"] = ("marfil", f"""
<div class="abs" style="inset:0;background:#141413"></div>
<div class="abs" style="left:0;right:0;top:720px;height:560px;background:#232220"></div>
<div class="abs" style="left:-420px;top:820px;width:640px;height:400px;border-radius:44px 44px 0 0;background:#2b2a28"></div>
<div class="abs" style="left:-340px;top:960px;width:110px;height:110px;border-radius:50%;background:#4a4844"></div>
<div class="abs" style="left:-190px;top:1000px;width:300px;height:30px;border-radius:15px;background:#4a4844"></div>
<div class="abs" style="left:150px;top:975px;font-size:70px;color:#77726b;line-height:1">×</div>
<div class="abs" style="left:300px;top:790px;width:1300px;height:490px;border-radius:56px 56px 0 0;background:#3a3936"></div>
<div class="abs" style="left:{SX1 + 56:.0f}px;top:{cy - 44}px;font-size:84px;color:#ece7e0;white-space:nowrap;letter-spacing:-.01em;line-height:1">{titulo_sitio}</div>
<div class="abs" style="left:980px;top:790px;width:100px;height:490px;background:linear-gradient(90deg,rgba(58,57,54,0),#3a3936)"></div>
<div class="abs" style="left:0;right:0;top:1280px;height:260px;background:#3a3936"></div>
<div class="abs" style="left:70px;right:-200px;top:1330px;height:160px;border-radius:80px;background:#232220"></div>
<svg class="abs" style="left:140px;top:1370px" width="64" height="80" viewBox="0 0 16 20"><rect x="1" y="8" width="14" height="11" rx="2" fill="#a39d94"/><path d="M4 8V5.5a4 4 0 0 1 8 0V8" stroke="#a39d94" stroke-width="2" fill="none"/></svg>
<div class="abs" style="left:250px;top:1365px;font-size:84px;color:#ece7e0;letter-spacing:-.01em;line-height:1">inplux.co</div>
""")

    # 2 · web: el hero de inplux.co con el símbolo en la portada (foto real del sitio, recortada sin la cabecera)
    t["web"] = ("marfil", f"""
<div class="abs" style="inset:0;background:#0c0c0b"></div>
<div class="abs" style="left:40px;right:40px;top:300px;bottom:230px;border-radius:30px;overflow:hidden;background:#0c0c0b;border:1px solid rgba(246,242,236,.14);box-shadow:0 40px 90px rgba(0,0,0,.6)">
  <div class="abs" style="left:0;right:0;top:0;height:110px;background:#1c1b1a;border-bottom:1px solid rgba(246,242,236,.08)"></div>
  <div class="abs" style="left:36px;top:40px;display:flex;gap:16px">{''.join('<div style="width:28px;height:28px;border-radius:50%;background:#3a3936"></div>' for _ in range(3))}</div>
  <div class="abs" style="left:200px;right:60px;top:24px;height:62px;border-radius:31px;background:#2b2a28;color:#cfc9c1;font-size:32px;line-height:62px;padding-left:34px">inplux.co</div>
  <div class="abs" style="left:0;right:0;top:110px;height:820px;background:url(../assets/hero-soldador.jpg) center/cover;filter:brightness(.62) saturate(.9)"></div>
  <div class="abs" style="left:0;right:0;top:110px;height:820px;background:linear-gradient(180deg,rgba(12,12,11,.35) 0%,rgba(12,12,11,.15) 40%,rgba(12,12,11,.85) 85%,#0c0c0b 100%)"></div>
  <div class="abs" style="left:0;right:0;top:146px;display:flex;justify-content:center;gap:44px;font-size:26px;color:#d8d2ca">
    <span>Productos</span><span>Sectores</span><span>Nosotros</span></div>
  <div class="abs micro" style="left:0;right:0;top:{1150 - 300}px;text-align:center;font-size:19px;color:#a39d94">→ Desarrollo e implementación de IA</div>
  <h1 class="titular abs" style="left:60px;right:60px;top:{1192 - 300}px;text-align:center;font-size:76px">Transformación con IA<br>que llega a producción.</h1>
  <div class="abs" style="left:0;right:0;top:{1405 - 300}px;display:flex;justify-content:center">
    <div style="background:#f6f2ec;color:#1a1916;border-radius:999px;padding:22px 40px;font-size:30px;font-weight:500">Empezar un proyecto →</div></div>
</div>
""")

    # 3 · instagram: cabecera del perfil, sin cifras (no se inventan seguidores)
    t["instagram"] = ("tinta", f"""
<div class="abs" style="inset:0;background:#ffffff"></div>
<div class="abs" style="left:56px;top:240px;font-size:64px;color:#0c0c0b;line-height:1">‹</div>
<div class="abs" style="left:0;right:0;top:246px;text-align:center;font-size:44px;font-weight:600;color:#0c0c0b;letter-spacing:-.01em">inplux_</div>
<div class="abs" style="right:60px;top:236px;font-size:56px;color:#0c0c0b;letter-spacing:.05em">···</div>
<div class="abs" style="left:{cx - 236}px;top:{cy - 236}px;width:472px;height:472px;border-radius:50%;background:#00d7ca"></div>
<div class="abs" style="left:{cx - 224}px;top:{cy - 224}px;width:448px;height:448px;border-radius:50%;background:#ffffff"></div>
<div class="abs" style="left:{cx - 210}px;top:{cy - 210}px;width:420px;height:420px;border-radius:50%;background:#f6f2ec"></div>
<div class="abs" style="left:0;right:0;top:1290px;text-align:center;font-size:46px;font-weight:600;color:#0c0c0b">INPLUX</div>
<div class="abs" style="left:110px;right:110px;top:1360px;text-align:center;font-size:34px;line-height:1.35;color:#262626">Transformación con IA que llega a producción.</div>
<div class="abs" style="left:0;right:0;top:1416px;text-align:center;font-size:34px;color:#00376b;font-weight:500">inplux.co</div>
<div class="abs" style="left:70px;top:1500px;width:460px;height:92px;border-radius:20px;background:#0095f6;color:#fff;font-size:36px;font-weight:600;text-align:center;line-height:92px">Seguir</div>
<div class="abs" style="left:550px;top:1500px;width:460px;height:92px;border-radius:20px;background:#efefef;color:#0c0c0b;font-size:36px;font-weight:600;text-align:center;line-height:92px">Mensaje</div>
<div class="abs" style="left:0;right:0;top:1640px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px">
  <div style="height:360px;background:#0c0c0b"></div><div style="height:360px;background:#f6f2ec"></div><div style="height:360px;background:#00d7ca"></div></div>
""")

    # 4 · tríptico: portada marfil sobre mesa oscura
    t["triptico"] = ("tinta", f"""
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 45%,#2e2c29 0%,#141312 70%)"></div>
<div class="abs" style="left:250px;top:600px;width:580px;height:820px;box-shadow:0 60px 80px rgba(0,0,0,.55);background:#f6f2ec"></div>
<div class="abs" style="left:24px;top:600px;width:240px;height:820px;transform-origin:right center;transform:perspective(1400px) rotateY(-38deg);background:linear-gradient(90deg,#cfc9bf,#e9e4dc)"></div>
<div class="abs" style="left:816px;top:600px;width:240px;height:820px;transform-origin:left center;transform:perspective(1400px) rotateY(38deg);background:linear-gradient(90deg,#ddd8cf,#bdb7ad)"></div>
<div class="abs" style="left:250px;top:600px;width:580px;height:820px;background:linear-gradient(90deg,rgba(0,0,0,.07),rgba(0,0,0,0) 8%,rgba(0,0,0,0) 92%,rgba(0,0,0,.07))"></div>
<div class="abs" style="left:{cx - 229.52 * 26 / 55 / 2:.1f}px;top:1300px">{wordmark('#1a1918', 26)}</div>
""")

    # 5 · linkedin: banner 4:1 a sangre
    t["linkedin"] = ("marfil", f"""
<div class="abs" style="inset:0;background:#f4f2ee"></div>
<div class="abs" style="left:0;right:0;top:200px;height:130px;background:#ffffff;border-bottom:1px solid #e0dfdc"></div>
<div class="abs" style="left:60px;top:236px;width:560px;height:60px;border-radius:30px;background:#edf3f8"></div>
<div class="abs" style="left:30px;right:30px;top:{cy - 135}px;height:820px;border-radius:24px;background:#ffffff;overflow:hidden;border:1px solid #e0dfdc">
  <div class="abs" style="left:0;right:0;top:0;height:270px;background:#0c0c0b"></div>
  <div class="abs" style="left:56px;top:320px;font-size:54px;font-weight:600;color:#191919">INPLUX</div>
  <div class="abs" style="left:56px;top:396px;right:56px;font-size:32px;line-height:1.35;color:#191919">Transformación con IA que llega a producción</div>
  <div class="abs" style="left:56px;top:452px;font-size:28px;color:#666666">Medellín, Antioquia</div>
  <div class="abs" style="left:56px;top:530px;height:76px;padding:0 44px;border-radius:38px;background:#0a66c2;color:#fff;font-size:32px;font-weight:600;line-height:76px">+ Seguir</div>
  <div class="abs" style="left:56px;top:660px;width:560px;height:22px;border-radius:11px;background:#ebe9e5"></div>
  <div class="abs" style="left:56px;top:704px;width:420px;height:22px;border-radius:11px;background:#ebe9e5"></div>
</div>
""")

    # 6 · sticker troquelado
    t["sticker"] = ("marfil", f"""
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 40% 40%,#2a2826 0%,#151413 75%)"></div>
<div class="abs" style="left:640px;top:1330px;width:330px;height:330px;border-radius:50%;background:#00d7ca;box-shadow:0 18px 30px rgba(0,0,0,.5);transform:rotate(-12deg);display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:600;color:#0c0c0b;letter-spacing:-.01em">inplux.co</div>
{sticker_svg()}
""")

    # 7 · camiseta negra (mockup de ~/inplux-camisetas-sf con el arte viejo fuera del lienzo)
    t["camiseta"] = ("marfil", f"""
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 40%,#e2ded7 0%,#c9c4bc 80%)"></div>
{camiseta()}
""")

    # 8 · icono de app en la pantalla de inicio (iconos vecinos genéricos, sin marcas de terceros)
    vecinos = ["#3a3835", "#5b6b6a", "#7a6f62", "#2f3b45", None, "#4a4743", "#6d5a4f", "#38463f", "#55524d"]
    iconos = ""
    for j, color in enumerate(vecinos):
        ix, iy = [80, 540, 1000][j % 3], [550, 1010, 1470][j // 3]
        if color is None:
            iconos += (f'<div class="abs" style="left:{ix - 180}px;top:{iy - 180}px;width:360px;height:360px;border-radius:84px;background:#0c0c0b;'
                       f'border:2px solid rgba(246,242,236,.14);box-shadow:0 24px 50px rgba(0,0,0,.45)"></div>'
                       f'<div class="abs" style="left:{ix - 200}px;width:400px;top:{iy + 206}px;text-align:center;font-size:40px;font-weight:500;color:#fff">INPLUX</div>')
        else:
            iconos += (f'<div class="abs" style="left:{ix - 180}px;top:{iy - 180}px;width:360px;height:360px;border-radius:84px;'
                       f'background:linear-gradient(160deg,{color},#1e1d1b);opacity:.9"></div>'
                       f'<div class="abs" style="left:{ix - 70}px;width:140px;top:{iy + 222}px;height:18px;border-radius:9px;background:rgba(255,255,255,.28)"></div>')
    t["app"] = ("marfil", f"""
<div class="abs" style="inset:0;background:linear-gradient(170deg,#123534 0%,#0c1514 45%,#0c0c0b 100%)"></div>
{iconos}
<div class="abs" style="left:60px;right:60px;top:1700px;height:220px;border-radius:70px;background:rgba(255,255,255,.10)"></div>
""")

    # 9 · membrete: hoja carta con el símbolo en la cabecera (líneas de texto simuladas, sin texto falso)
    lineas = "".join(f'<div style="height:16px;border-radius:8px;background:#ddd7ce;width:{w}%;margin-bottom:30px"></div>'
                     for w in (92, 88, 95, 70, 0, 90, 94, 86, 60, 0, 93, 81))
    t["membrete"] = ("tinta", f"""
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 30%,#34312d 0%,#181715 80%)"></div>
<div class="abs" style="left:70px;right:70px;top:720px;height:1500px;background:#fbf8f3;box-shadow:0 40px 90px rgba(0,0,0,.6)"></div>
<div class="abs" style="left:170px;right:170px;top:1180px;height:2px;background:#1a1918"></div>
<div class="abs" style="left:170px;right:170px;top:1250px">{lineas}</div>
""")
    orden = ["favicon", "web", "instagram", "triptico", "linkedin", "sticker", "camiseta", "app", "membrete"]
    return [(n,) + t[n] for n in orden], hueco


def capas():
    from playwright.sync_api import sync_playwright
    OUT.mkdir(exist_ok=True)
    cruces = "".join(f'<div class="cruz" style="{v}:26px;{h}:30px">+</div>' for v in ("top", "bottom") for h in ("left", "right"))
    marco = (f'{cruces}<div class="micro abs" style="right:88px;top:232px">Medellín · 2026</div>'
             f'<div class="micro abs" style="left:88px;top:232px">INPLUX · Símbolo</div>')
    rotulos = ["Un símbolo.", "Tres estratos.", "Hecho en Medellín."]
    lista, hueco = tarjetas()
    tmp = OUT / "_capa.html"
    with sync_playwright() as pw:
        br = pw.chromium.launch(channel="chrome")
        pg = br.new_page(viewport={"width": W, "height": H})
        def toma(nombre, html, fondo=False, vista=None):
            tmp.write_text(f"<!doctype html><html><head><meta charset=utf-8><style>{CSS}</style></head><body>{html}</body></html>", encoding="utf-8")
            if vista: pg.set_viewport_size(vista)
            pg.goto(tmp.as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(250)
            pg.screenshot(path=str(OUT / f"{nombre}.png"), omit_background=not fondo)
            if vista: pg.set_viewport_size({"width": W, "height": H})
        toma("marco", marco)
        for i, r in enumerate(rotulos, 1):
            toma(f"rotulo_{i}", f'<div class="abs" style="left:84px;right:84px;top:284px"><h1 class="titular">{r}</h1></div>')
        toma("inplux_co", '<div class="abs" style="left:0;right:0;top:0;text-align:center;font-size:40px;color:#a39d94;letter-spacing:.01em">inplux.co</div>')
        # wordmark del lockup a10 a LOCKUP_K px/unidad, desde x = 95,39 (borde izquierdo de la I)
        ww, wh = round(229.52 * LOCKUP_K), round(55.66 * LOCKUP_K) + 2
        toma("lockup_2x", f'<div class="abs" style="left:0;top:0">{wordmark("#f6f2ec", 55 * LOCKUP_K)}</div>', vista={"width": ww, "height": wh})
        for nombre, color, html in lista:
            toma(f"tarjeta_{nombre}", html, fondo=True)
        br.close()
    tmp.unlink()
    (OUT / "tarjetas.json").write_text(json.dumps({"orden": [[n, c] for n, c, _ in lista], "hueco": hueco,
                                                   "lockup_k": LOCKUP_K}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("capas listas:", [n for n, _, _ in lista])


if __name__ == "__main__":
    capas()
