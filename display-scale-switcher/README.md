# 🖥️ Display Scale Switcher (Windows 10/11)

Desktop se seedha display scale badlo: **100%** ya **125%**, ek click ya ek hotkey se.
`Settings > System > Display > Scale` kholne ki zarurat nahi, aur sign-out bhi nahi karna padta.

## Install (ek baar)

1. Ye `display-scale-switcher` folder download karo.
2. **`Install.bat`** par double-click karo.
3. Desktop par 3 shortcuts ban jayenge:

| Shortcut        | Kaam                                   | Hotkey       |
|-----------------|----------------------------------------|--------------|
| `Display 100%`  | Scale 100% kar deta hai                | `Ctrl+Alt+1` |
| `Display 125%`  | Scale 125% kar deta hai                | `Ctrl+Alt+2` |
| `Display Scale` | Buttons wala window (100/125/150/175%) | `Ctrl+Alt+0` |

Window khula ho to keyboard se bhi chalega: `1` = 100%, `2` = 125%, `3` = 150%, `4` = 175%, `Esc` = band.

Hatana ho to **`Uninstall.bat`** chalao.

## Command line

```powershell
.\DisplayScale.ps1                   # buttons wala window
.\DisplayScale.ps1 -Scale 125        # saare displays 125%
.\DisplayScale.ps1 -Toggle           # 100% <-> 125%
.\DisplayScale.ps1 -Get              # abhi kitna scale hai
.\DisplayScale.ps1 -Scale 100 -Display 2   # sirf display #2
```

## Kaise kaam karta hai

Windows Settings app jo `DisplayConfigSetDeviceInfo` call karta hai, wahi ye script bhi karti hai,
isliye change turant lagta hai. Koi extra software install nahi hota; sirf built-in PowerShell use hota hai.
Jo scale tumhari screen support nahi karti (jaise 1080p par 200%), woh button nahi dikhega.
