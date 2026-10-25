# Projekt: BlackScorp Webseite und Blog

Diese persönliche Webseite mit CV, Projekten, Kontaktseite und Blog wird mit Jekyll gebaut und über GitHub Pages veröffentlicht. Inhalte stehen in Markdown (Seiten unter `_pages/`, Blogbeiträge in der Collection `_articles/`), gemeinsame HTML-Strukturen in `_layouts/` und Styles in `assets/css/site.scss`. `_pages/` wird über `include` in `_config.yml` eingebunden; Seiten und Beiträge erhalten ihre öffentliche URL über ein explizites `permalink` im Front Matter. Projektunterseiten liegen unter `_pages/projects/`.

## Lokale Entwicklung

- Die Entwicklungsumgebung liegt unter `jekyll/` und läuft im Docker-Container; die Vorschau ist standardmäßig unter <http://localhost:4000> erreichbar. Vor dem Starten mit `docker compose -f jekyll/docker-compose.yaml ps` prüfen, ob der Jekyll-Dienst bereits läuft. Nur wenn er nicht läuft, mit `make start` starten. Nach Änderungen am Dockerfile oder den Gems mit `docker compose -f jekyll/docker-compose.yaml up -d --build` neu bauen. Den lokalen Port unter `ports` in der Compose-Datei ändern; der interne Port wird dort über `command` gesetzt.
- Die Quelldateien sind in den Container eingebunden. `jekyll serve --force_polling` baut Änderungen an Seiten, Beiträgen, Layouts und Styles automatisch neu. Dafür keinen zusätzlichen Container mit `docker compose run` starten und keinen manuellen Build ausführen. Nach Änderungen an `_config.yml` den bestehenden Dienst mit `docker compose -f jekyll/docker-compose.yaml restart jekyll` neu starten.
- Falls ein manueller Build oder Jekyll-Befehl tatsächlich nötig ist, ihn im laufenden Container mit `docker compose -f jekyll/docker-compose.yaml exec jekyll ...` ausführen. Eine lokale Ruby- oder Bundler-Installation wird nicht vorausgesetzt.
- Alle Tests mit `make test` ausführen. Node.js und weitere Testabhängigkeiten sind im Jekyll-Container installiert; der Testlauf bleibt bei Erfolg still und gibt bei Fehlern nur die Fehlermeldungen aus.
- Layoutänderungen nach Möglichkeit in der Vorschau auf Desktop- und Mobilbreite prüfen.
- Der Workflow `.github/workflows/publish.yml` synchronisiert Discussion-Kommentare und Antworten, committet Änderungen und veröffentlicht die Website über GitHub Actions. Die Zuordnung erfolgt über `comments_key` im Beitrag und `discussion_number` in `_data/comments/*.json`.

## Blogbeiträge

- Neue Beiträge mit `make new TITLE="Mein Beitrag"` als `_articles/NUM.linktitel/index.md` anlegen. Die Vorlage liegt unter `jekyll/article-template.md`; `make help` zeigt die verfügbaren Befehle.
- Jeder Beitrag setzt sein `permalink` explizit auf `/blog/linktitel/`. `published: true` und ein explizites `date` veröffentlichen ihn; zukünftige Daten bleiben zunächst verborgen.
- Beitragsbilder dürfen neben `index.md` oder in Unterordnern liegen. Relative Markdown-Bildlinks und `image: bild.png` werden unterstützt.
- Actions baut mit `bundle exec jekyll build` und `BUNDLE_GEMFILE=jekyll/Gemfile`.

## Tags und Feeds

- Tags als Inline-Liste im Front Matter pflegen, beispielsweise `tags: [php, jekyll]`. Für Tagseiten und Feeds nur Buchstaben, Ziffern und Unterstriche verwenden, vorzugsweise kleingeschrieben.
- Jeder Tag besitzt eine eigene Quelldatei `_pages/tags/TAG.md` mit `layout: tag`, `title: TAG`, `tag: TAG` und `permalink: /blog/tags/TAG/`. Das gemeinsame Layout filtert beim Build, nicht im Browser. Neue Tags benötigen eine solche Seite; die Tests prüfen die Zuordnung.
- Die Themenübersicht liegt unter `/blog/tags/`, einzelne Tagseiten unter `/blog/tags/TAG/`, der allgemeine Atom-Feed unter `/feed.xml` und Tagfeeds unter `/feed/by_tag/TAG.xml`. Atom wird von RSS-Readern unterstützt.
- `make test` prüft im laufenden Jekyll-Container auch die generierten Feedlinks, Tagfilterung und Feed-Autodiscovery der lokalen Vorschau.

## Gestaltung und Assets

- Gemeinsame Seitenbreite und Innenabstände über die vorhandenen Layoutklassen (`.site-frame`, `.page-content`, `.blog-page`) steuern. Keine eigenen `max-width`- oder Außenabstandsregeln für einzelne Seiten wie CV oder Projekte hinzufügen.
- Vor neuen Styles vorhandene Komponenten, Farben, Abstände und Typografie in `assets/css/site.scss` wiederverwenden. Seitenspezifische Regeln nur für tatsächlich eigene Inhalte oder Komponenten einsetzen, nicht für das allgemeine Seitenlayout.
- Farben und Maße möglichst an den bestehenden SCSS-Variablen und gemeinsamen Regeln ausrichten. Responsive Regeln für alle betroffenen Seiten mitdenken.
- Schriften, Bilder, Icons, CSS und JavaScript als lokale Dateien unter `assets/` ablegen und von dort laden. Keine externen URLs für Assets, CDNs oder externe Schriftendienste verwenden. Normale Links zu externen Profilen und Quellen sind davon ausgenommen.
- Inhalte und Metadaten in Markdown und Front Matter pflegen; gemeinsame HTML-Struktur in `_layouts/` ändern statt sie pro Seite zu duplizieren.
