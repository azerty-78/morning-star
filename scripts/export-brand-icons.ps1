Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$srcPath = Join-Path $root "public\logo.png"
$img = [System.Drawing.Image]::FromFile($srcPath)

function Save-Icon([int]$size, [string]$outPath) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(255, 247, 244, 238))
  $g.DrawImage($img, 0, 0, $size, $size)
  $dir = Split-Path -Parent $outPath
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$public = Join-Path $root "public"
Save-Icon 32 (Join-Path $public "favicon-32.png")
Save-Icon 180 (Join-Path $public "apple-touch-icon.png")
Save-Icon 192 (Join-Path $public "icon-192.png")
Save-Icon 512 (Join-Path $public "icon-512.png")

$img.Dispose()
Write-Output "icons exported"
