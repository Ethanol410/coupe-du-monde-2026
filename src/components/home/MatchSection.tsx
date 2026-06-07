"use client";

import { useState } from "react";
import { MatchCard } from "@/components/match/MatchCard";
import { fr } from "@/lib/labels/fr";
import type { Match } from "@/lib/providers/types";

interface MatchSectionProps {
  title: string;
  empty: string;
  matches: Match[];
  /** Active aria-live (section « En direct »). */
  live?: boolean;
  /** Nombre de cartes affichees avant « Voir plus » (perf : limite le DOM initial). */
  limit?: number;
}

export function MatchSection({
  title,
  empty,
  matches,
  live,
  limit = 12,
}: MatchSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? matches : matches.slice(0, limit);
  const hasMore = matches.length > limit;

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
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="self-start border-2 border-border px-3 py-1 font-display text-sm uppercase tracking-wide transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {expanded ? fr.ui.showLess : fr.ui.showMore(matches.length - limit)}
            </button>
          )}
        </>
      )}
    </section>
  );
}
