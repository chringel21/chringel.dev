import EleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  let url = "https://speedlify.chringel.dev/api/urls.json";
  let json = await EleventyFetch(url, {
    duration: "1w",
    type: "json",
  });

  return json;
}
