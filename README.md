# Webseite und Blog

Die Seite wird mit Jekyll gebaut. Lokal verwendet Docker Compose das gleiche `github-pages`-Gem wie GitHub Pages.

## Vorschau starten

```sh
docker compose up --build
```

Danach ist die Seite unter <http://localhost:4000> erreichbar. Änderungen an Seiten und Beiträgen werden automatisch neu gebaut. Mit `Ctrl+C` stoppen; bei Bedarf mit `docker compose down` aufräumen.

## Inhalte schreiben

Neue Blogbeiträge kommen als Markdown-Dateien nach `_posts/`, zum Beispiel `_posts/2026-10-14-mein-erster-beitrag.md`:

```markdown
---
title: Mein erster Beitrag
---

Hier beginnt der Beitrag.
```

Beiträge erhalten automatisch das Beitragslayout. Alle Seiten liegen als Markdown-Dateien unter `_pages/`, zum Beispiel `_pages/index.md`, `_pages/cv.md`, `_pages/projects.md` und `_pages/contact.md`. Projektunterseiten liegen unter `_pages/projects/`. Der Ordner wird über `include` in `_config.yml` eingebunden; jede Seite legt ihre öffentliche URL mit `permalink` im Front Matter fest, zum Beispiel `permalink: /cv/`. Titel, Kurztext und weitere kurze Angaben stehen ebenfalls im Front Matter. Die HTML-Struktur liegt in `_layouts/`; die Blogübersicht wird dort aus den Beiträgen erzeugt. Farben und Maße liegen als SCSS-Variablen am Anfang von `assets/css/site.scss`; Jekyll erzeugt daraus `assets/css/site.css`.

Noto Sans, Noto Sans Mono und die Navigationsicons liegen lokal unter `assets/fonts/`. Die Seite lädt keine Schriftdateien von externen Diensten. Die zugehörigen Lizenzen liegen im selben Verzeichnis.

Für ein eigenes Foto die Datei beispielsweise als `assets/images/profile.jpg` ablegen und in `_config.yml` `profile_image: "/assets/images/profile.jpg"` setzen. GitHub, LinkedIn und YouTube werden unter `social` in `_config.yml` eingetragen; `contact_email` ist optional. Nach Änderungen an `_config.yml` Docker Compose neu starten.

Aktuell enthält `_posts/` ausschließlich den Testbeitrag für Kommentare und Antworten. Die ungenutzten Bilder in `assets/images/blog/` stammen aus der Layout-Demo.

## Kommentare und Veröffentlichung

Der Testbeitrag unter <http://localhost:4000/blog/2026/10/18/testbeitrag/> verknüpft über `comments_key: testbeitrag` die Daten in `_data/comments/testbeitrag.json`. `discussion_number: 1` ordnet die vorhandene GitHub Discussion zu. Es wird keine zusätzliche Discussion erzeugt. Für weitere Beiträge eine Discussion anlegen und eine eigene JSON-Datei mit deren Nummer, URL und `comments: []` hinterlegen.

`.github/workflows/publish.yml` synchronisiert bei neuen, bearbeiteten und gelöschten Kommentaren oder Antworten nur die betroffene Discussion. `.github/scripts/sync-comments.cjs` lädt dafür alle Seiten ihrer Kommentare und Antworten, damit auch Änderungen und Löschungen übernommen werden. Pushes auf `master` gleichen nur geänderte Zuordnungsdateien in `_data/comments/` anhand der Git-Differenz des Pushes ab. Änderungen an Synchronisierungsskripten oder Workflow, fehlende Git-Historie und der erste Push lösen einen Vollabgleich aus. Einmal täglich um 03:17 UTC als Absicherung und manuell über `workflow_dispatch` werden ebenfalls alle zugeordneten Discussions vollständig abgeglichen. Ein Commit-Zeitpunkt dient nicht als Kommentar-Zeitmarke, damit zwischenzeitliche Änderungen oder Löschungen nicht verloren gehen. Nur tatsächliche Datenänderungen werden committet. Die Schritte heißen kurz `checkout`, `fetch comments`, `commit`, `configure`, `build`, `upload` und `deploy`. Die Veröffentlichung erfolgt im selben Workflow, weil Commits mit `GITHUB_TOKEN` keine weiteren Push-Workflows auslösen.

GitHub Pages muss in den Repository-Einstellungen als Quelle **GitHub Actions** verwenden. Der Workflow verwendet ausschließlich das automatisch bereitgestellte `GITHUB_TOKEN` mit `discussions: read`, `contents: write`, `pages: write` und `id-token: write`. Zusätzliche Secrets sind nicht erforderlich. Branch-Schutzregeln müssen automatische Kommentar-Commits auf `master` zulassen.

`_layouts/post.html` und `_includes/comment.html` zeigen Kommentare und Antworten als HTML-escaped Klartext mit Profilbildern an. Die Synchronisierung übernimmt nur die öffentliche GitHub-Avatar-URL; der Browser lädt das Profilbild direkt von GitHub. Bilddateien werden weder gespeichert noch committet. Initialen dienen als Fallback für Accounts ohne Profilbild. Der Zähler umfasst Kommentare und Antworten. GitHub-Anmeldung ist nur zum Schreiben auf GitHub erforderlich; die Blogseite lädt keine GitHub-Skripte. Der Discussion-Link öffnet einen neuen Tab.

Synchronisierung testen:

```sh
node --test .github/scripts/sync-comments.test.cjs
```

Für den vollständigen Live-Test in Discussion #1 einen Kommentar und eine Antwort verfassen, den Workflow unter Actions abwarten und den Testbeitrag neu laden. Danach Bearbeiten und Löschen ebenfalls prüfen. Die erste Veröffentlichung startet nach dem Push automatisch.
