import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const recordIdRegex = /^[\S]{10,}$/
const DB_NAME = 'db-api-test-permission'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env
const karmaApi = new KarmaApi(KARMA_ENDPOINT)


//**********************************************************************************************************************
// Init Tests
//**********************************************************************************************************************

test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
  const tags = await karmaApi.getTags()
  const result = await karmaApi.tQuery(t, {
    "do": {
      "createModels": {
        "createMultiple": {
          "in": {
            "tag": "_model"
          },
          "values": {
            "modelA": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  },
                  "refB": {
                    "ref": "modelB"
                  },
                  "refRole": {
                    "optional": {
                      "ref": tags['_role']
                    }
                  }
                }
              }
            },
            "modelB": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  },
                  "refC": {
                    "ref": "modelC"
                  }
                }
              }
            },
            "modelC": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
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

  const expression = await karmaApi.create(t, "_expression", {
    "switchModelRef": {
      "default": false,
      "cases": [
        {
          "match": {
            "tag": "_role"
          },
          "return": true
        },
        {
          "match": {
            "tag": "modelA"
          },
          "return": {
            "equal": [
              {
                "field": "refRole"
              },
              {
                "first": {
                  "referred": {
                    "from": {
                      "currentUser": {}
                    },
                    "in": {
                      "tag": "_role"
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  })
  const roleA = await karmaApi.create(t, '_role', {
    "name": "roleA",
    "permissions": {
      "create": expression,
      "delete": expression,
      "read": expression,
      "update": expression
    }
  })
  const userA = await karmaApi.create(t, '_user', {
    "password": "$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6",
    "roles": [
      roleA
    ],
    "username": "userA"
  })

  const modelC1 = await karmaApi.create(t, 'modelC', {
    "name": "modelC1"
  })
  const modelC2 = await karmaApi.create(t, 'modelC', {
    "name": "modelC2"
  })
  const modelB1 = await karmaApi.create(t, 'modelB', {
    "name": "modelB1",
    "refC": modelC1
  })
  const modelB2 = await karmaApi.create(t, 'modelB', {
    "name": "modelB2",
    "refC": modelC2
  })
  const modelA1 = await karmaApi.create(t, 'modelA', {
    "name": "modelA1",
    "refB": modelB1,
    "refRole": roleA
  })
  const modelA2 = await karmaApi.create(t, 'modelA', {
    "name": "modelA2",
    "refB": modelB2
  })
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test.serial('login with userA', async t => {
  const signature = await karmaApi.signIn(DB_NAME, 'userA', 'asdf')
  t.regex(signature, /.{50,200}/)
})

test.serial('get all modelA records', async t => {
  const response = await karmaApi.tQuery(t, {
    "all": {
      "tag": "modelA"
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.truthy(response.body[0])
  t.falsy(response.body[1])
  t.is(response.body[0].name, 'modelA1')
  t.regex(response.body[0].refB, recordIdRegex)
  t.regex(response.body[0].refRole, recordIdRegex)
})
