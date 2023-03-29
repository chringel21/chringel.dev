module.exports = {
  tags: ["posts"],
  layout: "layouts/post.njk",
  permalink:
    "/blog/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.fileSlug }}/",
};
