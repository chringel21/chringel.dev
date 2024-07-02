const got = require("got");
const dayjs = require("dayjs");
const { env } = require("process");
const fsp = require("fs").promises;
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

async function getWebmentions(domain, config) {
  const url = `${config.endpoint}/webmention/${domain}/${config.token}`;
  const result = await got(url);

  if (!result.body || !result.body) {
    return [];
  }
  const json = JSON.parse(result.body).json;

  json.forEach((mention) => {
    mention.relativeTarget = mention.target.substring(
      mention.target.indexOf(domain) + domain.length,
      mention.target.length
    );
  });

  return json.sort(
    (a, b) => dayjs(b.published).toDate() - dayjs(a.published).toDate()
  );
}

(async function () {
  const config = {
    endpoint: "https://jam.chringel.dev",
    token: process.env.WM_TOKEN,
  };

  // get webmentions
  console.log("Fetching webmentions...");
  const mentions = await getWebmentions("chringel.dev", config);
  const json = JSON.stringify(mentions, null, 4);
  await fsp.writeFile(`${__dirname}/data/webmentions.json`, json, "utf-8");
  console.log(`-- done`);

  console.log("-- all done!");
})();
