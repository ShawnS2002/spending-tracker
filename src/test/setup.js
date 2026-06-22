import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset DOM and storage between tests for isolation.
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
