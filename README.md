# Tracker Coupe du Monde 2026 ⚽

Suivi de la Coupe du Monde FIFA 2026 (États-Unis · Canada · Mexique) : matchs **à venir**,
**en direct** et **terminés**, classements des 12 groupes et tableau à élimination directe.

- **Stack** : Next.js 16 (App Router) · TypeScript strict · Tailwind v4 + shadcn/ui · React Query · Vitest · Playwright.
- **Identité** : éditorial kiosque (crème / encre / rouge), mobile-first, dark mode, accessible (Lighthouse A11y 100).
- **Coût d'exploitation : 0 €** — voir ci-dessous.

## ✨ Fonctionnalités

- Accueil en 3 sections (En direct / À venir / Terminés) avec filtres par **jour**, par **groupe/tour** et par **équipe** (menu avec drapeaux) ; heures converties au fuseau du navigateur.
- Live temps réel optionnel avec polling conditionnel (30 s **uniquement** s'il y a un match en cours) + dégradation gracieuse (« données différées »).
- Page détail d'un match : score, infos, chronologie des buts.
- **Fiche par nation** (`/equipe/[code]`) : prochain match, dernier résultat et calendrier complet, reliée depuis les classements et le détail.
- Classements des 12 groupes (tri points → diff → buts pour) et bracket R32 → Finale.
- Dark mode, responsive, SEO (sitemap, robots, OpenGraph).

## 💸 Garantie « 0 € »

| Poste | Choix | Coût |
|---|---|---|
| Données statiques (104 matchs, 48 équipes, 12 groupes, 16 stades) | Embarquées dans le repo (`src/data/*.json`) | 0 € |
| Résultats | `openfootball/worldcup.json` via CDN GitHub | 0 € |
| Live temps réel (option) | `worldcup26.ir` — lecture publique, **sans clé** | 0 € |
| Base de données | **Aucune** | 0 € |
| Hébergement | Vercel Hobby / Cloudflare Pages / Netlify (tier gratuit) | 0 € |
| Domaine | Sous-domaine fourni (`*.vercel.app`) | 0 € |

Aucune dépendance payante, aucune carte bancaire. **L'application fonctionne intégralement sans aucune variable d'environnement** (couche statique embarquée + openfootball).

## 🏗️ Architecture (en couches)

```
src/data/*.json            ← couche 1 : squelette figé, embarqué (toujours dispo, hors-ligne)
src/lib/providers/         ← accès données (types = source de vérité)
  ├─ static.ts             ← lit src/data, mappe vers le domaine, kickoff -> UTC
  ├─ openfootball.ts       ← enrichit scores + buts (CDN, jointure par nom)
  ├─ worldcup2026.ts       ← live + résultats (worldcup26.ir, jointure par id)
  ├─ composite.ts          ← statique + openfootball + worldcup26, dégradation gracieuse
  └─ mock.ts               ← provider déterministe (tests)
src/lib/data/              ← API métier : getMatches/getMatchById/getLiveMatches/
                             getStandings/getBracket/getTeams/getTeamByCode
app/ + components/         ← UI : ne connaît QUE les types du domaine
  routes : / · /groupes · /bracket · /match/[id] · /equipe/[code]
app/api/live/route.ts      ← proxy serverless du live (cache court)
```

Principe : les composants ne dépendent que des **types du domaine** ; le squelette vient toujours
de la couche statique ; le live n'est qu'un **enrichissement** (si la source distante tombe, on garde
le dernier état connu).

### Crédit des sources de données

- Calendrier / équipes / groupes / stades : [`rezarahiminia/worldcup2026`](https://github.com/rezarahiminia/worldcup2026) (licence ISC). Voir `src/data/SOURCE.md`.
- Résultats : [`openfootball/worldcup.json`](https://github.com/openfootball/worldcup.json) (domaine public).
- Live : API publique [`worldcup26.ir`](https://worldcup26.ir).

## 🚀 Démarrage local

```bash
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run typecheck` | Vérification TypeScript (strict) |
| `npm run lint` | ESLint |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests end-to-end (Playwright) |

## 🔐 Variables d'environnement — **toutes optionnelles**

L'application fonctionne sans aucune de ces variables (voir `.env.example`).

| Variable | Rôle | Défaut si absente |
|---|---|---|
| `WC_LIVE_TOKEN` | Jeton pour la source live `worldcup26.ir`. **Non requis** (lecture publique). | Live sans token (fonctionne quand même) |
| `NEXT_PUBLIC_SITE_URL` | URL absolue du site (sitemap, robots, OpenGraph). | `http://localhost:3000` |

## ☁️ Déploiement gratuit (Vercel Hobby)

1. Pousser le repo sur GitHub.
2. Sur [vercel.com/new](https://vercel.com/new), importer le repo. Le framework **Next.js** est auto-détecté
   (build `next build`, aucune configuration requise).
3. **Variables d'env** : aucune n'est obligatoire — laisser vide pour un site 100 % fonctionnel.
   Optionnel : définir `NEXT_PUBLIC_SITE_URL` (ex. `https://<projet>.vercel.app`) pour des URLs absolues correctes.
4. Déployer → le site est servi sur `https://<projet>.vercel.app`.

Aucune carte bancaire, aucun service payant, pas de base de données.

### Fraîcheur des données

Pendant le tournoi, les vues qui dépendent des résultats sont **rendues dynamiquement**
(serveur), avec les sources distantes mises en cache pour rester économes et protéger
la source live : **openfootball** ~15 min, **worldcup26.ir** ~30 s (cache partagé).

| Contenu | Méthode | Fréquence |
|---|---|---|
| Classements `/groupes`, bracket `/bracket`, détail `/match/[id]` | Rendu dynamique (serveur) | à chaque requête (sources en cache) |
| Accueil `/`, fiche équipe `/equipe/[code]` | ISR + réconciliation live côté client | régénération + fetch au montage |
| Live (minute / score, accueil) | Polling React Query via `/api/live` | 30 s **si ≥ 1 match en cours**, sinon désactivé (fetch au montage systématique) |

> Sources de scores : **openfootball** (jointure par nom) + **worldcup26.ir** (jointure par `id`, fiable, gère le live). **Cartons et compositions ne sont pas fournis** par ces sources gratuites — la chronologie affiche les buts.

## ✅ Qualité

- TypeScript strict, aucun `any`.
- **75 tests unitaires** (Vitest : mapping, fuseaux, classements, live, filtres, composants) + **9 tests e2e** (Playwright : 3 états, navigation, détail, dark mode, filtre équipe, fiche équipe).
- Lighthouse mobile (accueil) : **Performance 93**, **Accessibilité 100**.
