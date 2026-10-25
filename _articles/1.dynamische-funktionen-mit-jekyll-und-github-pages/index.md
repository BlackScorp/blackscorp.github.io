---
comments_key: 1-dynamische-funktionen-mit-jekyll-und-github-pages
title: "Dynamische Funktionen mit Jekyll und GitHub Pages"
published: true
date: 2026-10-25
permalink: /blog/dynamische-funktionen-mit-jekyll-und-github-pages/
summary: "Wie ich mit Jekyll und GitHub Pages einen statischen Blog mit Kommentaren und automatischen Ankündigungen aufgebaut habe."
description: "Ein Blog mit Jekyll und GitHub Pages muss nicht auf Kommentare verzichten: So ergänze ich eine statische Website mit GitHub Discussions und Actions."
image: jekyll-github-pages-blog.png
image_alt: "Eine Markdown-Seite wird über Git in eine Website übertragen"
image_ai_generated: true
tags: [github_pages, jekyll, docker, github_actions, bloggen]
keywords: [dynamische Funktionen statische Website, Jekyll Blog, GitHub Pages, GitHub Actions, GitHub Discussions, Blog Kommentare]
---

# Die Idee: ein eigener Blog

Ich wollte schon immer mal einen eigenen Blog führen und meine Experimente dokumentieren.
Ein Blog zu führen erlaubt es, eigene Gedanken besser zu strukturieren und Probleme besser zu verstehen und zu verarbeiten. Er ist also nicht nur für andere Leser gedacht, sondern auch für mich selbst.

Ich habe allerdings besondere Ansprüche an einen Blog und wenig Zeit gehabt, um ihn aufzusetzen.

Bei „statisch“ denken viele vielleicht zuerst daran, dass es keine dynamischen Funktionen wie Kommentare geben kann. Genau das wollte ich ausprobieren: Kann ich einen Blog mit einem Static-Site-Generator betreiben und trotzdem Kommentare und automatische Abläufe integrieren?

Meine Idee war: Ich öffne einen Markdown-Editor meiner Wahl und kann direkt mit dem Schreiben loslegen. Code und Syntax-Highlighting sollten auf jeden Fall drin sein. Der Text sollte versionierbar sein und einfache Diagramme sollten auch möglich sein.

Außerdem will ich die Freiheit haben, das Layout komplett selbst zu gestalten, und ich möchte kein Geld fürs Hosting ausgeben.
Ich will mich auch nicht um Updates von Server und Infrastruktur kümmern.

Doch wie funktioniert das im Detail?

# Grundlegendes

Auf GitHub besteht die Möglichkeit, ein Repository mit dem Namen `<username>.github.io` anzulegen. Alles, was du hier veröffentlichst, ist auch unter der URL `https://<username>.github.io` erreichbar.

Standardmäßig versucht GitHub, in diesem Repository den Static-Site-Generator Jekyll zu verwenden. Du könntest zum Beispiel eine Datei `.nojekyll` und eine `index.html` mit „Hallo Welt“ anlegen und nach dem Pushen des Git-Commits das Ergebnis sehen.

Ich möchte in meinem Fall aber Jekyll verwenden, da bei einem Blog automatisch RSS-Feeds, Tags und Ähnliches generiert werden können.

# Docker setup

Bevor ich überhaupt loslegen kann, muss ich ja irgendwie eine Vorschau lokal haben. Ich könnte zwar ein Jekyll-Template verwenden, dieses immer wieder auf GitHub deployen und schauen, was am Ende herauskommt. Das würde aber zu lange dauern.

Deshalb habe ich mir als Erstes ein Dockerfile mit Jekyll gebaut.

```Dockerfile
FROM ruby:3.3.4

WORKDIR /site

ENV BUNDLE_GEMFILE=/site/jekyll/Gemfile

COPY Gemfile Gemfile.lock ./jekyll/
RUN bundle install
```

Der Container musste noch in einer `docker-compose.yaml` konfiguriert werden. Das sieht dann so aus:

```yaml
name: blog

services:
  jekyll:
    build: .
    command: ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--force_polling"]
    ports:
      - "127.0.0.1:4000:4000"
    volumes:
      - ..:/site
    environment:
      JEKYLL_ENV: production

```

Jetzt konnte ich die ersten Dateien ablegen und mir unter <http://localhost:4000> die Vorschau anzeigen lassen. Ich musste nichts bei GitHub commiten und nicht warten.

Als Nächstes war das Layout dran. Ich habe zunächst versucht, mir mit Codex ein paar Layoutvorschläge generieren zu lassen. Das hat allerdings nicht besonders gut funktioniert. Besser lief es, als die Layouts als Bilder generiert wurden. Mit Bildern konnte Codex irgendwie besser umgehen als mit HTML. Nach einigen Vorschlägen habe ich mich für das Layout entschieden, das du gerade siehst. Es sollte dunkel und schlicht sein und Orange als Highlightfarbe haben.

