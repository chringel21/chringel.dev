---
title: URL as a Sentence pt. 2 - Custom Status Page
author: Christian Engel
type: post
date: 2024-06-28T11:15:29.024+02:00
lastmod: 2024-06-28T11:15:29.024+02:00
image: https://christian.engel.is/og-image?content=writing%20a%20blog%20post%20about%20%27URL%20as%20a%20sentence%27.&emoji=%F0%9F%A4%AF
caption: Is this already inception level of self-cross-referencing?
categories:
  - Coding
description: With this post I would like to respond to Adam Newbold's take on the subject "URL as a sentence"
tags:
  - 11ty
  - serverless
# syndication:
#   mastodon: https://...
---

Earlier this year (has it really been _that_ long since I came across that post?) I read about a fascinating concept: a [URL as a sentence](https://notes.neatnik.net/2024/02/url-as-a-sentence) proposed by [Adam Newbold](https://adam.omg.lol/). What if a url, comprised of (sub)domain and path, would be a valid, informative sentence? I was really intrigued by the idea of owning a website that would automatically, only by looking at its url, convey information.

Taking the concept of having a simple **status page** a little further, I also went ahead and registered a domain, `engel.is` (I guess there's no one living in Iceland by the surname _Engel_). Adding the subdomain `christian.engel.is`, I had the base of a simple sentence. The path would be the rest of it.

I also added the ability to create a new status, and post it to Github as well, because the status has a pretty short lifespan.

Looking at the **tech stack**, this one is a simple [11ty](https://www.11ty.dev/) page. A status message is persisted in a database and can be fetched from an API, using [Eleventy Fetch](https://www.11ty.dev/docs/plugins/fetch/). Only the latest status is fetched and stored as global data available to 11ty.

```javascript
// _data/statuses.js

const EleventyFetch = require("@11ty/eleventy-fetch");
const dotenv = require("dotenv");
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

module.exports = async function () {
  try {
    return await EleventyFetch(`${API_BASE_URL}statuses?orderBy=desc&take=1`, {
      duration: "1d",
      type: "json",
    });
  } catch (e) {
    console.log("Failed fetching status, returning default", e);
    return [
      {
        content: "working on the status message API.",
        emoji: "🔧",
      },
    ];
  }
};
```

To create a page with a slug based on the content of a status, [pagination](https://www.11ty.dev/docs/pages-from-data/) is used.

{% raw %}

```html
---
pagination:
  data: statuses
  size: 1
  alias: status
permalink: "/{{ status.content | slugify }}/"
layout: layout.njk
---

<main>
  <h1>
    Christian Engel is
    <span class="status"
      >{{ status.content | lowerCaseFirstLetter }} {{ status.emoji }}</span
    >
  </h1>
</main>
```

{% endraw %}

To redirect the user from the index page `/` to whatever the current status is, the basic layout uses a meta tag with a `Refresh` instruction. And since we have the current status available as global data, it only has to be slugified.

{% raw %}

```html
<meta http-equiv="Refresh" content="0; URL={{ status | slugify }}" />
```

{% endraw %}

The API handles the creation of a new status, and it is called using a serverless function. If that call returns a successful http status, a Netlify build hook is triggered and 11ty builds a new page. Simple!

If you are wondering how the [Github profile status](https://docs.github.com/de/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/personalizing-your-profile#setting-a-status) is set, here's the magic: You can't set it using Github's REST API, but rather through their [GraphQL API](https://docs.github.com/en/graphql/reference/mutations#changeuserstatus).

Building the API and the status web page was a nice experience. And from looking at my latest status entries I can tell I'm already using it quite a bit.

https://christian.engel.is
