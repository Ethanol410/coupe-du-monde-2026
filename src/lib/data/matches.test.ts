import { afterEach, describe, expect, it, vi } from "vitest";
import { getLiveMatches, getMatchById, getMatches } from "./matches";

// Sans NEXT_PUBLIC_DATA_PROVIDER=mock, la couche data utilise le provider composite
// (statique + openfootball). On simule une panne openfootball pour verifier la
// degradation gracieuse : le site doit rester fonctionnel sur la seule couche statique.

afterEach(() => {
  vi.restoreAllMocks();
});

describe("couche data : degradation gracieuse hors-ligne", () => {
  it("getMatches() renvoie 104 Match valides meme si openfootball echoue", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const matches = await getMatches();
    expect(matches).toHaveLength(104);
    for (const m of matches) {
      expect(typeof m.id).toBe("string");
      expect(m.kickoff).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(m.home.name.length).toBeGreaterThan(0);
      expect(m.away.name.length).toBeGreaterThan(0);
    }
  });

  it("getMatches({ stage: 'GROUP' }) ne renvoie que la phase de groupes (72)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const groupMatches = await getMatches({ stage: "GROUP" });
    expect(groupMatches).toHaveLength(72);
    expect(groupMatches.every((m) => m.stage === "GROUP")).toBe(true);
  });

  it("getMatchById() renvoie un MatchDetail (events au moins vide)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const detail = await getMatchById("1");
    expect(detail).not.toBeNull();
    expect(Array.isArray(detail?.events)).toBe(true);
  });

  it("getLiveMatches() renvoie [] en Phase 1 (pas de source live)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await getLiveMatches()).toEqual([]);
  });
});
