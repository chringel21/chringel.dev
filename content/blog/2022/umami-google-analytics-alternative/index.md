---
title: "umami - A Google Analytics Alternative For Hugo"
author: Christian Engel
type: post
date: 2022-04-28
cover:
  src: feature-umami.jpg
  caption: Free and privacy focused analytics for Hugo. [Source](https://umami.is/)
categories:
  - Coding
  - Tutorials
tags:
  - Hugo
  - Analytics
  - Privacy
  - GDPR
  - umami
  - Google Analytics
  - Self-hosted
  - Open source
  - Node.js
  - Ubersapce
series:
  - Blogging with Hugo
description: Add umami comments to your Hugo blog as an alternative to Google Analytics. It's open source and can be self-hosted.
---

I'm going to keep this post as short as my [other one](/2022/03/isso-an-alternative-commenting-system-for-hugo/) on custom comments in Hugo using [Isso](https://posativ.org/isso/). Most of the information is borrowed from [Uberspace](https://lab.uberspace.de/guide_umami/).

By default, Hugo comes with an option to enable [Google Analytics](https://gohugo.io/templates/internal/#google-analytics). But, as you might already know, I like to go with self-hosted alternatives for services ([most of the time, there is one](https://github.com/awesome-selfhosted/awesome-selfhosted)). This time, it's [umami](https://umami.is/), a privacy friendly website analytics tool.

## Installation

As this blog is [hosted on ateroids 🚀](https://uberspace.de/en/), I will be referring to their lab's installation guide mentioned above.

Follow the [installation guide](https://umami.is/docs/install). As always, _adapt the following steps to your specific setup and environment!_

1. Clone the source code to a folder of your choice and install the dependencies with `npm`
2. Create database tables (MySQL and PostgreSQL are supported)
3. Prepare an `.env` file with your database configuration and build the application
4. Setup running **umami** as a service or deamon
5. Setup a reverse proxy to access **umami**, i.e. at a subdomain like `https://analytics.my-hugo-blog.tld`

## Configuration

Once **umami** is running, [login](https://umami.is/docs/login) and _change your password_! [Add your website](https://umami.is/docs/add-a-website) to get a tracking code snippet to [collect data](https://umami.is/docs/collect-data), that we can use in a custom partial.

## Analytics partial

Hugo has an built in [internal template for Google Analytics](https://gohugo.io/templates/internal/#use-the-google-analytics-template) that is activated, once you configure your Google Analytics ID. We are going to create our own partial template to include the tracking code snippet and make it configurable.

Create a partial for your website at `layouts/partials/comments`. For this theme, I gave users the option to choose from either Google Analytics or **umami**, based on their configuration.

{% raw %}

<!-- prettier-ignore -->
```html
{{ if and .Site.GoogleAnalytics (not .Site.IsServer) }} 
  {{ template "_internal/google_analytics.html" . }}
{{/* Add support for umami website analytics */}}
  {{ else if and .Site.Params.umami.enabled (not .Site.IsServer) }}
<script
  async
  defer
  data-website-id="{{ .Site.Params.umami.websiteId }}"
  src="{{ .Site.Params.umami.jsLocation }}"
></script>
{{ end }}
```

{% endraw %}

This will check if the config paramter `GoogleAnalytics` is set. If it is, it will render the internal, standard partial for Google Analytics.

If `GoogleAnalytics` is not set, and instead `Params.umami.enabled` is true, it will render the **umami** code snippet. Your blog's config might look something like this:

```toml
[Params.umami]
  enabled = true
  websiteId = "unique-website-id"
  jsLocation = "https://analytics.my-hugo-blog.tld/umami.js"
```

That's it. You're done. Once again, you optioned against a data leech such as Google. Your website analytics are under your control now.

---

Sources:

- https://umami.is/docs/about
- https://lab.uberspace.de/guide_umami/
- https://gohugo.io/templates/internal/#use-the-google-analytics-template
