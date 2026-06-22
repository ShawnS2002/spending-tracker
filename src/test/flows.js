import { screen } from "@testing-library/react";

// Reusable user-flow helpers shared by integration tests. These drive the real
// components (no mocking of app code) against jsdom + localStorage.

// Walk the space-creation wizard end to end. `currency` (ISO code) is optional and
// only exercised when it differs from the USD default.
export async function createSpace(user, { theme = "Household", currency } = {}) {
  const firstStart = screen.queryByText("Create your first space");
  if (firstStart) {
    await user.click(firstStart);
  } else {
    await user.click(screen.getByRole("button", { name: /New space/i }));
  }

  // Step 1: theme
  await user.click(screen.getByText(theme));

  // Step 2: name (pre-filled with the theme label)
  await user.click(screen.getByRole("button", { name: "Continue" }));

  // Step 3: main currency
  if (currency && currency !== "USD") {
    await user.type(screen.getByPlaceholderText("Search currency"), currency);
    await user.click(screen.getByRole("button", { name: new RegExp(`^${currency}`) }));
  }
  await user.click(screen.getByRole("button", { name: "Continue" }));

  // Step 4: categories (defaults pre-selected)
  await user.click(screen.getByRole("button", { name: "Create space" }));
}

// Open the Add-expense modal, enter an amount on the keypad, pick a category and
// (optionally) a currency, then save.
export async function addExpense(user, { amount = "100", category = "Groceries", currency } = {}) {
  await user.click(screen.getByRole("button", { name: "Add expense" }));

  if (currency) {
    await user.selectOptions(screen.getByLabelText("Currency"), currency);
  }

  for (const ch of String(amount)) {
    await user.click(screen.getByRole("button", { name: ch }));
  }

  await user.click(screen.getByRole("button", { name: category }));
  await user.click(screen.getByRole("button", { name: /Save expense/ }));
}
