const Image = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {
  // Eleventy Image shortcode
  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addShortcode("image", async function (src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [500],
      urlPath: "/img/",
      outputDir: "./_site/img/",
      formats: ["avif", "webp", "auto"],
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  eleventyConfig.addShortcode("imageUrl", function (src) {
    if (src.includes("http")) {
      return src;
    }

    Image(src, {
      widths: [500],
      urlPath: "/img/",
      outputDir: "./_site/img/",
      formats: ["webp"],
    });
    let metadata = Image.statsSync(src, options);

    return metadata.webp[0].url;
  });
};
