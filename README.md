# Webseite und Blog

Die Seite wird mit Jekyll gebaut. Lokal verwendet Docker Compose das gleiche `github-pages`-Gem wie GitHub Pages.

## Vorschau starten

```sh
make start
```

Dockerfile, Gemfile, Lockdatei und `docker-compose.yaml` liegen unter `jekyll/`. `make start` wechselt dorthin und führt `docker compose up -d` aus. Danach ist die Seite unter <http://localhost:4000> erreichbar. Änderungen an Seiten und Beiträgen werden automatisch neu gebaut. Stoppen mit `docker compose -f jekyll/docker-compose.yaml down`; nach Änderungen am Dockerfile oder den Gems mit `docker compose -f jekyll/docker-compose.yaml up -d --build` neu bauen. Nach Änderungen an `_config.yml` mit `docker compose -f jekyll/docker-compose.yaml restart jekyll` neu starten.

Den lokalen Port in `jekyll/docker-compose.yaml` unter `ports` ändern: `127.0.0.1:8080:4000` stellt die Vorschau beispielsweise auf Port 8080 bereit. Der rechte Port bleibt der interne Jekyll-Port, der über `command` in derselben Datei gesetzt wird. `EXPOSE` ist dafür nicht nötig und veröffentlicht selbst keinen Port. Nach Portänderungen erneut `make start` ausführen.

## Inhalte schreiben

Neue Beiträge liegen als Jekyll-Collection in einem eigenen Ordner, beispielsweise `_articles/1.mein-erster-beitrag/index.md`. Mit `make new TITLE="Mein erster Beitrag"` wird automatisch der nächste nummerierte Ordner aus `jekyll/article-template.md` angelegt. `make help` zeigt alle verfügbaren Befehle. Die Nummer dient nur der Organisation; die öffentliche URL wird im Front Matter als `/blog/mein-erster-beitrag/` festgelegt.

Bilder direkt neben der `index.md` oder in Unterordnern ablegen und beispielsweise mit `![Beschreibung](bild.png)` einbinden. Für ein Titelbild im Front Matter `image: bild.png` ergänzen. Jekyll übernimmt die Dateien des Collection-Ordners in die Website.

Das Veröffentlichungsdatum steht ausschließlich im Front Matter, nicht im Dateinamen. Beim Veröffentlichen `date` setzen und `published` auf `true` ändern. Ein zukünftiges Datum hält den Beitrag bis dahin zurück. Entwürfe benötigen noch kein Datum:

```markdown
---
title: Mein erster Beitrag
published: false
date: 2026-10-24
---

Hier beginnt der Beitrag.
```

Beiträge erhalten automatisch das Beitragslayout. Alle Seiten liegen als Markdown-Dateien unter `_pages/`, zum Beispiel `_pages/index.md`, `_pages/cv.md`, `_pages/projects.md` und `_pages/contact.md`. Projektunterseiten liegen unter `_pages/projects/`. Der Ordner wird über `include` in `_config.yml` eingebunden; jede Seite legt ihre öffentliche URL mit `permalink` im Front Matter fest, zum Beispiel `permalink: /cv/`. Titel, Kurztext und weitere kurze Angaben stehen ebenfalls im Front Matter. Die HTML-Struktur liegt in `_layouts/`; die Blogübersicht wird dort aus den Beiträgen erzeugt. Farben und Maße liegen als SCSS-Variablen am Anfang von `assets/css/site.scss`; Jekyll erzeugt daraus `assets/css/site.css`.

Noto Sans, Noto Sans Mono und die Navigationsicons liegen lokal unter `assets/fonts/`. Die Seite lädt keine Schriftdateien von externen Diensten. Die zugehörigen Lizenzen liegen im selben Verzeichnis.

Für ein eigenes Foto die Datei beispielsweise als `assets/images/profile.jpg` ablegen und in `_config.yml` `profile_image: "/assets/images/profile.jpg"` setzen. GitHub, LinkedIn und YouTube werden unter `social` in `_config.yml` eingetragen; `contact_email` ist optional. Nach Änderungen an `_config.yml` Docker Compose neu starten.

Die Bilder in `assets/images/blog/` stammen aus der Layout-Demo.

## Tags und Feeds

Tags im Front Matter eines Beitrags als Liste ergänzen, zum Beispiel `tags: [php, jekyll]`. Tag-Namen dürfen für die automatische Feed-Erzeugung ausschließlich die Zeichen `a-z`, `A-Z`, `0-9` und `_` enthalten. Kleingeschriebene Namen verwenden, keine Leerzeichen, Bindestriche oder Umlaute. Für jeden neuen Tag eine eigene Markdown-Datei unter `_pages/tags/` anlegen, beispielsweise `_pages/tags/php.md`, mit `layout: tag`, `title: php`, `tag: php` und `permalink: /blog/tags/php/` im Front Matter. Das gemeinsame Layout erzeugt ausschließlich die Beiträge dieses Tags; der Test prüft, dass jeder verwendete Tag eine Seite besitzt.

