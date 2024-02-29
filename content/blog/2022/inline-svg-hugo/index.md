---
title: "Inline SVG Icons For Hugo"
author: Christian Engel
type: post
date: 2022-03-08
image: feature-inline-svg-icons-for-hugo.png
caption: SVG icons partials are no problem
draft: false
categories:
  - Coding
  - Tutorials
tags:
  - Hugo
  - Partial
  - Partials
  - SVG
  - Inline
  - Icon
  - Icons
  - Ionicons
  - Bash script
series:
  - Blogging with Hugo
description: Create a partial to display inline SVG content as icons. Download SVG icons from Ionicons via bash script.
---

In a [previous post](https://chringel.dev/2022/02/chringel-hugo-theme/#social-icons) I mentioned how [with this theme](https://github.com/chringel21/chringel-hugo-theme) I moved away from using icon fonts such as FontAwesome. SVG icons are a great alternative for this use case.

Hugo partials make it really easy to implement a simple way to display inline SVG HTML syntax. Here's how I did it.

## Download some icons

As an icon set, I chose [Ionicons](https://ionic.io/ionicons), which is part of the Ionic framework. It's **open source** and **licensed under MIT**, so you are free to do whatever you want with it. The set contains logos for all the relevant social media platforms. It even has a Mastadon icon, but sadly no Pixelfed.

You could download all the required icons by hand, but using a small bash script is much more convenient.

```bash
#!/bin/sh
set -ex
icons="logo-twitter logo-github logo-mastodon fish-outline"
dest=ionicons
url=https://unpkg.com/ionicons@5.5.2/dist/svg/
mkdir -p "${dest}"
for icon in $icons; do
  icon="${icon}.svg"
  wget -O "${dest}/${icon}" "${url}/${icon}"
done
```

Ionicons follow a straight forward naming convention:

- `{icon-name}-ouline`
- `logo-{platform}`

The variable `icons` contains all icons we want to download. Save the script to a folder of your choice, i.e. `~/download.sh`, make it executable and run it.

```shell
chmod +x ~/download.sh
./download.sh
```

This will save all the requested icons to a folder called `ionicons`. Copy it into the `assets` folder of your Hugo site, i.e. `hugo-site/assets/svg/ionicons`.

## Create a Hugo partial

In the `layouts` folder of your Hugo site, create a `partial` folder, if you don't already have it. Usually your theme will have one, but if you don't want to tinker with your theme, you can always add custom partials to your Hugo site itself.

Here's the content of the partial called `ionicons.html`:

<!-- prettier-ignore -->
{% raw %}

```html
{{ $svg := resources.Get (print "ionicons/" . ".svg") }}
<span class="inline-svg">
  {{- $path:="<path" -}} {{- $fill:="<path fill=\"none\"" -}} {{ replace
  ($svg.Content) $path $fill | safeHTML }}
</span>
{{ end }}
```

{% endraw %}

If you want to make the logos look different from your standard icons, i.e. use a different size or color, just look for the string `logo` in the filename:

<!-- prettier-ignore -->
{% raw %}

```html
{{ $svg := resources.Get (print "svg/ionicons/" . ".svg") }} {{ if in $svg
"logo" }}
<span class="inline-svg h-10 w-10">
  {{- $path:="<path" -}} {{- $fill:="<path fill=\"currentColor\"" }} {{ replace
  ($svg.Content) $path $fill | safeHTML }}
</span>
{{ else }}
<span class="inline-svg">
  {{- $path:="<path" -}} {{- $fill:="<path fill=\"none\"" -}} {{ replace
  ($svg.Content) $path $fill | safeHTML }}
</span>
{{ end }}
```

{% endraw %}

## Styling

All that's left to do is style the partial appropiately. Somewhere in your custom `style.css` add the following rule, and adapt it to your style:

```css
.inline-svg {
  position: relative;
  top: 0.25rem;
  display: inline-block;
  height: 1.25rem;
  width: 1.25rem;
}
```

Did you note the `$fill` variable (`"path fill=\"currentColor\" ...`) used in the partial's code? This is useful for coloring your icon. It will inherit the color of its parents HTML tag. Let's say you want to use your icon as a link. Give that link a color, and your icon will be filled with the same color.

{% raw %}

```html
<a href="someUrl" style="color: red;">
  {{ partial "icons/ionicons" "logo-mastodon" }}
</a>
```

{% endraw %}

## Using the partial

There we go! Now you can use your partial to customize the layout of your site, or use it in your theme. The partial takes two parameters - actually only one, because the first indicates the name of the partial you want to use, inside your `partial` folder. The second parameter is just the SVGs filename, without the ending.

{% raw %}

```html
{{ partial "icons/ionicons" "logo-mastodon" }}
```

{% endraw %}

Have fun with your new, fancy SVG icons and logos!
