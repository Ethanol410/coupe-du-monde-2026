/**
 * Fuseau IANA par stadium_id (couche statique rezarahiminia).
 * Nécessaire pour convertir `local_date` (heure locale du stade) en UTC ISO.
 * Le Mexique n'observe plus le DST (2022) ; US/Canada l'observent (actif en juin-juillet).
 * Map vérifiée contre la liste des 16 stades et recoupée avec les offsets openfootball.
 */
const STADIUM_TIMEZONES: Readonly<Record<string, string>> = {
  "1": "America/Mexico_City", // Estadio Azteca, Mexico City
  "2": "America/Mexico_City", // Estadio Akron, Guadalajara
  "3": "America/Monterrey", // Estadio BBVA, Monterrey
  "4": "America/Chicago", // AT&T Stadium, Dallas/Arlington
  "5": "America/Chicago", // NRG Stadium, Houston
  "6": "America/Chicago", // Arrowhead, Kansas City
  "7": "America/New_York", // Mercedes-Benz, Atlanta
  "8": "America/New_York", // Hard Rock, Miami
  "9": "America/New_York", // Gillette, Boston/Foxborough
  "10": "America/New_York", // Lincoln Financial, Philadelphia
  "11": "America/New_York", // MetLife, New York/New Jersey
  "12": "America/Toronto", // BMO Field, Toronto
  "13": "America/Vancouver", // BC Place, Vancouver
  "14": "America/Los_Angeles", // Lumen Field, Seattle
  "15": "America/Los_Angeles", // Levi's, SF Bay Area/Santa Clara
  "16": "America/Los_Angeles", // SoFi, Los Angeles/Inglewood
};

/** Fuseau d'un stade. Repli sur America/New_York si id inconnu (jamais de crash). */
export function getStadiumTimezone(stadiumId: string): string {
  return STADIUM_TIMEZONES[stadiumId] ?? "America/New_York";
}
