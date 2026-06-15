/**
 * Schémas zod des données brutes (frontières non garanties).
 * - Données embarquées rezarahiminia/worldcup2026 (src/data/*.json) : champs inconnus ignorés.
 * - Réponse distante openfootball : validée avant usage (dégradation gracieuse si invalide).
 */
import { z } from "zod";

// --- rezarahiminia (couche statique embarquée) ---

export const RawTeamSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  fifa_code: z.string().nullable().optional(),
  iso2: z.string().nullable().optional(),
  flag: z.string().nullable().optional(),
  groups: z.string(),
});
export type RawTeam = z.infer<typeof RawTeamSchema>;

export const RawStadiumSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  fifa_name: z.string().optional(),
  city_en: z.string(),
  country_en: z.string(),
});
export type RawStadium = z.infer<typeof RawStadiumSchema>;

export const RawMatchSchema = z.object({
  id: z.string(),
  home_team_id: z.string(),
  away_team_id: z.string(),
  home_score: z.string(),
  away_score: z.string(),
  group: z.string(),
  matchday: z.string(),
  local_date: z.string(),
  stadium_id: z.string(),
  finished: z.string(),
  time_elapsed: z.string().optional(),
  type: z.string(),
  home_team_label: z.string().optional(),
  away_team_label: z.string().optional(),
});
export type RawMatch = z.infer<typeof RawMatchSchema>;

export const RawGroupSchema = z.object({
  name: z.string(),
  teams: z.array(z.object({ team_id: z.string() })),
});
export type RawGroup = z.infer<typeof RawGroupSchema>;

export const RawTeamArraySchema = z.array(RawTeamSchema);
export const RawStadiumArraySchema = z.array(RawStadiumSchema);
export const RawMatchArraySchema = z.array(RawMatchSchema);
export const RawGroupArraySchema = z.array(RawGroupSchema);

// --- openfootball (couche 2, scores — distante, non fiable) ---

// openfootball melange parfois nombres et chaines ("2" / 2, minute "9" / 9)
// selon l'edition -> on coerce pour tolerer les deux.
export const OpenfootballScoreSchema = z.object({
  ft: z.array(z.coerce.number()).optional(),
  ht: z.array(z.coerce.number()).optional(),
  et: z.array(z.coerce.number()).optional(),
  p: z.array(z.coerce.number()).optional(),
});

export const OpenfootballGoalSchema = z.object({
  name: z.string(),
  // minute peut etre un nombre, "9", ou un temps additionnel "45+5" -> on garde
  // la valeur brute et on extrait les chiffres au mapping (sinon NaN casse le parse).
  minute: z.union([z.number(), z.string()]),
  offset: z.union([z.number(), z.string()]).optional(),
  penalty: z.boolean().optional(),
  owngoal: z.boolean().optional(),
});
export type OpenfootballGoal = z.infer<typeof OpenfootballGoalSchema>;

export const OpenfootballMatchSchema = z.object({
  round: z.string().optional(),
  date: z.string(),
  time: z.string().optional(),
  team1: z.string(),
  team2: z.string(),
  group: z.string().optional(),
  ground: z.string().optional(),
  score: OpenfootballScoreSchema.optional(),
  goals1: z.array(OpenfootballGoalSchema).optional(),
  goals2: z.array(OpenfootballGoalSchema).optional(),
});
export type OpenfootballMatch = z.infer<typeof OpenfootballMatchSchema>;

export const OpenfootballSchema = z.object({
  name: z.string().optional(),
  matches: z.array(OpenfootballMatchSchema),
});
export type OpenfootballData = z.infer<typeof OpenfootballSchema>;

// --- worldcup26.ir (couche live temps reel — distante, non fiable) ---
// Meme forme que les matchs statiques (jointure par `id`), via GET /get/games.

export const Worldcup2026Schema = z.object({
  games: z.array(RawMatchSchema),
});
export type Worldcup2026Data = z.infer<typeof Worldcup2026Schema>;
