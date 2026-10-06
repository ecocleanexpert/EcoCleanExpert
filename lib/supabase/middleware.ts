import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminArea = request.nextUrl.pathname.startsWith("/kdlebron13");
  const isLoginPage = request.nextUrl.pathname === "/kdlebron13/login";
  const isResetPage = request.nextUrl.pathname === "/kdlebron13/reset";

  if (isAdminArea && !isLoginPage && !isResetPage && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/kdlebron13/login";
    return NextResponse.redirect(redirect);
  }
  if (isLoginPage && user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/kdlebron13";
    return NextResponse.redirect(redirect);
  }

  return response;
}
