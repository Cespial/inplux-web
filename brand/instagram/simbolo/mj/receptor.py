"""Receptor local para traer imágenes de Midjourney (o ChatGPT) desde la pestaña del navegador,
sin pasar por ~/Downloads (la terminal no puede leerla). Receta de la memoria chatgpt-imagenes-sin-descargas.

  python3 mj/receptor.py            imprime la ficha; escucha en 127.0.0.1:8766
En la pestaña: fetch(img.src) → blob → DataTransfer → <form method=POST enctype=multipart/form-data
action=http://127.0.0.1:8766/form/<ficha> target=_blank> → submit().

Solo acepta origen midjourney.com o chatgpt.com, archivos PNG/JPG/WEBP cuyo nombre empiece por «mj-»,
y nunca sobrescribe. Apagar con Ctrl+C al terminar.
"""
import secrets, sys
from email.parser import BytesParser
from email.policy import HTTP
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

D = Path(__file__).resolve().parent / "originales"; D.mkdir(exist_ok=True)
FICHA = secrets.token_urlsafe(12)
MAGIA = {b"\x89PNG": ".png", b"\xff\xd8\xff": ".jpg", b"RIFF": ".webp"}


class H(BaseHTTPRequestHandler):
    def _fin(self, code, msg):
        self.send_response(code); self._cors(); self.send_header("Content-Type", "text/plain; charset=utf-8"); self.end_headers()
        self.wfile.write(msg.encode()); print(code, msg, flush=True)

    def _cors(self):
        o = self.headers.get("Origin", "")
        if o in ("https://www.midjourney.com", "https://midjourney.com", "https://chatgpt.com"):
            self.send_header("Access-Control-Allow-Origin", o)
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Access-Control-Allow-Private-Network", "true")

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def _guardar(self, nombre, datos):
        nombre = Path(nombre).name
        ext = next((e for m, e in MAGIA.items() if datos[:len(m)] == m), None)
        if not nombre.startswith("mj-") or ext is None or len(datos) > 40_000_000:
            return f"rechazado {nombre}"
        destino = D / (Path(nombre).stem + ext)
        if destino.exists():
            return f"ya existe {destino.name}"
        destino.write_bytes(datos)
        return None

    def do_POST(self):
        origen = self.headers.get("Origin", "")
        if not (origen.endswith("midjourney.com") or origen.endswith("chatgpt.com")):
            return self._fin(403, "origen no permitido")
        if self.path.startswith(f"/crudo/{FICHA}/"):
            n = int(self.headers.get("Content-Length", 0))
            if n > 40_000_000:
                return self._fin(413, "demasiado grande")
            nombre = self.path.rsplit("/", 1)[1]
            err = self._guardar(nombre, self.rfile.read(n))
            return self._fin(400 if err else 200, err or f"guardado {nombre}")
        if self.path != f"/form/{FICHA}":
            return self._fin(403, "ficha incorrecta")
        n = int(self.headers.get("Content-Length", 0))
        if n > 200_000_000:
            return self._fin(413, "demasiado grande")
        cuerpo = self.rfile.read(n)
        msg = BytesParser(policy=HTTP).parsebytes(
            b"Content-Type: " + self.headers.get("Content-Type", "").encode() + b"\r\n\r\n" + cuerpo)
        guardados = []
        for parte in msg.iter_parts():
            nombre = parte.get_filename()
            if not nombre:
                continue
            nombre = Path(nombre).name
            datos = parte.get_payload(decode=True) or b""
            ext = next((e for m, e in MAGIA.items() if datos[:len(m)] == m), None)
            if not nombre.startswith("mj-") or ext is None or len(datos) > 40_000_000:
                return self._fin(400, f"rechazado {nombre}")
            destino = D / (Path(nombre).stem + ext)
            if destino.exists():
                return self._fin(409, f"ya existe {destino.name}")
            destino.write_bytes(datos); guardados.append(destino.name)
        self._fin(200, "guardado " + ", ".join(guardados))

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print("ficha:", FICHA, "\ncarpeta:", D, flush=True)
    try:
        HTTPServer(("127.0.0.1", 8766), H).serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
