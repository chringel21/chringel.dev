// https://github.com/11ty/eleventy/issues/272#issuecomment-838571564
module.exports = class {
  data() {
    return {
      layout: "",
      permalink: false,
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    require("esbuild")
      .build({
        entryPoints: ["public/js/main.js"],
        bundle: true,
        minify: true,
        outfile: "_site/js/main.js",
      })
      .catch(() => process.exit(1));
  }
};
