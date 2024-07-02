const fs = require("fs");
const { DateTime } = require("luxon");
const slugify = require("slugify");
const argv = require("minimist")(process.argv.slice(2));
const metadata = require("./_data/metadata.js");

const jsDateObj = new Date();
const htmlDate = DateTime.fromJSDate(jsDateObj, {
  zone: "Europe/Berlin",
}).toISO();

const title = argv.title || "ADD TITLE";
const author = argv.author || metadata.author.name;
const type = argv.type || "post";
const category = argv.category || "Coding";
const description = argv.description || "ADD DESCRIPTION";

let dir = slugify(title, {
  lower: true,
  strict: true,
});
dir = `./content/blog/${jsDateObj.getFullYear()}/${dir}`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFile(
  `${dir}/index.md`,
  `---
title: ${title}
author: ${author}
type: ${type}
date: ${htmlDate}
lastmod: ${htmlDate}
image: feature.png
caption: ADD COVER IMAGE CAPTION
categories:
  - ${category}
description: ${description}
# syndication:
#   mastodon: https://...
---
  
ADD CONTENT`,
  function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }
);
