import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchExchangeRate } from "./exchangeRates";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchExchangeRate", () => {
  it("returns 1 when converting a currency to itself without any network call", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    const rate = await fetchExchangeRate("USD", "USD");
    expect(rate).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns the rate from the API response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ rates: { EUR: 0.92 } }),
    });
    const rate = await fetchExchangeRate("USD", "EUR");
    expect(rate).toBe(0.92);
  });

  it("caches the rate so a second call does not hit the network", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ rates: { GBP: 0.79 } }),
    });
    await fetchExchangeRate("USD", "GBP");
    await fetchExchangeRate("USD", "GBP");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("returns null when the network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const rate = await fetchExchangeRate("USD", "JPY");
    expect(rate).toBeNull();
  });
});
