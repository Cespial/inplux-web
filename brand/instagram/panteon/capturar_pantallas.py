"""Capturas móviles reales (390×844 @3x) para los celulares de las estatuas."""
from pathlib import Path
from playwright.sync_api import sync_playwright
D = Path(__file__).parent / "assets/pantallas"; D.mkdir(parents=True, exist_ok=True)
FECHA = "2026-11-11"
SITIOS = {"tribai": "https://app.tribai.co", "porkia": "https://porkia.co", "mimotoya": "https://mimotoya.co",
          "gobia": "https://gobia.co", "kelsen": "https://kelsen.io/explorador", "laudos": "https://laudos.co"}
with sync_playwright() as p:
    b = p.chromium.launch()
    for n, u in SITIOS.items():
        for modo, vp, esc in (("movil", (390, 844), 3), ("escritorio", (1440, 900), 2)):
            pg = b.new_page(viewport={"width": vp[0], "height": vp[1]}, device_scale_factor=esc)
            try:
                pg.goto(u, wait_until="domcontentloaded", timeout=30000); pg.wait_for_timeout(4000)
                f = D / f"{n}-{modo}-{FECHA}.png"; pg.screenshot(path=str(f)); print(n, modo, pg.url, f.name)
            except Exception as e: print(n, modo, "ERROR", e)
            pg.close()
    b.close()
