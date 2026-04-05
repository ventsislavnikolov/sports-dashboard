import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
    env: {
      VITE_USE_MOCKS: "true",
      VITE_API_FOOTBALL_KEY: "test",
      VITE_API_BASE_URL: "https://v3.football.api-sports.io",
    },
  },
});
