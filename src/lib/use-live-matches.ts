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
 * reconcilie TOUJOURS une fois au montage via /api/live (recupere les matchs
 * termines/en cours meme si le HTML ISR est perime), puis poll toutes les 30 s
 * UNIQUEMENT s'il existe >=1 match en cours (PRD §9).
 * En cas d'echec reseau, React Query conserve la derniere donnee connue.
 */
export function useLiveMatches(initialMatches: Match[]): LivePayload {
  const { data } = useQuery({
    queryKey: ["live"],
    queryFn: fetchLivePayload,
    initialData: { matches: initialMatches, deferred: false },
    // initialData = rendu serveur (peut etre perime) -> on refetch au montage.
    refetchOnMount: "always",
    staleTime: 0,
    refetchInterval: (query) =>
      liveRefetchInterval(query.state.data?.matches ?? []),
    refetchOnWindowFocus: true,
  });

  return data;
}
