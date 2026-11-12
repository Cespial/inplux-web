"""Planos de héroe de «Tres oficios» v2 en Blender (Cycles, Metal), hechos de puntos de verdad en 3D.

  blender -b -P tres_d.py -- acueducto [--previa] [--cuadros 0,60,120]

La obra es una nube de puntos (esferas pequeñas instanciadas) muestreada sobre una geometría procedural: así la trama
del folleto existe en 3D y la cámara tiene parallax, profundidad de campo y niebla volumétrica reales.
La animación (llegada por golpe, agua teal) la hace un manejador de cambio de cuadro que escribe posiciones y atributos
desde numpy: determinista, sin fotogramas clave por punto.

Tiempo: 30 cps, golpe = 12 cuadros (150 BPM). Salida: out/3d/<plano>/NNNN.png (RGB, 1080×1920; previa 540×960).
"""
import math, os, sys
from pathlib import Path
import bpy
import numpy as np
from mathutils import Vector

D = Path(__file__).resolve().parent
W, H, FPS, GOLPE = 1080, 1920, 30, 12
MARFIL, TEAL = (0.92, 0.89, 0.84), (0.0, 0.69, 0.60)          # lineal aprox. de #f6f2ec y #00d7ca
NEGRO = (0.006, 0.006, 0.005)
ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIA = "--previa" in ARGS
MUESTRAS = int(os.environ.get("MUESTRAS", 24 if PREVIA else 64))


def ease_out(u): u = min(1.0, max(0.0, u)); return 1 - (1 - u) ** 3
def ease_io(u): u = min(1.0, max(0.0, u)); return 4 * u ** 3 if u < .5 else 1 - (-2 * u + 2) ** 3 / 2


# ------------------------------------------------------------------ escena base
def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"; prefs.refresh_devices()
    for d in prefs.devices: d.use = d.type == "METAL"
    sc.cycles.device = "GPU"; sc.cycles.samples = MUESTRAS
    sc.cycles.use_denoising = True; sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.volume_step_rate = 4.0 if PREVIA else 2.0
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 50 if PREVIA else 100
    sc.render.fps = FPS
    sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGB"
    sc.view_settings.view_transform = "Standard"; sc.view_settings.exposure = 0.9
    sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5
    w = bpy.data.worlds.new("Mundo"); sc.world = w; w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes["Background"]; bg.inputs[0].default_value = (*NEGRO, 1); bg.inputs[1].default_value = 1.0
    # niebla volumétrica en todo el mundo: los haces de luz se ven
    vol = nt.nodes.new("ShaderNodeVolumePrincipled"); vol.inputs["Density"].default_value = 0.0012
    vol.inputs["Anisotropy"].default_value = 0.55
    nt.links.new(vol.outputs[0], nt.nodes["World Output"].inputs["Volume"])
    return sc


def material_puntos(nombre, color, emision=0.0, atributo_agua=False):
    """Mármol mate para los puntos; si `atributo_agua`, el atributo «agua» (0–1) mezcla hacia teal emisivo."""
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    nt = m.node_tree; p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1); p.inputs["Roughness"].default_value = 0.7
    if emision:
        p.inputs["Emission Color"].default_value = (*color, 1); p.inputs["Emission Strength"].default_value = emision
    if atributo_agua:
        at = nt.nodes.new("ShaderNodeAttribute"); at.attribute_type = "INSTANCER"; at.attribute_name = "agua"
        mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
        mix.inputs["A"].default_value = (*color, 1); mix.inputs["B"].default_value = (*TEAL, 1)
        nt.links.new(at.outputs["Fac"], mix.inputs["Factor"]); nt.links.new(mix.outputs["Result"], p.inputs["Base Color"])
        nt.links.new(mix.outputs["Result"], p.inputs["Emission Color"])
        mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 6.0
        nt.links.new(at.outputs["Fac"], mul.inputs[0]); nt.links.new(mul.outputs[0], p.inputs["Emission Strength"])
    return m


