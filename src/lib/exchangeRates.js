import { EXCHANGE_API_URL } from "./config";

const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function cacheKey(from, to) {
  return `fx:${from}:${to}`;
}

function getCached(from, to) {
  try {
    const raw = sessionStorage.getItem(cacheKey(from, to));
    if (!raw) return null;
    const { rate, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL_MS) return rate;
  } catch {
    // sessionStorage unavailable or corrupted — treat as cache miss
  }
  return null;
}

function setCache(from, to, rate) {
  try {
    sessionStorage.setItem(cacheKey(from, to), JSON.stringify({ rate, ts: Date.now() }));
  } catch {
    // quota exceeded — skip caching
  }
}

export async function fetchExchangeRate(from, to) {
  if (from === to) return 1;
  const cached = getCached(from, to);
  if (cached !== null) return cached;

  try {
    const res = await fetch(`${EXCHANGE_API_URL}/${from}`);
    const data = await res.json();
    const rate = data.rates?.[to];
    if (rate) {
      setCache(from, to, rate);
      return rate;
    }
  } catch {
    // network unavailable — caller handles null return
  }
  return null;
}

export async function fetchLiveRates(baseCurrency, targetCurrencies) {
  if (!targetCurrencies.length) return {};
  const results = {};
  try {
    const res = await fetch(`${EXCHANGE_API_URL}/${baseCurrency}`);
    const data = await res.json();
    for (const code of targetCurrencies) {
      if (data.rates?.[code]) {
        results[code] = data.rates[code];
        setCache(baseCurrency, code, data.rates[code]);
      }
    }
  } catch {
    // network unavailable — return whatever was collected
  }
  return results;
}
