---
comments_key: 5-von-codex-abo-zu-deepseek-pay-per-use
title: "Von Codex-Abo zu DeepSeek Pay-per-Use: mein Fazit nach dem ersten Tag"
published: true
date: 2026-10-30
permalink: /blog/von-codex-abo-zu-deepseek-pay-per-use/
summary: "Mein Codex-Abo hat mich mit seinem Tageslimit frustriert. Deshalb habe ich DeepSeek mit Prepaid-Guthaben ausprobiert und einen echten System-Update-Task damit erledigt."
description: "Ich habe mein Codex-Abo aufgegeben und nutze DeepSeek im Pay-per-Use-Modell. Was mich am Tageslimit gestört hat, wie viel Tokens ich verbrauche und was 22 Millionen Tokens am Ende gekostet haben."
image: header.webp
image_width: 1264
image_height: 843
image_mobile: header-mobile.webp
image_tablet: header-tablet.webp
image_preview: header-preview.webp
image_preview_width: 480
image_preview_height: 320
image_alt: "KI-generiertes Bild: Eine kontrastreiche Schwarz-Weiß-Raumlandschaft mit einer hell leuchtenden Sonne am Horizont und sternenklarem Himmel."
image_ai_generated: true
mermaid: false
tags: [ki, coding, deepseek, cost]
keywords: [DeepSeek statt Codex, KI Coding Abo, Codex Tageslimit, DeepSeek Pay-per-Use, DeepSeek Preise, KI Tokens Kosten, günstige KI zum Programmieren, Codex Agent CLI, Void Linux Pakete aktualisieren, KI Modell Benchmarks]
---

Stell dir vor, du zahlst jeden Monat 23 €, um in deiner Freizeit mit KI zu programmieren, und nach ein paar Stunden bist du gezwungen, eine Pause einzulegen, weil dein 5-Stunden-Limit erreicht ist. Wenn du aber mal einen Tag nichts machst, wird dir dieses Limit nicht gutgeschrieben.

Wenn du also einen vollen Monat lang nicht programmierst, zahlst du trotzdem weiterhin 23 €. Das hat mich aktuell so derart frustriert, dass ich mich mal nach Alternativen umgeschaut habe.

Mein Use Case ist eigentlich ein einfacher. Nach der Arbeit so ab 17 Uhr arbeite ich ein paar Stunden an einem Projekt. Die KI entscheidet nicht für mich, sie muss nicht über Nacht laufen. Sie soll einfach nur das machen, was ich will. Also nichts Intensives. Ich bin kein Poweruser. Aber dennoch bin ich besonders am Wochenende immer wieder an mein Limit gekommen.

Ich habe mir meine Statistik angeschaut: In den letzten 7 Tagen habe ich ca. 72 Millionen Tokens benutzt. Leider sieht man in der Oberfläche von Codex nicht, ob das gecachte Tokens waren und wie sich die Summe auf Input, Cache und Output verteilt.

Es gab auch Tage, an denen ich nichts getan habe, und man hatte die ganze Zeit im Hinterkopf: „Wenn ich heute das Limit nicht aufbrauche, dann ist das Geld weg."

Ich habe mir also mal die Benchmarks der anderen Modelle angeschaut. Vorher hatte ich GPT6 Luna benutzt, das war für meine Zwecke völlig ausreichend. In der Liste habe ich dann DeepSeek V4.1 Flash gesehen, und es war besser als Luna bewertet.

{% include article-image.html src="benchmarks.webp" mobile="benchmarks-mobile.webp" tablet="benchmarks-tablet.webp" width="1356" height="739" alt="Benchmark-Übersicht mehrerer KI-Modelle mit ihren Bewertungen, in der DeepSeek V4.1 Flash besser abschneidet als GPT6 Luna" %}

Auf der Seite von DeepSeek hat mich besonders die Preisliste überzeugt. Du zahlst nur, was du verbrauchst, und außerhalb der Arbeitszeiten in China ist es günstiger. Da ich abends programmiere, liege ich automatisch außerhalb dieser Zeit.

Ein weiterer Punkt war, dass ich nicht direkt ein Abo abschließen muss. Einfach eine Art Prepaid-Konto: Ich lade eine Summe auf, und wenn sie aufgebraucht ist, kann ich die KI nicht mehr nutzen. Fette Rechnungen können so gar nicht erst entstehen. Ich habe erst mal 2 € aufgeladen und konnte es damit ausprobieren.

