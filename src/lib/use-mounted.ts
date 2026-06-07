"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

/**
 * true uniquement apres hydratation (SSR + 1er rendu = false).
 * Base sur useSyncExternalStore -> pas de setState dans un effet, pas de flash.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
