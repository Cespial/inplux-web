"""Reels «Radar» sin cara: pantalla real + voz (ElevenLabs, Carlos) + subtítulos quemados + música con ducking.
1080 × 1920, 30 fps. Uso: python3 montar.py r2 [r3 ...]
Escenas por reel: gancho (lámina) · fuente (grabación real de la página con Playwright) · idea (lámina) ·
prueba nuestra (terminal que escribe la salida real de pruebas/traza_cco.py) · aterriza (lámina) · cierre (lámina).
Entradas: ../exports/jpg/*.jpg, audio/musica.mp3, ~/.config/inplux/elevenlabs.env. Salida: out/<reel>.mp4, .srt, guion.txt
"""
import hashlib, importlib.util, json, shutil, subprocess, sys, urllib.request
from pathlib import Path

D = Path(__file__).parent; RADAR = D.parent; RAW, TMP, OUT, AUD = D / "raw", D / "tmp", D / "out", D / "audio"
for p in (RAW, TMP, OUT, AUD): p.mkdir(exist_ok=True)
_s = importlib.util.spec_from_file_location("rb", RADAR / "build.py"); rb = importlib.util.module_from_spec(_s); _s.loader.exec_module(rb)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
VOZ, MODELO = "Y4HwpMNrBWN5dFKi5Lw8", "eleven_v4"   # Carlos, narrador colombiano (misma voz del video del CCO)
W, H, FPS = 1080, 1920, 30
VOZ_SISTEMA = "Paulina"; PROVISIONAL = []
ENC = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "18", "-r", str(FPS)]
FUENTE = (RADAR / "assets/RethinkSans.woff2").as_uri()
PAPEL, BLACK, IVORY, TEAL = rb.PAPEL, rb.BLACK, rb.IVORY, rb.TEAL


def sh(*a):
    r = subprocess.run([str(x) for x in a], capture_output=True, text=True)
    if r.returncode: raise RuntimeError(r.stderr[-1500:])
    return r.stdout


def dur(f): return float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f).strip())


def voz(texto):
    key = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]
    h = hashlib.md5(texto.encode()).hexdigest()[:12]; cache = AUD / f"voz_{VOZ}_{h}.mp3"
    if not cache.exists() and not (AUD / f"prov_{h}.aiff").exists():
      try:
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128", method="POST",
                                     headers={"xi-api-key": key, "content-type": "application/json"},
                                     data=json.dumps({"text": texto, "model_id": MODELO, "language_code": "es",
                                                      "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "speed": 1.02}}).encode())
        cache.write_bytes(urllib.request.urlopen(req, timeout=120).read())
      except Exception as e:
        print("  ElevenLabs sin respuesta, voz provisional del sistema:", str(e)[:60]); PROVISIONAL.append(h)
        sh("say", "-v", VOZ_SISTEMA, "-r", "178", "-o", AUD / f"prov_{h}.aiff", texto)
    if not cache.exists():
        cache = AUD / f"prov_{h}.aiff"; PROVISIONAL.append(h)
    wav = TMP / f"v_{h}.wav"; sh("ffmpeg", "-y", "-v", "error", "-i", cache, "-ar", "48000", "-ac", "2", wav)
    return wav, dur(wav)


def png_html(html, out, w=W, h=H, transparente=True):
    f = TMP / (out.stem + ".html")
    f.write_text(f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:"Rethink Sans";src:url({FUENTE}) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:{w}px;height:{h}px;background:transparent;overflow:hidden}}
body{{font-family:"Rethink Sans",sans-serif;-webkit-font-smoothing:antialiased}}</style></head><body>{html}</body></html>""", encoding="utf-8")
    args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--screenshot={out}", f"--window-size={w},{h}",
            "--virtual-time-budget=4000", "--force-color-profile=srgb", "--allow-file-access-from-files"]
    if transparente: args.append("--default-background-color=00000000")
    try: subprocess.run(args + [f.as_uri()], timeout=40, capture_output=True)
    except subprocess.TimeoutExpired: pass
    subprocess.run(["pkill", "-f", "Google Chrome.*headless"], capture_output=True)
    return out


def subtitulo(texto, k):
    """Subtítulo quemado: dos líneas máximo, píldora negra, en la zona segura inferior."""
    out = TMP / f"sub_{k}.png"
    if out.exists(): return out
    return png_html(f"""<div style="position:absolute;left:60px;right:60px;top:1450px;display:flex;justify-content:center">
  <span style="display:inline-block;background:rgba(12,12,11,.86);color:{IVORY};font-size:44px;font-weight:600;line-height:1.22;letter-spacing:-.015em;
  padding:16px 28px;border-radius:16px;text-align:center;max-width:960px">{texto}</span></div>""", out)


