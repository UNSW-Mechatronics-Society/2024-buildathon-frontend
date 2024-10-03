import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
config();

const isProd = process.env.NODE_ENV !== "development";

// https://vitejs.dev/config/
export default defineConfig({
  base: isProd ? "/2024-buildathon-frontend/" : "",
  plugins: [react()],
  define: {
    "process.env": process.env,
    isProd,
  },
});
