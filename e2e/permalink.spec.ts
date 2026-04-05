import { test, expect } from "@playwright/test";

test.describe("Permalink", () => {
  test("direct URL loads the correct fixture", async ({ page }) => {
    await page.goto("/fixture/1001");

    await expect(page.getByText("Liverpool").first()).toBeVisible();
    await expect(page.getByText("Tottenham").first()).toBeVisible();
    await expect(page.getByText("TOP 5 — PASSES")).toBeVisible();
  });

  test("page is usable at 1280px without horizontal scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/fixture/1001");

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
