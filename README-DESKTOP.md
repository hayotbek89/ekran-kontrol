# GestureControl — Desktop Dastur

## O'rnatish va ishga tushirish

### Talablar
- **Node.js** v16 yoki undan yuqori
- **npm** yoki **yarn**
- **Windows**, **macOS** yoki **Linux**

### Lokal Ishga Tushirish

**1. Dependencies o'rnatish:**
```bash
npm install
```

**2. Development rejasida ishlatish (hot-reload):**
```bash
npm run dev-electron
```

Bu 2 ta jarayonni bir vaqtning o'zida ishga tushiradi:
- Vite dev server (http://localhost:5173)
- Electron app (window ochiladi)

**3. Production build yaratish:**
```bash
npm run build
```

Bu Vite dist va Electron binary fayllarini yaratadi.

**4. Desktop installer yaratish (Windows):**
```bash
npm run dist
```

Installer `release/` papkasida bo'ladi.

## Papkalar Tuzilmasi

```
gesturecontrol/
├── src/                 # React komponentlar va UI
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── electron/            # Electron main process
│   ├── main.ts          # App window va menu
│   └── preload.ts       # IPC bridge (security)
├── dist/                # Vite build output (HTML/CSS/JS)
├── dist-electron/       # Compiled Electron files
├── package.json         # Dependencies va scripts
├── vite.config.ts       # Vite konfiguratsiyasi
├── tsconfig.json        # TypeScript sozlamalari
├── index.html           # Entry HTML
└── build-electron.mjs   # Electron build script
```

## Script'lar

| Command | Tavsif |
|---------|--------|
| `npm run dev` | Faqat Vite dev server (web) |
| `npm run dev-electron` | Electron app bilan dev |
| `npm run build` | Production build (Vite + Electron) |
| `npm run build-vite` | Faqat Vite build |
| `npm run build-electron` | Faqat Electron compile |
| `npm run dist` | NSIS installer + portable exe |
| `npm run pack` | Paketni test qilish (installer bo'lmaydi) |
| `npm run preview` | Built app'ni preview qilish |
| `npm run clean` | Build fayllarini o'chirish |
| `npm run lint` | TypeScript type check |

## Xavfsizlik Xususiyatlari

- ✅ **Context Isolation** — Electron main process va renderer ajratilgan
- ✅ **Preload Script** — IPC orqali xavfsiz API access
- ✅ **Sandbox Mode** — Renderer process sandboxda ishleydi
- ✅ **No Node Integration** — Client-side Node.js access yo'q

## Kamera Ruxsati

Electron app kamera qullanish uchun Windows ruxsatini so'raydi (birinchi marta). Agar ruxsat bermasangiz:

1. **Windows Settings** → **Privacy & security** → **Camera**
2. **Qo'l Harakatlari Boshqaruvi** uchun toggle yoqing

## Packaging Uchun Windows Aloqa

NSIS installer o'rnatish uchun Windows'da:
1. Visual Studio Build Tools (yoki msvc compiler)
2. WiX Toolset (optional — imzoli installer uchun)

Agar installer e'tiborga olinmasa, `portable` version yarating:
```bash
npm run dist -- --win portable
```

## Masalalar va Debugging

**Dev tools ochish:**
- Press `F12` dev window'dan yoki menu → View → Toggle Developer Tools

**Console loglar:**
- `npm run dev-electron` chiqaruvida Electron console ko'rinadi

**Hot-reload muamolari:**
- Vite dev server ishga tushganini tekshiring (http://localhost:5173)
- Electron browserWindowni to'xtatib, `npm run dev-electron` takrorlang

## Keyingi Qadamlar (Ihtiyoriy)

1. **Real Gesture Recognition** qo'shish:
   - MediaPipe Hands yoki TensorFlow.js Hand Pose integratsiyasi
   - Landmark detection va gesture classification

2. **System API Integration:**
   - Mouse/keyboard control (uiohook)
   - System screenshot yoki recording

3. **Auto-Update** qo'shish:
   - electron-updater bilan auto-update framework

4. **App Signing**:
   - Production uchun code-signing certificate

## Yordam va Savollar

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)

---

**Versiya:** 1.0.0  
**Oxirgi yangilash:** 2026-04-08

