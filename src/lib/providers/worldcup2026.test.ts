import { afterEach, describe, expect, it, vi } from "vitest";
import type { RawMatch } from "./raw";
import {
  buildLiveMap,
  deriveLiveStatus,
  fetchLive,
  parseMinute,
} from "./worldcup2026";

function game(overrides: Partial<RawMatch> & Pick<RawMatch, "id">): RawMatch {
  return {
    home_team_id: "1",
    away_team_id: "2",
    home_score: "0",
    away_score: "0",
    group: "A",
    matchday: "1",
    local_date: "06/11/2026 13:00",
    stadium_id: "1",
    finished: "FALSE",
    time_elapsed: "notstarted",
    type: "group",
    ...overrides,
  };
}

describe("deriveLiveStatus", () => {
  it("notstarted -> SCHEDULED", () => {
    expect(deriveLiveStatus("FALSE", "notstarted")).toBe("SCHEDULED");
  });
  it("finished TRUE -> FINISHED", () => {
    expect(deriveLiveStatus("TRUE", "90")).toBe("FINISHED");
  });
  it("minute en cours -> LIVE", () => {
    expect(deriveLiveStatus("FALSE", "67")).toBe("LIVE");
  });
  it("mi-temps -> HALFTIME", () => {
    expect(deriveLiveStatus("FALSE", "HT")).toBe("HALFTIME");
  });
});

describe("parseMinute", () => {
  it("extrait la minute numerique", () => {
    expect(parseMinute("67")).toBe(67);
    expect(parseMinute("45+2")).toBe(45);
  });
  it("renvoie null si non numerique", () => {
    expect(parseMinute("notstarted")).toBeNull();
    expect(parseMinute("HT")).toBeNull();
  });
});

describe("buildLiveMap (jointure par id)", () => {
  it("indexe les matchs live/termines, ignore les programmes", () => {
    const map = buildLiveMap({
      games: [
        game({ id: "1", finished: "FALSE", time_elapsed: "67", home_score: "2", away_score: "1" }),
        game({ id: "2", finished: "TRUE", time_elapsed: "90", home_score: "3", away_score: "0" }),
        game({ id: "3", finished: "FALSE", time_elapsed: "notstarted" }),
      ],
    });
    expect(map.size).toBe(2);
    expect(map.get("1")).toEqual({ status: "LIVE", minute: 67, score: { home: 2, away: 1 } });
    expect(map.get("2")).toEqual({ status: "FINISHED", minute: null, score: { home: 3, away: 0 } });
    expect(map.has("3")).toBe(false);
  });
});

describe("fetchLive : degradation gracieuse + token optionnel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.WC_LIVE_TOKEN;
  });

  it("reachable=false si fetch rejette", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("down"));
    const { reachable, live } = await fetchLive();
    expect(reachable).toBe(false);
    expect(live.size).toBe(0);
  });

  it("reachable=false si reponse non OK", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 503 }));
    expect((await fetchLive()).reachable).toBe(false);
  });

  it("reachable=false si JSON invalide", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ nope: true }), { status: 200 }),
    );
    expect((await fetchLive()).reachable).toBe(false);
  });

  it("reachable=true + jointure par id sur reponse valide", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          games: [game({ id: "1", finished: "FALSE", time_elapsed: "67", home_score: "2", away_score: "1" })],
        }),
        { status: 200 },
      ),
    );
    const { reachable, live } = await fetchLive();
    expect(reachable).toBe(true);
    expect(live.get("1")?.minute).toBe(67);
  });

  it("reachable=true avec live vide si rien en cours (pre-tournoi)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ games: [game({ id: "1" })] }), { status: 200 }),
    );
    const { reachable, live } = await fetchLive();
    expect(reachable).toBe(true);
    expect(live.size).toBe(0);
  });

  it("n'ajoute PAS d'en-tete Authorization sans token", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ games: [] }), { status: 200 }));
    await fetchLive();
    const init = spy.mock.calls[0]?.[1];
    expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined();
  });

  it("ajoute Authorization: Bearer si WC_LIVE_TOKEN est defini", async () => {
    process.env.WC_LIVE_TOKEN = "tok123";
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ games: [] }), { status: 200 }));
    await fetchLive();
    const init = spy.mock.calls[0]?.[1];
    expect((init?.headers as Record<string, string>)?.Authorization).toBe("Bearer tok123");
  });
});
