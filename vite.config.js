import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import laravel from "laravel-vite-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_BACKEND_TARGET = "http://127.0.0.1:8000";
const DEFAULT_REVERB_TARGET = "http://127.0.0.1:8080";

function safeTarget(value, browserPort, fallback) {
  const candidate = String(value || fallback).trim();
  try {
    const parsed = new URL(candidate);
    const localHost =
      parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
    const targetPort = Number(
      parsed.port || (parsed.protocol === "https:" ? 443 : 80)
    );
    if (localHost && targetPort === browserPort) return fallback;
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const browserHost = env.VITE_DEV_BROWSER_HOST || "127.0.0.1";
  const browserPort = Number(env.VITE_DEV_BROWSER_PORT || 5173);
  const backendTarget = safeTarget(
    env.VITE_DEV_BACKEND_TARGET,
    browserPort,
    DEFAULT_BACKEND_TARGET
  );
  const reverbTarget = safeTarget(
    env.VITE_DEV_REVERB_TARGET,
    browserPort,
    DEFAULT_REVERB_TARGET
  );

  return {
    plugins: [
      laravel({
        // Entry point React — dikompilasi lalu diinjeksikan ke Blade
        input: ["resources/react/src/main.jsx"],
        refresh: true,
      }),
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        // Alias "@" mengarah ke folder src React
        "@": path.resolve(currentDir, "resources/react/src"),
      },
    },

    server: {
      host: browserHost,
      port: browserPort,
      strictPort: true,
      origin: `http://${browserHost}:${browserPort}`,
      hmr: {
        host: browserHost,
        port: browserPort,
      },
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        "/storage": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        "/app": {
          target: reverbTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },

    build: {
      // Output ke public/build — standar Laravel Vite Plugin
      outDir: "public/build",
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (
              id.includes("scheduler") ||
              (id.includes("node_modules/react") &&
                !id.includes("react-router"))
            )
              return "vendor-react";
            if (id.includes("react-router") || id.includes("history"))
              return "vendor-router";
            if (id.includes("firebase")) return "vendor-firebase";
            if (id.includes("@tanstack")) return "vendor-query";
            if (id.includes("@radix-ui") || id.includes("radix"))
              return "vendor-radix";
            if (id.includes("axios")) return "vendor-http";
            if (
              id.includes("laravel-echo") ||
              id.includes("pusher")
            )
              return "vendor-realtime";
            if (id.includes("leaflet")) return "vendor-leaflet";
            if (id.includes("html2canvas")) return "vendor-canvas";
            if (id.includes("recharts") || id.includes("d3"))
              return "vendor-charts";
            return undefined;
          },
        },
      },
    },
  };
});
