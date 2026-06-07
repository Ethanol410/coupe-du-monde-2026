import { describe, expect, it } from "vitest";
import type { LiveEnrichment } from "@/lib/providers/worldcup2026";
import type { Match } from "@/lib/providers/types";
import { hasLiveMatches, liveRefetchInterval, mergeLiveEnrichment } from "./live";

function match(id: string, status: Match["status"]): Match {
  return {
    id,
    stage: "GROUP",
    group: "A",
    kickoff: "2026-06-11T19:00:00.000Z",
    status,
    minute: null,
    home: { id: "1", name: "Mexico", code: "MEX", flagUrl: null },
    away: { id: "2", name: "South Africa", code: "RSA", flagUrl: null },
    score: { home: null, away: null },
    venue: { id: "1", name: "Azteca", city: "Mexico City", country: "Mexico" },
  };
}

describe("mergeLiveEnrichment", () => {
  it("fait passer un match SCHEDULED -> LIVE avec minute et score", () => {
    const base = [match("1", "SCHEDULED")];
    const map = new Map<string, LiveEnrichment>([
      ["1", { status: "LIVE", minute: 57, score: { home: 1, away: 0 } }],
    ]);
    const [updated] = mergeLiveEnrichment(base, map);
    expect(updated!.status).toBe("LIVE");
    expect(updated!.minute).toBe(57);
    expect(updated!.score).toEqual({ home: 1, away: 0 });
  });

  it("map vide -> liste inchangee (dernier etat connu, panne live)", () => {
    const base = [match("1", "FINISHED")];
    const result = mergeLiveEnrichment(base, new Map());
    expect(result).toBe(base);
    expect(result[0]!.status).toBe("FINISHED");
  });

  it("ne touche pas les matchs absents de la map", () => {
    const base = [match("1", "SCHEDULED"), match("2", "SCHEDULED")];
    const map = new Map<string, LiveEnrichment>([
      ["1", { status: "LIVE", minute: 10, score: { home: 0, away: 0 } }],
    ]);
    const result = mergeLiveEnrichment(base, map);
    expect(result[0]!.status).toBe("LIVE");
    expect(result[1]!.status).toBe("SCHEDULED");
  });
});

describe("polling conditionnel (PRD §9)", () => {
  it("hasLiveMatches true si LIVE ou HALFTIME", () => {
    expect(hasLiveMatches([match("1", "LIVE")])).toBe(true);
    expect(hasLiveMatches([match("1", "HALFTIME")])).toBe(true);
    expect(hasLiveMatches([match("1", "SCHEDULED"), match("2", "FINISHED")])).toBe(false);
  });

  it("liveRefetchInterval = 30000 si >=1 live, false sinon", () => {
    expect(liveRefetchInterval([match("1", "LIVE")])).toBe(30_000);
    expect(liveRefetchInterval([match("1", "FINISHED")])).toBe(false);
    expect(liveRefetchInterval([])).toBe(false);
  });
});
