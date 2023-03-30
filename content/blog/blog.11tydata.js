module.exports = {
  tags: ["posts"],
  layout: "layouts/post.webc",
  permalink:
    "/blog/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.fileSlug }}/",
};