def nube_objeto(nombre, pts, radio, material, atributos=()):
    """Objeto de vértices + Geometry Nodes: Mesh to Points → Instance on Points (icoesfera) con su material."""
    me = bpy.data.meshes.new(nombre); me.vertices.add(len(pts)); me.vertices.foreach_set("co", pts.astype(np.float32).ravel())
    for a in atributos: me.attributes.new(a, "FLOAT", "POINT")
    me.update(); ob = bpy.data.objects.new(nombre, me); bpy.context.scene.collection.objects.link(ob)
    gn = bpy.data.node_groups.new(nombre + "GN", "GeometryNodeTree")
    gn.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    gn.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    n = gn.nodes; L = gn.links
    i, o = n.new("NodeGroupInput"), n.new("NodeGroupOutput")
    m2p = n.new("GeometryNodeMeshToPoints"); m2p.inputs["Radius"].default_value = radio
    ico = n.new("GeometryNodeMeshIcoSphere"); ico.inputs["Radius"].default_value = radio; ico.inputs["Subdivisions"].default_value = 1
    inst = n.new("GeometryNodeInstanceOnPoints")
    sm = n.new("GeometryNodeSetMaterial"); sm.inputs["Material"].default_value = material
    sh = n.new("GeometryNodeSetShadeSmooth")
    L.new(i.outputs[0], m2p.inputs["Mesh"]); L.new(m2p.outputs[0], inst.inputs["Points"])
    L.new(ico.outputs[0], sh.inputs[0]); L.new(sh.outputs[0], sm.inputs[0]); L.new(sm.outputs[0], inst.inputs["Instance"])
    L.new(inst.outputs[0], o.inputs[0])
    md = ob.modifiers.new("Puntos", "NODES"); md.node_group = gn
    return ob


def camara(lente=32, f_stop=None, foco=None):
    cd = bpy.data.cameras.new("Cam"); cd.lens = lente; cd.sensor_fit = "VERTICAL"; cd.sensor_height = 36
    if f_stop:
        cd.dof.use_dof = True; cd.dof.aperture_fstop = f_stop; cd.dof.focus_distance = foco or 10
    c = bpy.data.objects.new("Cam", cd); bpy.context.scene.collection.objects.link(c); bpy.context.scene.camera = c
    return c


def mirar(c, origen, destino):
    c.location = origen; c.rotation_euler = (Vector(destino) - Vector(origen)).to_track_quat("-Z", "Y").to_euler()


def luz(tipo, loc, rot, energia, color=(1, 1, 1), tam=0.2, angulo=None):
    ld = bpy.data.lights.new(tipo, tipo); ld.energy = energia; ld.color = color
    if tipo == "SPOT": ld.spot_size = angulo or math.radians(30); ld.spot_blend = 0.4; ld.shadow_soft_size = tam
    if tipo == "SUN": ld.angle = math.radians(1.5)
    if tipo == "AREA": ld.size = tam
    lo = bpy.data.objects.new(tipo, ld); lo.location = loc; lo.rotation_euler = rot; bpy.context.scene.collection.objects.link(lo)
    return lo


# ------------------------------------------------------------------ acueducto
PASO, ANCHO_PILA, ALTO_PILA, R_ARCO, ALTO_MURO, FONDO = 6.0, 2.2, 11.0, 1.9, 15.2, 2.4
N_ARCOS, SEP = 22, 0.13          # arcos totales; separación de la retícula de puntos (m)
R_PUNTO = SEP * 0.40              # diámetro = 0,80 de la celda, como el folleto


def bloques(u, v):
    """Luz de la piedra: sillares de 0,9 × 0,55 m con juntas oscuras y desgaste aleatorio (0–1)."""
    fila = np.floor(v / 0.55); x = u + (fila % 2) * 0.45
    ju = np.minimum(np.abs((x % 0.9) - 0.45), 1) ; jv = np.abs((v % 0.55) - 0.275)
    junta = (np.abs(ju - 0.45) < 0.05) | (np.abs(jv - 0.275) < 0.04)
    rng = np.random.default_rng(3)
    tono = 0.62 + 0.3 * np.sin(np.floor(x / 0.9) * 12.9898 + fila * 78.233) ** 2
    return np.where(junta, 0.12, tono) * (0.85 + 0.15 * rng.random(len(u)))


BAYER = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) + 0.5) / 16


def tramar(u, v, lum):
    """Umbral Bayer sobre la retícula (u, v) de la cara: mismo criterio que la trama 2D."""
    iu = np.round(u / SEP).astype(int) % 4; iv = np.round(v / SEP).astype(int) % 4
    return lum > BAYER[iv, iu] * 0.9


