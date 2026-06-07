import { fr, stageShortLabel } from "@/lib/labels/fr";
import type { BracketRound } from "@/lib/providers/types";
import { BracketMatch } from "./BracketMatch";

/** Arbre a elimination directe : une colonne par tour (R32 -> Finale), scroll horizontal. */
export function Bracket({ rounds }: { rounds: BracketRound[] }) {
  if (rounds.length === 0) {
    return <p className="font-sans text-muted-foreground">{fr.bracket.empty}</p>;
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {rounds.map((round) => (
        <section
          key={round.stage}
          aria-label={stageShortLabel(round.stage)}
          className="flex shrink-0 flex-col gap-3"
        >
          <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            {stageShortLabel(round.stage)}
          </h2>
          <div className="flex h-full flex-col justify-around gap-3">
            {round.matches.map((match) => (
              <BracketMatch key={match.id} match={match} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
