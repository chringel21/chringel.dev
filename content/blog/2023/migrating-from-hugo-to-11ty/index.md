---
title: "Migrating from Hugo to Eleventy (11ty)"
author: Christian Engel
type: post
date: 2023-06-30T09:49:29+01:00
lastmod: 2023-06-30T09:49:29+01:00
cover:
  src: feature.png
  caption: "**Leaving Hugo for 11ty** (Original: *Joshua Reynolds*, David Garrick Between Tragedy and Comedy, 1761 - [Wikipedia](https://en.wikipedia.org/wiki/David_Garrick_Between_Tragedy_and_Comedy))"
categories:
  - Coding
tags:
  - 11ty
  - Hugo
description: This post describes my journey of migrating my blog from Hugo to Eleventy (11ty)
syndication:
  twitter: ...
  mastodon: ...
---

I've been building this blog with Hugo for around one and a half years ([January 3rd 2022](/2022/01/hello-world-part-ii-the-return-of-hugo/), to be precise) and even created a [custom](/2022/02/chringel-hugo-theme/) [theme](https://github.com/chringel21/chringel-hugo-theme). But lately I was getting bored with all the releases Hugo throws at you. Beginning with 0.91.0, Hugo is now at 0.115.0 🤯. I was already hesitant to go beyond 0.100.0, but now I can't take it anymore. So I've decided to migrate my blog from Hugo to [11ty](https://www.11ty.dev/).

