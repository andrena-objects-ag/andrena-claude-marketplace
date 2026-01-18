<#
.SYNOPSIS
    List permissions from Claude Code settings files.

.DESCRIPTION
    Extracts and displays permissions from global or local settings files,
    grouped by permission type.

.PARAMETER Scope
    "global" for ~/.claude/settings.json or "local" for a project path

.PARAMETER Path
    Required when Scope is "local" - path to the project directory

.EXAMPLE
    .\Get-Permissions.ps1 -Scope global
.EXAMPLE
    .\Get-Permissions.ps1 -Scope local -Path "C:\projects\my-app"
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("global", "local")]
    [string]$Scope,

    [Parameter(Mandatory = $false)]
    [string]$Path
)

if ($Scope -eq "global") {
    $settingsPath = "$env:USERPROFILE\.claude\settings.json"
} else {
    if (-not $Path) {
        Write-Error "Path is required when Scope is 'local'"
        exit 1
    }
    $settingsPath = Join-Path $Path ".claude\settings.json"
}

if (-not (Test-Path $settingsPath)) {
    Write-Error "Settings file not found: $settingsPath"
    exit 1
}

$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json

if (-not $settings.permissions -or -not $settings.permissions.allow) {
    Write-Host "No permissions found."
    exit 0
}

$permissions = $settings.permissions.allow

$bash = $permissions | Where-Object { $_ -like "Bash(*" }
$skill = $permissions | Where-Object { $_ -like "Skill(*" }
$mcp = $permissions | Where-Object { $_ -like "mcp__*" }

Write-Host "`n=== Bash Permissions ===" -ForegroundColor Cyan
$bash | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== Skill Permissions ===" -ForegroundColor Cyan
$skill | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== MCP Permissions ===" -ForegroundColor Cyan
$mcp | ForEach-Object { Write-Host "  $_" }

Write-Host "`nTotal: $($permissions.Count) permissions"
