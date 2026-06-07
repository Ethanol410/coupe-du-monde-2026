/**
 * Route serverless de proxy live (PRD §9).
 * - Appelle worldcup26.ir cote serveur (cache la cle eventuelle, evite CORS).
 * - Surcouche le squelette statique avec l'etat live ; degradation gracieuse.
 * - Cache court pour proteger la source fragile.
 */
import { mergeLiveEnrichment, type LivePayload } from "@/lib/domain/live";
import { mockProvider } from "@/lib/providers/mock";
import { getStaticMatches } from "@/lib/providers/static";
import { fetchLive } from "@/lib/providers/worldcup2026";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  let payload: LivePayload;

  if (process.env.NEXT_PUBLIC_DATA_PROVIDER === "mock") {
    payload = { matches: await mockProvider.getMatches(), deferred: false };
  } else {
    const { reachable, live } = await fetchLive();
    payload = {
      matches: mergeLiveEnrichment(getStaticMatches(), live),
      deferred: !reachable,
    };
  }

  return Response.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
  });
}
