"""Renderiza las piezas de parrilla-romana/build.py a PNG (maestro) y JPG q92 sRGB.

Misma receta que canvas/render.py: Chrome headless escribe el PNG y se
cuelga, así que corre con timeout y luego pkill; sips verifica el tamaño.
"""
import subprocess, sys
from pathlib import Path
from build import PIEZAS

AQUI = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PNG, JPG = AQUI / "exports/png", AQUI / "exports/jpg"
PNG.mkdir(parents=True, exist_ok=True); JPG.mkdir(parents=True, exist_ok=True)

for nombre in sys.argv[1:] or PIEZAS:
    _, w, h = PIEZAS[nombre]
    png, jpg = PNG / f"{nombre}.png", JPG / f"{nombre}.jpg"
    png.unlink(missing_ok=True)
    try:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={png}",
                        f"--window-size={w},{h}", "--virtual-time-budget=6000", "--force-color-profile=srgb",
                        "--allow-file-access-from-files", (AQUI / f"{nombre}.html").as_uri()],
                       timeout=40, capture_output=True)
    except subprocess.TimeoutExpired:
        pass
    subprocess.run(["pkill", "-f", "Google Chrome.*headless"], capture_output=True)
    dims = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(png)], capture_output=True, text=True).stdout.split()
    if dims[-3] != str(w) or dims[-1] != str(h):
        sys.exit(f"{nombre}: tamaño {dims[-3]}x{dims[-1]}, se esperaba {w}x{h}")
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92", "--matchTo",
                    "/System/Library/ColorSync/Profiles/sRGB Profile.icc", str(png), "--out", str(jpg)], capture_output=True)
    print("ok", nombre, f"{w}x{h}")
