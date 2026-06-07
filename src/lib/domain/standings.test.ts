import { describe, expect, it } from "vitest";
import type { Match, Team } from "@/lib/providers/types";
import { computeStandings } from "./standings";

function team(id: string, name: string): Team {
  return { id, name, code: null, flagUrl: null };
}

const A = team("a", "Alpha");
const B = team("b", "Bravo");
const C = team("c", "Charlie");

function finished(
  id: string,
  home: Team,
  away: Team,
  hs: number,
  as: number,
): Match {
  return {
    id,
    stage: "GROUP",
    group: "A",
    kickoff: `2026-06-1${id}T18:00:00.000Z`,
    status: "FINISHED",
    minute: null,
    home,
    away,
    score: { home: hs, away: as },
    venue: { id: "v", name: "V", city: "", country: "" },
  };
}

describe("computeStandings : tri points -> diff -> BP", () => {
  it("departage une egalite de points par la difference de buts puis les buts pour", () => {
    // A bat C 1-0 ; B bat C 3-0 -> A et B a 3 pts, mais B a meilleure diff.
    const matches = [
      finished("1", A, C, 1, 0),
      finished("2", B, C, 3, 0),
    ];
    const groups = [{ group: "A", teams: [A, B, C] }];
    const rows = computeStandings(matches, groups)[0]!.rows;

    expect(rows.map((r) => r.team.id)).toEqual(["b", "a", "c"]);
    expect(rows[0]!.points).toBe(3);
    expect(rows[0]!.goalDiff).toBe(3);
    expect(rows[1]!.points).toBe(3);
    expect(rows[1]!.goalDiff).toBe(1);
    expect(rows[2]!.points).toBe(0);
    expect(rows[2]!.lost).toBe(2);
  });

  it("pre-tournoi : aucun match termine -> tout a zero", () => {
    const groups = [{ group: "A", teams: [A, B, C] }];
    const rows = computeStandings([], groups)[0]!.rows;
    expect(rows).toHaveLength(3);
    expect(rows.every((r) => r.played === 0 && r.points === 0)).toBe(true);
  });

  it("ignore les matchs LIVE (non termines) dans le calcul", () => {
    const live: Match = { ...finished("3", A, B, 5, 0), status: "LIVE" };
    const groups = [{ group: "A", teams: [A, B, C] }];
    const rows = computeStandings([live], groups)[0]!.rows;
    expect(rows.every((r) => r.played === 0)).toBe(true);
  });
});
