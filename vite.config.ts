import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so it works when hosted at any subpath (GitHub Pages, custom domain, etc.)
  base: './',
});
