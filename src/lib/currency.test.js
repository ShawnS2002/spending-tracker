import { describe, it, expect } from "vitest";
import { formatCurrency, currencySymbol, expenseInDefault, sumInDefault } from "./currency";

describe("formatCurrency", () => {
  it("includes the dollar sign for USD", () => {
    expect(formatCurrency(24.5, "USD")).toContain("$");
    expect(formatCurrency(24.5, "USD")).toContain("24.50");
  });
  it("includes the euro sign for EUR", () => {
    expect(formatCurrency(10, "EUR")).toContain("€");
  });
  it("includes the shekel sign for ILS", () => {
    expect(formatCurrency(10, "ILS")).toContain("₪");
  });
  it("falls back to a code prefix for a malformed currency code", () => {
    // Intl throws RangeError on codes that aren't 3 ASCII letters, exercising the catch.
    expect(formatCurrency(10, "ZZ")).toBe("ZZ 10.00");
  });
});

describe("currencySymbol", () => {
  it("resolves common symbols", () => {
    expect(currencySymbol("USD")).toBe("$");
    expect(currencySymbol("EUR")).toBe("€");
    expect(currencySymbol("ILS")).toBe("₪");
  });
  it("falls back to the code when malformed", () => {
    expect(currencySymbol("ZZ")).toBe("ZZ");
  });
});

describe("expenseInDefault", () => {
  it("returns the raw amount when already in the default currency", () => {
    expect(expenseInDefault({ amount: 100, currency: "USD" }, "USD")).toBe(100);
  });
  it("treats a missing currency as the default currency", () => {
    expect(expenseInDefault({ amount: 100 }, "USD")).toBe(100);
  });
  it("applies the snapshot rate for a foreign currency", () => {
    expect(expenseInDefault({ amount: 100, currency: "EUR", exchangeRateAtEntry: 1.08 }, "USD")).toBe(108);
  });
  it("falls back to the raw amount when no rate is stored", () => {
    expect(expenseInDefault({ amount: 100, currency: "EUR" }, "USD")).toBe(100);
  });
});

describe("sumInDefault", () => {
  it("sums mixed-currency expenses into the default currency", () => {
    const expenses = [
      { amount: 100, currency: "USD" },
      { amount: 50, currency: "EUR", exchangeRateAtEntry: 1.1 },
      { amount: 20 },
    ];
    expect(sumInDefault(expenses, "USD")).toBeCloseTo(175, 5);
  });
  it("returns 0 for an empty list", () => {
    expect(sumInDefault([], "USD")).toBe(0);
  });
});
