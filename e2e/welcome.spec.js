import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows the welcome screen on first load", async ({ page }) => {
  await expect(page.getByText("Welcome")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create your first space" })).toBeVisible();
});

test("opens the wizard from the welcome screen", async ({ page }) => {
  await page.getByRole("button", { name: "Create your first space" }).click();
  await expect(page.getByText("What kind of space is this?")).toBeVisible();
  await expect(page.getByText("Household", { exact: true })).toBeVisible();
  await expect(page.getByText("Trip", { exact: true })).toBeVisible();
});
