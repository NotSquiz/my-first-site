// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for assets
  base: '/',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },

  // Development server settings
  server: {
    port: 3000,
    open: true
  },

  // Configure path resolution
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
