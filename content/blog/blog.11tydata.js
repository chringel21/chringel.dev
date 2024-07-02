import slugify from "slugify";
import metadata from "../../_data/metadata.js";

export default {
  tags: ["posts"],
  layout: "layouts/post.webc",
  permalink: (data) => {
    const year = String(data.page.date.getFullYear());
    const month = String(data.page.date.getMonth() + 1).padStart(2, "0");
    const slugifiedTitle = slugify(data.title, {
      lower: true,
      strict: true,
    });
    if (data.page.date > new Date("2023-02-21T12:00:00")) {
      return `/blog/${year}/${month}/${slugifiedTitle}/`;
    }
    return `/${year}/${month}/${slugifiedTitle}/`;
  },
  eleventyComputed: {
    coverImage: (data) => {
      if (data.image) {
        if (data.image.includes("http")) {
          return data.image;
        } else {
          const newFilePathStem = data.page.filePathStem.replace(
            "index",
            data.image
          );
          return `./content${newFilePathStem}`;
        }
      }
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
