---
title: "Chringel Hugo Theme"
author: Christian Engel
type: post
date: 2022-02-28
cover:
  src: feature-chringel-hugo-theme.png
  caption: chringel - A custom Hugo theme
categories:
  - Coding
  - Design
tags:
  - Hugo
  - Theme
  - Blog
series:
  - Blogging with Hugo
description: Design and implementation process behind this custom Hugo theme
---

## Look Ma! I made a Hugo theme

It's finally out there! My first custom Hugo theme made (nearly) from scratch. I say nearly, because it is based on the **awesome** [Hugo Starter Theme with Tailwind CSS](https://github.com/dirkolbrich/hugo-theme-tailwindcss-starter) made by [Dirk Olbrich](https://github.com/dirkolbrich).

You can find it on [GitHub](https://github.com/chringel21/chringel-hugo-theme), obviously!

### Tailwind CSS

As the title suggests, it uses the [tailwindcss](https://tailwindcss.com) framework. I've been using Bootstrap almost exclusively for almost always and wanted to try something new. [There are a lot of frameworks](https://github.com/troxler/awesome-css-frameworks) to choose from, ranging from [minimal](https://purecss.io), to [general purpose](https://bulma.io) to down right [weird](https://nostalgic-css.github.io/NES.css/).

Tailwind doesn't have any components like buttons, but you can very easily create custom components by [reusing styles](https://tailwindcss.com/docs/reusing-styles). Also, the documentation is top notch!

### Hugo templating

Hugo is a static site generator written in Go. This means once you create content, your whole web site will be newly built. It's just a matter of serving static files (HTML, CSS, JS).

> Hugo sites run without the need for a database or dependencies on expensive runtimes like Ruby, Python, or PHP.

Hugo's templating structure can be reduced to three "components":

- **layouts** (basic skeleton templates i.e. a single blog post or your index page)
- **partials** (small context aware components i.e. the footer or the header of a page, or how the comments section should look like)
- **shortcode** (basically templates that you can use directly inside you content files i.e. for displaying a specific tweet, or a Youtube video)

There is a really good blog series that basically covers everything from creating layouts and partials to deploying your Hugo web site. [Check it out here](https://pakstech.com/series/blog-with-hugo/).

I wanted to keep it relatively simple (for now at least), so I just created custom layouts for **single blog posts** and **lists of blog posts**, a custom **index page**.

The landing page includes a "featured post" widget, which displays the latest blog post more prominently with a big image card.

{% imagenjk "./images/featured-post.png", "Featured post" %}

#### Social icons

After having read a couple of interesting articles on font based icons libraries such as **Font Awesome** and why you [should **not** use them](https://cloudfour.com/thinks/seriously-dont-use-icon-fonts/), I wanted make the switch to SVG icons. My theme only uses a couple of icons anyway, so there's no need to load a whole icon font through a CDN or host it myself.

[Ionicons](https://ionic.io/ionicons) are a great set of utility and logo icons that are open source and free to use under MIT license. I created a little script to download the necessary icons from [unpkg.com](https://unpkg.com/ionicons@5.5.2/dist/svg/) and a custom partial to display the icon in the templates.

Currently, only logos for **Github** and **Twitter** are available, but with the help of the script, more of Ionicon's logo icons can be downloaded.

### Focus on privacy

Your data is private, and that's the way it should stay. That's why I wanted to make it possible for users of my theme to use **privacy focused** alternatives for common services.

#### Commenting system

[Isso](https://posativ.org/isso/docs/install/) is a self-hosted commenting system similar to **Disqus**, which built into Hugo by default.

You need to have an instance of Isso running on a server preferably under your control.

#### Web site analytics

[Umami](https://umami.is/docs/install) is a simple, easy to use and beautiful web analytics solution, and a great alternative to **Google Analytics**.

Umami is also self-hosted, so you need to set up your own installation.

## Future

I'm still not done. From time to time I find some quirks here and there, make some CSS optimizations and tinker with templates.

Here's what's still on my to-do list:

- A **GDPR conform banner** to inform the user about the use of cookies
- A custom CV layout that's also **ready to print** so I don't have to keep my old TeX-based CV updated
- Publish the theme to Hugo's theme list
- Shortcodes for Leaflet/MapLibre GL maps (?)
