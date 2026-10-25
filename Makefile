.DEFAULT_GOAL := help

.PHONY: help start test new

help: ## Verfügbare Befehle anzeigen
	@awk 'BEGIN { FS = ":.*## "; printf "Verwendung: make <Befehl>\n\nBefehle:\n" } /^[a-zA-Z_-]+:.*## / { printf "  %-10s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

start: ## Lokale Vorschau starten
	cd jekyll && docker compose up -d

test: ## Tests im Jekyll-Container ausführen
	@output=$$(mktemp); errors=$$(mktemp); \
	if docker compose -f jekyll/docker-compose.yaml exec -T -e BLOG_PREVIEW_URL=http://127.0.0.1:4000 jekyll node --test --test-reporter=spec .github/scripts/*.test.cjs > "$$output" 2>&1; then \
		tests=$$(awk '$$2 == "tests" { print $$3 }' "$$output"); \
		printf '%s Tests erfolgreich.\n' "$$tests"; \
		rm -f "$$output" "$$errors"; \
	else \
		sed -n '/^✖ failing tests:/,$$p' "$$output" > "$$errors"; \
		if [ -s "$$errors" ]; then cat "$$errors" >&2; else cat "$$output" >&2; fi; \
		rm -f "$$output" "$$errors"; \
		exit 1; \
	fi

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
