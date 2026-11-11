"""Burbujas del WhatsApp con IA (capturas del deck de ADELI) con el cliente tapado.
Decisión de Cristian 11-nov: se cubren el nombre del cliente, los lugares y el código de estación; no se usa la burbuja con URL."""
from pathlib import Path
from PIL import Image, ImageDraw
E = Path.home() / "inplux-adeli/deck/assets/evidencia"
O = Path(__file__).parent / "assets/chat"; O.mkdir(parents=True, exist_ok=True)
MARFIL = (246, 242, 236)
# (archivo, caja de la burbuja, [cajas a tapar], nombre, lado)
B = [
 ("whatsapp-menu.png", (48, 8, 562, 345), [(272, 16, 358, 44)], "01-menu", "bot"),          # «Piragua»
 ("whatsapp-menu.png", (1195, 548, 1332, 600), [], "02-uno", "user"),
 ("whatsapp-menu.png", (48, 620, 606, 903), [(257, 731, 341, 757), (425, 763, 526, 790)], "03-ayuda", "bot"),  # Yarumal · Porce
 ("whatsapp-fuentes.png", (748, 12, 1333, 64), [(1122, 18, 1219, 52)], "04-pregunta", "user"),  # Yarumal
 ("whatsapp-fuentes.png", (48, 82, 640, 540), [(87, 95, 174, 122)] + [(107, y0 - 3, x1 + 4, y1 + 3) for y0, y1, x1 in [(169,184,170),(201,219,237),(232,251,224),(265,283,230),(297,316,250),(329,350,201),(362,380,221),(394,412,212),(426,445,238),(459,477,219)]], "05-fuentes", "bot"),
 ("whatsapp-reporte.png", (48, 8, 606, 64), [], "06-menu-otra-vez", "bot"),
]
for f, caja, tapas, n, lado in B:
    im = Image.open(E / f).convert("RGB"); d = ImageDraw.Draw(im)
    for t in tapas: d.rounded_rectangle([t[0], t[1], t[2], t[3]], radius=4, fill=MARFIL)
    c = im.crop(caja); c.save(O / f"{n}.png"); print(n, c.size, lado)
# contact sheet
ims = [Image.open(O / f"{n}.png") for *_, n, _ in B]
S = Image.new("RGB", (max(i.width for i in ims), sum(i.height for i in ims) + 10 * len(ims)), (60, 60, 60)); y = 0
for i in ims: S.paste(i, (0, y)); y += i.height + 10
S.save("/private/tmp/claude-501/-Users-cristianespinal/8d5825fd-d766-424a-b04b-010136a55d69/scratchpad/burbujas.jpg", quality=90)
