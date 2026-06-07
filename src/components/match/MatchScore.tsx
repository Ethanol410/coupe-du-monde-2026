import { cn } from "@/lib/utils";
import { fr } from "@/lib/labels/fr";

/** Valeur de score a largeur reservee -> zero layout shift entre les etats. */
export function ScoreValue({
  value,
  dimmed,
}: {
  value: number | null;
  dimmed?: boolean;
}) {
  return (
    <span
      className={cn(
        "w-7 shrink-0 text-right font-display text-2xl font-bold tabular-nums",
        dimmed && "text-muted-foreground",
      )}
    >
      {value === null ? fr.match.noScore : value}
    </span>
  );
}
