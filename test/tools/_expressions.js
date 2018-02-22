exports.tag = function (v) {
  return [
    "tag", ["string", v]
  ]
}

exports.all = function (ref) {
  return [
    "all", ref
  ]
}

exports.first = function (v) {
  return [
    "first", v
  ]
}

exports.metarialize = function (v) {
  return [
    "metarialize", v
  ]
}

exports.ref = function (model, id = null) {
  if (model instanceof Array) {
    return [
      "ref", [
        ["string", model[0]],
        ["string", model[1]]
      ]
    ]
  }

  return [
    "ref", [
      ["string", model],
      ["string", id]
    ]
  ]
}


module.exports = exports