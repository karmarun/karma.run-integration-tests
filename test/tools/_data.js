/**
 * switches expression to data scope
 * @param val
 */
exports.data = function (val) {
  return {
    "data": val
  }
}

/**
 * switches from data to expression scope
 * @param val
 */
exports.expr = function (val) {
  return {
    "expr": val
  }
}

exports.zero = function () {
  return {
    "zero": {}
  }
}


exports.string = function (val) {
  return {
    "string": val
  }
}

exports.list = function (...val) {
  return {
    "list": val
  }
}

exports.tuple = function (...val) {
  return {
    "tuple": val
  }
}

exports.map = function (val) {
  return {
    "map": val
  }
}

exports.set = function (...val) {
  return {
    "set": val
  }
}

exports.union = function (...val) {
  if (arguments.length !== 2) {
    throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
  }
  return {
    "union": val
  }
}

exports.refTo = function (val) {
  return {
    "refTo": val
  }
}

exports.model = function (val) {
  return {
    "model": val
  }
}

exports.bool = function (val) {
  return {
    "bool": val
  }
}

exports.symbol = function (val) {
  return {
    "symbol": val
  }
}

exports.int8 = function (val) {
  return {
    "int8": val
  }
}

exports.int16 = function (val) {
  return {
    "int16": val
  }
}

exports.int32 = function (val) {
  return {
    "int32": val
  }
}

exports.int64 = function (val) {
  return {
    "int64": val
  }
}

exports.uint8 = function (val) {
  return {
    "uint8": val
  }
}

exports.uint16 = function (val) {
  return {
    "uint16": val
  }
}

exports.uint32 = function (val) {
  return {
    "uint32": val
  }
}

exports.uint64 = function (val) {
  return {
    "uint64": val
  }
}

exports.float = function (val) {
  return {
    "float": val
  }
}

exports.dateTime = function (val) {
  return {
    "dateTime": val
  }
}

exports.struct = function (val = {}) {
  return {
    "struct": val
  }
}
