import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
