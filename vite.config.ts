import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Define the base URL based on the mode
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/convo" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
}));
