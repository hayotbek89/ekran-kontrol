import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create dist-electron directory if it doesn't exist
const distElectronDir = path.join(__dirname, 'dist-electron');
if (!fs.existsSync(distElectronDir)) {
  fs.mkdirSync(distElectronDir, { recursive: true });
}

const files = ['electron/main.ts', 'electron/preload.ts'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const outfile = path.join(distElectronDir, path.basename(file, '.ts') + '.js');

  esbuild.buildSync({
    entryPoints: [filePath],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile,
    external: ['electron', 'electron-updater', 'fs', 'path', 'os', 'child_process', 'graceful-fs'],
    logLevel: 'info',
  });
});

console.log('✓ Electron files compiled successfully to dist-electron/');

