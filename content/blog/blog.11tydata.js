module.exports = {
  type: "post",
  permalink:
    "/blog/{{ page.date | permalink_year }}/{{ page.date | permalink_month }}/{{ page.fileSlug }}/",
};
