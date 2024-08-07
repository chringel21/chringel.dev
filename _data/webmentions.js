import EleventyFetch from "@11ty/eleventy-fetch";
import { DateTime } from "luxon";

import metadata from "./metadata.js";

import dotenv from "dotenv";
dotenv.config();

const API = "https://jam.chringel.dev/webmention/chringel.dev/";
const TOKEN = process.env.JAM_TOKEN;
const DOMAIN = metadata.url;
const URL = `${API}${TOKEN}`;

export default async function () {
  if (!TOKEN) {
    console.warn(
      "Unable to fetch webmentions: no access token specified in environment."
    );
    return false;
  }
  console.log(`Fetching webmentions from ${URL}`);
  const json = await EleventyFetch(URL, {
    duration: "1d",
    type: "json",
  });

  console.log(`${json.json.length} webmentions fetched from ${URL}`);
  const webmentions = json.json.map((mention) => {
    mention.relativeTarget = mention.target.substring(
      mention.target.indexOf(DOMAIN) + DOMAIN.length,
      mention.target.length
    );
    return mention;
  });

  return webmentions.sort(
    (a, b) => DateTime.fromISO(b.published) - DateTime.fromISO(a.published)
  );
}
