main()

function main () {
  const result = rewriteValue(
    {
      "name": "field",
      "description": "Takes a struct value and a field name. Returns the field's value.",
      "from": {
        "struct": {
          "name": {
            "string": {}
          },
          "value": {
            "struct": {
              "name": {
                "variable": "T"
              }
            }
          }
        }
      },
      "to": {
        "variable": "T"
      }
    }
  )
  console.log(JSON.stringify(result, null, 2))
}


function rewriteValue (data) {
  let out = {}
  for (let k in data) {
    let v = data[k];
    if (k === 'from' || k === 'to') {
      out[k] = rewriteSignature(v);
    } else {
      out[k] = v;
    }
  }
  return out
}

function rewriteSignature (data) {
  let keys = Object.keys(data)
  if (keys.length !== 1) {
    throw 'expected one key'
  }
  let caze = keys[0]
  let value = data[caze];
  switch (caze) {
    case "or":
      value = value.map(rewriteSignature)
      break
    case "expression":
      value = mapObject(value, rewriteSignature)
      break
    case "struct":
      value = mapObject(value, rewriteSignature)
      break
    case "union":
      value = mapObject(value, rewriteSignature)
      break
    case "assertPresent":
      value = mapObject(value, rewriteSignature)
      break
    case "refToType":
      value = rewriteSignature(value)
      break
    case "optional":
      value = rewriteSignature(value)
      break
    case "map":
      value = rewriteSignature(value)
      break
    case "set":
      value = rewriteSignature(value)
      break
    case "list":
      value = rewriteSignature(value)
      break
    case "key":
      value = rewriteSignature(value)
      break
    case "variable":
      break // leave as is
    case "refToModel":
      break // leave as is
    case "ref":
      break // leave as is
    case "anyRef":
      break // leave as is
    case "anyUnion":
      break // leave as is
    case "any":
      break // leave as is
    case "bool":
      break // leave as is
    case "dateTime":
      break // leave as is
    case "float":
      break // leave as is
    case "string":
      break // leave as is
    case "int":
      break // leave as is
    case "uint":
      break // leave as is
    case "int8":
      break // leave as is
    case "int16":
      break // leave as is
    case "int32":
      break // leave as is
    case "int64":
      break // leave as is
    case "uint8":
      break // leave as is
    case "uint16":
      break // leave as is
    case "uint32":
      break // leave as is
    case "uint64":
      break // leave as is
    case "null":
      break // leave as is
    default:
      throw caze;
  }

  return [caze, value];

}

function mapObject (o, f) {
  let out = {}
  for (let k in o) {
    out[k] = f(o[k])
  }
  return out
}