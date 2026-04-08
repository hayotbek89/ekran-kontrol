# GestureControl Auto-Update Setup Guide

## 🔐 GitHub Token Yaratish

Auto-update xususiyatini ishga tushirish uchun GitHub Personal Access Token (PAT) kerak. Quyidagi qadamlarni bajaring:

### 1️⃣ GitHub Tokens Sahifasiga O'ting
https://github.com/settings/tokens/new

### 2️⃣ Token Sozlamalarini To'g'rilang

**Token Name (Nom):**
```
GestureControl Auto-Update Token
```

**Expiration (Muddati):**
- `No expiration` (Cheksiz) yoki kerakli muddatni tanlang

**Scopes (Ruxsatlar) - Quyidagilarni belgilang:**
```
✅ repo (full control of private repositories)
   - repo:status
   - repo_deployment
   - public_repo
   - repo:invite
   - security_events

✅ releases (write access to releases)
   - read:repo_hooks
   - write:repo_hooks
```

### 3️⃣ Token'ni Nusxalash
"Generate token" tugmasini bosing va token'ni NUSXALANG

⚠️ **MUHIM:** Token faqat bir marta ko'rsatiladi! Uni xavfsiz joyga saqlang.

### 4️⃣ `.env` Fayliga Qo'shish

Loyiha root'da `.env` fayline token'ni qo'shing:

```env
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5️⃣ Release Qilish

Token'ni o'rnatganidan so'ng, release qiling:

```bash
npm run build
npm run dist
```

Electron-builder release fayllarini GitHub Releases'da avtomatik joylashtiradi.

### 6️⃣ Auto-Update Tekshirish

Dastur production rejada yangi versiyalarni avtomatik qidiradi:

```typescript
// electron/main.ts'da auto-update konfig:
autoUpdater.checkForUpdatesAndNotify();
```

---

## 📋 Auto-Update Qanday Ishlaydi?

1. **Dastur Ishga Tushganda:**
   - GitHub Releases'ni tekshiradi
   - Yangi versiya borligini aniqlaydi

2. **Yangi Versiya Topilsa:**
   - Foydalanuvchiga bildirishnoma yuboradi
   - Yangi versiyani yuklab oladi

3. **Download Tugaganda:**
   - "Restart va Install" tugmasini ko'rsatadi
   - Foydalanuvchi tasdiqlasa, o'rnatiladi

---

## 🔧 Version Bump Qilish

Yangi release'ni yaratish uchun:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

Keyin:
```bash
npm run build
npm run dist
git push --tags
```

---

## 🚀 Production Deployment

1. **Token o'rnatish:** `.env` fayliga `GH_TOKEN` qo'shing
2. **Build qilish:** `npm run build`
3. **Release qilish:** `npm run dist`
4. **GitHub Releases'ni tekshirish:** https://github.com/hayotbek89/ekran-kontrol/releases

Auto-updater barcha foydalanuvchilarga yangi versiyani avtomatik yuboradi!

---

## ⚠️ Security Tips (Xavfsizlik Maslahatlar)

✅ `.env` faylini `.gitignore`'da saqlang (allaqachon qilingan)
✅ Token'ni hech kimga bermang
✅ Token'ni GitHub Secrets'da saqlang (agar CI/CD ishlatsa)
✅ Token muddati ichida tugasa, yangi token yarating

---

## 🔗 Foydalı Havolalar

- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [electron-updater Documentation](https://www.electron.build/auto-update)
- [Electron Builder Releases](https://www.electron.build/configuration/publish)

