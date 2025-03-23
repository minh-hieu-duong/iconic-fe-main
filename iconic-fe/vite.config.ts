import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["safari >= 12", "not IE 11"], // Cập nhật targets để bao gồm Safari 13
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // Polyfill cho async/await
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    port: 3000,
    allowedHosts: [".ngrok-free.app"],
  },
  build: {
    target: "es2019",
  },
});
