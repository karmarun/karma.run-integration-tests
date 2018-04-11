exports.karmaFunction = function (params = [], ...expression) {
  return {
    "function": [
      params,
      expression
    ]
  }
}

exports.define = function (key, value) {
  return {
    "define": [
      key,
      value
    ]
  }
}

module.exports = exports