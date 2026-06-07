import Link from "next/link";
import { LocalTime } from "@/components/LocalTime";
import { fr, groupLabel, stageShortLabel } from "@/lib/labels/fr";
import type { Match } from "@/lib/providers/types";
import { ScoreValue } from "./MatchScore";
import { StatusBadge } from "./StatusBadge";
import { TeamRow } from "./TeamRow";

/** Carte de match reutilisable (PRD §3.2). Pleine largeur sur mobile. */
export function MatchCard({ match }: { match: Match }) {
  const showScore =
    match.status === "LIVE" ||
    match.status === "HALFTIME" ||
    match.status === "FINISHED";
  const dimmed = !showScore;
  const label = match.group ? groupLabel(match.group) : stageShortLabel(match.stage);

  return (
    <Link
      href={`/match/${match.id}`}
      aria-label={fr.match.detailAria}
      className="cv-auto group block border-2 border-border bg-card text-card-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <StatusBadge status={match.status} minute={match.minute} />
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-3">
          <TeamRow team={match.home} />
          <ScoreValue value={showScore ? match.score.home : null} dimmed={dimmed} />
        </div>
        <div className="flex items-center gap-3">
          <TeamRow team={match.away} />
          <ScoreValue value={showScore ? match.score.away : null} dimmed={dimmed} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2 font-sans text-sm text-muted-foreground">
        <span className="min-w-0 truncate">
          {match.venue.name}
          {match.venue.city ? ` · ${match.venue.city}` : ""}
        </span>
        <span className="shrink-0">
          <LocalTime iso={match.kickoff} withDate />
        </span>
      </div>
    </Link>
  );
}
