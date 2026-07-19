import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/lib/auth-domain";
import { sanitizeNext } from "@/lib/sanitize-next";

/**
 * OAuth-Callback: Code gegen Session tauschen, Domain-Gate durchsetzen,
 * zum (sanitierten) Ursprungsziel weiterleiten. Kein Profil-Upsert noetig,
 * die Suite-Doku braucht keine Datenbank.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  }

  // Domain-Gate: Wer nicht zur erlaubten Domain gehoert, fliegt sofort raus.
  if (!isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/auth/login?error=domain`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
