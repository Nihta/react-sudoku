import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// @ts-ignore
const isDev = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: isDev,
              fileName: isDev,
            },
          ],
        ],
      },
    }),
    eslint(),
  ],
});
