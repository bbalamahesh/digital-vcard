import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Three pages: your card (/), cards other people make (/card/) and the editor (/create/)
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        card: fileURLToPath(new URL("./card/index.html", import.meta.url)),
        create: fileURLToPath(new URL("./create/index.html", import.meta.url)),
      },
    },
  },
  resolve: {
    alias: { "@shared": fileURLToPath(new URL("./shared/index.ts", import.meta.url)) },
  },
});
