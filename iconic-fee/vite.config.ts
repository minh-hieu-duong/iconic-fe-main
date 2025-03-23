import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2019", // Hoặc thử es2018 nếu vẫn lỗi
  },
  server: {
    hmr: false, // Tắt Hot Module Reloading (có thể gây lỗi trên Safari cũ)
  },
});
