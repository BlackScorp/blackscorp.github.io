module TagPages
  class Generator < Jekyll::Generator
    priority :low

    def generate(site)
      articles = site.collections.fetch('articles').docs
      tags = articles
        .select { |article| published?(article, site.time) }
        .flat_map { |article| Array(article.data['tags']) }
        .uniq
        .sort

      tags.each do |tag|
        next unless tag.match?(/\A[a-zA-Z0-9_]+\z/)

        site.pages << generated_page(
          site,
          "blog/tags/#{tag}",
          'index.html',
          'layout' => 'tag',
          'title' => tag,
          'tag' => tag,
          'permalink' => "/blog/tags/#{tag}/"
        )

        site.pages << generated_page(
          site,
          'feed/by_tag',
          "#{tag}.xml",
          'layout' => 'feed',
          'tag' => tag,
          'permalink' => "/feed/by_tag/#{tag}.xml",
          'sitemap' => false
        )
      end
    end

    private

    def published?(article, now)
      article.data['published'] == true && article.date && article.date <= now
    end

    def generated_page(site, directory, name, data)
      Jekyll::PageWithoutAFile.new(site, site.source, directory, name).tap do |page|
        page.data.merge!(data)
      end
    end
  end
end
