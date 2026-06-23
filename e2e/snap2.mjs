// Continuation screenshots 18-30
import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const BASE = process.env.BASE_URL ?? "http://host.docker.internal:5174";
const OUT  = "e2e/screenshots";
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

// Navigate a bottom-nav tab (always the last match = BottomNav, not a back btn)
const goTab  = (name) => p.getByRole("button", { name, exact: true }).last().click();
// Back button inside a settings sub-page is always the FIRST "Settings" button
const goBack = () => p.getByRole("button", { name: "Settings", exact: true }).first().click();
// Click a settings list item by its exact label (avoid matching subtitle text)
const goSection = (label) => p.getByRole("button", { name: new RegExp("^" + label) }).click();

// ── Build a space with one expense ────────────────────────────────────────────
await p.goto(BASE);
await p.waitForSelector("text=Welcome");
await p.getByText("Create your first space").click();
await p.getByText("Household", { exact: true }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Create space" }).click();
await p.waitForSelector("text=Overview");

await p.getByLabel("Add expense").click();
await p.waitForTimeout(300);
await p.getByRole("button", { name: "1", exact: true }).click();
await p.getByRole("button", { name: "5", exact: true }).click();
await p.getByRole("button", { name: "0", exact: true }).click();
await p.getByRole("button", { name: "Groceries" }).click();
await p.getByRole("button", { name: /Save expense/ }).click();
await p.waitForSelector("text=Overview");

// ── 18. Settings – Members ────────────────────────────────────────────────────
await goTab("Settings");
await p.waitForTimeout(200);
await goSection("Members");
await p.waitForTimeout(200);
await snap("18-settings-members");

// ── 19. Settings – Categories ─────────────────────────────────────────────────
await goBack();
await p.waitForTimeout(150);
await goSection("Categories");
await p.waitForTimeout(200);
await snap("19-settings-categories");

// ── 20. Settings – Default currency ──────────────────────────────────────────
await goBack();
await p.waitForTimeout(150);
await goSection("Default currency");
await p.waitForTimeout(200);
await snap("20-settings-currency");

// ── 21. Settings – Manage space ───────────────────────────────────────────────
await goBack();
await p.waitForTimeout(150);
await goSection("Manage space");
await p.waitForTimeout(200);
await snap("21-settings-manage-space");

// Delete confirmation panel
await p.getByRole("button", { name: "Delete this space" }).click();
await p.waitForTimeout(200);
await snap("22-delete-confirmation");
await p.getByRole("button", { name: "Cancel" }).click();
await p.waitForTimeout(150);

// ── 22. History tab ───────────────────────────────────────────────────────────
await goTab("History");
await p.waitForTimeout(200);
await snap("23-history");

// ── 23. Expense edit sheet ────────────────────────────────────────────────────
await p.locator("button").filter({ hasText: /Groceries/ }).first().click();
await p.waitForTimeout(350);
await snap("24-expense-edit-sheet");
await p.getByLabel("Close").click();
await p.waitForTimeout(200);

// ── 24. Space switcher ────────────────────────────────────────────────────────
await goTab("Home");
await p.waitForTimeout(150);
// TopBar button is first button on page
await p.locator("button").first().click();
await p.waitForTimeout(350);
await snap("25-space-switcher");
// Close by clicking backdrop (top-left of the fixed overlay, outside the sheet)
await p.mouse.click(10, 100);
await p.waitForTimeout(200);

// ── 25-30. Dark mode screens ──────────────────────────────────────────────────
await goTab("Settings");
await p.waitForTimeout(150);
await goSection("Visual settings");
await p.waitForTimeout(150);
await p.getByLabel("Toggle dark mode").click();
await p.waitForTimeout(350);

await goTab("Home");
await p.waitForTimeout(200);
await snap("26-dark-mode-home");

await goTab("History");
await p.waitForTimeout(200);
await snap("27-dark-mode-history");

await goTab("Budgets");
await p.waitForTimeout(200);
await snap("28-dark-mode-budgets");

await goTab("Settings");
await p.waitForTimeout(200);
await snap("29-dark-mode-settings");

await p.getByLabel("Add expense").click();
await p.waitForTimeout(350);
await snap("30-dark-mode-expense-editor");
await p.getByLabel("Close").click();
await p.waitForTimeout(150);

await browser.close();
console.log("\n✅  Done —", OUT);
