# Roadmap Technique — Tracker Coupe du Monde 2026

> À lire **après** `PRD.md`. Chaque phase est conçue pour être donnée à Claude Code **une à la fois**.
> Workflow recommandé pour chaque phase : passer en **Plan Mode** (Shift+Tab), faire valider le plan,
> puis repasser en **Normal Mode** pour l'implémentation. Faire `/clear` entre deux phases.
>
> Chaque phase contient : un **objectif**, des **livrables**, les **fichiers concernés**,
> un **critère de vérification**, et un **prompt prêt à copier** dans Claude Code.

---

## Vue d'ensemble des phases

| # | Phase | Dépend de | Vérification |
|---|---|---|---|
| 0 | Setup & socle | — | `npm run dev` démarre, page vide rendue |
| 1 | Types + données embarquées + couche provider | 0 | Tests data hors-ligne |
| 2 | Listes de matchs + filtres (à venir / terminés) | 1 | e2e affichage des matchs |
| 3 | Live + polling conditionnel | 2 | Test minute/score qui se met à jour |
| 4 | Page détail match + événements | 3 | e2e chronologie d'un match |
| 5 | Classements de groupes + bracket | 1 | Tri du classement testé |
| 6 | Polish : responsive, dark mode, a11y, SEO | 2–5 | Lighthouse ≥ 90 |
| 7 | Déploiement Vercel + monitoring | 6 | Build prod + URL live |

---

## Phase 0 — Setup & socle

**Objectif** : un projet Next.js + TypeScript + Tailwind + shadcn/ui qui démarre, avec lint, typecheck et tests configurés.

**Livrables** : projet initialisé, `CLAUDE.md` en place, scripts npm (`dev`, `build`, `typecheck`, `lint`, `test`, `test:e2e`), Vitest + Playwright installés, dossier `src/lib/providers/` créé vide.

**Vérification** : `npm run dev` sert une page d'accueil placeholder ; `npm run typecheck` et `npm run lint` passent.

**Prompt Claude Code** :
```
# Contexte
Nouveau projet : un tracker de la Coupe du Monde 2026. Voir PRD.md pour la vision.
Stack imposée par PRD §5 : Next.js (App Router), TypeScript strict, Tailwind, shadcn/ui,
React Query, Vitest, Playwright.

# Objectif
Initialiser le projet et toute la tooling. Page d'accueil placeholder "Coupe du Monde 2026".

# Contraintes
- TypeScript strict, pas de `any`.
- Crée le dossier src/lib/providers/ (vide pour l'instant).
- Configure les scripts npm : dev, build, typecheck, lint, test, test:e2e.

# Vérification
Lance `npm run typecheck`, `npm run lint` et `npm run build`.
Ne me dis que c'est fini que quand les trois passent sans erreur ni warning.
```

---

## Phase 1 — Types du domaine, données embarquées, couche provider

**Objectif** : poser la source de vérité (types), **embarquer les données statiques dans le repo**, et créer la couche provider avec les fonctions métier.

**Livrables** :
- `src/lib/providers/types.ts` (exactement le modèle de PRD §8).
- `src/data/*.json` : copier une fois les fichiers `teams`, `matches`, `groups`, `stadiums` depuis le dépôt `rezarahiminia/worldcup2026` (ou `openfootball/worldcup.json`). C'est la couche statique qui rend le site indépendant du réseau.
- `src/lib/providers/static.ts` : lit `src/data/*.json` et les mappe vers les types du domaine (couche 1, PRD §7).
- `src/lib/providers/openfootball.ts` : enrichit les scores/statuts depuis `raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json` (couche 2, résultats).
- `src/lib/data/*` : `getMatches`, `getMatchById`, `getLiveMatches`, `getStandings`, `getBracket` (combinent couche 1 + couche 2 avec dégradation gracieuse).
- Un provider `mock` pour les tests (matchs déterministes dans les 3 états).

**Fichiers concernés** : `src/data/`, `src/lib/providers/`, `src/lib/data/`.

**Vérification** : tests Vitest sur le mapping et le tri ; `getMatches` retourne des `Match` typés même sans réseau.

**Prompt Claude Code** :
```
# Contexte
Voir PRD.md §6 (architecture), §7 (sources, 100% gratuit), §8 (modèle de données).
Le projet est initialisé (Phase 0 faite). Contrainte : 0€, pas de base de données.

# Objectif
1. Créer src/lib/providers/types.ts avec EXACTEMENT le modèle de PRD §8.
2. Embarquer les données statiques : copie teams/matches/groups/stadiums du dépôt
   rezarahiminia/worldcup2026 dans src/data/*.json. Crée le provider static.ts qui les lit.
   ATTENTION au mapping : dates en texte ("June 11, 2026") -> ISO 8601 UTC ;
   statut dérivé du booléen finished + heure du match ; team_id/stadium_id résolus localement.
3. Créer le provider openfootball.ts qui enrichit les scores/statuts depuis le JSON public
   (raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json).
4. Créer src/lib/data/ : getMatches/getMatchById/getLiveMatches/getStandings/getBracket,
   en combinant couche statique (squelette) + openfootball (scores), avec dégradation gracieuse
   si la source distante échoue.
5. Créer un provider mock déterministe pour les tests (1 SCHEDULED, 1 LIVE, 1 FINISHED).

# Contraintes
- Les composants n'appelleront JAMAIS une API directement (PRD §6).
- Le site doit fonctionner même SANS réseau (couche statique embarquée).
- Aucun `any`. kickoff en UTC ISO 8601.

# Vérification
Tests Vitest : le mapping des données statiques, le tri des matchs par date, et le fait que
getMatches() retourne des Match valides même quand openfootball est injoignable (mock l'échec réseau).
Lance `npm test` et `npm run typecheck`. Tout doit passer.
```

