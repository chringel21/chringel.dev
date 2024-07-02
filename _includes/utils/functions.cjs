module.exports = {
  getCategoryKeys: (posts, options = { categoryVar: "categories" }) => {
    const tagSet = new Set(
      posts.flatMap((post) => post.data[options.categoryVar] || [])
    );
    return [...tagSet];
  },
};
