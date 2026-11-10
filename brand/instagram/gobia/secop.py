#!/usr/bin/env python3
"""Baja de datos.gov.co (SECOP II · Contratos Electrónicos, jbjy-vk9h) las cifras de
contratación territorial que usan los reels de Gobia y las guarda con fecha de corte.

    python3 secop.py                 # panorama nacional territorial del año
    python3 secop.py "MEDELLÍN"      # además, ficha de las entidades de esa ciudad

Los valores en pesos del conjunto traen errores de digitación (contratos de mínima
cuantía por billones): los rótulos usan CONTEOS y medianas, no sumas, salvo revisión manual.
"""
import json, sys, datetime, urllib.parse, urllib.request, pathlib

BASE = "https://www.datos.gov.co/resource/jbjy-vk9h.json"
ANIO = 2026
HOY = datetime.date.today().isoformat()
DESDE = f"fecha_de_firma >= '{ANIO}-01-01T00:00:00' and fecha_de_firma < '{ANIO+1}-01-01T00:00:00'"
OUT = pathlib.Path(__file__).parent / "datos"


def q(soql):
    url = BASE + "?" + urllib.parse.urlencode({"$query": soql})
    with urllib.request.urlopen(url, timeout=180) as r:
        return json.load(r)


def panorama(filtro, etiqueta):
    w = f"{DESDE} and {filtro}"
    d = {"corte_consulta": HOY, "anio": ANIO, "filtro": filtro, "fuente": BASE}
    d["total"] = q(f"select count(*) as n, max(fecha_de_firma) as ultima_firma where {w}")[0]
    d["modalidad"] = q(f"select modalidad_de_contratacion as k, count(*) as n where {w} group by k order by n desc limit 15")
    d["tipo"] = q(f"select tipo_de_contrato as k, count(*) as n where {w} group by k order by n desc limit 10")
    d["mes"] = q(f"select date_trunc_ym(fecha_de_firma) as k, count(*) as n where {w} group by k order by k")
    d["directa_ps"] = q(f"select count(*) as n where {w} and modalidad_de_contratacion='Contratación directa' and tipo_de_contrato='Prestación de servicios'")[0]
    (OUT / f"{etiqueta}-{HOY}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1))
    return d


def resumen(d, titulo):
    n = int(d["total"]["n"])
    print(f"\n== {titulo} · {ANIO} · consulta {HOY} · última firma {d['total'].get('ultima_firma','')[:10]}")
    print(f"contratos: {n:,}".replace(",", "."))
    for r in d["modalidad"][:6]:
        print(f"  {r.get('k','?'):55s} {int(r['n']):>8,} {100*int(r['n'])/n:5.1f} %".replace(",", "."))
    print("  tipo:", ", ".join(f"{r.get('k','?')} {100*int(r['n'])/n:.1f} %" for r in d["tipo"][:4]))
    print(f"  directa + prestación de servicios: {int(d['directa_ps']['n']):,} ({100*int(d['directa_ps']['n'])/n:.1f} %)".replace(",", "."))
    print("  por mes:", " ".join(f"{r['k'][5:7]}:{int(r['n'])//1000}k" if n > 50000 else f"{r['k'][5:7]}:{r['n']}" for r in d["mes"]))


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    resumen(panorama("orden='Territorial'", "territorial"), "Entidades territoriales")
    for ciudad in sys.argv[1:]:
        c = ciudad.replace("'", "''")
        f = f"orden='Territorial' and upper(ciudad)=upper('{c}')"
        d = panorama(f, "ciudad-" + ciudad.lower().replace(" ", "-"))
        d["entidades"] = q(f"select nombre_entidad as k, count(*) as n where {DESDE} and {f} group by k order by n desc limit 8")
        resumen(d, ciudad)
        for r in d["entidades"]:
            print(f"    {r['k'][:60]:60s} {r['n']}")
