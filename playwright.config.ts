import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "pnpm dev --host 127.0.0.1",
    port: 3000,
    reuseExistingServer: true,
    env: {
      VITE_USE_MOCKS: "true",
      VITE_API_FOOTBALL_KEY: "test",
      VITE_API_BASE_URL: "https://v3.football.api-sports.io",
    },
  },
});
