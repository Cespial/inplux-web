"""Escenas 3D del símbolo en Blender (Cycles, Metal). Se ejecuta sin interfaz:

  blender -b -P tres_d.py -- reveal [--previa]      3,43→4,71 s: de cenital plano a 3/4 (39 cuadros)
  blender -b -P tres_d.py -- macro                  la barra de vidrio teal de cerca, retrocede (26 cuadros)
  blender -b -P tres_d.py -- marmol                 símbolo grabado en mármol negro, luz rasante (13 cuadros)
  blender -b -P tres_d.py -- vuelta                 3/4 → cenital plano de 170 px (13 cuadros)

Unidades = unidades del símbolo (caja 100). Y del símbolo (hacia abajo) = -Y de Blender.
Salida: out/3d/<escena>/NNNN.png (RGBA, fondo transparente: montar.py lo pone sobre el lienzo).
Cámara con sensor vertical de 36 mm: el alto visible a distancia d es d·36/lente (o `ortho_scale`).
El ancla (540, 1010) se logra con shift_y = 50/1920.
"""
import math, sys
from pathlib import Path
import bpy
from mathutils import Vector

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D))
from geometria import BARRAS, BW, BH, R, X0, Y0, X1, Y1, estadio  # noqa: E402

W, H = 1080, 1920
GROSOR = 4.0
ALTURAS = [0.0, 3.0, 6.0]                 # z de cada barra, de abajo arriba (flotan)
CENTRO = Vector((50.0, -45.5, 3.0 + GROSOR / 2))
IVORY, TEAL = (0.93, 0.89, 0.83), (0.0075, 0.716, 0.552)   # lineal de #f6f2ec y #15dcc4
import os
VID_T = float(os.environ.get("VID_T", .2)); VID_E = float(os.environ.get("VID_E", .3))
KICK = float(os.environ.get("KICK", 0)); VID_R = float(os.environ.get("VID_R", .18))


def alto_vista(alto_px):
    """Alto visible (unidades) para que la caja de 49 u mida `alto_px` en 1920 px."""
    return 49.0 * H / alto_px


def ease_io(u):
    u = min(1.0, max(0.0, u)); return 4 * u ** 3 if u < .5 else 1 - (-2 * u + 2) ** 3 / 2


# ------------------------------------------------------------------ escena base
def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.refresh_devices()
    for d in prefs.devices:
        d.use = d.type == "METAL"
    sc.cycles.device = "GPU"
    sc.cycles.samples = 96
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.render.use_motion_blur = False
    # mundo: gris frío tenue para los reflejos (no se ve: fondo transparente)
    w = bpy.data.worlds.new("Mundo"); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.05, 0.055, 0.06, 1); bg.inputs[1].default_value = 1.0
    return sc


def material_metal():
    m = bpy.data.materials.new("Metal"); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.17, 0.17, 0.175, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.24
    p.inputs["Anisotropic"].default_value = 0.65
    p.inputs["Coat Weight"].default_value = 0.25
    return m


def material_vidrio():
    m = bpy.data.materials.new("VidrioTeal"); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*TEAL, 1)
    p.inputs["Metallic"].default_value = 0.0
    p.inputs["Roughness"].default_value = VID_R
    p.inputs["IOR"].default_value = 1.5
    p.inputs["Transmission Weight"].default_value = VID_T
    p.inputs["Emission Color"].default_value = (*TEAL, 1)
    p.inputs["Emission Strength"].default_value = VID_E
    return m


