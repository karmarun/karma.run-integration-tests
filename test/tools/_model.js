exports.struct = function (o) {
  return [
    "union", [
      "struct", [
        "map", o
      ]
    ]
  ]
}

exports.tuple = function (o) {
  return [
    "union", [
      "tuple", [
        "list", o
      ]
    ]
  ]
}

exports.list = function (o) {
  return [
    "union", [
      "list", o
    ]
  ]
}

exports.set = function (o) {
  return [
    "union", [
      "set", o
    ]
  ]
}

exports.map = function (o) {
  return [
    "union", [
      "map", o
    ]
  ]
}

exports.optional = function (o) {
  return [
    "union", [
      "optional", o
    ]
  ]
}

exports.unique = function (o) {
  return [
    "union", [
      "unique", o
    ]
  ]
}

exports.any = function () {
  return [
    "union", [
      "any",
      ["struct", {}]
    ]
  ]
}

exports.union = function (o) {
  return [
    "union", [
      "union", [
        "map", o
      ]
    ]
  ]
}

exports.string = function () {
  return [
    "union", [
      "string",
      ["struct", {}],
    ]
  ]
}

exports.int32 = function () {
  return [
    "union", [
      "int32",
      ["struct", {}],
    ]
  ]
}

exports.float = function () {
  return [
    "union", [
      "float",
      ["struct", {}],
    ]
  ]
}

exports.dateTime = function () {
  return [
    "union", [
      "dateTime",
      ["struct", {}],
    ]
  ]
}

exports.enum = function (o) {
  return [
    "union", [
      "enum", [
        "set", o
      ],
    ]
  ]
}

exports.bool = function () {
  return [
    "union", [
      "bool", [
        "struct", {}
      ],
    ]
  ]
}


module.exports = exports