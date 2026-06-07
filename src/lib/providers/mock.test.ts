import { describe, expect, it } from "vitest";
import { mockProvider } from "./mock";

describe("provider mock : 3 etats deterministes", () => {
  it("expose 1 SCHEDULED, 1 LIVE, 1 FINISHED", async () => {
    const matches = await mockProvider.getMatches();
    const statuses = matches.map((m) => m.status).sort();
    expect(statuses).toEqual(["FINISHED", "LIVE", "SCHEDULED"]);
  });

  it("getLiveMatches() ne renvoie que le match LIVE avec minute et score", async () => {
    const live = await mockProvider.getLiveMatches();
    expect(live).toHaveLength(1);
    expect(live[0]!.status).toBe("LIVE");
    expect(live[0]!.minute).toBe(57);
    expect(live[0]!.score).toEqual({ home: 1, away: 0 });
  });

  it("getMatchById() du match termine fournit une chronologie d'events", async () => {
    const detail = await mockProvider.getMatchById("m-finished");
    expect(detail?.status).toBe("FINISHED");
    expect(detail?.events.length).toBe(3);
    expect(detail?.events[0]!.type).toBe("GOAL");
  });

  it("getStandings() calcule un classement depuis le match termine", async () => {
    const standings = await mockProvider.getStandings();
    const groupA = standings.find((s) => s.group === "A");
    expect(groupA).toBeDefined();
    // France a gagne 2-1 -> 3 pts, en tete.
    expect(groupA?.rows[0]!.team.name).toBe("France");
    expect(groupA?.rows[0]!.points).toBe(3);
  });

  it("respecte un filtre par statut", async () => {
    const finished = await mockProvider.getMatches({ status: "FINISHED" });
    expect(finished).toHaveLength(1);
    expect(finished[0]!.id).toBe("m-finished");
  });
});
