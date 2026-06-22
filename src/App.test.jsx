import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("shows the welcome screen when there are no spaces", () => {
    render(<App />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Create your first space")).toBeInTheDocument();
  });

  it("opens the wizard at the theme step when creating a space", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Create your first space"));
    expect(screen.getByText("What kind of space is this?")).toBeInTheDocument();
    expect(screen.getByText("Household")).toBeInTheDocument();
    expect(screen.getByText("Trip")).toBeInTheDocument();
  });

  it("reaches the main-currency step in the wizard", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Create your first space"));
    fireEvent.click(screen.getByText("Household"));
    // Name step -> Continue
    fireEvent.click(screen.getByText("Continue"));
    // Currency step
    expect(screen.getByText("Main currency")).toBeInTheDocument();
    expect(screen.getByText("Israeli Shekel")).toBeInTheDocument();
  });
});
