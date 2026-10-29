<#
.SYNOPSIS
    Windows display scale (100%, 125%, 150% ...) ek click mein badlo - Settings kholne ki zarurat nahi.

.DESCRIPTION
    Settings > System > Display > Scale wala hi kaam karta hai, turant (sign-out ki zarurat nahi).
    Bina parameter ke chalao to chhota sa window khulta hai jisme 100% / 125% ... ke buttons hain.

.EXAMPLE
    .\DisplayScale.ps1                # GUI kholo
    .\DisplayScale.ps1 -Scale 100     # sab displays 100% par
    .\DisplayScale.ps1 -Scale 125     # sab displays 125% par
    .\DisplayScale.ps1 -Toggle        # 100% <-> 125% switch
    .\DisplayScale.ps1 -Get           # current scale dikhao
    .\DisplayScale.ps1 -Scale 150 -Display 1   # sirf display #1 par
#>
param(
    [int]$Scale = 0,
    [int]$Display = 0,    # 0 = saare displays, 1..n = sirf woh display
    [switch]$Toggle,
    [switch]$Get
)

$ErrorActionPreference = 'Stop'

if (-not ('DisplayScale.Native' -as [type])) {
    Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace DisplayScale
{
    [StructLayout(LayoutKind.Sequential)]
    public struct LUID { public uint LowPart; public int HighPart; }

    [StructLayout(LayoutKind.Sequential)]
    public struct PathSourceInfo { public LUID adapterId; public uint id; public uint modeInfoIdx; public uint statusFlags; }

    [StructLayout(LayoutKind.Sequential)]
    public struct Rational { public uint Numerator; public uint Denominator; }

    [StructLayout(LayoutKind.Sequential)]
    public struct PathTargetInfo
    {
        public LUID adapterId; public uint id; public uint modeInfoIdx; public uint outputTechnology;
        public uint rotation; public uint scaling; public Rational refreshRate; public uint scanLineOrdering;
        public int targetAvailable; public uint statusFlags;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct PathInfo { public PathSourceInfo sourceInfo; public PathTargetInfo targetInfo; public uint flags; }

    // DISPLAYCONFIG_MODE_INFO: header + 48-byte union. Only the source-mode view of the union is needed.
    [StructLayout(LayoutKind.Sequential, Size = 64)]
    public struct ModeInfo
    {
        public uint infoType; public uint id; public LUID adapterId;
        public uint width; public uint height; public uint pixelFormat; public int positionX; public int positionY;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct DeviceInfoHeader { public int type; public uint size; public LUID adapterId; public uint id; }

    // Undocumented DISPLAYCONFIG_DEVICE_INFO_GET_DPI_SCALE (-3) / SET_DPI_SCALE (-4) payloads,
    // the same calls the Settings app makes. Values are steps relative to the recommended scale.
    [StructLayout(LayoutKind.Sequential)]
    public struct GetDpiScale { public DeviceInfoHeader header; public int minScaleRel; public int curScaleRel; public int maxScaleRel; }

    [StructLayout(LayoutKind.Sequential)]
    public struct SetDpiScale { public DeviceInfoHeader header; public int scaleRel; }

    public class DisplayInfo
    {
        public int Number;
        public LUID AdapterId;
        public uint SourceId;
        public bool Primary;
        public string Resolution;
        public int Current;
        public int Recommended;
        public int Maximum;
    }

    public static class Native
    {
        const uint QDC_ONLY_ACTIVE_PATHS = 2;
        const uint MODE_INFO_TYPE_SOURCE = 1;
        public static readonly int[] Values = { 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500 };

        [DllImport("user32.dll")]
        static extern int GetDisplayConfigBufferSizes(uint flags, out uint numPaths, out uint numModes);

        [DllImport("user32.dll")]
        static extern int QueryDisplayConfig(uint flags, ref uint numPaths, [Out] PathInfo[] paths,
            ref uint numModes, [Out] ModeInfo[] modes, IntPtr topologyId);

        [DllImport("user32.dll", EntryPoint = "DisplayConfigGetDeviceInfo")]
        static extern int GetDeviceInfo(ref GetDpiScale request);

        [DllImport("user32.dll", EntryPoint = "DisplayConfigSetDeviceInfo")]
        static extern int SetDeviceInfo(ref SetDpiScale request);

        static int Step(int index) { return Values[Math.Max(0, Math.Min(Values.Length - 1, index))]; }

        public static List<DisplayInfo> GetDisplays()
        {
            uint numPaths, numModes;
            int err = GetDisplayConfigBufferSizes(QDC_ONLY_ACTIVE_PATHS, out numPaths, out numModes);
            if (err != 0) throw new Win32Exception(err);

            var paths = new PathInfo[numPaths];
            var modes = new ModeInfo[numModes];
            err = QueryDisplayConfig(QDC_ONLY_ACTIVE_PATHS, ref numPaths, paths, ref numModes, modes, IntPtr.Zero);
            if (err != 0) throw new Win32Exception(err);

            var result = new List<DisplayInfo>();
            var seen = new HashSet<string>();
            for (int i = 0; i < numPaths; i++)
            {
                PathSourceInfo src = paths[i].sourceInfo;
                // Duplicated ("clone") displays share one source and one scale.
                if (!seen.Add(src.adapterId.LowPart + ":" + src.adapterId.HighPart + ":" + src.id)) continue;

                var req = new GetDpiScale();
                req.header.type = -3;
                req.header.size = (uint)Marshal.SizeOf(typeof(GetDpiScale));
                req.header.adapterId = src.adapterId;
                req.header.id = src.id;
                err = GetDeviceInfo(ref req);
                if (err != 0) throw new Win32Exception(err);

                int recommended = Math.Abs(req.minScaleRel);
                var info = new DisplayInfo();
                info.AdapterId = src.adapterId;
                info.SourceId = src.id;
                info.Current = Step(recommended + req.curScaleRel);
                info.Recommended = Step(recommended);
                info.Maximum = Step(recommended + req.maxScaleRel);
                info.Resolution = "";
                if (src.modeInfoIdx < numModes && modes[src.modeInfoIdx].infoType == MODE_INFO_TYPE_SOURCE)
                {
                    ModeInfo m = modes[src.modeInfoIdx];
                    info.Resolution = m.width + " x " + m.height;
                    info.Primary = m.positionX == 0 && m.positionY == 0;
                }
                result.Add(info);
            }

            result.Sort((a, b) => b.Primary.CompareTo(a.Primary));
            for (int i = 0; i < result.Count; i++) result[i].Number = i + 1;
            return result;
        }

        public static void SetScale(DisplayInfo display, int percent)
        {
            int target = Array.IndexOf(Values, percent);
            if (target < 0)
                throw new ArgumentException(percent + "% valid scale nahi hai. Use: " + string.Join(", ", Values));
            if (percent > display.Maximum)
                throw new ArgumentException("Display " + display.Number + " par max " + display.Maximum + "% hi allowed hai.");

            var req = new SetDpiScale();
            req.header.type = -4;
            req.header.size = (uint)Marshal.SizeOf(typeof(SetDpiScale));
            req.header.adapterId = display.AdapterId;
            req.header.id = display.SourceId;
            req.scaleRel = target - Array.IndexOf(Values, display.Recommended);
            int err = SetDeviceInfo(ref req);
            if (err != 0) throw new Win32Exception(err);
        }
    }
}
'@
}

function Get-TargetDisplays {
    $all = [DisplayScale.Native]::GetDisplays()
    if ($Display -eq 0) { return $all }
    $match = $all | Where-Object { $_.Number -eq $Display }
    if (-not $match) { throw "Display $Display nahi mila. Available: 1..$($all.Count)" }
    return $match
}

function Set-Scale([int]$Percent) {
    foreach ($d in Get-TargetDisplays) {
        if ($d.Current -ne $Percent) { [DisplayScale.Native]::SetScale($d, $Percent) }
    }
}

function Show-Error([string]$Message) {
    Add-Type -AssemblyName System.Windows.Forms
    [void][System.Windows.Forms.MessageBox]::Show($Message, 'Display Scale', 'OK', 'Error')
}

function Show-Gui {
    Add-Type -AssemblyName System.Windows.Forms, System.Drawing
    [System.Windows.Forms.Application]::EnableVisualStyles()

    $bg      = [System.Drawing.Color]::FromArgb(32, 32, 32)
    $card    = [System.Drawing.Color]::FromArgb(45, 45, 45)
    $accent  = [System.Drawing.Color]::FromArgb(230, 160, 230)
    $text    = [System.Drawing.Color]::White
    $subtext = [System.Drawing.Color]::FromArgb(180, 180, 180)
    $font    = New-Object System.Drawing.Font('Segoe UI', 10)

    $form = New-Object System.Windows.Forms.Form
    $form.Text = 'Display Scale'
    $form.ClientSize = New-Object System.Drawing.Size(360, 300)
    $form.FormBorderStyle = 'FixedSingle'
    $form.MaximizeBox = $false
    $form.StartPosition = 'CenterScreen'
    $form.TopMost = $true
    $form.KeyPreview = $true
    $form.BackColor = $bg
    $form.ForeColor = $text
    $form.Font = $font

    $title = New-Object System.Windows.Forms.Label
    $title.Text = 'Scale'
    $title.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 14)
    $title.AutoSize = $true
    $title.Location = New-Object System.Drawing.Point(16, 12)
    $form.Controls.Add($title)

    $combo = New-Object System.Windows.Forms.ComboBox
    $combo.DropDownStyle = 'DropDownList'
    $combo.FlatStyle = 'Flat'
    $combo.BackColor = $card
    $combo.ForeColor = $text
    $combo.Location = New-Object System.Drawing.Point(16, 50)
    $combo.Width = 328
    $form.Controls.Add($combo)

    $panel = New-Object System.Windows.Forms.FlowLayoutPanel
    $panel.Location = New-Object System.Drawing.Point(12, 88)
    $panel.Size = New-Object System.Drawing.Size(340, 168)
    $form.Controls.Add($panel)

    $status = New-Object System.Windows.Forms.Label
    $status.ForeColor = $subtext
    $status.AutoSize = $false
    $status.Location = New-Object System.Drawing.Point(16, 266)
    $status.Size = New-Object System.Drawing.Size(328, 24)
    $form.Controls.Add($status)

    $script:displays = @()

    $refresh = {
        $selected = [Math]::Max(0, $combo.SelectedIndex)
        $script:displays = @([DisplayScale.Native]::GetDisplays())

        $combo.Items.Clear()
        [void]$combo.Items.Add('Saare displays')
        foreach ($d in $script:displays) {
            $name = "Display $($d.Number)  ($($d.Resolution))"
            if ($d.Primary) { $name += '  - main' }
            [void]$combo.Items.Add($name)
        }
        $combo.SelectedIndex = [Math]::Min($selected, $combo.Items.Count - 1)
    }

    $drawButtons = {
        $panel.Controls.Clear()
        $chosen = if ($combo.SelectedIndex -le 0) { $script:displays } else { @($script:displays[$combo.SelectedIndex - 1]) }
        $max = ($chosen | Measure-Object -Property Maximum -Minimum).Minimum
        $current = @($chosen | Select-Object -ExpandProperty Current -Unique)
        $recommended = @($chosen | Select-Object -ExpandProperty Recommended -Unique)

        foreach ($v in [DisplayScale.Native]::Values) {
            if ($v -gt $max) { break }
            $btn = New-Object System.Windows.Forms.Button
            $btn.Text = if ($recommended.Count -eq 1 -and $recommended[0] -eq $v) { "$v%  (Rec.)" } else { "$v%" }
            $btn.Tag = $v
            $btn.Size = New-Object System.Drawing.Size(106, 48)
            $btn.FlatStyle = 'Flat'
            $btn.FlatAppearance.BorderSize = 0
            $btn.Cursor = 'Hand'
            if ($current.Count -eq 1 -and $current[0] -eq $v) {
                $btn.BackColor = $accent
                $btn.ForeColor = [System.Drawing.Color]::Black
            } else {
                $btn.BackColor = $card
                $btn.ForeColor = $text
            }
            $btn.Add_Click({
                try {
                    $percent = [int]$this.Tag
                    $targets = if ($combo.SelectedIndex -le 0) { $script:displays } else { @($script:displays[$combo.SelectedIndex - 1]) }
                    foreach ($d in $targets) {
                        if ($d.Current -ne $percent) { [DisplayScale.Native]::SetScale($d, $percent) }
                    }
                    & $refresh
                    $status.Text = "Scale $percent% set ho gaya."
                } catch {
                    $status.Text = "Error: $($_.Exception.Message)"
                }
            })
            $panel.Controls.Add($btn)
        }

        $now = if ($current.Count -eq 1) { "$($current[0])%" } else { 'mixed' }
        $status.Text = "Abhi: $now   |   Shortcut: 1 = 100%, 2 = 125%, Esc = band"
    }

    $combo.Add_SelectedIndexChanged({ & $drawButtons })

    $form.Add_KeyDown({
        $percent = switch ($_.KeyCode) {
            'D1' { 100 } 'NumPad1' { 100 }
            'D2' { 125 } 'NumPad2' { 125 }
            'D3' { 150 } 'NumPad3' { 150 }
            'D4' { 175 } 'NumPad4' { 175 }
            'Escape' { $form.Close(); return }
        }
        if ($percent) {
            $btn = $panel.Controls | Where-Object { [int]$_.Tag -eq $percent } | Select-Object -First 1
            if ($btn) { $btn.PerformClick() }
            $_.SuppressKeyPress = $true
        }
    })

    & $refresh
    [void]$form.ShowDialog()
}

try {
    if ($Get) {
        [DisplayScale.Native]::GetDisplays() | ForEach-Object {
            [pscustomobject]@{
                Display     = $_.Number
                Main        = $_.Primary
                Resolution  = $_.Resolution
                Current     = "$($_.Current)%"
                Recommended = "$($_.Recommended)%"
                Max         = "$($_.Maximum)%"
            }
        } | Format-Table -AutoSize
    } elseif ($Toggle) {
        $first = @(Get-TargetDisplays)[0]
        Set-Scale $(if ($first.Current -eq 100) { 125 } else { 100 })
    } elseif ($Scale -gt 0) {
        Set-Scale $Scale
    } else {
        Show-Gui
    }
} catch {
    # Shortcuts run with a hidden window, so surface errors as a message box.
    Show-Error $_.Exception.Message
    exit 1
}
