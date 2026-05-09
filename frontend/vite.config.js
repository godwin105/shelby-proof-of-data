import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],

  // Mark optional wallet dependencies as external
  // (Mizu, Telegram, old Aptos SDK — we don't use these)
  build: {
    rollupOptions: {
      external: [
        "@mizuwallet-sdk/core",
        "aptos",
        "@telegram-apps/bridge",
      ],
    },
  },

  optimizeDeps: {
    exclude: [
      "@mizuwallet-sdk/core",
      "@telegram-apps/bridge",
    ],
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});