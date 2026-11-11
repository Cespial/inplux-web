"""Reels de datos de Gobia para @inplux_ · «No lo digas: ábrelo.»
V1 «Casi la mitad de los contratos de 2026 se firmaron en enero» (la lluvia de contratos).

    python3 montar.py            # voz + cuadros + mezcla + portada
    python3 montar.py previa     # solo cuadros clave en tmp/previa_*.png (sin voz nueva si ya hay caché)

La animación es determinista: escena_v1.html expone window.seek(t) y se captura cuadro a cuadro
(sin grabar pantalla). Las cifras salen de ../datos/territorial-<fecha>.json (secop.py).
Voz, troceo y utilidades: ../../radar/video/montar.py. Salida en out/.
"""
import importlib.util, json, re, shutil, sys
from pathlib import Path

D = Path(__file__).parent; GOBIA = D.parent; IG = GOBIA.parent
TMP, OUT, FR = D / "tmp", D / "out", D / "tmp" / "cuadros"
for p in (TMP, OUT): p.mkdir(exist_ok=True)
_s = importlib.util.spec_from_file_location("rv", IG / "radar/video/montar.py"); rv = importlib.util.module_from_spec(_s); _s.loader.exec_module(rv)
sh, dur = rv.sh, rv.dur
W, H, FPS = 1080, 1920, 30
DATOS = sorted((GOBIA / "datos").glob("territorial-*.json"))[-1]
MUSICA = IG / "radar/video/audio/musica.mp3"

# voz: lo que se dice (cifras en letras para que la locución no falle) · sub: lo que se lee
ESCENAS = [
    dict(clave="gancho",
         voz="En dos mil veintiséis, municipios y departamentos han firmado seiscientos setenta y seis mil contratos. Casi la mitad, en un solo mes.",
         sub="En 2026, municipios y departamentos han firmado 676 mil contratos. Casi la mitad, en un solo mes."),
    dict(clave="enero",
         voz="Enero: trescientos catorce mil. De febrero a junio, sumados, setenta mil.",
         sub="Enero: 314 mil. De febrero a junio, sumados, 70 mil."),
    dict(clave="ley",
         voz="No es casualidad. En año de elección presidencial, la ley prohíbe la contratación directa desde cuatro meses antes. Todos firman en enero.",
         sub="No es casualidad. En año de elección presidencial,|la ley prohíbe la contratación directa|desde cuatro meses antes. Todos firman en enero."),
    dict(clave="equipo",
         voz="Quien firma en un mes lo de medio año no revisa: apenas alcanza. Para ordenar eso hicimos Gobia.",
         sub="Quien firma en un mes|lo de medio año no revisa: apenas alcanza. Para ordenar eso hicimos Gobia."),
    dict(clave="cierre",
         voz="¿Y tu municipio? Coméntalo y lo abrimos.",
         sub="¿Y tu municipio? Coméntalo y lo abrimos."),
]
ENTRADA, PAUSA, COLA, TEMPO = 0.30, 0.30, 1.3, 1.08   # silencio inicial, respiro entre escenas, cola final