def acueducto_puntos():
    """Cara frontal (y=0) con arcos, intradós de cada arco, caras laterales de las pilas y canal de arriba.
    Devuelve pts (N,3) y grupo de arco (0–7; los lejanos al 7)."""
    pts, grp = [], []
    largo = N_ARCOS * PASO
    us = np.arange(0, largo, SEP); vs = np.arange(0, ALTO_MURO, SEP)
    U, V = np.meshgrid(us, vs); U, V = U.ravel(), V.ravel()
    xl = (U % PASO) - PASO / 2                                    # x relativa al centro del vano
    luz_vano = PASO - ANCHO_PILA                                  # ancho del hueco
    hueco = (np.abs(xl) < luz_vano / 2) & ((V < ALTO_PILA) | (np.hypot(xl, V - ALTO_PILA) < luz_vano / 2))
    m = ~hueco & tramar(U, V, bloques(U, V))
    for y in (0.0, FONDO):                                        # cara frontal y trasera
        pts.append(np.c_[U[m], np.full(m.sum(), y), V[m]]); grp.append(np.floor(U[m] / PASO))
    # intradós: medio cilindro y jambas de cada vano
    for k in range(N_ARCOS):
        cx = k * PASO + PASO / 2
        a = np.arange(0, math.pi, SEP / (luz_vano / 2)); yy = np.arange(0, FONDO, SEP)
        A, Y = np.meshgrid(a, yy); A, Y = A.ravel(), Y.ravel()
        mm = tramar(A * luz_vano / 2, Y, bloques(A * 3, Y) * 0.8)
        pts.append(np.c_[cx + np.cos(A[mm]) * luz_vano / 2, Y[mm], ALTO_PILA + np.sin(A[mm]) * luz_vano / 2]); grp.append(np.full(mm.sum(), k))
        zz = np.arange(0, ALTO_PILA, SEP); Z, Y2 = np.meshgrid(zz, yy); Z, Y2 = Z.ravel(), Y2.ravel()
        for lado in (-1, 1):
            mm2 = tramar(Y2, Z, bloques(Y2 + k, Z) * 0.75)
            pts.append(np.c_[np.full(mm2.sum(), cx + lado * luz_vano / 2), Y2[mm2], Z[mm2]]); grp.append(np.full(mm2.sum(), k))
    pts = np.concatenate(pts); grp = np.minimum(np.concatenate(grp), 7).astype(int)
    return pts, grp


def canal_puntos():
    """Hilera del canal (specus) sobre el muro: tres filas de puntos que se encienden en teal."""
    xs = np.arange(0, N_ARCOS * PASO, SEP); out = []
    for y in (0.5, 1.2, 1.9):
        out.append(np.c_[xs, np.full(len(xs), y), np.full(len(xs), ALTO_MURO + 0.15)])
    return np.concatenate(out)


