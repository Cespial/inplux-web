"""Bitácora real de una corrida de nuestra torre de propuestas (11 agentes, 17-oct-2026).

Lee la corrida guardada por el orquestador (`~/cco-ofertas/public/cco/casos/samc-014-2026.json`) y
la imprime como registro: paso, inicio, duración, tokens de entrada y salida, estado.
Hecho verificable: los agentes NO tienen herramientas (api/*.ts: cero `tools`); solo reciben texto y
devuelven texto. El registro lo escribe el orquestador (public/cco/index.html, `E.pasos[clave]`),
fuera del alcance del agente. Por eso un agente no puede apagar ni editar su propia bitácora.
"""
import json, sys
from pathlib import Path

CASO = Path.home() / "cco-ofertas/public/cco/casos/samc-014-2026.json"
NOMBRES = {"forense-a": "lectura forense A", "forense-b": "lectura forense B", "equipo": "equipo mínimo",
           "gate": "gate GO / NO-GO", "prop-s1": "propuesta §1", "prop-s2": "propuesta §2", "prop-s3": "propuesta §3",
           "prop-s4": "propuesta §4", "prop-s5": "propuesta §5", "prop-s6": "propuesta §6", "redteam": "red team"}
INICIO = {"forense-a": "fa", "forense-b": "fb", "equipo": "eq", "gate": "gate", "prop-s1": "red1", "prop-s2": "red2",
          "prop-s3": "red3", "prop-s4": "red4", "prop-s5": "red5", "prop-s6": "red6", "redteam": "rt"}


def filas():
    d = json.loads(CASO.read_text())
    t = d["tiempos"]
    out = []
    for clave, p in d["pasos"].items():
        ini = t.get(INICIO.get(clave, ""), {}).get("ini")
        uso = p.get("uso") or {}
        out.append(dict(paso=clave, nombre=NOMBRES.get(clave, clave), ini_s=None if ini is None else ini / 1000,
                        ms=p["ms"], entrada=uso.get("entrada"), salida=uso.get("salida"),
                        estado=t.get(INICIO.get(clave, ""), {}).get("estado", "ok")))
    tot_in = sum(f["entrada"] or 0 for f in out); tot_out = sum(f["salida"] or 0 for f in out)
    return d["creado"], out, tot_in, tot_out, d["controles"]


if __name__ == "__main__":
    creado, fs, ti, to, controles = filas()
    print(f"corrida {creado}  agentes {len(fs)}  tokens entrada {ti:,}  salida {to:,}".replace(",", "."))
    for f in fs:
        ini = "" if f["ini_s"] is None else f"{f['ini_s']:6.1f}s"
        print(f"{f['paso']:<10} {ini:>7} {f['ms']/1000:6.1f}s  in {f['entrada'] or 0:>7,}  out {f['salida'] or 0:>5,}  {f['estado']}".replace(",", "."))
    print("controles:", sum(c["ok"] for c in controles), "/", len(controles), "ok")
    if "--json" in sys.argv:
        print(json.dumps(fs, ensure_ascii=False))
