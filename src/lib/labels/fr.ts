/**
 * Libellés FR de l'application.
 * Règle CLAUDE.md : aucune chaîne de texte en dur dans les composants.
 * Toute chaîne affichée passe par ce fichier (architecture i18n-ready, PRD §10).
 */
import type { MatchEventType, MatchStatus, Stage } from "@/lib/providers/types";

export const fr = {
  app: {
    title: "Coupe du Monde 2026",
    description:
      "Suivez la Coupe du Monde FIFA 2026 : matchs à venir, en direct et terminés, en un coup d'œil.",
    tagline: "À venir · En direct · Terminés",
    edition: "États-Unis · Canada · Mexique — 2026",
    wordmark: "CDM 26",
  },
  nav: {
    home: "Accueil",
    groups: "Groupes",
    bracket: "Bracket",
  },
  pages: {
    groups: "Groupes",
    bracket: "Tableau final",
  },
  standings: {
    rank: "#",
    team: "Équipe",
    played: "J",
    won: "G",
    drawn: "N",
    lost: "P",
    goalsFor: "BP",
    goalsAgainst: "BC",
    goalDiff: "Diff",
    points: "Pts",
    legend: "J joués · G gagnés · N nuls · P perdus · BP buts pour · BC buts contre",
  },
  bracket: {
    title: "Tableau final",
    empty: "Le tableau à élimination directe n'est pas encore disponible.",
  },
  live: {
    indicator: "Direct",
    deferred: "Données différées — dernier état connu (source live indisponible).",
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
    teamLabel: "Filtrer par équipe",
    allTeams: "Toutes les équipes",
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
  event: {
    GOAL: "But",
    OWN_GOAL: "But contre son camp",
    PENALTY: "Penalty",
    YELLOW: "Carton jaune",
    RED: "Carton rouge",
    SUBSTITUTION: "Remplacement",
  } satisfies Record<MatchEventType, string>,
  detail: {
    timeline: "Chronologie",
    timelineEmpty: "Chronologie des événements non disponible.",
    lineups: "Compositions",
    lineupsUnavailable: "Compositions non disponibles.",
    info: "Informations",
    metaDescription: (home: string, away: string) =>
      `Suivez ${home} contre ${away} : score, statut et chronologie — Coupe du Monde 2026.`,
  },
  theme: {
    toggle: "Basculer le thème clair/sombre",
  },
  ui: {
    showMore: (n: number) => `Voir plus (${n})`,
    showLess: "Voir moins",
  },
  a11y: {
    liveRegion: "Matchs en direct, mis à jour automatiquement",
    flagOf: (team: string) => `Drapeau de ${team}`,
    skipToContent: "Aller au contenu",
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

export function eventLabel(type: MatchEventType): string {
  return fr.event[type];
}
