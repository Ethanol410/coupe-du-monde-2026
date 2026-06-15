/**
 * Couche live temps reel (PRD §7, couche 2 bonus) — worldcup26.ir.
 * Lecture publique HTTPS (token optionnel). Jointure par `id` (= id statique).
 * DEGRADATION GRACIEUSE : toute erreur reseau/parse -> Map vide (jamais de throw).
 * Les buteurs (home_scorers/away_scorers) sont ignores ici (events = Phase 4).
 */
import { Worldcup2026Schema, type Worldcup2026Data } from "./raw";
import type { MatchStatus } from "./types";

const LIVE_URL = "https://worldcup26.ir/get/games";

export interface LiveEnrichment {
  score: { home: number | null; away: number | null };
  status: MatchStatus;
  minute: number | null;
}

export interface LiveResult {
  /** true si la source a repondu correctement (sinon : donnees differees). */
  reachable: boolean;
  /** Enrichissements par id (vide si rien en cours ou source injoignable). */
  live: Map<string, LiveEnrichment>;
}

/** Statut derive de `finished` + `time_elapsed` (pas d'enum natif cote source). */
export function deriveLiveStatus(finished: string, timeElapsed: string): MatchStatus {
  if (finished.trim().toUpperCase() === "TRUE") return "FINISHED";
  const t = timeElapsed.trim().toLowerCase();
  if (t === "" || t === "notstarted") return "SCHEDULED";
  if (t.includes("ht") || t.includes("half")) return "HALFTIME";
  return "LIVE";
}

/** Minute extraite de `time_elapsed` si numerique, sinon null. */
export function parseMinute(timeElapsed: string): number | null {
  const digits = timeElapsed.match(/\d+/);
  return digits ? Number(digits[0]) : null;
}

function toNullableNumber(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Table d'enrichissement live indexee par `id` (matchs LIVE/HALFTIME/FINISHED uniquement). */
export function buildLiveMap(data: Worldcup2026Data): Map<string, LiveEnrichment> {
  const map = new Map<string, LiveEnrichment>();
  for (const game of data.games) {
    const status = deriveLiveStatus(game.finished, game.time_elapsed ?? "");
    if (status === "SCHEDULED") continue;
    map.set(game.id, {
      status,
      minute: status === "LIVE" ? parseMinute(game.time_elapsed ?? "") : null,
      score: {
        home: toNullableNumber(game.home_score),
        away: toNullableNumber(game.away_score),
      },
    });
  }
  return map;
}

const UNREACHABLE: LiveResult = { reachable: false, live: new Map() };

/**
 * Recupere l'etat live. Token optionnel (PRD).
 * `reachable:false` (donnees differees) sur toute erreur reseau/parse.
 * `reachable:true` avec `live` vide = source OK mais aucun match en cours.
 */
export async function fetchLive(signal?: AbortSignal): Promise<LiveResult> {
  try {
    const token = process.env.WC_LIVE_TOKEN;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(LIVE_URL, {
      ...(signal ? { signal } : {}),
      headers,
      // Cache court partage (proxy /api/live + page detail) -> protege le serveur .ir fragile.
      next: { revalidate: 30 },
    });
    if (!res.ok) return UNREACHABLE;
    const json: unknown = await res.json();
    const parsed = Worldcup2026Schema.safeParse(json);
    if (!parsed.success) return UNREACHABLE;
    return { reachable: true, live: buildLiveMap(parsed.data) };
  } catch {
    return UNREACHABLE;
  }
}
