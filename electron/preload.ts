import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  startGestureControl: () => ipcRenderer.invoke('start-gesture-control'),
  stopGestureControl: () => ipcRenderer.invoke('stop-gesture-control'),
  executeGestureAction: (action: string) => ipcRenderer.invoke('execute-gesture-action', action),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  restartApp: () => ipcRenderer.invoke('restart-app'),
  onUpdateAvailable: (callback: () => void) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update-downloaded', callback),
  platform: process.platform,
});

declare global {
  interface Window {
    electron: {
      getAppVersion: () => Promise<string>;
      getAppPath: () => Promise<string>;
      startGestureControl: () => Promise<any>;
      stopGestureControl: () => Promise<any>;
      executeGestureAction: (action: string) => Promise<any>;
      checkForUpdates: () => Promise<any>;
      restartApp: () => Promise<void>;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      platform: string;
    };
  }
}

