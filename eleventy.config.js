module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("permalink_year", (dateObj) =>
    dateObj.getFullYear()
  );
  eleventyConfig.addFilter("permalink_month", (dateObj) =>
    String(dateObj.getMonth() + 1).padStart(2, "0")
  );
  eleventyConfig.addFilter("permalink_day", (dateObj) =>
    String(dateObj.getDay()).padStart(2, "0")
  );

  return {
    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
    },
  };
};
