# GestureControl Desktop — Setup Guide

## Tez Boshlash

### 1. Node.js O'rnatish
https://nodejs.org/ → LTS versiya

### 2. Dependencies O'rnatish
```bash
cd "path/to/gesturecontrol"
npm install
```

### 3. Development Ishga Tushirish
```bash
npm run dev-electron
```

Vite dev server (http://localhost:5173) + Electron window avtomatik ochiladi.

## npm Scripts

| Command | Tavsif |
|---------|--------|
| `npm run dev` | Vite dev only |
| `npm run dev-electron` | Vite + Electron |
| `npm run build` | Production build |
| `npm run dist` | Windows installers |
| `npm run clean` | Clear builds |

## Fayl Tuzilma

- `src/` — React code
- `electron/` — Electron main + preload
- `dist/` — Vite output
- `dist-electron/` — Electron compiled JS
- `release/` — Final installers

## Debugging

Press **F12** — Developer tools Electron window'sida.

## Windows Installer

```bash
npm run dist
```

Natija: `release/GestureControl-*.exe`

---

Uzun docs: `README-DESKTOP.md`

