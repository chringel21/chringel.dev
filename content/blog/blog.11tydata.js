module.exports = {
  tags: ["posts"],
  layout: "layouts/base.njk",
  permalink:
    "/blog/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.fileSlug }}/",
};
