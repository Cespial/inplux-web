"""V1, versión 2 · el primer video de Gobia en @inplux_ · «No lo digas: ábrelo.»
La pantalla real del SECOP II se rompe en 676 hojas (1 hoja = 1.000 contratos), las hojas forman las
torres de cada mes, enero se sale del cuadro y al final las mismas hojas se rearman en la pantalla de Gobia.

    python3 montar_v2.py            # voz + efectos + música + cuadros + mezcla + portada
    python3 montar_v2.py previa     # cuadros clave en tmp/v2/previa_*.png

Escena: escena_v2.html (Three.js, determinista: window.seek(t)), servida por HTTP local y capturada
cuadro a cuadro con Playwright. Voz «Carlos» con tiempos por letra (ElevenLabs /with-timestamps) para los
subtítulos palabra por palabra. Efectos y música: ElevenLabs (sound-generation, music), en caché en audio/.
Imágenes en assets/v2/: secop.jpg (datos.gov.co, jbjy-vk9h, capturada el 11-nov-2026) y recortes de la
demostración de Gobia (comercial, municipio ficticio; la dirección localhost del QR va tapada).
"""
import base64, functools, hashlib, http.server, json, re, shutil, sys, threading, urllib.request
from pathlib import Path

D = Path(__file__).parent
sys.path.insert(0, str(D))
import montar as v1  # cifras(), miles(), fecha_corta(), rv
rv = v1.rv; sh, dur = rv.sh, rv.dur
TMP, OUT, AUD, FR = D / "tmp" / "v2", D / "out", D / "audio", D / "tmp" / "v2" / "cuadros"
for p in (TMP, OUT, AUD): p.mkdir(parents=True, exist_ok=True)
W, H, FPS = 1080, 1920, 30
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]
TEMPO = 1.12

ESCENAS = [
    dict(clave="gancho", pausa=0.30,
         voz="Abrimos el SECOP. En dos mil veintiséis, municipios y departamentos firmaron seiscientos setenta y seis mil contratos. Casi la mitad, en un mes."),
    dict(clave="enero", pausa=0.40, voz="Enero: trescientos catorce mil. De febrero a junio, sumados: setenta mil."),
    dict(clave="ley", pausa=0.40,
         voz="¿Por qué? En año de elección presidencial, la ley prohíbe la contratación directa cuatro meses antes. Todos firman en enero."),
    dict(clave="papeles", pausa=0.80, voz="Quien firma en un mes lo de medio año no revisa: apenas alcanza."),
    dict(clave="gobia", pausa=0.45,
         voz="Para eso hicimos Gobia, de INPLUX: para que una alcaldía contrate en orden. Cada carpeta, con semáforo. Veinte documentos, de una vez. Y cada uno se verifica con un QR."),
    dict(clave="cierre", pausa=0.0, voz="¿Y tu municipio? Coméntalo y lo abrimos."),
]
ENTRADA, COLA = 0.25, 1.5
# lo que se dice → lo que se lee en el subtítulo
LEER = [("dos mil veintiséis", "2026"), ("seiscientos setenta y seis mil", "676 mil"), ("trescientos catorce mil", "314 mil"),
        ("setenta mil", "70 mil"), ("veinte", "20")]


def norm(w): return re.sub(r"[^\wáéíóúñü]", "", w.lower())


def post(url, body, timeout=240):
    req = urllib.request.Request(url, method="POST", headers={"xi-api-key": KEY, "content-type": "application/json"}, data=json.dumps(body).encode())
    return urllib.request.urlopen(req, timeout=timeout).read()


