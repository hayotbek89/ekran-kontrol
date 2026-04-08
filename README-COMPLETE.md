# 🎮 GestureControl - Qo'l Harakatları bilan Kompyuter Boshqarish

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Apache%202.0-green)
![Platform](https://img.shields.io/badge/platform-Windows%20x64-blueviolet)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

> Kompyuteringizni **qo'l harakatlarini** (hand gestures) aniqlash orqali boshqaring. Sichqoncha va klaviaturaga ehtiyoj yo'q!

## 🌟 Xususiyatlar

- ✨ **Real-time Hand Detection** - MediaPipe Hands bilan qo'l aniqlash
- 👆 **5 Asosiy Harakat** - Pinch, Peace, Fist, Palm, Point
- 🎬 **Live Preview** - Kamera feedning haqiqiy vaqt ko'rish
- 🖥️ **Desktop App** - Windows'ning asosiy dasturi sifatida
- 🚀 **Auto-Update** - Yangi versiyalar avtomatik yuklab olinadi
- 🎨 **Modern UI** - Glassmorphism design bilan

## 📋 Tez Boshlash

### Talablar (Requirements)

- **Windows 10/11** (x64)
- **4GB RAM** (minimal)
- **WebCamera** (qo'l aniqlash uchun)
- **Internet** (birinchi launch va auto-update uchun)

### O'rnatish

#### Usul 1: Installer (Tavsiya qilingan)

1. [Latest Release](https://github.com/hayotbek89/ekran-kontrol/releases) ga o'ting
2. `GestureControl Setup 1.0.0.exe` yuklab oling
3. O'rnatish protsesini yo'ldagni bosib davom eting
4. Desktop'da yorliq topiladi

#### Usul 2: Portable Executable

1. [Latest Release](https://github.com/hayotbek89/ekran-kontrol/releases) ga o'ting
2. `GestureControl 1.0.0.exe` yuklab oling (o'rnatish kerak emas!)
3. Bevosita ishga tushiring

### Birinchi Ishlatish

```bash
# Dasturni ochish:
1. Desktop'dagi GestureControl yorlig'iga bosing
   YOKI
2. Program Files'dan direct ishga tushiring

# Kamerani taxing:
- Dastur kamera uchun ruxsat so'radi
- "Allow" tugmasini bosing
- Yashil nuqta = kamera ishmoqda

# Harakatlash:
- Kamerani old tarafga qarab o'tiring
- Qo'lingizni ko'rsating
- Qo'l ekranda ko'rinishi kerak

# Harakati aniqlash:
- Haraka bajargan kuni UI ozgaradi
- Buyruq bajarila boshladi
```

## 🎯 Harakatlar

| Harakat | Tasvir | Buyruq | Icon |
|---------|--------|---------|------|
| **Point** | Ko'rsatkich barmog'ini ko'rsating | Mishka o'tkazish | 👆 |
| **Pinch** | Barmog' va bosh barmog'ni tegizish | Bosish (Click) | ✌️ |
| **Peace** | Ikki barmoq ochiq | Oyna o'tkazish | ✌️ |
| **Fist** | Musht tugatish | Skrinshot | ✊ |
| **Palm** | Kaft ochiq, barma ochiq | Pause/Play | 🤚 |

## 🛠️ Texnikaviy Detallar

### Texnologiyalar

- **Frontend**: React 19 + TypeScript
- **Backend**: Electron 33.4
- **ML Model**: MediaPipe Hands
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Desktop**: Electron Builder

### Arxitektura

```
gesturecontrol/
├── src/
│   ├── App.tsx              ← Main React component
│   ├── UpdateNotifier.tsx   ← Auto-update UI
│   ├── main.tsx
│   └── index.css
├── electron/
│   ├── main.ts              ← Electron main process
│   └── preload.ts           ← IPC bridge
├── build-electron.mjs       ← Electron compiler
└── vite.config.ts          ← Vite config
```

### Performance

- **CPU Usage**: ~12%
- **Memory**: ~200MB
- **Latency**: 14ms
- **FPS**: 30fps

## 🔧 Ishlab Chiqarish

### Setup (O'rnatish)

```bash
# Dependencies o'rnatish
npm install

# Development server (port 5173)
npm run dev

# Electron + Vite
npm run dev-electron
```

### Build

```bash
# Production build
npm run build

# Build fayllarini ko'rish
ls dist/          # React bundle
ls dist-electron/ # Electron code
```

### Release (Rilis Qilish)

Qo'llanma uchun: [RELEASE-GUIDE.md](./RELEASE-GUIDE.md)

```bash
# 1. GitHub Token yaratish
# https://github.com/settings/tokens/new

# 2. .env faylida token'ni o'rnatish
echo "GH_TOKEN=ghp_xxxx" > .env

# 3. Version bump
npm version patch

# 4. Release qilish
npm run dist

# 5. GitHub Releases'da tekshirish
# https://github.com/hayotbek89/ekran-kontrol/releases
```

## 🚀 Auto-Update

Dastur avtomatik yangi versiyalarni tekshiradi va yuklab oladi.

### Qanday Ishlaydi?

1. ✅ Dastur ishga tushganda → GitHub'ni tekshiradi
2. 📦 Yangi versiya borsa → Foydalanuvchiga bildirishnoma
3. ⬇️ Download qilish → Fonda yuklanadi
4. 🔄 Download tugaganda → Restart va install taklif
5. ✨ Yangi version ishlaydi

### Disable Qilish

```typescript
// electron/main.ts'da
// 10-qatorni comment qiling:
// const { autoUpdater: updater } = await import('electron-updater');
```

## 📖 Dokumentatsiya

- [AUTO-UPDATE-GUIDE.md](./AUTO-UPDATE-GUIDE.md) - Auto-update setup
- [RELEASE-GUIDE.md](./RELEASE-GUIDE.md) - Release va deployment
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [README-DESKTOP.md](./README-DESKTOP.md) - Desktop build guide

## 🐛 Xatolar va Takliflar

### Issue Bildir

```bash
# GitHub Issues'da yozing:
https://github.com/hayotbek89/ekran-kontrol/issues/new
```

### Debugging

```typescript
// electron/main.ts'da debug mode:
if (isDev) {
  mainWindow.webContents.openDevTools();
}

// Auto-update debug:
autoUpdater.logger = console;
```

## 📊 Statistics

```
📊 Project Stats:
├── Source Lines:     2000+
├── Dependencies:     18
├── Build Size:       401 KB (gzipped: 130 KB)
├── App Size:         ~200 MB (installer)
└── Supported OS:     Windows 10/11 (x64)
```

## 🤝 Contributing (Hissalashmoq)

PR'lar hamisha xush keladi! Qadamlar:

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing`)
3. Commits qiling (`git commit -am 'Add amazing feature'`)
4. Push qiling (`git push origin feature/amazing`)
5. Pull Request yarating

## 📄 License

Apache License 2.0 - [LICENSE](./LICENSE) faylini o'qing

## 🙏 Rahmat

- [MediaPipe](https://mediapipe.dev/) - Hand detection
- [Electron](https://www.electronjs.org/) - Desktop framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Aloqa

- 🐙 **GitHub**: [hayotbek89/ekran-kontrol](https://github.com/hayotbek89/ekran-kontrol)
- 📧 **Email**: hayotbek89@gmail.com
- 🐦 **Issues**: [GitHub Issues](https://github.com/hayotbek89/ekran-kontrol/issues)

---

<div align="center">

**⭐ Agar yoqsa, star berish unutmang!**

Made with ❤️ in Uzbekistan 🇺🇿

</div>

