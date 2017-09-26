import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaTools} = require('karma-tools-1-3')

const DB_NAME = 'db-api-test-crud'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaTools(KARMA_ENDPOINT)
let recordId = null
let record = {
  "string": "example text",
  "int": 1,
  "float": 0.5,
  "dateTime": "2017-08-02T00:00:00Z",
  "bool": true,
  "tuple": [
    5,
    "example tuple"
  ],
  "list": [
    {
      "fieldA": "a",
      "filedB": "b"
    }
  ],
  "map": {
    "a": "a",
    "b": "b"
  },
  "struct": {
    "fieldA": "a",
    "filedB": "b"
  },
  "union": {
    "variantA": {
      "intA": 1,
      "stringA": "a"
    }
  },
  "or": 222,
  "unique": "unique",
  "any": "any",
  "enum": "bar",
  "set": [1, 2, 3],
}

test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})

test.serial('create model', async t => {
  let response = await karmaApi.query({
    "create": {
      "in": {
        "tag": "_model"
      },
      "value": {
        "contextual": {
          "struct": {
            "string": {
              "string": {}
            },
            "int": {
              "int": {}
            },
            "float": {
              "float": {}
            },
            "dateTime": {
              "dateTime": {}
            },
            "bool": {
              "bool": {}
            },
            "tuple": {
              "tuple": [
                {
                  "int": {}
                },
                {
                  "string": {}
                }
              ]
            },
            "list": {
              "list": {
                "struct": {
                  "fieldA": {
                    "string": {}
                  },
                  "filedB": {
                    "string": {}
                  }
                }
              }
            },
            "map": {
              "map": {
                "string": {}
              }
            },
            "struct": {
              "struct": {
                "fieldA": {
                  "string": {}
                },
                "filedB": {
                  "string": {}
                }
              }
            },
            "union": {
              "union": {
                "variantA": {
                  "struct": {
                    "stringA": {
                      "string": {}
                    },
                    "intA": {
                      "int": {}
                    }
                  }
                },
                "variantB": {
                  "struct": {
                    "stringB": {
                      "string": {}
                    },
                    "intB": {
                      "int": {}
                    }
                  }
                }
              }
            },
            "or": {
              "or": [
                {
                  "int": {}
                },
                {
                  "string": {}
                }
              ]
            },
            "optional": {
              "optional": {
                "string": {}
              }
            },
            "unique": {
              "unique": {
                "string": {}
              }
            },
            "any": {
              "any": {}
            },
            "enum": {
              "enum": [
                "foo",
                "bar",
                "pop"
              ]
            },
            "set": {
              "set": {
                "int": {}
              }
            }
          }
        }
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)
  const recordId = response.body
  response = await karmaApi.query({
    "create": {
      "in": {
        "tag": "_tag"
      },
      "value": {
        "contextual": {
          "tag": "tagTest",
          "model": recordId
        }
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)
})

test.serial('create record', async t => {
  const response = await karmaApi.query({
    "create": {
      "in": {
        "tag": "tagTest"
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)
  recordId = response.body
})

test.serial('create same record again', async t => {
  const response = await karmaApi.query({
    "create": {
      "in": {
        "tag": "tagTest"
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 400, 'should fail because of unique object')
})

test.serial('check record', async t => {
  const response = await karmaApi.query({
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})

test.serial('update record but without any changes', async t => {
  // useful to check if it's possible to update unique objects
  const response = await karmaApi.query({
    "update": {
      "ref": {
        "newRef": {
          "model": {
            "tag": "tagTest"
          },
          "id": recordId
        }
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body, recordId)
})

test.serial('check record', async t => {
  const response = await karmaApi.query({
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})

test.serial('update record with changes', async t => {
  record.string += "updated"
  record.or = "string"
  record.optional = "optional"
  record.unique += "updated"
  const response = await karmaApi.query({
    "update": {
      "ref": {
        "newRef": {
          "model": {
            "tag": "tagTest"
          },
          "id": recordId
        }
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body, recordId)
})

test.serial('check record', async t => {
  const response = await karmaApi.query({
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})

function compareResponse (t, response, expected) {
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body.string, expected.string)
  t.is(response.body.int, expected.int)
  t.is(response.body.float, expected.float)
  t.is(new Date(response.body.dateTime).getTime(), new Date(expected.dateTime).getTime())
  t.is(response.body.bool, expected.bool)
  t.deepEqual(response.body.tuple, expected.tuple)
  t.deepEqual(response.body.list, expected.list)
  t.deepEqual(response.body.map, expected.map)
  t.deepEqual(response.body.struct, expected.struct)
  t.deepEqual(response.body.union, expected.union)
  t.deepEqual(response.body.or, expected.or)
  if (expected.optional) {
    t.is(response.body.optional, expected.optional)
  }
  else {
    t.falsy(response.body.optional)
  }
  t.is(response.body.any, expected.any)
  t.is(response.body.enum, expected.enum)
  // t.is(response.body.set, entry.set) // TODO
}


test.serial('create models with circular dependencies', async t => {
  const response = await karmaApi.query({
    "do": {
      "createModels": {
        "createMultiple": {
          "in": {
            "tag": "_model"
          },
          "values": {
            "a": {
              "contextual": {
                "ref": "b"
              }
            },
            "b": {
              "contextual": {
                "ref": "c"
              }
            },
            "c": {
              "contextual": {
                "ref": "a"
              }
            }
          }
        }
      },
      "createTag": {
        "create": {
          "in": {
            "tag": "_tag"
          },
          "value": {
            "newStruct": {
              "tag": {
                "field": {
                  "name": "key",
                  "value": {
                    "id": {}
                  }
                }
              },
              "model": {
                "field": {
                  "name": "value",
                  "value": {
                    "id": {}
                  }
                }
              }
            }
          }
        }
      },
      "return": {
        "mapMap": {
          "value": {
            "bind": "createModels"
          },
          "expression": {
            "bind": "createTag"
          }
        }
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body.a, recordIdRegex)
  t.regex(response.body.b, recordIdRegex)
  t.regex(response.body.c, recordIdRegex)
})
