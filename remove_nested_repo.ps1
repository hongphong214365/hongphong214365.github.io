param(
    [switch]$Force
)

$nested = Join-Path -Path $PSScriptRoot -ChildPath 'hongphong214365.github.io'
Write-Host "Target: $nested"

if (-not (Test-Path -LiteralPath $nested)){
    Write-Host "Nested folder not found. Nothing to do." -ForegroundColor Yellow
    exit 0
}

if (-not $Force){
    $confirm = Read-Host "Type YES to permanently delete '$nested' and commit the removal"
    if ($confirm -ne 'YES'){
        Write-Host "Aborted by user." -ForegroundColor Yellow
        exit 2
    }
}

try{
    Write-Host "Removing folder..." -ForegroundColor Cyan
    Remove-Item -LiteralPath $nested -Recurse -Force -ErrorAction Stop
    Start-Sleep -Milliseconds 250
    if (Test-Path -LiteralPath $nested){
        Write-Host "Failed to delete: folder still exists." -ForegroundColor Red
        exit 3
    }
    Write-Host "Folder removed." -ForegroundColor Green

    Write-Host "Checking git status in parent repo..." -ForegroundColor Cyan
    Push-Location -Path $PSScriptRoot

    $porcelain = & git status --porcelain
    Write-Host "git status --porcelain output:`n$porcelain"

    Write-Host "Staging changes..." -ForegroundColor Cyan
    & git add -A

    # Check staged changes
    $staged = & git diff --cached --name-only
    if (-not $staged){
        Write-Host "Nothing to commit after deletion." -ForegroundColor Yellow
        Pop-Location
        exit 0
    }

    Write-Host "Committing..." -ForegroundColor Cyan
    $commitMsg = "Remove nested repo folder"
    $co = "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
    & git commit -m $commitMsg -m $co

    Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
    & git push origin main

    Write-Host "Done: nested folder removed, changes committed and pushed (if credentials allowed)." -ForegroundColor Green
    Pop-Location
    exit 0
}
catch{
    Write-Host "Error: $_" -ForegroundColor Red
    if (Get-Location) {Pop-Location}
    exit 4
}