// Map + multi-space screenshot script
import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const BASE = process.env.BASE_URL ?? "http://host.docker.internal:5174";
const OUT  = "e2e/screenshots/map";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 420, height: 820 } });
await ctx.addInitScript(() => localStorage.clear());
const p = await ctx.newPage();

const snap = async (name) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log("📸  " + name);
};

// ── Build Space A ─────────────────────────────────────────────────────────────
await p.goto(BASE);
await p.waitForSelector("text=Welcome");
await p.getByText("Create your first space").click();
await p.getByText("Household", { exact: true }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Create space" }).click();
await p.waitForSelector("text=Overview");

// Enable location tracking on Space A
await p.getByRole("button", { name: "Settings" }).last().click();
await p.getByRole("button", { name: /Manage space/ }).click();
await p.waitForTimeout(200);
// Click the location tracking toggle (off→on)
await p.getByRole("button", { name: "Settings" }).first().click(); // actually we need the toggle
// Re-navigate
await p.getByText("Manage space").click();
await p.waitForTimeout(200);
await snap("map-01-manage-space-before-location");
// Toggle location
const locationToggle = p.locator("button[style*='border-radius: 13px']").first();
await locationToggle.click();
await p.waitForTimeout(200);
await snap("map-02-location-enabled");

// Add expense with mock location (inject directly into localStorage)
await p.getByRole("button", { name: "Home" }).click();
await p.waitForSelector("text=Overview");

// Inject a geolocated expense directly so we don't need real Nominatim
await p.evaluate(() => {
  const spaces = JSON.parse(localStorage.getItem("spaces_index") || "[]");
  const spaceId = spaces[0]?.id;
  if (!spaceId) return;
  const expenses = [
    {
      id: "exp1",
      amount: 45,
      currency: "USD",
      category: "groceries",
      date: new Date().toISOString().slice(0, 10),
      note: "Supermarket",
      locationName: "Tel Aviv, Israel",
      locationCoords: { lat: 32.0853, lng: 34.7818 },
      payer: null,
      exchangeRateAtEntry: null,
    },
    {
      id: "exp2",
      amount: 120,
      currency: "EUR",
      category: "dining",
      date: new Date().toISOString().slice(0, 10),
      note: "Dinner",
      locationName: "Jerusalem, Israel",
      locationCoords: { lat: 31.7683, lng: 35.2137 },
      payer: null,
      exchangeRateAtEntry: 1.08,
    },
    {
      id: "exp3",
      amount: 200,
      currency: "USD",
      category: "transport",
      date: new Date().toISOString().slice(0, 10),
      note: "Taxi",
      locationName: "Haifa, Israel",
      locationCoords: { lat: 32.7940, lng: 34.9896 },
      payer: null,
      exchangeRateAtEntry: null,
    },
  ];
  localStorage.setItem(`space:${spaceId}:expenses`, JSON.stringify(expenses));
});

await p.reload();
await p.waitForSelector("text=Overview");
await p.waitForTimeout(1000); // allow Leaflet to init

await snap("map-03-home-with-map");

// Scroll down to see map fully
await p.evaluate(() => window.scrollTo(0, 300));
await p.waitForTimeout(500);
await snap("map-04-map-visible");

// Click a map pin to see the PinInfoCard
// Map is rendered inside a div at a fixed height; click roughly center-right
await p.locator("div[style*='height: 180px']").click({ position: { x: 250, y: 90 } });
await p.waitForTimeout(600);
await snap("map-05-pin-clicked");

// Click the map card to expand fullscreen
await p.locator("div[style*='height: 180px']").click({ position: { x: 100, y: 60 } });
await p.waitForTimeout(800);
await snap("map-06-fullscreen");

// ── Build Space B (Trip) — verify data isolation ───────────────────────────────
await p.locator("button").first().click(); // TopBar → space switcher
await p.waitForTimeout(300);
await p.getByText("+ New space").click();
await p.waitForTimeout(200);

// Wizard for Space B
await p.getByText("Trip", { exact: true }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Create space" }).click();
await p.waitForSelector("text=Overview");
await p.waitForTimeout(300);
await snap("map-07-space-b-home");

// Space B should show EMPTY — no expenses from Space A should appear
// This tests data isolation between spaces
await p.getByRole("button", { name: "History" }).click();
await p.waitForTimeout(200);
await snap("map-08-space-b-history-should-be-empty");

// Switch back to Space A — should show Space A's expenses
await p.locator("button").first().click();
await p.waitForTimeout(300);
await snap("map-09-space-switcher");
// Select Household (first space)
await p.getByRole("button", { name: /Household/ }).first().click();
await p.waitForTimeout(400);
await snap("map-10-back-on-space-a");

// Space A history should have 3 expenses
await p.getByRole("button", { name: "History" }).click();
await p.waitForTimeout(200);
await snap("map-11-space-a-history-should-have-expenses");

await browser.close();
console.log("\n✅  Map + isolation screenshots in", OUT);
