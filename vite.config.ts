import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    watch: { ignored: ['**/.webview2-*/**', '**/src-tauri/**', '**/WinUI-Gallery/**', '**/microsoft-ui-xaml/**', '**/visual-evidence/**'] },
  },
  optimizeDeps: { entries: ['index.html'] },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
