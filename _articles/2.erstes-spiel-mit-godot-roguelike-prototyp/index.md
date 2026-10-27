---
title: "Mein erstes Spiel mit Godot: Roguelike-Idee und erster Prototyp"
published: true
date: 2026-10-27
permalink: /blog/erstes-spiel-mit-godot-roguelike-prototyp/
summary: "Ich stelle mein Spieleprojekt vor und zeige den ersten spielbaren Prototyp: eine Roguelike-Idee mit Godot."
description: "Ich entwickle mein erstes Spiel mit Godot: eine Roguelike-Idee mit Kampfinstanz, Gegnern und einem ersten spielbaren Prototyp."
keywords: [eigenes Spiel entwickeln, Godot, Roguelike, Spieleentwicklung, Game Development, Gamedevlog, Devlog, Prototyp]
image: header.webp
image_width: 1299
image_height: 775
image_mobile: header-mobile.webp
image_tablet: header-tablet.webp
image_preview: header-preview.webp
image_preview_width: 480
image_preview_height: 286
image_alt: "Screenshot des ersten spielbaren Godot-Prototyps mit Spielerfigur und rotem Gegner"
tags: [gamedev, godot, rpg]
---

Mit diesem Blog habe ich mir einen lang gehegten Wunsch erfüllt. Jetzt ist der nächste dran: Ich möchte mein eigenes Spiel entwickeln.

## Ich möchte mein eigenes Spiel entwickeln – und so sieht es momentan aus

Im Video ist der aktuelle Stand des Prototyps zu sehen: Ich gehe durch das Portal in die Kampfinstanz und stelle mich den Gegnern. Noch ist das Spiel ganz am Anfang, aber der erste Kampf ist bereits spielbar.

<figure class="article-video-figure">
  <video class="article-video" controls playsinline preload="metadata" poster="{{ page.url | append: 'header.webp' | relative_url }}">
    <source src="{{ page.url | append: 'demo.mp4' | relative_url }}" type="video/mp4">
    Dein Browser unterstützt keine Videowiedergabe.
  </video>
  <figcaption>Der aktuelle Stand des Prototyps.</figcaption>
</figure>

Bei der Arbeit kenne ich den üblichen Weg: Eine Anforderung steht fest, daraus ergeben sich Akzeptanzkriterien und Aufgaben. Schritt für Schritt entsteht so ein Projekt. Bei meinem Spiel ist es anders. Es gibt noch keine fertige Anforderung und keinen genauen Plan. Da sind erst einmal nur ein paar Ideen und die Frage: Was könnte daraus werden?

## Eine Idee mit vielen Durchläufen

Ich spiele gerne Roguelikes. An diesem Genre gefällt mir, dass es kurzfristige Erfolge mit einem langfristigen Ziel verbindet. Im Kampf stelle ich mich Gegnern, sammle Loot und freue mich über jeden gewonnenen Durchlauf. Gleichzeitig arbeite ich auf etwas Größeres hin: Mit dem Ausbau der Stadt möchte ich bessere Ausrüstung bekommen und mich später stärkeren Gegnern stellen.

In der Stadt beginnt der Spieler seinen Weg. Durch ein Portal gelangt er in ein Gebiet voller Gegner. Wenn er sie besiegt, soll er Beute und Ressourcen mit zurückbringen können. Damit könnte er nach und nach seine Stadt ausbauen: vielleicht mit einer Schmiede, einem Tränkeladen oder Möglichkeiten, Rohstoffe weiterzuverarbeiten.

Jeder Ausflug durch das Portal wäre dabei ein eigener Run. Die Runs könnten auch bestimmen, wie lange Ausbauten dauern. Ob diese Idee am Ende wirklich Spaß macht, weiß ich noch nicht. Genau das möchte ich herausfinden, indem ich zuerst die grundlegende Spielmechanik entwickle.

## Warum ich das Spiel entwickeln möchte