def plano_acueducto(sc):
    sc.render.use_motion_blur = False   # con 75k instancias el desenfoque de movimiento tumba la GPU (Metal)
    pts, grp = acueducto_puntos(); can = canal_puntos()
    rng = np.random.default_rng(11)
    # arena: cada punto sale de un montón disperso en el suelo, delante del arco que le toca
    arena = np.c_[pts[:, 0] + rng.normal(0, 2.5, len(pts)), rng.uniform(-6, 8, len(pts)), rng.uniform(-0.5, 0.3, len(pts))]
    demora = rng.random(len(pts)) * 0.25
    ob = nube_objeto("Acueducto", arena, R_PUNTO, material_puntos("Marmol", MARFIL))
    oc = nube_objeto("Canal", can, R_PUNTO * 1.1, material_puntos("Canal", MARFIL, atributo_agua=True), atributos=("agua",))
    # suelo de polvo, apenas
    sp = np.c_[rng.uniform(-20, N_ARCOS * PASO, 30000), rng.uniform(-12, 14, 30000), np.zeros(30000)]
    nube_objeto("Polvo", sp, R_PUNTO * 0.8, material_puntos("Polvo", tuple(c * 0.35 for c in MARFIL)))
    # luz rasante desde la izquierda-atrás, contraluz frío, haz volumétrico
    luz("SUN", (0, 0, 0), (math.radians(70), 0, math.radians(-135)), 16.0)         # rasante desde delante-izquierda
    luz("SPOT", (-20, -40, 36), (math.radians(48), 0, math.radians(-28)), 900000, tam=0.8, angulo=math.radians(26))
    luz("AREA", (70, 30, 16), (math.radians(90), 0, math.radians(160)), 12000, color=(0.75, 0.9, 1.0), tam=16)
    cam = camara(lente=26, f_stop=4.0, foco=22)

    def cuadro(f):
        b = f / GOLPE                                           # golpe local (0 = golpe 16 del reel)
        tl = grp - demora                                       # el grupo k aterriza en el golpe k
        u = np.clip((b - (tl - 0.85)) / 0.85, 0, 1); e = 1 - (1 - u) ** 3
        arco = np.sin(u * math.pi)[:, None] * np.array([0, -1.2, 2.5])
        p = arena + (pts - arena) * e[:, None] + arco
        ob.data.vertices.foreach_set("co", p.astype(np.float32).ravel())
        frente = -620 + 0 * can[:, 0]
        ola = np.clip((ease_io((b - 8) / 2.2) * (N_ARCOS * PASO + 20) - 10 - can[:, 0]) / 6, 0, 1)
        brillo = ola * (0.8 + 0.2 * np.sin(can[:, 0] * 1.7 - b * 6))
        oc.data.attributes["agua"].data.foreach_set("value", brillo.astype(np.float32))
        ob.data.update(); oc.data.update()
        # dolly bajo entre los arcos: avanza 14 m y sube un poco; mira a lo largo del acueducto
        v = ease_io(b / 16)
        o = Vector((-8 + 20 * v, -24 + 5 * v, 3.0 + 4.0 * v)); d = Vector((24 + 16 * v, 1.0, 9.0 - 1.5 * v))
        mirar(cam, o, d); cam.data.dof.focus_distance = (Vector((8 + 16 * v, 0, 8)) - o).length

    bpy.app.handlers.frame_change_pre.append(lambda s, *a: cuadro(s.frame_current))
    sc.frame_start, sc.frame_end = 0, 16 * GOLPE - 1
    return cuadro



# ------------------------------------------------------------------ materiales de mármol y acero
def material_marmol(nombre="MarmolBloque", claro=(0.80, 0.78, 0.74), veta=(0.12, 0.12, 0.13), escala=1.6):
    m = bpy.data.materials.new(nombre); m.use_nodes = True; nt = m.node_tree; p = nt.nodes["Principled BSDF"]
    co = nt.nodes.new("ShaderNodeTexCoord"); nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = escala; nz.inputs["Detail"].default_value = 9; nz.inputs["Roughness"].default_value = 0.7; nz.inputs["Distortion"].default_value = 1.4
    rampa = nt.nodes.new("ShaderNodeValToRGB"); cr = rampa.color_ramp
    cr.elements[0].position = 0.44; cr.elements[0].color = (*claro, 1)
    cr.elements[1].position = 0.50; cr.elements[1].color = (*veta, 1)
    e = cr.elements.new(0.56); e.color = (*claro, 1)
    nt.links.new(co.outputs["Object"], nz.inputs["Vector"]); nt.links.new(nz.outputs["Fac"], rampa.inputs["Fac"]); nt.links.new(rampa.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = 0.35; p.inputs["Coat Weight"].default_value = 0.3; p.inputs["Subsurface Weight"].default_value = 0.15
    p.inputs["Subsurface Radius"].default_value = (0.3, 0.25, 0.2)
    return m


def material_acero():
    m = bpy.data.materials.new("Acero"); m.use_nodes = True; p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.45, 0.45, 0.47, 1); p.inputs["Metallic"].default_value = 1.0; p.inputs["Roughness"].default_value = 0.35
    return m


def material_chispa():
    m = bpy.data.materials.new("Chispa"); m.use_nodes = True; p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (1, 0.85, 0.6, 1); p.inputs["Emission Color"].default_value = (1.0, 0.82, 0.55, 1); p.inputs["Emission Strength"].default_value = 40
    return m


def cubo(nombre, loc, dim, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); ob = bpy.context.active_object; ob.name = nombre
    ob.scale = dim; ob.data.materials.append(mat); return ob


