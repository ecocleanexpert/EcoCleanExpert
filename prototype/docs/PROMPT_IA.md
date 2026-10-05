# PROMPT_IA — Refonte production Eco Clean Expert

## Mission
Reprendre le prototype React mono-fichier fourni dans `index.html` et le transformer en application de production sécurisée, performante, responsive et SEO-friendly.

## Stack cible
- Next.js 14 / App Router
- TypeScript strict
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Resend
- Vercel
- Google Analytics 4

## Règle absolue
Préserver l'identité visuelle, le contenu et les fonctionnalités existantes. Ne pas redesign le site. Ne pas supprimer une fonctionnalité sans justification explicite.

## Identité
Couleurs :
#1E9BE0, #0A2A6B, #5CC63D, #071B2C, #FFFFFF.
Police Inter.
Style premium, épuré, professionnel, blanc dominant.

## Animations à conserver
- Typewriter du Hero
- Reveal au scroll
- Compteurs animés
- Comparateur avant/après
- Curseur clignotant
- Barre mobile Appeler + WhatsApp
- Boutons flottants desktop

## Sécurité
- Supprimer tout mot de passe en clair.
- Supabase Auth.
- Middleware protégeant /admin.
- Sessions sécurisées.
- Rate limiting.
- Rôles super-admin / admin / editor.

## Base de données
Créer :
services, before_after, testimonials, zones, faq_items, stats, requests, site_content, legal_content, media.

RLS :
- lecture publique des contenus publiables ;
- écriture réservée aux administrateurs ;
- requests accessibles uniquement aux admins.

## Architecture cible

/app
  /(public)
    layout.tsx
    page.tsx
    mentions-legales/page.tsx
    politique-confidentialite/page.tsx
    services/[slug]/page.tsx
  /admin
    layout.tsx
    login/page.tsx
    page.tsx
    services/page.tsx
    before-after/page.tsx
    testimonials/page.tsx
    zones/page.tsx
    faq/page.tsx
    stats/page.tsx
    requests/page.tsx
    content/page.tsx
    legal/page.tsx
    media/page.tsx
  /api
    requests/route.ts
    upload/route.ts
    email/route.ts

/components
  /ui
  /sections
  /admin

/lib
  /supabase
  /email
  /utils
  /validators

/types
  database.ts

/public/images
middleware.ts

Utiliser Server Components par défaut et Client Components uniquement lorsque nécessaire.

## SEO
- generateMetadata
- sitemap.xml
- robots.txt
- Schema.org LocalBusiness
- Open Graph / Twitter Cards
- H1/H2 cohérents
- alt optimisés
- pages dédiées :
  /services/nettoyage-canape-abidjan
  /services/nettoyage-fauteuil-abidjan
  /services/nettoyage-tapis-abidjan
  /services/nettoyage-moquette-abidjan
  /services/nettoyage-vehicule-abidjan
  /services/nettoyage-bureaux-abidjan
  /services/nettoyage-apres-chantier-abidjan

## Emails
Créer avec Resend :
1. Confirmation client
2. Notification admin
3. Changement de statut

## Analytics
Événements :
- click_whatsapp
- click_call
- submit_form
- view_before_after

Ajouter consentement cookies.

## UX / performance / accessibilité
- Retour en haut
- Mode brouillon
- Aperçu live admin
- Recherche globale
- Export JSON
- 404 personnalisée
- WebP/AVIF
- lazy loading
- code splitting
- caching/ISR
- Lighthouse > 90 mobile
- WCAG AA
- clavier + ARIA + focus visible

## Contraintes
- Ne pas inventer de contenu.
- Reproduire le design existant.
- TypeScript strict.
- Pas de `any` injustifié.
- Mobile-first : 375, 768, 1024, 1440 px.
- Pas de dépendances inutiles.

## Livrables
- Repo structuré
- README
- TODO mis à jour
- migrations SQL
- .env.example
- déploiement Vercel
- compte admin de démonstration
- documentation d'administration

## Processus obligatoire
1. Lire et analyser profondément `index.html`.
2. Inventorier composants, données, routes, styles et comportements.
3. Montrer un plan d'action détaillé.
4. ATTENDRE la validation avant de coder.
5. Procéder ensuite étape par étape et tester chaque livraison.

## Informations à demander avant le développement
- RCCM réel
- CC réel
- adresse physique
- domaine exact
- configuration/identifiants Supabase ou confirmation de création
- images manquantes
- confirmation de la palette

Ne commence jamais le codage avant validation du plan.
