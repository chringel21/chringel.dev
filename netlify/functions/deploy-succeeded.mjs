const sendWebmentions = async (domain, config) => {
  const url = `${config.endpoint}/webmention/${domain}/${config.token}`;

  // this is an async call and will return 202 to say "started sending them out".
  const result = await fetch(url, { method: "PUT" });
};

export default async (req, context) => {
  if (!process.env.JAM_TOKEN) {
    return new Response("Missing Access Token", { status: 403 });
  }

  const config = {
    endpoint: "https://jam.chringel.dev",
    token: process.env.JAM_TOKEN,
  };

  try {
    console.log("Sending webmentions...");
    await sendWebmentions("chringel.dev", config);
    console.log("-- done");
  } catch (e) {
    console.log(e);
    return new Response(e.toString(), { status: 400 });
  }
};
