exports.karmaFunction = function (params = [], ...expression) {
  return {
    "function": [
      params,
      [...expression]
    ]
  }
}

module.exports = exports