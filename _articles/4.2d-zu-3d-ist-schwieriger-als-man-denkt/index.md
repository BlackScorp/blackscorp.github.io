---
title: "2D zu 3D ist schwieriger, als man denkt"
published: true
date: 2026-10-29
image: header.webp
image_width: 1536
image_height: 1024
image_mobile: header-mobile.webp
image_tablet: header-tablet.webp
image_preview: header-preview.webp
image_preview_width: 480
image_preview_height: 320
image_alt: "KI-generiertes Bild: Ein cremefarbener Mecha mit rotem Schal wird einem grob aufgebauten, grauen 3D-Modell gegenübergestellt."
image_ai_generated: true
model_viewer: true
permalink: /blog/2d-zu-3d-ist-schwieriger-als-man-denkt/
summary: "Heute habe ich ein Mecha-Konzept entwickelt und versucht, daraus mit Visual Hull ein 3D-Modell zu erstellen. Das Ergebnis hat mir gezeigt, dass der Schritt von 2D zu 3D schwieriger ist als gedacht."
keywords: [Mecha Konzept, 2D zu 3D, Blender, Blender MCP, Blender MCP Server, Visual Hull, KI-generierte Bilder, 3D-Modell für Spiele]
tags: [gamedev, rpg, blender, 3d, ki]
---

Heute wollte ich mal zur Abwechlung etwas visuelles gestalten. Ich dachte ich beginne mit der Hauptfigur, schließlich werde ich die in der nächsten Entwicklung immer wieder sehen.

Wie fängt man da überhaupt an? Ich habe in dem Bereich keine Erfahrung. Auf jeden Fall wollte ich Mechas haben. Ich habe immer Mechas geliebt. Die Animes wie "Vision of Escaflown" oder "Gundam Brotherhood of Steel" sehen extrem gut aus. Früher habe ich auch viele Stunden in das MMORPG RF Online invistiert und das nur wegen der Rasse "Accretia". Also habe ich die Beispiele als Vorlage benutzt. Ich lies Codex erstmal ein paar Referenzbilder downloaden und anschließend mir ein Concept Art daraus generieren als Basis.

{% include article-image.html src="first_concept.webp" mobile="first_concept-mobile.webp" tablet="first_concept-tablet.webp" width="1606" height="979" alt="KI-generierte Konzeptzeichnung mit drei Ansichten eines dunklen Mechas mit hellen Panzerplatten und rotem Stoff" ai_generated="true" %}

Das Ergebnis sieht echt super aus. Im Spiel wäre das für mich eher die Endgame Ausrüstung also wollte ich das als Basis nehmen und vereinfachen. Man muss ja irgendwo unten Anfangen und sich dann hoch hinaus arbeiten. Also gab es einige Iterationen. Und für den Anfang sah das für mich am besten aus.

{% include article-image.html src="level-0-final.webp" mobile="level-0-final-mobile.webp" tablet="level-0-final-tablet.webp" width="1312" height="1199" alt="KI-generiertes Ganzkörperkonzept eines Mechas mit dunklem Gelenkrahmen, hellen Panzerplatten, blau leuchtendem Visier und rotem Schal" ai_generated="true" %}

Es hat weniger details als das Original aber mir fehlten einfach die Fähigkeit es besser zu beschreiben und ich dachte mir, ich mache es wie bei Software. Es wird nach und nach einfach verbessert und fertig. Es ist also v0.1-alpha

Jetzt kam das nächste Problem. Das Bild steht, aber ich brauche es als 3D Objekt damit ich es eben Animieren kann. Es gibt viele Anbieter bei denen man mittels KI ein Bild hochladen kann und daraus entsteht dann ein 3D Model. Ich will diese aktuell nicht verwenden weil ich einfach nicht extra Geld ausgeben will. Ich zahle ja jetzt schon für Codex.

Eine andere Methode wäre "Visual Hull". Dabei wird ein 2D Bild in unterschiedlichen Perspektiven. Also Link, Vorne, Hinten, Oben und Unten abgebildet. Es wird daraus eine Silouette ermittelt und dann kann man die einzelnen Punkte zusammen verbinden.

Der nächste Schritt wäre also mein Konzept Orthogonal zu generieren mit den einzelnen Seiten. Das Ergebnis sieht so aus.

{% include article-image.html src="turnaround.webp" mobile="turnaround-mobile.webp" tablet="turnaround-tablet.webp" width="1536" height="1024" alt="KI-generiertes Turnaround-Sheet des Mechas mit Vorder-, Seiten- und Rückansicht sowie Ansichten von oben und unten" ai_generated="true" %}

Mit GTP-6 Luna und Medium können da echt gute Bilder entstehen. Ich dachte mir das Ergebnis wäre schon fast fertig. Nur noch ein bisschen.

Codex hat anschließend die Bilder einzeln ausgeschnitten, den Hintergrund Transparent gemacht und ein Python Script geschrieben was de Visual Hull nachbilden soll.

Das Ergebnis sah dann überhaupt nicht gut aus

{% assign model_url = page.url | append: 'visual-hull.glb' | relative_url %}
<model-viewer src="{{ model_url }}" alt="Grobes, graues 3D-Blockout des Mechas mit kantigem Körper und einfachen Gliedmaßen" camera-controls camera-orbit="0deg 75deg 3m" min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 180deg auto" shadow-intensity="1" exposure="1"></model-viewer>

Es gibt also schon ein Grund wieso die Anbieter für 3D Modelle, Geld verlangen. Das Thema habe ich mir einfacher vorgestellt.

Blender hat ja auch einen MCP-Server. Damit kann eine KI ebenfalls Modelle erstellen. Das habe ich natürlich ausprobiert, und dabei ist Folgendes herausgekommen:

{% assign blender_mcp_url = page.url | append: 'blender-mcp.glb' | relative_url %}
<model-viewer src="{{ blender_mcp_url }}" alt="Mit Blender MCP erstelltes 3D-Modell des Mechas" camera-controls camera-orbit="0deg 75deg 3m" min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 180deg auto" shadow-intensity="1" exposure="1"></model-viewer>

Ich glaube aber, dass ich da erst einmal keine Zeit investieren will. Ich habe ja das Bild aus allen Seitenansichten. Als Nächstes werde ich mich selbst an Blender setzen und die Figur erstellen.

Ich habe früher schon mit Blender experementiert und ein paar Tutorials abgearbeitet, mal sehen ob ich mich noch an alles erinnern kann und ob der Skill wie mit Fahrradfahren ist.

Aber generell kann man sagen, dass man die KI für eine Konzeption sehr gut verwendne kann, wahrscheinlich fehlen mir Skills um Probleme in den Bildern jetzt schon zu erkennen. Das werde ich wohl in der Zukunft dann herausfinden.
