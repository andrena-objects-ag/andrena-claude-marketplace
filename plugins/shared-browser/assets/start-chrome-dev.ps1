<#
  start-chrome-dev.ps1 — launch Chrome with remote debugging for the shared
  browser bridge (Windows).

  Opens Chrome with a DEDICATED profile (so it never disturbs your normal
  Chrome) and a DevTools port the agent's cdp.js connects to. Log into whatever
  sites you want the agent to see — the session persists in the profile dir.

  Usage:  ./start-chrome-dev.ps1 [-Port 9222] [-ProfileDir .chrome-dev-profile]
#>
param(
  [int]$Port = 9222,
  [string]$ProfileDir = ".chrome-dev-profile"
)

$candidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
)
$chrome = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Error "Chrome not found. Edit this script with your chrome.exe path."; exit 1 }

$dir = Join-Path (Get-Location) $ProfileDir
New-Item -ItemType Directory -Force -Path $dir | Out-Null

Write-Host "Launching Chrome on debug port $Port"
Write-Host "  profile: $dir"
Write-Host "  verify:  Invoke-WebRequest http://127.0.0.1:$Port/json/version"

Start-Process $chrome -ArgumentList @(
  "--remote-debugging-port=$Port",
  "--user-data-dir=`"$dir`"",
  "--no-first-run",
  "--no-default-browser-check"
)
