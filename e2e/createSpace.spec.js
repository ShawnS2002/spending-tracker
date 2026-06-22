import { test, expect } from "@playwright/test";
import { createSpace } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("creates a space through the full wizard", async ({ page }) => {
  await createSpace(page, { theme: "Household" });
  await expect(page.getByText("Overview")).toBeVisible();
});

test("creates a space with a non-USD main currency", async ({ page }) => {
  await createSpace(page, { theme: "Trip", currency: "EUR" });
  await expect(page.getByText("Overview")).toBeVisible();

  // The default-currency picker in Settings reflects the wizard choice.
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByText("Default currency")).toBeVisible();
});
