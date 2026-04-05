import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("selecting a match shows all cards", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Liverpool").click();

    await expect(page.getByText("TOP 5 — PASSES")).toBeVisible();
    await expect(page.getByText("TOP 5 — TACKLES")).toBeVisible();
    await expect(page.getByText("TOP 5 — DRIBBLE ATTEMPTS")).toBeVisible();
    await expect(page.getByText("TEAM STATS")).toBeVisible();
    await expect(page.getByText("SHOT COMPARE")).toBeVisible();
    await expect(page.getByText("PLAYER DETAIL")).toBeVisible();
  });

  test("match header shows correct teams and score", async ({ page }) => {
    await page.goto("/fixture/1001");

    await expect(page.getByText("Liverpool").first()).toBeVisible();
    await expect(page.getByText("Tottenham").first()).toBeVisible();
    await expect(page.getByText("1 – 0")).toBeVisible();
  });

  test("clicking a player shows their detail", async ({ page }) => {
    await page.goto("/fixture/1001");
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("button", { name: /Szoboszlai/ })
      .first()
      .click();

    await expect(page.getByText("PLAYER DETAIL")).toBeVisible();
    await expect(page.getByText("Dominik Szoboszlai").first()).toBeVisible();
    await expect(page.getByText("8.2")).toBeVisible();
  });
});
