import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MatchEvent } from "@/lib/providers/types";
import { Timeline } from "./Timeline";

describe("Timeline", () => {
  it("affiche les events dans l'ordre chronologique", () => {
    const events: MatchEvent[] = [
      { minute: 78, type: "GOAL", team: "home", player: "Giroud" },
      { minute: 23, type: "PENALTY", team: "home", player: "Mbappe" },
      { minute: 60, type: "GOAL", team: "away", player: "Messi" },
    ];
    render(<Timeline events={events} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]!).getByText("Mbappe")).toBeInTheDocument();
    expect(within(items[1]!).getByText("Messi")).toBeInTheDocument();
    expect(within(items[2]!).getByText("Giroud")).toBeInTheDocument();
  });

  it("affiche un état vide quand aucun event", () => {
    render(<Timeline events={[]} />);
    expect(
      screen.getByText("Chronologie des événements non disponible."),
    ).toBeInTheDocument();
  });
});
