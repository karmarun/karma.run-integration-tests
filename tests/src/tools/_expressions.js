exports.tag = function tag(v) {
  return {
    "tag": v
  }
}

exports.after = function (tuple) {
  return {
    "after": tuple
  }
}

exports.before = function (tuple) {
  return {
    "before": tuple
  }
}

exports.length = function (v) {
  return {
    "length": v
  }
}

exports.all = function (ref) {
  return {
    "all": ref
  }
}

exports.greater = function (a, b) {
  return {
    "greater":
      [
        a,
        b
      ]
  }
}

exports.less = function (a, b) {
  return {
    "less":
      [
        a,
        b
      ]
  }
}

exports.equal = function (a, b) {
  return {
    "equal": [a, b]
  }
}

exports.and = function (a, b) {
  return {
    "and": [a, b]
  }
}

exports.or = function (a, b) {
  return {
    "or": [a, b]
  }
}

exports.field = function (key, value) {
  return {
    "field": [key, value]
  }
}

exports.key = function (key, value) {
  return {
    "key": [key, value]
  }
}

exports.not = function (val) {
  return {
    "not": val
  }
}

exports.addInt8 = function (a, b) {
  return {
    "addInt8": [a, b]
  }
}

exports.subInt8 = function (a, b) {
  return {
    "subInt8": [a, b]
  }
}

exports.mulInt8 = function (a, b) {
  return {
    "mulInt8": [a, b]
  }
}

exports.divInt8 = function (a, b) {
  return {
    "divInt8": [a, b]
  }
}

exports.assertPresent = function (value) {
  return {
    "assertPresent": value
  }
}


exports.assertCase = function (caseKey, value) {
  return {
    "assertCase": {
      "case": caseKey,
      "value": value
    }
  }
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
  return {
    "refTo": v
  }
}

exports.first = function (v) {
  return {
    "first": v
  }
}

exports.tuple = function (array) {
  return {
    "tuple": array
  }
}

exports.ref = function (...v) {
  if (arguments.length !== 2) {
    throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
  }
  return {
    "ref": v
  }
}

exports.metarialize = function (v) {
  return {
    "metarialize": v
  }
}

exports.scope = function (key) {
  return {
    "scope": key
  }
}

exports.expr = function (val) {
  return {
    "expr": val
  }
}

exports.define = function (name, argument) {
  return {
    "define": [name, argument]
  }
}

exports.create = function (_in, val) {
  return {
    "create": [
      _in,
      val
    ]
  }
}

exports.update = function (ref, val) {
  return {
    "update": {
      "ref": ref,
      "value": val
    }
  }
}

exports.delete = function (ref) {
  return {
    "delete": ref
  }
}

exports.get = function (ref) {
  return {
    "get": ref
  }
}

exports.mapList = function(value, expression) {
  return {
    mapList: [value, expression]
  }
}

module.exports = exports