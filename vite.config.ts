import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      hmr: true,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    // Electron main process va native modullar uchun
    ssr: {
      external: ['fs', 'path', 'os', 'child_process', 'electron', 'electron-updater']
    }
  };
});
