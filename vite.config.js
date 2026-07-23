import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['.vercel.run', '.vercel.app', 'localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    allowedHosts: ['.vercel.run', '.vercel.app', 'localhost'],
  },
});
