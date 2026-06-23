import { useState, useCallback } from "react";
import storage from "../lib/storage";

export function useStorageValue(key, fallback) {
  const [trackedKey, setTrackedKey] = useState(key);
  const [data, setData] = useState(() => {
    const stored = storage.get(key);
    return stored !== null ? stored : fallback;
  });

  // Synchronous during-render re-read when the key changes (e.g. space switch).
  // React batches these setState calls into one re-render — no flash, no remount.
  if (trackedKey !== key) {
    setTrackedKey(key);
    const stored = storage.get(key);
    setData(stored !== null ? stored : fallback);
  }

  const persist = useCallback((next) => {
    setData(next);
    storage.set(key, next);
  }, [key]);

  return [data, persist];
}
