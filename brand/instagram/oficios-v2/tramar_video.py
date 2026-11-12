"""Videos de Midjourney → trama de puntos cuadro a cuadro (tmp/web/formas/<clip>/NNNN.bin, 9 bytes por punto).

Misma receta que Panteón (curva + Bayer 4×4, celda 6 px, punto 0,80), con dos cosas para que no titile:
suavizado temporal de la luminancia (mezcla con el cuadro anterior) y un desenfoque leve que quita el grano del video.
    python3 tramar_video.py escriba-0 orador-0 ...     (sin argumentos: todos los clips de tmp/mjseq)
    python3 tramar_video.py --hoja escriba-0           además tmp/trama_<clip>.jpg con 6 cuadros tramados
"""
import importlib.util, json, sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter

D = Path(__file__).parent
_s = importlib.util.spec_from_file_location("panteon_preparar", D.parent / "panteon/preparar.py")
P = importlib.util.module_from_spec(_s); sys.path.insert(0, str(D.parent / "panteon")); _s.loader.exec_module(P)
W, H = P.W, P.H
SEQ, OUT = D / "tmp/mjseq", D / "tmp/web/formas"
GANANCIA = {"acueducto": 1.5, "ingeniero": 1.3, "escriba": 1.3, "orador": 1.3, "multitud": 4.5}
MEZCLA = 0.45   # peso del cuadro anterior en la luminancia


def guardar(f, cx, cy, z, tam, ob, a):
    r = np.zeros(len(cx), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1"), ("a", "u1")])
    r["x"] = np.round(cx); r["y"] = np.round(cy); r["z"] = np.round(z); r["s"] = np.clip(np.round(tam * 10), 0, 255); r["o"] = ob; r["a"] = a
    r = r[np.random.default_rng(7).permutation(len(r))]
    f.write_bytes(r.tobytes()); return len(r)


def gradas(cx, cy, cfg):
    """Banda de grada (0–7) por filas horizontales desde la orquesta (y1) hacia arriba; 255 fuera de la cávea."""
    py = H / 2 - cy
    g = np.floor((cfg["y1"] - py) / cfg["alto"])
    return np.where((g >= 0) & (g < 8), g, 255).astype(np.uint8)


def tramar(clip, hoja=False, cfg_gradas=None):
    src = SEQ / clip; out = OUT / clip; out.mkdir(parents=True, exist_ok=True)
    g = GANANCIA.get(clip.split("-")[0], 1.3)
    fs = sorted(src.glob("*.png")); prev = None; info = []; muestras = []
    for i, f in enumerate(fs):
        im = Image.open(f).convert("L").filter(ImageFilter.GaussianBlur(0.8))
        a = np.clip(P.curva(im) * g, 0, 1)
        if prev is not None: a = (1 - MEZCLA) * a + MEZCLA * prev
        prev = a
        cx, cy, z, tam, ob = P.nube(a)
        aa = gradas(cx, cy, cfg_gradas) if cfg_gradas else np.zeros(len(cx), np.uint8)
        info.append(guardar(out / f"{i:04d}.bin", cx, cy, z, tam, ob, aa))
        if hoja and i % 30 == 0: muestras.append((cx, cy, aa))
    (out / "info.json").write_text(json.dumps(info))
    print(clip, len(fs), "cuadros", "puntos", min(info), "–", max(info))
    if hoja:
        S = Image.new("RGB", (len(muestras) * 270, 480), (12, 12, 11))
        for k, (cx, cy, aa) in enumerate(muestras):
            im = np.zeros((H // 6, W // 6, 3), np.uint8)
            ix = ((cx + W / 2) // 6).astype(int).clip(0, W // 6 - 1); iy = ((H / 2 - cy) // 6).astype(int).clip(0, H // 6 - 1)
            col = np.where(aa[:, None] == 255, [246, 242, 236], [0, 215, 202])
            im[iy, ix] = col
            S.paste(Image.fromarray(im).resize((270, 480)), (k * 270, 0))
        S.save(D / f"tmp/trama_{clip}.jpg", quality=85)
    return info


def titileo(clip):
    """Fracción de puntos que cambian entre cuadros consecutivos (medida de parpadeo)."""
    out = OUT / clip; fs = sorted(out.glob("*.bin"))[:40]; prev = None; dif = []
    for f in fs:
        r = np.frombuffer(f.read_bytes(), dtype=[("x", "<i2"), ("y", "<i2"), ("z", "<i2"), ("s", "u1"), ("o", "u1"), ("a", "u1")])
        s = set(zip(r["x"].tolist(), r["y"].tolist()))
        if prev: dif.append(len(s ^ prev) / max(len(s), 1))
        prev = s
    return np.mean(dif), np.max(dif)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; hoja = "--hoja" in sys.argv
    clips = args or sorted(p.name for p in SEQ.iterdir() if p.is_dir())
    for c in clips:
        tramar(c, hoja); print("  titileo medio/max", *[f"{v:.3f}" for v in titileo(c)])
