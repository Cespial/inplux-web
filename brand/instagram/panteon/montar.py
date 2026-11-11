"""Reel «Panteón»: seis productos de INPLUX, seis figuras grecorromanas en trama de puntos, a 150 BPM.

    python3 preparar.py              # stills → nubes de puntos (tmp/web/formas)
    python3 montar.py previa 1.0 6.4 # cuadros sueltos en tmp/previa_*.png
    python3 montar.py hoja           # un cuadro por golpe → out/qa/golpes.jpg
    python3 montar.py todo           # cuadros + audio + mezcla → out/reel-9x16.mp4, out/reel-3x4.mp4, out/portada.jpg

Escena: escena.html (Three.js, determinista con window.seek(t)), servida por HTTP local y capturada con Playwright
(receta de gobia/video/montar_v2.py). Música: ElevenLabs /v1/music, medida en 149,99 BPM con librosa (primer golpe en
0,035 s, que se recorta para que el golpe 1 caiga en t=0). Efectos: ElevenLabs /v1/sound-generation (efectos_el.py).
Copy de cada producto: literal de src/content/work.ts (headline + status.label); MiMotoYa: copy del tríptico romano y
estado de inplux.co/trabajo/mimotoya en producción (11-nov-2026).
"""
import functools, http.server, json, shutil, subprocess, sys, threading
from pathlib import Path

D = Path(__file__).parent
WEB, TMP, OUT, AUD = D / "tmp/web", D / "tmp", D / "out", D / "audio"
W, H, FPS, BPM = 1080, 1920, 30, 150
B = 60 / BPM; BAR = 4 * B
FIN = 28.0
MUSICA, FASE = AUD / "musica_b_4ea6488b.mp3", 0.035

T = dict(gancho1=1 * BAR, logo0=1 * BAR + 3 * B, logo=1 * BAR + 3 * B, logoSale=2 * BAR + 2 * B, p0=3 * BAR,
         friso=15 * BAR, frisoSale=15 * BAR + 3 * B, lock=16 * BAR, fin=FIN)

PRODUCTOS = [
    dict(forma="gobia", foco=[240, 250], nombre="Gobia", categoria="Gestión pública", rol="Hacer visible la operación de un municipio.",
         estado="Piloto activo", url="gobia.co", pantalla="pantallas/gobia-escritorio-2026-11-11.png",
         card=[560, 170, 460, 0], ancla=[735, 905]),
    dict(forma="tribai", foco=[400, 270], nombre="Tribai", categoria="Tributación", rol="Encontrar criterio tributario sin perder la fuente.",
         estado="Producto público", url="app.tribai.co", pantalla="pantallas/tribai-movil-2026-11-11.png",
         card=[56, 150, 250, 0], ancla=[745, 1095]),
    dict(forma="kelsen", foco=[560, 330], nombre="Kelsen", categoria="Derecho", rol="Trabajar conocimiento jurídico con una ruta verificable.",
         estado="Explorador público", url="kelsen.io", pantalla="pantallas/kelsen-movil-2026-11-11.png",
         card=[56, 560, 250, 0], ancla=[835, 600]),
    dict(forma="laudos", foco=[300, 260], nombre="Laudos", categoria="Arbitraje", rol="Explorar conocimiento arbitral con estructura.",
         estado="Beta abierta", url="laudos.co", pantalla="pantallas/laudos-movil-2026-11-11.png",
         card=[780, 120, 250, 0], ancla=[640, 945]),
    dict(forma="porkia", foco=[500, 330], nombre="Porkia", categoria="Porcicultura", rol="Llevar una finca porcícola sin volver al cuaderno.",
         estado="Beta cerrada", url="porkia.co", pantalla="pantallas/porkia-movil-2026-11-11.png",
         card=[800, 100, 240, 0], ancla=[905, 985]),
    dict(forma="mimotoya", foco=[590, 300], nombre="MiMotoYa", categoria="Movilidad", rol="Pedir un motocarro con el precio claro desde el principio.",
         estado="Beta abierta", url="mimotoya.co", pantalla="pantallas/mimotoya-movil-2026-11-11.png",
         card=[56, 120, 250, 0], ancla=[560, 1010]),
]
FRASES = [dict(texto="Seis productos propios.", t=2 * BAR, sale=2 * BAR + 3 * B, y=1170),
          dict(texto="Hechos en Medellín.", t=2 * BAR + B, sale=2 * BAR + 3 * B, y=1262)]
LINEAS = [["01", "Implementamos"], ["02", "Desarrollamos"], ["03", "Capacitamos"]]
CIERRE = [dict(texto="Desde Medellín, para Latinoamérica.", t=16 * BAR + B, y=1080, tam=50, color="#f6f2ec", esp="-.01em"),
          dict(texto="INPLUX.CO", t=16 * BAR + 2 * B, y=1168, tam=28, color="#00d7ca", esp=".28em")]


def sh(*a): subprocess.run([str(x) for x in a], check=True)