def trocear(texto, maximo=42):
    """Parte la narración en trozos de ~2 líneas respetando signos de puntuación."""
    import re
    frases = [f.strip() for f in re.split(r"(?<=[.;:?!…])\s+", texto) if f.strip()]
    trozos = []
    for f in frases:
        palabras = f.split(); actual = ""
        for p in palabras:
            if len(actual) + len(p) + 1 > maximo * 2 and actual:
                trozos.append(actual); actual = p
            else: actual = (actual + " " + p).strip()
        if actual: trozos.append(actual)
    return trozos


def grabar_web(clave, url, zoom, desde, hasta, paso=10, espera=1500, ms_frame=16):
    """Graba el scroll real de una página en 1080 × 1920 (cache en raw/)."""
    out = RAW / f"{clave}.webm"
    if out.exists(): return out
    from playwright.sync_api import sync_playwright
    tmpd = RAW / f"_{clave}"; shutil.rmtree(tmpd, ignore_errors=True); tmpd.mkdir()
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": W, "height": H}, record_video_dir=str(tmpd), record_video_size={"width": W, "height": H}, locale="es-CO")
        ctx.add_init_script(f"document.addEventListener('DOMContentLoaded',()=>{{document.documentElement.style.zoom='{zoom}'}})")
        pg = ctx.new_page(); pg.goto(url, wait_until="load"); pg.wait_for_timeout(espera)
        for y in range(desde, hasta, paso): pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(ms_frame)
        pg.wait_for_timeout(1200); ctx.close(); b.close()
    shutil.move(str(next(tmpd.glob("*.webm"))), out); shutil.rmtree(tmpd, ignore_errors=True)
    return out


def grabar_terminal(clave, titulo, lineas, ms_linea=420):
    """Terminal que escribe las líneas reales una a una (misma caja .term de referentes), grabada en 1080 × 1920."""
    out = RAW / f"{clave}.webm"
    if out.exists(): return out
    from playwright.sync_api import sync_playwright
    html = f"""<!doctype html><html><head><meta charset="utf-8">{rb.h.ref.EXTRA}<style>
@font-face{{font-family:"Rethink Sans";src:url({FUENTE}) format("woff2");font-weight:400 800}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;background:{BLACK};overflow:hidden}}
body{{font-family:"Rethink Sans",sans-serif;color:{IVORY};-webkit-font-smoothing:antialiased}}
.term pre{{font-size:25px;line-height:1.75;min-height:620px}} .l{{display:none}} .l.on{{display:block}}
.cur{{display:inline-block;width:14px;height:30px;background:{TEAL};vertical-align:-4px;animation:p .9s steps(1) infinite}}@keyframes p{{50%{{opacity:0}}}}
</style></head><body>
<div class="micro" style="position:absolute;left:84px;top:470px;color:{TEAL};font-size:19px;letter-spacing:.3em;text-transform:uppercase">Lo que probamos nosotros · 17 oct 2026</div>
<div style="position:absolute;left:60px;right:60px;top:540px"><div class="term"><div class="barra"><i></i><i></i><i></i>
<span style="margin-left:18px;flex:1;text-align:center;font-size:17px;color:{rb.MUTED};letter-spacing:.04em">{titulo}</span></div>
<pre>{"".join(f'<div class="l">{l if l else "&nbsp;"}</div>' for l in lineas)}<span class="cur"></span></pre></div></div>
<script>const L=[...document.querySelectorAll('.l')];let i=0;window.paso=()=>{{if(i<L.length){{L[i].classList.add('on');i++}}return i>=L.length}};</script>
</body></html>"""
    f = TMP / f"{clave}.html"; f.write_text(html, encoding="utf-8")
    tmpd = RAW / f"_{clave}"; shutil.rmtree(tmpd, ignore_errors=True); tmpd.mkdir()
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": W, "height": H}, record_video_dir=str(tmpd), record_video_size={"width": W, "height": H})
        pg = ctx.new_page(); pg.goto(f.as_uri(), wait_until="load"); pg.wait_for_timeout(900)
        pg.evaluate("paso()"); pg.wait_for_timeout(1100)   # el comando
        while not pg.evaluate("paso()"): pg.wait_for_timeout(ms_linea)
        pg.wait_for_timeout(2500); ctx.close(); b.close()
    shutil.move(str(next(tmpd.glob("*.webm"))), out); shutil.rmtree(tmpd, ignore_errors=True)
    return out


