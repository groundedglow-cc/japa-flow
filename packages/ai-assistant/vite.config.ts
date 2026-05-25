import { defineConfig } from "vite";
import { resolve } from "node:path";

// Build three entries:
//   - react   : importable as @japaflow/ai-assistant/react (Preact under the hood via compat alias)
//   - element : registers <japa-ai-assistant> custom element, the entry JapaFlow main app uses
//   - protocol: framework-agnostic types/defaults
//
// react/react-dom imports are aliased to preact/compat so @ai-sdk/react's
// useChat hooks run on Preact, producing a small bundle (~3KB runtime).
// For v0.1.10 MVP we inline preact into every entry so consumers don't need
// to wire up bare-specifier resolution. The .11 cycle can revisit externalising.
export default defineConfig({
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  define: {
    // Replace bare process.env.NODE_ENV references (used by preact, swr, ai-sdk)
    // so the bundle runs in a plain browser without a Node polyfill.
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "es2020",
    minify: "esbuild",
    lib: {
      entry: {
        react: resolve(__dirname, "src/react/index.ts"),
        element: resolve(__dirname, "src/element/index.ts"),
        protocol: resolve(__dirname, "src/protocol/index.ts"),
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
  },
});
