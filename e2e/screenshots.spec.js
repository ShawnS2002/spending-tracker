// Visual inspection script — takes screenshots at every key UI state.
// Run via: docker run ... mcr.microsoft.com/playwright:v1.61.0-noble npx playwright test e2e/screenshots.spec.js
import { test } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://host.docker.internal:5173";

async function snap(page, name) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: false });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("welcome screen", async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState("networkidle");
  await snap(page, "01-welcome");
});

test("wizard - theme step", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await snap(page, "02-wizard-theme");
});

test("wizard - currency step", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await snap(page, "03-wizard-currency");
});

test("wizard - review step", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await snap(page, "04-wizard-review");
});

test("home screen - empty", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  await snap(page, "05-home-empty");
});

test("expense editor", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  await page.getByRole("button", { name: "Add" }).click();
  await page.waitForTimeout(400);
  await snap(page, "06-expense-editor");
});

test("history screen", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  await page.getByRole("button", { name: "History" }).click();
  await snap(page, "07-history");
});

test("budgets screen", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  await page.getByRole("button", { name: "Budgets" }).click();
  await snap(page, "08-budgets");
});

test("settings screen", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  await page.getByRole("button", { name: "Settings" }).click();
  await snap(page, "09-settings");
});

test("dark mode - home screen", async ({ page }) => {
  await page.goto(BASE);
  await page.getByText("Create your first space").click();
  await page.getByText("Household", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
  await page.waitForSelector("text=Overview");
  // Toggle dark mode via the header moon/sun icon
  await page.locator("button").filter({ hasText: "" }).first().click();
  await page.waitForTimeout(300);
  await snap(page, "10-dark-mode-home");
});
