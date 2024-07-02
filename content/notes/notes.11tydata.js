import metadata from "../../_data/metadata.js";

export default {
  tags: ["notes"],
  layout: "layouts/note.webc",
  permalink: (data) => {
    const year = String(data.page.date.getFullYear());
    const month = String(data.page.date.getMonth() + 1).padStart(2, "0");
    const day = String(data.page.date.getDate()).padStart(2, "0");
    if (data.page.date > new Date("2023-03-15T12:00:00")) {
      return `/notes/${year}/${month}/${day}/${data.page.fileSlug}/`;
    }
    return `/${year}/${month}/${day}/${data.page.fileSlug}/`;
  },
  eleventyComputed: {
    computedContent: (data) => data.content,
    title: (data) => {
      return `Note from ${data.page.date.toDateString()}`;
    },
    webmentionsByPage: (data) => {
      const wmByPage = data.webmentions.filter(
        (wm) => wm.relativeTarget === data.page.url
      );
      const groupedWm = wmByPage.reduce((r, a) => {
        if (!a.source.includes(metadata.url)) {
          if (
            a.content !== "" &&
            (a.type === "reply" || a.type === "mention")
          ) {
            r.replies = r.replies || [];
            r.replies.push(a);
          } else if (a.type === "like" || a.type === "bookmark") {
            r.likes = r.likes || [];
            r.likes.push(a);
          } else if (a.type === "repost") {
            r.reposts = r.reposts || [];
            r.reposts.push(a);
          }
        }
        return r;
      }, Object.create(null));
      return groupedWm;
    },
  },
};
