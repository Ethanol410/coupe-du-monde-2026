// Étend `expect` de Vitest avec les matchers DOM de Testing Library
// (toBeInTheDocument, toHaveTextContent, ...).
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Nettoie le DOM entre chaque test (globals:false -> pas de cleanup auto).
afterEach(() => {
  cleanup();
});
