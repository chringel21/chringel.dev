const { getCategoryKeys } = require("./functions.js");
const slugify = require("slugify");

module.exports = {
  allReverse: (collectionApi) => {
    return collectionApi.getAllSorted().reverse();
  },
  allPostsReverse: (collectionApi) => {
    return collectionApi
      .getAllSorted()
      .reverse()
      .filter((item) => item.data.type === "post");
  },
  allNotesReverse: (collectionApi) => {
    return collectionApi
      .getAllSorted()
      .reverse()
      .filter((item) => item.data.type === "note");
  },
  postsBySeries: (collectionApi) => {
    let series;
    let postsBySeries = {};
    collectionApi
      .getAllSorted()
      .filter((item) => item.data.series)
      .forEach((item) => {
        series = item.data.series;
        if (!postsBySeries[series]) {
          postsBySeries[series] = [];
        }
        postsBySeries[series].push(item);
      });
    return postsBySeries;
  },
  categories: (collectionApi) => {
    const options = { categoryVar: "categories" };
    const posts = collectionApi.getFilteredByTag("posts");
    let tagArray = getCategoryKeys(posts, options);

    const categoriesWithPosts = tagArray.map((category) => {
      let filteredPosts = posts
        .filter((post) => {
          if (!post.data[options.categoryVar]) return false;
          return post.data[options.categoryVar].includes(category);
        })
        .flat();
      console.log(
        slugify(category, {
          lower: true,
          strict: true,
        })
      );
      return {
        title: category,
        slug: slugify(category, {
          lower: true,
          strict: true,
        }),
        posts: [...filteredPosts],
      };
    });
    console.log(
      `\x1b[32m[Dynamic Categories] Created Collection ${options.categoryVar} with ${categoriesWithPosts.length} items`,
      "\x1b[0m"
    );
    return categoriesWithPosts;
  },
};
