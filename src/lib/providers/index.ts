/**
 * Selection du provider selon l'environnement (PRD §6).
 * `NEXT_PUBLIC_DATA_PROVIDER=mock` force le provider deterministe (tests/dev),
 * sinon provider composite (statique + openfootball).
 */
import { compositeProvider } from "./composite";
import { mockProvider } from "./mock";
import type { DataProvider } from "./types";

export function getProvider(): DataProvider {
  if (process.env.NEXT_PUBLIC_DATA_PROVIDER === "mock") {
    return mockProvider;
  }
  return compositeProvider;
}

export { compositeProvider, mockProvider };
export type { DataProvider } from "./types";
