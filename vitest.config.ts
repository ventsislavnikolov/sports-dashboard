import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  coverage: {
    provider: "v8",
    reporter: ["text", "html"],
    thresholds: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
});
