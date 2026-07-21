param(
  [string]$Message = "Actualizacion cafeteria $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = 'Stop'

$source = 'C:\Users\ibar.araya\Documents\New project\zip_app_work\app'
$repo = 'C:\Users\ibar.araya\Documents\New project\cafeteria_mejillones_repo'
$git = 'C:\Program Files\Git\cmd\git.exe'

if (-not (Test-Path $source)) {
  throw "No existe la carpeta fuente: $source"
}

if (-not (Test-Path (Join-Path $repo '.git'))) {
  throw "No existe el repositorio Git en: $repo"
}

$folders = @('.github', 'dist', 'public', 'src', 'supabase')
foreach ($folder in $folders) {
  $srcFolder = Join-Path $source $folder
  $dstFolder = Join-Path $repo $folder

  if (Test-Path $dstFolder) {
    Remove-Item -LiteralPath $dstFolder -Recurse -Force
  }

  if (Test-Path $srcFolder) {
    Copy-Item -LiteralPath $srcFolder -Destination $repo -Recurse -Force
  }
}

$files = @(
  '.env.example',
  'components.json',
  'eslint.config.js',
  'index.html',
  'package-lock.json',
  'package.json',
  'postcss.config.js',
  'README.md',
  'tailwind.config.js',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'SUPABASE_SETUP.md',
  'ola_products.html'
)

foreach ($file in $files) {
  $srcFile = Join-Path $source $file
  $dstFile = Join-Path $repo $file

  if (Test-Path $srcFile) {
    Copy-Item -LiteralPath $srcFile -Destination $dstFile -Force
  } elseif (Test-Path $dstFile) {
    Remove-Item -LiteralPath $dstFile -Force
  }
}

Push-Location $repo
try {
  npm run build

  & $git add -A

  $status = & $git status --porcelain
  if (-not $status) {
    Write-Host 'No hay cambios para publicar.'
    exit 0
  }

  & $git commit -m $Message
  & $git push origin main
} finally {
  Pop-Location
}
