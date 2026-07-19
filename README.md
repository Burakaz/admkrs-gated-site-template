# ADMKRS Gated-Site-Template

Vorlage fuer eine interne Team-Website hinter einem Google-Login (nur @admkrs.com-Adressen), exakt das Muster von **suite.admkrs.com** (ADMKRS Creative Suite) und **hub.admkrs.com**. Statische HTML-Seiten liegen in `public/`, ein Next.js-Proxy laesst niemanden ohne gueltige Session daran vorbei.

**So nutzt du das Template:** Repo klonen, dann den Prompt aus [PROMPT.md](PROMPT.md) in Claude Code einfuegen und deine Inhalte beschreiben. Claude baut die Seiten um und fuehrt dich durch Setup + Deploy. Die vier HTML-Seiten in `public/` sind die Original-Seiten der Creative Suite und dienen als lauffaehiges Beispiel; sie werden durch deine Inhalte ersetzt.

## Architektur

| Datei | Job |
|---|---|
| `public/*.html` | Deine eigentliche Website: selbst-enthaltene statische Seiten (kein Build-Step, keine externen CDNs) |
| `src/proxy.ts` | Das Gate: prueft auf JEDER Route (auch statische HTMLs) die Supabase-Session + E-Mail-Domain, sonst Redirect auf `/auth/login`. Der Matcher nimmt nur `_next/`, Favicon und Asset-Dateien aus |
| `src/app/auth/login/page.tsx` | Login-Karte, startet `signInWithOAuth` (Google, `hd`-Parameter als Vorfilter, `prompt: select_account`) |
| `src/app/auth/callback/route.ts` | OAuth-Callback: `exchangeCodeForSession`, prueft die Domain serverseitig, leitet auf sanitisiertes `next` weiter |
| `src/app/auth/signout/route.ts` | Logout |
| `src/lib/auth-domain.ts` | `isAllowedEmail()`: die EIGENTLICHE Durchsetzung der Domain-Regel (das `hd` beim Google-Picker ist nur Kosmetik) |
| `src/lib/supabase/server.ts` + `client.ts` | Supabase-Clients (SSR mit Cookies / Browser) |
| `src/lib/sanitize-next.ts` | Verhindert Open-Redirects ueber den `next`-Parameter |
| `next.config.ts` | Rewrite `/` -> `/index.html` |

## Setup (einmalig, ca. 15 Minuten)

1. **Env:** `.env.example` zu `.env.local` kopieren, Werte eintragen. Empfehlung: dasselbe Supabase-Projekt wie Hub/Suite nutzen, dann ist Google-OAuth schon fertig konfiguriert und es gibt nichts in der Google Cloud Console zu tun.
2. **Install & lokal testen:** `npm install`, dann `npm run dev`. Ohne Login muss jede Route auf `/auth/login` umleiten.
3. **Vercel:** `vercel link` (neues Projekt), unter Settings -> Environment Variables dieselben drei Variablen setzen, dann `vercel deploy --prod`.
4. **Supabase Redirect-URLs (NICHT VERGESSEN, haeufigster Fehler):** Im Supabase-Dashboard unter Authentication -> URL Configuration zwei Eintraege ergaenzen: `https://<dein-projekt>.vercel.app/**` und, falls Custom Domain, `https://<domain>/**`. Ohne diese Eintraege faellt Supabase nach dem Google-Login auf die projektweite Site-URL zurueck und du landest auf einer ANDEREN App (ist uns real passiert). Nichts Bestehendes entfernen, die Liste ist additiv und wird von Hub, Suite und weiteren Apps geteilt.
5. **Custom Domain (optional):** In Vercel dem Projekt die Domain zuweisen, bei IONOS einen A-Record auf `76.76.21.21` setzen.

## Regeln

- Kein Em-Dash-Zeichen in Texten (ADMKRS-Hausregel), keine echten Kundennamen oder Kundendaten in diesem Repo.
- Repo bleibt privat.
- `.env.local` und echte Keys niemals committen.
