import { useState, useCallback } from "react";
import storage from "../lib/storage";

export function useStorageValue(key, fallback) {
  const [data, setData] = useState(() => {
    const stored = storage.get(key);
    return stored !== null ? stored : fallback;
  });

  const persist = useCallback((next) => {
    setData(next);
    storage.set(key, next);
  }, [key]);

  return [data, persist];
}
