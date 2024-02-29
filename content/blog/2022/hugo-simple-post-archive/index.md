---
title: "Hugo Simple Post Archive"
author: Christian Engel
type: post
date: 2022-09-02T07:38:34+02:00
image: feature.jpg
caption: A simple post archive with Hugo ([Image](https://wikipedia20.pubpub.org/pub/d26b3c1u))
categories:
  - Tutorials
  - Coding
tags:
  - Hugo
  - Archive
  - Partial
series:
  - Blogging with Hugo
description: This post covers the step how I created a simple, yet effective chronological post archive.
syndication:
  mastodon: https://fosstodon.org/web/@chringel/108928092566755708
  twitter: https://twitter.com/DeEgge/status/1565632128817238016
---

When I designed [this theme](/2022/02/chringel-hugo-theme/) I wasn't actually planning on creating an archive page. Now, a couple of months and several written posts later I figured, it might not be the worst thing to have.

In my opinion, two points speak for a blog archive:

- No clicking through the pagination necessary to find relevant content
- Having a nice overview of existing content (and what I've achieved in a year)

On top of that, with no out-of-the-box search feature available for static sites (though _possible_, looking at you, [Lunr.js](https://lunrjs.com/)), skimming through post titles may lead to surprising discoveries.

The archive layout I'm aiming at, is a **list of all posts, grouped by year**. Simple and effective.

First, we'll need a new static page. For Hugo, this will be a new [section](https://gohugo.io/content-management/sections/). It will be located in the content folder:

```
myHugoPage
└── content
    └── archive.md
```

Front matter for this file looks like this:

```yaml
---
title: "Archive"
type: archive
summary: This page contains an archive of all posts.
---
```

It's not much, but we don't need that much metadata anyway. A title to display, the type of section and a summary, if you like.

Once this file is created, you can already navigate to it. If you run your site locally, using the `hugo server` command, go to `http://localhost:1313/archive`. Depending on your default layout for single pages, it might not show much, just the title.

Time to deal with the layout.

Either in your site's layout folder, or in the layout folder of your theme, create another folder called `archive`, containing the file `single.html`.

```
myTheme
└── layout
    └── archive
        └── single.html
```

Since the section page is declared as `type: archive`, it will pick up the template file located in the `archive` folder. Here's the bare bones layout. I removed all custom styles to make it clearer.

{% raw %}

<!-- prettier-ignore -->
```go
{{ define "main" }}
  <h1>{{ .Title }}</h1>

  // Display actual content, if available 
  {{ .Content }}

  // Group all pages by year
  {{- range (.Site.RegularPages.GroupByDate "2006") -}}
    // Take only pages of type "post" into account
    {{- $posts := (where .Pages "Type" "post") -}}
    {{- $posts_count := len $posts -}}
    // .Key is the current year
    // Check if it is an actual year and it contains any posts
    {{ if and (gt .Key 1) (gt $posts_count 0) }}
      // Display the year
      <h2>{{ .Key }}</h2>
      // Create a ul element containing all posts ...
      <ul>
        // ... and iterate over all pages of type "post"
        {{ range (where .Pages "Type" "post") }}
          // Skip hidden posts
          {{ if (ne .Params.hidden true) }}
            <li>
              // Display the post's date
              <span>
                {{ .Date.Format "Jan 02" }}
              </span>
              // Display a link with the post's title
              <a href="{{ .RelPermalink }}">
                <span>{{ .Title }}</span>
              </a>
            </li>
          {{ end }}
        {{ end }}
      </ul>
    {{ end }}
  {{ end }}
{{ end }}
```

{% endraw %}

That's it! The gist is: group all pages by year, and then iterate over these page but only render actual blog posts. You can check out the result at my [archive](/archive).
