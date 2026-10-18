FROM ruby:3.3.4

WORKDIR /site

COPY Gemfile Gemfile.lock ./
RUN bundle install

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--force_polling"]
