import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const devApiPort = process.env.VITE_DEV_API_PORT || 3001

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    include: ["src/**/*.test.js", "server/**/*.test.js"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  server: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${devApiPort}`,
        changeOrigin: true,
      },
    },
  },
})
