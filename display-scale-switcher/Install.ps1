# Desktop par shortcuts banata hai:
#   "Display 100%"   -> Ctrl+Alt+1
#   "Display 125%"   -> Ctrl+Alt+2
#   "Display Scale"  -> Ctrl+Alt+0  (buttons wala window)
param([switch]$Uninstall)

$ErrorActionPreference = 'Stop'

$installDir = Join-Path $env:LOCALAPPDATA 'DisplayScale'
$desktop    = [Environment]::GetFolderPath('Desktop')
$script     = Join-Path $installDir 'DisplayScale.ps1'
$icon       = "$env:SystemRoot\System32\DisplaySwitch.exe,0"

$shortcuts = @(
    @{ Name = 'Display 100%';  Args = '-Scale 100'; Hotkey = 'CTRL+ALT+1' },
    @{ Name = 'Display 125%';  Args = '-Scale 125'; Hotkey = 'CTRL+ALT+2' },
    @{ Name = 'Display Scale'; Args = '';           Hotkey = 'CTRL+ALT+0' }
)

if ($Uninstall) {
    foreach ($s in $shortcuts) { Remove-Item (Join-Path $desktop "$($s.Name).lnk") -ErrorAction SilentlyContinue }
    Remove-Item $installDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host 'Display Scale hata diya gaya.' -ForegroundColor Green
    return
}

# Copy to a fixed location so the shortcuts keep working if the download folder is deleted.
New-Item -ItemType Directory -Path $installDir -Force | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'DisplayScale.ps1') $script -Force
Unblock-File $script

$shell = New-Object -ComObject WScript.Shell
foreach ($s in $shortcuts) {
    $lnk = $shell.CreateShortcut((Join-Path $desktop "$($s.Name).lnk"))
    $lnk.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    $lnk.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`" $($s.Args)".Trim()
    $lnk.WorkingDirectory = $installDir
    $lnk.IconLocation = $icon
    $lnk.WindowStyle = 7    # minimized, so no console flashes up
    $lnk.Hotkey = $s.Hotkey
    $lnk.Description = "Display scale: $($s.Name)"
    $lnk.Save()
}

Write-Host ''
Write-Host 'Ho gaya! Desktop par 3 shortcuts ban gaye:' -ForegroundColor Green
Write-Host '  Display 100%   (Ctrl+Alt+1)'
Write-Host '  Display 125%   (Ctrl+Alt+2)'
Write-Host '  Display Scale  (Ctrl+Alt+0)  - saare options wala window'
