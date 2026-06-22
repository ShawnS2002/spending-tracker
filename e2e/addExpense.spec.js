import { test, expect } from "@playwright/test";
import { createSpace, addExpense } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("logs an expense and shows it in totals and the recent list", async ({ page }) => {
  await createSpace(page, { theme: "Household" });
  await addExpense(page, { amount: "100", category: "Groceries" });

  // Toast and rendered amount.
  await expect(page.getByText("Expense saved")).toBeVisible();
  await expect(page.getByText("$100.00").first()).toBeVisible();
  await expect(page.getByText("Spent this month")).toBeVisible();
});

test("logs a foreign-currency expense with a converted line", async ({ page }) => {
  // Stub the exchange-rate API so the conversion is deterministic and offline.
  await page.route("**/api.exchangerate-api.com/**", (route) =>
    route.fulfill({ json: { rates: { EUR: 0.9 } } })
  );

  await createSpace(page, { theme: "Trip", currency: "EUR" });
  await addExpense(page, { amount: "100", category: "Food & drink", currency: "USD" });

  await expect(page.getByText("$100.00").first()).toBeVisible();
  await expect(page.getByText(/€90\.00/).first()).toBeVisible();
});
