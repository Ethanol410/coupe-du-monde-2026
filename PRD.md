# PRD Technique — Tracker Coupe du Monde 2026

> Document destiné à Claude Code CLI. Il décrit **ce qu'il faut construire et pourquoi**.
> Le découpage en étapes implémentables se trouve dans `ROADMAP.md`.
> Les règles de session permanentes se trouvent dans `CLAUDE.md`.

---

## 1. Vision

Un site web qui permet de **suivre la Coupe du Monde FIFA 2026** en un coup d'œil, avec trois états de matchs traités distinctement :

- **Matchs terminés** — résultat final, score, événements clés.
- **Matchs en cours (live)** — score en temps quasi réel, minute de jeu, buts/cartons au fil de l'eau.
- **Matchs à venir** — date, heure (fuseau de l'utilisateur), stade, groupe ou tour.

L'expérience cible : un visiteur arrive, comprend immédiatement « qu'est-ce qui se joue maintenant », « qu'est-ce qui vient de se finir », « quel est le prochain match ».

## 2. Faits de référence sur le tournoi (à coder en dur dans les constantes)

Ces données structurent le tournoi et ne changent pas. Elles servent de socle au modèle et au seed.

- **Dates** : 11 juin → 19 juillet 2026 (39 jours).
- **Hôtes** : États-Unis, Canada, Mexique (première triple organisation).
- **Format** : 48 équipes réparties en **12 groupes de 4**.
- **Matchs** : **104 au total** (72 en phase de groupes).
- **Qualification** : les 2 premiers de chaque groupe + les 8 meilleurs 3es → phase à élimination directe.
- **Phase finale** : seizièmes de finale (32 équipes) → huitièmes → quarts → demies → finale.
- **Match d'ouverture** : Mexique vs Afrique du Sud, Estadio Azteca (Mexico).
- **Finale** : 19 juillet 2026, MetLife Stadium (New York/New Jersey).
- **Stades** : 16 villes hôtes.
- **Statuts de tour** : `GROUP`, `ROUND_OF_32`, `ROUND_OF_16`, `QUARTER_FINAL`, `SEMI_FINAL`, `THIRD_PLACE`, `FINAL`.

> Note : les noms d'équipes des barragistes intercontinentaux peuvent ne pas être connus au moment du build. Le modèle doit tolérer des équipes « à déterminer » (placeholder).

## 3. Périmètre

### MVP (obligatoire)
1. Liste des matchs avec filtre par statut (à venir / en cours / terminé) et par jour.
2. Carte de match (`MatchCard`) affichant équipes, drapeaux, score, statut, minute si live, stade, groupe/tour.
3. Vue « En direct » mettant en avant les matchs `LIVE` avec rafraîchissement automatique.
4. Page détail d'un match : score, chronologie des événements (buts, cartons, remplacements), compositions si disponibles.
5. Classements des 12 groupes (points, J, G, N, P, BP, BC, diff).
6. Bracket / arbre de la phase à élimination directe.
7. Responsive mobile-first + dark mode.

### Hors périmètre MVP (évolutions futures, à documenter mais pas à coder)
- Comptes utilisateurs, favoris, notifications push.
- Jeu de pronostics.
- Cotes / paris.
- Statistiques avancées (xG, heatmaps).
- Multilingue complet (prévoir l'architecture i18n, livrer en FR uniquement au MVP).

## 4. Utilisateurs & cas d'usage

| Persona | Besoin principal | Parcours clé |
|---|---|---|
| Fan pressé | « Qu'est-ce qui se joue là maintenant ? » | Arrive sur l'accueil → bloc « En direct » visible immédiatement |
| Suiveur d'une équipe | Prochain match + dernier résultat de son équipe | Filtre par équipe (post-MVP : favori) |
| Curieux du classement | État des groupes / arbre final | Onglets Groupes et Bracket |

## 5. Stack technique recommandée

> **Contrainte budgétaire absolue : le projet doit coûter 0 €** (build, hébergement, données). Toute décision technique qui introduit un coût récurrent est interdite (voir §7bis).

- **Framework** : Next.js (App Router) + TypeScript strict.
- **UI** : Tailwind CSS + shadcn/ui. Mobile-first.
- **Pas de base de données, pas de backend propre.** Les données statiques sont embarquées dans le repo (§7), les données dynamiques sont lues depuis une source distante gratuite.
- **Données** : couche d'abstraction `DataProvider` (voir §7) — JAMAIS d'appel direct à une API tierce depuis les composants.
- **État live** : polling côté client via React Query (`@tanstack/react-query`) avec `refetchInterval` conditionnel (uniquement quand des matchs sont `LIVE`). SSE en évolution possible, pas au MVP.
- **Tests** : Vitest (unitaire) + Playwright (e2e sur les 3 états de match).
- **Déploiement** : hébergement statique/serverless **gratuit** (Vercel Hobby, Cloudflare Pages ou Netlify free). ISR pour les pages à venir/terminées, route API serverless pour proxifier le live.

> Contrainte : si une décision de stack doit être tranchée, **demander un plan avant d'implémenter** (cf. CLAUDE.md). Ne pas introduire de dépendance lourde, payante, ou de base de données sans justification.

## 6. Architecture (vue d'ensemble)

```
[ APIs externes / fichiers JSON ]
            │
            ▼
   src/lib/providers/        ← couche d'abstraction (interface DataProvider)
     ├─ types.ts             ← types du domaine (source de vérité)
     ├─ openfootball.ts      ← provider seed (fixtures + équipes, sans clé)
     ├─ apiFootball.ts       ← provider live (clé via env, optionnel)
     └─ index.ts             ← sélection du provider selon l'env
            │
            ▼
   src/lib/data/             ← fonctions métier : getMatches(), getLiveMatches(),
                               getStandings(), getMatchById(), getBracket()
            │
            ▼
   app/ (routes) + components/   ← UI pure, ne connaît que les types du domaine
```

**Principe directeur** : les composants ne dépendent que des **types du domaine**, jamais du format brut d'une API. Changer de fournisseur de données = changer un seul fichier provider.

## 7. Sources de données (100% gratuit)

Stratégie en **deux couches** derrière une interface unique. La couche statique est **embarquée dans le repo** (zéro dépendance réseau, zéro coût, toujours disponible) ; la couche dynamique est lue depuis une source distante gratuite avec dégradation gracieuse.

### Couche 1 — Données statiques (embarquées dans le repo)

Le calendrier des 104 matchs, les 48 équipes, les 12 groupes et les 16 stades sont des données **figées** : on les copie une fois dans le repo sous `src/data/*.json` et on ne dépend de personne au runtime.

| Fichier vendu dans le repo | Contenu | Source d'origine (à copier une fois) |
|---|---|---|
| `src/data/teams.json` | 48 équipes (nom, code FIFA, groupe, drapeau) | dépôt `rezarahiminia/worldcup2026` (`football.teams.json`) ou `openfootball/worldcup.json` |
| `src/data/matches.json` | 104 matchs (équipes, date, stade, groupe/tour) | idem |
| `src/data/groups.json` | 12 groupes | idem |
| `src/data/stadiums.json` | 16 stades | idem |

> Ces dépôts sont sous licence permissive (ISC / domaine public). Copier les fichiers, créditer la source dans le README. **C'est cette couche qui garantit que le site fonctionne même si toute source distante est hors service.**

### Couche 2 — Résultats & live (source distante gratuite, optionnelle)

| Source | Usage | Auth | Fiabilité | Coût |
|---|---|---|---|---|
| `openfootball/worldcup.json` via `raw.githubusercontent.com` | Résultats finaux des matchs (auto-mis à jour) | Aucune | Élevée (CDN GitHub) | Gratuit |
| API `rezarahiminia/worldcup2026` (`worldcup26.ir`) | Scores **en temps réel** pendant les matchs | **JWT** (inscription gratuite, token 84 j) | Faible (serveur perso unique, domaine `.ir`, HTTP) | Gratuit |

**Décision recommandée pour le MVP :**
- Provider **`openfootball`** = source par défaut des résultats. Fiable, sans auth, hébergée sur le CDN GitHub. Inconvénient : mise à jour *après* les matchs, pas minute par minute.
- Provider **`worldcup2026`** (rezarahiminia) = couche live temps réel **optionnelle**, activée seulement si un token JWT est fourni en variable d'environnement. À considérer comme un *bonus*, jamais comme une dépendance critique.

**Interface à implémenter** (contrat unique, plusieurs implémentations) :

```ts
interface DataProvider {
  getMatches(filter?: MatchFilter): Promise<Match[]>;
  getMatchById(id: string): Promise<MatchDetail | null>;
  getLiveMatches(): Promise<Match[]>;
  getStandings(): Promise<GroupStanding[]>;
  getBracket(): Promise<BracketRound[]>;
}
```

**Résolution de la source à l'exécution :**
1. Le squelette (calendrier, équipes, groupes, stades) vient TOUJOURS de la couche 1 embarquée.
2. Les scores/statuts sont *enrichis* par la couche 2 si elle répond ; sinon on garde les valeurs de la couche 1 et on marque les données « différées ».
3. Le live temps réel (minute, buteurs) n'est tenté que si `WC_LIVE_TOKEN` est défini ; absence de token = pas de crash, on reste sur openfootball.

> ⚠️ Particularités du provider `worldcup2026` à gérer dans le mapping : dates au format texte (`"June 11, 2026"`, à convertir en ISO 8601 UTC), statut dérivé du booléen `finished` + de l'heure du match (pas d'enum `status` natif), `stadium_id`/`team_id` à résoudre via la couche 1.

## 7bis. Garantie « 0 € » de bout en bout

| Poste | Choix | Coût |
|---|---|---|
| Données statiques | Embarquées dans le repo (`src/data/*.json`) | 0 € |
| Résultats | `raw.githubusercontent.com/openfootball/...` | 0 € |
| Live temps réel (option) | API gratuite + JWT gratuit | 0 € |
| Base de données | **Aucune** (pas nécessaire) | 0 € |
| Hébergement | Vercel Hobby / Cloudflare Pages / Netlify (tier gratuit, usage non commercial) | 0 € |
| Domaine | Sous-domaine fourni par l'hébergeur (`*.vercel.app`) ; domaine custom = optionnel et hors périmètre | 0 € |

Aucune dépendance payante, aucune carte bancaire requise. Le seul « coût » est le quota du tier gratuit de l'hébergeur, largement suffisant pour ce projet.

## 8. Modèle de données

Source de vérité dans `src/lib/providers/types.ts`. Aucun `any`.

```ts
type MatchStatus = 'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINISHED' | 'POSTPONED';
type Stage = 'GROUP' | 'ROUND_OF_32' | 'ROUND_OF_16'
           | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'THIRD_PLACE' | 'FINAL';

interface Team {
  id: string;
  name: string;        // peut être un placeholder ("Vainqueur Groupe A")
  code: string | null; // code ISO 3 lettres, null si indéterminé
  flagUrl: string | null;
}

interface Venue { id: string; name: string; city: string; country: string; }

interface Match {
  id: string;
  stage: Stage;
  group: string | null;     // "A".."L" en phase de groupes, sinon null
  kickoff: string;          // ISO 8601 UTC — la conversion fuseau se fait à l'affichage
  status: MatchStatus;
  minute: number | null;    // renseigné si LIVE
  home: Team;
  away: Team;
  score: { home: number | null; away: number | null };
  venue: Venue;
}

interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'OWN_GOAL' | 'PENALTY' | 'YELLOW' | 'RED' | 'SUBSTITUTION';
  team: 'home' | 'away';
  player: string;
  assist?: string;
}

interface MatchDetail extends Match { events: MatchEvent[]; lineups?: Lineup; }

interface GroupStanding {
  group: string;
  rows: Array<{
    team: Team; played: number; won: number; drawn: number; lost: number;
    goalsFor: number; goalsAgainst: number; goalDiff: number; points: number;
  }>;
}

interface BracketRound { stage: Stage; matches: Match[]; }
```

## 9. Stratégie de fraîcheur des données

| Type de contenu | Méthode | Fréquence |
|---|---|---|
| Matchs à venir / calendrier | ISR (revalidate) | toutes les 60 min |
| Matchs terminés | ISR | toutes les 30 min (jusqu'à figés) |
| Matchs en cours (live) | Polling React Query côté client | 30 s, **uniquement** s'il existe ≥ 1 match `LIVE` ; sinon arrêt du polling |
| Classements / bracket | ISR | toutes les 15 min |

Règle clé : **ne pas poller en continu**. Le `refetchInterval` doit être désactivé quand aucun match n'est live (économie de quota API et de batterie mobile).

## 10. Exigences non-fonctionnelles

- **Performance** : LCP < 2,5 s sur 4G ; pas de layout shift sur les cartes de match.
- **Accessibilité** : navigable au clavier, contrastes AA, `aria-live="polite"` sur les scores live.
- **Responsive** : mobile-first ; les cartes passent en pleine largeur sous 640 px.
- **SEO** : métadonnées dynamiques par page de match ; sitemap.
- **i18n** : textes externalisés (pas de chaînes en dur dans les composants) pour préparer le multilingue, mais livraison FR au MVP.
- **Résilience** : si la source live est indisponible, afficher le dernier score connu + un indicateur « données différées », jamais une page cassée.
- **Fuseaux horaires** : stockage et calcul en UTC, affichage dans le fuseau du navigateur.

## 11. Definition of Done (critères de vérification globaux)

Le MVP est « fait » quand **tout** ce qui suit est vrai et vérifiable :

1. `npm run typecheck` et `npm run lint` passent sans erreur ni warning.
2. Les tests Vitest passent ; couverture des fonctions de `src/lib/data/`.
3. Test e2e Playwright vert pour les 3 états : un match `SCHEDULED`, un `LIVE`, un `FINISHED` s'affichent correctement (utiliser un provider mock pour rendre le test déterministe).
4. Lancer l'app sans `WC_LIVE_TOKEN` ne crashe pas : la couche statique embarquée + openfootball suffisent (matchs `SCHEDULED`/`FINISHED`).
5. Lighthouse ≥ 90 en Performance et Accessibilité sur l'accueil (mobile).
6. Aucun appel d'API tierce hors de `src/lib/providers/`.

## 12. Risques & décisions ouvertes

- **Fragilité de la source live gratuite** : l'API temps réel (`worldcup26.ir`) repose sur un serveur perso unique. Mitigation : elle n'est qu'une couche d'enrichissement optionnelle ; la couche statique embarquée + openfootball garantissent un site fonctionnel en permanence. À réévaluer en Phase 3.
- **Format des données du provider live** : dates en texte, pas d'enum de statut, IDs à résoudre. Géré dans le mapping (PRD §7).
- **Disponibilité des événements/compositions** selon le provider : le modèle les rend optionnels (`events?`, `lineups?`).
- **Équipes indéterminées** (barragistes, vainqueurs de groupe) : gérées par des placeholders, à ne pas traiter comme des erreurs.
