import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    {
      name: "patch-wasm-base64",
      enforce: "pre",
      transform(code) {
        if (
          code.includes("__toBinaryNode") &&
          code.includes('Buffer.from(base64, "base64")')
        ) {
          return {
            code: code.replace(
              `var __toBinaryNode = (base64) => new Uint8Array(Buffer.from(base64, "base64"));`,
              `var __toBinaryNode = (base64) => {
                const bin = atob(base64);
                const out = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
                return out;
              };`
            ),
            map: null,
          };
        }
      },
    },

    react(),

    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
    },
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