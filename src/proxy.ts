import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/auth-domain";

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * Auth-Gate fuer die GESAMTE Suite-Website (identisches Muster wie der
 * admkrs-Hub): Ohne gueltige Supabase-Session (Google-Login, nur erlaubte
 * Domain) geht es fuer jede Route, auch die statischen HTMLs aus public/,
 * nach /auth/login. Ausgenommen sind nur /auth/* sowie Assets (Matcher).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              maxAge: 60 * 60 * 24 * 7,
              sameSite: "lax" as const,
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");

  // Eine Session zaehlt nur, wenn die E-Mail zur erlaubten Domain gehoert.
  const isAllowed = !!user && isAllowedEmail(user.email);

  const redirectWithCookies = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  };

  if (!isAllowed && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search =
      pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return redirectWithCookies(url);
  }

  if (isAllowed && pathname === "/auth/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return redirectWithCookies(url);
  }

  return response;
}

export const config = {
  // Alles schuetzen, auch die statischen Suite-Seiten. Ausgenommen:
  // Next-Interna, Favicon sowie Bild- und Font-Assets.
  matcher: [
    "/((?!_next/|icon\\.svg|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot)$).*)",
  ],
};
