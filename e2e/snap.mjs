// Visual inspection — drives every major screen and state.
// node e2e/snap.mjs  (inside mcr.microsoft.com/playwright:v1.61.0-noble)
import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const BASE = process.env.BASE_URL ?? "http://host.docker.internal:5174";
const OUT  = "e2e/screenshots";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 420, height: 820 },
  storageState: { cookies: [], origins: [] },
});
// Wipe localStorage before every navigation
await ctx.addInitScript(() => localStorage.clear());
const p = await ctx.newPage();

const snap = async (name) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log("📸  " + name);
};

// ── Helper: build a fresh space ──────────────────────────────────────────────
async function setupSpace({ theme = "Household" } = {}) {
  await p.goto(BASE);
  await p.waitForSelector("text=Welcome");
  await p.getByText("Create your first space").click();
  await p.waitForSelector("text=What kind of space");
  await p.getByText(theme, { exact: true }).click();
  await p.getByRole("button", { name: "Continue" }).click();
  await p.waitForSelector("text=Main currency");
  await p.getByRole("button", { name: "Continue" }).click();
  await p.getByRole("button", { name: "Create space" }).click();
  await p.waitForSelector("text=Overview");
}

// ── 1. Welcome screen ────────────────────────────────────────────────────────
await p.goto(BASE);
await p.waitForSelector("text=Welcome");
await snap("01-welcome");

// ── 2. Wizard – theme picker ─────────────────────────────────────────────────
await p.getByText("Create your first space").click();
await p.waitForSelector("text=What kind of space");
await snap("02-wizard-theme");

// ── 3. Wizard – theme selected (Household highlighted) ───────────────────────
await p.getByText("Household", { exact: true }).click();
await p.waitForTimeout(150);
await snap("03-wizard-theme-selected");

// ── 4. Wizard – currency step ────────────────────────────────────────────────
await p.getByRole("button", { name: "Continue" }).click();
await p.waitForSelector("text=Main currency");
await snap("04-wizard-currency");

// ── 5. Wizard – review / create step ────────────────────────────────────────
await p.getByRole("button", { name: "Continue" }).click();
await p.waitForTimeout(200);
await snap("05-wizard-review");

// ── 6. Home screen – empty state ─────────────────────────────────────────────
await p.getByRole("button", { name: "Create space" }).click();
await p.waitForSelector("text=Overview");
await snap("06-home-empty");

// ── 7. Expense editor – blank ────────────────────────────────────────────────
// The circular bottom-nav add button has aria-label="Add expense"
await p.getByLabel("Add expense").click();
await p.waitForTimeout(400);
await snap("07-expense-editor-blank");

// ── 8. Expense editor – amount typed ─────────────────────────────────────────
await p.getByRole("button", { name: "1", exact: true }).click();
await p.getByRole("button", { name: "5", exact: true }).click();
await p.getByRole("button", { name: "0", exact: true }).click();
await p.waitForTimeout(150);
await snap("08-expense-amount-150");

// ── 9. Expense editor – category picked ──────────────────────────────────────
await p.getByRole("button", { name: "Groceries" }).click();
await p.waitForTimeout(150);
await snap("09-expense-category-groceries");

// ── 10. Home screen – one expense ────────────────────────────────────────────
await p.getByRole("button", { name: /Save expense/ }).click();
await p.waitForSelector("text=Overview");
await p.waitForTimeout(300);
await snap("10-home-with-expense");

// ── 11. History tab ───────────────────────────────────────────────────────────
await p.getByRole("button", { name: "History" }).click();
await p.waitForTimeout(200);
await snap("11-history");

// ── 12. Budgets tab ───────────────────────────────────────────────────────────
await p.getByRole("button", { name: "Budgets" }).click();
await p.waitForTimeout(200);
await snap("12-budgets");

// ── 13. Settings – top list ───────────────────────────────────────────────────
await p.getByRole("button", { name: "Settings" }).click();
await p.waitForTimeout(200);
await snap("13-settings-list");

// ── 14. Settings – Visual settings (dark mode toggle) ────────────────────────
await p.getByText("Visual settings").click();
await p.waitForTimeout(200);
await snap("14-settings-visual");

// ── 15. Toggle dark mode ─────────────────────────────────────────────────────
await p.getByLabel("Toggle dark mode").click();
await p.waitForTimeout(350);
await snap("15-dark-mode-settings");

// ── 16. Dark mode – home ─────────────────────────────────────────────────────
await p.getByRole("button", { name: "Settings" }).click(); // back nav clears to list, then click Home
await p.waitForTimeout(100);
await p.getByRole("button", { name: "Home" }).click();
await p.waitForTimeout(200);
await snap("16-dark-mode-home");

// ── 17. Settings – Members section ───────────────────────────────────────────
await p.getByRole("button", { name: "Settings" }).click();
await p.waitForTimeout(150);
await p.getByText("Members").click();
await p.waitForTimeout(200);
await snap("17-settings-members");

// ── 18. Settings – Categories section ────────────────────────────────────────
await p.locator("text=Settings").first().click(); // back button
await p.waitForTimeout(150);
await p.getByText("Categories").click();
await p.waitForTimeout(200);
await snap("18-settings-categories");

// ── 19. Settings – Manage space ───────────────────────────────────────────────
await p.locator("text=Settings").first().click();
await p.waitForTimeout(150);
await p.getByText("Manage space").click();
await p.waitForTimeout(200);
await snap("19-settings-manage-space");

// ── 20. Edit an expense (tap a row on History) ────────────────────────────────
await p.getByRole("button", { name: "History" }).click();
await p.waitForTimeout(200);
// Click the first expense row
const firstExpense = p.locator("button").filter({ hasText: "Groceries" }).first();
await firstExpense.click();
await p.waitForTimeout(350);
await snap("20-expense-edit-sheet");

// ── 21. Delete confirmation in expense editor ─────────────────────────────────
const deleteBtn = p.getByRole("button", { name: /Delete/ }).first();
if (await deleteBtn.isVisible()) {
  await deleteBtn.click();
  await p.waitForTimeout(200);
  await snap("21-expense-delete-confirm");
}

// ── 22. Space switcher sheet ──────────────────────────────────────────────────
await p.keyboard.press("Escape").catch(() => {});
await p.waitForTimeout(200);
// Top bar space button opens the switcher
await p.locator("div[style*='padding: 14px']").first().click().catch(async () => {
  // fallback: click the topbar by its chevron icon area
  await p.locator("button").first().click();
});
await p.waitForTimeout(350);
await snap("22-space-switcher");

await browser.close();
console.log("\n✅  All screenshots saved to", OUT);
