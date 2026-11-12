"""Reel «Tres oficios» v2: versión cinematográfica (voz, Midjourney Video tramado, planos 3D de Blender, productos en movimiento).

    python3 tramar_video.py                    # videos MJ → formas por cuadro
    blender -b -P tres_d.py -- cincel|titulo|acueducto   # planos 3D → out/3d/<plano>/NNNN.png
    python3 montar.py previa 0.2 3.3 ...       # cuadros sueltos → tmp/previa.jpg
    python3 montar.py hoja                     # un cuadro por golpe → out/qa/golpes.jpg
    python3 montar.py audio                    # mezcla → tmp/audio.wav
    python3 montar.py todo [remezcla]          # → out/reel-9x16.mp4, out/reel-3x4.mp4

Línea de tiempo en golpes (0,4 s): 98 golpes = 39,2 s. Música: toma «f» de ElevenLabs (149,93 BPM, fase 0,053 s) arreglada
en la retícula: apertura fría con la música filtrada + viento + respiración, drop en el golpe 8 (= su golpe 16), silencio de
medio golpe en 69,5 que esconde el empalme, corte seco en el impacto del golpe 96. Voz: ElevenLabs (voz_el.py).
"""
import importlib.util, json, shutil, subprocess, sys
import numpy as np
from pathlib import Path

D = Path(__file__).parent
WEB, TMP, OUT, AUD = D / "tmp/web", D / "tmp", D / "out", D / "audio"
V1 = D.parent / "oficios"; PAN = D.parent / "panteon"
_s = importlib.util.spec_from_file_location("panteon_montar", PAN / "montar.py")
M = importlib.util.module_from_spec(_s); _s.loader.exec_module(M); M.WEB = WEB
W, H, FPS, BPM = 1080, 1920, 30, 150
B = 60 / BPM; GOLPES = 98; FIN = GOLPES * B
MUSICA, FASE, BPM_M = AUD / "musica_f_0b151bba.mp3", 0.053, 149.93
VOZ = "profunda"          # voz elegida (voz_el.py CANDIDATAS); se cambia cuando Cristian elija
PRODUCTOS = ["Gobia", "Tribai", "Kelsen", "Laudos", "Porkia", "MiMotoYa"]
LUGARES = ["LAB IA ESUMER", "LAB IA María Cano", "Universidad Libre", "ESEN · EAFIT", "IU Colegio Mayor",
           "INMERXIA 2026", "El Día D · 10ampro", "Comité Colombiano de Arbitraje"]
OFICIOS = [
    dict(n="01", verbo="Implementamos", copy="Entramos por un proceso concreto y construimos sobre los sistemas que ya opera el cliente."),
    dict(n="02", verbo="Desarrollamos", copy="Seis productos propios, cada uno nacido de un problema concreto."),
    dict(n="03", verbo="Capacitamos", copy="Formamos a equipos, docentes y emprendedores con las mismas herramientas que usamos para construir."),
]
# golpe de cada frase de voz (voz_el.py FRASES)
VOCES = {"f1": 0.6, "f2": 8.1, "f3": 26.2, "f4": 44.2, "f5": 70.4, "f6": 82.4}
# clips de Midjourney Video por plano: (clip, cuadro inicial, paso de cuadros por cuadro del reel)
CLIPS = {"ingeniero": ("ingeniero-0", 10, 2), "escriba": ("escriba-0", 0, 1.7), "orador": ("orador-0", 0, 2.4),
         "multitud": ("multitud-0", 0, 0.8), "friso_i": ("ingeniero-1", 40, 1), "friso_e": ("escriba-1", 0, 1), "friso_o": ("orador-1", 30, 1)}
GRADAS = dict(y1=1850, alto=106)   # cávea del video de la multitud (tramar_video.gradas)


def plano3d(p):
    """Cuadros del plano de Blender: la carpeta final si existe; si no, la previa (50 %) para la hoja y las previas."""
    full, prev = D / "out/3d" / p, D / "out/3d" / f"{p}-previa"
    n_full, n_prev = len(list(full.glob("*.png"))), len(list(prev.glob("*.png")))
    l = WEB / "3d"; l.mkdir(exist_ok=True)
    dst = l / p
    if dst.is_symlink() or dst.exists(): dst.unlink()
    dst.symlink_to(full if n_full >= n_prev else prev)
    return max(n_full, n_prev)


