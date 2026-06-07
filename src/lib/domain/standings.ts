/**
 * Calcul pur des classements de groupes (aucune dependance reseau).
 * Tri : points desc, puis difference de buts, puis buts pour, puis nom (PRD §8, ROADMAP Phase 5).
 * Seuls les matchs de groupe TERMINES avec score connu comptent (pre-tournoi -> tout a zero).
 */
import type {
  GroupStanding,
  GroupStandingRow,
  Match,
  Team,
} from "@/lib/providers/types";

function emptyRow(team: Team): GroupStandingRow {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  };
}

function applyResult(row: GroupStandingRow, scored: number, conceded: number): GroupStandingRow {
  const won = scored > conceded ? 1 : 0;
  const drawn = scored === conceded ? 1 : 0;
  const lost = scored < conceded ? 1 : 0;
  return {
    ...row,
    played: row.played + 1,
    won: row.won + won,
    drawn: row.drawn + drawn,
    lost: row.lost + lost,
    goalsFor: row.goalsFor + scored,
    goalsAgainst: row.goalsAgainst + conceded,
    goalDiff: row.goalDiff + (scored - conceded),
    points: row.points + (won ? 3 : drawn ? 1 : 0),
  };
}

function compareRows(a: GroupStandingRow, b: GroupStandingRow): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.team.name.localeCompare(b.team.name);
}

export function computeStandings(
  matches: Match[],
  groups: Array<{ group: string; teams: Team[] }>,
): GroupStanding[] {
  return groups.map(({ group, teams }) => {
    const rowsById = new Map<string, GroupStandingRow>(
      teams.map((t) => [t.id, emptyRow(t)]),
    );

    for (const m of matches) {
      if (m.stage !== "GROUP" || m.group !== group) continue;
      if (m.status !== "FINISHED") continue;
      const { home, away } = m.score;
      if (home === null || away === null) continue;
      const homeRow = rowsById.get(m.home.id);
      const awayRow = rowsById.get(m.away.id);
      if (homeRow) rowsById.set(m.home.id, applyResult(homeRow, home, away));
      if (awayRow) rowsById.set(m.away.id, applyResult(awayRow, away, home));
    }

    return { group, rows: [...rowsById.values()].sort(compareRows) };
  });
}
