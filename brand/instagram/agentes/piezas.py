"""Lee la portada de inplux.co en producción y exporta las piezas que los agentes van a colocar.

Salida en out/:
  piezas.json     piezas hoja (texto, botones, imágenes) y fondos (secciones, tarjetas), bbox en px CSS
  fondos.png      la página con las piezas hoja ocultas (solo fondos), a escala ESC
  final.png       la página completa, a escala ESC
  hero.png        el hero a escala 1,5 para el cierre legible

Uso: python3 piezas.py
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

D = Path(__file__).parent
OUT = D / "out"
URL = "https://inplux.co"
ANCHO = 1440
ESC = 0.6

PREPARAR = r"""
async () => {
  // fuera lo que no es la página: avisos fijos laterales, enlace de salto
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && !el.closest('header')) el.style.display = 'none';
  }
  document.querySelectorAll('a[href="#main"],a[href="#contenido"],.skip-link').forEach(e => e.style.display = 'none');
  const css = document.createElement('style');
  css.textContent = '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important}';
  document.head.appendChild(css);
  for (const v of document.querySelectorAll('video')) {
    try { v.muted = true; v.currentTime = 2.0; v.pause(); } catch (e) {}
  }
  await document.fonts.ready;
}
"""

MARCAR = r"""
() => {
  const TEXTO = new Set(['H1','H2','H3','H4','H5','H6','P','LI','BUTTON','A','BLOCKQUOTE','FIGCAPTION','LABEL','DT','DD','SMALL','TD','TH']);
  const MEDIO = new Set(['IMG','SVG','CANVAS','PICTURE','INPUT','TEXTAREA','IFRAME']);
  const piezas = [], fondos = [];
  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 6 && r.height >= 6 && r.bottom + scrollY > 0;
  };
  const caja = el => { const r = el.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height]; };
  const textoPropio = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
  const tieneFondo = el => {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const color = bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg);
    const img = cs.backgroundImage && cs.backgroundImage !== 'none';
    const borde = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
    return color || img || borde;
  };
  const anda = (el, prof) => {
    if (!visible(el)) return;
    const tag = el.tagName.toUpperCase();
    if (tag === 'VIDEO') return;  // el video del hero es fondo
    // una pieza hoja: bloque de texto, medio, o caja con texto propio y pocos hijos
    const esLi = tag === 'LI' && el.querySelectorAll('img,video,svg,h2,h3,h4').length > 1;
    if (MEDIO.has(tag) || (TEXTO.has(tag) && !esLi && el.getBoundingClientRect().height < 420) || (textoPropio(el) && el.children.length <= 3)) {
      const [x, y, w, h] = caja(el);
      piezas.push({tag, x, y, w, h, prof, texto: (el.innerText || el.getAttribute('alt') || '').trim().slice(0, 50)});
      el.setAttribute('data-pieza', piezas.length - 1);
      return;
    }
    const [x, y, w, h] = caja(el);
    if (prof > 0 && w * h > 2500 && tieneFondo(el)) fondos.push({tag, x, y, w, h, prof});
    for (const hijo of el.children) anda(hijo, prof + 1);
  };
  anda(document.body, 0);
  return {alto: document.documentElement.scrollHeight, piezas, fondos};
}
"""


def main():
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        ctx = b.new_context(viewport={"width": ANCHO, "height": 900}, device_scale_factor=ESC, locale="es-CO")
        pg = ctx.new_page()
        pg.goto(URL, wait_until="networkidle", timeout=90000)
        alto = pg.evaluate("document.documentElement.scrollHeight")
        for y in range(0, alto, 700):  # carga perezosa
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(80)
        pg.evaluate("window.scrollTo(0,0)")
        pg.set_viewport_size({"width": ANCHO, "height": alto})
        pg.wait_for_timeout(2500)
        pg.evaluate(PREPARAR)
        pg.wait_for_timeout(1500)
        info = pg.evaluate(MARCAR)
        print("alto", info["alto"], "piezas", len(info["piezas"]), "fondos", len(info["fondos"]))
        pg.screenshot(path=str(OUT / "final.png"), clip={"x": 0, "y": 0, "width": ANCHO, "height": info["alto"]})
        pg.add_style_tag(content="[data-pieza]{visibility:hidden!important}")
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT / "fondos.png"), clip={"x": 0, "y": 0, "width": ANCHO, "height": info["alto"]})
        # cierre legible: hero a escala 1,5
        ctx2 = b.new_context(viewport={"width": ANCHO, "height": 1000}, device_scale_factor=1.5, locale="es-CO")
        p2 = ctx2.new_page(); p2.goto(URL, wait_until="networkidle", timeout=90000)
        p2.wait_for_timeout(1500); p2.evaluate(PREPARAR); p2.wait_for_timeout(1200)
        p2.screenshot(path=str(OUT / "hero.png"))
        b.close()
    info["esc"] = ESC; info["ancho"] = ANCHO
    (OUT / "piezas.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
