"""Reel «Tres oficios»: Implementamos · Desarrollamos · Capacitamos, contado como una obra romana a 150 BPM.

    python3 preparar.py               # stills → nubes de puntos (tmp/web/formas)
    python3 montar.py previa 1.3 9.0  # cuadros sueltos en tmp/previa/
    python3 montar.py hoja            # un cuadro por golpe → out/qa/golpes.jpg
    python3 montar.py audio           # mezcla sola → tmp/audio.wav
    python3 montar.py todo [remezcla] # cuadros + audio → out/reel-9x16.mp4, out/reel-3x4.mp4, out/portada.jpg

Motor y captura: los de ../panteon (escena Three.js determinista con window.seek(t), Playwright). Línea de tiempo en golpes
(golpe = 0,4 s; 84 golpes = 33,6 s). Música: ElevenLabs /v1/music (audio_el.py, toma «c»), medida en 149,96 BPM con librosa,
primer golpe en 0,064 s; dura 30 s, así que se empalma en la retícula: golpes 0–72 + repetición de 64–72 y corte seco en el
golpe 80, donde cae el impacto final. Copy literal: tríptico romano (~/inplux-triptico-inmerxia/generar.py), brochure general
(deck/index.html) y src/content/copy/es.ts:547. Burbujas del chat: assets/chat (chat.py), cliente tapado por decisión de Cristian.
"""
import importlib.util, json, shutil, subprocess, sys
import numpy as np
from pathlib import Path

D = Path(__file__).parent
WEB, TMP, OUT, AUD, AUD0 = D / "tmp/web", D / "tmp", D / "out", D / "audio", D.parent / "panteon/audio"
_s = importlib.util.spec_from_file_location("panteon_montar", D.parent / "panteon/montar.py")
M = importlib.util.module_from_spec(_s); _s.loader.exec_module(M); M.WEB = WEB
W, H, FPS, BPM = 1080, 1920, 30, 150
B = 60 / BPM; FIN = 84 * B
MUSICA, FASE, BPM_M = AUD / "musica_c_96d78028.mp3", 0.064, 149.96
PANT = D.parent / "panteon/assets/pantallas"

OFICIOS = [
    dict(n="01", verbo="Implementamos", copy="Entramos por un proceso concreto y construimos sobre los sistemas que ya opera el cliente."),
    dict(n="02", verbo="Desarrollamos", copy="Seis productos propios, cada uno nacido de un problema concreto."),
    dict(n="03", verbo="Capacitamos", copy="Formamos a equipos, docentes y emprendedores con las mismas herramientas que usamos para construir."),
]
PRODUCTOS = ["Gobia", "Tribai", "Kelsen", "Laudos", "Porkia", "MiMotoYa"]
LUGARES = ["LAB IA ESUMER", "LAB IA María Cano", "Universidad Libre", "ESEN · EAFIT", "IU Colegio Mayor",
           "INMERXIA 2026", "El Día D · 10ampro", "Comité Colombiano de Arbitraje"]  # de abajo arriba; el más largo arriba, sobre la cabeza


