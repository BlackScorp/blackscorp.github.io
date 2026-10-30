---
title: "Goose statt Crush: weniger Tokens für die gleiche Arbeit"
published: true
date: 2026-10-31
permalink: /blog/goose-statt-crush-weniger-tokens-fuer-die-gleiche-arbeit/
image: header.webp
image_width: 1264
image_height: 848
image_mobile: header-mobile.webp
image_tablet: header-tablet.webp
image_preview: header-preview.webp
image_preview_width: 480
image_preview_height: 322
image_alt: "KI-generiertes Bild: Zwei Terminal-Fenster im Vergleich. Bei goose ist die Token-Anzeige nur zu einem Viertel gefüllt, bei crush ist sie voll und ein großer Haufen Token-Würfel türmt sich davor. Ein roter Pfeil zeigt von crush zu goose."
image_ai_generated: true
summary: "Ich habe goose CLI mit Crush verglichen: Beim ersten „Hi“ braucht goose 4k statt 12k Tokens. Dazu ein echter Task unter Void Linux sowie RAM, Provider und Bedienung im direkten Vergleich."
description: "goose CLI gegen Crush im direkten Vergleich: Wie viele Tokens kostet ein einfaches „Hi“, was bringt ein echter Rust- und Zig-Build unter Void Linux, und wo liegen die Unterschiede bei RAM, Providern und Bedienung?"
keywords: [goose CLI, goose vs Crush, Crush Terminal, KI Agent Vergleich, Tokenverbrauch, weniger Tokens, DeepSeek als Provider, Coding Agent CLI, OpenCode, OpenHands]
tags: [ki, coding, deepseek, cost, agents]
---

Jetzt, wo ich [auf DeepSeek umgestiegen bin](/blog/von-codex-abo-zu-deepseek-pay-per-use/) und genauer sehen kann, wofür ich Tokens ausgebe, wollte ich mir mal die Agenten anschauen, die ich verwende. Bei Codex hatte ich Codex CLI und Crush zusammen benutzt. Mir ist immer wieder aufgefallen, dass ich mit Crush relativ früh an mein Stunden-Limit gekommen bin.

Tatsächlich haben sich auch andere mit der Frage des Tokenverbrauchs beschäftigt, und so bin ich auf den Artikel hier gekommen: <https://arxiv.org/pdf/2607.22585>

Hier wird goose CLI als Basis genommen und mit OpenHands und OpenCode verglichen. Der Beitrag ist von Juni 2026, es kann also sein, dass das zum Zeitpunkt, wo du es liest, nicht mehr stimmt.

Auf jeden Fall fand ich interessant, dass goose CLI 40-mal weniger Tokens verbraucht als OpenCode. Damit kann man für das gleiche Geld die gleiche Leistung erbringen.

## Warum ich bei goose wieder vorbeigeschaut habe

Goose kannte ich schon früher. Ich habe es immer wieder lokal mit einem 9B-Modell getestet, leider funktionierte es damals nicht so gut. Das 9B-Modell konnte die Toolcalls in goose nicht besonders gut umsetzen, oft gab es Fehler und Endlosschleifen.

Anschließend habe ich dann Crush gefunden, und damit konnte ich mit einem 9B-Modell lokal arbeiten. Das Problem war aber, dass ich nicht nur ein 9B-Modell hatte, sondern auch nur ein ca. 42k-Token-Fenster. Meine Grafikkarte RTX 3060 Ti hat nur 8 GB VRAM, und ich bin da eingeschränkt.

Das heißt, Crush konnte zwar besser die Tools aufrufen und Dateien lesen, aber ich hatte dafür immer wieder Context-Zusammenfassungen, wo dann Inhalte aus dem Kontext geflogen sind. Es war also nur möglich, kleine Dinge umzusetzen.

Zum aktuellen Zeitpunkt kann man also nichts Wesentliches mit wenig VRAM lokal umsetzen.

## Der erste Test: ein einfaches „Hi“

Wie dem auch sei, ich habe mir also goose installiert und als Erstes einfach nur „Hi“ getestet, um den initialen Tokenverbrauch zu messen.

Bei Crush habe ich ca. 12k Tokens benutzt.

{% include article-image.html src="crush.webp" width="371" height="274" alt="Crush im Terminal mit DeepSeek V4.1 Flash: Nach einer einfachen Begrüßung zeigt die Statuszeile 12,8k verbrauchte Tokens" %}

Man muss hier aber bedenken, dass ich die Crush-Toolcalls schon eingeschränkt habe. Ich habe zum Beispiel alle LSP-Tools deaktiviert, da ich lokal kein LSP verwende.

Und hier haben wir goose:

{% include article-image.html src="goose.webp" width="374" height="184" alt="goose CLI nach dem Befehl „hi“: Antwort in 1,43 Sekunden, Statuszeile zeigt 4k von 1,0M Tokens verbraucht" %}

4k Tokens bei einem einfachen „Hi“. Sind auf jeden Fall dreimal so wenig.

