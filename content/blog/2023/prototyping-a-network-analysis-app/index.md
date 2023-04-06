---
title: "Prototyping a Network Analysis App"
author: Christian Engel
type: post
date: 2023-02-20T09:49:29+01:00
lastmod: 2023-03-03T08:03:00+01:00
cover:
  src: feature.png
  caption: "Isochrone reachability calculated using Graphhopper"
categories:
  - Coding
  - Spatial Stuff
tags:
  - Network analysis
  - graphhopper
  - node.js
  - maplibre-gl
  - isochrones
  - turf.js
description: I prototyped a network analysis app using Graphhopper, Node.js and Maplibre GL
syndication:
  twitter: https://twitter.com/DeEgge/status/1628059757519970305
  mastodon: https://fosstodon.org/@chringel/109903521371519204
---

**Cross post**: A German version of this post is available at the [WhereGroup blog](https://wheregroup.com/blog/details/wie-weit-ist-es-bis-zum-naechsten-altglascontainer-ein-prototyp-fuer-dynamische-erreichbarkeitsanalysen-mit-express-und-graphhopper/).

A couple of weeks ago I felt like diving into **server side JavaScript**. Although I'm fairly confident with writing client side JavaScript, I never really found an opportunity to try out Node.js. Being a (former) PHP and (current) Kotlin developer by profession, there also was no need to write any server side JavaScript.

## The Goals 🎯

I set myself a couple of goals I wanted to accomplish:

- Create some API endpoints and handle stuff server side
- Use a templating engine
- Use an environment file

With a limited amount of time, those seemed like reasonably to do.

## The Problem 🤔

The app should also solve a problem I was having:

**How much time do I need walking to the next glass container?** I asked myself this question, because I had this suspicion I was living in a spot in Potsdam, Germany, where you could not reach a glass container within 10 minutes of walking time. And I needed quantitative proof! 🧑‍⚖️

## The Solution 🪄

### Express 🏗️

First, I needed a framework for routing. Sure, you can do all that by yourself in Node, but not if there are sophisticated frameworks to help you. [Express](http://expressjs.com/) seemed like the go-to solution for that. There is even a dedicated [learning section for Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction) in the Mozilla docs.

Alright, here we go: Initialize a project, add express as a dependency and create a skeleton application.

```shell
npm init
npm install express
...
```

But wait, there's also **express-generator** that will automate most of that.

```
npm install express-generator -g
```

There are a couple of templating engines to choose from. With a background in [Symfony](https://symfony.com/), I could go with [Twig](https://www.npmjs.com/package/twig), but where's the fun in that? So I chose [Pug](https://pugjs.org/api/getting-started.html) and plain old CSS files for styles.

Next try: Create a skeleton application.

```
express simple-network-analysis --view=pug
cd simple-network-analysis
npm install
DEBUG=simple-network-analysis:* npm start
```

{% imagenjk "./express.png", "Express is running" %}

Voilá! Express is running!

### Pug and a map 🐶🗺️

I needed to get used to **Pug** a little, the syntax is kind of weird. It's kind of like YAML, indentation matters a lot, because that's the way to nest HTML elements. You can omit a `div` tag, if you want to.

This

```pug
.main
  h1.header Hello World
  p.content Lorem ipsum dolorem bla
  ul
    li Item 1
    li Item 2
    li Item 3
```

turns into this

```html
<div class="main">
  <h1 class="header">Hello World</h1>
  <p class="content">Lorem ipsum dolorem bla</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

Got it! I added some **Maplibre GL** tags to the `layout.pug` and the _map_ element to the `index.pug`.

```pug
//- layout.pug
head
  //- ...
  script(src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js")
  link(
    href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css",
    rel="stylesheet"
  )
  //- ...

//- index.pug
block content
  #map(style="position: absolute; top: 0; bottom: 0; width: 100%;")
  //- ...
  script(type="text/javascript").
    const map = new maplibregl.Map({
      container: "map",
      style: "https://tiles.chringel.dev/styles/fiord-color-gl-style/style.json",
      center: [13.0, 52.5],
      zoom: 10,
    });
```

{% imagenjk "./basic_map.png", "A basic map" %}

### A route: `/points` ➡️

OK, I know my way around templating, and express is already running. The next step was to add a route, or an API endpoint to call from the client. The endpoint would, in turn, make a server side call to another API that would provide a set of points, a Geojson file with the locations of all glass containers in Potsdam.

Adding a new route to the application requires two things:

- Adding a new file to the `routes` folder, called `points.js`
- Adding the new route to `app.js`

```js
// routes/points.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const points = await getPoints();
    res.send(points);
  } catch (e) {
    console.error(e);
  }
});

const getPoints = async () => {
  const res = await axios(
    "https://opendata.potsdam.de/explore/dataset/standplatze-glassammlung/download/?format=geojson&timezone=Europe/Berlin&lang=de"
  );
  return await res.data;
};

module.exports = router;

// app.js
// ...
const indexRouter = require("./routes/index");
const pointsRouter = require("./routes/points");

// ...
app.use("/", indexRouter);
app.use("/points", pointsRouter);

// ...
```

Here's where I ran into another trap: I assumed `fetch`, the client side API to make HTTP requests to also be available server side. But the Node `fetch` API is only available on versions > v17, I was working with v16. So I went with [axios](https://axios-http.com/docs/intro).

Then I added a form with a button to the frontend to make a call to the backend. The response, Geojson points, would then be added to the map.

{% imagenjk "./load_points.png", "Map with a button and points" %}

### A second route: `/isochrone` 🛣️

A second route was required to compute isochrones based off of the point locations: `/isochrone`. For this step, the already fetched points will be sent to the backend again (there might be optimization potential here). Each point would mark a starting position for a call to [Graphhopper's Isochrone API](https://docs.graphhopper.com/#tag/Isochrone-API).

This step was a bit more complex, because I needed to come up with an algorithm to convert Graphhopper's isochrone response result to something comprehensible. By default, only one so-called _bucket_ is computed. A bucket represents the area that can be reached, within a certain amount of time, i.e. 10 minutes. If more buckets are specified, Graphhopper will compute multiple areas that can be covered within `time limit / number of buckets`, i.e. within 2 minutes, 4 minutes, 6 minutes and so on.

Here's the work flow I came up with:

{% imagenjk "./isochrone_process.png", "Isochrone processing chain" %}

1. The unprocessed "raw" geometries resulting from multiple calls to Graphhopper's Isochrone API are sent to the frontend.
2. The geometries are [smoothed](http://turfjs.org/docs/#polygonSmooth), for better visual representation
3. The geometries are [dissolved](http://turfjs.org/docs/#dissolve) based on the attribute bucket.
4. The geometries are [unioned](http://turfjs.org/docs/#union).
5. The geometries' [difference](http://turfjs.org/docs/#difference) is built.
6. The geometries are styled.

The processing chain is implemented using [Turf.js](http://turfjs.org), so everything is happening on the client side.

### Environment file 📄

The last thing on my list of goals was to use an environment file. During development, tile server and Graphhopper were running as local docker containers. But in my deployment environment, I didn't have docker available, the tile server and Graphhopper were running as dedicated services. So, naturally I had to make the Graphhopper URL and the tile server URL configurable. Enter `.env` files.

To make use of environment files I had to install the package [dotenv](https://github.com/motdotla/dotenv). With the `.env` file in the root of the project, I could add its contents as a config object. Every value in this object will be available by its key. But be sure not to expose any sensitive data to the frontend.

```
# .env
STYLE_URL=http://localhost:8080/tiles/styles/osm-bright-gl-style/style.json
```

```js
// routes/index.js
const { config } = require("dotenv");

config();

const INDEX_CONFIG = {
  STYLE_URL:
    process.env.STYLE_URL || // <-- I need this STYLE_URL
    "http://localhost:8080/tiles/styles/osm-bright-gl-style/style.json",
};

router.get("/", (req, res, next) => {
  res.render("index", INDEX_CONFIG);
});
```

```pug
//- views/index.pug
//- ...
script(type="text/javascript").
  const map = new maplibregl.Map({
    container: "map",
    style: "#{ STYLE_URL }", //- <-- Use STYLE_URL here
    center: [13.0, 52.5],
    zoom: 10,
  });
```

## Wrapping up 📦

The final app looks like this:

{% imagenjk "./feature.png", "Final app" %}

Creating this small prototype from scratch in only two days was fun, although I probably wouldn't do it again in "vanilla" Node.js (yes, I call Node+Express "vanilla"). All goals were accomplished, I created some API endpoints, used a templating engine and an environment file for deploying. But I miss the frontend tooling and would probably go with a fullstack framework, like Next.js. For building APIs, Node+Express is alright, I guess, but there more sophisticated solutions available.

If you want to try the app yourself, you can find the code at [GitHub](https://github.com/chringel21/simple-isochrone-analysis) or [see it in action here](https://chringel.dev/wie-weit-zum-altglas/).

Oh, and one last remark:

**I was right!** I live in a spot secluded from glass containers within 10 minutes walking time. Bummer! 🤷

**Update 2023-03-03**

In a previous version of this post I stated that Express uses a file based router.
