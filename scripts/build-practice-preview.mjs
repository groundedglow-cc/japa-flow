import { build } from "esbuild";

await build({
  entryPoints: ["practice/react/entry.jsx"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  outfile: "practice/dist/practice-preview-react.js",
  jsx: "automatic",
  sourcemap: false,
  logLevel: "info"
});