Natürlich gibt es schon viele Spiele. Für mich ist aber nicht nur das fertige Spiel das Ziel, sondern auch der Weg dorthin.

Ich möchte mich mit C# beschäftigen. Die Sprache erinnert mich in Teilen an PHP, ist aber kompiliert – und eine solche Sprache wollte ich schon lange besser kennenlernen. Außerdem macht mir das Modellieren in Blender Spaß. Es ist für mich eine entspannende Beschäftigung nach der Arbeit und eine gute Alternative zum Doomscrolling.

Auch beim Einsatz von KI möchte ich dazulernen: Wie muss ein Projekt aufgebaut sein, damit eine KI sinnvoll mitarbeiten kann? Welche Fähigkeiten und Abläufe helfen dabei? Und lässt sich ein Projekt wie dieses gut mit einem GitHub-Kanban-Board organisieren?

Am Ende würde ich das Spiel gerne veröffentlichen. Als ersten Schritt kann ich mir itch.io vorstellen. Mein erstes Spiel direkt auf Steam zu veröffentlichen, wäre mir vermutlich noch zu früh.

Ein weiterer Grund für das Projekt ist, dass ich langfristig eine Grafikkarte anschaffen möchte, mit der ich leistungsfähigere KI-Modelle lokal ausprobieren kann. Mich interessiert, wie weit ich bei der Spieleentwicklung mit einem Modell aus der Qwen-Familie komme und wo seine Grenzen liegen. Für welche Aufgaben reicht die lokale KI aus? Wann ist ChatGPT oder ein anderes Frontier-Modell die bessere Wahl? An diesem eigenen Projekt möchte ich solche Modelle ausprobieren und miteinander vergleichen.

## Der erste spielbare Schritt

Für den Anfang wollte ich nicht gleich die ganze Stadt, Beute und Ausbausysteme bauen. Ich brauchte erst einmal eine Figur, die ich steuern kann, und einen Ort, an dem ein Kampf stattfindet.

Dafür habe ich bei Mixamo ein Schwert-und-Schild-Modell samt Animationspaket heruntergeladen und ein neues Godot-Projekt angelegt. Mit Unterstützung von GPT-5.6 Luna entstand daraus der erste Prototyp: zwei Szenen, eine Figur mit Animationen und eine Steuerung mit WASD. Da ich das Spiel auf meinem Notebook auch ohne Maus spielen möchte, löse ich die Aktionen über die Tastatur. Mit der Leertaste geht es durch das Portal in die Kampfinstanz, mit J greift die Figur an.

In der Kampfinstanz tauchen Gegner auf. Sie können mich angreifen, ich kann sie besiegen – und ich kann selbst sterben. Für den Moment ist das der Kern des Prototyps. Spieler und Gegner verwenden noch dasselbe Modell; die Gegner sind lediglich rot eingefärbt.

Danach kamen nach und nach weitere Elemente dazu: eine Schadensanzeige, eine Minimap und ein erster gegnerischer Angriff mit roter Warnfläche. Bleibe ich darin stehen, nehme ich viel Schaden. Entferne ich mich zu weit von den Gegnern, kehren sie an ihre Ausgangsposition zurück und erhalten ihre volle Energie zurück. Außerhalb des Kampfes soll sich außerdem die Lebensenergie meiner Figur wieder auffüllen.

Mehr ist es noch nicht – und das ist in Ordnung. Der Wechsel von der Stadt in die Kampfinstanz, der Kampf und die Möglichkeit zu sterben bilden meinen ersten spielbaren Versuch. Ob daraus ein spannender Kreislauf werden kann, muss sich noch zeigen. In den nächsten Teilen möchte ich erzählen, wie ich den Prototyp weiterentwickle und welche Ideen dazukommen.

## Quellen

- [Godot Engine: C#/.NET](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html)
- [Mixamo](https://www.mixamo.com/)
- [Adobe: 3D-Charaktere mit Mixamo animieren](https://helpx.adobe.com/creative-cloud/help/animate-characters-mixamo.html)
