# Source des données statiques embarquées

Ces fichiers constituent la **couche 1** (squelette figé : calendrier, équipes, groupes, stades).
Ils sont **copiés une fois** dans le repo pour garantir un fonctionnement 100 % hors-ligne et 0 € (PRD §7).

| Fichier | Origine |
|---|---|
| `teams.json` | `rezarahiminia/worldcup2026` → `football.teams.json` |
| `matches.json` | `rezarahiminia/worldcup2026` → `football.matches.json` |
| `stadiums.json` | `rezarahiminia/worldcup2026` → `football.stadiums.json` |
| `groups.json` | `rezarahiminia/worldcup2026` → `worldcup2026.groups.json` |

- **Dépôt source** : https://github.com/rezarahiminia/worldcup2026
- **Récupéré le** : 2026-06-07 (branche par défaut, `raw.githubusercontent.com/.../HEAD/`)
- **Licence** : permissive (ISC / domaine public) — crédit conservé ici conformément au PRD §7.

Les scores et statuts sont *enrichis* au runtime par la couche 2 (openfootball), avec dégradation
gracieuse : si la source distante échoue, on conserve ces données statiques. Voir `src/lib/providers/`.
