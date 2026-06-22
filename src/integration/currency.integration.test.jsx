import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { createSpace, addExpense } from "../test/flows";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("multi-currency flow", () => {
  it("shows totals in a non-USD space default currency", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createSpace(user, { currency: "EUR" });
    await addExpense(user, { amount: "100", category: "Groceries" });

    // Default currency is EUR, expense logged in EUR -> euro-formatted total.
    await waitFor(() => {
      expect(screen.getAllByText("€100.00").length).toBeGreaterThan(0);
    });
  });

  it("converts a foreign-currency expense using the snapshot rate at entry", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ rates: { EUR: 0.9 } }),
    });

    const user = userEvent.setup();
    render(<App />);

    await createSpace(user, { currency: "EUR" });
    // Log the expense in USD inside a EUR space; rate USD->EUR = 0.9.
    await addExpense(user, { amount: "100", category: "Groceries", currency: "USD" });

    await waitFor(() => {
      // Primary line in the entry's own currency.
      expect(screen.getAllByText("$100.00").length).toBeGreaterThan(0);
    });
    // Converted line on the row (≈ €90.00) and euro-denominated month total.
    expect(screen.getAllByText(/€90\.00/).length).toBeGreaterThan(0);
  });
});
