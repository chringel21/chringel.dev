---
title: "Automatically Deploy a Hugo Website to a Remote Host Using Github Actions"
author: Christian Engel
type: post
date:  2022-05-03
cover: 
  src: images/hugo-deployment.jpg
  caption
draft: true
categories:
  - Coding
  - Tutorials
tags:
  - Hugo
  - GitHub
  - GitHub Actions
  - Uberspace
  - git flow
  - rsync
  - Deployment
  - Remote host
  - Static site generator
description: This post shows an example workflow to automatically deploy the latest version of a Hugo website using GitHub Actions.
---

## Premise

So by now you should know that I like to keep things under my control. That's why this blog is [hosted on ateroids :rocket:](https://uberspace.de/en/) (I'm using this phrase so often, I should either trademark it, at least create a shortcode for it). It's content, on the other hand, is under version control at [GitHub](https://github.com/chringel21/chringel.dev).

In the past, my workflow for writing and publishing new content would look like this:

1. Write a new blog post or create a new page in Visual Studio Code
2. Make a commit for that new content and push it to GitHub
3. Run a local script to create a build of my website and sync those files to my webspace, using `rsync`.

In far more ancient times, I wasn't even using `rsync`, but instead

&nbsp;

Source: xyz
