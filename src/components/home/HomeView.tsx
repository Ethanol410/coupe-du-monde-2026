"use client";

import { useMemo, useState } from "react";
import { hasLiveMatches } from "@/lib/domain/live";
import { formatKickoffDate, localDayKey } from "@/lib/datetime";
import { fr } from "@/lib/labels/fr";
import { useLiveMatches } from "@/lib/use-live-matches";
import { useTimeZone } from "@/lib/use-timezone";
import type { Match, Stage } from "@/lib/providers/types";
import { DayFilter, type DayOption } from "./DayFilter";
import { GroupFilter } from "./GroupFilter";
import { MatchSection } from "./MatchSection";

const KNOCKOUT_STAGES: readonly Stage[] = [
  "ROUND_OF_32",
  "ROUND_OF_16",
  "QUARTER_FINAL",
  "SEMI_FINAL",
  "THIRD_PLACE",
  "FINAL",
];

function matchesFilter(match: Match, filterKey: string): boolean {
  if (!filterKey) return true;
  const [kind, value] = filterKey.split(":");
  if (kind === "group") return match.group === value;
  if (kind === "stage") return match.stage === value;
  return true;
}

export function HomeView({ matches: initialMatches }: { matches: Match[] }) {
  const { matches, deferred } = useLiveMatches(initialMatches);
  const timeZone = useTimeZone();
  const [day, setDay] = useState<string | null>(null);
  const [filterKey, setFilterKey] = useState<string>("");

  const liveOngoing = hasLiveMatches(matches);

  const byGroup = useMemo(
    () => matches.filter((m) => matchesFilter(m, filterKey)),
    [matches, filterKey],
  );

  const days = useMemo<DayOption[]>(() => {
    const sampleByKey = new Map<string, string>();
    for (const m of byGroup) {
      const key = localDayKey(m.kickoff, timeZone);
      if (!sampleByKey.has(key)) sampleByKey.set(key, m.kickoff);
    }
    return [...sampleByKey.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, iso]) => ({ key, label: formatKickoffDate(iso, "fr-FR", timeZone) }));
  }, [byGroup, timeZone]);

  // Jour effectif derive (pas d'effet) : si le jour selectionne n'existe plus
  // apres un changement de groupe, on retombe sur « tous ».
  const effectiveDay =
    day !== null && days.some((d) => d.key === day) ? day : null;

  const visible = useMemo(
    () =>
      effectiveDay === null
        ? byGroup
        : byGroup.filter((m) => localDayKey(m.kickoff, timeZone) === effectiveDay),
    [byGroup, effectiveDay, timeZone],
  );

  const live = visible.filter((m) => m.status === "LIVE" || m.status === "HALFTIME");
  const finished = visible.filter((m) => m.status === "FINISHED");
  const upcoming = visible.filter(
    (m) => m.status === "SCHEDULED" || m.status === "POSTPONED",
  );

  const groups = useMemo(
    () =>
      [
        ...new Set(
          matches.map((m) => m.group).filter((g): g is string => g !== null),
        ),
      ].sort(),
    [matches],
  );
  const stages = useMemo(
    () => KNOCKOUT_STAGES.filter((s) => matches.some((m) => m.stage === s)),
    [matches],
  );

  return (
    <div className="flex flex-col gap-6">
      {(liveOngoing || deferred) && (
        <div className="flex flex-wrap items-center gap-3" aria-live="polite">
          {liveOngoing && (
            <span className="inline-flex items-center gap-1.5 bg-primary px-2 py-0.5 font-display text-xs uppercase tracking-wider text-primary-foreground">
              <span
                className="live-dot inline-block size-2 rounded-full bg-current"
                aria-hidden
              />
              {fr.live.indicator}
            </span>
          )}
          {deferred && (
            <span className="font-sans text-sm text-muted-foreground">
              {fr.live.deferred}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <GroupFilter
          groups={groups}
          stages={stages}
          selected={filterKey}
          onSelect={setFilterKey}
        />
        <DayFilter days={days} selected={effectiveDay} onSelect={setDay} />
      </div>

      <MatchSection
        live
        title={fr.sections.live.title}
        empty={fr.sections.live.empty}
        matches={live}
      />
      <MatchSection
        title={fr.sections.upcoming.title}
        empty={fr.sections.upcoming.empty}
        matches={upcoming}
      />
      <MatchSection
        title={fr.sections.finished.title}
        empty={fr.sections.finished.empty}
        matches={finished}
      />
    </div>
  );
}
