# Changelog - GestureControl

Barcha muhim o'zgarishlar bu fayilda qayd etiladi.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) asosida.

---

## [1.0.0] - 2026-04-08

### Added (Qo'shildi)

✨ **Core Features:**
- Qo'l harakatlarini aniqlash (Hand gesture detection)
- 5 asosiy harakat: Pinch, Peace, Fist, Palm, Point
- Real-time camera feed va gesture visualization
- Desktop application (Electron-based)
- Auto-update functionality

🖥️ **UI/UX:**
- Modern glassmorphism design
- Smooth animations va transitions
- Real-time gesture feedback
- System status monitoring
- Settings panel

🔧 **Technical:**
- MediaPipe Hands integration
- Electron 33.4.11 support
- React 19 + TypeScript
- Tailwind CSS styling
- Vite build system

🚀 **Deployment:**
- GitHub Actions compatible
- Auto-update via GitHub Releases
- NSIS installer
- Portable executable
- Windows x64 support

### Fixed (Tuzatildi)

- Dynamic require of 'fs' error (ESM compatibility)
- Auto-updater module loading in production

### Known Issues (Bilgan Muammolar)

- MediaPipe hands model ishlatish uchun internet kerak
- Camera resolution 1280x720 optimal
- Minimal CPU usage: 12%, Latency: 14ms

---

## Upcoming Features (Kelgusi Xususiyatlar)

- [ ] Gesture customization
- [ ] Keyboard shortcuts mapping
- [ ] Multi-hand support optimization
- [ ] macOS support
- [ ] Linux support
- [ ] Settings persistence
- [ ] Telemetry analytics
- [ ] Dark/Light theme toggle

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-04-08 | Initial release with core gesture control |

---

## Migration Guide

### Upgrading from 0.x to 1.0.0

**Breaking Changes:** Yo'q (Birinchi releas)

**Installation:**
```bash
# Auto-update qilsa, dasturni qayta ishga tushirish kerak
```

---

## Release Process (Rilis Jarayoni)

### For Developers:

```bash
# 1. Version bump
npm version patch|minor|major

# 2. Build
npm run build

# 3. Release
npm run dist

# 4. Verify
# GitHub Releases'da tekshirish
```

---

## Support & Feedback

- 🐛 **Bugs:** GitHub Issues'da xato bildir
- 💡 **Ideas:** Yangi xususiyat taklif qilish
- 📧 **Contact:** Loyiha asosiy sahifasiga qarang

