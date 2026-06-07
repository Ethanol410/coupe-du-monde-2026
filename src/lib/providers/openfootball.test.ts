import { afterEach, describe, expect, it, vi } from "vitest";
import type { OpenfootballData } from "./raw";
import { buildEnrichmentMap, buildJoinKey, fetchResults } from "./openfootball";

const SAMPLE: OpenfootballData = {
  name: "World Cup 2026",
  matches: [
    {
      round: "Matchday 1",
      date: "2026-06-11",
      team1: "Mexico",
      team2: "South Africa",
      score: { ft: [2, 1], ht: [1, 0] },
    },
    {
      round: "Final",
      date: "2026-07-19",
      team1: "Argentina",
      team2: "France",
      score: { ft: [2, 2], et: [3, 3], p: [4, 2] },
    },
    {
      round: "Matchday 1",
      date: "2026-06-12",
      team1: "Canada",
      team2: "Croatia",
      // pas de score -> ignore
    },
  ],
};

describe("openfootball : table d'enrichissement", () => {
  it("mappe un score ft en FINISHED home-away", () => {
    const map = buildEnrichmentMap(SAMPLE);
    const entry = map.get(buildJoinKey("Mexico", "South Africa"));
    expect(entry).toEqual({ score: { home: 2, away: 1 }, status: "FINISHED" });
  });

  it("prefere la prolongation (et) au temps reglementaire (ft)", () => {
    const map = buildEnrichmentMap(SAMPLE);
    const entry = map.get(buildJoinKey("Argentina", "France"));
    expect(entry?.score).toEqual({ home: 3, away: 3 });
  });

  it("ignore les matchs sans score", () => {
    const map = buildEnrichmentMap(SAMPLE);
    expect(map.has(buildJoinKey("Canada", "Croatia"))).toBe(false);
  });

  it("la cle de jointure est insensible a la casse et aux espaces", () => {
    expect(buildJoinKey(" Mexico ", "SOUTH AFRICA")).toBe(
      buildJoinKey("mexico", "south africa"),
    );
  });
});

describe("openfootball : degradation gracieuse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renvoie une Map vide si fetch rejette (panne reseau)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    expect((await fetchResults()).size).toBe(0);
  });

  it("renvoie une Map vide si la reponse n'est pas OK", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", { status: 503 }),
    );
    expect((await fetchResults()).size).toBe(0);
  });

  it("renvoie une Map vide si le JSON est invalide", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ unexpected: true }), { status: 200 }),
    );
    expect((await fetchResults()).size).toBe(0);
  });

  it("parse une reponse valide", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(SAMPLE), { status: 200 }),
    );
    const map = await fetchResults();
    expect(map.get(buildJoinKey("Mexico", "South Africa"))?.score).toEqual({
      home: 2,
      away: 1,
    });
  });
});
