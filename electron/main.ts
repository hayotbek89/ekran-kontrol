import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// electron-updater optional (production only)
let autoUpdater: any = null;

// Async updater import
async function initializeUpdater() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      const { autoUpdater: updater } = await import('electron-updater');
      autoUpdater = updater;
    }
  } catch (e) {
    console.warn('electron-updater not available:', e);
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if running in dev or production
const isDev = process.env.NODE_ENV === 'development' ||
  (process.defaultApp || /[\\/]app\.asar[\\/]/.test(process.execPath));

let mainWindow: BrowserWindow | null = null;
let gestureProcess: any = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Preload only in production
      ...(isDev ? {} : { preload: path.join(__dirname, 'preload.js') })
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  await initializeUpdater();
  createWindow();

  // Configure auto-updater (production only)
  if (!isDev && autoUpdater) {
    try {
      autoUpdater.checkForUpdatesAndNotify();

      autoUpdater.on('update-available', () => {
        console.log('📦 New update available!');
        if (mainWindow) {
          mainWindow.webContents.send('update-available');
        }
      });

      autoUpdater.on('update-downloaded', () => {
        console.log('✅ Update downloaded');
        if (mainWindow) {
          mainWindow.webContents.send('update-downloaded');
        }
      });

      autoUpdater.on('error', (error: any) => {
        console.error('Update error:', error);
      });
    } catch (e) {
      console.warn('Auto-update setup failed:', e);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Create application menu
const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'F12',
        role: 'toggleDevTools',
      },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// IPC handlers for camera and system info
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

// Gesture control handlers
ipcMain.handle('start-gesture-control', () => {
  console.log('📍 Gesture control starting...');
  // Gesture control will be handled by Python script
  return { status: 'Gesture control enabled' };
});

ipcMain.handle('stop-gesture-control', () => {
  console.log('📍 Gesture control stopping...');
  if (gestureProcess) {
    gestureProcess.kill();
    gestureProcess = null;
  }
  return { status: 'Gesture control disabled' };
});

ipcMain.handle('execute-gesture-action', async (event, action: string) => {
  console.log(`🎯 Gesture action: ${action}`);
  return { executed: true, action };
});

// Auto-update IPC handlers
ipcMain.handle('check-for-updates', async () => {
  if (!isDev && autoUpdater) {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (e) {
      console.warn('Check updates failed:', e);
      return { updateAvailable: false };
    }
  }
  return { updateAvailable: false };
});

ipcMain.handle('restart-app', () => {
  if (autoUpdater) {
    try {
      autoUpdater.quitAndInstall();
    } catch (e) {
      console.warn('Restart failed:', e);
      app.quit();
    }
  }
});

