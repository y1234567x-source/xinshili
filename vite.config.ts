import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { aiAnalyzeNarrativePlugin } from './vite-plugin-ai-narrative';

export default defineConfig({
  plugins: [react(), aiAnalyzeNarrativePlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@client': path.resolve(__dirname, 'client'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@server': path.resolve(__dirname, 'server'),
    },
  },
  define: {
    'process.env.CLIENT_BASE_PATH': JSON.stringify(''),
    'process.env': {},
  },
  build: {
    outDir: 'dist',
  },
});


