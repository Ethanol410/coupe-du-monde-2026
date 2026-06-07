import { describe, expect, it } from "vitest";
import type { Match, Team } from "@/lib/providers/types";
import { applyMatchFilter } from "./filter";

function team(id: string, name: string): Team {
  return { id, name, code: null, flagUrl: null };
}

function match(id: string, home: Team, away: Team, stage: Match["stage"], group: string | null): Match {
  return {
    id,
    stage,
    group,
    kickoff: "2026-06-11T19:00:00.000Z",
    status: "SCHEDULED",
    minute: null,
    home,
    away,
    score: { home: null, away: null },
    venue: { id: "v", name: "V", city: "", country: "" },
  };
}

const FR = team("fr", "France");
const AR = team("ar", "Argentine");
const BR = team("br", "Bresil");

const MATCHES: Match[] = [
  match("1", FR, AR, "GROUP", "A"),
  match("2", BR, FR, "GROUP", "A"),
  match("3", AR, BR, "ROUND_OF_32", null),
];

describe("applyMatchFilter — teamId", () => {
  it("garde les matchs ou l'equipe joue (domicile ou exterieur)", () => {
    const res = applyMatchFilter(MATCHES, { teamId: "fr" });
    expect(res.map((m) => m.id)).toEqual(["1", "2"]);
  });

  it("se combine avec un autre filtre (stage)", () => {
    const res = applyMatchFilter(MATCHES, { teamId: "br", stage: "ROUND_OF_32" });
    expect(res.map((m) => m.id)).toEqual(["3"]);
  });

  it("sans filtre, renvoie tout", () => {
    expect(applyMatchFilter(MATCHES)).toHaveLength(3);
  });
});
