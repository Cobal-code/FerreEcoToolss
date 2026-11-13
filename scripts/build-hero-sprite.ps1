# Genera la imagen compuesta (sprite) con las miniaturas de producto del hero.
#
# - Lee src/data/products.ts (id + imagen principal de cada producto).
# - Recorta cada foto al centro en cuadrado y la reduce a 48 px.
# - Guarda UN solo archivo: public/images/hero/hero-sprite.jpg (una petición en vez de decenas).
# - Escribe src/data/heroSprite.ts con la posición de cada producto dentro del sprite.
#
# Los originales no se tocan. Volver a ejecutar al añadir o quitar productos:
#   powershell -ExecutionPolicy Bypass -File scripts/build-hero-sprite.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$productsFile = Join-Path $root 'src/data/products.ts'
$outImage = Join-Path $root 'public/images/hero/hero-sprite.jpg'
$outData = Join-Path $root 'src/data/heroSprite.ts'
$cell = 48
$cols = 8
$quality = 72

$text = [System.IO.File]::ReadAllText($productsFile)
$idMatches = [regex]::Matches($text, '(?m)^\s{2,4}id:\s*(\d+),')

$items = @()
for ($i = 0; $i -lt $idMatches.Count; $i++) {
  $start = $idMatches[$i].Index
  $end = if ($i + 1 -lt $idMatches.Count) { $idMatches[$i + 1].Index } else { $text.Length }
  $block = $text.Substring($start, $end - $start)
  $img = [regex]::Match($block, 'image:\s*"([^"]+)"')
  if (-not $img.Success) { continue }
  $rel = $img.Groups[1].Value
  if (-not $rel.StartsWith('/')) { continue }
  $path = Join-Path $root ('public' + $rel)
  if (-not (Test-Path $path)) { Write-Host "Sin archivo, se omite: $rel"; continue }
  $items += [pscustomobject]@{ Id = [int]$idMatches[$i].Groups[1].Value; Path = $path }
}

$rows = [math]::Ceiling($items.Count / $cols)
$sprite = New-Object System.Drawing.Bitmap ($cols * $cell), ($rows * $cell)
$g = [System.Drawing.Graphics]::FromImage($sprite)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = 'HighQualityBicubic'
$g.SmoothingMode = 'HighQuality'
$g.PixelOffsetMode = 'HighQuality'

$map = @()
for ($n = 0; $n -lt $items.Count; $n++) {
  $src = [System.Drawing.Image]::FromFile($items[$n].Path)
  $side = [math]::Min($src.Width, $src.Height)
  $sx = [int](($src.Width - $side) / 2)
  $sy = [int](($src.Height - $side) / 2)
  $dx = ($n % $cols) * $cell
  $dy = [math]::Floor($n / $cols) * $cell
  $dest = New-Object System.Drawing.Rectangle $dx, $dy, $cell, $cell
  $g.DrawImage($src, $dest, $sx, $sy, $side, $side, [System.Drawing.GraphicsUnit]::Pixel)
  $src.Dispose()
  $map += ('  {0}: {1},' -f $items[$n].Id, $n)
}
$g.Dispose()

New-Item -ItemType Directory -Force -Path (Split-Path $outImage) | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$quality)
$sprite.Save($outImage, $encoder, $params)
$sprite.Dispose()

$ts = @"
// Archivo generado por scripts/build-hero-sprite.ps1: no editar a mano.
// Posicion de la miniatura de cada producto dentro de public/images/hero/hero-sprite.jpg.

export const HERO_SPRITE = {
  url: "/images/hero/hero-sprite.jpg",
  cell: $cell,
  cols: $cols,
  rows: $rows,
  /** id de producto -> posicion (indice) dentro del sprite */
  index: {
$($map -join "`n")
  } as Record<number, number>,
};
"@
[System.IO.File]::WriteAllText($outData, $ts, (New-Object System.Text.UTF8Encoding $false))

$size = [math]::Round((Get-Item $outImage).Length / 1KB, 1)
Write-Host "Sprite: $($items.Count) productos, ${cols}x${rows} celdas de ${cell}px, $size KB"
