---
permalink: /projects/shop/
layout: project
project: true
project_order: 1
title: Online Shop mit PHP
category: Tutorial-Serie
description: PHP-Online-Shop als Lernprojekt mit Code und Video-Playlist.
summary: Schritt für Schritt einen Online Shop mit PHP aufbauen – mit Video-Serie und Quellcode.
lead: Eine Video-Serie zum Aufbau eines PHP-Projekts.
image: /assets/images/videos/php-shop-playlist.jpg
mermaid: false
shop_playlist_id: PLz858EFEcxiElOUr7b3Pql1CMHuVRYkTh
shop_playlist_title: PHP Online Shop programmieren
---

<section class="project-showcase" aria-labelledby="shop-overview-title">
  <div>
    <h2 id="shop-overview-title">Über das Projekt</h2>
    <p>In dieser Tutorial-Serie entsteht Schritt für Schritt ein Online Shop mit PHP. Der Beispielcode zeigt, wie ein PHP-Projekt strukturiert und aufgebaut werden kann. Er dient zum Lernen und ist nicht für den produktiven Betrieb eines Shops gedacht.</p>
    <p><a class="primary-link project-code-link" href="https://github.com/blackScorp/shop" target="_blank" rel="noopener noreferrer"><span class="social-icon social-icon--github" aria-hidden="true"></span>Quellcode auf GitHub</a></p>
  </div>
  <div class="video-card">
    <div class="video-player" data-playlist-id="{{ page.shop_playlist_id | escape }}" data-video-title="{{ page.shop_playlist_title | escape }}">
      <div class="video-stage"><img class="video-thumbnail" src="{{ page.image | relative_url }}" alt="Vorschaubild zur PHP-Online-Shop-Serie" loading="lazy" width="480" height="360"></div>
      <div class="video-consent">
        <p>Mit „Playlist laden“ wird eine Verbindung zu YouTube hergestellt. Dabei können Daten an Google übertragen und Cookies oder ähnliche Technologien verwendet werden. <a href="{{ '/datenschutz/' | relative_url }}">Datenschutz</a></p>
        <button class="video-load" type="button">YouTube-Playlist laden</button>
      </div>
    </div>
    <button class="video-stop" type="button" hidden>Playlist schließen</button>
    <a class="video-external" href="https://www.youtube.com/playlist?list={{ page.shop_playlist_id | escape }}" target="_blank" rel="noopener noreferrer">Playlist auf YouTube ansehen ↗</a>
  </div>
</section>
