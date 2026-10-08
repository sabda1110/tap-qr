import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      // Firebase's CommonJS dependencies resolve bundled proto files via __dirname.
      rollupConfig: {
        external: [
          /^@sentry\//,
          /^firebase-admin(?:\/|$)/,
          /^@google-cloud\/firestore(?:\/|$)/,
        ],
      },
      traceDeps: ["firebase-admin", "@google-cloud/firestore*"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  preview: {
    allowedHosts: [".ngrok-free.app"],
  },
});

export default config;
