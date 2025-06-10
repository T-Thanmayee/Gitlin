import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 
  server: {
    // Ensure no proxy is set for /user/register
    proxy: {
      
    }, // Empty or remove if not needed
  },

})
