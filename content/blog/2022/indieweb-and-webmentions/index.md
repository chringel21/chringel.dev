---
title: "Indiewebify me! And don't forget my webmentions!"
author: Christian Engel
type: post
date: 2022-07-22
cover:
  src: feature.png
  caption: Looks like a nice new seat pattern for the Berlin public transport agency ([BVG](https://www.rbb24.de/panorama/beitrag/2022/07/berlin-bvg-neues-muste-sitze.html))
categories:
  - Coding
  - Report
tags:
  - IndieWeb
  - microformats
  - Webmention
  - Hugo
  - IndieAuth
  - Web Sign-In
  - POSSE
  - Backfeed
  - brid.gy
  - syndication
  - silo
description: This describes my experiences in getting my website into the IndieWeb, adding microformats, Webmentions and how I sometimes struggled with all of it.
---

I actually can't recall anymore, what got me started with this whole **IndieWeb** thing. According to my browser history, I visited [IndieWeb.org](https://indieweb.org) on June 15, 2022, so around a month ago. I read up on **Miriam Suzanne**'s hugely popular post [Am I on the IndieWeb Yet?](https://www.miriamsuzanne.com/2022/06/04/indiweb/) and searched Google for "hugo indieweb" in the hopes there was some kind of [recipe](https://jlelse.blog/micro/2021/05/indieweb-recipe) to get me started on my static page (I'm a developer and after all \*_let's say it all together_\* developers are lazy).

There wasn't THE ONE answer I was hoping for, but instead lot's and lot's of blog posts by people describing their way of getting into the IndieWeb. I was overwhelmed and intrigued at the same time, so I let it rest for a couple of days - four, to be exact. The afternoon of June 20, 2022, I went deep, even deeper than [Jamiroquai](https://www.youtube.com/watch?v=QjcA2xSH25Y), into the rabbit hole that is **The IndieWeb**. Let's retrace my steps through said browser history and commits.

## What's IndieWeb?

> The IndieWeb is a people-focused alternative to the 'corporate web'. - [IndieWeb.org](https://indieweb.org)

That's what it says on the cover. It's about owning your content, sharing your thoughts and ideas in one place and then syndicating it to other (social) platforms. What if Twitter, for example, will be bought by a stupidly rich philanthropist who decides to shut it down? Where will all your tweets go?

In my opinion, your Twitter or your Facebook profile should not be your digital identity, owned by a tech company. You should be the sole owner of the content you share online. And that's what IndieWeb encourages people to do.

## How does it work?

Alright, from here on, I'll be outlining which steps I took, to make my website ready for the IndieWeb.

I already owned a domain and space to host a site, so that's a given, though I wasn't aware of it being an actual requirement to "become a citizen of the IndieWeb". I first stumbled upon **Amit Gawande**'s post [IndieWebify Your Hugo Website](https://www.amitgawande.com/2018/02/10/204300.html), because this site is also generated using Hugo. I actually [wrote the theme myself](/2022/02/chringel-hugo-theme/), so making changes to it's markup wouldn't be a problem.

### 1. Set up Web Sign In

In order to authenticate yourself as the owner of your website using your domain, you will need to set up means to sign in via [IndieAuth](https://indieweb.org/IndieAuth). That means you use your domain to verify yourself as the owner of your other social profiles.

Just add a `rel=me` [microformat](http://microformats.org/wiki/rel-me) to all your links leading to your profiles on other platforms. That's actually the first thing I changed and made a [commit](https://github.com/chringel21/chringel-hugo-theme/commit/0996a9116fd40ba0c283a3164349828df9e78952#diff-96762550561f76f989ced99c4a0751e94696682490ee94b2d77a66377c9619eb) for.

**Hint: All code excerpts are reduced to a minimal working example.**

```html
<div>
  {{ range .Site.Menus.social }}
  <a rel="me" href="{{ .URL }}" title="{{ .Name }}"> {{ .Name }} </a>
  {{ end }}
</div>
```

Next, [I added an authorization endpoint](https://github.com/chringel21/chringel-hugo-theme/commit/c4221beea4a79c874a788d544cb32fadba919ebc) to validate my identity. There are different services, but [IndieAuth.com](https://indieauth.com/) seems to be the go to solution.

<!-- prettier-ignore -->
```html
{{ with .Site.Params.indieweb }}
  <link
    rel="authorization_endpoint"
    href="{{ .authorizationEndpoint | default "https://indieauth.com/auth" }}"
  />
  <link
    rel="token_endpoint"
    href="{{ .tokenEndpoint | default "https://tokens.indieauth.com/token" }}"
  />
{{ end }}
```

I also read about it on **Ana Ulin**'s post [Using Your Site As Your Login](https://anaulin.org/blog/using-your-site-as-your-login-indieauth/). I went back to her [posts about IndieWeb](https://anaulin.org/tags/indieweb/) a couple of times during my journey.

### 2. Add author markup

Next step was to actually provide some basic information about myself, on my website. Sure, I already had an [About page](/about), but that's not machine readable. The `h-card` [microformat](http://microformats.org/wiki/h-card#Properties) provides properties that can be parsed. [Here's the commit](https://github.com/chringel21/chringel-hugo-theme/commit/19f0efa61cb8fec6fbd63b689a733a263ee10f72).

<!-- prettier-ignore -->
```html
<div class="h-card">
  <p>
    <a class="u-url" href="{{ .Site.BaseURL }}">{{ .Site.Title }}</a>
    {{ with .Site.Params.Hcard.Avatar }}
      <img class="u-photo" alt="" src="{{ . | absURL }}" />
    {{ end }}
    <span class="p-name" rel="me">
      {{ .Site.Params.Hcard.FullName }}
    </span>
  </p>
  {{ with .Site.Params.Hcard.Biography }}
    <p>
      <span class="p-note">{{ . | markdownify }}</span>
    </p>
  {{ end }}
</div>
```

Again, this is a minimal example. There are many more properties that can be added. This is where I found [IndieWebify.me](https://indiewebify.me/), a nice guide to check whether your site is ready for the IndieWeb.

![Valid `h-card` parsed by IndieWebify.me](images/h-card.png "Valid `h-card` entry parsed by IndieWebify.me")

### 3. Add content markup

If you want to publish content on the IndieWeb, it has to be machine readable as well. I added more markup, this time to my post templates. That's the `h-entry` [microformat](http://microformats.org/wiki/h-entry). IndieWebify.me was a huge helper for this step. A [couple](https://github.com/chringel21/chringel-hugo-theme/commit/1481e3b0f2a72fdee9a7704c89c8afe87f79b7fd) [of](https://github.com/chringel21/chringel-hugo-theme/commit/a4a87731911c69e6b245444a1ad1935fc6694a81) [commits](https://github.com/chringel21/chringel-hugo-theme/commit/5e8589a95525ec7663c939c98dbcc8e14006795f) and [iterations](https://github.com/chringel21/chringel-hugo-theme/commit/522417c2db77275b51874a6f8f52eb6614c08a29) later, my content was recognized correctly.

In this example, I add the following `h-entry` properties:

- `p-name` - the post's title
- `e-content` - the post's content
- `p-author` - who wrote the post
- `dt-published` - when the post was published
- `u-url` - the permalink to the post
- `p-category` - categories or tags for the post

<!-- prettier-ignore -->
```html
{{ define "main" }}
  <article class="h-entry">
    <h1 class="p-name">{{ .Title }}</h1>
    <p class="e-content">{{ .Content }}</p>
    <div>
      <span>Posted By:</span>
      <a rel="author" class="p-author h-card" href="{{ "about" | relURL }}">
        {{ .Params.author }}
      </a>
    </div>
    <div class="pb-2">
      <span>Posted:</span>
      <time class="dt-published" datetime="{{ .PublishDate.Format "January 2, 2006" }}">
        <a class="u-url" href="{{ .Permalink }}">{{ $publishDate }}</a>
      </time>
    </div>
    <div class="pb-2">
      <span>Categories:</span>
      {{ range $idx, $category := . }}
        {{- if ne $idx 0 }}{{ end }}
        <a class="p-category" href="{{ "categories/" | relURL }}{{ $category | urlize }}">
          {{ $category }}
        </a>
      {{- end }}
    </div>
  </article>
{{ end }}
```

![Valid `h-entry` parsed by IndieWebify.me](images/h-entry.png "Valid `h-card` parsed by IndieWebify.me")

At this point, my content is correctly marked up to be consumed by the IndieWeb. This was all relatively easy. The next step was a little bit more challenging, because it meant working on the backend.

### 4. Add Webmentions

After I read **Fundor 333**'s post [How I implement Indieweb, Webmention and H Entry in My Blog](https://fundor333.com/post/2022/indieweb-webmention-and-h-entry-in-my-blog/) I was wondering: _What are Webmentions?_

[Webmentions](https://indieweb.org/Webmention) are a W3C recommendation for conversations and interactions across websites. It's a simple way to notify an URL when it is mentioned i.e. by me or on my site. It is basically a way of interacting with other people's content from your website.

**For example**: I read a super interesting post on another blog and I want to reply to it, or show my appreciation by reacting to it. I can do that, by writing a post on my site, referencing that other post and add markup indicating this is a response or a like. I can then send a Webmention to that other blog, telling it I reacted to it from my website.

Sounds complicated? Well, it's just like Twitter, where you react to a tweet by commenting or liking it.

I found out there's an easy way to set up Webmentions: [Webmention.io](https://webmention.io/), written and maintained by [Aaron Parecki](https://aaronparecki.com/). It's a service that handles Webmentions, simply by using Web Sign-In and adding some endpoints as links to your website.

This would work perfectly as kind of a plug-and-play solution for my theme for others to use. But I'm more the guy who likes to self-host stuff. The [list of publisher services on indieweb.org](https://indieweb.org/Webmention#Publisher_Services) has some alternatives for sending and receiving Webmentions. I settled with [Go-Jamming](https://github.com/wgroeneveld/go-jamming) by **Wouter Groeneveld**. It's a really well written replacement for Webmention.io. Also his post [Host your own webmention receiver](https://brainbaking.com/post/2021/05/beyond-webmention-io/) was most helpful.

After Go-Jamming was running on my server, I [added the Webmention endpoints](https://github.com/chringel21/chringel-hugo-theme/commit/2221490cb96e86640ad2c83da9489ca391e07094).

```html
<link rel="webmention" href="https://jam.chringel.dev/webmention" />
<link rel="pingback" href="https://jam.chringel.dev/pingback" />
```

Now all that was missing was a way to display them. I read through several blog posts how to render Webmentions in a static site: **Jessica Smith**'s post [How I Integrated Webmentions Into My Hugo Static Site](https://www.jayeless.net/2021/02/integrating-webmentions-into-hugo.html), **Keith Grant's** post [Adding Webmention Support to a Static Site](https://keithjgrant.com/posts/2019/02/adding-webmention-support-to-a-static-site/) and of course **Wouter Groeneveld**'s post that I already mentioned.

[Two](https://github.com/chringel21/chringel-hugo-theme/commit/b358ef3687ea9752f382ddfb94ab65c66cf7b00c) [commits](https://github.com/chringel21/chringel-hugo-theme/commit/45e4a4076ae2e90458ae5c314c8e76ae91b22d34) later I had markup for displaying **responses** (as in comments) and **reactions** (as in favorites, reposts...).

My current (semi-automatic) workflow for parsing Webmentions goes like this:

1. (Watch the feed for incoming Webmentions at `https://jam.chringel.dev/feed/`)
2. When my site is built with Github Actions, fire up a simple `node.js` script to fetch Webmentions as JSON from the API
3. Hugo processes the JSON file while building my site

### 5. Syndication and Backfeed

One last peace to the puzzle were two terms I came across while reading all those posts that seemed to belong together: [POSSE](https://indieweb.org/POSSE) and [backfeed](https://indieweb.org/backfeed).

The first means publishing your content on your own site first, and then post links on other (social) platforms (**P**ublish on your **O**wn **S**ite, **S**yndicate **E**lsewhere), for example tweeting about your post with a link to your site.

The latter describes the process of pulling in interactions of your POSSE copies to the original post. So, if someone comments on a tweet with the link to your post, it actually gets reverse syndicated to your site as a Webmention.

[Adding syndication markup](https://github.com/chringel21/chringel-hugo-theme/commit/9c029939db09281f6d99637a3de8d4b3411d30ba) is easy, it's just another [microformat](http://microformats.org/wiki/h-entry#u-syndication).

<!-- prettier-ignore -->
```html
{{ with .Params.syndication }}
  {{ range $silo, $url := . }}
    <a href="{{ $url }}" class="u-syndication" rel="syndication">{{ title $silo }}</a>
  {{ end }}
{{ end }}
```

And add the links where you syndicated your post in the front matter.

<!-- prettier-ignore -->
```md
---
...
syndication:
  mastodon: https://fosstodon.org/web/@chringel/...
  twitter: https://twitter.com/DeEgge/status/...
...
---
```

To achieve backfeed, I use a service called [brid.gy](https://brid.gy/). Once you are authenticated "Bridgy polls your silo posts, discovers original post links, and sends comments to those links as webmentions" ([How to use](https://indieweb.org/Bridgy#How_to_use)). It automatically scrapes your site and checks links in your tweets or toots if they have a Webmention endpoint to notify them, when they are mentioned. It works quite well for what I want to achieve, which is displaying reactions to my posts from other platforms on my website.

## Next steps

What I'm currently missing is a way of having IndieWeb conversations (IndieWeb level 3, according to IndieWebify.me). For that, I would like to implement a content type **notes**, short posts as a way to react to other people's posts. There are also [microformats](http://microformats.org/wiki/h-entry#Properties) for that: `in-reply-to`, `u-like-of` and `u-repost-of`.

## Final thoughts

At this point, I'm a **Level 2 IndieWeb citizen**. I can use **Web Sign-In** with my site, I marked up content using **microformats** and I can **send and receive Webmentions** to and from other IndieWeb sites.

As I said before, there is **no out-of-the-box solution** for making your website ready for the IndieWeb. It involves a lot of customization, fiddling with services and setting up endpoints.

Also, I think my **Webmention workflow** is lacking. I need to implement a way to automatically rebuilt my site when new Webmentions are coming in.

**Syndication** is another troubling topic. The process is a bit convoluted, and I'm not sure I'm doing this right. You see, I have to first publish my post, let my site be built, then syndicate the link (tweet it on Twitter, toot it on Mastodon), then add those tweet- and toot-links to my post and republish my site. If there's a better way, I still haven't found it.

But in the end I'm quite happy with what I've accomplished. Ever since I started this journey IndieWeb-things kept popping in my head at the weirdest of times, and I'm content with the way things are right now. I resurfaced from the rabbit hole. Glad to be back!