def anclas_arcos():
    """Centro (px de pantalla) de los cuatro primeros grupos de arcos, para las líneas de los cuatro pasos."""
    r = np.frombuffer((WEB / "formas/acueducto.bin").read_bytes(), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1"), ("a", "u1")])
    out = []
    for k in range(4):
        m = (r["a"] == k) & (r["o"] == 0); out.append([int(np.median(r["x"][m]) + W / 2), int(H / 2 - np.percentile(r["y"][m], 60))])
    return out


def inscripciones():
    sys.path.insert(0, str(D)); from preparar import ANF
    out = []
    for k in range(8):
        y = ANF["cy"] - ANF["k"] * (ANF["r0"] + ANF["paso"] * (k + 0.5)) - 18
        out.append([64, round(y), "c" if k == 7 else ("i" if k % 2 == 0 else "d")])
    return out


def preparar_web():
    WEB.mkdir(parents=True, exist_ok=True)
    assert (WEB / "formas/info.json").exists(), "corre primero: python3 preparar.py"
    shutil.copy(D / "escena.html", WEB / "index.html")
    A0 = D.parent / "panteon/assets"
    for f in [*[f"three/{p.name}" for p in (A0 / "three").glob("*.js")], "RethinkSans-Regular.ttf", "RethinkSans-Medium.ttf", "inplux-logo-horizontal-inverse.svg"]:
        shutil.copy(A0 / f, WEB / Path(f).name)
    shutil.copytree(D / "assets/chat", WEB / "chat", dirs_exist_ok=True)
    (WEB / "pantallas").mkdir(exist_ok=True)
    for p in PRODUCTOS: shutil.copy(PANT / f"{p.lower()}-escritorio-2026-11-11.png", WEB / "pantallas")
    sys.path.insert(0, str(D)); from preparar import VENTANAS
    datos = dict(
        bpm=BPM, formas=json.loads((WEB / "formas/info.json").read_text()),
        titulo=["Tres", "oficios.", "<em>Un equipo.</em>"], oficios=OFICIOS,
        flujo="Del primer flujo al día en que opera solo.", pieChat="Conversación de prueba",
        burbujas=[dict(src="chat/01-menu.png", w=370, h=243, y=240, g=20), dict(src="chat/04-pregunta.png", w=421, h=37, y=497, g=21),
                  dict(src="chat/05-fuentes.png", w=426, h=330, y=548, g=22)],
        pasos=["Diagnóstico", "Piloto", "Producción", "Operación"], arcos=anclas_arcos(),
        productos=[dict(nombre=p, pantalla=f"pantallas/{p.lower()}-escritorio-2026-11-11.png") for p in PRODUCTOS],
        ventanas=VENTANAS,
        lemas=["cada respuesta con su fuente", "cada acción con su registro", "cada decisión en manos de quien ya la tenía"],
        pieDev="6 productos propios · 3 países donde operamos",
        lugares=LUGARES, inscripciones=inscripciones(), formatos=["Laboratorio", "Curso", "Taller", "Charla"],
        cierreFrase="La IA acelera el trabajo; el criterio humano conserva la dirección.",
        cierre=[dict(texto="Cuéntanos el problema, quién lo vive y qué debería cambiar.", g=77, y=1050, tam=50, color="#f6f2ec", esp="-.01em", peso=500),
                dict(texto="INPLUX.CO", g=79, y=1236, tam=30, color="#00d7ca", esp=".28em")],
    )
    (WEB / "datos.json").write_text(json.dumps(datos, ensure_ascii=False))


def sfx(n): return next(p for d in (AUD, AUD0) for p in sorted(d.glob(f"sfx_{n}_*.mp3")))


def eventos():
    """(golpe, efecto, volumen)."""
    ev = [(g, "cincel", 0.9) for g in (0, 1, 2)] + [(3, "impacto", 0.9), (3, "piedra", 0.6)]
    ev += [(4, "arena", 0.45)] + [(g, "golpe", 0.45) for g in (4, 5, 6)] + [(7, "arena", 0.6), (8, "impacto", 0.7)]
    ev += [(g, "piedra", 0.5) for g in range(12, 20)] + [(20, "agua", 0.75)] + [(g, "brillo", 0.35) for g in range(24, 28)]
    ev += [(27, "arena", 0.5), (28, "impacto", 0.7)] + [(g, "estilete", 0.6) for g in range(32, 38)] + [(38, "impacto", 0.6)]
    ev += [(g, "brillo", 0.4) for g in range(39, 44)] + [(44, "piedra", 0.6)] + [(g, "brillo", 0.3) for g in (45, 46, 47)]
    ev += [(47, "arena", 0.5), (48, "impacto", 0.7), (52, "multitud", 0.75)] + [(g, "cincel", 0.35) for g in range(60, 68)]
    ev += [(g, "brillo", 0.3) for g in range(68, 72)] + [(71, "arena", 0.5), (72, "impacto", 0.6), (75, "arena", 0.5), (76, "impacto", 0.8), (80, "final", 1.0)]
    return [(g * B, n, v) for g, n, v in ev]


def musica():
    """Empalme en la retícula: golpes 0–72, otra vez 64–72, corte seco en el golpe 80 (32,0 s)."""
    bm, x = 60 / BPM_M, 0.012
    f = TMP / "musica.wav"
    a0, a1, r0 = FASE, FASE + 72 * bm + x, FASE + 64 * bm
    M.sh("ffmpeg", "-y", "-v", "error", "-i", MUSICA, "-filter_complex",
         f"[0:a]aresample=48000,asplit[p][q];[p]atrim={a0}:{a1},asetpts=N/SR/TB[u];[q]atrim={r0}:{r0 + 8 * bm + 0.3},asetpts=N/SR/TB[v];"
         f"[u][v]acrossfade=d={x}:c1=tri:c2=tri,atrim=0:{80 * B},afade=t=out:st={80 * B - 0.03}:d=0.03,apad=whole_dur={FIN}[m]",
         "-map", "[m]", f)
    return f


def audio():
    ev = eventos(); ins = ["-i", musica()]; fil = ["[0:a]volume=0.9[m]"]
    for i, (t, n, v) in enumerate(ev):
        ins += ["-i", sfx(n)]; ms = int(round(t * 1000))
        fil.append(f"[{i + 1}:a]aresample=48000,volume={v},adelay={ms}|{ms}[e{i}]")
    fil.append("".join(f"[e{i}]" for i in range(len(ev))) + f"amix=inputs={len(ev)}:normalize=0:duration=longest[ef]")
    fil.append(f"[m][ef]amix=inputs=2:normalize=0:duration=longest,atrim=duration={FIN},afade=t=out:st={FIN - 0.6}:d=0.6,"
               "acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-14:TP=-1.5:LRA=11,volume=-1.7dB,alimiter=limit=0.89[a]")
    f = TMP / "audio.wav"
    M.sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", ";".join(fil), "-map", "[a]", "-ar", "48000", f)
    return f


def golpes(): return [round(k * B + 0.12, 4) for k in range(84)]


def main():
    preparar_web(); OUT.mkdir(exist_ok=True)
    arg = sys.argv[1:] or ["todo"]
    if arg[0] == "previa":
        ts = [float(x) for x in arg[1:]] or [0.5, 1.4, 2.2, 3.8, 6.4, 8.6, 10.2, 13.6, 15.4, 17.0, 18.6, 20.4, 23.6, 26.0, 28.0, 29.0, 31.0, 32.6]
        print(M.capturar(ts, TMP / "previa", "previa_{:02d}.png"), ts)
        from PIL import Image
        cols, w, h = 6, 270, 480; filas = (len(ts) + cols - 1) // cols
        S = Image.new("RGB", (cols * w, filas * h))
        for i in range(len(ts)): S.paste(Image.open(TMP / f"previa/previa_{i:02d}.png").convert("RGB").resize((w, h)), ((i % cols) * w, (i // cols) * h))
        S.save(TMP / "previa.jpg", quality=85); return
    if arg[0] == "hoja":
        from PIL import Image
        ts = golpes(); M.capturar(ts, TMP / "hoja", "g_{:03d}.png")
        cols, w, h = 12, 180, 320; filas = (len(ts) + cols - 1) // cols
        S = Image.new("RGB", (cols * w, filas * h))
        for i in range(len(ts)): S.paste(Image.open(TMP / f"hoja/g_{i:03d}.png").convert("RGB").resize((w, h)), ((i % cols) * w, (i // cols) * h))
        (OUT / "qa").mkdir(exist_ok=True); S.save(OUT / "qa/golpes.jpg", quality=85); print("out/qa/golpes.jpg", len(ts)); return
    if arg[0] == "audio": print(audio()); return
    n = int(round(FIN * FPS)); FR = TMP / "cuadros"
    if not (len(arg) > 1 and arg[1] == "remezcla" and len(list(FR.glob("c_*.png"))) == n):
        shutil.rmtree(FR, ignore_errors=True); print(M.capturar([i / FPS for i in range(n)], FR, "c_{:05d}.png"))
    a = audio(); mudo = TMP / "mudo.mp4"
    M.sh("ffmpeg", "-y", "-v", "error", "-framerate", FPS, "-i", FR / "c_%05d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p",
         "-preset", "slow", "-crf", "16", "-r", FPS, mudo)
    final = OUT / "reel-9x16.mp4"
    M.sh("ffmpeg", "-y", "-v", "error", "-i", mudo, "-i", a, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-t", FIN, "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", final)
    M.sh("ffmpeg", "-y", "-v", "error", "-i", final, "-vf", "crop=1080:1440:0:250", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow",
         "-crf", "16", "-c:a", "copy", "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", OUT / "reel-3x4.mp4")
    print("listo", final)


if __name__ == "__main__":
    main()