def preparar_web():
    WEB.mkdir(parents=True, exist_ok=True); F = WEB / "formas"; F.mkdir(exist_ok=True)
    shutil.copy(D / "escena.html", WEB / "index.html")
    A0 = PAN / "assets"
    for f in [*[f"three/{p.name}" for p in (A0 / "three").glob("*.js")], "RethinkSans-Regular.ttf", "RethinkSans-Medium.ttf", "inplux-logo-horizontal-inverse.svg"]:
        shutil.copy(A0 / f, WEB / Path(f).name)
    shutil.copytree(V1 / "assets/chat", WEB / "chat", dirs_exist_ok=True)
    for n in ("fachada", "friso3", "logo", "escriba", "anfiteatro"):      # formas fijas de la v1 (9 bytes)
        shutil.copy(V1 / f"tmp/web/formas/{n}.bin", F / f"{n}.bin")
    info1 = json.loads((V1 / "tmp/web/formas/info.json").read_text())
    for ln, dst in (("prod", TMP / "prodseq"),):
        l = WEB / ln
        if l.is_symlink() or l.exists(): l.unlink()
        l.symlink_to(dst)
    sys.path.insert(0, str(V1)); from preparar import VENTANAS, ANF  # noqa
    formas = {n: info1[n] for n in ("fachada", "friso3", "logo", "escriba", "anfiteatro")}
    clips = {}
    for k, (c, ini, paso) in CLIPS.items():
        inf = F / c / "info.json"
        if not inf.exists(): print("⚠️ falta el clip", c); continue
        clips[k] = dict(clip=c, ini=ini, paso=paso, n=json.loads(inf.read_text()))
    N = max([*formas.values(), *[max(v["n"]) for v in clips.values()]])
    datos = dict(
        bpm=BPM, golpes=GOLPES, N=N, formas=formas, clips=clips,
        gancho=["Los romanos construían", "para durar dos mil años."], drop="Nosotros también.", oficios=OFICIOS,
        flujo="Del primer flujo al día en que opera solo.", pieChat="Conversación de prueba",
        burbujas=[dict(src="chat/01-menu.png", w=370, h=243, y=250, g=26), dict(src="chat/04-pregunta.png", w=421, h=37, y=507, g=27),
                  dict(src="chat/05-fuentes.png", w=426, h=330, y=558, g=28)],
        pasos=["Diagnóstico", "Piloto", "Producción", "Operación"],
        productos=[dict(nombre=p, seq=f"prod/{p.lower()}", n=len(list((TMP / "prodseq" / p.lower()).glob("*.jpg")))) for p in PRODUCTOS],
        ventanas=VENTANAS,
        lemas=["cada respuesta con su fuente", "cada acción con su registro", "cada decisión en manos de quien ya la tenía"],
        pieDev="6 productos propios · 3 países donde operamos",
        lugares=LUGARES, formatos=["Laboratorio", "Curso", "Taller", "Charla"], gradas=GRADAS,
        cierreFrase="La IA acelera el trabajo; el criterio humano conserva la dirección.",
        cierre=[dict(texto="Cuéntanos el problema, quién lo vive y qué debería cambiar.", g=91, y=1050, tam=50, color="#f6f2ec", esp="-.01em", peso=500),
                dict(texto="INPLUX.CO", g=93, y=1236, tam=30, color="#00d7ca", esp=".28em")],
        planos3d={p: plano3d(p) for p in ("cincel", "titulo", "acueducto")},
    )
    (WEB / "datos.json").write_text(json.dumps(datos, ensure_ascii=False)); return datos


def sfx(n): return next(p for d in (AUD, V1 / "audio", PAN / "audio") for p in sorted(d.glob(f"sfx_{n}_*.mp3")))
def voz(k): return next(AUD.glob(f"voz_{k}_*.mp3")) if list(AUD.glob(f"voz_{k}_*.mp3")) else next(AUD.glob(f"voz_prueba-{VOZ}-{k}_*.mp3"))


