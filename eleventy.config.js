const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const svgSprite = require("eleventy-plugin-svg-sprite");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const { minify } = require("terser");
const path = require("path");

const filters = require("./_includes/utils/filters.js");
const collections = require("./_includes/utils/collections.js");

module.exports = (eleventyConfig) => {
  // Watch targets
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(pluginBundle, {
    transforms: [
      async function (content) {
        if (this.type === "js" && process.env.ELEVENTY_ENV === "production") {
          const minified = await minify(content);
          return minified.code;
        }
        return content;
      },
    ],
  });
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

  // Custom collection for all posts, notes, etc.
  Object.keys(collections).forEach((collection) => {
    eleventyConfig.addCollection(collection, collections[collection]);
  });

  // Passthrough
  eleventyConfig.addPassthroughCopy({
    "./public/fonts": "/fonts",
    "./public/img": "/img",
    "./node_modules/prismjs/themes/prism-okaidia.min.css":
      "/css/prism-okaidia.css",
    "./node_modules/speedlify-score/speedlify-score.css":
      "/css/speedlify-score.css",
    "./node_modules/speedlify-score/speedlify-score.js":
      "/js/speedlify-score.js",
    "./static/.htaccess": "/.htaccess",
    "./static/site.webmanifest": "/site.webmanifest",
    "./static/browserconfig.xml": "/browserconfig.xml",
    "./static/robots.txt": "/robots.txt",
    "./admin": "/admin",
    "./static/admin.css": "/admin.css",
  });

  // markdown-it
  const markdownItOptions = {
    html: true,
    linkify: true,
  };
  const markdownItAnchorOptions = {
    permalink: markdownItAnchor.permalink.linkAfterHeader({
      class: "hidden",
      style: "aria-label",
      assistiveText: (title) => `Permalink to “${title}”`,
      visuallyHiddenClass: "hidden",
      wrapper: ['<div class="heading">', "</div>"],
      placement: "before",
    }),
  };
  const markdownLib = markdownIt(markdownItOptions)
    .use(markdownItAnchor, markdownItAnchorOptions)
    .use(markdownItEleventyImg, {
      imgOptions: {
        widths: [500, 800, 1200, 1500, "auto"],
        urlPath: "/img/",
        outputDir: "./_site/img/",
        formats: ["avif", "webp", "auto"],
        sharpOptions: {
          animated: true,
        },
      },
      globalAttributes: {
        decoding: "async",
        loading: "lazy",
        sizes: "100vw",
      },
      renderImage(image, attributes) {
        const [Image, options] = image;
        const [src, attrs] = attributes;

        Image(src, options);

        const metadata = Image.statsSync(src, options);
        const imageMarkup = Image.generateHTML(metadata, attrs, {
          whitespaceMode: "inline",
        });

        return `<figure>${imageMarkup}${
          attrs.title
            ? `<figcaption>${markdownIt().render(attrs.title)}</figcaption>`
            : ""
        }</figure>`;
      },
      resolvePath: (filepath, env) =>
        path.join(path.dirname(env.page.inputPath), filepath),
    });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.on("eleventy.beforeWatch", (changedFiles) => {
    if (!changedFiles.some((filePath) => filePath.includes("./_layouts"))) {
      console.log("🤠 Component files updated -- coercing layout reload.");
      exec("find _layouts/*.webc -type f -exec touch {} +");
    }
  });

  return {
    templateFormats: ["md", "njk", "html", "webc", "11ty.js"],

    markdownTemplateEngine: "njk",

    htmlTemplateEngine: "html",

    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
    },
  };
};
