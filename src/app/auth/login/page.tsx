"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  domain: "Nur admkrs-Konten haben Zugriff.",
  auth_failed: "Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
};

function LoginCard() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const errorCode = searchParams.get("error");
  const error =
    signInError ??
    (errorCode ? ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.auth_failed : null);

  async function signIn() {
    setPending(true);
    setSignInError(null);
    const supabase = createClient();
    const next = searchParams.get("next");
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        queryParams: { hd: "admkrs.com", prompt: "select_account" },
      },
    });
    if (oauthError) {
      setPending(false);
      setSignInError(ERROR_MESSAGES.auth_failed);
    }
  }

  return (
    <div className="login-card">
      <span className="logo-mark" aria-hidden="true">
        a
      </span>
      <h1 className="login-title">
        ADMKRS
        <span className="dot" aria-hidden="true">
          {" · "}
        </span>
        Suite
      </h1>
      <p className="login-sub">Melde dich mit deinem admkrs-Konto an.</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        className="login-btn"
        onClick={signIn}
        disabled={pending}
      >
        {pending ? "Einen Moment ..." : "Mit Google anmelden"}
      </button>
      <p className="login-foot">Nur @admkrs.com-Adressen.</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="login-main">
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
