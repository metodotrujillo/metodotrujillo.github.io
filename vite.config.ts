import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/calculadoras-trujillo/',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022' },
});
