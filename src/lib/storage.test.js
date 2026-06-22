import { describe, it, expect } from "vitest";
import storage from "./storage";

describe("storage", () => {
  it("returns null for a missing key", () => {
    expect(storage.get("nope")).toBeNull();
  });

  it("round-trips an object through set/get", () => {
    storage.set("k", { a: 1, b: [2, 3] });
    expect(storage.get("k")).toEqual({ a: 1, b: [2, 3] });
  });

  it("round-trips arrays and primitives", () => {
    storage.set("arr", [1, 2, 3]);
    expect(storage.get("arr")).toEqual([1, 2, 3]);
    storage.set("num", 42);
    expect(storage.get("num")).toBe(42);
  });

  it("deletes a key", () => {
    storage.set("temp", { x: 1 });
    storage.delete("temp");
    expect(storage.get("temp")).toBeNull();
  });

  it("returns null when stored data is corrupt JSON", () => {
    localStorage.setItem("bad", "{ not valid json");
    expect(storage.get("bad")).toBeNull();
  });
});
