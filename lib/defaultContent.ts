export const DEFAULT_CONTENT = {
  brand: { name: "Eco Clean Expert", tagline: "Expert du nettoyage express", phone: "+225 01 42 08 97 76", city: "Abidjan, Côte d'Ivoire", hours: "7j/7 — 8h à 20h", logo: "images/logo.png" },
  hero: {
    label: "Eco Clean Expert", title1: "Du sale", title2: "au propre.",
    subtitle: "Le nettoyage professionnel qui redonne vie à vos espaces.",
    priceLabel: "À partir de", price: "15 000 F CFA",
ctaPrimary: "Demander un devis", ctaSecondary: "Voir les transformations",
    typewriter: {
      typingSpeed: 35,        // Vitesse de frappe (ms par caractère)
      erasingSpeed: 15,       // Vitesse d'effacement (ms par caractère)
      pauseBetweenLines: 100, // Pause entre ligne 1 et ligne 2 (ms)
      holdDuration: 3000,     // Temps d'affichage complet de la phrase (ms)
      pauseBeforeErasing: 200 // Pause avant d'effacer (ms)
    },
    
    phrases: [
  
  { line1: "Du sale", line2: "au propre." },
  { line1: "Un canapé", line2: "comme neuf." },
  { line1: "Fini les taches,", line2: "place à l'éclat." },
  { line1: "Vos tissus", line2: "méritent mieux." },
  { line1: "Un intérieur", line2: "impeccable." },
  { line1: "Du terne", line2: "à la brillance." },
  { line1: "Redonnez vie", line2: "à vos espaces." },
  { line1: "De l'ombre", line2: "à la lumière." },
  { line1: "Du fatigué", line2: "au ravivé." },
  { line1: "De l'usé", line2: "au renouvelé." },

  // Résultat & qualité (10)
  { line1: "Un résultat", line2: "qui se voit." },
  { line1: "La propreté", line2: "au millimètre." },
  { line1: "Un travail", line2: "soigné." },
  { line1: "L'excellence", line2: "en action." },
  { line1: "Des finitions", line2: "parfaites." },
  { line1: "Un rendu", line2: "sans compromis." },
  { line1: "Le détail", line2: "qui change tout." },
  { line1: "Une qualité", line2: "irréprochable." },
  { line1: "L'éclat", line2: "retrouvé." },
  { line1: "La netteté", line2: "absolue." },

  // Expertise & professionnalisme (10)
  { line1: "L'expertise", line2: "qui change tout." },
  { line1: "Des pros", line2: "à votre service." },
  { line1: "Le savoir-faire", line2: "d'une équipe." },
  { line1: "Une équipe", line2: "formée et équipée." },
  { line1: "Le métier", line2: "bien fait." },
  { line1: "Des techniciens", line2: "passionnés." },
  { line1: "Notre métier,", line2: "votre confort." },
  { line1: "L'expérience", line2: "à votre service." },
  { line1: "Le professionnalisme", line2: "en pratique." },
  { line1: "Des experts", line2: "à domicile." },

  // Confiance & tranquillité (10)
  { line1: "Propre aujourd'hui,", line2: "serein demain." },
  { line1: "Votre maison,", line2: "notre priorité." },
  { line1: "Votre confort,", line2: "notre mission." },
  { line1: "Un service", line2: "de confiance." },
  { line1: "En toute", line2: "tranquillité." },
  { line1: "Prenez soin", line2: "de vous." },
  { line1: "Votre famille", line2: "mérite le meilleur." },
  { line1: "Un intérieur sain,", line2: "une vie sereine." },
  { line1: "Respirez,", line2: "on s'occupe du reste." },
  { line1: "La propreté,", line2: "sans effort." },

  // Rapidité & disponibilité (10)
  { line1: "Un service", line2: "express." },
  { line1: "Rapide,", line2: "propre, efficace." },
  { line1: "Intervention", line2: "en un éclair." },
  { line1: "Disponibles", line2: "7 jours sur 7." },
  { line1: "Un devis", line2: "en moins d'1h." },
  { line1: "Sur place", line2: "en un rien de temps." },
  { line1: "Efficacité", line2: "garantie." },
  { line1: "À votre rythme,", line2: "à votre heure." },
  { line1: "Toujours prêts,", line2: "toujours pros." },
  { line1: "L'express", line2: "de la propreté." },
],
    advantages: [
      { icon: "home", label: "Intervention à domicile" },
      { icon: "spark", label: "Résultats visibles" },
      { icon: "shield", label: "Service rapide et fiable" },
    ],
    image: "images/hero.jpg",
  },
  services: [
    { id: 1, icon: "sofa", title: "Canapés", desc: "Nettoyage en profondeur des tissus.", price: "À partir de 15 000 F CFA", active: true, order: 1, image: "images/service-canape.jpg" },
    { id: 2, icon: "chair", title: "Fauteuils", desc: "Nettoyage et rafraîchissement.", price: "Sur devis", active: true, order: 2, image: "images/service-fauteuil.jpg" },
    { id: 3, icon: "carpet", title: "Tapis & moquettes", desc: "Élimination des saletés et taches.", price: "Sur devis", active: true, order: 3, image: "images/technique.jpg" },
    { id: 4, icon: "car", title: "Intérieur de véhicules", desc: "Nettoyage professionnel de l'habitacle.", price: "Sur devis", active: true, order: 4, image: "images/service-vehicule.jpg" },
    { id: 5, icon: "building", title: "Bureaux", desc: "Nettoyage des espaces professionnels.", price: "Sur devis", active: true, order: 5, image: "images/service-bureau.jpg" },
    { id: 6, icon: "hammer", title: "Après chantier", desc: "Remise en état après travaux.", price: "Sur devis", active: true, order: 6, image: "images/service-chantier.jpg" },
  ],
  beforeAfter: [
    { id: 1, title: "Canapé orange — Abidjan", desc: "Détachage complet et extraction des saletés incrustées.", before: "images/canape-avant.jpg", after: "images/canape-apres.jpg", active: true },
    { id: 2, title: "Fauteuils blancs — Abidjan", desc: "Lavage et élimination des taches tenaces.", before: "images/fauteuil-avant.jpg", after: "images/fauteuil-apres.jpg", active: true },
    { id: 3, title: "Canapé marron — Abidjan", desc: "Nettoyage vapeur et ravivage des couleurs.", before: "images/canape2-avant.jpg", after: "images/canape2-apres.jpg", active: true },
  ],
  steps: [
    { n: "01", title: "Envoyez votre demande", desc: "WhatsApp ou formulaire." },
    { n: "02", title: "Recevez votre devis", desc: "Nous vous communiquons le prix." },
    { n: "03", title: "Nous intervenons", desc: "Notre équipe se déplace." },
    { n: "04", title: "Profitez d'un espace propre", desc: "Résultat final." },
  ],
  pillars: [
    { icon: "users", title: "Équipe professionnelle", desc: "Des techniciens formés et ponctuels." },
    { icon: "shield", title: "Matériel adapté", desc: "Injection-extraction et produits sûrs." },
    { icon: "spark", title: "Résultats visibles", desc: "Un avant / après sans mauvaise surprise." },
    { icon: "home", title: "Intervention à domicile", desc: "Nous venons chez vous, à votre horaire." },
    { icon: "pin", title: "Service local à Abidjan", desc: "Une équipe proche de vous." },
  ],
  whyUsImage: "images/equipe.jpg",
    stats: {
    title: "Nos chiffres",
    subtitle: "Des résultats concrets, une équipe qui grandit avec vous.",
    items: [] as { id: number; icon: string; value: number; suffix: string; label: string; active: boolean; order: number }[],
  },
      legal: {
    company: {
      name: "Eco Clean Expert",
      legalForm: "Entreprise individuelle",
      capital: "—",
      address: "Abidjan, Côte d'Ivoire",
      rccm: "CI-ABJ-20XX-B-XXXXX",
      cc: "XXXXXXX X",
      phone: "+225 01 42 08 97 76",
      email: "contact@ecocleanexpert.ci",
      director: "À compléter",
      hosting: "À compléter (nom et adresse de l'hébergeur)",
      lastUpdate: "Janvier 2025",
    },
    mentions: {
      title: "Mentions légales",
      intro: "Conformément aux dispositions légales en vigueur en Côte d'Ivoire, voici les informations relatives à l'éditeur et à l'exploitant du présent site internet.",
      sections: [
                {
          id: 1,
          title: "1. Éditeur du site",
          body: "Le présent site est édité par Eco Clean Expert, marque commerciale exploitée par JULMARKETING Corporation Sarl U, société multisectorielle spécialisée dans le nettoyage professionnel à domicile et auprès des professionnels.\n\nAdresse : Abidjan, Côte d'Ivoire\nTéléphone : +225 01 42 08 97 76\nEmail : contact@ecocleanexpert.ci",
        },
        {
          id: 1.5,
          title: "1 bis. Structure juridique",
          body: "Eco Clean Expert est une marque du groupe JULMARKETING Corporation Sarl U. Les factures, reçus et documents officiels émis dans le cadre des prestations de nettoyage portent la dénomination JULMARKETING Corporation Sarl U, entité juridique responsable de l'exploitation commerciale.\n\nCette structure de groupe permet à Eco Clean Expert de s'appuyer sur la solidité financière et administrative d'une entreprise multisectorielle établie à Abidjan.",
        },
        {
          id: 2,
          title: "2. Immatriculation",
          body: "Numéro RCCM : CI-ABJ-20XX-B-XXXXX\nNuméro CC (Compte Contribuable) : XXXXXXX X\n\nCes informations sont délivrées par les autorités compétentes de Côte d'Ivoire.",
        },
        {
          id: 3,
          title: "3. Directeur de la publication",
          body: "Le directeur de la publication est le représentant légal de l'entreprise Eco Clean Expert.",
        },
        {
          id: 4,
          title: "4. Hébergement",
          body: "Le site est hébergé par un prestataire situé en Côte d'Ivoire ou à l'international. Les coordonnées complètes de l'hébergeur peuvent être obtenues sur simple demande à contact@ecocleanexpert.ci.",
        },
        {
          id: 5,
          title: "5. Propriété intellectuelle",
          body: "L'ensemble des éléments figurant sur ce site (textes, photographies, logos, illustrations, structure, code) sont la propriété exclusive d'Eco Clean Expert ou de ses partenaires, protégés par les lois relatives à la propriété intellectuelle.\n\nToute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est strictement interdite.",
        },
        {
          id: 6,
          title: "6. Responsabilité",
          body: "Eco Clean Expert s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exhaustivité ni l'absence d'erreur. Les informations sont fournies à titre indicatif et sont susceptibles d'évoluer sans préavis.\n\nLes tarifs affichés sont indicatifs. Un devis personnalisé est établi après examen de la demande.",
        },
        {
          id: 7,
          title: "7. Liens externes",
          body: "Le site peut contenir des liens vers des sites tiers. Eco Clean Expert n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
        },
        {
          id: 8,
          title: "8. Droit applicable",
          body: "Les présentes mentions légales sont régies par le droit ivoirien. Tout litige relatif à l'utilisation de ce site relève de la compétence des tribunaux d'Abidjan.",
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      intro: "Eco Clean Expert accorde une importance particulière à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, comment nous les utilisons et quels sont vos droits.",
      sections: [
        {
          id: 1,
          title: "1. Données collectées",
          body: "Lorsque vous remplissez notre formulaire de devis ou nous contactez via WhatsApp ou par téléphone, nous pouvons collecter les informations suivantes :\n\n• Nom et prénom\n• Numéro de téléphone\n• Adresse email (facultatif)\n• Commune d'intervention\n• Service souhaité\n• Message descriptif de votre besoin\n\nNous ne collectons aucune donnée sensible (santé, religion, opinions politiques, etc.).",
        },
        {
          id: 2,
          title: "2. Finalités du traitement",
          body: "Vos données sont utilisées uniquement pour :\n\n• Répondre à votre demande de devis\n• Organiser l'intervention à votre domicile ou dans vos locaux\n• Vous recontacter si nécessaire\n• Améliorer la qualité de nos services\n\nVos données ne sont jamais vendues, louées ou cédées à des tiers.",
        },
        {
          id: 3,
          title: "3. Durée de conservation",
          body: "Vos données sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées pour une durée maximale de 3 ans, sauf obligation légale contraire ou demande explicite de suppression de votre part.",
        },
        {
          id: 4,
          title: "4. Vos droits",
          body: "Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :\n\n• Droit d'accès : obtenir une copie de vos données\n• Droit de rectification : corriger vos données inexactes\n• Droit à l'effacement : demander la suppression de vos données\n• Droit d'opposition : refuser certains traitements\n• Droit à la portabilité : recevoir vos données dans un format lisible\n\nPour exercer ces droits, écrivez-nous à contact@ecocleanexpert.ci. Nous répondrons dans un délai maximum de 30 jours.",
        },
        {
          id: 5,
          title: "5. Sécurité des données",
          body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation. Toutefois, aucun système n'étant infaillible, nous vous invitons à nous signaler toute anomalie suspectée.",
        },
        {
          id: 6,
          title: "6. Cookies",
          body: "Notre site n'utilise pas de cookies publicitaires ni de traceurs tiers à des fins commerciales. Seuls des cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être utilisés (préférences d'affichage, session administrateur).",
        },
        {
          id: 7,
          title: "7. Partage avec des tiers",
          body: "Vos données peuvent être transmises à nos techniciens dans le seul but de réaliser l'intervention demandée. Aucun autre partage n'est effectué, sauf obligation légale (réquisition judiciaire, etc.).",
        },
        {
          id: 8,
          title: "8. Modification de la politique",
          body: "Cette politique de confidentialité peut être mise à jour à tout moment pour refléter l'évolution de nos pratiques ou de la législation. La date de dernière mise à jour est indiquée en haut de cette page.",
        },
      ],
    },
  },
  contactForm: {
    title: "Demandez votre devis gratuit",
    subtitle: "Remplissez le formulaire, nous vous répondons en moins d'une heure sur WhatsApp.",
    successTitle: "Demande envoyée !",
    successText: "Nous vous répondons en moins d'une heure sur WhatsApp. Vous pouvez aussi nous joindre directement.",
    submitLabel: "Envoyer ma demande",
    orText: "ou contactez-nous directement",
    communes: [
      "Cocody", "Plateau", "Marcory", "Treichville", "Yopougon", "Adjamé",
      "Riviera", "Attécoubé", "Koumassi", "Port-Bouët", "Abobo", "Bingerville", "Autre"
    ],
  },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir avant de nous confier votre nettoyage.",
    ctaTitle: "Vous avez une autre question ?",
    ctaText: "Écrivez-nous sur WhatsApp, nous répondons en moins d'une heure.",
    ctaButton: "Poser ma question",
    items: [
      { id: 1, q: "Combien de temps dure une intervention ?", a: "En moyenne 1h à 2h pour un canapé 3 places, 30 min pour un fauteuil, et 2h à 4h pour un tapis ou une moquette. La durée exacte dépend de la surface et de l'état du tissu.", active: true, order: 1 },
      { id: 2, q: "Combien de temps avant que le canapé soit sec ?", a: "Comptez 3 à 6 heures de séchage selon le type de tissu et l'aération de la pièce. Nous utilisons une extraction puissante qui retire 90% de l'humidité immédiatement après le nettoyage.", active: true, order: 2 },
      { id: 3, q: "Vous déplacez-vous dans ma commune ?", a: "Nous intervenons partout à Abidjan — Cocody, Plateau, Marcory, Treichville, Yopougon, Adjamé, Riviera et toutes les autres communes. Contactez-nous pour vérifier la disponibilité.", active: true, order: 3 },
      { id: 4, q: "Quels produits utilisez-vous ?", a: "Nous utilisons des produits professionnels, respectueux des tissus et sûrs pour votre famille et vos animaux. Nous adaptons les produits selon le type de salissure (taches, odeurs, acariens).", active: true, order: 4 },
      { id: 5, q: "Est-ce que les taches partent toutes ?", a: "La grande majorité des taches part avec notre méthode injection-extraction. Certaines taches anciennes (encre, teinture, brûlures) peuvent laisser une trace résiduelle. Nous vous prévenons honnêtement avant l'intervention.", active: true, order: 5 },
      { id: 6, q: "Comment se passe le paiement ?", a: "Le paiement se fait à la fin de l'intervention, une fois que vous avez constaté le résultat. Nous acceptons les espèces et le Mobile Money (Orange, MTN, Wave).", active: true, order: 6 },
      { id: 7, q: "Faut-il préparer quelque chose avant votre arrivée ?", a: "Non, rien de spécial. Nous apportons tout notre matériel (aspirateur, produits, protections). Nous vous conseillons simplement de dégager un peu d'espace autour de la pièce à nettoyer.", active: true, order: 7 },
      { id: 8, q: "Puis-je voir le résultat avant de payer ?", a: "Absolument. Nous vous montrons le résultat à la fin de l'intervention avant tout paiement. Si vous n'êtes pas satisfait, nous revenons gratuitement dans les 48h.", active: true, order: 8 },
    ],
  },
  testimonials: [] as { id: number; name: string; role: string; text: string; rating: number; photo: string; active: boolean; order: number }[],
  zones: [
    { id: 1, name: "Cocody", active: true }, { id: 2, name: "Plateau", active: true },
    { id: 3, name: "Marcory", active: true }, { id: 4, name: "Treichville", active: true },
    { id: 5, name: "Yopougon", active: true }, { id: 6, name: "Adjamé", active: true },
    { id: 7, name: "Riviera", active: true }, { id: 8, name: "Attécoubé", active: true },
  ],
  cta: { title: "Votre espace mérite un nettoyage professionnel.", subtitle: "À partir de 15 000 F CFA", button: "Demander un devis sur WhatsApp", image: "images/cta-vapeur.jpg" },
  contact: { phone: "+225 01 42 08 97 76", whatsapp: "+225 01 42 08 97 76", city: "Abidjan, Côte d'Ivoire", hours: "7j/7 — 8h à 20h" },
  social: {
    facebook: "https://www.facebook.com/eco.clean.expert1",
    instagram: "https://www.instagram.com/eco.clean.expert/",
    tiktok: "https://www.tiktok.com/@eco.clean.expert",
  },
  parentCompany: {
    name: "JULMARKETING Corporation",
    legalForm: "Sarl U",
    tagline: "Entreprise multisectorielle",
    shortIntro: "Eco Clean Expert est une marque du groupe JULMARKETING Corporation, société multisectorielle basée à Abidjan.",
    logo: "images/julmarketing-logo.jpeg",
    branches: [
      "Nettoyage professionnel",
      "Commerce général",
      "Services aux entreprises",
    ],
    showInFooter: true,
    showInAbout: true,
  },
};

/* ============================================================
   LOGO
============================================================ */

export type SiteContent = typeof DEFAULT_CONTENT;
