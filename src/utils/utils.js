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

module.exports.uidOrEmail = (parram) => {
  if (parram.indexOf('@') >= 0) return { email: parram };
  return { _id: parram };
};

module.exports.isAWeakPassword = (password) => ((password.length <= 3));
module.exports.isAValidEmail = (email) => {
  const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  return !!(emailRegex.test(email));
};
