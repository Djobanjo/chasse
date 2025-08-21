import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/chasse/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['67b1a013acc4.ngrok-free.app','localhost']
  }/*,
  build: {
    sourcemap: false // au cas ou activer
  }*/
})
