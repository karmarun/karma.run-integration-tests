const d = require('./_data.js')

exports.struct = function (o) {
  return d.union(
    "struct",
    d.map(o)
  )
}

exports.tuple = function (o) {
  return d.union(
    "tuple",
    d.list(o)
  )
}

exports.list = function (o) {
  return d.union(
    "list",
    o
  )
}

exports.set = function (o) {
  return d.union(
    "set",
    o
  )
}

exports.map = function (o) {
  return d.union(
    "map",
    o
  )
}

exports.optional = function (o) {
  return d.union(
    "optional",
    o
  )
}

exports.unique = function (o) {
  return d.union(
    "unique",
    o
  )
}

exports.annotation = function (value, o) {
  return d.union(
    "annotation",
    d.struct({
      "value": d.string(value),
      "model": o
    })
  )
}

exports.recursion = function (label, o) {
  return d.union(
    "recursion",
    d.struct({
      "label": d.string(label),
      "model": o
    })
  )
}

exports.recurse = function (label) {
  return d.union(
    "recurse",
    d.string(label)
  )
}

exports.recursive = function (top, modelsMap) {
  return d.union(
    "recursive",
    d.struct({
      "top": d.string(top),
      "models": d.map(modelsMap)
    })
  )
}

exports.union = function (o) {
  return d.union(
    "union",
    d.map(o)
  )
}

exports.string = function () {
  return d.union(
    "string",
    d.struct()
  )
}

exports.int32 = function () {
  return d.union(
    "int32",
    d.struct()
  )
}

exports.float = function () {
  return d.union(
    "float",
    d.struct()
  )
}

exports.dateTime = function () {
  return d.union(
    "dateTime",
    d.struct()
  )
}

exports.enum = function (...o) {
  return d.union(
    "enum",
    d.set(o)
  )
}

exports.bool = function () {
  return d.union(
    "bool",
    d.struct()
  )
}


module.exports = exports