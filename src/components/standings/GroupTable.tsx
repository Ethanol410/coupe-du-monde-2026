import Image from "next/image";
import { fr, groupLabel } from "@/lib/labels/fr";
import type { GroupStanding } from "@/lib/providers/types";
import { cn } from "@/lib/utils";

function formatDiff(diff: number): string {
  return diff > 0 ? `+${diff}` : String(diff);
}

/** Classement d'un groupe (PRD §3.5). Les 2 premiers sont surlignes (qualifies). */
export function GroupTable({ standing }: { standing: GroupStanding }) {
  const s = fr.standings;
  return (
    <section
      aria-label={groupLabel(standing.group)}
      className="border-2 border-border bg-card"
    >
      <h2 className="border-b-2 border-border px-3 py-2 text-lg">
        {groupLabel(standing.group)}
      </h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border font-display text-xs uppercase text-muted-foreground">
            <th scope="col" className="px-2 py-1 text-right">{s.rank}</th>
            <th scope="col" className="px-2 py-1 text-left">{s.team}</th>
            <th scope="col" className="px-1 py-1 text-right">{s.played}</th>
            <th scope="col" className="hidden px-1 py-1 text-right sm:table-cell">{s.won}</th>
            <th scope="col" className="hidden px-1 py-1 text-right sm:table-cell">{s.drawn}</th>
            <th scope="col" className="hidden px-1 py-1 text-right sm:table-cell">{s.lost}</th>
            <th scope="col" className="hidden px-1 py-1 text-right sm:table-cell">{s.goalsFor}</th>
            <th scope="col" className="hidden px-1 py-1 text-right sm:table-cell">{s.goalsAgainst}</th>
            <th scope="col" className="px-1 py-1 text-right">{s.goalDiff}</th>
            <th scope="col" className="px-2 py-1 text-right">{s.points}</th>
          </tr>
        </thead>
        <tbody>
          {standing.rows.map((row, index) => (
            <tr
              key={row.team.id}
              className={cn(
                "border-b border-border/40 last:border-0",
                index < 2 && "bg-secondary/50",
              )}
            >
              <td className="px-2 py-1 text-right tabular-nums text-muted-foreground">
                {index + 1}
              </td>
              <th scope="row" className="px-2 py-1 text-left font-normal">
                <span className="flex items-center gap-2">
                  {row.team.flagUrl ? (
                    <Image
                      src={row.team.flagUrl}
                      alt=""
                      width={20}
                      height={14}
                      className="h-3.5 w-5 shrink-0 border border-border object-cover"
                      unoptimized
                    />
                  ) : (
                    <span
                      className="h-3.5 w-5 shrink-0 border border-border bg-secondary"
                      aria-hidden
                    />
                  )}
                  <span className="truncate font-display uppercase">{row.team.name}</span>
                </span>
              </th>
              <td className="px-1 py-1 text-right tabular-nums">{row.played}</td>
              <td className="hidden px-1 py-1 text-right tabular-nums sm:table-cell">{row.won}</td>
              <td className="hidden px-1 py-1 text-right tabular-nums sm:table-cell">{row.drawn}</td>
              <td className="hidden px-1 py-1 text-right tabular-nums sm:table-cell">{row.lost}</td>
              <td className="hidden px-1 py-1 text-right tabular-nums sm:table-cell">{row.goalsFor}</td>
              <td className="hidden px-1 py-1 text-right tabular-nums sm:table-cell">{row.goalsAgainst}</td>
              <td className="px-1 py-1 text-right tabular-nums">{formatDiff(row.goalDiff)}</td>
              <td className="px-2 py-1 text-right font-display font-bold tabular-nums">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