Der Rest war nur noch, die Styles aus dem Bild zu extrahieren und im Blog zu konfigurieren. Natürlich hat das die KI für mich gemacht.

# Beiträge erstellen

Nach dem Setup konnte ich dann direkt loslegen. Die Beiträge landen im Unterordner `_articles/<Name>/index.md`. Alle Bilder, die zum Blogbeitrag gehören, landen auch in diesem Ordner.

Die `index.md` ist in zwei Teilen aufgebaut. Ganz oben stehen die Metainformationen zum Beitrag, wie zum Beispiel die URL, wann der Artikel veröffentlicht wurde, das Layout, die Tags oder Keywords. Das ist das Front Matter.

Darunter kommt ganz normal mein Inhalt. Syntax-Highlighting geschieht über CSS und Diagramme kann man mit dem Mermaid-JavaScript-Framework im Browser rendern. Mehr braucht man erst mal nicht.

# Dynamische Kommentare

Jetzt gehört ja zu jedem Blog auch die Kommentarfunktion. Diese kann man auf einer statischen HTML-Seite relativ schwierig umsetzen. Viele würden ein Iframe von Disqus oder Ähnlichem einbinden. Ich entschied mich für einen anderen Weg. Auf GitHub gibt es Workflows, die man bei bestimmten Events auslösen kann. Außerdem hat GitHub eine Diskussionsplattform. Hier können GitHub-Nutzer sie wie eine Art Forum verwenden. Es gibt eine besondere Kategorie „Ankündigungen“. In dieser Kategorie kann nur ich als Betreiber einen Eintrag erstellen, und andere Nutzer dürfen nur kommentieren.

Meine Idee war jetzt folgende: Wenn ich einen Beitrag veröffentliche, erstelle ich eine neue Ankündigung. Die URL der Ankündigung hinterlege ich im Front Matter meines Blogbeitrags. Anschließend erstelle ich einen Workflow auf GitHub. Dieser holt sich die neuesten Kommentare und exportiert sie als JSON in den Ordner `_data/comments`.

Jekyll liest die Kommentare und zeigt sie unter dem Blogbeitrag an. Der Trigger für den Workflow ist also ein Kommentar.

Der Prozess besteht also aus mehreren Schritten. Die Skriptausführung geschieht über `actions/github-script`. Ich kann eine Node.js-Datei erstellen und darin alles abarbeiten.

Den kompletten Workflow mit Triggern sieht man [hier](https://github.com/BlackScorp/blackscorp.github.io/blob/master/.github/workflows/publish.yml).

# Automatische Ankündigungen

Nachdem ich den Blog und die Workflows mehrfach ausprobiert hatte, bin ich auf die Idee gekommen, dass ich auch automatisch Ankündigungen anlegen kann. Das Skript dazu habe ich in Bash geschrieben. Die Idee ist, alle Artikel herauszusuchen, die `published: true` im Front Matter haben und keinen `comments_key`. Wenn es den `comments_key` nicht gibt, dann gibt es noch keine Ankündigung für den Beitrag. So kann man die Ankündigung automatisch erstellen, ihre ID auslesen und ins Front Matter schreiben. Der Job würde nächtlich laufen oder dann, wenn ich ihn manuell über GitHub starte.

# Fazit

Dank GitHub, KI und Jekyll konnte ich mir nun meinen Traum erfüllen und einen eigenen Blog starten. Vielleicht wäre es auch eine Idee für dich. Wenn du einfache Seiten hast und nicht unbedingt dynamischen Content direkt benötigst, kannst du durchaus einiges über Static-Site-Generatoren und GitHub Actions lösen.

Ich habe auf jeden Fall jetzt die Möglichkeit, einfach einen Text in Markdown zu schreiben und das Layout für alle Blogbeiträge direkt zu bearbeiten. Ich kann den Blog auch mal selbst hosten. Und wenn jemand einen Gastbeitrag bei mir machen möchte, kann er das über einen Pull Request im Projekt machen.


## Weiterführende Links

- [GitHub Pages: Dokumentation](https://docs.github.com/pages)
- [GitHub Pages: Eine GitHub-Pages-Website mit Jekyll erstellen](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Jekyll: Dokumentation](https://jekyllrb.com/docs/)
- [Jekyll: GitHub Pages](https://jekyllrb.com/docs/github-pages/)
- [GitHub Actions: Dokumentation](https://docs.github.com/actions)
- [GitHub Discussions: Dokumentation](https://docs.github.com/discussions)
