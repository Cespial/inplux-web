"""Efectos con ElevenLabs /v1/sound-generation (caché en audio/)."""
import json, urllib.request, hashlib
from pathlib import Path
D = Path(__file__).parent; A = D / "audio"
KEY = [l.split("=", 1)[1].strip() for l in (Path.home() / ".config/inplux/elevenlabs.env").read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")][0]
EFECTOS = {
 "impacto": ("deep cinematic sub boom impact with a sharp marble stone crack, short tail", 1.2),
 "arena": ("fast whoosh of dry sand particles swirling through the air, airy, rising", 0.8),
 "brillo": ("short digital shimmer chime, glassy, clean, modern interface sound", 0.6),
 "estalla": ("marble statue shattering into fine sand, granular burst, short", 1.0),
 "golpe": ("single tight cinematic hit, punchy low thump, very short", 0.5),
}
for k, (p, s) in EFECTOS.items():
    f = A / f"sfx_{k}_{hashlib.md5(f'{p}|{s}'.encode()).hexdigest()[:8]}.mp3"
    if f.exists(): print("ya", f.name); continue
    req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation", method="POST",
          headers={"xi-api-key": KEY, "content-type": "application/json"},
          data=json.dumps({"text": p, "duration_seconds": s, "prompt_influence": 0.5}).encode())
    try: f.write_bytes(urllib.request.urlopen(req, timeout=200).read()); print("ok", f.name)
    except Exception as e: print("ERROR", k, e)
