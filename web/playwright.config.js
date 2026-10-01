import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
  },
  projects: [{ name: "chomium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run api:e2e",
      cdw: "..",
      url: "http://localhost:3000/produtos",
      reuseExistingServer: false, //verificar se a imsgancia rofadndo vsi da rpoblema
    },
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: false,
    },
  ],
});
