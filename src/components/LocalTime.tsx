"use client";

import { formatKickoffDate, formatKickoffTime } from "@/lib/datetime";
import { useTimeZone } from "@/lib/use-timezone";

/**
 * Affiche l'heure (et la date) au fuseau du navigateur.
 * SSR + 1er rendu : UTC ; apres hydratation : fuseau local (via useTimeZone).
 * `suppressHydrationWarning` absorbe l'ecart attendu, gabarit identique -> pas de CLS.
 */
export function LocalTime({
  iso,
  withDate = false,
}: {
  iso: string;
  withDate?: boolean;
}) {
  const timeZone = useTimeZone();

  const time = formatKickoffTime(iso, "fr-FR", timeZone);
  const content = withDate
    ? `${formatKickoffDate(iso, "fr-FR", timeZone)} · ${time}`
    : time;

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {content}
    </time>
  );
}
