import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["defaults", "not IE 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // Polyfill cho async/await
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: [".ngrok-free.app"],
  },
  build: {
    manifest: true,
  },
});
