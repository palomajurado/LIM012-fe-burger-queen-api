module.exports.uidOrEmail = (parram) => {
  if (parram.indexOf('@') >= 0) return { email: parram };
  return { _id: parram };
};