Die Blogübersicht und Beiträge verlinken auf die Themenübersicht unter `/blog/tags/`. Dort stehen pro Tag die zugehörigen Beiträge und ein eigener Feed. `/feed.xml` enthält die neuesten Beiträge insgesamt, `/feed/by_tag/php.xml` beispielsweise nur Beiträge mit dem Tag `php`. Die Feed-Layouts erzeugen bis zu zehn Beiträge im Atom-Format, das übliche RSS-Reader unterstützen. Der allgemeine Feed wird über einen Link im HTML-Head automatisch erkannt.

Die laufende Vorschau einschließlich Feedlinks und Tagfilterung testen:

```sh
BLOG_PREVIEW_URL=http://localhost:4000 node --test .github/scripts/blog-feeds.test.cjs
```

## Kommentare und Veröffentlichung

Ein Beitrag verknüpft über `comments_key` seine Daten in `_data/comments/<comments_key>.json`. `discussion_number` ordnet die zugehörige GitHub Discussion zu. Für neue Beiträge zunächst `published: false` im Front Matter setzen. Zum Veröffentlichen auf `published: true` ändern und auf `master` pushen. Der separate Workflow **Publish new blog entry** liest dieses Feld per Bash aus und erstellt bei fehlender Zuordnung eine Discussion in der vorhandenen Kategorie **Blog**, einschließlich Titel und Markdown-Inhalt. Er ergänzt `comments_key` und die JSON-Zuordnung automatisch und committet sie. Bereits vorhandene Zuordnungen bleiben erhalten; eine stabile Blog-ID in der Discussion verhindert Duplikate bei wiederholten Läufen. Ohne explizites `published: true` wird keine Discussion automatisch erstellt. Der Workflow läuft auch manuell und täglich; zukünftige Veröffentlichungsdaten werden berücksichtigt. Ordnerbeiträge benötigen für die Veröffentlichung ein explizites `date`.

`.github/workflows/publish.yml` synchronisiert bei neuen, bearbeiteten und gelöschten Kommentaren oder Antworten nur die betroffene Discussion. `.github/scripts/sync-comments.cjs` lädt dafür alle Seiten ihrer Kommentare und Antworten, damit auch Änderungen und Löschungen übernommen werden. Nach Pushes auf `master` läuft zuerst **Publish new blog entry**; anschließend gleicht `publish.yml` alle Zuordnungen ab. Änderungen an Synchronisierungsskripten oder Workflow, fehlende Git-Historie und der erste Push lösen einen Vollabgleich aus. Einmal täglich um 03:17 UTC als Absicherung und manuell über `workflow_dispatch` werden ebenfalls alle zugeordneten Discussions vollständig abgeglichen. Ein Commit-Zeitpunkt dient nicht als Kommentar-Zeitmarke, damit zwischenzeitliche Änderungen oder Löschungen nicht verloren gehen. Nur tatsächliche Datenänderungen werden committet. Die Schritte heißen kurz `checkout`, `fetch comments`, `commit`, `configure`, `build`, `upload` und `deploy`. Die Veröffentlichung erfolgt im selben Workflow, weil Commits mit `GITHUB_TOKEN` keine weiteren Push-Workflows auslösen.

Nach erfolgreichem Abschluss von **Publish new blog entry** startet `publish.yml` über `workflow_run` und baut den aktuellen Stand von `master` einschließlich der neuen Discussion-Links. Beide Workflows teilen dieselbe Concurrency-Gruppe. Der neue Workflow benötigt `discussions: write` und `contents: write`, verwendet aber ebenfalls nur `GITHUB_TOKEN`. Ruby wird zur Discussion-Erstellung nicht benötigt.

GitHub Pages muss in den Repository-Einstellungen als Quelle **GitHub Actions** verwenden. Der Workflow verwendet ausschließlich das automatisch bereitgestellte `GITHUB_TOKEN` mit `discussions: read`, `contents: write`, `pages: write` und `id-token: write`. Zusätzliche Secrets sind nicht erforderlich. Branch-Schutzregeln müssen automatische Kommentar-Commits auf `master` zulassen.

`_layouts/post.html` und `_includes/comment.html` zeigen Kommentare und Antworten als HTML-escaped Klartext mit Profilbildern an. Die Synchronisierung übernimmt nur die öffentliche GitHub-Avatar-URL; der Browser lädt das Profilbild direkt von GitHub. Bilddateien werden weder gespeichert noch committet. Initialen dienen als Fallback für Accounts ohne Profilbild. Der Zähler umfasst Kommentare und Antworten. GitHub-Anmeldung ist nur zum Schreiben auf GitHub erforderlich; die Blogseite lädt keine GitHub-Skripte. Der Discussion-Link öffnet einen neuen Tab.

Synchronisierung testen:

```sh
node --test .github/scripts/*.test.cjs
```

Der Actions-Build verwendet wie die Vorschau `bundle exec jekyll build` mit `jekyll/Gemfile`.

Für den vollständigen Live-Test in der Discussion eines veröffentlichten Beitrags einen Kommentar und eine Antwort verfassen, den Workflow unter Actions abwarten und den Beitrag neu laden. Danach Bearbeiten und Löschen ebenfalls prüfen. Die erste Veröffentlichung startet nach dem Push automatisch.
