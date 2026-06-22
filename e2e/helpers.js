// Shared Playwright flow helpers — mirror of src/test/flows.js but driving a real browser.

export async function createSpace(page, { theme = "Household", currency } = {}) {
  const first = page.getByText("Create your first space");
  if (await first.isVisible().catch(() => false)) {
    await first.click();
  } else {
    await page.getByRole("button", { name: /New space/i }).click();
  }

  await page.getByText(theme, { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  if (currency && currency !== "USD") {
    await page.getByPlaceholder("Search currency").fill(currency);
    await page.getByRole("button", { name: new RegExp(`^${currency}`) }).click();
  }
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create space" }).click();
}

export async function addExpense(page, { amount = "100", category = "Groceries", currency } = {}) {
  await page.getByRole("button", { name: "Add expense" }).click();

  if (currency) {
    await page.getByLabel("Currency").selectOption(currency);
  }

  for (const ch of String(amount)) {
    await page.getByRole("button", { name: ch, exact: true }).click();
  }

  await page.getByRole("button", { name: category }).click();
  await page.getByRole("button", { name: /Save expense/ }).click();
}
