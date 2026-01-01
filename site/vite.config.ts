import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: { 
    //allowedHosts: [`20305a23a1a2.ngrok-free.app`],
    allowedHosts: [".ngrok-free.app"],
  }
});
