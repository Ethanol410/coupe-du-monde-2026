/**
 * Couche 1 — squelette statique embarqué (PRD §7).
 * Lit src/data/*.json et les mappe vers les types du domaine. Fonctionne hors-ligne.
 */
import { fromZonedTime } from "date-fns-tz";
import teamsRaw from "@/data/teams.json";
import matchesRaw from "@/data/matches.json";
import stadiumsRaw from "@/data/stadiums.json";
import groupsRaw from "@/data/groups.json";
import {
  RawGroupArraySchema,
  RawMatchArraySchema,
  RawStadiumArraySchema,
  RawTeamArraySchema,
  type RawMatch,
  type RawStadium,
  type RawTeam,
} from "./raw";
import { getStadiumTimezone } from "./stadium-timezones";
import type { Match, Stage, Team, Venue } from "./types";

const STAGE_BY_TYPE: Readonly<Record<string, Stage>> = {
  group: "GROUP",
  r32: "ROUND_OF_32",
  r16: "ROUND_OF_16",
  qf: "QUARTER_FINAL",
  sf: "SEMI_FINAL",
  third: "THIRD_PLACE",
  final: "FINAL",
};

// Validation au chargement : ces donnees viennent du repo (fiables) -> un echec est un bug a corriger.
const teams = RawTeamArraySchema.parse(teamsRaw);
const stadiums = RawStadiumArraySchema.parse(stadiumsRaw);
const matches = RawMatchArraySchema.parse(matchesRaw);
const groups = RawGroupArraySchema.parse(groupsRaw);

const teamsById: ReadonlyMap<string, RawTeam> = new Map(teams.map((t) => [t.id, t]));
const stadiumsById: ReadonlyMap<string, RawStadium> = new Map(
  stadiums.map((s) => [s.id, s]),
);

function toStage(type: string): Stage {
  return STAGE_BY_TYPE[type] ?? "GROUP";
}

function mapTeam(raw: RawTeam): Team {
  return {
    id: raw.id,
    name: raw.name_en,
    code: raw.fifa_code ?? null,
    flagUrl: raw.flag ?? null,
  };
}

/** Equipe placeholder pour les matchs a elimination directe (team_id "0"). */
function placeholderTeam(matchId: string, side: "home" | "away", label?: string): Team {
  return {
    id: `placeholder-${matchId}-${side}`,
    name: label ?? "A determiner",
    code: null,
    flagUrl: null,
  };
}

function resolveTeam(
  matchId: string,
  side: "home" | "away",
  teamId: string,
  label?: string,
): Team {
  if (teamId === "0") {
    return placeholderTeam(matchId, side, label);
  }
  const raw = teamsById.get(teamId);
  return raw ? mapTeam(raw) : placeholderTeam(matchId, side, label);
}

function mapVenue(stadiumId: string): Venue {
  const raw = stadiumsById.get(stadiumId);
  if (!raw) {
    return { id: stadiumId, name: "Stade inconnu", city: "", country: "" };
  }
  return { id: raw.id, name: raw.name_en, city: raw.city_en, country: raw.country_en };
}

/** "MM/DD/YYYY HH:MM" (heure locale du stade) -> ISO 8601 UTC. */
export function toUtcIso(localDate: string, stadiumId: string): string {
  const parsed = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/.exec(localDate.trim());
  if (!parsed) {
    throw new Error(`Format de date inattendu: "${localDate}"`);
  }
  const [, mm, dd, yyyy, hh, min] = parsed;
  const wallClock = `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
  const utc = fromZonedTime(wallClock, getStadiumTimezone(stadiumId));
  return utc.toISOString();
}

function mapMatch(raw: RawMatch): Match {
  const stage = toStage(raw.type);
  const finished = raw.finished.toUpperCase() === "TRUE";
  return {
    id: raw.id,
    stage,
    group: stage === "GROUP" ? raw.group : null,
    kickoff: toUtcIso(raw.local_date, raw.stadium_id),
    status: finished ? "FINISHED" : "SCHEDULED",
    minute: null,
    home: resolveTeam(raw.id, "home", raw.home_team_id, raw.home_team_label),
    away: resolveTeam(raw.id, "away", raw.away_team_id, raw.away_team_label),
    score: finished
      ? { home: Number(raw.home_score), away: Number(raw.away_score) }
      : { home: null, away: null },
    venue: mapVenue(raw.stadium_id),
  };
}

/** Squelette statique : 104 matchs tries par kickoff (UTC ISO croissant). */
export function getStaticMatches(): Match[] {
  return matches.map(mapMatch).sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export function getStaticTeams(): Team[] {
  return teams.map(mapTeam);
}

export function getStaticVenues(): Venue[] {
  return stadiums.map((s) => mapVenue(s.id));
}

/** Composition ordonnee des 12 groupes (depuis groups.json). */
export function getStaticGroups(): Array<{ group: string; teams: Team[] }> {
  return groups.map((g) => ({
    group: g.name,
    teams: g.teams.flatMap((entry) => {
      const raw = teamsById.get(entry.team_id);
      return raw ? [mapTeam(raw)] : [];
    }),
  }));
}
