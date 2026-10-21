"""Maqueta de QA: la portada dentro de la cabecera de una página de LinkedIn,
con el logo encima (escritorio) y el recorte ≈4:1 centrado del móvil."""
import subprocess
from pathlib import Path
AQUI = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LOGO = (AQUI.parent / "logos/inplux-appicon.svg").as_uri()
import sys
for n in sys.argv[1:]:
    img = (AQUI / f"exports/png/{n}.png").as_uri()
    html = f"""<!doctype html><meta charset=utf-8><style>
body{{margin:0;background:#f4f2ee;font:14px -apple-system,sans-serif;padding:24px;display:grid;gap:28px;width:1176px}}
.card{{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px #ddd}}
.cover{{display:block;width:1128px;height:191px;object-fit:cover}}
.d{{width:1128px}} .d .logo{{width:120px;height:120px;border-radius:6px;margin:-64px 0 0 24px;border:4px solid #fff;display:block;background:#0c0c0b}}
.d h2{{margin:12px 24px 4px;font-size:24px}} .d p{{margin:0 24px 20px;color:#666}}
.m{{width:390px}} .m .cover{{width:390px;height:98px;object-fit:cover}} .m .logo{{width:64px;height:64px;border-radius:4px;margin:-32px 0 0 16px;border:3px solid #fff;display:block;background:#0c0c0b}}
.m h2{{margin:8px 16px 16px;font-size:18px}}
</style>
<div class="card d"><img class=cover src="{img}"><img class=logo src="{LOGO}"><h2>INPLUX</h2><p>Desarrollo de software · Medellín</p></div>
<div class="card m"><img class=cover src="{img}"><img class=logo src="{LOGO}"><h2>INPLUX</h2></div>"""
    f = AQUI / f"mockup_{n}.html"; f.write_text(html)
    out = AQUI / f"exports/mockup_{n}.png"
    try:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={out}",
                        "--window-size=1176,560", "--virtual-time-budget=4000", "--allow-file-access-from-files", f.as_uri()],
                       timeout=30, capture_output=True)
    except subprocess.TimeoutExpired:
        pass
    subprocess.run(["pkill", "-f", "Google Chrome.*headless"], capture_output=True)
    print("ok", out.name)