def preparar_web():
    WEB.mkdir(parents=True, exist_ok=True)
    assert (WEB / "formas/info.json").exists(), "corre primero: python3 preparar.py"
    shutil.copy(D / "escena.html", WEB / "index.html")
    for f in [*[f"three/{p.name}" for p in (D / "assets/three").glob("*.js")], "RethinkSans-Regular.ttf", "RethinkSans-Medium.ttf", "inplux-logo-horizontal-inverse.svg"]:
        shutil.copy(D / "assets" / f, WEB / Path(f).name)
    shutil.copytree(D / "assets/pantallas", WEB / "pantallas", dirs_exist_ok=True)
    datos = dict(bpm=BPM, t=T, formas=json.loads((WEB / "formas/info.json").read_text()), productos=PRODUCTOS,
                 frases=FRASES, lineas=LINEAS, cierre=CIERRE)
    (WEB / "datos.json").write_text(json.dumps(datos, ensure_ascii=False))


def capturar(tiempos, carpeta, patron):
    from playwright.sync_api import sync_playwright
    carpeta.mkdir(parents=True, exist_ok=True)
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(WEB)); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
            pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
            errores = []; pg.on("pageerror", lambda e: errores.append(str(e))); pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
            pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html", wait_until="load")
            pg.wait_for_function("window.listo===true", timeout=120000); pg.wait_for_timeout(300)
            if errores: raise RuntimeError(errores)
            ch = pg.evaluate("window.chequeo()")
            for i, t in enumerate(tiempos):
                pg.evaluate(f"window.seek({t:.4f})"); pg.screenshot(path=str(carpeta / patron.format(i)))
                if i and i % 150 == 0: print(f"  {i}/{len(tiempos)} cuadros", flush=True)
            b.close()
    finally:
        srv.shutdown()
    return ch


def sfx(nombre): return next(AUD.glob(f"sfx_{nombre}_*.mp3"))


def eventos():
    """(segundo, efecto, volumen) — todo cae en la retícula de golpes."""
    ev = [(k * B, "golpe", 0.7) for k in range(4)]
    ev += [(T["gancho1"], "arena", 0.6), (T["logo"], "impacto", 0.9), (T["logoSale"], "arena", 0.5)]
    for k in range(6):
        t0 = T["p0"] + k * 2 * BAR
        ev += [(t0, "impacto", 0.55), (t0 + 4 * B, "brillo", 0.55), (t0 + 7 * B, "estalla", 0.5)]
    ev += [(T["frisoSale"], "arena", 0.5), (T["lock"], "impacto", 0.9)]
    return ev


def audio():
    ev = eventos(); ins = ["-ss", f"{FASE}", "-i", MUSICA]; fil = [f"[0:a]aresample=48000,atrim=duration={FIN},afade=t=out:st={FIN - 1.2}:d=1.2,volume=0.9[m]"]
    for i, (t, n, v) in enumerate(ev):
        ins += ["-i", sfx(n)]; ms = int(t * 1000)
        fil.append(f"[{i + 1}:a]aresample=48000,volume={v},adelay={ms}|{ms}[e{i}]")
    fil.append("".join(f"[e{i}]" for i in range(len(ev))) + f"amix=inputs={len(ev)}:normalize=0:duration=longest[ef]")
    fil.append(f"[m][ef]amix=inputs=2:normalize=0:duration=first,atrim=duration={FIN},"
               "acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-14:TP=-1.5:LRA=11,volume=-1.3dB,alimiter=limit=0.89[a]")
    f = TMP / "audio.wav"
    sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", ";".join(fil), "-map", "[a]", "-ar", "48000", f)
    return f


def golpes():
    return [round(k * B + 0.12, 4) for k in range(int(FIN / B))]


def main():
    preparar_web(); OUT.mkdir(exist_ok=True)
    arg = sys.argv[1:] or ["todo"]
    if arg[0] == "previa":
        ts = [float(x) for x in arg[1:]] or [0.2, 2.9, 3.5, 5.6, 6.6, 9.0, 13.0, 24.6, 26.8]
        print(capturar(ts, TMP / "previa", "previa_{:02d}.png"), ts); return
    if arg[0] == "hoja":
        from PIL import Image
        ts = golpes(); capturar(ts, TMP / "hoja", "g_{:03d}.png")
        cols, w, h = 10, 216, 384; filas = (len(ts) + cols - 1) // cols
        S = Image.new("RGB", (cols * w, filas * h))
        for i in range(len(ts)): S.paste(Image.open(TMP / f"hoja/g_{i:03d}.png").convert("RGB").resize((w, h)), ((i % cols) * w, (i // cols) * h))
        (OUT / "qa").mkdir(exist_ok=True); S.save(OUT / "qa/golpes.jpg", quality=85); print("out/qa/golpes.jpg", len(ts)); return
    if arg[0] == "audio": print(audio()); return
    n = int(FIN * FPS); FR = TMP / "cuadros"
    if not (len(arg) > 1 and arg[1] == "remezcla" and len(list(FR.glob("c_*.png"))) == n):
        shutil.rmtree(FR, ignore_errors=True); print(capturar([i / FPS for i in range(n)], FR, "c_{:05d}.png"))
    a = audio(); mudo = TMP / "mudo.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-framerate", FPS, "-i", FR / "c_%05d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p",
       "-preset", "slow", "-crf", "16", "-r", FPS, mudo)
    final = OUT / "reel-9x16.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-i", mudo, "-i", a, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
       "-t", FIN, "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", final)
    sh("ffmpeg", "-y", "-v", "error", "-i", final, "-vf", "crop=1080:1440:0:250", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow",
       "-crf", "16", "-c:a", "copy", "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", OUT / "reel-3x4.mp4")
    print("listo", final)


if __name__ == "__main__":
    main()
