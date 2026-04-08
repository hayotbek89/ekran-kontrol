# 🚀 GestureControl Release & Distribution Guide

Bu qo'llanmada dasturni produksion rejada release qilish va auto-update qilish haqida ma'lumot berilgan.

---

## 📦 Tez Boshlash (Quick Start)

### 1️⃣ GitHub Token Yaratish

```bash
# GitHub'ga o'ting:
https://github.com/settings/tokens/new

# Token nomini ko'rsating:
GestureControl Auto-Update Token

# Expiration: No expiration (yoki kerakli vaqt)

# Scopes (Ruxsatlar):
✅ repo (full control)
✅ releases (write access)
```

### 2️⃣ Token'ni Loyihaga Qo'shish

``bash
# Loyiha root'da `.env` faylini yarating:
cat > .env << EOF
GH_TOKEN=ghp_YOUR_TOKEN_HERE
EOF
```

### 3️⃣ Version Bump Qilish

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Git tags'ni push qilish:
git push --tags
```

### 4️⃣ Build va Release Qilish

```bash
# Production build qilish:
npm run build

# Release qilish (exe fayllar GitHub Releases'da joylanadi):
npm run dist
```

---

## 🔐 GitHub Token Sozlamalari

### Ruxsatlar (Scopes)

**MUHIMLIK DARAJASI:** 🔴 YUQORI

Token quyidagi ruxsatlarni o'z ichiga olishi kerak:

```
✅ repo
   ├── repo:status (read & write)
   ├── repo_deployment (read & write)
   ├── public_repo
   ├── repo:invite
   └── security_events

✅ releases
   ├── read:repo_hooks
   └── write:repo_hooks
```

### Token Xavfsizligi

⚠️ **OGOHLANTIRISH:** Token sizning GitHub accountingizni to'liq nazoratida qiladi!

```
✅ DO:
   - .env faylini .gitignore'da saqlay
   - Token'ni hech kimga bermay
   - Token muddati va ruxsatlarini tekshiray
   - Token rotatsiyasini muntazam qiliy

❌ DON'T:
   - Token'ni GitHub'ga push qilmay
   - Token'ni kod ichiga yozib qolmay
   - Token'ni eski kompyuterlarda saqlamy
```

---

## 📋 Release Jarayoni

### Build Files (Qaysi fayllar Release'da bo'ladi):

```
release/
├── GestureControl Setup 1.0.0.exe      ← Windows NSIS Installer
├── GestureControl 1.0.0.exe            ← Portable Executable
└── latest.yml                          ← Auto-update manifesto
```

### Release Workflow (Ish oqimi):

```
1. Version Bump Qilish
   └─ npm version patch
      └─ Git tag yaratiladi
         
2. Build Qilish
   └─ npm run build
      └─ dist/ va dist-electron/ yaratiladi
         
3. Release Qilish
   └─ npm run dist
      └─ electron-builder fayllar yaratadi
         └─ GitHub API'ga yuklab oladi
            └─ Release'da ko'rinadi
               
4. Auto-Update
   └─ Foydalanuvchilar dasturni ochganda
      └─ yangi versiya tekshiriladi
         └─ Taklif ko'rsatiladi
            └─ Download va install qiladi
```

---

## 🔧 Amaliy Misol

### Yangi Version Release Qilish

```bash
# 1. Token o'rnatish
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# 2. Version bump (1.0.0 -> 1.0.1)
npm version patch
# Package.json: "version": "1.0.1"
# Git commit va tag yaratiladi

# 3. Build qilish
npm run build

# 4. Release qilish
npm run dist
# Natija: release/ papkasida EXE fayllar

# 5. GitHub Releases'da ko'rish
# https://github.com/hayotbek89/ekran-kontrol/releases
```

---

## 📲 Auto-Update Qanday Ishlaydi?

### Dastur Ishga Tushganda (Startup):

```typescript
// electron/main.ts
if (!isDev && autoUpdater) {
  autoUpdater.checkForUpdatesAndNotify();
  // GitHub Releases'ni tekshiradi
}
```

### Yangi Versiya Topilsa:

1. **Update Available** - Foydalanuvchiga bildirishnoma
2. **Downloading** - Yangi version yuklab olinmoqda
3. **Downloaded** - Restart va install taklif
4. **Installed** - Yangi versiya tayyor

### User Interface:

```
┌─────────────────────────────────────────┐
│ 📦 Yangi Versiya Mavjud                │
│                                        │
│ Yangi version yuklanmoqda...          │
│                                        │
│ [Cancel] [Install Now]                │
└─────────────────────────────────────────┘

↓ Download tugaganda:

┌─────────────────────────────────────────┐
│ ✅ Update Tayyor!                       │
│                                        │
│ Dasturni qayta ishga tushirish kerak  │
│                                        │
│        [Qayta Ishga Tushirish]        │
└─────────────────────────────────────────┘
```

---

## 🎯 GitHub Actions (Optional - CI/CD)

Automatic release qilish uchun GitHub Actions ishlatish mumkin:

### `.github/workflows/release.yml` - Misal

```yaml
name: Auto Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Create Release
        run: npm run dist
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

---

## 🔍 Troubleshooting (Muammolarni Hal Qilish)

### Problem 1: Token Error

```
Error: Unable to find the required token
```

**Yechim:**
```bash
# .env faylida token borligini tekshirish
cat .env

# Token o'rnatish:
export GH_TOKEN="ghp_xxxx"
```

### Problem 2: Release Failed

```
Error: GitHub API rate limit exceeded
```

**Yechim:**
- Kecha kutib qayta urinish
- Yoki token'ni refresh qilish

### Problem 3: Auto-Update Not Working

```
// electron/main.ts'da DEBUG:
autoUpdater.logger = console;
```

---

## 📊 Versioning Strategy (Versiya Strategiyasi)

### Semantic Versioning: MAJOR.MINOR.PATCH

```
1.2.3
│ │ └─ PATCH    (1.2.0 → 1.2.1)  - Xatolarni tuzatish
│ └──── MINOR   (1.2.0 → 1.3.0)  - Yangi xususiyat
└────── MAJOR   (1.2.0 → 2.0.0)  - Asosiy o'zgarish
```

### Release Checklist:

```
□ Barcha testlar o'tdi
□ Version bump qilindi (npm version patch/minor/major)
□ CHANGELOG.md yangilandi
□ Git tags push qilindi
□ Build muvaffaqiyatli
□ Release fayllar GitHub'da joylandı
□ Auto-update ishlamoqda tekshirildi
```

---

## 🔗 Foydalı Havolalar

- [electron-updater docs](https://www.electron.build/auto-update)
- [Electron Builder](https://www.electron.build/)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Jami (Summary)

1. **GitHub Token** yarating
2. **npm version** bump qiling
3. **npm run build** qiling
4. **npm run dist** qiling
5. **GitHub Releases'da** natijani ko'ring
6. **Auto-update** avtomatik ishga tushadi! 🚀

---

**Savollar?** GitHub Issues'da yozib qoldiring!

