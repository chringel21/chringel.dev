module.exports = {
  tags: ["notes"],
  layout: "layouts/note.webc",
  permalink: (data) => {
    const year = String(data.page.date.getFullYear());
    const month = String(data.page.date.getMonth() + 1).padStart(2, "0");
    const day = String(data.page.date.getDay()).padStart(2, "0");
    if (data.page.date > new Date("2023-03-15T12:00:00")) {
      return `/notes/${year}/${month}/${day}/${data.page.fileSlug}/`;
    }
    return `/${year}/${month}/${day}/${data.page.fileSlug}/`;
  },
};
