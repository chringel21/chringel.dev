const got = require("got");
const fsp = require("fs").promises;

require("dotenv").config();

async function sendWebmentions(domain, config) {
  const url = `${config.endpoint}/webmention/${domain}/${config.token}`;

  // this is an async call and will return 202 to say "started sending them out".
  const result = await got.put(url);
}

(async function () {
  const config = {
    endpoint: "https://jam.chringel.dev",
    token: process.env.JAM_TOKEN,
  };

  // send webmentions
  console.log("Sending webmentions...");
  const since = await sendWebmentions("chringel.dev", config);
  console.log(`-- done`);

  console.log("-- all done!");
})();
