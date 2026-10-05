"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MEDIA_KEY, REQUESTS_KEY, STORAGE_KEY } from "./constants";
import { DEFAULT_CONTENT, type SiteContent } from "./defaultContent";
import type { MediaItem, QuoteRequest } from "./types";

interface SiteStore {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  requests: QuoteRequest[];
  setRequests: React.Dispatch<React.SetStateAction<QuoteRequest[]>>;
  addRequest: (r: QuoteRequest) => void;
  saveWarning: boolean;
  dismissSaveWarning: () => void;
}

const SiteContext = createContext<SiteStore | null>(null);

function loadContent(): SiteContent {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
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
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CONTENT;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [saveWarning, setSaveWarning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(loadContent());
    try {
      const m = localStorage.getItem(MEDIA_KEY);
      if (m) setMedia(JSON.parse(m));
    } catch (e) {
      console.error(e);
    }
    try {
      const r = localStorage.getItem(REQUESTS_KEY);
      if (r) setRequests(JSON.parse(r));
    } catch (e) {
      console.error(e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error("localStorage plein :", e);
      setSaveWarning(true);
    }
  }, [content, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
    } catch (e) {
      console.error("localStorage plein (média) :", e);
      setSaveWarning(true);
    }
  }, [media, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error("localStorage plein (demandes) :", e);
    }
  }, [requests, hydrated]);

  const addRequest = useCallback(
    (req: QuoteRequest) => setRequests((r) => [req, ...r]),
    []
  );
  const dismissSaveWarning = useCallback(() => setSaveWarning(false), []);

  return (
    <SiteContext.Provider
      value={{
        content,
        setContent,
        media,
        setMedia,
        requests,
        setRequests,
        addRequest,
        saveWarning,
        dismissSaveWarning,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteStore {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite doit être utilisé dans un SiteProvider");
  return ctx;
}
