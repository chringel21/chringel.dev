module.exports = {
  tags: ["posts"],
  layout: "layouts/post.webc",
  permalink:
    "/blog/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.fileSlug }}/",
  eleventyComputed: {
    frontmatter: (data) => data,
    coverImage:
      "{% if frontmatter.cover.src and 'http' in frontmatter.cover.src %}{{ frontmatter.cover.src }}{% else %}./content{{ page.filePathStem | replace('index', frontmatter.cover.src) }}{% endif %}",
  },
};
