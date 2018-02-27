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

exports.tuple = function (array) {
  return [
    "tuple", array
  ]
}

exports.ref = function (v) {
  return [
    "ref", v
  ]
}

exports.metarialize = function (v) {
  return [
    "metarialize", v
  ]
}


module.exports = exports