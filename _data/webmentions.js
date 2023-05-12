const EleventyFetch = require("@11ty/eleventy-fetch");
const metadata = require("./metadata");

require("dotenv").config();

const API = "https://jam.chringel.dev/webmention/chringel.dev/";
const TOKEN = process.env.JAM_TOKEN;
const DOMAIN = metadata.url;

module.exports = async () => {
  const json = await EleventyFetch(`${API}${TOKEN}`, {
    duration: "1d",
    type: "json",
  });

  const webmentions = json.json.map((mention) => {
    mention.relativeTarget = mention.target.substring(
      mention.target.indexOf(DOMAIN) + DOMAIN.length,
      mention.target.length
    );
    return mention;
  });

  return webmentions;
};
