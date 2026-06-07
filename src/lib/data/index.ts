/**
 * Point d'entree de la couche metier. Les composants importent depuis "@/lib/data".
 */
export { getMatches, getMatchById, getLiveMatches } from "./matches";
export { getStandings, computeStandings } from "./standings";
export { getBracket, groupByStage } from "./bracket";