def material_marmol():
    m = bpy.data.materials.new("Marmol"); m.use_nodes = True
    nt = m.node_tree; p = nt.nodes["Principled BSDF"]
    noise = nt.nodes.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 0.012
    coord = nt.nodes.new("ShaderNodeTexCoord"); nt.links.new(coord.outputs["Object"], noise.inputs["Vector"])
    noise.inputs["Detail"].default_value = 5; noise.inputs["Roughness"].default_value = 0.72
    noise.inputs["Distortion"].default_value = 0.8
    rampa = nt.nodes.new("ShaderNodeValToRGB"); el = rampa.color_ramp.elements
    el[0].position = 0.485; el[0].color = (0.010, 0.010, 0.011, 1)
    el[1].position = 0.515; el[1].color = (0.010, 0.010, 0.011, 1)
    v = el.new(0.5); v.color = (0.22, 0.215, 0.20, 1)
    nt.links.new(noise.outputs["Fac"], rampa.inputs["Fac"])
    nt.links.new(rampa.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = 0.32
    p.inputs["Coat Weight"].default_value = 0.35
    p.inputs["Coat Roughness"].default_value = 0.12
    return m


def barra(i, z, mat, grosor=GROSOR, bisel=0.5, escala=1.0, nombre=None):
    """Malla de la barra i: estadio extruido `grosor` hacia arriba desde z, con bisel en las aristas."""
    import bmesh
    pts = estadio(i, n=18)[:-1]
    bm = bmesh.new()
    cx, cy = BARRAS[i][0] + BW / 2, BARRAS[i][1] + BH / 2
    vs = [bm.verts.new((cx + (x - cx) * escala, -(cy + (y - cy) * escala), z)) for x, y in pts]
    cara = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[cara])
    arriba = [g for g in r["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=arriba, vec=(0, 0, grosor))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre or f"Barra{i}"); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(me.name, me); bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    if bisel > 0:
        b = ob.modifiers.new("Bisel", "BEVEL"); b.width = bisel; b.segments = 5; b.limit_method = "ANGLE"
        b.angle_limit = math.radians(40)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    except Exception:
        bpy.ops.object.shade_smooth()
    ob.select_set(False)
    return ob


def simbolo_3d(metal, vidrio, z0=0.0):
    return [barra(i, z0 + ALTURAS[i], vidrio if i == 2 else metal) for i in range(3)]


def luces(teal_atras=True):
    def area(nombre, pos, mira, energia, tam, color=(1, 1, 1)):
        l = bpy.data.lights.new(nombre, "AREA"); l.energy = energia; l.size = tam[0]; l.size_y = tam[1]
        l.shape = "RECTANGLE"; l.color = color
        ob = bpy.data.objects.new(nombre, l); bpy.context.collection.objects.link(ob)
        ob.location = pos
        ob.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
        return ob
    principal = area("Principal", (-60, 40, 160), CENTRO, 420000, (160, 50), (0.92, 0.95, 1.0))
    relleno = area("Relleno", (150, -140, 90), CENTRO, 60000, (90, 90), (0.8, 0.85, 0.9))
    if teal_atras:
        area("Kicker", (60, 70, 30), CENTRO, KICK, (60, 20), (0.1, 0.9, 0.8))
    return principal, relleno


def camara(sc):
    cd = bpy.data.cameras.new("Cam"); cd.sensor_fit = "VERTICAL"; cd.sensor_height = 36.0
    cd.shift_y = 50.0 / H
    cd.clip_end = 5000
    cam = bpy.data.objects.new("Cam", cd); bpy.context.collection.objects.link(cam); sc.camera = cam
    return cam


def poner_camara(cam, objetivo, tilt, azim, alto_vis, lente=None):
    """Cámara a `tilt` grados de la vertical, girada `azim` alrededor de Z, viendo `alto_vis` unidades de alto.
    Con `lente` None es ortográfica cenital."""
    cd = cam.data
    if lente is None:
        cd.type = "ORTHO"; cd.ortho_scale = alto_vis
        cam.location = objetivo + Vector((0, 0, 400)); cam.rotation_euler = (0, 0, 0)
        return
    cd.type = "PERSP"; cd.lens = lente
    d = alto_vis * lente / 36.0
    th, ph = math.radians(tilt), math.radians(azim)
    pos = objetivo + Vector((math.sin(th) * math.sin(ph), -math.sin(th) * math.cos(ph), math.cos(th))) * d
    cam.location = pos
    cam.rotation_euler = (objetivo - pos).to_track_quat("-Z", "Y").to_euler()


def render(sc, ruta):
    sc.render.filepath = str(ruta); bpy.ops.render.render(write_still=True)


# ------------------------------------------------------------------ escenas
def reveal(cuadros, out, previa):
    """Cuadro 0 = cenital ortográfica a 440 px (idéntica al 2D); luego perspectiva que baja a 3/4."""
    sc = limpiar(); metal, vidrio = material_metal(), material_vidrio()
    simbolo_3d(metal, vidrio); principal, _ = luces(); cam = camara(sc)
    sel = [0, cuadros // 2, cuadros - 1] if previa else range(cuadros)
    for k in sel:
        u = ease_io(k / (cuadros - 1))
        if k == 0:
            poner_camara(cam, CENTRO, 0, 0, alto_vista(440))
        else:
            lente = 300 + (50 - 300) * u
            poner_camara(cam, CENTRO, 52 * u, -30 * u, alto_vista(440) * (1 + .08 * u), lente)
        principal.location.x = -140 + 260 * u            # barrido de luz
        render(sc, out / f"{k:04d}.png")


def macro(cuadros, out, previa):
    """Empieza pegada a la barra de vidrio teal y retrocede hasta ver las tres placas en 3/4."""
    sc = limpiar(); metal, vidrio = material_metal(), material_vidrio()
    simbolo_3d(metal, vidrio); luces(); cam = camara(sc)
    cima = Vector((BARRAS[2][0] + BW * .78, -(BARRAS[2][1] + BH / 2), ALTURAS[2] + GROSOR * .5))
    sel = [0, cuadros // 2, cuadros - 1] if previa else range(cuadros)
    for k in sel:
        u = ease_io(k / (cuadros - 1))
        obj = cima.lerp(CENTRO, u)
        poner_camara(cam, obj, 58 - 10 * u, 40 - 70 * u, 46 + (alto_vista(200) - 46) * u, 85 - 30 * u)
        render(sc, out / f"{k:04d}.png")


def marmol(cuadros, out, previa):
    """Losa de mármol negro con el símbolo grabado 1,5 u; la barra superior lleva vidrio teal incrustado.
    Luz rasante que se desplaza."""
    sc = limpiar(); metal, vidrio, marm = material_metal(), material_vidrio(), material_marmol()
    bpy.ops.mesh.primitive_cube_add(size=1, location=(50, -45.5, -6))
    losa = bpy.context.active_object; losa.scale = (1400, 1400, 12); losa.data.materials.append(marm)
    bpy.ops.object.transform_apply(scale=True)
    for i in range(3):                       # incrustaciones a ras: metal pulido y vidrio teal
        barra(i, -1.0, vidrio if i == 2 else metal, grosor=1.25, bisel=0.25, nombre=f"Incrustacion{i}")
    luz = luces(teal_atras=False)[0]
    cam = camara(sc)
    sel = [0, cuadros - 1] if previa else range(cuadros)
    for k in sel:
        u = k / max(1, cuadros - 1)
        poner_camara(cam, Vector((50, -45.5, 0)), 34, -18 + 6 * u, alto_vista(170) * 1.05, 70)
        luz.location = (-220 + 60 * u, -60, 40 + 10 * u); luz.data.energy = 420000
        luz.rotation_euler = (Vector((50, -45.5, 0)) - luz.location).to_track_quat("-Z", "Y").to_euler()
        render(sc, out / f"{k:04d}.png")


def vuelta(cuadros, out, previa):
    """De 3/4 a cenital casi ortográfica con el símbolo de 170 px: el último cuadro empalma con el 2D."""
    sc = limpiar(); metal, vidrio = material_metal(), material_vidrio()
    simbolo_3d(metal, vidrio); luces(); cam = camara(sc)
    sel = [0, cuadros - 1] if previa else range(cuadros)
    for k in sel:
        u = ease_io(k / (cuadros - 1))
        lente = 50 + (300 - 50) * u
        poner_camara(cam, CENTRO, 48 * (1 - u), -30 * (1 - u), alto_vista(170) * (1.0 + .0 * u), lente)
        render(sc, out / f"{k:04d}.png")


ESCENAS = {"reveal": (reveal, 39), "macro": (macro, 26), "marmol": (marmol, 13), "vuelta": (vuelta, 13)}

if __name__ == "__main__":
    args = sys.argv[sys.argv.index("--") + 1:]
    nombre = args[0]; previa = "--previa" in args
    fn, n = ESCENAS[nombre]
    out = D / "out/3d" / (nombre + ("_previa" if previa else "")); out.mkdir(parents=True, exist_ok=True)
    fn(n, out, previa)
    if previa:
        sc = bpy.context.scene
    print("listo", nombre, out)
