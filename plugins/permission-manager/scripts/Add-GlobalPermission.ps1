<#
.SYNOPSIS
    Add a permission to the global Claude Code allow list.

.DESCRIPTION
    Adds a permission pattern to the permissions.allow array in
    ~/.claude/settings.json with automatic deduplication.

.PARAMETER Permission
    The permission string to add (e.g., "Bash(git fetch:*)")

.EXAMPLE
    .\Add-GlobalPermission.ps1 -Permission "Bash(git fetch:*)"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Permission
)

$settingsPath = "$env:USERPROFILE\.claude\settings.json"

if (-not (Test-Path $settingsPath)) {
    Write-Error "Settings file not found: $settingsPath"
    exit 1
}

$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json

if (-not $settings.permissions) {
    $settings | Add-Member -Type NoteProperty -Name "permissions" -Value @{ allow = @() }
}

if ($settings.permissions.allow -contains $Permission) {
    Write-Host "Permission already exists: $Permission"
    exit 0
}

$settings.permissions.allow += $Permission

$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath

Write-Host "Added permission: $Permission"
