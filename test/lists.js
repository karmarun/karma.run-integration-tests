import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const DB_NAME = 'db-api-test-lists'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env
const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaApi(KARMA_ENDPOINT)
const entries = [
  {
    "string": "a",
    "int": 1,
    "float": 0.5,
    "bool": true,
  },
  {
    "string": "b",
    "int": 2,
    "float": 0.5,
    "bool": false,
  },
  {
    "string": "c",
    "int": 3,
    "float": 0.5,
    "bool": true,
  }
]

function sortEntries(a, b) {
  if (a.int > b.int) {
    return 1;
  }
  return -1
}

//**********************************************************************************************************************
// Init Tests
//**********************************************************************************************************************

test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
  const response = await karmaApi.tQuery(t, {
    "create": {
      "in": {
        "tag": "_tag"
      },
      "value": {
        "newStruct": {
          "tag": "tagTest",
          "model": {
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
                    "bool": {
                      "bool": {}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)

  await Promise.all(entries.map((entry) => {
    return karmaApi.create(t, 'tagTest', entry)
  }))
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************


test('mapList', async t => {
  const response = await karmaApi.tQuery(t, {
    "mapList": {
      "value": {
        "all": {
          "tag": "tagTest"
        }
      },
      "expression": {
        "field": "string"
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body.sort(), ['a', 'b', 'c'].sort())
})


test('filter', async t => {
  const response = await karmaApi.tQuery(t, {
    "filter": {
      "value": {
        "all": {
          "tag": "tagTest"
        }
      },
      "expression": {
        "or": [
          {
            "equal": [
              {
                "field": "string"
              },
              "a"
            ]
          },
          {
            "not": {
              "field": "bool"
            }
          }
        ]
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body.sort(sortEntries), [entries[0], entries[1]])
})

test('reduceList', async t => {
  const response = await karmaApi.tQuery(t, {
    "reduceList": {
      "value": {
        "newList": [1, 2, 3, 4]
      },
      "expression": {
        "add": [
          {
            "index": {
              "number": 0,
              "value": {
                "id": {}
              }
            }
          },
          {
            "index": {
              "number": 1,
              "value": {
                "id": {}
              }
            }
          }
        ]
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body, 10)
})


test('length', async t => {
  const response = await karmaApi.tQuery(t, {
    "length": {
      "all": {
        "tag": "tagTest"
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body, 3)
})

test('first', async t => {
  const response = await karmaApi.tQuery(t, {
    "first": {
      "all": {
        "tag": "tagTest"
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.truthy(response.body)
})
