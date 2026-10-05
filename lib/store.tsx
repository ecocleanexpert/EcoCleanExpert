"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MEDIA_KEY, REQUESTS_KEY, STORAGE_KEY } from "./constants";
import { DEFAULT_CONTENT, type SiteContent } from "./defaultContent";
import { isSupabaseConfigured } from "./supabase/client";
import { fetchSiteData, persistContent, syncMedia, syncRequests } from "./supabase/sync";
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

function mergeContent(parsed: Partial<SiteContent>): SiteContent {
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

function loadLocalContent(): SiteContent {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return mergeContent(JSON.parse(saved));
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

  const knownMediaIds = useRef<Set<number>>(new Set());
  const knownRequestIds = useRef<Set<number>>(new Set());
  const mediaSyncing = useRef(false);
  const requestsSyncing = useRef(false);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chargement initial : Supabase si configuré, sinon localStorage (prototype)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isSupabaseConfigured) {
        const data = await fetchSiteData();
        if (!cancelled && data) {
          if (data.content) setContent(mergeContent(data.content));
          setMedia(data.media);
          setRequests(data.requests);
          knownMediaIds.current = new Set(data.media.map((m) => m.id));
          knownRequestIds.current = new Set(data.requests.map((r) => r.id));
        }
      } else {
        setContent(loadLocalContent());
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
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persistance du contenu (debounce côté Supabase)
  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseConfigured) {
      if (contentTimer.current) clearTimeout(contentTimer.current);
      contentTimer.current = setTimeout(() => {
        persistContent(content);
      }, 800);
      return () => {
        if (contentTimer.current) clearTimeout(contentTimer.current);
      };
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error("localStorage plein :", e);
      setSaveWarning(true);
    }
  }, [content, hydrated]);

  // Persistance de la médiathèque
  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseConfigured) {
      if (mediaSyncing.current) return;
      mediaSyncing.current = true;
      const snapshot = media;
      syncMedia(snapshot, knownMediaIds.current)
        .then((rewritten) => {
          knownMediaIds.current = new Set(snapshot.map((m) => m.id));
          // Réécrit les dataURL uploadées par les URL publiques du bucket
          const byId = new Map(rewritten.map((m) => [m.id, m]));
          setMedia((cur) => cur.map((m) => byId.get(m.id) || m));
        })
        .catch((e) => console.error("syncMedia:", e))
        .finally(() => {
          mediaSyncing.current = false;
        });
      return;
    }
    try {
      localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
    } catch (e) {
      console.error("localStorage plein (média) :", e);
      setSaveWarning(true);
    }
  }, [media, hydrated]);

  // Persistance des demandes
  useEffect(() => {
    if (!hydrated) return;
    if (isSupabaseConfigured) {
      if (requestsSyncing.current) return;
      requestsSyncing.current = true;
      const snapshot = requests;
      syncRequests(snapshot, knownRequestIds.current)
        .then(() => {
          knownRequestIds.current = new Set(snapshot.map((r) => r.id));
        })
        .catch((e) => console.error("syncRequests:", e))
        .finally(() => {
          requestsSyncing.current = false;
        });
      return;
    }
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
