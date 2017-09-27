import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const DB_NAME = 'db-api-test-functions'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaApi(KARMA_ENDPOINT)


test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
  await karmaApi.tQuery(t, {
    "do": {
      "createModels": {
        "createMultiple": {
          "in": {
            "tag": "_model"
          },
          "values": {
            "testModel": {
              "contextual": {
                "struct": {
                  "myString": {
                    "string": {}
                  },
                  "myInt": {
                    "int": {}
                  },
                  "myFloat": {
                    "float": {}
                  },
                  "myDateTime": {
                    "dateTime": {}
                  },
                  "myBool": {
                    "bool": {}
                  }
                }
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
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200)
})

test('after', async t => {
  const response = await karmaApi.tQuery(t, {
    "after": [
      {
        "newDateTime": "2018-01-01T00:00:00Z"
      },
      {
        "newDateTime": "2017-01-01T00:00:00Z"
      }
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('before', async t => {
  const response = await karmaApi.tQuery(t, {
    "before": [
      {
        "newDateTime": "2017-01-01T00:00:00Z"
      },
      {
        "newDateTime": "2018-01-01T00:00:00Z"
      }
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})


test('greater', async t => {
  const response = await karmaApi.tQuery(t, {
    "greater": [
      2.2,
      2.1
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('less', async t => {
  const response = await karmaApi.tQuery(t, {
    "less": [
      1,
      2
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('equal', async t => {
  const response = await karmaApi.tQuery(t, {
    "equal": [
      "foo",
      "foo"
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('and', async t => {
  const response = await karmaApi.tQuery(t, {
    "and": [
      {
        "equal": [4, 4]
      },
      true
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('equal', async t => {
  const response = await karmaApi.tQuery(t, {
    "or": [
      {
        "equal": [4, 4]
      },
      false
    ]
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('field', async t => {
  const response = await karmaApi.tQuery(t, {
    "field": {
      "name": "foo",
      "value": {
        "newStruct": {
          "foo": "bar"
        }
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('key', async t => {
  const response = await karmaApi.tQuery(t, {
    "key": {
      "name": "foo",
      "value": {
        "newMap": {"foo": "bar"}
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('not', async t => {
  const response = await karmaApi.tQuery(t, {
    "not": false
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('add', async t => {
  const response = await karmaApi.tQuery(t, {
    "add": [2, 4]
  })
  t.is(response.status, 200)
  t.is(response.body, 6)
})

test('subtract', async t => {
  const response = await karmaApi.tQuery(t, {
    "subtract": [2, 4]
  })
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('multiply', async t => {
  const response = await karmaApi.tQuery(t, {
    "multiply": [2.2, {"newFloat": 4}]
  })
  t.is(response.status, 200)
  t.is(response.body, 8.8)
})

test('divide', async t => {
  const response = await karmaApi.tQuery(t, {
    "divide": [{"newFloat": 2}, {"newFloat": -4}]
  })
  t.is(response.status, 200)
  t.is(response.body, -0.5)
})

test('zero', async t => {
  const response = await karmaApi.tQuery(t, {
    "get": {
      "create": {
        "in": {
          "tag": "testModel"
        },
        "value": {
          "zero": {}
        }
      }
    },
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, {
      myBool: false,
      myDateTime: '1754-08-30T22:43:41Z',
      myFloat: 0,
      myInt: 0,
      myString: ''
    }
  )
})

test('intToFloat', async t => {
  const response = await karmaApi.tQuery(t, {
    "divide": [{"newFloat": 2}, {"intToFloat": {"newInt": -4}}]
  })
  t.is(response.status, 200)
  t.is(response.body, -0.5)
})

test('floatToInt', async t => {
  const response = await karmaApi.tQuery(t, {
    "add": [{"newInt": 2}, {"floatToInt": {"newFloat": -4}}]
  })
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('assertPresent', async t => {
  const response = await karmaApi.tQuery(t, {
    "assertPresent": {
      "key": {
        "name": "notFoo",
        "value": {
          "newMap": {"foo": "bar"}
        }
      }
    }
  })
  t.is(response.status, 400)
  expect(response.body).to.have.own.property('message')
  expect(response.body).to.have.own.property('type')
})

test('assertCase', async t => {
  const response = await karmaApi.tQuery(t, {
    "assertCase": {
      "case": "foo",
      "value": {
        "newUnion": {"bar": 4}
      }
    }
  })
  t.is(response.status, 400)
  expect(response.body).to.have.own.property('message')
  expect(response.body).to.have.own.property('type')
  expect(response.body).to.have.own.property('program')
})

test('with', async t => {
  const response = await karmaApi.tQuery(t, {
    "with": {
      "value": {
        "newStruct": {
          "valA": 4,
          "valB": -6
        }
      },
      "return": {
        "add": [
          {
            "field": "valA"
          },
          {
            "field": "valB"
          }
        ]
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('isPresent', async t => {
  const response = await karmaApi.tQuery(t, {
    "isPresent": {
      "key": {
        "name": "notFoo",
        "value": {
          "newMap": {"foo": "bar"}
        }
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('matchRegex', async t => {
  const regex = "^(?:(http[s]?|ftp[s])://)?([^:/\\s]+)(:[0-9]+)?((?:/\\w+)*/)([\\w\\-\\.]+[^#?\\s]+)([^#\\s]*)?(#[\\w\\-]+)?$"
  let response = await karmaApi.tQuery(t, {
    "matchRegex": {
      "value": "https://www.google.com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash",
      "regex": regex,
      "caseInsensitive": true,
      "multiLine": false
    }
  })
  t.is(response.status, 200)
  t.is(response.body, true)

  response = await karmaApi.tQuery(t, {
    "matchRegex": {
      "value": "https://www.google:com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash",
      "regex": regex,
      "caseInsensitive": true,
      "multiLine": false
    }
  })
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('if', async t => {
  const response = await karmaApi.tQuery(t, {
    "if": {
      "condition": {
        "greater": [
          2.2,
          2.1
        ]
      },
      "then": {
        "add": [2, 4]
      },
      "else": {
        "subtract": [2, 4]
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body, 6)
})