import { formatMoney } from "./utils";

// Format an amount in a given ISO currency code, e.g. formatCurrency(24.5, "EUR") -> "€24.50".
// Falls back to "CODE 24.50" if the runtime can't resolve the currency.
export function formatCurrency(amount, code) {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${code} ${formatMoney(value)}`;
  }
}

// Return just the symbol for a currency code, e.g. currencySymbol("EUR") -> "€".
export function currencySymbol(code) {
  try {
    const parts = new Intl.NumberFormat(undefined, { style: "currency", currency: code }).formatToParts(0);
    const part = parts.find((p) => p.type === "currency");
    return part ? part.value : code;
  } catch {
    return code;
  }
}

// Convert a single expense's amount into the space's default currency using the
// snapshot rate captured at entry time. If the expense is already in the default
// currency (or has no stored rate), the raw amount is returned unchanged.
export function expenseInDefault(expense, defaultCurrency) {
  const code = expense.currency || defaultCurrency;
  if (code === defaultCurrency) return expense.amount;
  if (expense.exchangeRateAtEntry) return expense.amount * expense.exchangeRateAtEntry;
  return expense.amount;
}

// Sum a list of expenses into the space default currency (snapshot conversion).
export function sumInDefault(expenses, defaultCurrency) {
  return expenses.reduce((s, e) => s + expenseInDefault(e, defaultCurrency), 0);
}
