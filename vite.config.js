import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['.vercel.run', '.vercel.app', 'localhost']
  },
  preview: {
    allowedHosts: ['.vercel.run', '.vercel.app', 'localhost']
  }
});
