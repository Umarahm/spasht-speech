import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "frontend/client",
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: "../../backend/dist/spa",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/client"),
      "@shared": path.resolve(__dirname, "./backend/shared"),
    },
  },
});
