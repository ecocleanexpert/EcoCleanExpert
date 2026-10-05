# TODO — Migration en production

## 🔴 Bloquants

### Authentification
- [ ] Supabase Auth
- [ ] Supprimer les identifiants en clair
- [ ] Sessions sécurisées / cookies
- [ ] Middleware pour /admin
- [ ] Rate limiting
- [ ] Vérification email / mot de passe oublié
- [ ] Rôles super-admin / admin / editor

### Base de données
- [ ] PostgreSQL via Supabase
- [ ] Tables services, before_after, testimonials, zones, faq_items, stats, requests, site_content, legal_content, media
- [ ] Migrations SQL
- [ ] RLS
- [ ] Migration des données localStorage

### Stockage
- [ ] Supabase Storage
- [ ] Buckets services, before-after, testimonials, site
- [ ] Remplacer base64 par stockage cloud
- [ ] Optimisation WebP/AVIF
- [ ] Thumbnails

### Légal
- [ ] RCCM réel
- [ ] CC réel
- [ ] Adresse physique
- [ ] Directeur de publication
- [ ] Hébergeur

### Emails
- [ ] Resend / Brevo / SendGrid
- [ ] SPF/DKIM
- [ ] Confirmation client
- [ ] Notification admin
- [ ] Changement de statut

## 🟠 Important
- [ ] Migrer vers Next.js + TypeScript + App Router
- [ ] Tailwind CSS
- [ ] Supprimer Babel Standalone
- [ ] Séparer les composants
- [ ] SEO dynamique
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Schema.org LocalBusiness
- [ ] Pages SEO par service
- [ ] Open Graph / Twitter Cards
- [ ] Google Analytics 4
- [ ] Search Console
- [ ] Google Business Profile
- [ ] Notifications temps réel

## 🟡 Recommandé
- [ ] Retour en haut
- [ ] Typewriter amélioré
- [ ] Aperçu admin
- [ ] Brouillons
- [ ] Historique / undo-redo
- [ ] Recherche globale
- [ ] Export/import JSON
- [ ] Export CSV des demandes
- [ ] Multi-comptes et permissions
- [ ] Logs d'activité
- [ ] Consentement cookies
- [ ] WCAG AA
- [ ] Lighthouse > 90
- [ ] Optimisation images et code splitting
- [ ] Fournir service-vehicule.jpg et abidjan.jpg

## 🔵 Bonus
Chat, A/B testing, fidélité, facturation, i18n, dark mode, PWA, app mobile, newsletter, avis Google, réservation, paiement Orange Money/MTN/Wave, GPS techniciens, CRM.

## Mise en ligne
Préparer domaine ecocleanexpert.ci, Vercel, Supabase, Resend, Analytics, Search Console et Google Business Profile.
Puis GitHub → Vercel → variables d'environnement → domaine → HTTPS → tests → sitemap/indexation.

## Priorité
Semaine 1 : Auth + DB + Storage
Semaine 2 : Next.js + architecture
Semaine 3 : SEO + Analytics + emails
Semaine 4 : tests + corrections + mise en ligne
Semaine 5+ : amélioration continue
