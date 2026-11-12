"""Voz en off de «Tres oficios» v2 (ElevenLabs texto a voz, eleven_multilingual_v2). Caché por hash en audio/.
    python3 voz_el.py prueba          # frase de gancho con las 3 voces candidatas
    python3 voz_el.py todo <voice_id> # las frases del guion con la voz elegida
"""
import hashlib, json, sys, urllib.request
from pathlib import Path
D = Path(__file__).parent; A = D / "audio"; A.mkdir(exist_ok=True)
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]
CANDIDATAS = {"profunda": "mUi4Dcd9vce2s8KeASWs", "carlos-co": "Y4HwpMNrBWN5dFKi5Lw8", "carlos-latam": "HS2CYGdwIZKfFA3zZ6Jp"}
FRASES = {
    "f1": "Los romanos construían para durar dos mil años.",
    "f2": "Nosotros también.",
    "f2b": "Construimos igual.",
    "f3": "Del primer flujo... al día en que opera solo.",
    "f4": "Seis productos propios. Cada uno nacido de un problema concreto.",
    "f5": "Y enseñamos con las mismas herramientas que usamos para construir.",
    "f6": "La IA acelera el trabajo. El criterio humano conserva la dirección.",
}
AJ = dict(stability=0.42, similarity_boost=0.8, style=0.35, use_speaker_boost=True, speed=0.92)


def decir(texto, voz, nombre):
    h = hashlib.md5(f"{texto}|{voz}|{AJ}".encode()).hexdigest()[:8]; f = A / f"voz_{nombre}_{h}.mp3"
    if f.exists(): return f
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voz}", method="POST",
        headers={"xi-api-key": KEY, "content-type": "application/json"},
        data=json.dumps({"text": texto, "model_id": "eleven_multilingual_v2", "language_code": "es", "voice_settings": AJ}).encode())
    f.write_bytes(urllib.request.urlopen(req, timeout=120).read()); return f


if __name__ == "__main__":
    if sys.argv[1] == "prueba":
        for n, v in CANDIDATAS.items():
            print(decir(FRASES["f1"], v, f"prueba-{n}-f1").name, decir(FRASES["f2"], v, f"prueba-{n}-f2").name)
    else:
        v = sys.argv[2]
        for k, t in FRASES.items(): print(decir(t, v, k).name)
