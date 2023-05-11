const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const svgSprite = require("eleventy-plugin-svg-sprite");
const { DateTime } = require("luxon");
const { data } = require("autoprefixer");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const filters = require("./_includes/utils/filters.js");

module.exports = (eleventyConfig) => {
  // Watch targets
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
    templateFormats: ["md"],
  });
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      "_includes/components/**/*.webc",
      "npm:@11ty/eleventy-img/*.webc",
    ],
  });
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    // Set global default options
    formats: ["avif", "webp", "auto"],
    widths: [500, 800, 1200, 1500, "auto"],
    urlPath: "/img/",
    sharpOptions: {
      animated: true,
    },

    // Notably `outputDir` is resolved automatically
    // to the project output directory
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });
  eleventyConfig.addPlugin(svgSprite, {
    path: "./public/svg",
    outputFilepath: "./_site/sprites/icons.svg",
  });
  eleventyConfig.addPlugin(pluginRss);

  // App plugins
  eleventyConfig.addPlugin(require("./eleventy.config.images.js"));

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Custom collection for all posts
  eleventyConfig.addCollection("allPostsReverse", (collectionApi) => {
    return collectionApi
      .getAllSorted()
      .reverse()
      .filter((item) => item.data.type === "post");
  });

  // Passthrough
  eleventyConfig.addPassthroughCopy({
    "./public/fonts": "/fonts",
    "./node_modules/prismjs/themes/prism-okaidia.min.css":
      "/css/prism-okaidia.css",
  });

  // markdown-it
  const markdownItOptions = {
    html: true,
  };
  const markdownItAnchorOptions = {
    permalink: markdownItAnchor.permalink.linkAfterHeader({
      class: "unset italic text-xl",
      style: "aria-label",
      assistiveText: (title) => `Permalink to “${title}”`,
      visuallyHiddenClass: "hidden",
      wrapper: ['<div class="heading">', "</div>"],
      placement: "before",
    }),
  };
  const markdownLib = markdownIt(markdownItOptions)
    .use(markdownItAnchor, markdownItAnchorOptions)
    });

  eleventyConfig.setLibrary("md", markdownLib);

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