def cifras():
    d = json.loads(DATOS.read_text())
    mes = {r["k"][5:7]: int(r["n"]) for r in d["mes"]}
    total = int(d["total"]["n"]); assert sum(mes.values()) == total, "los meses no suman el total"
    orden = sorted(mes); vals = [mes[m] for m in orden]
    # puntos de 1.000 contratos por mes, por mayor residuo, para que sumen round(total/1000)
    meta = round(total / 1000); base = [v // 1000 for v in vals]
    resto = sorted(range(len(vals)), key=lambda i: -(vals[i] % 1000))
    for i in resto[: meta - sum(base)]: base[i] += 1
    assert sum(base) == meta
    return dict(meses=orden, vals=vals, puntos=base, total=total, corte=d["total"]["ultima_firma"][:10],
                consulta=d["corte_consulta"], feb_jun=sum(mes[m] for m in ("02", "03", "04", "05", "06")), jul=mes["07"], ene=mes["01"])


def miles(n): return f"{n:,}".replace(",", ".")


def fecha_corta(iso):
    a, m, d = iso.split("-"); return f"{int(d)}-{['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][int(m)-1]}-{a}"


def trocear(texto, maximo=44):
    """Subtítulos: una frase por trozo; si es larga se parte en la coma (o el espacio) más cercana al centro, nunca tras una cifra."""
    out = []
    for f in [x.strip() for x in re.split(r"(?<=[.;:?!…])\s+|\|", texto) if x.strip()]:
        pend = [f]
        while pend:
            x = pend.pop(0)
            if len(x) <= maximo: out.append(x); continue
            cortes = [m.end() for m in re.finditer(r",\s", x)] or [m.end() for m in re.finditer(r"\s", x) if not x[:m.start()].split()[-1].isdigit()]
            c = min(cortes, key=lambda i: abs(i - len(x) / 2)); pend = [x[:c].strip(), x[c:].strip()] + pend
    return out


LETRAS = {"2026": "dos mil veintiséis", "676": "seiscientos setenta y seis", "314": "trescientos catorce", "70": "setenta"}


def peso(x):
    """Duración relativa de un trozo: caracteres tal como se pronuncian (cifras en letras) + pausa por signo."""
    for k, v in LETRAS.items(): x = re.sub(rf"\b{k}\b", v, x)
    return len(x) + 6 * len(re.findall(r"[.,:?]", x))


def linea_de_tiempo():
    """Genera la voz y devuelve escenas con inicio/fin, cues de subtítulos y la pista de voz completa."""
    t = ENTRADA; esc = []; cues = []; partes = []
    for e in ESCENAS:
        w0, _ = rv.voz(e["voz"]); wav = TMP / f"v1_{e['clave']}.wav"
        sh("ffmpeg", "-y", "-v", "error", "-i", w0, "-af", f"atempo={TEMPO},silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", wav)
        dv = dur(wav)
        trozos = trocear(e["sub"]); tot = sum(peso(x) for x in trozos); tc = t
        for x in trozos:
            dt = dv * peso(x) / tot; cues.append([round(tc, 3), round(tc + dt, 3), x]); tc += dt
        esc.append(dict(clave=e["clave"], ini=round(t - (ENTRADA if not esc else PAUSA / 2), 3), voz_ini=round(t, 3), voz_fin=round(t + dv, 3)))
        partes.append((wav, t)); t += dv + PAUSA
    total = t - PAUSA + COLA
    for i, e in enumerate(esc): e["fin"] = esc[i + 1]["ini"] if i + 1 < len(esc) else round(total, 3)
    ins, fc = [], ""
    for i, (wav, t0) in enumerate(partes):
        ins += ["-i", wav]; fc += f"[{i}:a]adelay={int(t0 * 1000)}|{int(t0 * 1000)}[a{i}];"
    fc += "".join(f"[a{i}]" for i in range(len(partes))) + f"amix=inputs={len(partes)}:normalize=0,apad,atrim=duration={total:.3f}[a]"
    voz = TMP / "v1_voz.wav"
    sh("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", fc, "-map", "[a]", "-ar", "48000", "-ac", "2", voz)
    return esc, cues, voz, total


def escena_html(c, esc, cues, total):
    datos = dict(c=c, esc=esc, cues=cues, total=total,
                 txt=dict(ene=miles(c["ene"]), tot=miles(c["total"]), fj=miles(c["feb_jun"]), jul=miles(c["jul"]),
                          pct=f"{100 * c['ene'] / c['total']:.1f}".replace(".", ","), corte=fecha_corta(c["corte"])))
    html = (D / "escena_v1.html").read_text(encoding="utf-8").replace("/*DATOS*/null", json.dumps(datos, ensure_ascii=False))
    f = TMP / "v1.html"; f.write_text(html, encoding="utf-8")
    for a in (D / "assets").iterdir(): shutil.copy(a, TMP / a.name)
    return f, datos


def capturar(f, tiempos, carpeta, patron="c_{:05d}.png", sin_sub=False):
    from playwright.sync_api import sync_playwright
    carpeta.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        pg.goto(f.as_uri(), wait_until="load"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(400)
        if sin_sub: pg.evaluate("window.SIN_SUB=true")
        chequeo = pg.evaluate("window.chequeo()")
        for i, t in enumerate(tiempos):
            pg.evaluate(f"window.seek({t:.4f})"); pg.screenshot(path=str(carpeta / patron.format(i)))
        b.close()
    return chequeo


def montar():
    c = cifras(); esc, cues, voz, total = linea_de_tiempo(); f, datos = escena_html(c, esc, cues, total)
    if "previa" in sys.argv:
        ts = [0.0, 0.5, 3.0, esc[1]["fin"] - 0.4, esc[2]["voz_fin"] - 0.3, esc[3]["voz_ini"] + 2.6, esc[3]["voz_fin"], total - 0.6]
        ch = capturar(f, ts, TMP, "previa_{:02d}.png"); print("chequeo", ch); print("tiempos", [round(x, 2) for x in ts], "total", round(total, 2)); return
    shutil.rmtree(FR, ignore_errors=True)
    n = int(total * FPS)
    ch = capturar(f, [i / FPS for i in range(n)], FR)
    assert ch["puntos"] == round(c["total"] / 1000) and ch["ene"] == miles(c["ene"]), ch
    mudo = TMP / "v1_mudo.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-framerate", FPS, "-i", FR / "c_%05d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "16", "-r", FPS, mudo)
    final = OUT / "v1_enero.mp4"
    sh("ffmpeg", "-y", "-v", "error", "-i", mudo, "-i", voz, "-stream_loop", "-1", "-i", MUSICA, "-filter_complex",
       f"[2:a]atrim=duration={total:.2f},volume=0.42,afade=t=in:st=0:d=0.4,afade=t=out:st={total - 1.6:.2f}:d=1.6[m];"
       f"[1:a]asplit=2[vz][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];"
       f"[vz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]",
       "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{total:.2f}",
       "-map_metadata", "-1", "-fflags", "+bitexact", "-movflags", "+faststart", final)
    (OUT / "v1_enero.srt").write_text("\n".join(f"{k}\n{rv.srt_t(a)} --> {rv.srt_t(b)}\n{x}\n" for k, (a, b, x) in enumerate(cues, 1)), encoding="utf-8")
    # portada 3:4: torre completa, sin subtítulos
    capturar(f, [esc[1]["fin"] - 0.2], TMP, "portada_full.png", sin_sub=True)
    sh("ffmpeg", "-y", "-v", "error", "-i", TMP / "portada_full.png", "-vf", "crop=1080:1440:0:180", "-q:v", "2", OUT / "v1_portada.jpg")
    aviso = "VOZ PROVISIONAL DEL SISTEMA (ElevenLabs no respondió)\n" if rv.PROVISIONAL else ""
    (OUT / "v1_guion.txt").write_text(aviso + "\n".join(f"[{e['clave']}] {e['sub'].replace('|', ' ')}" for e in ESCENAS) + f"\n\nCifras: {DATOS.name} · chequeo {ch}\n", encoding="utf-8")
    print("listo", final, f"{total:.1f} s", "PROVISIONAL" if rv.PROVISIONAL else "voz definitiva", ch)


if __name__ == "__main__":
    montar()
