import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BracketRound, Match } from "@/lib/providers/types";
import { Bracket } from "./Bracket";

function match(id: string, stage: Match["stage"], home: string, away: string): Match {
  return {
    id,
    stage,
    group: null,
    kickoff: "2026-07-01T19:00:00.000Z",
    status: "SCHEDULED",
    minute: null,
    home: { id: `${id}h`, name: home, code: null, flagUrl: null },
    away: { id: `${id}a`, name: away, code: null, flagUrl: null },
    score: { home: null, away: null },
    venue: { id: "v", name: "V", city: "", country: "" },
  };
}

describe("Bracket", () => {
  it("rend les titres de tours et les matchs", () => {
    const rounds: BracketRound[] = [
      { stage: "SEMI_FINAL", matches: [match("99", "SEMI_FINAL", "Vainqueur M1", "Vainqueur M2")] },
      { stage: "FINAL", matches: [match("104", "FINAL", "Finaliste 1", "Finaliste 2")] },
    ];
    render(<Bracket rounds={rounds} />);
    expect(screen.getByText("Demies")).toBeInTheDocument();
    expect(screen.getByText("Finale")).toBeInTheDocument();
    expect(screen.getByText("Vainqueur M1")).toBeInTheDocument();
    expect(screen.getByText("Finaliste 2")).toBeInTheDocument();
  });

  it("affiche un etat vide sans tours", () => {
    render(<Bracket rounds={[]} />);
    expect(
      screen.getByText(
        "Le tableau à élimination directe n'est pas encore disponible.",
      ),
    ).toBeInTheDocument();
  });
});
