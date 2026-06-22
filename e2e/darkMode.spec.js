import { test, expect } from "@playwright/test";
import { createSpace } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("toggles global dark mode from settings", async ({ page }) => {
  await createSpace(page, { theme: "Household" });

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByText("Visual settings").click();

  await expect(page.getByText("Off")).toBeVisible();
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.getByText("On")).toBeVisible();
});
