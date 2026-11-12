"""Clips reales de los seis productos navegándose (Playwright con video), 1440×900.
Cierra banners con la opción más privada («Solo esenciales») y tours («Saltar tour»). En Tribai escribe una consulta genérica."""
import shutil, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
D = Path(__file__).parent; OUT = D / "assets/productos"; OUT.mkdir(parents=True, exist_ok=True); TMPV = D / "tmp/video"
import sys
SITIOS = {"gobia": "https://gobia.co", "tribai": "https://app.tribai.co", "kelsen": "https://kelsen.io/explorador",
          "laudos": "https://laudos.co", "porkia": "https://porkia.co", "mimotoya": "https://mimotoya.co"}
CONSULTA = "¿Cuándo se presenta la declaración de renta de personas naturales?"
CERRAR = ["Solo esenciales", "Solo necesarias", "Rechazar", "Saltar tour", "Saltar", "Omitir", "Cerrar"]
SCROLL = """async (px) => { const t0 = performance.now(), y0 = scrollY, d = 4200;
  await new Promise(r => { const f = () => { const v = Math.min(1, (performance.now() - t0) / d), e = v < .5 ? 2*v*v : 1 - Math.pow(-2*v + 2, 2)/2;
    scrollTo(0, y0 + px * e); v < 1 ? requestAnimationFrame(f) : r(); }; f(); }); }"""


def cerrar(pg):
    pg.wait_for_timeout(1500)
    pg.evaluate("""() => { for (const b of document.querySelectorAll('button, a, [role=button]')) { const t = b.textContent.trim();
      if (t === 'Solo necesarias' || t === 'Solo esenciales') { b.click(); return t; } } }""")
    pg.wait_for_timeout(600)
    for t in ("Solo necesarias", "Solo esenciales"):
        try:
            e = pg.get_by_text(t, exact=True)
            if e.count(): e.first.click(timeout=1500); pg.wait_for_timeout(500)
        except Exception: pass
    for t in CERRAR:
        try:
            b = pg.get_by_role("button", name=t)
            if b.count(): b.first.click(timeout=1500); pg.wait_for_timeout(500)
        except Exception: pass


with sync_playwright() as p:
    b = p.chromium.launch()
    for n, u in [(k, SITIOS[k]) for k in (sys.argv[1:] or SITIOS)]:
        shutil.rmtree(TMPV, ignore_errors=True)
        cx = b.new_context(viewport={"width": 1440, "height": 900}, record_video_dir=str(TMPV), record_video_size={"width": 1440, "height": 900},
                           locale="es-CO")
        pg = cx.new_page(); marca = {}
        try:
            pg.goto(u, wait_until="domcontentloaded", timeout=40000); pg.wait_for_timeout(3500); cerrar(pg); pg.wait_for_timeout(800)
            marca["ini"] = pg.evaluate("performance.now()")
            if n == "tribai":
                import re
                caja = pg.get_by_placeholder(re.compile("pregunta", re.I)).first
                caja.click(timeout=5000); caja.type(CONSULTA, delay=55); pg.keyboard.press("Enter"); pg.wait_for_timeout(7000)
            elif n == "kelsen":
                caja = pg.locator("input[type=search], input[type=text]").first
                caja.click(timeout=5000); caja.type("responsabilidad del Estado", delay=60); pg.keyboard.press("Enter"); pg.wait_for_timeout(4500)
            else:
                pg.wait_for_timeout(600); pg.evaluate(SCROLL, 1500); pg.wait_for_timeout(700)
            marca["fin"] = pg.evaluate("performance.now()")
        except Exception as e: print(n, "ERROR", e)
        pg.close(); cx.close()
        web = next(TMPV.glob("*.webm"))
        # el video arranca al crear la página: recortamos la carga (inicio relativo aproximado = tiempo de carga)
        ini = max(0, marca.get("ini", 0) / 1000 - 0.2); print(n, "ini", ini, marca)
        f = OUT / f"{n}.mp4"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{ini:.2f}", "-i", str(web), "-an", "-t", "8", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-r", "30", str(f)], check=True)
        d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip()
        print(n, pg.url if False else u, f.name, d)
    b.close()
