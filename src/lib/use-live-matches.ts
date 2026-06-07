"use client";

import { useQuery } from "@tanstack/react-query";
import { liveRefetchInterval, type LivePayload } from "@/lib/domain/live";
import type { Match } from "@/lib/providers/types";

async function fetchLivePayload(): Promise<LivePayload> {
  const res = await fetch("/api/live");
  if (!res.ok) throw new Error(`Live fetch failed: ${res.status}`);
  return (await res.json()) as LivePayload;
}

/**
 * Etat live des matchs : part des matchs rendus cote serveur (initialData),
 * puis poll /api/live UNIQUEMENT s'il existe >=1 match live (PRD §9).
 * En cas d'echec reseau, React Query conserve la derniere donnee connue.
 */
export function useLiveMatches(initialMatches: Match[]): LivePayload {
  const { data } = useQuery({
    queryKey: ["live"],
    queryFn: fetchLivePayload,
    initialData: { matches: initialMatches, deferred: false },
    refetchInterval: (query) =>
      liveRefetchInterval(query.state.data?.matches ?? []),
    refetchOnWindowFocus: true,
  });

  return data;
}
