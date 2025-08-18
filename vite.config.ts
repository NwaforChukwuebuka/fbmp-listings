import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure consistent builds across platforms
    target: "es2020",
    // Disable source maps in production for smaller bundle
    sourcemap: mode === "development",
    // Ensure proper chunking
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Ensure Vite works well in CI/CD environments
  clearScreen: false,
}));
