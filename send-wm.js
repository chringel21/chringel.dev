const { webmention } = require("jam-my-stack");
const { env } = require("process");
const fsp = require("fs").promises;

(async function () {
  const config = {
    endpoint: "https://jam.chringel.dev",
    token: process.env.WM_TOKEN,
  };

  // send webmentions
  console.log("Sending webmentions...");
  const since = await webmention.send("chringel.dev", config);
  console.log(`-- done`);

  console.log("-- all done!");
})();
