import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  // Worker entrypoint; types are checked via `tsc -b`. DTS emit breaks on type-only workspace imports.
  dts: false,
  deps: {
    alwaysBundle: [/@cornwall-ponds\/.*/],
  },
});
