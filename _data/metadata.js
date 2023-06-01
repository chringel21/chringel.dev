const path = require("path");

module.exports = {
  title: "chringel.dev",
  url: "https://chringel.dev",
  language: "en",
  description:
    "Christian Engel's personal blog about coding, spatial stuff and everything else",
  author: {
    name: "Christian Engel",
    email: "ch-engel@posteo.de",
    url: "https://chringel.dev/about/",
  },
  avatar: path.join(path.dirname(__dirname), "content/avatar.png"),
};
