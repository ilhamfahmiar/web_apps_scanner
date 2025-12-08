// @ts-ignore
import { defineConfig } from 'vite'
// @ts-ignore
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    basicSsl()
  ],
  server: {
    // https: true, // WAJIB diset ke true
    host: true    // Agar bisa diakses dari network/ngrok
  }
})