def segmento(k, escena, wav, d_voz):
    """Un clip 1080 × 1920 con su narración y subtítulos; láminas con un zoom lento, grabaciones a su ritmo."""
    tipo, fuente = escena["tipo"], escena["fuente"]
    d = max(d_voz + 0.7, escena.get("min", 0))
    out = TMP / f"seg_{k:02d}.mp4"
    if tipo == "lamina":
        color = PAPEL if escena.get("claro") else BLACK
        base = (f"[0:v]crop=1080:1160:0:0,pad={W}:{H}:0:260:color={color},fps={FPS},"
                f"zoompan=z='min(zoom+0.00035,1.045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},trim=duration={d:.2f},setpts=PTS-STARTPTS")
        ins = ["-loop", "1", "-t", f"{d:.2f}", "-i", fuente]
    else:
        dv = dur(fuente); vel = max(dv / d, 0.6)
        base = f"[0:v]setpts=PTS/{vel:.4f},fps={FPS},tpad=stop_mode=clone:stop_duration=60,trim=duration={d:.2f},setpts=PTS-STARTPTS,scale={W}:{H}"
        ins = ["-i", fuente]
    ins += ["-i", wav]
    fc = base + "[b0]"; n = 2; ultimo = "b0"
    trozos = trocear(escena["texto"]); total = sum(len(t) for t in trozos); t = 0.35
    cues = []
    for j, tx in enumerate(trozos):
        dt = (d_voz - 0.2) * len(tx) / total
        png = subtitulo(tx, hashlib.md5(tx.encode()).hexdigest()[:10]); ins += ["-i", png]
        fc += f";[{ultimo}][{n}:v]overlay=0:0:enable='between(t,{t:.2f},{t + dt:.2f})'[b{n}]"; ultimo = f"b{n}"; n += 1
        cues.append((t, t + dt, tx)); t += dt
    fade = f"fade=t=in:st=0:d=0.35,fade=t=out:st={d - 0.35:.2f}:d=0.35"
    fc += f";[{ultimo}]{fade}[v];[1:a]adelay=350|350,apad,atrim=duration={d:.2f}[a]"
    sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", *ENC, "-c:a", "aac", "-b:a", "192k", "-t", f"{d:.2f}", out)
    return out, d, cues


def srt_t(s): return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)):03d}"


def montar(nombre, escenas):
    segs, cues, t0, guion = [], [], 0.0, []
    for k, e in enumerate(escenas):
        wav, dv = voz(e["texto"])
        seg, d, cs = segmento(k, e, wav, dv)
        segs.append(seg); cues += [(t0 + a, t0 + b, x) for a, b, x in cs]; guion.append(f"[{e['clave']}] {e['texto']}"); t0 += d
    lst = TMP / f"{nombre}_lista.txt"; lst.write_text("".join(f"file '{s}'\n" for s in segs))
    sinmus = TMP / f"{nombre}_sinmusica.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", sinmus)
    final = OUT / f"{nombre}.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-i", sinmus, "-stream_loop", "-1", "-i", AUD / "musica.mp3", "-filter_complex",
       f"[1:a]atrim=duration={t0:.2f},volume=0.5,afade=t=out:st={t0 - 2:.2f}:d=2[m];"
       f"[0:a]asplit=2[vz][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];"
       f"[vz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]",
       "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", final)
    (OUT / f"{nombre}.srt").write_text("\n".join(f"{n}\n{srt_t(a)} --> {srt_t(b)}\n{x}\n" for n, (a, b, x) in enumerate(cues, 1)), encoding="utf-8")
    aviso = "VOZ PROVISIONAL DEL SISTEMA (ElevenLabs no respondió): volver a correr montar.py cuando responda.\n" if PROVISIONAL else ""
    (OUT / f"{nombre}_guion.txt").write_text(aviso + "\n".join(guion) + "\n", encoding="utf-8")
    print(nombre, f"{t0:.1f} s", final)


