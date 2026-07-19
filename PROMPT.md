# Claude-Code-Prompt

Diesen kompletten Text (ab der Trennlinie) in Claude Code einfuegen, im geklonten Repo. Ergaenze am Ende deine Angaben unter "MEINE ANGABEN".

---

Ich baue eine interne Team-Website hinter einem Google-Login, nach exakt dem Muster der ADMKRS Creative-Suite-Website (suite.admkrs.com). Dieses Repo ist das fertige Template dafuer. Lies zuerst README.md (Architektur + Setup) und verschaffe dir einen Ueberblick ueber src/ und public/.

## Was schon fertig ist (NICHT neu bauen, nur verstehen)

Das komplette Auth-Gate: Next.js 16, Supabase-Auth mit Google-OAuth, `src/proxy.ts` gated jede Route inklusive der statischen HTMLs in public/, serverseitiger Domain-Check via `isAllowedEmail()` (Default admkrs.com). Die vier Seiten in public/ sind Beispiel-Inhalte der Creative Suite und werden durch meine Inhalte ersetzt.

## Deine Aufgabe

1. **Intake:** Stelle mir zuerst Rueckfragen, bis du meine Inhalte wirklich verstanden hast: Welches Skillset/Thema, welche Zielgruppe im Team, welche Seiten es braucht, woher die Inhalte kommen (Dateien, Skills-Repo, Notizen). Lieber mehr Fragen als zu wenige. Fang erst danach an zu bauen.
2. **Seiten bauen:** Ersetze die Beispiel-Seiten in public/ durch meine Inhalte. Uebernimm die Struktur-Muster der Vorlage:
   - Selbst-enthaltene statische HTMLs, kein Build-Step, keine externen CDNs/Fonts, `noindex` im Head.
   - Gemeinsame Top-Navigation auf allen Seiten, identisch und ueberall gepflegt (eine fehlende Nav auf einer Unterseite war bei uns ein echter Bug).
   - Design-System der Suite, falls ich nichts anderes sage: dunkles Theme (Hintergrund #09090A), Neon-Gruen als Akzent (#C6FF3A), grosszuegige Typo-Hierarchie, dezente Karten statt Bullet-Wuesten. Wenn ich ein eigenes Branding will, frag nach Farben/Logo und zieh es konsequent durch.
   - Seiten-Typen der Vorlage als Baukasten: `index.html` (Guide/Einstieg mit Katalog-Karten), `prozess.html` (rollenbasiertes Tutorial mit durchgehendem Beispiel-Fall und kopierbaren Start-Prompts), `flow.html` (interaktive Prozessmap), `styles.html` (grosser aufklappbarer Katalog). Baue nur die Typen, die fuer mein Thema Sinn ergeben.
   - **Herzstueck ist die interaktive Prozessmap (`flow.html`), das ist der wichtigste Teil.** Ein zoom- und schiebbarer Vollbild-Canvas, der den gesamten Prozess auf einen Blick zeigt: Stationen als eine Linie von links nach rechts in Phasen-Zonen, ein Loop, der am Ende zurueck zum Anfang dreht, Klick auf eine Station zoomt heran und oeffnet ein Detail-Panel (Inhalte blenden gestaffelt von rechts ein) mit aufklappbaren Karten pro Werkzeug/Skill. Frage im Intake explizit nach meinen Prozess-Stationen, Phasen und Rollen und uebertrage dieses Muster vollstaendig auf meinen Prozess, statt nur Texte auszutauschen.
3. **Projekt umbenennen:** `name` in package.json, Titel/Meta in den Seiten und in `src/app/auth/login/page.tsx` (Login-Karte zeigt den Site-Namen).
4. **Setup begleiten:** Fuehre mich durch die Schritte aus README.md Abschnitt "Setup" (env, npm install, Vercel-Projekt, Deploy). Erledige alles, was du per CLI selbst kannst; sag mir klar, welche Dashboard-Schritte ich selbst machen muss. WICHTIGSTER STOLPERSTEIN: die neuen Redirect-URLs muessen im geteilten Supabase-Projekt eingetragen werden, SONST leitet der Login nach einer fremden App. Bestehende Eintraege und die Site-URL nie anfassen.
5. **Verifizieren, nicht behaupten:** Nach dem Deploy per curl pruefen, dass jede Route ohne Session auf /auth/login umleitet (Status 307). Den eigentlichen Google-Login teste ich selbst im Browser, den darfst du nicht ausfuehren.

## Harte Regeln

- Niemals das Zeichen "Em-Dash" (der lange Gedankenstrich) verwenden, nirgendwo. ADMKRS-Hausregel.
- Keine echten Kundennamen oder Kundendaten in Repo oder Seiten, nur fiktive Beispiele (Hausmarke: NOVA).
- Keine Secrets committen (.env.local bleibt lokal, Werte kommen von Burak).
- Antworte auf Deutsch, kurz und direkt.

## MEINE ANGABEN

- Thema/Skillset: [ausfuellen]
- Seiten, die ich brauche: [ausfuellen oder "schlag vor"]
- Inhalts-Quellen: [Dateien/Pfade/Repo]
- Branding: [Suite-Look uebernehmen oder eigenes: Farben/Logo]
- Vercel-Projektname + gewuenschte Domain: [ausfuellen]
