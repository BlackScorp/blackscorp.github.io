# Projekt: BlackScorp Webseite und Blog

Diese persönliche Webseite mit CV, Projekten, Kontaktseite und Blog wird mit Jekyll gebaut und über GitHub Pages veröffentlicht. Inhalte stehen in Markdown (Seiten unter `_pages/`, Blogbeiträge unter `_posts/`), gemeinsame HTML-Strukturen in `_layouts/` und Styles in `assets/css/site.scss`. `_pages/` wird über `include` in `_config.yml` eingebunden; Seiten erhalten ihre öffentliche URL über ein explizites `permalink` im Front Matter. Projektunterseiten liegen unter `_pages/projects/`.

## Lokale Entwicklung

- Die Entwicklungsumgebung läuft im Docker-Container; die Vorschau ist unter <http://localhost:4000> erreichbar. Vor dem Starten mit `docker compose ps` prüfen, ob der Jekyll-Dienst bereits läuft. Nur wenn er nicht läuft, mit `docker compose up --build` starten.
- Die Quelldateien sind in den Container eingebunden. `jekyll serve --force_polling` baut Änderungen an Seiten, Beiträgen, Layouts und Styles automatisch neu. Dafür keinen zusätzlichen Container mit `docker compose run` starten und keinen manuellen Build ausführen. Nach Änderungen an `_config.yml` den bestehenden Dienst neu starten.
- Falls ein manueller Build oder Jekyll-Befehl tatsächlich nötig ist, ihn im laufenden Container mit `docker compose exec jekyll ...` ausführen. Eine lokale Ruby- oder Bundler-Installation wird nicht vorausgesetzt.
- Layoutänderungen nach Möglichkeit in der Vorschau auf Desktop- und Mobilbreite prüfen.
- Die Kommentarsynchronisierung mit `node --test .github/scripts/sync-comments.test.cjs` prüfen. Der Workflow `.github/workflows/publish.yml` synchronisiert Discussion-Kommentare und Antworten, committet Änderungen und veröffentlicht die Website über GitHub Actions. Die Zuordnung erfolgt über `comments_key` im Beitrag und `discussion_number` in `_data/comments/*.json`.

## Gestaltung und Assets

- Gemeinsame Seitenbreite und Innenabstände über die vorhandenen Layoutklassen (`.site-frame`, `.page-content`, `.blog-page`) steuern. Keine eigenen `max-width`- oder Außenabstandsregeln für einzelne Seiten wie CV oder Projekte hinzufügen.
- Vor neuen Styles vorhandene Komponenten, Farben, Abstände und Typografie in `assets/css/site.scss` wiederverwenden. Seitenspezifische Regeln nur für tatsächlich eigene Inhalte oder Komponenten einsetzen, nicht für das allgemeine Seitenlayout.
- Farben und Maße möglichst an den bestehenden SCSS-Variablen und gemeinsamen Regeln ausrichten. Responsive Regeln für alle betroffenen Seiten mitdenken.
- Schriften, Bilder, Icons, CSS und JavaScript als lokale Dateien unter `assets/` ablegen und von dort laden. Keine externen URLs für Assets, CDNs oder externe Schriftendienste verwenden. Normale Links zu externen Profilen und Quellen sind davon ausgenommen.
- Inhalte und Metadaten in Markdown und Front Matter pflegen; gemeinsame HTML-Struktur in `_layouts/` ändern statt sie pro Seite zu duplizieren.
