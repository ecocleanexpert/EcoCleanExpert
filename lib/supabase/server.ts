import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mergeContent } from "@/lib/mergeContent";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/defaultContent";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseServerConfigured = Boolean(url && (serviceKey || anonKey));

export function getServiceSupabase(): SupabaseClient | null {
  if (!isSupabaseServerConfigured) return null;
  return createClient(url!, serviceKey || anonKey!, {
    auth: { persistSession: false },
  });
}

/** Lit le document de contenu du site (site_content), repli sur le défaut. */
export async function getSiteContent(): Promise<SiteContent> {
  const sb = getServiceSupabase();
  if (!sb) return DEFAULT_CONTENT;
  const { data, error } = await sb
    .from("site_content")
    .select("doc")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data?.doc) return DEFAULT_CONTENT;
  return mergeContent(data.doc as Partial<SiteContent>);
}
