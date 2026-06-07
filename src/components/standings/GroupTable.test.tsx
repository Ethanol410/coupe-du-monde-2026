import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { GroupStanding, Team } from "@/lib/providers/types";
import { GroupTable } from "./GroupTable";

function team(id: string, name: string, flag: string | null): Team {
  return { id, name, code: null, flagUrl: flag };
}

const STANDING: GroupStanding = {
  group: "A",
  rows: [
    {
      team: team("1", "Mexico", "https://flagcdn.com/w80/mx.png"),
      played: 1,
      won: 1,
      drawn: 0,
      lost: 0,
      goalsFor: 2,
      goalsAgainst: 1,
      goalDiff: 1,
      points: 3,
    },
    {
      team: team("ph", "Vainqueur Groupe A", null),
      played: 1,
      won: 0,
      drawn: 0,
      lost: 1,
      goalsFor: 1,
      goalsAgainst: 2,
      goalDiff: -1,
      points: 0,
    },
  ],
};

describe("GroupTable", () => {
  it("rend les lignes dans l'ordre du classement", () => {
    render(<GroupTable standing={STANDING} />);
    const rows = screen.getAllByRole("row");
    // rows[0] = en-tete ; 1ere equipe = Mexico
    expect(within(rows[1]!).getByText("Mexico")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("3")).toBeInTheDocument();
  });

  it("affiche le titre du groupe et gere un placeholder (flag null)", () => {
    render(<GroupTable standing={STANDING} />);
    expect(screen.getByText("Groupe A")).toBeInTheDocument();
    expect(screen.getByText("Vainqueur Groupe A")).toBeInTheDocument();
  });
});
