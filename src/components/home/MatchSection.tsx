import { MatchCard } from "@/components/match/MatchCard";
import type { Match } from "@/lib/providers/types";

interface MatchSectionProps {
  title: string;
  empty: string;
  matches: Match[];
  /** Active aria-live (section « En direct »). */
  live?: boolean;
}

export function MatchSection({ title, empty, matches, live }: MatchSectionProps) {
  return (
    <section
      aria-label={title}
      aria-live={live ? "polite" : undefined}
      className="flex flex-col gap-3"
    >
      <h2 className="flex items-baseline gap-3 border-b-2 border-border pb-1 text-2xl">
        <span>{title}</span>
        <span className="font-display text-base text-muted-foreground tabular-nums">
          {matches.length}
        </span>
      </h2>

      {matches.length === 0 ? (
        <p className="py-6 font-sans text-muted-foreground">{empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
