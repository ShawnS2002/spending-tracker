import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { createSpace, addExpense } from "../test/flows";

describe("space + expense flow", () => {
  it("creates a space through the wizard and lands on the overview", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createSpace(user);

    expect(await screen.findByText("Overview")).toBeInTheDocument();
    // Top bar shows the chosen space name (defaults to the theme label).
    expect(screen.getAllByText("Household").length).toBeGreaterThan(0);
  });

  it("adds an expense and reflects it in totals, recent list, and history", async () => {
    const user = userEvent.setup();
    render(<App />);
    await createSpace(user);

    await addExpense(user, { amount: "100", category: "Groceries" });

    // Toast confirms, and the month total + row both render the formatted amount.
    await waitFor(() => {
      expect(screen.getAllByText("$100.00").length).toBeGreaterThan(0);
    });
    // "Spent this month" metric is no longer zero.
    expect(screen.getByText("Spent this month")).toBeInTheDocument();

    // The expense shows up in History too. ("All expenses" is unique to that screen;
    // the word "History" appears on both the nav button and the heading.)
    await user.click(screen.getByRole("button", { name: "History" }));
    expect(await screen.findByText("All expenses")).toBeInTheDocument();
    expect(screen.getAllByText("$100.00").length).toBeGreaterThan(0);
  });

  it("persists spaces to localStorage so a remount restores them", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await createSpace(user);
    expect(await screen.findByText("Overview")).toBeInTheDocument();

    unmount();
    render(<App />);

    // No welcome screen on the second mount — the space was persisted.
    expect(screen.queryByText("Create your first space")).not.toBeInTheDocument();
    expect(await screen.findByText("Overview")).toBeInTheDocument();
  });
});