def voz_ts(texto):
    """Voz con alineación por letra. Devuelve (mp3, palabras [(texto, ini, fin)]) en tiempos del audio original."""
    h = hashlib.md5(f"{texto}|v1.1".encode()).hexdigest()[:12]; mp3, js = AUD / f"ts_{h}.mp3", AUD / f"ts_{h}.json"
    if not mp3.exists():
        d = json.loads(post(f"https://api.elevenlabs.io/v1/text-to-speech/{rv.VOZ}/with-timestamps?output_format=mp3_44100_128",
                            {"text": texto, "model_id": rv.MODELO, "language_code": "es",
                             "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "speed": 1.1}}))
        mp3.write_bytes(base64.b64decode(d["audio_base64"])); js.write_text(json.dumps(d["alignment"], ensure_ascii=False))
    a = json.loads(js.read_text()); pal, cur = [], None
    for ch, s, e in zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]):
        if ch.isspace():
            if cur: pal.append(cur); cur = None
            continue
        cur = [cur[0] + ch, cur[1], e] if cur else [ch, s, e]
    if cur: pal.append(cur)
    return mp3, pal


def efecto(nombre, texto, seg):
    h = hashlib.md5(f"{texto}|{seg}".encode()).hexdigest()[:10]; f = AUD / f"sfx_{nombre}_{h}.mp3"
    if not f.exists():
        f.write_bytes(post("https://api.elevenlabs.io/v1/sound-generation", {"text": texto, "duration_seconds": seg, "prompt_influence": 0.45}))
    return f


MUSICA_PROMPT = ("Instrumental, modern minimal electronic for a short data-journalism video: tight pulsing synth bass and a soft kick around 100 BPM, "
                 "glassy plucks, tension building in the first half, a bright warm lift in the second half when a product is revealed, "
                 "clean and confident, no vocals, soft resolve at the end.")


def musica(seg):
    ms = int((seg + 1.5) * 1000); h = hashlib.md5(f"{MUSICA_PROMPT}|{ms}".encode()).hexdigest()[:10]; f = AUD / f"musica_v2_{h}.mp3"
    if not f.exists():
        try: f.write_bytes(post("https://api.elevenlabs.io/v1/music", {"prompt": MUSICA_PROMPT, "music_length_ms": ms}, timeout=400))
        except Exception as e: print("  música de ElevenLabs no disponible, uso la del Radar:", str(e)[:80]); return v1.MUSICA
    return f


def linea_de_tiempo():
    t = ENTRADA; esc, partes, toks = [], [], []
    for i, e in enumerate(ESCENAS):
        mp3, pal = voz_ts(e["voz"])
        a0, a1 = max(0, pal[0][1] - 0.04), pal[-1][2] + 0.12
        wav = TMP / f"voz_{e['clave']}.wav"
        sh("ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", f"atrim=start={a0:.3f}:end={a1:.3f},asetpts=PTS-STARTPTS,atempo={TEMPO}", "-ar", "48000", "-ac", "2", wav)
        dv = dur(wav)
        ws = [[w, round(t + (s - a0) / TEMPO, 3), round(t + (f - a0) / TEMPO, 3)] for w, s, f in pal]
        esc.append(dict(clave=e["clave"], ini=round(t - (ENTRADA if i == 0 else ESCENAS[i - 1]["pausa"] / 2), 3), voz_ini=round(t, 3), voz_fin=round(t + dv, 3), w=ws))
        partes.append((wav, t)); t += dv + e["pausa"]
    total = esc[-1]["voz_fin"] + COLA
    ins, fc = [], ""
    for i, (wav, t0) in enumerate(partes):
        ins += ["-i", wav]; fc += f"[{i}:a]adelay={int(t0 * 1000)}|{int(t0 * 1000)}[a{i}];"
    fc += "".join(f"[a{i}]" for i in range(len(partes))) + f"amix=inputs={len(partes)}:normalize=0,apad,atrim=duration={total:.3f}[a]"
    voz = TMP / "voz.wav"; sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", fc, "-map", "[a]", "-ar", "48000", "-ac", "2", voz)
    return esc, voz, round(total, 3)


def subtitulos(esc):
    """Trozos de subtítulo con tiempos por palabra; las cifras dichas en letras se leen en dígitos."""
    chunks = []
    for e in esc:
        ws, out, i = e["w"], [], 0
        while i < len(ws):
            for frase, leer in LEER:
                n = len(frase.split())
                if [norm(x[0]) for x in ws[i:i + n]] == frase.split():
                    cola = re.sub(r"^[\wáéíóúñü]+", "", ws[i + n - 1][0])
                    out.append([leer + cola, ws[i][1], ws[i + n - 1][2]]); i += n; break
            else:
                out.append(list(ws[i])); i += 1
        cur = []
        for w in out:
            cur.append(w)
            largo = len(" ".join(x[0] for x in cur))
            if re.search(r"[.?!:]$", w[0]) or largo > 30:
                chunks.append(cur); cur = []
        if cur: chunks.append(cur)
    res = []
    for k, c in enumerate(chunks):
        t0 = c[0][1] - 0.05; t1 = chunks[k + 1][0][1] - 0.05 if k + 1 < len(chunks) else c[-1][2] + 0.6
        t1 = min(t1, c[-1][2] + 0.6)
        res.append(dict(t0=round(t0, 3), t1=round(t1, 3), w=c))
    return res


def palabra(esc, clave, w, cual=0, fin=False):
    e = next(x for x in esc if x["clave"] == clave); hits = [x for x in e["w"] if norm(x[0]) == w]
    return hits[cual][2 if fin else 1]


def claves(esc, total):
    E = {e["clave"]: e for e in esc}
    k = dict(rompe=palabra(esc, "gancho", "contratos") - 0.1, e1=E["enero"]["ini"], eneFin=palabra(esc, "enero", "mil", fin=True),
             fj=palabra(esc, "enero", "de"), e2=E["ley"]["ini"], ley=palabra(esc, "ley", "prohíbe") - 0.1, e2fin=E["ley"]["voz_fin"],
             card=E["papeles"]["ini"], arma=E["gobia"]["voz_ini"] - 0.85, lock=palabra(esc, "gobia", "gobia") - 0.05,
             band=palabra(esc, "gobia", "alcaldía") - 0.45, sem=palabra(esc, "gobia", "cada") - 0.1, lote=palabra(esc, "gobia", "veinte") - 0.1,
             qr=palabra(esc, "gobia", "y") - 0.1, ver=palabra(esc, "gobia", "qr") - 0.25, fin=E["cierre"]["ini"], total=total)
    return {a: round(b, 3) for a, b in k.items()}


def sonido(k, total):
    """Pista de efectos: (archivo, inicio, volumen)."""
    lluvia = round(min(8.0, max(1.5, k["eneFin"] - k["rompe"])), 1)
    clic = efecto("clic", "soft modern user interface click with a short airy whoosh", 0.7)
    lista = [
        (efecto("rompe", "a computer screen shattering into hundreds of paper sheets, crisp glassy crack into a paper whoosh, cinematic", 2.0), k["rompe"] - 0.05, 0.75),
        (efecto("lluvia", "hundreds of paper sheets falling fast and stacking into piles, continuous fluttering rustle", lluvia), k["rompe"] + 0.25, 0.55),
        (efecto("golpe", "deep cinematic sub bass boom impact, short and heavy", 2.0), k["eneFin"] - 0.06, 0.9),
        (efecto("sello", "heavy rubber stamp hitting paper with a low tense cinematic stinger", 1.5), k["ley"] + 0.05, 0.6),
        (efecto("hoja", "a single sheet of paper sliding out of a stack and swooshing toward the camera", 1.2), k["card"] + 0.1, 0.6),
        (efecto("subida", "cinematic reverse whoosh riser building up tension, ends abruptly", 2.0), k["arma"] - 1.4, 0.6),
        (efecto("arma", "cascade of paper cards snapping magnetically into a neat grid, satisfying fast clicks", 1.6), k["arma"] + 0.15, 0.55),
        (efecto("revela", "warm cinematic hit with a soft bright shimmer, positive reveal", 2.0), k["lock"] - 0.05, 0.75),
        (clic, k["band"], 0.5), (clic, k["sem"], 0.5), (clic, k["lote"], 0.5), (clic, k["qr"], 0.5), (clic, k["ver"], 0.45),
        (efecto("cierre", "soft airy whoosh transition into silence", 1.0), k["fin"], 0.45),
    ]
    ins, fc = [], ""
    for i, (f, t0, vol) in enumerate(lista):
        ins += ["-i", f]; ms = int(max(0, t0) * 1000); fc += f"[{i}:a]aresample=48000,volume={vol},adelay={ms}|{ms}[s{i}];"
    fc += "".join(f"[s{i}]" for i in range(len(lista))) + f"amix=inputs={len(lista)}:normalize=0,apad,atrim=duration={total:.3f}[a]"
    out = TMP / "efectos.wav"; sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", fc, "-map", "[a]", "-ar", "48000", "-ac", "2", "-t", f"{total:.3f}", out)
    return out


def escena(c, esc, total):
    k = claves(esc, total)
    txt = dict(ene=v1.miles(c["ene"]), tot=v1.miles(c["total"]), fj=v1.miles(c["feb_jun"]), jul=v1.miles(c["jul"]),
               pct=f"{100 * c['ene'] / c['total']:.1f}".replace(".", ","), corte=v1.fecha_corta(c["corte"]))
    datos = dict(c=c, k=k, txt=txt, chunks=subtitulos(esc), total=total)
    (TMP / "index.html").write_text((D / "escena_v2.html").read_text(encoding="utf-8").replace("/*DATOS*/null", json.dumps(datos, ensure_ascii=False)), encoding="utf-8")
    for d in (D / "assets", D / "assets" / "v2", D / "assets" / "three"):
        for a in d.iterdir():
            if a.is_file(): shutil.copy(a, TMP / a.name)
    return datos


def capturar(tiempos, carpeta, patron, sin_sub=False):
    from playwright.sync_api import sync_playwright
    carpeta.mkdir(parents=True, exist_ok=True)
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(TMP)); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
            errores = []; pg.on("pageerror", lambda e: errores.append(str(e)))
            pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html", wait_until="load")
            pg.wait_for_function("window.listo===true", timeout=60000); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
            if errores: raise RuntimeError(errores)
            if sin_sub: pg.evaluate("window.SIN_SUB=true")
            ch = pg.evaluate("window.chequeo()")
            for i, t in enumerate(tiempos):
                pg.evaluate(f"window.seek({t:.4f})"); pg.screenshot(path=str(carpeta / patron.format(i)))
                if i and i % 150 == 0: print(f"  {i}/{len(tiempos)} cuadros")
            b.close()
    finally:
        srv.shutdown()
    return ch


