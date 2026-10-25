FROM ruby:3.3.4

WORKDIR /site

ENV BUNDLE_GEMFILE=/site/jekyll/Gemfile

RUN apt-get update \
    && apt-get install -y --no-install-recommends jq nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./jekyll/
RUN bundle install
