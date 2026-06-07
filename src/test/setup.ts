// Étend `expect` de Vitest avec les matchers DOM de Testing Library
// (toBeInTheDocument, toHaveTextContent, ...).
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Nettoie le DOM entre chaque test (globals:false -> pas de cleanup auto).
afterEach(() => {
  cleanup();
});

// jsdom n'implemente pas matchMedia (requis par next-themes).
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}
