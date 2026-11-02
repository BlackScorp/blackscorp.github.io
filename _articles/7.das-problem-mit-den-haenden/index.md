---
comments_key: 7-das-problem-mit-den-haenden
title: "Das Problem mit den Händen"
published: true
date: 2026-11-02
image: header.webp
image_width: 1408
image_height: 768
image_mobile: header-mobile.webp
image_tablet: header-tablet.webp
image_preview: header-preview.webp
image_preview_width: 480
image_preview_height: 262
image_alt: "KI-generiertes Bild: Eine metallene Roboterhand und eine menschliche Hand strecken ihre Zeigefinger aufeinander zu, angelehnt an die Erschaffung Adams."
image_ai_generated: true
permalink: /blog/das-problem-mit-den-haenden/
summary: "Für die 3D-Figur in Blender brauche ich eine T-Pose für die Referenzbilder. Die KI scheitert bei sechs Versuchen an einer einzigen Sache: den Händen."
description: "Aus einem 2D-Konzept soll eine 3D-Figur in Blender entstehen. Die KI schafft es bei sechs Versuchen nicht, die Arme korrekt in eine T-Pose zu bringen. Ein Erfahrungsbericht über verdrehte Hände, kopierte Rückansichten und die Grenzen von Bild-KI."
keywords: [T-Pose Referenz, KI Bildgenerierung Hände, 3D Figur aus 2D Bild, Blender Referenzbilder, KI Slop Game Dev, KI Hände drehen, 2D zu 3D Modellierung]
tags: [ki, 3d, blender, gamedev]
---

In meinem [letzten Beitrag](/blog/2d-zu-3d-ist-schwieriger-als-man-denkt/) habe ich versucht, aus einem 2D-Bild eine 3D-Figur zu erstellen. Das hat nicht sonderlich gut funktioniert, also habe ich mir gedacht, ich erstelle die 3D-Figur selbst in Blender. Schließlich habe ich ja ein 2D-Bild, das ich als Referenz benutzen kann.

Damals habe ich mir das Bild nur grob angeschaut. Bei der Vorbereitung der Bilder für Blender sind mir dann die ersten Fehler aufgefallen, also wollte ich die erstmal verbessern. Der erste Fehler war die Ansicht von hinten: Die KI hat einfach den vorderen Teil kopiert und das wars. Also musste ich das erstmal nachbessern.

{% include article-image.html src="concept.webp" width="1264" height="843" alt="Konzeptzeichnung der Roboterfigur in fünf Ansichten: vorne, Seite, hinten, von oben und von unten, mit korrigierter Rückansicht" %}

Das Bild habe ich dann in Einzelbilder aufgeteilt und in Blender als Referenz hinterlegt. Als ich dann seitlich draufgeschaut habe, ist mir aufgefallen, dass ich die Breite der Brust und der Hüfte nicht bestimmen kann. Der Arm ist seitlich drüber. Ich benötige also eine T-Pose, und ab hier ging es los mit den Problemen.

Eigentlich dachte ich mir, wie schwer kann es denn sein, die Arme einfach auf Schulterhöhe zu bringen.

So sah das erste Ergebnis aus:

{% include article-image.html src="versuch1.webp" width="541" height="564" alt="Versuch 1: Die Figur steht von hinten in T-Pose, die offenen Hände zeigen mit dem Handrücken nach vorne" %}

Dann sagte ich der KI, dass die Hände so nicht aussehen, bitte korrekt umdrehen.

{% include article-image.html src="versuch2.webp" width="539" height="564" alt="Versuch 2: Fast unverändert, an den Fingerspitzen hängen einzelne verdrehte Finger" %}

Hat wohl auch nicht funktioniert. Das wurde in Codex generiert. Ich dachte mir, ich probiere mal Google Gemini aus. Habe ihm das originale Konzept hochgeladen und dachte, dass Gemini es eventuell besser hinkriegt.

{% include article-image.html src="versuch3.webp" width="468" height="564" alt="Versuch 3 mit Gemini: Die Arme knicken im Ellbogen nach unten ab, am Rücken ist noch ein alter Arm sichtbar" %}

Die alten Arme waren noch drin. Nächster Versuch.

{% include article-image.html src="versuch4.webp" width="473" height="564" alt="Versuch 4: Die Arme sind gestreckt, aber beide Hände sind zu Fäusten mit abgespreizten Daumen nach oben verdreht" %}

Keine Ahnung, wieso die Daumen da jetzt oben sind. Dann dachte ich mir, vielleicht hilft ein neuer Chat mit frischem Kontext.

{% include article-image.html src="versuch5.webp" width="436" height="564" alt="Versuch 5: Neue Sitzung, T-Pose sitzt, die Hände sind aber nur zu Klauen zusammengefaltete Finger" %}

Ab diesem Zeitpunkt gebe ich erstmal auf. Ich habe ja die Hand von oben, unten und von der Seite. Das, was hinten wird, wird sich dann vermutlich von alleine ergeben.

Vielleicht sollte man das Thema nicht zu perfektionistisch angehen. Ich fand es aber interessant, wie oft ich versucht habe, die Hand zu verbessern, und am Ende bin ich nicht zu einem guten Ergebnis gekommen. Bei den Bildern habe ich ja nur die Hände gezeigt. Dazwischen sind noch mehr Fehler immer wieder aufgetreten.

Es gab falsche Proportionen, falsche Farben, Hände in anderen Darstellungen waren verdreht.

Ich glaube, wenn man da nicht genauer auf die Details schaut und offensichtliche Dinge falsch dargestellt werden, kann das Spiel sehr schnell als "KI-Slop" angesehen werden.
