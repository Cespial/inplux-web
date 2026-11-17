// Recorta la figura (máscara de primer plano de Vision) y la guarda como PNG con transparencia.
// uso: swift recortar.swift entrada.jpg salida.png
import Foundation
import Vision
import CoreImage
import AppKit

let a = CommandLine.arguments
let url = URL(fileURLWithPath: a[1])
let ci = CIImage(contentsOf: url)!
let handler = VNImageRequestHandler(ciImage: ci)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let r = req.results?.first else { print("sin figura"); exit(1) }
let buf = try r.generateMaskedImage(ofInstances: r.allInstances, from: handler, croppedToInstancesExtent: false)
let out = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: a[2]), format: .RGBA8, colorSpace: cs)
print("ok", a[2])
