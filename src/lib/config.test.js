import { describe, it, expect } from "vitest";
import { NOMINATIM_URL, EXCHANGE_API_URL } from "./config";

describe("config", () => {
  it("falls back to the public Nominatim endpoint when unset", () => {
    expect(NOMINATIM_URL).toContain("nominatim.openstreetmap.org");
  });

  it("falls back to the public exchange-rate endpoint when unset", () => {
    expect(EXCHANGE_API_URL).toContain("exchangerate-api.com");
  });

  it("exposes string URLs", () => {
    expect(typeof NOMINATIM_URL).toBe("string");
    expect(typeof EXCHANGE_API_URL).toBe("string");
  });
});