## Der erste echte Test: Pakete unter Void Linux

Heute wollte ich mein Void-Linux-System etwas aktualisieren, und die Pakete waren dafür ein guter Test-Use-Case.

Bei Void Linux klont man das Paket-Repository lokal über Git. Pro Paket gibt es eine Template-Datei, in der die Version, die Art des Builds und die Build-Abhängigkeiten stehen. Außerdem steht dort zu jedem Paket der GitHub-Pfad.

Ich ließ mir also Code generieren. Der Code enthält eine feste Liste an Paketen, die ich aktualisieren will. Für diese Pakete wird die Template-Datei herausgesucht und die aktuelle Version ausgelesen. Danach wird auf GitHub beim Paket geschaut, ob es eine neuere Version gibt. Wenn ja, wird die neue Version ins Template geschrieben, anschließend der Build-Prozess angestoßen und danach die Build-Abhängigkeiten wieder gelöscht.

Heute habe ich OBS auf die Version 33.0 aktualisiert. Die neue Version braucht FFmpeg 8, das Void gar nicht hat. Also hat die KI mir ein neues Template angelegt, damit ich OBS über das Skript neu bauen kann. Natürlich wurde der Build-Prozess vorher lokal getestet, und für das Template hat sie die richtigen Dev-Abhängigkeiten ermittelt und eingetragen.

Den Code kannst du hier finden: <https://gist.github.com/BlackScorp/4b2cbdd0305a012501fc732f6e2a7347>

Du siehst also, es war etwas mehr als „färbe den Button grün".

## Was das am Ende gekostet hat

Ich glaube generell, dass man sich auf die Benchmarks mittlerweile nicht mehr verlassen kann. Alles, was in der Größenordnung von Qwen 3.8 27B oder darüber aufgelistet ist, reicht für die normalen Tasks völlig aus.

Ich vergleiche die Benchmarks gern mit der Formel 1. In der Regel reicht dir auch ein Fiat, um von A nach B zu kommen. Die Formel-1-Autos sind für den normalen Verbraucher nicht relevant.

Mit dem heutigen Task habe ich etwas über 22 Millionen Tokens verbraucht, und das hat mich 14 Cent gekostet. Bei Codex wären es bei 23 € auf 30 Tage gerechnet 0,77 € pro Tag. Das heißt, ich konnte vermutlich am Ende des Tages mehr machen für weniger Geld.

{% include article-image.html src="tokens.webp" mobile="tokens-mobile.webp" tablet="tokens-tablet.webp" width="1026" height="914" alt="Screenshot der Token-Abrechnung von DeepSeek: über 22 Millionen verbrauchte Tokens, aufgeteilt auf Input, Cache und Output, für einen Gesamtpreis von 14 Cent" %}

Und wenn ich mal nichts tue, kostet es mich auch nichts. Natürlich ist das nur ein einziger Tag, ich muss da noch mehr Erfahrung sammeln. Bisher ist es aber doch positiv.

## Ein negativer Punkt

Ich habe den Agenten „Crush" verwendet und habe das Gefühl, dass damit irgendwie mehr Tokens verbrannt werden. Mit dem Agenten bin ich bei Codex schneller an das Limit gekommen als mit der CLI von Codex selbst. Das werde ich morgen mal mit dem Client von DeepSeek selbst ausprobieren.

Und ich kann keine Bilder über DeepSeek generieren, nur anschauen und verstehen kann es sie. Ich denke aber, dass ich für diesen Fall einfach Google Gemini verwenden werde. Da habe ich 100 freie Bilder am Tag, die ich generieren kann, das sollte reichen.

## Fazit

Wenn du einen ähnlichen Use Case wie ich hast, dann probiere DeepSeek mal aus. Ein Prepaid-Guthaben macht den Einstieg leicht, und man sieht direkt, was ein einzelner Task wirklich kostet.

## Weiterführende Links

- [DeepSeek Platform: Guthaben aufladen und API-Keys verwalten](https://platform.deepseek.com/)
- [DeepSeek API: Preise und Modelle](https://api-docs.deepseek.com/quick_start/pricing)
- [Crush: Coding-Agent im Terminal](https://github.com/charmbracelet/crush)
- [Void Linux: Dokumentation](https://docs.voidlinux.org/)
- [Void Packages auf GitHub](https://github.com/void-linux/void-packages)
- [Google Gemini](https://gemini.google.com/)
