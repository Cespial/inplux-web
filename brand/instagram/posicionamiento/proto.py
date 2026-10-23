"""Prototipo (23-oct-2026): ¿qué ganan los carruseles marfil con imagen de Midjourney y logos de las IA?

Cuatro maquetas para comparar con la versión actual; no reemplazan nada todavía.
  A · ia_1 con el embudo en risografía (dos tintas, negro y teal, sobre marfil)
  B · ia_2 con los logos de los chats de uso general (Simple Icons, en tinta, sin alterar)
  C · medir_1 al estilo @therundownai: foto B/N arriba, titular abajo
  D · agentes_5 con la mano robótica y la humana sobre la misma lista
"""
import re
from build import *  # noqa: F401,F403
from build import AQUI

def logo(nombre, s=34, c=TINTA):
    svg = (AQUI / f"logos-ia/{nombre}.svg").read_text()
    svg = re.sub(r"<title>.*?</title>", "", svg).replace("<svg ", f'<svg width="{s}" height="{s}" fill="{c}" ', 1)
    return svg

def chip(nombre, texto):
    return f'<span class="pill" style="gap:12px;padding:12px 22px;font-size:24px">{logo(nombre, 28)}{texto}</span>'

def proto_a():
    img = (f'<div style="position:absolute;left:84px;right:84px;top:470px;height:690px;overflow:hidden;border-radius:14px">'
           f'<img src="mj/embudo.jpg" style="width:100%;height:100%;object-fit:cover;object-position:50% 72%;transform:scale(1.25);transform-origin:50% 72%"></div>')
    cuerpo = titulo_claro("De cada 100 empresas,<br><em>5</em> tienen IA a la medida<br>en producción.", tam=84) + img + f"""
<div style="position:absolute;left:112px;top:1070px;display:flex;gap:14px">
  <span class="pill" style="background:rgba(243,238,230,.92)">60 evaluaron</span><span class="pill" style="background:rgba(243,238,230,.92)">20 piloto</span>
  <span class="pill" style="background:{TEAL_OSC};color:{PAPEL};border-color:{TEAL_OSC}">5 en producción</span></div>""" + fuente_de(NANDA, 1196)
    return pieza(cuerpo, "IA en producción", 1, 6, claro=True, alto=ALTO)

def proto_b():
    chips = "".join(chip(n, t) for n, t in [("openai", "ChatGPT"), ("githubcopilot", "Copilot"), ("googlegemini", "Gemini"), ("claude", "Claude")])
    cuerpo = titulo_claro("El chat llega.<br><em>El sistema, casi nunca.</em>", "Del interés a la producción", tam=84) + f"""
<div style="position:absolute;left:84px;right:84px;top:470px;display:flex;gap:12px;flex-wrap:wrap">{chips}</div>
<div style="position:absolute;left:84px;top:600px;transform:scale(.92);transform-origin:0 0">{dos_embudos()}</div>
<p class="cuerpo" style="position:absolute;left:84px;right:84px;top:1060px;font-size:27px">Estos chats ayudan a cada persona, pero <b>no mueven el estado de resultados</b>. Lo que sí lo mueve, la IA dentro de los procesos, es lo que se queda en piloto.</p>""" + fuente_de(NANDA)
    return pieza(cuerpo, "IA en producción", 2, 6, claro=True, alto=ALTO)

def proto_c():
    img = (f'<div style="position:absolute;left:0;right:0;top:-45px;height:760px;overflow:hidden;'
           f'-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 210px,#000 70%,transparent 100%)">'
           f'<img src="mj/reloj.jpg" style="width:100%;height:100%;object-fit:cover;object-position:50% 35%;filter:grayscale(1) contrast(1.05)"></div>')
    nums = "".join(f'<div><div class="micro">{t}</div><div style="font-size:64px;font-weight:600;letter-spacing:-.03em;margin-top:6px;color:{c}">{v}</div></div>'
                   for t, v, c in [("Esperaban", "+24 %", TINTA), ("Creyeron", "+20 %", TINTA), ("Se midió", "−19 %", TEAL_OSC)])
    cuerpo = img + f"""
<div class="micro" style="position:absolute;left:84px;top:690px;color:{TEAL_OSC}">METR · experimento controlado</div>
<h1 class="titular" style="position:absolute;left:84px;right:84px;top:740px;font-size:84px">Creían ir 20 % más<br>rápido con IA.<br><em>Iban 19 % más lento.</em></h1>
<div style="position:absolute;left:84px;right:84px;top:1040px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding-top:26px;border-top:1px solid rgba(26,25,22,.14)">{nums}</div>""" + fuente_de(METR25, 1180)
    return pieza(cuerpo, "Medir la IA", 1, 6, claro=True, alto=ALTO)

def proto_d():
    img = ('<img src="mj/manos.jpg" style="position:absolute;left:0;top:-105px;width:1080px;height:1440px;object-fit:cover;'
           '-webkit-mask-image:linear-gradient(180deg,#000 86%,transparent 95%)">')
    cuerpo = img + titulo_claro("Un agente que acierta<br>la mitad de las veces<br><em>necesita a alguien que<br>revise la otra mitad.</em>", tam=74, arriba=160) + cta(1150)
    return pieza(cuerpo, "Agentes", 5, 5, claro=True, alto=ALTO)

PROTO = {"proto_a_ia-embudo": proto_a, "proto_b_ia-logos": proto_b, "proto_c_medir-foto": proto_c, "proto_d_agentes-manos": proto_d}

if __name__ == "__main__":
    import subprocess
    for n, fn in PROTO.items():
        (AQUI / f"{n}.html").write_text(fn(), encoding="utf-8")
        png = AQUI / f"exports/png/{n}.png"; png.unlink(missing_ok=True)
        try:
            subprocess.run([CHROME := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            f"--screenshot={png}", "--window-size=1080,1440", "--virtual-time-budget=6000", "--force-color-profile=srgb",
                            "--allow-file-access-from-files", (AQUI / f"{n}.html").as_uri()], timeout=40, capture_output=True)
        except subprocess.TimeoutExpired:
            pass
        subprocess.run(["pkill", "-f", "Google Chrome.*headless"], capture_output=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92", str(png), "--out", str(AQUI / f"exports/jpg/{n}.jpg")], capture_output=True)
        print("ok", n)
