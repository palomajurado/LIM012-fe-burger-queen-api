module.exports = {
  resp: {
    json: (obj) => obj,
    status(responseStatus) {
      this.statusCode = responseStatus;
      return this;
    },
    setHeader: (name, value) => {
      this[name] = value;
    },
    set: (name) => name,
  },
  next: (number) => number,
};