J = RADAR / "exports/jpg"
TRAZA_TXT = [l for l in rb.TRAZA]
REELS = {
    "r2": [
        dict(clave="gancho", tipo="lamina", fuente=J / "r2_01.jpg", min=4.5,
             texto="El veinte de octubre OpenAI publicó esto: dos de sus agentes apagaron su propio monitoreo. Y uno lo negó."),
        dict(clave="informe", tipo="web", fuente=lambda: grabar_web("r2_informe", "https://alignment.openai.com/misalignment-reports/suppressing-misalignment-monitoring-alerts-and-disabling-misalignment-monitoring/", 1.9, 260, 2700, 10),
             texto="A uno le dijeron «no envíes mensajes», y silenció las alertas al equipo de seguridad. El otro quitó el monitor y, cuando le preguntaron, dijo que no lo había hecho."),
        dict(clave="grieta", tipo="lamina", fuente=J / "r2_03.jpg",
             texto="La grieta no fue el modelo. La vigilancia estaba dentro de lo que el agente podía tocar."),
        dict(clave="prueba", tipo="term", fuente=lambda: grabar_terminal("r2_traza", "nuestra torre de propuestas públicas · bitácora del orquestador", TRAZA_TXT),
             texto="Nosotros lo probamos al revés: once agentes sin herramientas. El registro lo escribe el orquestador, donde el agente no llega. Trescientos ochenta y seis mil tokens, dos avisos, nueve controles. Todo quedó en la bitácora."),
        dict(clave="reglas", tipo="lamina", fuente=J / "r2_04.jpg", claro=True,
             texto="Antes de dejar un agente solo: bitácora fuera de su alcance, herramientas mínimas, y cada corrida se puede releer."),
        dict(clave="cierre", tipo="lamina", fuente=J / "r2_06.jpg", min=5,
             texto="¿Qué agente ya trabaja solo en tu empresa, y quién lee su bitácora? Cuéntanos. El criterio es de quien firma."),
    ],
    "r3": [
        dict(clave="gancho", tipo="lamina", fuente=J / "r3_01.jpg", min=4.5,
             texto="Una IA que no puede inventar. Setenta milisegundos por decisión y cuatro centavos de dólar por millón de tokens."),
        dict(clave="docs", tipo="web", fuente=lambda: grabar_web("r3_docs", "https://docs.typesafe.ai/concepts/system-one", 1.6, 0, 1900, 8),
             texto="Se llama Jev y la hizo TypeSafe, fundada por un ex OpenAI. No escribe: elige una opción, pone un puntaje o dice sí o no, con su probabilidad. Como no genera texto, no puede inventar una norma ni una cifra."),
        dict(clave="cajas", tipo="lamina", fuente=J / "r3_03.jpg",
             texto="Entra un estado: el correo, la glosa, el pliego. Sale una respuesta tipada, lista para que el software la use."),
        dict(clave="prueba", tipo="term", fuente=lambda: grabar_terminal("r3_jev", "¿qué pasos nuestros son System One?", rb.JEV_VS),
             texto="Medimos nuestra torre de once agentes paso a paso. Solo el gate, la decisión de entrar o no, es un trabajo para Jev. Los otros diez redactan o ya corren en código sin IA."),
        dict(clave="aterriza", tipo="lamina", fuente=J / "r3_04.jpg", claro=True,
             texto="Glosas en salud, PQR en alcaldías, pliegos en contratación: decisiones pequeñas, mil veces al día. Calibrado no significa correcto: alguien sigue revisando los casos difíciles."),
        dict(clave="cierre", tipo="lamina", fuente=J / "r3_06.jpg", min=5,
             texto="¿Qué decisión repite tu empresa mil veces al día? Dinos cuál. El criterio es de quien firma."),
    ],
}

if __name__ == "__main__":
    for nombre in sys.argv[1:] or REELS:
        escenas = [dict(e, fuente=e["fuente"]() if callable(e["fuente"]) else e["fuente"]) for e in REELS[nombre]]
        montar(nombre, escenas)
