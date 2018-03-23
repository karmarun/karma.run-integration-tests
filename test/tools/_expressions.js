exports.tag = function (v) {
  return [
    "tag", v
  ]
}

exports.after = function (tuple) {
  return [
    "after", tuple
  ]
}

exports.before = function (tuple) {
  return [
    "before", tuple
  ]
}

exports.length = function (v) {
  return [
    "length", v
  ]
}

exports.all = function (ref) {
  return [
    "all", ref
  ]
}

exports.greater = function (a, b) {
  return [
    "greater",
    [
      a,
      b
    ]
  ]
}

exports.arg = function () {
  return [
    "arg",
    {}
  ]
}

exports.filterList = function (val, ex) {
  return [
    "filterList",
    {
      "value": val,
      "expression": ex
    }
  ]
}

exports.refTo = function (v) {
  return [
    "refTo", v
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

exports.create = function (_in, val) {
  return [
    "create",
    {
      "in": _in,
      "value": val
    }
  ]
}

exports.update = function (ref, val) {
  return [
    "update", {
      "ref": ref,
      "value": val
    }
  ]
}

exports.get = function (ref) {
  return [
    "get", ref
  ]
}

module.exports = exports