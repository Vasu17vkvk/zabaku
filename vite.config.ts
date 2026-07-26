import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [tailwindcss(), tsConfigPaths()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 5173,
    },
  },
  routers: {
    server: {
      entry: "./src/server.ts",
    },
  },
});
