import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Match, Team } from "@/lib/providers/types";
import { MatchCard } from "./MatchCard";

function team(id: string, name: string, code: string | null, flag: string | null): Team {
  return { id, name, code, flagUrl: flag };
}

const VENUE = { id: "v", name: "Estadio Azteca", city: "Mexico City", country: "Mexico" };

const FINISHED: Match = {
  id: "1",
  stage: "GROUP",
  group: "A",
  kickoff: "2026-06-11T19:00:00.000Z",
  status: "FINISHED",
  minute: null,
  home: team("1", "Mexico", "MEX", "https://flagcdn.com/w80/mx.png"),
  away: team("2", "South Africa", "RSA", "https://flagcdn.com/w80/za.png"),
  score: { home: 2, away: 1 },
  venue: VENUE,
};

describe("MatchCard", () => {
  it("affiche les equipes, le score et le statut d'un match termine", () => {
    render(<MatchCard match={FINISHED} />);
    expect(screen.getByText("Mexico")).toBeInTheDocument();
    expect(screen.getByText("South Africa")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voir le détail du match" }),
    ).toHaveAttribute("href", "/match/1");
  });

  it("masque le score d'un match a venir (placeholder, pas de CLS)", () => {
    const scheduled: Match = {
      ...FINISHED,
      id: "5",
      status: "SCHEDULED",
      score: { home: null, away: null },
    };
    render(<MatchCard match={scheduled} />);
    expect(screen.getByText("À venir")).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("gere une equipe placeholder (flagUrl null) sans crash", () => {
    const ko: Match = {
      ...FINISHED,
      id: "104",
      stage: "FINAL",
      group: null,
      status: "SCHEDULED",
      score: { home: null, away: null },
      home: team("placeholder-104-home", "Vainqueur Match 101", null, null),
      away: team("placeholder-104-away", "Vainqueur Match 102", null, null),
    };
    render(<MatchCard match={ko} />);
    expect(screen.getByText("Vainqueur Match 101")).toBeInTheDocument();
    expect(screen.getByText("Vainqueur Match 102")).toBeInTheDocument();
  });
});
