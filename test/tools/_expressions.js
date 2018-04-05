exports.tag = function (v) {
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