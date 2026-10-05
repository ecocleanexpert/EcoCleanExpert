# Eco Clean Expert — Site web officiel

Site vitrine + administration pour **Eco Clean Expert** (marque du groupe JULMARKETING Corporation Sarl U), entreprise de nettoyage professionnel à Abidjan, Côte d'Ivoire.

- Services : canapés, fauteuils, tapis, moquettes, véhicules, bureaux, après-chantier
- Zone : Abidjan — Prix : à partir de 15 000 F CFA
- Téléphone / WhatsApp : +225 01 42 08 97 76

## Stack

- **Next.js 14** (App Router) + **TypeScript strict**
- **Tailwind CSS**
- **Supabase** (Auth, PostgreSQL + RLS, Storage) — avec repli `localStorage` tant que les variables d'env ne sont pas définies
- Identité visuelle préservée du prototype : `#1E9BE0`, `#0A2A6B`, `#5CC63D`, `#071B2C`, police Inter

## Démarrage

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run typecheck
```

## Structure

```
app/
  page.tsx                      # site public (Landing)
  admin/page.tsx                # back-office (login + shell)
  mentions-legales/page.tsx
  politique-confidentialite/page.tsx
components/
  ui.tsx                        # Img, Reveal, AnimatedNumber, useReveal
  fields.tsx                    # Btn, champs, Toast, Confirm, upload, MediaPicker
  chrome.tsx                    # LogoBlock, Header, Footer, MobileBar
  hero.tsx                      # Hero + TypewriterHero
  sections-a|b|c.tsx            # Services, Avant/Après, Pourquoi, Stats, FAQ, Tarifs, Témoignages, Zones, CTA
  contact.tsx                   # formulaire de devis
  legal.tsx / landing.tsx / site-home.tsx / legal-route.tsx
  admin/                        # login, shell, dashboard, requests, stats, services,
                                # faq, legal, beforeafter, testimonials, zones, content, media
lib/
  icons.tsx                     # jeu d'icônes SVG
  defaultContent.ts             # contenu par défaut + type SiteContent
  store.tsx                     # SiteProvider : état global + persistance localStorage
  constants.ts / utils.ts / types.ts
public/images/                  # assets du site
```

## Données localStorage

- `ece_content_v1` — contenu du site éditable via l'admin
- `ece_media_v1` — médiathèque (images compressées en dataURL)
- `ece_requests_v1` — demandes de devis
- `ece_admin` (sessionStorage) — session admin

## Supabase (étape 2)

1. Dans le dashboard Supabase → **SQL Editor**, exécuter dans l'ordre :
   - `supabase/migrations/0001_init.sql` (tables, RLS, buckets Storage `media`/`site`/`services`/`before-after`/`testimonials`)
   - `supabase/seed.sql` (contenu du site + services/zones/FAQ/légal)
2. **Authentication → Users** : créer l'utilisateur admin (ex. `admin@ecocleanexpert.ci`).
3. Copier `.env.example` → `.env.local` et renseigner `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Settings → API). Mêmes variables à configurer dans Vercel.

Sans ces variables, l'app fonctionne comme à l'étape 1 (localStorage + identifiants démo).
Avec : contenu lu/écrit dans `site_content` (JSONB), demandes dans `requests`,
médias uploadés vers le bucket `media`, `/admin` protégé par Supabase Auth + middleware.

## Admin

Route `/admin`. Supabase Auth si configuré, sinon identifiants de démonstration
du prototype (`admin@ecocleanexpert.ci`).

## Feuille de route

- [x] Étape 1 — migration fidèle vers Next.js + TS + Tailwind
- [x] Étape 2 — Supabase : Auth, PostgreSQL + RLS, Storage, middleware `/admin`
- [ ] Étape 3 — emails Resend, SEO (`sitemap`, schema.org, pages `/services/[slug]`), GA4, déploiement Vercel

Voir `docs/TODO.md` du prototype pour la liste complète.
