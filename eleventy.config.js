const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { DateTime } = require("luxon");

module.exports = (eleventyConfig) => {
  // Watch targets
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginWebc, {
    components: "_includes/components/*.webc",
  });

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
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, {
      zone: zone || "Europe/Berlin",
    }).toFormat(format || "LLLL dd, yyyy");
  });
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Europe/Berlin" }).toISO();
  });

  // Passthrough
  eleventyConfig.addPassthroughCopy({
    "./public/fonts": "/fonts",
    "./node_modules/prismjs/themes/prism-okaidia.min.css":
      "/css/prism-okaidia.css",
  });

  return {
    templateFormats: ["md", "njk", "html", "webc"],

    markdownTemplateEngine: "njk",

    htmlTemplateEngine: "webc",

    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
    },
  };
};
