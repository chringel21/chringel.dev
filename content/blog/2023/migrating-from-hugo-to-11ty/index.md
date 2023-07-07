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

## Migration plan

I made a list of things that the new site should absolutely have, some things that were OK to have and things that I considered not useful anymore.

**Must haves**:

- URIs of posts and pages should remain intact
- No moving around of images that belong to a post
- XML feed and sitemap
- Keep _Indieweb_ capabilities
- Umami website statistics

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
...

![My awesome image](./image.png "Alt image caption")

...
```
