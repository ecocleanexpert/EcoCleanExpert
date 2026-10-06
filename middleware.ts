import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, updateSession } from "@/lib/supabase/middleware";

const CANONICAL_HOST = "ecocleanexpert.site";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.endsWith(".vercel.app")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }
  if (!request.nextUrl.pathname.startsWith("/kdlebron13")) return NextResponse.next();
  if (!isSupabaseConfigured) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico|googleca1ea2f4866fef9d.html|sitemap.xml|robots.txt).*)"],
};
