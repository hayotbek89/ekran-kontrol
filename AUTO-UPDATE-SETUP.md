# 📦 GestureControl - Auto-Update Setup Guide

Bu dastur **electron-updater** ishlatadi. Auto-update uchun GitHub Releases'dan yangi versiya yuklaydi.

## 🚀 Auto-Update Qanday Ishlaydi?

1. **Foydalanuvchi application'ni ishga tushiradi**
2. **Dastur avtomatik yangilanish tekshiradi**
3. **Yangi versiya topilsa, foydalanuvchiga notification ko'rsatiladi**
4. **Yangilanish download bo'lsa, "Restart & Install" tugmasini bosishi mumkin**
5. **Dastur qayta ishga tushganda yangi versiya ishga tushadi**

---

## 🔧 Setup Qadamlar

### 1️⃣ GitHub Repository O'rnatish

GitHub'da yangi repo yarating:
```
https://github.com/YOUR-USERNAME/gesturecontrol
```

### 2️⃣ Package.json Update

`package.json`'da publish section o'zgartiramiz:

```json
"publish": {
  "provider": "github",
  "owner": "YOUR-GITHUB-USERNAME",
  "repo": "gesturecontrol",
  "releaseType": "release"
}
```

**YOUR-GITHUB-USERNAME** o'rniga o'zingizning GitHub username'ni qo'ying.

### 3️⃣ GitHub Access Token

Auto-update uchun GitHub token kerak. Terminal'da:

```bash
$env:GH_TOKEN="your-github-personal-access-token"
npm run dist
```

**Token yaratish:**
1. GitHub.com → Settings → Developer settings → Personal access tokens
2. "Generate new token" → Select scopes: `repo`, `workflow`
3. Token'ni copy qilib saqlang

### 4️⃣ Release Yaratish

Build qilgandan so'ng, GitHub Releases'da:
1. GitHub repo → "Releases" → "Create new release"
2. Tag version: `v1.0.1` (version increment)
3. Exe fayllarni upload qiling:
   - `GestureControl Setup 1.0.1.exe`
   - `GestureControl 1.0.1.exe`
4. "Publish release" bosing

### 5️⃣ Version Update

Yangi version qo'shish uchun `package.json` update qiling:

```json
"version": "1.0.1"
```

---

## 📋 Auto-Update Qanday Ishlashini Tekshirish

1. **Eski version ishga tushiring** (v1.0.0)
2. **Yangi version release qiling** (v1.0.1 - GitHub)
3. **Eski version'dagi app**da notification ko'rinadi
4. **"Update & Restart" bosing**
5. **App qayta ishga tushsa yangi version bo'ladi**

---

## 🔐 Security - Signature Verifikatsiyasi

**Tavsiya:** Exe fayllarini code sign qiling:

```bash
npm run dist -- --sign
```

Bu foydalanuvchiga app ishonchli ekanini ko'rsatadi.

---

## 🛠️ Tez Setting (Tezkor Test Uchun)

Agar GitHub setup qilmasdan test qilmoqchi bo'lsangiz:

```typescript
// main.ts'da
const isDev = true; // Auto-update disable bo'ladi
```

---

## 📊 Auto-Update Event'lari

### Update Available
```javascript
electron?.onUpdateAvailable?.(() => {
  console.log('Yangi version topildi!');
});
```

### Update Downloaded
```javascript
electron?.onUpdateDownloaded?.(() => {
  console.log('Yangilanish download qilindi!');
});
```

### Restart & Install
```javascript
electron?.restartApp?.();
```

---

## 🎯 Checklashnyi

- [ ] GitHub Repo yaratildi
- [ ] GitHub Token yaratildi
- [ ] package.json username'ni o'zgarttirdi
- [ ] Version increment qilindi
- [ ] Release GitHub'da publish qilindi
- [ ] Exe fayllar Release'ga upload qilindi
- [ ] Eski version'dan yangi version'ga update test qilindi

---

## 📝 Shlyoklar

1. **Har yangi version uchun release yarating** - GitHub'da yangi tag/release
2. **Version number'ni always increment qiling** - Semantic versioning (1.0.0 → 1.0.1)
3. **Release notes yozing** - Ne o'zgargan, nima to'g'rilangan
4. **Exe file'larni har vaqt upload qiling** - Release'ga assets

---

## ❓ FAQ

**Q: Auto-update hech qachon tekshirmaydimi?**
A: Dastur har 5 soatda tekshiradi. `autoUpdater.checkForUpdates()` bilan manual tekshirish mumkin.

**Q: Beta versions qo'shish mumkinmi?**
A: Ha! `releaseType: "prerelease"` qilib beta version'lar upload qilish mumkin.

**Q: Windows Defender xavf ko'rsatadimi?**
A: Yo'q, agar code sign qilsa (certificate bilan). Dev sign qilsa warning bo'ladi.

---

## 🔗 Foydalanuvchi Resources

- [electron-updater Docs](https://www.electron.build/auto-update)
- [GitHub Releases API](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

---

**Tayyorlangan:** GestureControl Development Team
**Oxirgi Update:** April 8, 2026

