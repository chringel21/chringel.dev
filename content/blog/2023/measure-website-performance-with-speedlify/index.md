---
title: "Measure your website's performance with Speedlify"
author: Christian Engel
type: post
date: 2023-11-02T18:52:02.245+01:00
lastmod: 2023-11-02T18:52:02.245+01:00
cover:
  src: feature.png
  caption: Four hundos, that's what I like to see!
categories:
  - Coding
tags:
  - 11ty
  - Speedlify
description: Zach Leatherman told me, I could add Lighthouse scores to my site's footer. And so I did.
# syndication:
#   mastodon:
---

The first time I visited [Max Böck's website](https://mxb.dev/) I noticed a little something down in the footer: **Lighthouse scores** 🟢💯. If you reduce your site's footprint to get four [hundos](https://www.urbandictionary.com/define.php?term=hundo) you also receive bragging rights, I guess.

Clicking around I discovered the tool behind it is [Speedlify](https://www.zachleat.com/web/speedlify/), developed by [Zach Leatherman](https://www.zachleat.com/), creator of **11ty**.

Sadly, I couldn't get it to work on Uberspace, where this blog is hosted. So I turned to Netlify, which I hadn't touched upon yet.

## Setup Speedlify as a service

Here are the steps I took to get an instance of Speedlify up and running:

- Fork the [repo](https://github.com/zachleat/speedlify/)
- [Configure this site](https://github.com/chringel21/speedlify/commit/fe6064f0ac35a80c326c9ffb06eb24891762039f) to be benchmarked
- Deploy to Netlify
- Add a subdomain and register it as a CNAME at my registration service

That was super easy and only took me a couple of minutes, maybe one hour in total, to get comfortable with Netlify 🤯.

I also added a build hook so I could trigger a build remotely, i.e. via CRON from my Uberspace.

## Add Lighthouse scores to my site

Benchmarking the site was only the first step. Next up was displaying the data on my site. Conveniently enough, Zach Leatherman also has a solution for that. Enter the [`<speedlify-score>` web component](https://www.zachleat.com/web/lighthouse-in-footer/).

I just had to follow the guide outlined in the [repository's README](https://github.com/zachleat/speedlify-score/):

- `npm install speedlify-score`
- Include assets (`speedlify-score.{js,css}`)
- Add markup `<speedlify-score>` providing the required attributes

Using 11ty's [`<is-land>` component](https://www.11ty.dev/docs/plugins/partial-hydration/) I was able to delegate fetching the data and displaying it to only when the component enters the viewport. **Save those KBs** 💾!

See the result at the bottom of the page.