---

## Phase 2 — Listes de matchs & filtres

**Objectif** : afficher les matchs avec une `MatchCard` réutilisable et des filtres par statut et par jour.

**Livrables** : `components/MatchCard.tsx`, page d'accueil avec sections « En direct » / « À venir » / « Terminés », filtres par jour et par groupe/tour, conversion d'heure au fuseau du navigateur.

**Vérification** : test e2e Playwright (provider mock) — les 3 sections s'affichent, le filtre par jour fonctionne.

**Prompt Claude Code** :
```
# Contexte
Phases 0–1 faites. Les données viennent de src/lib/data/. Voir PRD §3 (MVP) et §10 (NFR).
Modèle de carte : regarde les composants shadcn/ui existants comme patterns.

# Objectif
Créer un composant MatchCard (équipes, drapeaux, score, statut, minute si LIVE, stade, groupe/tour)
et l'accueil avec 3 sections : En direct, À venir, Terminés. Filtre par jour et par groupe/tour.
Les heures s'affichent dans le fuseau du navigateur (stockage UTC).

# Contraintes
- Mobile-first, carte pleine largeur < 640px.
- Pas de chaîne de texte en dur : passe par un fichier de libellés (préparer i18n, PRD §10).
- Utilise le provider mock pour le rendu en dev.

# Vérification
Écris un test e2e Playwright qui charge l'accueil avec le provider mock et vérifie
qu'un match SCHEDULED, un LIVE et un FINISHED sont visibles dans les bonnes sections.
Lance `npm run test:e2e`. Doit passer.
```

---

## Phase 3 — Live & polling conditionnel

**Objectif** : brancher la source live temps réel **gratuite** (optionnelle) et rafraîchir automatiquement uniquement quand des matchs sont en cours.

**Livrables** : `src/lib/providers/worldcup2026.ts` (API `worldcup26.ir`, auth JWT via `WC_LIVE_TOKEN`), route API serverless `/api/live` qui proxifie et cache, hook React Query avec `refetchInterval` conditionnel (30 s si ≥ 1 live, sinon désactivé), indicateur visuel « live » + `aria-live`, **dégradation gracieuse** si la source est injoignable.

**Vérification** : avec le mock, simuler un match passant de `SCHEDULED` à `LIVE` puis mise à jour minute/score ; vérifier que le polling s'arrête quand plus aucun match n'est live, et que l'app reste fonctionnelle si la source live échoue.

**Prompt Claude Code** :
```
# Contexte
Phases 0–2 faites. Voir PRD §7 (couche 2, provider worldcup2026 gratuit + JWT) et §9 (fraîcheur).
Contrainte : 0€. Cette source live est un BONUS optionnel, jamais une dépendance critique.

# Objectif
1. Implémenter worldcup2026.ts derrière l'interface DataProvider. Auth JWT :
   token lu via process.env.WC_LIVE_TOKEN (inscription gratuite, token longue durée).
   Mapping : dates texte -> ISO UTC, statut dérivé de finished + heure, IDs résolus via la couche statique.
2. Route API serverless /api/live qui appelle ce provider + cache court côté serveur.
3. Hook React Query : refetchInterval = 30s SEULEMENT s'il existe au moins un match LIVE,
   sinon polling désactivé (PRD §9).
4. Indicateur live animé + aria-live="polite" sur les scores.

# Contraintes
- Si WC_LIVE_TOKEN absent OU si l'API ne répond pas : dégradation gracieuse, on garde les
  scores d'openfootball/statique, on marque "données différées", l'app ne crashe JAMAIS (PRD §11.4).
- Aucun appel d'API tierce en dehors de src/lib/providers/.

# Vérification
Avec le provider mock, écris un test qui fait passer un match de SCHEDULED à LIVE et met à jour
minute+score, vérifie que le polling s'arrête quand plus aucun match n'est LIVE, ET qu'une panne
simulée de la source live laisse l'app afficher les derniers scores connus.
Lance `npm test`. Doit passer.
```

---

## Phase 4 — Page détail de match

**Objectif** : page `/match/[id]` avec chronologie des événements et compositions si disponibles.

**Livrables** : route dynamique, `getMatchById` branché (live si dispo, seed sinon), composant `Timeline` (buts, cartons, remplacements), métadonnées SEO dynamiques.

**Vérification** : e2e — ouvrir une carte mène au détail ; la chronologie d'un match terminé du mock s'affiche dans l'ordre.

