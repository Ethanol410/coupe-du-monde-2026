/**
 * Libellés FR de l'application.
 * Règle CLAUDE.md : aucune chaîne de texte en dur dans les composants.
 * Toute chaîne affichée passe par ce fichier (architecture i18n-ready, PRD §10).
 */
import type { MatchStatus, Stage } from "@/lib/providers/types";

export const fr = {
  app: {
    title: "Coupe du Monde 2026",
    description:
      "Suivez la Coupe du Monde FIFA 2026 : matchs à venir, en direct et terminés, en un coup d'œil.",
    tagline: "À venir · En direct · Terminés",
    edition: "États-Unis · Canada · Mexique — 2026",
  },
  sections: {
    live: { title: "En direct", empty: "Aucun match en cours pour le moment." },
    upcoming: { title: "À venir", empty: "Aucun match à venir avec ce filtre." },
    finished: { title: "Terminés", empty: "Aucun match terminé avec ce filtre." },
  },
  filters: {
    dayLabel: "Filtrer par jour",
    allDays: "Tous les jours",
    groupLabel: "Filtrer par groupe ou tour",
    allGroups: "Tout",
    groups: "Groupes",
    rounds: "Phase finale",
  },
  status: {
    SCHEDULED: "À venir",
    LIVE: "En direct",
    HALFTIME: "Mi-temps",
    FINISHED: "Terminé",
    POSTPONED: "Reporté",
  } satisfies Record<MatchStatus, string>,
  stages: {
    GROUP: "Phase de groupes",
    ROUND_OF_32: "16es de finale",
    ROUND_OF_16: "8es de finale",
    QUARTER_FINAL: "Quarts de finale",
    SEMI_FINAL: "Demi-finales",
    THIRD_PLACE: "Petite finale",
    FINAL: "Finale",
  } satisfies Record<Stage, string>,
  stagesShort: {
    GROUP: "Groupes",
    ROUND_OF_32: "16es",
    ROUND_OF_16: "8es",
    QUARTER_FINAL: "Quarts",
    SEMI_FINAL: "Demies",
    THIRD_PLACE: "3e place",
    FINAL: "Finale",
  } satisfies Record<Stage, string>,
  match: {
    versus: "contre",
    tbd: "À déterminer",
    noScore: "—",
    detailAria: "Voir le détail du match",
    deferred: "Données différées",
    back: "← Retour à l'accueil",
    eventsSoon: "Chronologie des événements bientôt disponible.",
    notFound: "Match introuvable.",
  },
  a11y: {
    liveRegion: "Matchs en direct, mis à jour automatiquement",
    flagOf: (team: string) => `Drapeau de ${team}`,
  },
} as const;

export type Labels = typeof fr;

export function stageLabel(stage: Stage): string {
  return fr.stages[stage];
}

export function stageShortLabel(stage: Stage): string {
  return fr.stagesShort[stage];
}

export function statusLabel(status: MatchStatus): string {
  return fr.status[status];
}

export function groupLabel(letter: string): string {
  return `Groupe ${letter}`;
}
