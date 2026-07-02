import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the built assets resolve correctly whether the app is
  // hosted at a sub-path (GitHub Pages: /Architect-job-hunting/) or the root
  // (Netlify / local preview).
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
})
