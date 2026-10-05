# Eco Clean Expert — Site web officiel

Site vitrine + administration pour **Eco Clean Expert** (marque du groupe JULMARKETING Corporation Sarl U), entreprise de nettoyage professionnel à Abidjan, Côte d'Ivoire.

- Services : canapés, fauteuils, tapis, moquettes, véhicules, bureaux, après-chantier
- Zone : Abidjan — Prix : à partir de 15 000 F CFA
- Téléphone / WhatsApp : +225 01 42 08 97 76

## Stack

- **Next.js 14** (App Router) + **TypeScript strict**
- **Tailwind CSS**
- Persistance : `localStorage` (étape 1 — migration vers Supabase prévue à l'étape 2)
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

## Admin

Route `/admin`. Identifiants de démonstration inchangés par rapport au prototype
(`admin@ecocleanexpert.ci`). **Étape 2** les remplacera par Supabase Auth + middleware.

## Feuille de route

- [x] Étape 1 — migration fidèle vers Next.js + TS + Tailwind (cette PR)
- [ ] Étape 2 — Supabase : Auth, PostgreSQL + RLS, Storage, middleware `/admin`
- [ ] Étape 3 — emails Resend, SEO (`sitemap`, schema.org, pages `/services/[slug]`), GA4, déploiement Vercel

Voir `docs/TODO.md` du prototype pour la liste complète.
