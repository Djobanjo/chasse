import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/chasse/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['14dada12f091.ngrok-free.app','localhost']
  }
})
