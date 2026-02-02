// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       // Ab hum 'client' ke andar hi hain, toh seedha 'src' par point karein
//       "@": path.resolve(__dirname, "./src"),
//       // Shared folder 'client' se ek level piche hai
//       "@shared": path.resolve(__dirname, "./shared"),
//       "@assets": path.resolve(__dirname, "../attached_assets"),
//     },
//   },
//   // Root ab yahi folder hai jahan config file hai
//   root: path.resolve(__dirname),
//   build: {
//     // Build output ko 'client' ke andar hi 'dist' mein rakhein
//     outDir: path.resolve(__dirname, "dist"),
//     emptyOutDir: true,
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     fs: {
//       strict: false,
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0", // 👈 Docker container ke bahar access dene ke liye zaroori hai
    port: 5173,
    proxy: {
      "/api": {
        // 🚀 FIX: localhost ki jagah 'backend' (jo docker-compose mein service name hai)
        target: "http://backend:5000", 
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: false,
    },
  },
});