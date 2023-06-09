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
};
