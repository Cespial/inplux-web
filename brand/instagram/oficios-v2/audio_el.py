"""Música (40 s) y efectos nuevos de «Tres oficios» v2 con ElevenLabs. Caché por hash en audio/."""
import json, urllib.request, hashlib
from pathlib import Path
D = Path(__file__).parent; A = D / "audio"; A.mkdir(exist_ok=True)
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]

def post(url, body, timeout=400):
    req = urllib.request.Request(url, method="POST", headers={"xi-api-key": KEY, "content-type": "application/json"}, data=json.dumps(body).encode())
    return urllib.request.urlopen(req, timeout=timeout).read()

MUSICA = {
 "e": ("Cinematic trailer music at exactly 150 BPM. Cold open: 3 seconds of quiet tension with a low sub drone and a ticking hi-hat, then a massive drop at 3.2 seconds "
       "with distorted 808, kick on every beat, taiko drums, cowbell phonk melody, dramatic strings and choir. Three rising acts of about 8 seconds each, every act bigger. "
       "A sudden half-beat of total silence at 25.4 seconds followed by the biggest lift, then a huge final impact hit at 37 seconds and a short tail. No vocals."),
 "f": ("Hard phonk and epic orchestral hybrid trailer at exactly 150 BPM. Quiet cold open of 3 seconds with only a low drone and a chisel-like tick, then a brutal drop "
       "at 3.2 seconds: heavy 808, four-on-the-floor kick, brass stabs, choir, taiko. Three stages each 8 seconds rising, a complete silence at 25.4 seconds for half a beat, "
       "then the climax, and a final impact at 37 seconds with silence after. No vocals."),
}
EFECTOS = {
 "riser": ("cinematic riser whoosh building for two seconds into a hit", 2.2),
 "sub": ("deep sub bass drop boom with long tail", 2.5),
 "reverse": ("reverse cymbal swell rising into a cut", 1.6),
 "aire": ("short air whoosh, camera move swish", 0.7),
 "viento": ("cold wind blowing through stone arches at night, low and steady", 4.0),
 "respiracion": ("single slow deep breath in, cinematic, close", 1.8),
 "ovacion": ("crowd in a stone amphitheater erupts into applause and cheering, big reverb", 3.5),
 "tecleo": ("fast keyboard typing on a phone, short burst", 1.2),
 "marmol": ("heavy marble slab sliding and locking into place with stone grind", 1.4),
}
for k, p in MUSICA.items():
    f = A / f"musica_{k}_{hashlib.md5(p.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f.name); continue
    try: f.write_bytes(post("https://api.elevenlabs.io/v1/music", {"prompt": p, "music_length_ms": 40000})); print("ok", f.name, f.stat().st_size)
    except Exception as e: print("ERROR musica", k, e)
for k, (p, s) in EFECTOS.items():
    f = A / f"sfx_{k}_{hashlib.md5(f'{p}|{s}'.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f.name); continue
    try: f.write_bytes(post("https://api.elevenlabs.io/v1/sound-generation", {"text": p, "duration_seconds": s, "prompt_influence": 0.5}, 200)); print("ok", f.name)
    except Exception as e: print("ERROR sfx", k, e)
