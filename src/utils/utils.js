module.exports.getPagination = (url, page, limit, totalPages) => {
  const firstPage = `<${url}?limit=${limit}&page=${1}>; rel="first"`;
  // console.log('firstPage', firstPage);
  const prevPage = `<${url}?limit=${limit}&page=${page - 1}>; rel="prev"`;
  // console.log('prevPage', prevPage);
  const nextPage = `<${url}?limit=${limit}&page=${page + 1}>; rel="next"`;
  // console.log('nextPage', nextPage);
  const lastPage = `<${url}?limit=${limit}&page=${totalPages}>; rel="last"`;
  // console.log('lastPage', lastPage);
  return `${firstPage}, ${prevPage}, ${nextPage}, ${lastPage}`;
};
