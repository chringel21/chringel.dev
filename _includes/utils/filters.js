import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import fs from "fs";

export default {
  fromISOToReadable: (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("LLLL dd, yyyy");
  },

  readableDate: (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, {
      zone: zone || "Europe/Berlin",
    }).toFormat(format || "LLLL dd, yyyy");
  },

  htmlDateString: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Europe/Berlin" }).toISO();
  },

  md: (string) => {
    return markdownIt().render(string);
  },

  getTitle: (title, metadata) => {
    if (title && metadata.author.name) {
      return `${title} | ${metadata.author.name} | ${metadata.title}`;
    } else if (title && !metadata.author.name) {
      return `${title} | ${metadata.title}`;
    } else {
      return `${metadata.title}`;
    }
  },

  bust: (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    const relativeUrl =
      urlPart.charAt(0) == "/" ? urlPart.substring(1) : urlPart;

    try {
      const fileStats = fs.statSync("public/" + relativeUrl);
      const dateTimeModified = new DateTime(fileStats.mtime).toFormat("X");
      params.set("v", dateTimeModified);
    } catch (error) {
      console.log(error);
    }

    return `${urlPart}?${params}`;
  },
};
