import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5000, // Specify the port
    open: true, // Open the browser automatically on startup
  },
  plugins: [react(), tailwindcss()],
});
