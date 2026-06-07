"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

/**
 * Fuseau d'affichage, compatible SSR sans mismatch d'hydratation :
 * - serveur + 1er rendu client : "UTC" (deterministe)
 * - apres hydratation : `undefined` => fuseau du navigateur.
 *
 * Base sur useSyncExternalStore (pas de setState dans un effet).
 */
export function useTimeZone(): string | undefined {
  return useSyncExternalStore(
    subscribe,
    () => undefined,
    () => "UTC",
  );
}
