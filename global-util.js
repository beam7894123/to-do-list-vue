const empty = (obj) => {
  if (Array.isArray(obj) && obj.length === 0) {
    return true
  } else {
    return obj === undefined || obj === null || obj === ''
  }
}

module.exports = {
  empty,
};
