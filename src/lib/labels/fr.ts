/**
 * Libellés FR de l'application.
 * Règle CLAUDE.md : aucune chaîne de texte en dur dans les composants.
 * Toute chaîne affichée passe par ce fichier (architecture i18n-ready, PRD §10).
 */
export const fr = {
  app: {
    title: "Coupe du Monde 2026",
    description:
      "Suivez la Coupe du Monde FIFA 2026 : matchs à venir, en direct et terminés, en un coup d'œil.",
    tagline: "À venir · En direct · Terminés",
  },
} as const;

export type Labels = typeof fr;
