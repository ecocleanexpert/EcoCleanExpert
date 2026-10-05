"use client";

import { getSupabase } from "./client";
import type { MediaItem, QuoteRequest } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export async function fetchSiteData(): Promise<{
  content: SiteContent | null;
  media: MediaItem[];
  requests: QuoteRequest[];
} | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const [{ data: contentRow }, { data: mediaRows }, { data: requestRows }] =
    await Promise.all([
      sb.from("site_content").select("doc").eq("id", 1).maybeSingle(),
      sb.from("media").select("*").order("created_at", { ascending: true }),
      sb.from("requests").select("*").order("created_at", { ascending: false }),
    ]);

  const media: MediaItem[] = (mediaRows || []).map((m) => ({
    id: m.id,
    name: m.name,
    dataUrl: sb.storage.from("media").getPublicUrl(m.path).data.publicUrl,
    size: m.size || 0,
    date: m.created_at,
  }));

  const requests: QuoteRequest[] = (requestRows || []).map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email || "",
    service: r.service || "",
    commune: r.commune || "",
    message: r.message || "",
    date: r.created_at,
    status: r.status || "Nouveau",
  }));

  return {
    content: (contentRow?.doc as SiteContent | undefined) || null,
    media,
    requests,
  };
}

async function hasAuthSession(sb: NonNullable<ReturnType<typeof getSupabase>>) {
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

export async function persistContent(doc: SiteContent) {
  const sb = getSupabase();
  if (!sb || !(await hasAuthSession(sb))) return;
  const { error } = await sb
    .from("site_content")
    .upsert({ id: 1, doc, updated_at: new Date().toISOString() });
  if (error) console.error("persistContent:", error);
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/** Upload les nouvelles images (dataUrl base64) vers le bucket "media" et
 * synchronise la table. Retourne les items éventuellement réécrits. */
export async function syncMedia(
  items: MediaItem[],
  knownIds: Set<number>
): Promise<MediaItem[]> {
  const sb = getSupabase();
  if (!sb || !(await hasAuthSession(sb))) return items;

  const result: MediaItem[] = [];
  for (const m of items) {
    if (!knownIds.has(m.id)) {
      const path = `${m.id}-${m.name.replace(/[^\w.\-]+/g, "_")}`;
      if (m.dataUrl.startsWith("data:")) {
        const blob = await dataUrlToBlob(m.dataUrl);
        const { error } = await sb.storage
          .from("media")
          .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: true });
        if (error) {
          console.error("upload media:", error);
          result.push(m);
          continue;
        }
      }
      const { error } = await sb
        .from("media")
        .insert({ id: m.id, name: m.name, path, size: m.size || 0 });
      if (error) console.error("insert media:", error);
      result.push({
        ...m,
        dataUrl: m.dataUrl.startsWith("data:")
          ? sb.storage.from("media").getPublicUrl(path).data.publicUrl
          : m.dataUrl,
      });
    } else {
      result.push(m);
    }
  }

  const currentIds = new Set(items.map((m) => m.id));
  const removed = Array.from(knownIds).filter((id) => !currentIds.has(id));
  if (removed.length > 0) {
    const { data: rows } = await sb.from("media").select("id,path").in("id", removed);
    await sb.from("media").delete().in("id", removed);
    const paths = (rows || []).map((r) => r.path).filter(Boolean);
    if (paths.length > 0) await sb.storage.from("media").remove(paths);
  }

  return result;
}

export async function syncRequests(
  items: QuoteRequest[],
  knownIds: Set<number>
): Promise<void> {
  const sb = getSupabase();
  if (!sb || !(await hasAuthSession(sb))) return;

  for (const r of items) {
    if (!knownIds.has(r.id)) {
      const { error } = await sb.from("requests").insert({
        name: r.name,
        phone: r.phone,
        email: r.email,
        service: r.service,
        commune: r.commune,
        message: r.message,
        status: r.status,
      });
      if (error) console.error("insert request:", error);
    } else {
      const { error } = await sb
        .from("requests")
        .update({ status: r.status })
        .eq("id", r.id);
      if (error) console.error("update request:", error);
    }
  }

  const currentIds = new Set(items.map((r) => r.id));
  const removed = Array.from(knownIds).filter((id) => !currentIds.has(id));
  if (removed.length > 0) {
    const { error } = await sb.from("requests").delete().in("id", removed);
    if (error) console.error("delete requests:", error);
  }
}
