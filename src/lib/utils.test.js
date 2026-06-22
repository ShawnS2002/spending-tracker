import { describe, it, expect } from "vitest";
import { uid, todayISO, formatMoney, monthKey, monthLabel, formatRelativeDate } from "./utils";

describe("uid", () => {
  it("returns a non-empty string", () => {
    expect(typeof uid()).toBe("string");
    expect(uid().length).toBeGreaterThan(0);
  });
  it("is reasonably unique", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uid()));
    expect(ids.size).toBe(1000);
  });
});

describe("todayISO", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("formatMoney", () => {
  it("formats with two decimals and thousands separators", () => {
    expect(formatMoney(1234.5)).toBe("1,234.50");
  });
  it("rounds to two decimals", () => {
    expect(formatMoney(2.005)).toBe("2.01");
  });
  it("handles zero and non-numeric input", () => {
    expect(formatMoney(0)).toBe("0.00");
    expect(formatMoney("not a number")).toBe("0.00");
    expect(formatMoney(undefined)).toBe("0.00");
  });
});

describe("monthKey", () => {
  it("extracts year-month from an ISO date", () => {
    expect(monthKey("2026-06-22")).toBe("2026-06");
  });
});

describe("monthLabel", () => {
  it("renders a human month and year", () => {
    expect(monthLabel("2026-06")).toBe("June 2026");
  });
});

describe("formatRelativeDate", () => {
  it("labels today as Today", () => {
    expect(formatRelativeDate(todayISO())).toBe("Today");
  });
  it("labels yesterday as Yesterday", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const iso = d.toISOString().slice(0, 10);
    expect(formatRelativeDate(iso)).toBe("Yesterday");
  });
});
