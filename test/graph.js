import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const DB_NAME = 'db-api-test-graph'
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
  await karmaApi.tQuery(t, {
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
                  "myRef": {
                    "ref": "modelB"
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
                  "listC": {
                    "list": {
                      "ref": "modelC"
                    }
                  },
                  "setD": {
                    "list": {
                      "ref": "modelD"
                    }
                  },
                  "unionEF": {
                    "union": {
                      "modelE": {
                        "ref": "modelE"
                      },
                      "modelF": {
                        "ref": "modelF"
                      }
                    }
                  },
                  "optionalG": {
                    "ref": "modelG"
                  },
                  "mapH": {
                    "ref": "modelH"
                  },
                  "tupleI": [
                    {
                      "ref": "modelI"
                    },
                    {
                      "string": {}
                    }
                  ]
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
            },
            "modelD": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  }
                }
              }
            },
            "modelE": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  }
                }
              }
            },
            "modelF": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  }
                }
              }
            },
            "modelG": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  }
                }
              }
            },
            "modelH": {
              "contextual": {
                "struct": {
                  "name": {
                    "string": {}
                  }
                }
              }
            },
            "modelI": {
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
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test.serial('create model', async t => {
  let response = await karmaApi.tQuery(t, {
    "all": {
      "tag": "_tag"
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
})