At first I gave [Astro](https://astro.build/) a shot, but failed to move forward, because of the lacking image support. Astro recently introduced it's [Optimized Asset Support](https://docs.astro.build/en/guides/assets/). But even that meant a lot of unnecessary moving images and changing image references in Markdown files. So **11ty** it was.

**Heads up:** This is not meant as a step by step tutorial to migrate from Hugo to 11ty, but rather an opinionated list of steps it took me, to make the switch. I always recommend consulting the _excellent_ [official 11ty documentation](https://www.11ty.dev/docs/). But also feel free to ask questions via [mail](/contact) or webmentions.

## Migration plan

I made a list of things that the new site should absolutely have, some things that were OK to have and things that I considered not useful anymore.

**Must haves**:

- URIs of posts and pages should remain intact
- No moving around of images that belong to a post
- RSS feed and sitemap
- Umami website statistics
- Keep _Indieweb_ capabilities

**Nice to haves**:

- New theme
- Optimized loading speed, less assets
- Keep taxonomies (categories, tags, series)

**I can live without**:

- Commenting system

## Content organization

By default, 11ty is pretty [minimalistic](https://www.11ty.dev/docs/glossary/#zero-config) with it's configuration. The first thing I did was create a [collection](https://www.11ty.dev/docs/collections/). Although it's possible to create a collection based on tags (which are treated differently in 11ty than in Hugo and other blogging-like platforms), I went for an advanced approach: [custom filtering](https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting).

All of my blog posts have a common frontmatter attribute, `type: post`, by which I was able to filter all content entries.

```js
eleventyConfig.addCollection("allPosts", (collectionApi) => {
  return collectionApi
    .getAllSorted()
    .filter((item) => item.data.type === "post");
});
```

## Permalinks

Permalinks are mapped from the file system, unless you override them. My post links have the following pattern: `/{year}/{month}/{slug}`. When going through my old Hugo configuration, I noticed a glaring mistake I made: Even though my content in the file system looks like this `/blog/{year}/{slug}`, my permalinks were missing the leading `/blog` path. I came up with the following solution: blog posts created after the last one that was published using the Hugo site, should receive a new permalink, including the `/blog` path. You can override the permalink for each entry using a [directory data file](https://www.11ty.dev/docs/data-template-dir/). So for my blog content, I created a file called `blog.11tydata.js`, where you can define the permalink for each entry, even based on the content's data.

```js
// content/blog/blog.11tydata.js

const slugify = require("slugify");

module.exports = {
  permalink: (data) => {
    const year = String(data.page.date.getFullYear());
    const month = String(data.page.date.getMonth() + 1).padStart(2, "0");
    const slugifiedTitle = slugify(data.title, {
      lower: true,
      strict: true,
    });
    if (data.page.date > new Date("2023-02-21T12:00:00")) {
      return `/blog/${year}/${month}/${slugifiedTitle}/`;
    }
    return `/${year}/${month}/${slugifiedTitle}/`;
  },
};
```

## Images

My post entries are organized using Hugo's [page bundle](https://gohugo.io/content-management/page-bundles/) structure. A post is a named folder containing an `index.md` with the actual content and any additional files. In my case, these are mostly images, that I can reference in the Markdown file:

```md
![My awesome image](./image.png "Alt image caption")
```

To get it working, I needed two things:

1. The official [11ty image plugin](https://www.11ty.dev/docs/plugins/image/)
2. A plugin for 11ty's markdown processor _markdown-it_, aptly called [markdown-it-eleventy-img](https://github.com/solution-loisir/markdown-it-eleventy-img)

The 11ty image plugin allows for "build-time image transformations", while outputting multiple formats and sizes. The markdown-it plugin on the other hand let's you resolve the path to images relative to it's corresponding markdown file.

Here's the necessary excerpt from the [documentation](https://github.com/solution-loisir/markdown-it-eleventy-img#resolving-path):

```js
// eleventy.config.js

const markdownIt = require("markdown-it");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const path = require("path");

eleventyConfig.setLibrary(
  "md",
  markdownIt.use(markdownItEleventyImg, {
    resolvePath: (filepath, env) =>
      path.join(path.dirname(env.page.inputPath), filepath),
  })
);
```

Also, I wanted the `title` attribute associated with markdown image syntax to be rendered as a `<figcaption>` HTML element. `renderImage` allows for creation of custom markup:

```js
// eleventy.config.js

const markdownIt = require("markdown-it");
const markdownItEleventyImg = require("markdown-it-eleventy-img");

eleventyConfig.setLibrary(
  "md",
  markdownIt.use(markdownItEleventyImg, {
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
  })
);
```

So writing this in markdown:

```md
![My awesome image](./image.png "Alt image caption")
```

will return this markup:

```html
<figure>
  <picture>
    <source ... />
    <img
      alt="Alt image caption"
      title="My awesome image"
      src="..."
      width="..."
      height="..."
    />
  </picture>
  <figcaption>
    <p>My awesome image</p>
  </figcaption>
</figure>
```

## RSS feed and sitemap

Before I'll explain my approach to building a RSS feed and sitemap, I need to mention that I wanted to build my theme using the [WebC template language](https://www.11ty.dev/docs/languages/webc/) that 11ty supports.

Sadly, with WebC in 11ty it is currently not possible to create valid XML files beginning with the XML prolog. There's a [open issue on Github](https://github.com/11ty/webc/issues/102) and contributions are welcome.

So, for the feed, I went for a standard Nunjucks file, based on the [documentation](https://www.11ty.dev/docs/plugins/rss/#sample-feed-templates).

The sitemap on the other hand doesn't require a XML prolog, and writing it in WebC was very easy:

```html
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---

<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url webc:for="(key, value) in collections.all">
    <loc @text="metadata.url + value.url"></loc>
    <lastmod @text="htmlDateString(value.date)"></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

The filter `htmlDateString(date)` creates an HTML date string (🙄), i.e. `2023-06-30T10:49:29.000+02:00`.

## Umami Analytics

[Umami Analytics]() just needs a single JavaScript asset to be loaded, but only when in "production mode", meaning when building the site.

I added an environment variable to my development process, to be able to distinguish between DEV and PROD.

```json
// package.json
{
  "scripts": {
    "start": "ELEVENTY_ENV=development npx @11ty/eleventy --serve --port 3000",
    "build": "ELEVENTY_ENV=production npx @11ty/eleventy"
  }
}
```

Then I added a global 11ty data object available to my templates.

```js
// build.js
module.exports = {
  env: process.env.ELEVENTY_ENV,
  umami: {
    websiteId: "1234-abcd-5678-efgh",
    jsLocation: "https://umami.mysite.tld/umami.js",
  },
};
```

```html
<head>
  <script
    webc:if="build.env === 'production'"
    webc:keep
    async
    defer
    :data-website-id="build.umami.websiteId"
    :src="build.umami.jsLocation"
  ></script>
</head>
```

## New theme

I wanted to give the site a fresh look, so I decided to get some inspiration from other themes. One Astro theme in particular caught my eye, and that's [Dinesh Pandiyan](https://github.com/flexdinesh)'s [Blogster Bubblegum](https://github.com/flexdinesh/blogster). It's sleek design and bright colors might stand in contrast to my old theme, but what can I say - I like it! And that's a good enough reason to port it to 11ty and WebC.

It uses [Tailwind CSS](https://tailwindcss.com/docs/installation), just as my old theme did. Getting Tailwind to work with 11ty is not that hard, I just had to follow the [PostCSS installation guide](https://tailwindcss.com/docs/installation/using-postcss).
