import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const isDev = process.env.NODE_ENV === "development";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
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
    }
  })],
})
