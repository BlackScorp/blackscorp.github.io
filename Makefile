.DEFAULT_GOAL := help

.PHONY: help start new

help: ## Verfügbare Befehle anzeigen
	@awk 'BEGIN { FS = ":.*## "; printf "Verwendung: make <Befehl>\n\nBefehle:\n" } /^[a-zA-Z_-]+:.*## / { printf "  %-10s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

start: ## Lokale Vorschau starten
	cd jekyll && docker compose up -d

new: ## Neuen Beitrag anlegen (TITLE="Mein Beitrag")
	@title='$(TITLE)'; \
	if [ -z "$$title" ]; then printf 'TITLE fehlt. Beispiel: make new TITLE="Mein Beitrag"\n' >&2; exit 1; fi; \
	slug=$$(printf '%s' "$$title" | iconv -f UTF-8 -t ASCII//TRANSLIT | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$$//g'); \
	if [ -z "$$slug" ]; then printf 'Aus TITLE konnte kein Linktitel erzeugt werden.\n' >&2; exit 1; fi; \
	number=$$(printf '%s\n' _articles/* | sed 's|.*/||' | awk -F. '/^[0-9]+\./ { if ($$1 > max) max = $$1 } END { print max + 1 }'); \
	directory="_articles/$$number.$$slug"; \
	if [ -e "$$directory" ]; then printf '%s existiert bereits.\n' "$$directory" >&2; exit 1; fi; \
	mkdir -p "$$directory"; \
	sed -e "s|Titel des Beitrags|$$title|" -e "s|ARTICLE_SLUG|$$slug|" jekyll/article-template.md > "$$directory/index.md"; \
	printf '%s\n' "$$directory/index.md"
