# Visual Bug Report
Generated: 2026-06-23 via automated Playwright screenshot inspection (30 screens, light + dark mode)

---

## Bug 1 — History screen filter dropdowns are unstyled native `<select>` elements [MAJOR]

**Screenshots:** `11-history.png`, `23-history.png`, `27-dark-mode-history.png`

The "Everyone" (member filter) and "All categories" filter dropdowns on the History screen are raw browser-native `<select>` elements. They render with the OS/browser default styling — white/gray box with a native arrow — completely out of place against the app's carefully custom-styled cards, buttons, and inputs.

In dark mode the browser auto-applies its own dark theme to them, making them look slightly less bad, but they still read as foreign elements.

**File:** `src/components/HistoryScreen.jsx`  
**Fix:** Replace with custom-styled dropdowns using the same pattern as the rest of the UI.

---

## Bug 2 — Toast overlays the expense editor numpad [MEDIUM]

**Screenshot:** `17-dark-mode-expense-editor.png`

The toast has `zIndex: 200` (`src/lib/styles.js:sharedToast`) and the expense editor backdrop has `zIndex: 100` (`src/lib/styles.js:sharedModal`). This means the toast always renders on top of the editor sheet.

If a user saves an expense and opens a new one within the 2.2-second toast window, the toast floats over the bottom row of the numpad, blocking the **1**, **0**, and **⌫** keys. The user can see the keys but cannot tap them.

**Fix:** Either raise the editor backdrop z-index above 200, dismiss the toast when the editor opens, or push the toast above the editor sheet.

---

## Bug 3 — Toast obscures currency list items [MINOR]

**Screenshot:** `20-settings-currency.png`

The toast is fixed at `bottom: 84px`. On the Default Currency settings page (and any other long scrollable list), this position lands directly over the visible list items near the bottom of the screen. In the screenshot "Mexican Peso" is fully covered by the toast pill.

Any screen where the user might navigate shortly after saving an expense is affected.

**File:** `src/lib/styles.js:sharedToast`  
**Fix:** Either position the toast above the content area (`bottom: 100px` or higher), or use a top-of-screen position.

---

## Bug 4 — Expense editor cannot be dismissed with Escape [MEDIUM / UX]

The expense editor sheet (`ExpenseEditor.jsx`) can only be closed by tapping the X button or tapping outside the sheet on the backdrop. There is no `keydown` / `Escape` handler.

On desktop or with a keyboard attached, pressing Escape does nothing. Confirmed during automated testing — `keyboard.press("Escape")` had no effect and the overlay remained blocking all subsequent interactions.

**File:** `src/components/ExpenseEditor.jsx`  
**Fix:** Add `onKeyDown` with Escape handling, or a `useEffect` that listens for the Escape key and calls `onClose`.

---

## Bug 5 — "Save expense" disabled state is visually ambiguous [MINOR]

**Screenshots:** `07-expense-editor-blank.png` (disabled), `08-expense-amount-150.png` (enabled)

When the amount is 0 the Save button is `disabled`, which causes the browser to reduce its opacity slightly. The visual difference between enabled and disabled is a subtle hue/opacity shift on the teal button — easy to miss, especially in dark mode (`30-dark-mode-expense-editor.png`).

There is no tooltip, helper text, or other affordance explaining why the button is not responding.

**File:** `src/components/ExpenseEditor.jsx` (the Save button)  
**Fix:** Apply an explicit disabled style (e.g. `opacity: 0.4, cursor: not-allowed`) and/or show inline text like "Enter an amount to save" when the amount is zero.

---

## Bug 6 — Currency `<select>` in expense editor uses browser-native dark styling [MINOR]

**Screenshot:** `30-dark-mode-expense-editor.png`

The currency picker ("USD") inside the expense editor is a native `<select>` element. In dark mode the browser renders it with its own dark theme, which does not match the app's custom dark palette (`#26241F` surface, `#F2EFE7` text). The control looks noticeably different from all surrounding inputs and buttons.

**File:** `src/components/ExpenseEditor.jsx`  
**Fix:** Replace with a custom-styled select or a button that opens a bottom-sheet currency picker (consistent with how the wizard handles currency selection).

---

## Bug 7 — `index.css` and `App.css` are dead Vite scaffold files that conflict with the app [CODE QUALITY]

The app renders exclusively through inline styles (`lib/styles.js`, `lib/colors.js`) and the `GlobalCSS` component injected in `App.jsx`. The `index.css` and `App.css` files are untouched Vite scaffold boilerplate that was never cleaned up. They create two concrete conflicts:

1. **Double borders on `#root`:** `index.css` sets `border-inline: 1px solid var(--border)` on `#root`. `baseStyles.app` sets `borderLeft` and `borderRight` on the inner `<div>`. On desktop, both borders render, producing a double-border frame around the app column.

2. **Competing body backgrounds:** `index.css` sets `background: var(--bg)` on `:root` (which cascades to `body`). `GlobalCSS` in `App.jsx` sets `body { background: #111; }`. The `<style>` tag wins due to DOM order, so `#111` is applied — but the intent is unclear and removal of `GlobalCSS` would silently break the black side-panel design.

**Files:** `src/index.css`, `src/App.css`  
**Fix:** Delete both files (or at minimum gut them down to just the `body { margin: 0; }` reset) and move the `GlobalCSS` content to `index.css` so there is a single source of truth for global styles.

---

## Summary

| # | Severity | Description |
|---|----------|-------------|
| 1 | Major    | History filter `<select>` dropdowns use native browser styling |
| 2 | Medium   | Toast (z:200) overlays expense editor backdrop (z:100), blocks numpad |
| 3 | Medium   | No Escape key handler on expense editor |
| 4 | Minor    | Toast fixed position covers currency list items |
| 5 | Minor    | Save button disabled state is visually subtle / unexplained |
| 6 | Minor    | Currency `<select>` in editor breaks dark mode visual consistency |
| 7 | Quality  | Dead Vite scaffold CSS (`index.css`, `App.css`) causes double borders and competing body backgrounds |
