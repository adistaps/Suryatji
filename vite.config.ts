import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/komerce': {
        target: 'https://rajaongkir.komerce.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/komerce/, '/api/v1'),
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