**Prompt Claude Code** :
```
# Contexte
Phases 0–3 faites. Voir PRD §3 (point 4) et le type MatchDetail/MatchEvent en §8.

# Objectif
Créer la route /match/[id] : score, infos (stade, groupe/tour, date locale),
chronologie des événements (GOAL, YELLOW, RED, SUBSTITUTION...) triée par minute,
compositions si présentes. Métadonnées SEO dynamiques (titre = équipes + date).

# Contraintes
- events et lineups sont optionnels : afficher un état "non disponible" proprement.
- Lien depuis MatchCard vers le détail.

# Vérification
Test e2e : depuis l'accueil (mock), cliquer une carte ouvre /match/[id] et la chronologie
s'affiche dans l'ordre chronologique. Lance `npm run test:e2e`.
```

---

## Phase 5 — Classements & bracket

**Objectif** : onglet Groupes (12 classements) et onglet Bracket (arbre élimination directe).

**Livrables** : `getStandings` calcule/affiche le classement (tri : points, diff, BP) ; `getBracket` ; composants `GroupTable` et `Bracket`.

**Vérification** : test unitaire du tri du classement (égalité de points départagée par diff puis BP).

**Prompt Claude Code** :
```
# Contexte
Phases 0–1 faites (data dispo). Voir PRD §2 (format 12 groupes, élimination directe) et §8.

# Objectif
1. Onglet Groupes : 12 GroupTable (équipe, J, G, N, P, BP, BC, diff, Pts),
   triées par points puis diff de buts puis buts pour.
2. Onglet Bracket : arbre des seizièmes → finale à partir de getBracket().

# Contraintes
- Gérer les équipes placeholder (ex. "Vainqueur Groupe A") sans casser l'affichage.

# Vérification
Écris un test unitaire du tri du classement, avec un cas d'égalité de points départagé
par la différence de buts. Lance `npm test`.
```

---

## Phase 6 — Polish : responsive, dark mode, a11y, SEO

**Objectif** : finition qualité produit.

**Livrables** : dark mode, vérification responsive sur toutes les vues, focus clavier, contrastes AA, sitemap, OpenGraph, état « données différées » si live KO.

**Vérification** : audit Lighthouse mobile ≥ 90 Perf & Accessibilité sur l'accueil.

**Prompt Claude Code** :
```
# Contexte
Toutes les fonctionnalités MVP sont en place. Voir PRD §10 (NFR) et §11 (DoD).

# Objectif
Finition : dark mode, responsive vérifié sur mobile/desktop, navigation clavier complète,
contrastes AA, sitemap + métadonnées OpenGraph, état "données différées" si la source live échoue.

# Contraintes
- Pas de layout shift sur les cartes (réserver l'espace du score).
- Ne casse aucun test existant.

# Vérification
Lance un audit Lighthouse mobile sur l'accueil. Vise ≥ 90 en Performance ET Accessibilité.
Lance `npm run test` + `npm run test:e2e` : tout doit rester vert.
```

---

## Phase 7 — Déploiement gratuit & monitoring

**Objectif** : mise en production sur un hébergeur **gratuit** avec ISR et secrets, sans aucun coût.

**Livrables** : build prod OK, déploiement Vercel Hobby / Cloudflare Pages / Netlify (tier gratuit), variable d'env optionnelle `WC_LIVE_TOKEN`, ISR actif (revalidate selon PRD §9), README de déploiement confirmant le 0 € (PRD §7bis).

**Vérification** : `npm run build` passe ; déploiement gratuit accessible via le sous-domaine de l'hébergeur ; la home affiche bien les 3 états même sans `WC_LIVE_TOKEN`.

**Prompt Claude Code** :
```
# Contexte
MVP terminé et testé. Voir PRD §9 (revalidation ISR), §5 et §7bis (0€, hébergement gratuit).

# Objectif
Préparer le déploiement sur un hébergeur GRATUIT (Vercel Hobby par défaut) :
config ISR (revalidate par type de page), gestion de WC_LIVE_TOKEN en variable d'env OPTIONNELLE,
README "Déploiement" qui confirme l'absence de tout coût (pas de DB, pas d'API payante).

# Contraintes
- Le déploiement doit fonctionner même si WC_LIVE_TOKEN n'est pas défini.
- Aucune ressource payante (pas de base de données managée, pas de plan payant).

# Vérification
Lance `npm run build` en local : doit passer sans erreur.
Donne-moi la checklist exacte des variables d'env (toutes optionnelles) et les étapes de déploiement gratuit.
```

---

## Conseils d'usage avec Claude Code

- **Une phase = une session.** Faire `/clear` entre deux phases pour garder un contexte propre.
- **Toujours en Plan Mode d'abord** sur les phases multi-fichiers (1, 3, 5) : valider le plan avant de coder.
- **Référencer les fichiers avec `@`** (ex. `@PRD.md`, `@src/lib/providers/types.ts`) plutôt que les décrire.
- **Ne jamais accepter un « c'est fini » sans la vérification** indiquée dans la phase (tests / build / Lighthouse).
- Si une phase semble ambiguë, demander à Claude Code de **poser des questions avant d'implémenter**.
