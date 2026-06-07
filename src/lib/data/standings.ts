/**
 * Classements de groupes. Le calcul pur vit dans le domaine (reutilisable, testable).
 */
import { getProvider } from "@/lib/providers";
import type { GroupStanding } from "@/lib/providers/types";

export { computeStandings } from "@/lib/domain/standings";

export function getStandings(): Promise<GroupStanding[]> {
  return getProvider().getStandings();
}
