"""Música y efectos de «Tres oficios» con ElevenLabs (caché por hash en audio/)."""
import json, urllib.request, hashlib, sys
from pathlib import Path
D = Path(__file__).parent; A = D / "audio"; A.mkdir(exist_ok=True)
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]

def post(url, body, timeout=400):
    req = urllib.request.Request(url, method="POST", headers={"xi-api-key": KEY, "content-type": "application/json"}, data=json.dumps(body).encode())
    return urllib.request.urlopen(req, timeout=timeout).read()

MUSICA = {
 "c": ("Instrumental hard phonk and epic trailer hybrid at exactly 150 BPM, heavy distorted 808 and kick on every beat from the very first beat, "
       "cowbell melody, taiko drums, dramatic strings and choir, structured in three rising stages each about 8 seconds with a bigger lift at each stage, "
       "relentless, no breakdown, no vocals, big final impact hit at 33 seconds then silence."),
 "d": ("Instrumental dark cinematic techno at exactly 150 BPM, hard four-on-the-floor kick from the first beat, rolling sub bass, stone-hall reverb, "
       "orchestral brass stabs and choir swells rising in three stages of 8 seconds, each stage bigger, driving and modern, no vocals, final impact at 33 seconds."),
}
EFECTOS = {
 "cincel": ("single sharp chisel strike on marble, stone chip, short dry hit", 0.5),
 "piedra": ("heavy stone block settling into place with a deep thud and grit", 0.8),
 "agua": ("water starting to rush through a stone aqueduct channel, flowing, rising", 1.6),
 "estilete": ("stylus scratching quickly on wax tablet, short pen scribble", 0.6),
 "multitud": ("crowd murmur in a stone amphitheater growing louder, rising applause at the end", 3.2),
 "final": ("massive cinematic impact hit with long sub tail and stone debris", 2.0),
}
for k, p in MUSICA.items():
    f = A / f"musica_{k}_{hashlib.md5(p.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f.name); continue
    try: f.write_bytes(post("https://api.elevenlabs.io/v1/music", {"prompt": p, "music_length_ms": 35000})); print("ok", f.name, f.stat().st_size)
    except Exception as e: print("ERROR musica", k, e)
for k, (p, s) in EFECTOS.items():
    f = A / f"sfx_{k}_{hashlib.md5(f'{p}|{s}'.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f.name); continue
    try: f.write_bytes(post("https://api.elevenlabs.io/v1/sound-generation", {"text": p, "duration_seconds": s, "prompt_influence": 0.5}, 200)); print("ok", f.name)
    except Exception as e: print("ERROR sfx", k, e)
