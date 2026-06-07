import Link from "next/link";
import { fr } from "@/lib/labels/fr";
import type { Match, Team } from "@/lib/providers/types";

function Side({ team, score }: { team: Team; score: number | null }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="min-w-0 truncate font-display uppercase">{team.name}</span>
      <span className="shrink-0 font-display font-bold tabular-nums">
        {score === null ? fr.match.noScore : score}
      </span>
    </div>
  );
}

/** Cellule compacte d'un match du tableau final. */
export function BracketMatch({ match }: { match: Match }) {
  const showScore =
    match.status === "LIVE" ||
    match.status === "HALFTIME" ||
    match.status === "FINISHED";

  return (
    <Link
      href={`/match/${match.id}`}
      aria-label={fr.match.detailAria}
      className="block w-56 border-2 border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Side team={match.home} score={showScore ? match.score.home : null} />
      <div className="my-1 border-t border-border/40" />
      <Side team={match.away} score={showScore ? match.score.away : null} />
    </Link>
  );
}
