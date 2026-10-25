FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git jq \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site
