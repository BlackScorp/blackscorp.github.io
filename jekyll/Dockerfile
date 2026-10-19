FROM ruby:3.3.4

WORKDIR /site

ENV BUNDLE_GEMFILE=/site/jekyll/Gemfile

COPY Gemfile Gemfile.lock ./jekyll/
RUN bundle install
