exports.functionReturn = function (expression, params = []) {
  return {
    "function": [
      params,
      [expression]
    ]
  }
}

module.exports = exports