# ------------------------------------------------------------------ cincel macro (gancho, 8 golpes)
def plano_cincel(sc):
    """Macro del cincel clavado en el bloque de mármol; chispas congeladas en el cuadro 0 que salen volando con rampa."""
    sc.view_settings.exposure = -0.4
    bloque = cubo("Bloque", (0, 0, -0.5), (3.0, 2.2, 1.0), material_marmol(claro=(0.42, 0.40, 0.37), veta=(0.06, 0.06, 0.07), escala=2.4)); bloque.rotation_euler = (0, 0, math.radians(8))
    bpy.ops.object.shade_smooth()
    # muesca/surco ya tallado: franja oscura
    surco = cubo("Surco", (-0.35, 0.05, 0.0), (0.9, 0.05, 0.03), material_marmol("Surco", claro=(0.25, 0.24, 0.23), veta=(0.1, 0.1, 0.1), escala=4))
    # cincel: cilindro largo + punta plana, inclinado 48°, punta en (0.1, 0.05, 0)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=1.6, vertices=48, location=(0, 0, 0)); c = bpy.context.active_object; c.name = "Cincel"; c.data.materials.append(material_acero())
    bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.84)); punta = bpy.context.active_object; punta.scale = (0.16, 0.05, 0.1); punta.data.materials.append(material_acero()); punta.parent = c
    c.rotation_euler = (0, math.radians(48), math.radians(-20)); c.location = (0.1 + 0.6, 0.05 - 0.22, 0.56)
    # chispas: 420 puntos emisivos
    rng = np.random.default_rng(5); n = 420
    ang = rng.uniform(-math.pi * 0.95, -0.05, n); vel = rng.uniform(0.8, 3.8, n) ** 1.2; vz = rng.uniform(0.3, 2.6, n); vy = rng.normal(0, 0.7, n)
    tam = rng.uniform(0.004, 0.012, n); R1c = rng.random(n)
    base = np.c_[np.full(n, 0.1), np.full(n, 0.05), np.zeros(n)]
    ob = nube_objeto("Chispas", base, 0.0035, material_chispa())
    # esquirlas de mármol: 60 trozos pequeños
    esq = np.c_[np.full(60, 0.1), np.full(60, 0.05), np.zeros(60)]
    oe = nube_objeto("Esquirlas", esq, 0.009, material_marmol("MarmolEsq", claro=(0.5, 0.48, 0.45)))
    ea = rng.uniform(-math.pi, 0, 60); ev = rng.uniform(0.3, 1.6, 60); ez = rng.uniform(0.6, 2.4, 60)
    luz("SPOT", (-2.4, -1.2, 1.6), (math.radians(60), 0, math.radians(-65)), 650, tam=0.12, angulo=math.radians(30))
    luz("AREA", (2.5, 1.5, 1.2), (math.radians(70), 0, math.radians(120)), 25, color=(0.75, 0.9, 1.0), tam=2)
    cam = camara(lente=100, f_stop=2.0, foco=1.6)

    def tiempo(f):
        """Rampa: golpes 0–1 a 100 % (el golpe), 1–3 a 12 %, 3–8 acelera hasta 140 %. Devuelve el tiempo físico en s."""
        b = f / GOLPE; t = 0.0; db = 0.01; x = 0
        while x < b:
            v = 1.0 if x < 1 else (0.12 if x < 3 else 0.12 + (1.4 - 0.12) * ease_io((x - 3) / 5))
            t += v * db * 0.4; x += db
        return t

    def cuadro(f):
        t = tiempo(f) if f > 0 else 0.03   # cuadro 0: chispas recién nacidas, congeladas
        g = 6.5
        px = base[:, 0] + np.cos(ang) * vel * t; py = base[:, 1] + vy * t; pz = base[:, 2] + vz * t - 0.5 * g * t * t + 2.2 * np.maximum(0, t - 0.3) ** 1.6 * (0.5 + R1c)
        pz = np.where(pz < 0.005, 0.005 + np.abs(pz) * 0.1, pz)  # rebote mínimo en el bloque
        ob.data.vertices.foreach_set("co", np.c_[px, py, pz].astype(np.float32).ravel()); ob.data.update()
        qx = esq[:, 0] + np.cos(ea) * ev * t; qy = esq[:, 1] + rng.normal(0, 0.0, 60) + 0.2 * t; qz = ez * t - 0.5 * 9.0 * t * t
        qz = np.maximum(qz, 0.012)
        oe.data.vertices.foreach_set("co", np.c_[qx, qy, qz].astype(np.float32).ravel()); oe.data.update()
        # el cincel vibra en el golpe
        b = f / GOLPE; c.location.z = 0.56 - 0.03 * math.exp(-6 * b) * math.cos(40 * b)
        # cámara: macro lateral baja, empuja lento y sube al final
        v = ease_io(b / 8)
        o = Vector((1.35 - 0.3 * v, -1.25 + 0.2 * v, 0.28 + 0.7 * v)); d = Vector((0.1, 0.05, 0.12 + 0.5 * v))
        mirar(cam, o, d); cam.data.dof.focus_distance = (Vector((0.1, 0.05, 0.05)) - o).length

    bpy.app.handlers.frame_change_pre.append(lambda s, *a: cuadro(s.frame_current))
    sc.frame_start, sc.frame_end = 0, 8 * GOLPE - 1
    return cuadro


