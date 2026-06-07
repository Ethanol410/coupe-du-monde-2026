import { cn } from "@/lib/utils";
import { eventLabel, fr } from "@/lib/labels/fr";
import type { MatchEvent, MatchEventType } from "@/lib/providers/types";

const ICON: Record<MatchEventType, string> = {
  GOAL: "⚽",
  PENALTY: "⚽",
  OWN_GOAL: "⚽",
  YELLOW: "🟨",
  RED: "🟥",
  SUBSTITUTION: "⇄",
};

function suffix(type: MatchEventType): string | null {
  if (type === "PENALTY") return "(P)";
  if (type === "OWN_GOAL") return "(csc)";
  return null;
}

/** Chronologie des evenements (feuille de match) : domicile a gauche, exterieur a droite. */
export function Timeline({ events }: { events: MatchEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="font-sans text-muted-foreground">{fr.detail.timelineEmpty}</p>
    );
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <ol className="flex flex-col">
      {sorted.map((event, index) => {
        const tag = suffix(event.type);
        return (
          <li
            key={`${event.minute}-${event.team}-${index}`}
            className={cn(
              "flex items-center gap-3 border-b border-border py-2",
              event.team === "away" && "flex-row-reverse text-right",
            )}
          >
            <span className="w-10 shrink-0 font-display tabular-nums text-muted-foreground">
              {`${event.minute}'`}
            </span>
            <span className="shrink-0" title={eventLabel(event.type)} aria-label={eventLabel(event.type)}>
              {ICON[event.type]}
            </span>
            <span className="min-w-0 truncate font-display uppercase">
              {event.player}
            </span>
            {tag && <span className="shrink-0 text-xs text-muted-foreground">{tag}</span>}
          </li>
        );
      })}
    </ol>
  );
}
