"""Pide a ElevenLabs /v1/music una pista a 150 BPM (caché en audio/)."""
import json, urllib.request, hashlib
from pathlib import Path
D = Path(__file__).parent; A = D / "audio"; A.mkdir(exist_ok=True)
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]
PROMPTS = {
 "a": ("Instrumental dark cinematic techno at exactly 150 BPM, four-on-the-floor hard kick from the very first beat, "
       "deep rolling sub bass, tight off-beat hi-hats, epic choir stabs and orchestral brass hits like a Roman temple, "
       "short riser and impact drop at 3 seconds, relentless driving energy, punchy and modern, no vocals, ends with a big final hit at 28 seconds."),
 "b": ("Instrumental hard phonk and epic trailer hybrid at 150 BPM, heavy distorted 808 and kick on every beat, cowbell melody, "
       "taiko drums, dramatic strings, big drop after the first bar, high energy for a fast cut fashion reel, no vocals, final impact hit at the end."),
}
for k, p in PROMPTS.items():
    f = A / f"musica_{k}_{hashlib.md5(p.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f); continue
    req = urllib.request.Request("https://api.elevenlabs.io/v1/music", method="POST",
          headers={"xi-api-key": KEY, "content-type": "application/json"}, data=json.dumps({"prompt": p, "music_length_ms": 29500}).encode())
    try: f.write_bytes(urllib.request.urlopen(req, timeout=400).read()); print("ok", f, f.stat().st_size)
    except Exception as e: print("ERROR", k, e)
