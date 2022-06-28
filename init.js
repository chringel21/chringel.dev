const { webmention } = require("jam-my-stack");
const { env } = require("process");
const fsp = require("fs").promises;

(async function () {
  const config = {
    endpoint: "https://jam.chringel.dev",
    token: process.env.WM_TOKEN,
  };

  // get webmentions
  console.log("Fetching webmentions...");
  const mentions = await webmention.getWebmentions("chringel.dev", config);
  const json = JSON.stringify(mentions, null, 4);
  await fsp.writeFile(`${__dirname}/data/webmentions.json`, json, "utf-8");
  console.log(`-- done`);

  // send webmentions
  console.log("Sending webmentions...");
  const since = await webmention.send("chringel.dev", config);
  console.log(`-- done`);

  console.log("-- all done!");
})();
