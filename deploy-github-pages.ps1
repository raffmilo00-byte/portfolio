# Pubblica SOLO il portfolio su https://github.com/raffmilo00-byte/il-mio-porfolio
# Sostituisce la root del repo (rimuove cv/ e pagina web/ vecchie sul remoto).
$ErrorActionPreference = "Stop"
$RepoOwner = "raffmilo00-byte"
$RepoName = "il-mio-porfolio"
$Root = $PSScriptRoot
$SiteUrl = "https://$RepoOwner.github.io/$RepoName/"

Set-Location $Root

Write-Host "=== Auth GitHub CLI ===" -ForegroundColor Cyan
gh auth status
if ($LASTEXITCODE -ne 0) { Write-Host "Esegui: gh auth login"; exit 1 }

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

$remoteUrl = "https://github.com/$RepoOwner/$RepoName.git"
if (git remote | Select-String -Pattern "^origin$" -Quiet) {
  git remote set-url origin $remoteUrl
} else {
  git remote add origin $remoteUrl
}

Write-Host "=== Commit locale ===" -ForegroundColor Cyan
git add -A
git status
if (git status --porcelain) {
  git commit -m "Portfolio HTML/CSS: sito unico, README e GitHub Pages"
}

Write-Host "=== Push (contenuto portfolio = root repo) ===" -ForegroundColor Cyan
git push -u origin main --force

Write-Host "=== GitHub Pages: branch main, cartella / ===" -ForegroundColor Cyan
gh api "repos/$RepoOwner/$RepoName/pages" -X POST `
  -f "build_type=legacy" `
  -f "source[branch]=main" `
  -f "source[path]=/" 2>$null
if ($LASTEXITCODE -ne 0) {
  gh api "repos/$RepoOwner/$RepoName/pages" -X PUT `
    -f "build_type=legacy" `
    -f "source[branch]=main" `
    -f "source[path]=/"
}

Write-Host ""
Write-Host "COMPLETATO" -ForegroundColor Green
Write-Host "Repository: https://github.com/$RepoOwner/$RepoName"
Write-Host "Sito (attendi 2-5 min): $SiteUrl"
Write-Host "Portfolio: ${SiteUrl}PORTFOLIO.html"
