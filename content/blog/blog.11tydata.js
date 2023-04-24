module.exports = {
  tags: ["posts"],
  layout: "layouts/post.webc",
  permalink: (data) => {
    const year = String(data.page.date.getFullYear());
    const month = String(data.page.date.getMonth() + 1).padStart(2, "0");
    if (data.page.date > new Date("2023-02-21T12:00:00")) {
      return `/blog/${year}/${month}/${data.page.fileSlug}/`;
    }
    return `/${year}/${month}/${data.page.fileSlug}/`;
  },
  eleventyComputed: {
    frontmatter: (data) => data,
    coverImage: (data) => {
      if (data.cover && data.cover.src) {
        if (data.cover.src.includes("http")) {
          return data.cover.src;
        } else {
          const newFilePathStem = data.page.filePathStem.replace(
            "index",
            data.cover.src
          );
          return `./content${newFilePathStem}`;
        }
      }
    },
  },
};
