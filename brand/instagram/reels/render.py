"""Renderiza portadas (JPG) y rótulos (PNG transparente) de build.py. Misma receta que semanal/render.py."""
import subprocess, sys
from pathlib import Path
from build import PIEZAS

AQUI = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PNG, JPG, ROT = AQUI / "exports/png", AQUI / "exports/jpg", AQUI / "exports/rotulos"
for d in (PNG, JPG, ROT): d.mkdir(parents=True, exist_ok=True)

for nombre in sys.argv[1:] or PIEZAS:
    _, w, h = PIEZAS[nombre]
    transparente = nombre.startswith("rotulo")
    png = (ROT if transparente else PNG) / f"{nombre}.png"
    png.unlink(missing_ok=True)
    args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={png}", f"--window-size={w},{h}",
            "--virtual-time-budget=6000", "--force-color-profile=srgb", "--allow-file-access-from-files"]
    if transparente:
        args.append("--default-background-color=00000000")
    try:
        subprocess.run(args + [(AQUI / f"{nombre}.html").as_uri()], timeout=40, capture_output=True)
    except subprocess.TimeoutExpired:
        pass
    subprocess.run(["pkill", "-f", "Google Chrome.*headless"], capture_output=True)
    dims = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(png)], capture_output=True, text=True).stdout.split()
    if dims[-3] != str(w) or dims[-1] != str(h):
        sys.exit(f"{nombre}: tamaño {dims[-3]}x{dims[-1]}, se esperaba {w}x{h}")
    if not transparente:
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92", "--matchTo",
                        "/System/Library/ColorSync/Profiles/sRGB Profile.icc", str(png), "--out", str(JPG / f"{nombre}.jpg")], capture_output=True)
    print("ok", nombre, f"{w}x{h}")