# ------------------------------------------------------------------ título en mármol (drop, 6 golpes)
def plano_titulo(sc):
    fuente = bpy.data.fonts.load(str(D.parent / "panteon/assets/RethinkSans-Medium.ttf"))
    mats = material_marmol("MarmolTitulo", claro=(0.86, 0.84, 0.80), escala=2.2)
    letras = []
    for i, txt in enumerate(["TRES", "OFICIOS"]):
        cu = bpy.data.curves.new(txt, "FONT"); cu.body = txt; cu.font = fuente; cu.size = 0.66; cu.extrude = 0.10; cu.bevel_depth = 0.01; cu.align_x = "CENTER"
        ob = bpy.data.objects.new(txt, cu); sc.collection.objects.link(ob); ob.data.materials.append(mats)
        ob.rotation_euler = (math.radians(90), 0, 0); ob.location = (0, 0, 1.05 - i * 0.8); letras.append(ob)
    suelo = cubo("Suelo", (0, 1.5, -0.25), (12, 8, 0.1), material_marmol("Suelo", claro=(0.05, 0.05, 0.05), veta=(0.02, 0.02, 0.02), escala=1.0))
    # luz: teal rasante que barre de izquierda a derecha; relleno frío tenue
    teal = luz("SPOT", (-5, -2.5, 2.2), (math.radians(70), 0, math.radians(-60)), 9000, color=(0.0, 0.92, 0.85), tam=0.15, angulo=math.radians(26))
    blanca = luz("SPOT", (3.5, -4.5, 4.5), (math.radians(45), 0, math.radians(35)), 4000, tam=0.4, angulo=math.radians(35))
    cam = camara(lente=40, f_stop=4.0, foco=6)

    def cuadro(f):
        b = f / GOLPE; v = ease_io(b / 6)
        teal.location = (-5 + 10 * v, -2.5, 2.2); teal.rotation_euler = (math.radians(70), 0, math.radians(-60 + 120 * v))
        teal.data.energy = 9000 * (0.3 + 0.7 * math.sin(math.pi * min(1, v)) ) + 2500
        blanca.data.energy = 4000 * (0.4 + 0.6 * ease_out(b / 1.5))
        o = Vector((-0.9 + 0.6 * v, -7.4 + 1.0 * v, -0.1 + 0.4 * v)); mirar(cam, o, Vector((0, 0, 0.68)))
        for i, ob in enumerate(letras):  # las letras bajan y asientan en el golpe 0 y 1
            u = ease_out((b - i * 0.5) / 0.7); ob.location.z = (1.05 - i * 0.8) + (1 - u) * 1.8

    bpy.app.handlers.frame_change_pre.append(lambda s, *a: cuadro(s.frame_current))
    sc.frame_start, sc.frame_end = 0, 6 * GOLPE - 1
    return cuadro


PLANOS = {"acueducto": plano_acueducto, "cincel": plano_cincel, "titulo": plano_titulo}


def main():
    nombre = ARGS[0]
    sc = limpiar(); cuadro = PLANOS[nombre](sc)
    for o in list(sc.objects):
        if o.type == "MESH" and o.name not in ("Bloque",): pass
    out = D / "out/3d" / (nombre + ("-previa" if PREVIA else "")); out.mkdir(parents=True, exist_ok=True)
    if "--cuadros" in ARGS: fs = [int(x) for x in ARGS[ARGS.index("--cuadros") + 1].split(",")]
    else: fs = range(sc.frame_start, sc.frame_end + 1)
    for f in fs:
        if (out / f"{f:04d}.png").exists() and "--rehacer" not in ARGS: continue
        sc.frame_set(f); cuadro(f)
        sc.render.filepath = str(out / f"{f:04d}.png"); bpy.ops.render.render(write_still=True)
        print("cuadro", f, flush=True)


main()
