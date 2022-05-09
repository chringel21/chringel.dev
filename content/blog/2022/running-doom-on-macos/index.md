---
title: "Run Doom on MacOS"
author: Christian Engel
type: post
date: 2022-05-09
cover:
  src: images/doom-on-macos.png
  caption: Running Doom on MacOS is not that hard!
draft: true
categories:
  - Gaming
tags:
  - MacOS
  - Doom
  - GZDoom
  - WAD
  - Source Port
  - Innoextract
  - Terminal
description: This post will explain how to run Doom on MacOS using a source port called GZDoom.
---

## TL;DR

This is the short **get-to-the-point** way with no optimization whatsoever.

- [Install Homebrew](https://brew.sh/)
- [Download GZDoom for Mac](https://zdoom.org/downloads) or

```shell
brew install gzdoom
```

- If you don't own Doom or Doom 2 already, download the Windows installer of an original Doom release from either [GOG](https://www.gog.com/en/game/the_ultimate_doom) or [Steam](https://store.steampowered.com/app/2280/Ultimate_Doom/?curator_clanid=35501448)
- Download innoextract

```shell
brew install innoextract
```

- Extract files from Doom installer

```shell
innoextract -d ~/Doom ~/Downloads/setup_the_ultimate_doom_1.9_\(28044\).exe
```

- Copy DOOM.WAD to config folder

```shell
cp ~/Doom/DOOM.WAD ~/Library/Application\ Support/gzdoom/DOOM.WAD
```

- Run GZDoom with DOOM.WAD

```shell
/Applications/GZDoom.app/Contents/MacOS/gzdoom -f ~/Doom/DOOM.WAD
```

## My Background With Doom

With the emerging **boomer shooter** craze in recent years - [Boomer Shooter Humble Bundle](https://www.pcgamer.com/humbles-boomer-shooter-bundle-is-one-of-the-best-fps-collections-ive-seen/), [Curated list on Steam](https://store.steampowered.com/curator/41054936-boomershooter/), ["What's a Boomer Shooter" on YouTube](https://www.youtube.com/watch?v=dXCOKpJcYZU) - I've been rediscovering the original [Doom](https://github.com/id-Software/DOOM).

It must have been like 2001 when I first played Doom. I was too young to experience it when it first released, and when I played it for the first time, **I didn't like it**. Yes, I admit it. I didn't get what everyone else was seeing in this game. The enemies' sprite design didn't appeal to me, controls where clunky. Every shooter I had played up to this point (Half-Life, Unreal Tournament, Thief, ...) seemed far more superior to me.

Only later I disvocered the impact Doom had on the industry,

While it is relatively easy to get Doom and Doom 2 running on **Windows** platforms, with releases on [GOG](https://www.gog.com/en/game/the_ultimate_doom) and [Steam](https://store.steampowered.com/app/2280/Ultimate_Doom/?curator_clanid=35501448), I've struggled quite a bit to get it running on MacOS. I'm currently stuck on a Mac because of work and because I made the switch to Mac about 6 years ago. Before that, I've been working with different Linux distributions.

## Requirements

To run Doom, Doom 2 or any of the Doom Mods on MacOS, you will need a so called [source port](https://en.wikipedia.org/wiki/List_of_Doom_ports#List_of_source_ports). As Doom basically [runs on anything](https://www.reddit.com/r/itrunsdoom/), there are obviously ports that run on Mac.

---

Source: xyz