def eventos():
    """(golpe, efecto, volumen)."""
    ev = [(0, "cincel", 1.0), (0, "viento", 0.5), (1.2, "respiracion", 0.6), (3, "cincel", 0.5), (5.5, "riser", 0.8), (7.5, "reverse", 0.5)]
    ev += [(8, "sub", 1.0), (8, "impacto", 1.0), (8, "marmol", 0.8), (8.5, "marmol", 0.6), (9, "aire", 0.5)]
    ev += [(14, "impacto", 0.6), (14, "aire", 0.5), (17.5, "aire", 0.4), (18, "arena", 0.5)] + [(g, "piedra", 0.5) for g in range(18, 26)]
    ev += [(26, "agua", 0.8), (26.2, "tecleo", 0.4), (27.2, "tecleo", 0.4)] + [(g, "brillo", 0.35) for g in range(30, 34)]
    ev += [(33.5, "aire", 0.4), (34, "impacto", 0.6)] + [(g, "estilete", 0.55) for g in range(38, 44)] + [(44, "impacto", 0.6), (44, "tecleo", 0.5)]
    ev += [(g, "brillo", 0.4) for g in range(45, 50)] + [(50, "piedra", 0.6), (50, "aire", 0.5)] + [(g, "brillo", 0.3) for g in (51, 52, 53)]
    ev += [(57.5, "aire", 0.4), (58, "impacto", 0.6), (62, "multitud", 0.7)] + [(g, "brillo", 0.25) for g in range(62, 70)]
    ev += [(68, "riser", 0.7), (70, "impacto", 1.0), (70, "sub", 0.8), (70.2, "ovacion", 0.8)] + [(g, "cincel", 0.3) for g in range(70, 78)]
    ev += [(g, "aire", 0.45) for g in (78, 79, 80, 81)] + [(81.5, "arena", 0.5), (82, "impacto", 0.6), (89.5, "reverse", 0.5)]
    ev += [(90, "impacto", 0.8), (90, "marmol", 0.5), (96, "final", 1.0), (96, "cincel", 0.8)]
    return [(g * B, n, v) for g, n, v in ev]


def musica():
    """Arreglo en la retícula. Tramos (golpe reel → golpe música): apertura 0–7,5 con la música filtrada (golpes 4–11,5),
    A 8–69,5 ↔ 16–77,5 · silencio 69,5–70 · B 70–76 ↔ 72–78 · C 76–96 ↔ 44–64 · corte en 96."""
    bm = 60 / BPM_M; f = TMP / "musica.wav"
    def tramo(g0, g1, m0, filtro=""):
        a0 = FASE + m0 * bm; return f"atrim={a0:.4f}:{a0 + (g1 - g0) * B + 0.02:.4f},asetpts=N/SR/TB{filtro},adelay={int(g0 * B * 1000)}|{int(g0 * B * 1000)}"
    partes = [tramo(0, 7.5, 4, ",lowpass=f=180,volume=0.35,afade=t=in:d=1.2,afade=t=out:st=2.6:d=0.4"),
              tramo(8, 69.5, 16, ",afade=t=out:st=24.55:d=0.05"), tramo(70, 76, 72, ",afade=t=in:d=0.01,afade=t=out:st=2.38:d=0.02"),
              tramo(76, 96, 44, ",afade=t=in:d=0.02,afade=t=out:st=7.97:d=0.03")]
    fil = "[0:a]aresample=48000,asplit=4" + "".join(f"[s{i}]" for i in range(4)) + ";"
    fil += ";".join(f"[s{i}]{p}[p{i}]" for i, p in enumerate(partes)) + ";"
    fil += "".join(f"[p{i}]" for i in range(4)) + f"amix=inputs=4:normalize=0:duration=longest,apad=whole_dur={FIN}[m]"
    M.sh("ffmpeg", "-y", "-v", "error", "-i", MUSICA, "-filter_complex", fil, "-map", "[m]", f)
    return f


def audio():
    ev = eventos(); ins = ["-i", musica()]; fil = []; k = 1
    for i, (t, n, v) in enumerate(ev):
        ins += ["-i", sfx(n)]; ms = int(round(t * 1000)); fil.append(f"[{k}:a]aresample=48000,volume={v},adelay={ms}|{ms}[e{i}]"); k += 1
    fil.append("".join(f"[e{i}]" for i in range(len(ev))) + f"amix=inputs={len(ev)}:normalize=0:duration=longest[ef]")
    vz = []
    for j, (nombre, g) in enumerate(VOCES.items()):
        ins += ["-i", voz(nombre)]; ms = int(round(g * B * 1000)); fil.append(f"[{k}:a]aresample=48000,volume=1.0,adelay={ms}|{ms}[v{j}]"); vz.append(f"[v{j}]"); k += 1
    fil.append("".join(vz) + f"amix=inputs={len(vz)}:normalize=0:duration=longest,apad=whole_dur={FIN},highpass=f=90,acompressor=threshold=-16dB:ratio=3:attack=4:release=90,volume=2.2[voz]")
    fil.append("[voz]asplit=2[vza][vzb]")
    # la música y los efectos bajan bajo la voz (sidechain)
    fil.append(f"[0:a]volume=0.85[m0];[m0][ef]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={FIN}[cama]")
    fil.append("[cama][vza]sidechaincompress=threshold=0.05:ratio=5:attack=8:release=250:makeup=1[camad]")
    fil.append(f"[camad][vzb]amix=inputs=2:normalize=0:duration=first,atrim=duration={FIN},"
               "acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-14:TP=-1.5:LRA=11,volume=-1.7dB,alimiter=limit=0.89[a]")
    f = TMP / "audio.wav"
    M.sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", ";".join(fil), "-map", "[a]", "-ar", "48000", f)
    return f


