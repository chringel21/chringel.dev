import qs from "querystring";
import { DateTime } from "luxon";

const API_FILE_TARGET =
  "https://api.github.com/repos/chringel21/chringel.dev/contents/content/notes/";

const sanitize = (str) => {
  // replace endash and emdash with hyphens
  str = str.replace(/–/g, "-");
  str = str.replace(/—/g, "-");

  // replace double quotes and apostrophes
  str = str.replace(/"/g, "'");
  str = str.replace(/“/g, "'");
  str = str.replace(/”/g, "'");
  str = str.replace(/’/g, "'");

  return str.trim();
};

const getFrontmatter = (yaml) => {
  let frontmatter = [];
  frontmatter.push("---");
  Object.keys(yaml).map((key) => {
    if (yaml[key] !== "") {
      frontmatter.push(`${key}: ${yaml[key]}`);
    }
  });
  frontmatter.push("---");
  return frontmatter.join("\n");
};

const getFileContent = ({
  title,
  url,
  text,
  interaction,
  publish_to_mastodon,
}) => {
  const date = DateTime.fromJSDate(new Date(), {
    zone: "Europe/Berlin",
  }).toISO();
  const dataObj = {
    author: "Christian Engel",
    type: "note",
    date: `${date}`,
    description: "Just a note",
    title: `"${sanitize(title)}"`,
  };
  if (interaction !== "") dataObj[interaction] = `"${url}"`;
  if (publish_to_mastodon) dataObj.bridgy = `\n  - mastodon`;
  const frontmatter = getFrontmatter(dataObj);

  let content = frontmatter;
  if (text) {
    content += "\n\n" + sanitize(text);
  }

  console.log(content);

  return qs.unescape(encodeURIComponent(content));
};

const getFileName = () => {
  const date = DateTime.utc();
  const year = date.year;
  const month = date.month < 10 ? `0${date.month}` : date.month;
  const day = date.day < 10 ? `0${date.day}` : date.day;
  const hour = date.hour < 10 ? `0${date.hour}` : date.hour;
  const minute = date.minute < 10 ? `0${date.minute}` : date.minute;
  return `${year}/${month}/${day}/${hour}${minute}.md`;
};

const postFile = async (data) => {
  const { token } = data;
  const fileName = getFileName();
  const fileContent = getFileContent(data);
  const url = API_FILE_TARGET + fileName;

  const payload = {
    message: "📝 New note",
    content: Buffer.from(fileContent).toString("base64"),
    committer: {
      name: "Christian Engel",
      email: "ch-engel@posteo.de",
    },
  };

  const options = {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(url, options);
};

const handleResponse = (response) => {
  if (response.ok) {
    return new Response("Note published", { status: 200 });
  }

  return new Response(response.statusText, { status: response.status });
};

export default async (req, context) => {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    if (data.h0_3yp07) {
      return;
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!data.token) {
      return new Response("Missing Access Token", { status: 403 });
    }

    console.log(data);

    const response = await postFile(data);
    return handleResponse(response);
  } catch (e) {
    console.log(e);
    return new Response(e.toString(), { status: 400 });
  }
};

export const config = {
  path: "/share-note",
};