def montar():
    c = v1.cifras(); esc, voz, total = linea_de_tiempo(); datos = escena(c, esc, total); k = datos["k"]
    print("tiempos", k)
    if "previa" in sys.argv:
        ts = [0.0, 1.2, k["rompe"] + 0.5, k["rompe"] + 1.3, k["e1"] + 0.6, k["eneFin"] + 0.5, k["ley"] + 0.8, k["card"] + 2.8,
              k["arma"] + 0.6, k["lock"] + 0.6, k["band"] + 0.9, k["sem"] + 1.4, k["lote"] + 1.3, k["qr"] + 0.8, k["ver"] + 0.9, total - 0.5]
        ch = capturar(ts, TMP, "previa_{:02d}.png"); print("chequeo", ch, "\ntiempos", [round(x, 2) for x in ts], "total", total); return
    n = int(total * FPS)
    if "remezcla" in sys.argv and len(list(FR.glob("c_*.png"))) == n:
        ch = dict(hojas=round(c["total"] / 1000), ene=v1.miles(c["ene"]), nota="cuadros ya capturados")
    else:
        shutil.rmtree(FR, ignore_errors=True)
        ch = capturar([i / FPS for i in range(n)], FR, "c_{:05d}.png")
    assert ch["hojas"] == round(c["total"] / 1000) and ch["ene"] == v1.miles(c["ene"]), ch
    sfx = sonido(k, total); mus = musica(total)
    mudo = TMP / "mudo.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-framerate", FPS, "-i", FR / "c_%05d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "16", "-r", FPS, mudo)
    final = OUT / "v1_enero_v2.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-i", mudo, "-i", voz, "-i", sfx, "-stream_loop", "-1", "-i", mus, "-filter_complex",
       f"[3:a]aresample=48000,atrim=duration={total:.2f},volume=0.55,afade=t=in:st=0:d=0.3,afade=t=out:st={total - 1.5:.2f}:d=1.5[m];"
       f"[1:a]asplit=2[vz][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];"
       f"[vz][md][2:a]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]",
       "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{total:.2f}",
       "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", final)
    srt = []
    for i, ch_ in enumerate(datos["chunks"], 1):
        srt.append(f"{i}\n{rv.srt_t(ch_['t0'])} --> {rv.srt_t(ch_['t1'])}\n{' '.join(w[0] for w in ch_['w'])}\n")
    (OUT / "v1_enero_v2.srt").write_text("\n".join(srt), encoding="utf-8")
    capturar([k["eneFin"] + 0.55], TMP, "portada_full.png", sin_sub=True)
    sh("ffmpeg", "-y", "-v", "error", "-i", TMP / "portada_full.png", "-vf", "crop=1080:1440:0:120", "-q:v", "2", OUT / "v1_v2_portada.jpg")
    (OUT / "v1_v2_guion.txt").write_text("\n".join(f"[{e['clave']}] {e['voz']}" for e in ESCENAS) + f"\n\nmúsica: {mus.name}\nchequeo {ch}\n", encoding="utf-8")
    print("listo", final, f"{total:.1f} s", ch)


if __name__ == "__main__":
    montar()