def capturar(tiempos, carpeta, patron):
    """Como panteon.montar.capturar, pero reanuda cuadros ya capturados y reabre la página cada 240 cuadros (memoria)."""
    import functools, http.server, threading
    from playwright.sync_api import sync_playwright
    carpeta.mkdir(parents=True, exist_ok=True)
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(WEB)); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    pendientes = [(i, t) for i, t in enumerate(tiempos) if not (carpeta / patron.format(i)).exists()]
    ch = None
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
            for lote in range(0, len(pendientes), 240):
                pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
                errores = []; pg.on("pageerror", lambda e: errores.append(str(e))); pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
                pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html", wait_until="load")
                pg.wait_for_function("window.listo===true", timeout=180000); pg.wait_for_timeout(300)
                if errores: raise RuntimeError(errores)
                ch = pg.evaluate("window.chequeo()")
                for i, t in pendientes[lote:lote + 240]:
                    pg.evaluate(f"window.seek({t:.4f})"); pg.screenshot(path=str(carpeta / patron.format(i)), timeout=90000)
                    if i % 150 == 0: print(f"  {i}/{len(tiempos)} cuadros", flush=True)
                pg.close()
            b.close()
    finally:
        srv.shutdown()
    return ch


def golpes(): return [round(k * B + 0.12, 4) for k in range(GOLPES)]


def hoja_de(ts, carpeta, patron, salida, cols, w, h):
    from PIL import Image
    filas = (len(ts) + cols - 1) // cols; S = Image.new("RGB", (cols * w, filas * h))
    for i in range(len(ts)): S.paste(Image.open(carpeta / patron.format(i)).convert("RGB").resize((w, h)), ((i % cols) * w, (i // cols) * h))
    S.save(salida, quality=85); print(salida, len(ts))


def main():
    preparar_web(); OUT.mkdir(exist_ok=True)
    arg = sys.argv[1:] or ["todo"]
    if arg[0] == "previa":
        ts = [float(x) for x in arg[1:]] or [0.05, 1.4, 3.3, 4.6, 6.0, 8.0, 10.6, 13.0, 15.4, 17.2, 19.0, 21.0, 23.8, 26.0, 29.2, 32.4, 35.0, 38.6]
        print(capturar(ts, TMP / "previa", "previa_{:02d}.png"), ts); hoja_de(ts, TMP / "previa", "previa_{:02d}.png", TMP / "previa.jpg", 6, 270, 480); return
    if arg[0] == "hoja":
        ts = golpes(); capturar(ts, TMP / "hoja", "g_{:03d}.png"); (OUT / "qa").mkdir(exist_ok=True)
        hoja_de(ts, TMP / "hoja", "g_{:03d}.png", OUT / "qa/golpes.jpg", 14, 180, 320); return
    if arg[0] == "audio": print(audio()); return
    n = int(round(FIN * FPS)); FR = TMP / "cuadros"
    if len(arg) > 1 and arg[1] == "limpio": shutil.rmtree(FR, ignore_errors=True)   # capturar de cero; si no, reanuda
    if len(list(FR.glob("c_*.png"))) < n: print(capturar([i / FPS for i in range(n)], FR, "c_{:05d}.png"))
    a = audio(); mudo = TMP / "mudo.mp4"
    M.sh("ffmpeg", "-y", "-v", "error", "-framerate", FPS, "-i", FR / "c_%05d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "16", "-r", FPS, mudo)
    final = OUT / "reel-9x16.mp4"
    M.sh("ffmpeg", "-y", "-v", "error", "-i", mudo, "-i", a, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-t", FIN, "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", final)
    M.sh("ffmpeg", "-y", "-v", "error", "-i", final, "-vf", "crop=1080:1440:0:250", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow",
         "-crf", "16", "-c:a", "copy", "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", OUT / "reel-3x4.mp4")
    print("listo", final)


if __name__ == "__main__":
    main()
