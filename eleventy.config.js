const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const eleventyNavigation = require("@11ty/eleventy-navigation");

module.exports = (eleventyConfig) => {
  // Wath targets
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(pluginBundle);

  // App plugins
  eleventyConfig.addPlugin(require("./eleventy.config.images.js"));

  // Filters
  eleventyConfig.addFilter("permalink_year", (dateObj) =>
    dateObj.getFullYear()
  );
  eleventyConfig.addFilter("permalink_month", (dateObj) =>
    String(dateObj.getMonth() + 1).padStart(2, "0")
  );
  eleventyConfig.addFilter("permalink_day", (dateObj) =>
    String(dateObj.getDay()).padStart(2, "0")
  );
  // Passthrough
  eleventyConfig.addPassthroughCopy({
    "./public/fonts": "/fonts",
  });

  return {
    templateFormats: ["md", "njk", "html"],

    markdownTemplateEngine: "njk",

    htmlTemplateEngine: "njk",

    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
    },
  };
};
