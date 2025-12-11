// @ts-ignore
import { defineConfig } from 'vite'
// @ts-ignore
import basicSsl from '@vitejs/plugin-basic-ssl'
import * as https from 'https'; // <-- TAMBAHKAN INI
const EXPRESS_BACKEND_URL = 'https://192.168.100.4:3006';
export default defineConfig({
  plugins: [
    basicSsl()
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://apk-api.apkonjac.com",
        changeOrigin: true,
        secure: true,          // ✅ KARENA BACKEND HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/scan-api": {
        // Hapus '/api/scan' dari target, cukup alamat dasar:
        target: EXPRESS_BACKEND_URL, 
        changeOrigin: true,
        secure: false, // ⬅️ COBA INI JIKA ADA MASALAH KONEKSI/SSL
        rewrite: (path) => path.replace(/^\/scan-api/, ""),
      },
      '/receipt': {
        target: EXPRESS_BACKEND_URL, // Ganti dengan alamat backend Express Anda
        changeOrigin: true,
        secure: false,
        // Rewrite tidak diperlukan jika Express juga menggunakan prefix /receipts
      },
    },
  },
});
