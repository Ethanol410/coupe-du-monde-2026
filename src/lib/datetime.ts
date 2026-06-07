/**
 * Formatage date/heure pour l'affichage. Le `kickoff` est stocke en UTC ISO ;
 * la conversion se fait ICI, au fuseau d'affichage (navigateur par defaut).
 * `timeZone` est parametrable pour des tests deterministes.
 */
const DEFAULT_LOCALE = "fr-FR";

/** Heure courte locale, ex. "21:00". */
export function formatKickoffTime(
  iso: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Date courte locale, ex. "jeu. 11 juin". */
export function formatKickoffDate(
  iso: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

/** Date longue pour un en-tete de jour, ex. "jeudi 11 juin". */
export function formatDayHeading(
  iso: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

/**
 * Cle de jour "YYYY-MM-DD" dans le fuseau d'affichage (regroupement/filtre par jour).
 * en-CA produit nativement le format ISO court.
 */
export function localDayKey(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}
