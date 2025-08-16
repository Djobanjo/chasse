import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['c8f09ead5601.ngrok-free.app','localhost']
  }
})
