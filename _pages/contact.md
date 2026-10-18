---
permalink: /contact/
layout: page
title: Kontakt
description: Kontakt und Profile von BlackScorp.
lead: Du möchtest dich austauschen? Hier findest du meine Profile.
---

- **GitHub:** [{{ site.social.github }}]({{ site.social.github }}){: target="_blank" rel="noopener noreferrer" }
{% if site.social.linkedin %}
- **LinkedIn:** [Profil ansehen]({{ site.social.linkedin }}){: target="_blank" rel="noopener noreferrer" }
{% endif %}
{% if site.social.youtube %}
- **YouTube:** [Kanal ansehen]({{ site.social.youtube }}){: target="_blank" rel="noopener noreferrer" }
{% endif %}
{% if site.contact_email %}
- **E-Mail:** [{{ site.contact_email }}](mailto:{{ site.contact_email }})
{% endif %}
