import { DEFAULT_CONTENT, type SiteContent } from "./defaultContent";

/** Fusionne un document partiel (Supabase/localStorage) avec le contenu par défaut. */
export function mergeContent(parsed: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_CONTENT,
    ...parsed,
    brand: { ...DEFAULT_CONTENT.brand, ...(parsed.brand || {}) },
    hero: {
      ...DEFAULT_CONTENT.hero,
      ...(parsed.hero || {}),
      typewriter: {
        ...DEFAULT_CONTENT.hero.typewriter,
        ...(parsed.hero?.typewriter || {}),
      },
      phrases:
        parsed.hero?.phrases && parsed.hero.phrases.length >= 10
          ? parsed.hero.phrases
          : DEFAULT_CONTENT.hero.phrases,
    },
    cta: { ...DEFAULT_CONTENT.cta, ...(parsed.cta || {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
    stats: { ...DEFAULT_CONTENT.stats, ...(parsed.stats || {}) },
    social: { ...DEFAULT_CONTENT.social, ...(parsed.social || {}) },
    parentCompany: {
      ...DEFAULT_CONTENT.parentCompany,
      ...(parsed.parentCompany || {}),
    },
  };
}
