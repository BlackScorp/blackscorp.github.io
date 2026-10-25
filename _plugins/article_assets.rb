require 'fileutils'
Jekyll::Hooks.register :site, :post_write do |site|
  site.collections.fetch('articles').docs.each do |article|
    next unless article.data['published'] == true && article.date && article.date <= site.time

    source_dir = File.dirname(article.path)
    output_dir = File.join(site.dest, article.url.sub(%r{\A/}, ''))

    Dir.glob(File.join(source_dir, '**', '*')).each do |source|
      next unless File.file?(source)
      next if source.match?(/\.(?:md|markdown)\z/i)

      relative_path = source.delete_prefix("#{source_dir}/")
      destination = File.join(output_dir, relative_path)
      FileUtils.mkdir_p(File.dirname(destination))
      FileUtils.cp(source, destination)
    end
  end
end
