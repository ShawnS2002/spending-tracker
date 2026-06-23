import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStorageValue } from "./useStorage";
import storage from "../lib/storage";

describe("useStorageValue", () => {
  it("returns the fallback when no data is stored", () => {
    const { result } = renderHook(() => useStorageValue("missing", []));
    expect(result.current[0]).toEqual([]);
  });

  it("returns stored data on initial render", () => {
    storage.set("k", [{ id: 1 }]);
    const { result } = renderHook(() => useStorageValue("k", []));
    expect(result.current[0]).toEqual([{ id: 1 }]);
  });

  // Bug S1 — space data bleeds between spaces when switching.
  // The hook's useState initializer runs only on mount, so when the storage key
  // changes (because the user switched spaces), data stays stale with the old
  // space's values.
  it("re-reads storage when the key changes (bug S1 regression)", () => {
    storage.set("space:aaa:expenses", [{ id: "e1", amount: 100 }]);
    storage.set("space:bbb:expenses", [{ id: "e2", amount: 200 }]);

    const { result, rerender } = renderHook(
      ({ key }) => useStorageValue(key, []),
      { initialProps: { key: "space:aaa:expenses" } }
    );

    expect(result.current[0]).toEqual([{ id: "e1", amount: 100 }]);

    // Simulate switching from Space A to Space B
    rerender({ key: "space:bbb:expenses" });

    // Must show Space B's data — fails before the fix
    expect(result.current[0]).toEqual([{ id: "e2", amount: 200 }]);
  });

  it("persist writes to the current key", () => {
    storage.set("k", []);
    const { result } = renderHook(() => useStorageValue("k", []));

    act(() => {
      result.current[1]([{ id: "e1" }]);
    });

    expect(result.current[0]).toEqual([{ id: "e1" }]);
    expect(storage.get("k")).toEqual([{ id: "e1" }]);
  });

  it("persist writes to the new key after a key change, not the old one", () => {
    storage.set("space:aaa:expenses", []);
    storage.set("space:bbb:expenses", []);

    const { result, rerender } = renderHook(
      ({ key }) => useStorageValue(key, []),
      { initialProps: { key: "space:aaa:expenses" } }
    );

    rerender({ key: "space:bbb:expenses" });

    act(() => {
      result.current[1]([{ id: "e3", amount: 50 }]);
    });

    expect(storage.get("space:bbb:expenses")).toEqual([{ id: "e3", amount: 50 }]);
    expect(storage.get("space:aaa:expenses")).toEqual([]); // untouched
  });
});
