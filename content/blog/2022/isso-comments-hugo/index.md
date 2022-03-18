---
title: "Isso - An Alternative Commenting System For Hugo"
author: Christian Engel
type: post
date:  2022-03-17
featured_image: images/blog/2022/isso-comments-hugo.png
categories:
  - Coding
tags:
  - Hugo
  - Comments
  - Isso
  - Disqus
  - Self-hosted
  - Open source
  - Python
  - Javascript
  - Ubersapce
description: Add Isso comments to your Hugo blog as an alternative to Disqus. It's open source and can be self-hosted.
---

By default, Hugo comes with an option to enable [Disqus comments](https://disqus.com). But if you like to go for a self-hosted alternative that respects privacy of your visitors, you might want to take a look at [Isso](https://posativ.org/isso/).

## Installation

This blog is [hosted on ateroids :rocket:](https://uberspace.de/en/). They have an extensive library of tools to install (well, you have to do it yourself, but the [user contributed guides](https://lab.uberspace.de/guide_isso.html?highlight=isso) will help you along), and **Isso** is one of them.

I won't replicate the install instructions here, but it basically boils down to the following steps (*which you might want to adapt to your specific setup!*):

1. Install **Isso** via the Python package manager `pip`
2. Add a server configuration - for a full list, please see the [official server documentation](https://posativ.org/isso/docs/configuration/server/)
3. Setup running **Isso** as a service or deamon
4. Setup a reverse proxy to access **Isso**, i.e. at a subdomain like `https://comments.my-hugo-blog.tld`

## Comments partial

Once you've got **Isso** up and running, you'll need a partial to display your new commenting system.

Create one for your blog at `layouts/partials/comments.html`. For this theme, I gave users the option to choose from either Disqus or Isso, based on their configuration.

```html
{{ if and .Site.DisqusShortname (index .Params "comments" | default "true") (not .Site.IsServer) }}
<section class="comments">
	{{ template "_internal/disqus.html" . }}
</section>
{{/* Add support for ISSO comment system */}}
{{ else if .Site.Params.isso.enabled }}
  <script
      data-isso="{{ .Site.Params.isso.data }}"
      data-isso-id="{{ .Site.Params.isso.id}}"
      data-isso-css="{{ .Site.Params.isso.css }}"
      data-isso-lang="{{ .Site.Params.isso.lang }}"
      data-isso-reply-to-self="{{ .Site.Params.isso.replyToSelf }}"
      data-isso-require-author="{{ .Site.Params.isso.requireAuthor }}"
      data-isso-require-email="{{ .Site.Params.isso.requireEmail }}"
      data-isso-avatar="{{ .Site.Params.isso.avatar }}"
      data-isso-avatar-bg="{{ .Site.Params.isso.avatarBg }}"
      src="{{ .Site.Params.isso.jsLocation }}">
  </script>
  <noscript>Please enable JavaScript to view the comments powered by <a href="https://posativ.org/isso/">Isso</a>.</noscript>
  <div>
    <section id="isso-thread"></section>
  </div>
{{ end }}
```

This will check if the config paramter `DisqusShortname` is set. If it is, it will render the internal, standard partial for Disqus comments.

If `DisqusShortname` is not set, and instead `Params.isso.enabled` is true, it will render the **Isso** client. Your blog's config might look something like this:

```toml
[Params.isso]
  enabled = true
  data = "https://comments.my-hugo-blog.tld/"
  id = "thread-id"
  css = true
  lang = "en"
  replyToSelf = true
  requireAuthor = true
  requireEmail = false
  avatar = true
  avatar-bg = "#f0f0f0"
  jsLocation = "https://comments.my-hugo-blog.tld/js/embed.min.js"
```

This is basically the [client configuration](https://posativ.org/isso/docs/configuration/client/). There are more options, but please note that every additional parameter that is added to Hugo's configuration has also to be added as a `data-` tag to the partial.

As a last step, add this partial at the end of your post template. [Check out the example for this theme](https://github.com/chringel21/chringel-hugo-theme/blob/main/layouts/post/single.html#L77).

That's it. You're done. Now you've got a comment system under your control.

---

Image: [BiologeXY](https://pokemon.fandom.com/de/wiki/Benutzer:BiologeXY) on [pokemon.fandom.com](https://pokemon.fandom.com/de/wiki/Isso)

Sources: 
* https://stanislas.blog/2018/02/add-comments-to-your-blog-with-isso/
* https://lab.uberspace.de/guide_isso.html?highlight=isso
* https://gohugo.io/content-management/comments/#configure-disqus