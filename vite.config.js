import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This allows external connections
    port: 3000,      // You can change this port if needed
    strictPort: true, // Exit if port is already in use
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
})
