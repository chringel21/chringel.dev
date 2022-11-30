---
title: "Random Cover Image"
author: Christian Engel
type: post
date: 2022-11-29T14:10:33+01:00
cover:
  src: https://images.unsplash.com/photo-1494173962596-0ff16c1b6a81?ixid=MnwzODQzMzl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Njk3MzEyMDc&ixlib=rb-4.0.3&w=1500&h=750&crop=focalpoint&fit=crop
  caption: "Gray speaker on table near brown wooden pto (Photo by [Gabriel Beaudry](https://unsplash.com/@gbeaudry?utm_source=chringel.dev%20blog&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=chringel.dev%20blog&utm_medium=referral))"
categories:
  - Coding
  - Tutorials
tags:
  - Hugo
  - Unsplash
  - random
  - cover image
  - archetype
  - shortcode
description: I'm lazy, so I created a Hugo archetype to fetch a random blog post cover image from Unsplash.
syndication:
  twitter: https://twitter.com/DeEgge/status/1597932678266818560
  mastodon: https://fosstodon.org/@chringel/109432787279471646
---

This is a short one! A quick rundown on how I managed to get a random cover image for my blog posts when creating new content using Hugo.

## Premise

Lately I've been writing blog posts where I was struggling to find a fitting cover image. I could just omit the cover image altogether, but I think every blog post should have a cover image (it also increases the click rate on social media, but \*_sshhh_\*). So I was wondering, is there a way to get a new random cover image, each time I create new content. I was already downloading images from [Unsplash](https://unsplash.com), so why not get a random image from their API?

**You will need an [account at Unsplash](https://unsplash.com/documentation#creating-a-developer-account) to use the API.**

## Post archetype

[Archetypes in Hugo](https://gohugo.io/content-management/archetypes/#what-are-archetypes) are templates for your content files. For example for a blog post, you can use predefined values for the front matter, and even use [Hugo functions](https://gohugo.io/functions/). And more interestingly, before the front matter you can put a lot of logic to get the variables you need.

My theme's blog post front matter uses a special nested parameter to create the cover image and a caption:

<!-- prettier-ignore -->
```markdown
cover:
  src: (hyper-)link-to-an-image
  caption: image caption
```

But you can also use it with Hugo's default [image parameter](https://gohugo.io/content-management/front-matter/#predefined), all you need is the link to an image.

## Full code

```go
{{- $imageUrl := "" -}}
{{- $author := "" -}}
{{- $authorUrl := "" -}}
{{- $altDescription := "" -}}

{{- $unsplashAccessToken := getenv "HUGO_UNSPLASH_ACCESS_TOKEN" -}}
{{- $authorization := $unsplashAccessToken | printf "%s %s" "Client-ID" -}}
{{- $data := getJSON "https://api.unsplash.com/photos/random/?orientation=landscape" (dict "Authorization" $authorization) -}}

{{- with $data.urls -}}
  {{- $imageUrl = .raw -}}
{{- end -}}
{{- with $data.user -}}
  {{- $author = .name -}}
  {{- $authorUrl = .links.html -}}
{{- end -}}
{{- with $data.alt_description -}}
  {{ $altDescription = . | humanize}}
{{- end -}}
```

### Step by step explanation

First, we define four variables `$imageUrl`, `$author`, `$authorUrl` and `$altDescription`.

```go
{{- $imageUrl := "" -}}
{{- $author := "" -}}
{{- $authorUrl := "" -}}
{{- $altDescription := "" -}}
```

[Unsplash's guideline for attribution](https://help.unsplash.com/en/articles/2511315-guideline-attribution) says, you need to properly attribute the image's author coming from Unsplash. That's why we need the author's name and a link to their profile. For the image caption, we would like to use the image's description.

Next, we authorize against Unsplash's API and make a request to the [`random`](https://unsplash.com/documentation#get-a-random-photo) endpoint.

```go
{{- $unsplashAccessToken := getenv "HUGO_UNSPLASH_ACCESS_TOKEN" -}}
{{- $authorization := $unsplashAccessToken | printf "%s %s" "Client-ID" -}}
{{- $data := getJSON "https://api.unsplash.com/photos/random/?orientation=landscape" (dict "Authorization" $authorization) -}}
```

When creating a developer account, you'll receive your `Access` and `Secret` keys. **Never share either of them publicly!** I would recommend exporting your `access key` as an environment variable, i.e. `HUGO_UNSPLASH_ACCESS_TOKEN`. The next line builds the value for the authorization header, required for accessing the API. The last line sends a request and stores the response in the `$data` variable.

The last step is just assigning variables based on the JSON response object.

```go
{{- with $data.urls -}}
  {{- $imageUrl = .raw -}}
{{- end -}}
{{- with $data.user -}}
  {{- $author = .name -}}
  {{- $authorUrl = .links.html -}}
{{- end -}}
{{- with $data.alt_description -}}
  {{ $altDescription = . | humanize}}
{{- end -}}
```

Now, we can use the variables in our front matter, i.e.:

<!-- prettier-ignore -->
```
cover:
  src: {{ $imageUrl }}
  caption: "{{ $altDescription }} (Photo by [{{ $author }}]({{ $authorUrl }}?utm_source=app_name&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=app_name&utm_medium=referral))"
```

## Alternative use in a Shortcode

You could also use this snippet as a [Shortcode](https://gohugo.io/content-management/shortcodes/#what-a-shortcode-is) to generate an image based off a search term. The [`random`](https://unsplash.com/documentation#get-a-random-photo) endpoint mentioned above allows a `query` parameter, which you can pass search terms.

```go
// layout/shortcodes/random-image.html

{{- $imageUrl := "" -}}
{{- $author := "" -}}
{{- $authorUrl := "" -}}
{{- $altDescription := "" -}}
{{- $query := .Get 0 -}}

{{- $unsplashAccessToken := getenv "HUGO_UNSPLASH_ACCESS_TOKEN" -}}
{{- $authorization := $unsplashAccessToken | printf "%s %s" "Client-ID" -}}
{{- $requestUrl := $query | printf "%s%s" "https://api.unsplash.com/photos/random/?query=" -}}
{{- $data := getJSON $requestUrl (dict "Authorization" $authorization) -}}

{{- with $data.urls -}}
  {{- $imageUrl = .raw -}}
{{- end -}}
{{- with $data.user -}}
  {{- $author = .name -}}
  {{- $authorUrl = .links.html -}}
{{- end -}}
{{- with $data.alt_description -}}
  {{ $altDescription = . | humanize}}
{{- end -}}

  <figure>
    <img
      alt="{{ $altDescription }}"
      title="{{ $altDescription }}"
      src="{{ $imageUrl }}"
    />
  </figure>
  <figcaption class="text-sm italic">
    <p>{{ $altDescription }} (Photo by <a href="{{ $authorUrl }}?utm_source=app_name&utm_medium=referral">{{ $author }}</a> on <a href="https://unsplash.com/?utm_source=app_name&utm_medium=referral">Unsplash</a>)</p>
  </figcaption>
```

Use the shortcode like this:

```
{{</* random-image "sunset" */>}}
```
