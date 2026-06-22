// Environment-configurable external service endpoints.
// Defaults point at the free, key-less public APIs used in development.
// Override per environment via .env.* files (VITE_* vars are inlined at build time).

export const NOMINATIM_URL =
  import.meta.env.VITE_NOMINATIM_URL || "https://nominatim.openstreetmap.org";

export const EXCHANGE_API_URL =
  import.meta.env.VITE_EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest";

export const APP_ENV = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "development";
