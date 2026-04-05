import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    exclude: ["**/node_modules/**", "e2e/**"],
  },
  coverage: {
    provider: "v8",
    reporter: ["text", "html"],
    all: false,
    exclude: ["src/mocks/**", "src/test/**", "**/*.d.ts"],
    thresholds: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
});
