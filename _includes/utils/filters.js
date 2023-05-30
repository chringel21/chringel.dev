const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");

module.exports = {
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
};
