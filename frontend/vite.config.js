// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//     server: {
//     host: "0.0.0.0",
//     port: 5173,
//     hmr: {
//       host: "10.100.165.184",
//       port: 5173,
//     }
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: "10.100.165.184",
      port: 5173,
    },
  },
});