## Die komplexere Aufgabe

Als Nächstes wollte ich eine komplexere Aufgabe umsetzen, damit ich den Vergleich zu gestern habe. Ich ließ goose das, was ich vorher über bash installiert hatte, als Paket zu Void hinzufügen. Dazu kam noch das Paket lightpanda. Das ist ein Headless-Browser für KI, damit man auch Inhalte von Webseiten laden kann, die JavaScript benötigen, ohne extra Chrome oder Firefox im Headless-Modus zu starten.

Das Ganze war ein Rust- und Zig-Build. Mir ist in der Statistik in DeepSeek aufgefallen, dass man mit goose wirklich weniger Tokens benutzt und mehr Output-Tokens generiert werden.

Output-Tokens sind eigentlich die wichtigen Tokens. Das ist ja das Wissen, das ausgegeben wird.

Ich bin mir noch unsicher, wie ich die Statistik selbst bewerten soll. Ich habe weniger Tokens gebraucht für eine komplexe Aufgabe, aber genauso viel bezahlt, weil eben mehr Output-Tokens kamen. Vielleicht kann man das noch mit dem caveman skill besser steuern.

Ich sammle aktuell nur Erfahrungen, konkret kann ich noch nichts sagen.

{% include article-image.html src="deepseek-stats.webp" width="968" height="892" alt="DeepSeek-API-Statistik für den 30.10.2026: 41,3 Millionen Tokens, davon 12,1 Millionen Input-Tokens aus dem Cache, 430.040 Input-Tokens ohne Cache und 150.262 Output-Tokens, Gesamtkosten 0,40 US-Dollar" %}

## Was ich von einem Agenten erwarte

Eigentlich habe ich relativ einfache Anforderungen an den Agenten:

- Er soll wenige Tokens verbrauchen
- Er soll konfigurierbar und erweiterbar sein
- Er soll meine Provider unterstützen
- Er soll wenig RAM verbrauchen
- Er soll gut aussehen und gut bedienbar sein

## Goose vs. Crush

Goose verbraucht bei mir ca. 240 MB RAM, während Crush nur bei 88 MB liegt. RAM-Nutzung ist relevant, wenn Subagenten gestartet werden. Codex war bei 300 MB. Hier gewinnt Crush natürlich.

Konfigurierbar und erweiterbar sind beide. Aber ich glaube, in goose könnte ich sogar den System-Prompt anpassen. Bei Crush geht es nicht. Ich kann höchstens eigenen Text dazuschreiben. Ich würde hier noch sagen, es ist ein Unentschieden, da ich mich mit goose noch nicht so stark beschäftigt habe.

Goose unterstützt DeepSeek direkt als Provider, während man es bei Crush manuell konfigurieren musste. Es gibt zwar DeepSeek, aber das wird über irgendeinen Open Router angeboten und nicht das direkte. Hier ist goose dann besser.

Vom Aussehen her gewinnt Crush. Es sieht viel besser aus. Tool-Ausgaben werden versteckt, man sieht im Output am Ende nur das, was einen wirklich interessiert. Bei goose wird alles in der Konsole ausgegeben und man muss ständig scrollen, das ist nicht besonders schön.

Goose hat noch zwei weitere Vorteile. Es gibt goose Desktop, das im Grunde wie Claude oder Codex Desktop aussieht. Wenn man eher so ein Interface bevorzugt, hat man die Möglichkeit, es zu nutzen.

Außerdem hat goose ACP-Unterstützung. Ich kann goose im Editor Zed konfigurieren und benutzen. Dann wäre vermutlich die Tool-Ausgabe und Übersichtlichkeit besser als bei der CLI-Lösung.

Crush hat noch den Nachteil, dass es in jedem Projekt einen .crush-Ordner anlegt, mit einer SQLite-Datenbank und weiteren Dingen. Goose legt das irgendwo zentral ab. Wenn ich es mal löschen will, lösche ich einen Ordner und fertig.

## Fazit

Also hat alles bisher Vor- und Nachteile. Ich denke, ich muss es mehr in meinen Projekten einsetzen, um ein besseres Urteil zu fällen.

Eigentlich bevorzuge ich Crush auf der CLI. Vermutlich wäre das Beste, Crush zu forken und den System-Prompt sowie die Tool-Beschreibung für Bash zu verändern. Dann würde ich direkt weniger Tokens verbrauchen. Aber ich denke, ich werde erstmal Goose über den Zed-Editor als ACP einsetzen und schauen, wie gut es funktioniert.

## Weiterführende Links

- [goose: Open-Source-KI-Agent](https://github.com/block/goose)
- [Crush: Coding-Agent im Terminal](https://github.com/charmbracelet/crush)
- [Zed Editor mit ACP-Unterstützung](https://zed.dev/)
- [Lightpanda: Headless-Browser für KI](https://lightpanda.io/)
- [Void Packages auf GitHub](https://github.com/void-linux/void-packages)
