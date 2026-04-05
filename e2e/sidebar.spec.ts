import { expect, test } from "@playwright/test";

test.describe("Sidebar", () => {
  test("loads and shows live matches grouped by league", async ({ page }) => {
    await page.goto("/");

    // Wait for data to load — "Liverpool" comes from MSW-mocked API
    await expect(page.getByText("Liverpool")).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText("CIRIOLAJI")).toBeVisible();
    await expect(page.getByText("Premier League").first()).toBeVisible();
    await expect(page.getByText("Bundesliga").first()).toBeVisible();
    await expect(page.getByText("Bayern Munich")).toBeVisible();
  });

  test("filter chips show correct leagues", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Premier League" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Bundesliga" })
    ).toBeVisible();
  });

  test("clicking a league filter hides other leagues", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Bundesliga" }).click();

    await expect(page.getByText("Bayern Munich")).toBeVisible();
    await expect(page.getByText("Liverpool")).not.toBeVisible();
  });

  test("clicking a match navigates to fixture page", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Liverpool").click();

    await expect(page).toHaveURL(/\/fixture\/1001/);
  });
});
