import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (typeof globalThis.crypto.randomUUID !== "function") {
  globalThis.crypto.randomUUID = () => "00000000-0000-4000-8000-000000000000";
}

afterEach(() => {
  cleanup();
});
