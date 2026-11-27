"""
Quita el fondo de las fotos de producto y las coloca centradas sobre un lienzo
cuadrado blanco (#FFFFFF), guardándolas optimizadas en WebP.

Requisitos (Python 3.10-3.12, por ejemplo `py -3.11`; onnxruntime aún no publica ruedas para versiones más nuevas):
    py -3.11 -m pip install "rembg[cpu]" pillow

Uso:
    # 1) Vista previa: escribe los resultados en otra carpeta, sin tocar la tienda
    py -3.11 scripts/fondo_blanco.py

    # 2) Solo algunas fotos
    py -3.11 scripts/fondo_blanco.py --solo hidrolavadora-total-1400w-1.jpg cautin-truper-cau-100-1.jpg

    # 3) Reemplazar en la tienda (después de revisar la vista previa):
    #    sobrescribe nombre.jpg y genera nombre-400/800/1200.webp, el formato que usa la web
    py -3.11 scripts/fondo_blanco.py --reemplazar

La primera ejecución descarga el modelo de rembg (~170 MB) en la carpeta del usuario.
Revisa siempre la vista previa: la IA puede recortar partes de cajas, blísteres o cables.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "public" / "images" / "productos"
SALIDA = RAIZ / "scripts" / "salida-fondo-blanco"
LADO = 1200  # lado del lienzo final, igual que las fotos actuales
MARGEN = 0.08  # 8 % de aire alrededor del producto
VARIANTES = (400, 800, 1200)  # las mismas que espera src/lib/imageSrc.ts
BLANCO = (255, 255, 255)

# Originales a procesar: .jpg/.jpeg/.png que NO sean variantes "-400/-800/-1200"
ES_VARIANTE = re.compile(r"-(400|800|1200)$")


def originales(carpeta: Path, solo: list[str] | None) -> list[Path]:
    fotos = [
        p
        for p in sorted(carpeta.iterdir())
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"} and not ES_VARIANTE.search(p.stem)
    ]
    if solo:
        pedidas = set(solo)
        fotos = [p for p in fotos if p.name in pedidas]
        faltan = pedidas - {p.name for p in fotos}
        if faltan:
            print("No encontradas:", ", ".join(sorted(faltan)), file=sys.stderr)
    return fotos


def fondo_blanco(foto: Path, sesion) -> Image.Image:
    """Devuelve la foto sin fondo, centrada en un cuadrado blanco de LADO x LADO."""
    with Image.open(foto) as original:
        recorte = remove(original.convert("RGB"), session=sesion)  # RGBA con alfa

    caja = recorte.getchannel("A").point(lambda a: 255 if a > 10 else 0).getbbox()
    if caja:
        recorte = recorte.crop(caja)

    util = int(LADO * (1 - 2 * MARGEN))
    escala = min(util / recorte.width, util / recorte.height)
    tam = (max(1, round(recorte.width * escala)), max(1, round(recorte.height * escala)))
    recorte = recorte.resize(tam, Image.LANCZOS)

    lienzo = Image.new("RGB", (LADO, LADO), BLANCO)
    lienzo.paste(recorte, ((LADO - tam[0]) // 2, (LADO - tam[1]) // 2), recorte)
    return lienzo


def guardar_vista_previa(img: Image.Image, foto: Path) -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    img.save(SALIDA / f"{foto.stem}.webp", "WEBP", quality=85, method=6)


def reemplazar_en_tienda(img: Image.Image, foto: Path) -> None:
    # Original (fallback de la web) y variantes WebP con los nombres que ya usa la tienda
    img.save(foto.with_suffix(".jpg"), "JPEG", quality=85, optimize=True, progressive=True)
    for ancho in VARIANTES:
        img.resize((ancho, ancho), Image.LANCZOS).save(
            foto.with_name(f"{foto.stem}-{ancho}.webp"), "WEBP", quality=80, method=6
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--entrada", type=Path, default=ENTRADA, help="carpeta con las fotos originales")
    parser.add_argument("--solo", nargs="*", help="procesar solo estos archivos (por nombre)")
    parser.add_argument("--reemplazar", action="store_true", help="sobrescribir las fotos de la tienda")
    parser.add_argument("--modelo", default="u2net", help="modelo de rembg (u2net, isnet-general-use...)")
    args = parser.parse_args()

    fotos = originales(args.entrada, args.solo)
    if not fotos:
        print("No hay fotos para procesar.")
        return 1

    sesion = new_session(args.modelo)
    destino = "la tienda (sobrescribiendo)" if args.reemplazar else SALIDA
    print(f"Procesando {len(fotos)} fotos -> {destino}")

    errores = 0
    for i, foto in enumerate(fotos, 1):
        try:
            img = fondo_blanco(foto, sesion)
            (reemplazar_en_tienda if args.reemplazar else guardar_vista_previa)(img, foto)
            print(f"[{i}/{len(fotos)}] {foto.name}")
        except Exception as exc:  # una foto dañada no debe detener el lote
            errores += 1
            print(f"[{i}/{len(fotos)}] ERROR {foto.name}: {exc}", file=sys.stderr)

    print(f"Listo. {len(fotos) - errores} correctas, {errores} con error.")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
