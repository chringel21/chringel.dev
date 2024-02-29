---
title: "11ty Quick Tip: Minify inline JavaScript in WebC"
author: Christian Engel
type: post
date: 2023-11-10T09:10:57.709+01:00
lastmod: 2023-11-10T09:10:57.709+01:00
image: feature.png
caption: Lets compress some JS! Original image by [pikist.com](https://www.pikist.com/free-photo-innth/de).
categories:
  - Coding
tags:
  - 11ty
  - JavaScript
  - WebC
description: For when you need to minify your WebC JavaScript
syndication:
  mastodon: https://fosstodon.org/@chringel/111385587417297521
---

This is a short one, folks!

Eleventy's [WebC plugin](https://www.11ty.dev/docs/languages/webc/) allows for "component-driven, cache-friendly page-specific JavaScript", meaning, if a component is used on a page and it incorporates JavaScript, that block of code will only be loaded for that specific page.

That's great and all, but once you've written component level JavaScript, it just sits there in all it's glory, full of indentations, line breaks and long variable names. We need to minify it to squeeze every little (K)Byte out of it to save some bandwidth.

The WebC plugin in itself depends on the _Eleventy plugin bundle_, which has a `transforms` config option. `transforms` allows us to manipulate the content being parsed by the plugin bundle. We can, for example, call the `minify` method from the [terser](https://www.npmjs.com/package/terser) package, if the content's type is, you guessed it, JavaScript.

```javascript
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const { minify } = require("terser");

module.exports = (eleventyConfig) => {
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
};
```
