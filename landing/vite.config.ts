import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * The marketing site is one page with in-page anchors, so it ships without a
 * router — nothing here depends on the app or the console.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 3002, host: true },
  preview: { port: 3002, host: true },
  build: { outDir: "dist", sourcemap: true },
});
