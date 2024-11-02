import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"


export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    },
    host: '0.0.0.0',
        port: 3000,
        https: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
