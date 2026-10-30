# Projektregeln

- Jekyll-Site für GitHub Pages. Seiten: `_pages/`; Beiträge: `_articles/`; Layouts: `_layouts/`; Styles: `assets/css/site.scss`.
- Seiten und Beiträge brauchen ein explizites `permalink`. Beiträge brauchen `date` und `published: true`.
- Neue Beiträge mit `make new TITLE="Titel"` anlegen. Vorlage: `jekyll/article-template.md`.

## Entwicklung

- Vorschau läuft in Docker unter `http://localhost:4000`. Erst `docker compose -f jekyll/docker-compose.yaml ps` prüfen; nur bei Bedarf mit `make start` starten.
- Änderungen werden automatisch gebaut. Nach `_config.yml`-Änderungen `docker compose -f jekyll/docker-compose.yaml restart jekyll` ausführen.
- Tests: `make test` läuft nur in der Pipeline (GitHub Actions). Bei normalen Blog-Änderungen wie neuen Beiträgen muss `make test` nicht ausgeführt werden.
- Jekyll-Befehle bei Bedarf im laufenden Container mit `docker compose -f jekyll/docker-compose.yaml exec jekyll ...` ausführen.

## Inhalte und Gestaltung

- Inhalte und Metadaten in Markdown und Front Matter pflegen; gemeinsame HTML-Struktur in Layouts.
- Vorhandene Layoutklassen, SCSS-Variablen und Komponenten wiederverwenden. Keine eigenen Seitenbreiten oder Außenabstände für Einzel-Seiten ergänzen. Änderungen responsiv umsetzen.
- Assets lokal unter `assets/` speichern; keine externen Asset- oder CDN-URLs.
- Tags klein und ohne Sonderzeichen halten. Tagseiten und Atom-Feeds erzeugt `_plugins/tag_pages.rb`; keine Quelldateien dafür anlegen.
- Mermaid-Diagramme in Beiträgen als `mermaid`-Codeblock schreiben; lokale Skripte nutzen.
