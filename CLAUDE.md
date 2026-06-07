# CLAUDE.md — Tracker Coupe du Monde 2026

Lis `PRD.md` (le quoi/pourquoi) et `ROADMAP.md` (le découpage en phases) avant de commencer une tâche.

## Style
- TypeScript strict, jamais `any`.
- ES modules (import/export), imports destructurés.
- Aucune chaîne de texte en dur dans les composants : passer par les fichiers de libellés (i18n-ready).

## Contrainte budgétaire
- Coût cible du projet : **0 €**. Pas de base de données, pas d'API payante, hébergement gratuit uniquement.
- Données statiques (calendrier, équipes, groupes, stades) : embarquées dans `src/data/*.json`.

## Architecture (non négociable)
- Les composants UI ne connaissent QUE les types du domaine (`src/lib/providers/types.ts`).
- Aucun appel d'API tierce hors de `src/lib/providers/`. Les vues passent par `src/lib/data/`.
- Le squelette (matchs, équipes, groupes, stades) vient TOUJOURS de la couche statique embarquée.
- Les scores/live ne sont qu'un enrichissement : si la source distante échoue, garder le dernier score connu, jamais crasher.
- `kickoff` stocké en UTC ISO 8601 ; conversion de fuseau uniquement à l'affichage.

## Workflow
- Typecheck + lint après chaque série de changements : `npm run typecheck && npm run lint`.
- Préférer lancer un test ciblé : `npm test -- <chemin>`.
- Le live ne se poll que s'il existe au moins un match `LIVE` (sinon polling désactivé).
- Une fonctionnalité n'est "finie" que quand sa vérification (test/build/Lighthouse) passe.

## Pièges
- `WC_LIVE_TOKEN` (source live temps réel, optionnelle) peut être absent : l'app DOIT fonctionner sans, sur la couche statique + openfootball.
- La source live `worldcup26.ir` est fragile (serveur unique) : toujours prévoir la dégradation gracieuse.
- Données de cette source à normaliser : dates en texte ("June 11, 2026") → ISO UTC ; pas d'enum de statut (dériver de `finished` + heure) ; `team_id`/`stadium_id` à résoudre via la couche statique.
- Certaines équipes sont des placeholders ("Vainqueur Groupe A", barragistes) — ce n'est pas une erreur.
- `events` et `lineups` sont optionnels selon la source : prévoir un état "non disponible".
