import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['6d90e0c7dfc0.ngrok-free.app','localhost']
  }
})
