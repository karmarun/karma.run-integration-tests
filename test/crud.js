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
let entry = {
  "bool": true,
  "int": 1,
  "float": 0.5,
  "string": "example text",
  "dateTime": "2017-08-02T00:00:00Z",
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
  "tuple": [
    5,
    "example tuple"
  ],
  "enum": "bar",
  "set": [1, 2, 3],
  "union": {
    "variantA": {
      "intA": 1,
      "stringA": "a"
    }
  },
  "any": "asdfasdf"
}

test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200)
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
            "bool": {
              "bool": {}
            },
            "int": {
              "int": {}
            },
            "float": {
              "float": {}
            },
            "string": {
              "string": {}
            },
            "dateTime": {
              "dateTime": {}
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
            },
            "any": {
              "any": {}
            }
          }
        }
      }
    }
  })
  t.is(response.status, 200)
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
  t.is(response.status, 200)
  t.regex(response.body, recordIdRegex)
})

test.serial('create record', async t => {
  const response = await karmaApi.query({
    "create": {
      "in": {
        "tag": "tagTest"
      },
      "value": {
        "contextual": entry
      }
    }
  })
  t.is(response.status, 200)
  t.regex(response.body, recordIdRegex)
  recordId = response.body
})

test.serial('update record', async t => {
  entry.string += "updated"
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
        "contextual": entry
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, recordId)
})

test.serial('get record', async t => {
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
  t.is(response.status, 200)
  t.is(response.body.bool, entry.bool)
  t.is(response.body.float, entry.float)
  t.is(response.body.string, entry.string)
  t.is(response.body.dateTime, entry.dateTime)
  t.deepEqual(response.body.list, entry.list)
  t.deepEqual(response.body.map, entry.map)
  t.deepEqual(response.body.struct, entry.struct)
  t.deepEqual(response.body.tuple, entry.tuple)
  t.is(response.body.enum, entry.enum)
  // t.is(response.body.set, entry.set) // TODO
  t.deepEqual(response.body.union, entry.union)
  t.is(response.body.any, entry.any)

})

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
  t.is(response.status, 200)
  t.regex(response.body.a, recordIdRegex)
  t.regex(response.body.b, recordIdRegex)
  t.regex(response.body.c, recordIdRegex)
})
