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
  let result = await karmaApi.tQuery(t, {
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
                    "map": {
                      "ref": "modelH"
                    }
                  },
                  "tupleI": {
                    "tuple": [
                      {
                        "ref": "modelI"
                      },
                      {
                        "string": {}
                      }
                    ]
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
  const I = await createRecord(t, 'modelI', {
    "name": "modelI"
  })
  const H = await createRecord(t, 'modelH', {
    "name": "modelH"
  })
  const G = await createRecord(t, 'modelG', {
    "name": "modelG"
  })
  const F = await createRecord(t, 'modelF', {
    "name": "modelF"
  })
  const E = await createRecord(t, 'modelE', {
    "name": "modelE"
  })
  const D = await createRecord(t, 'modelD', {
    "name": "modelD"
  })
  const C = await createRecord(t, 'modelC', {
    "name": "modelC"
  })
  const B = await createRecord(t, 'modelB', {
    "name": "modelB",
    "listC": [C],
    "setD": [D],
    "unionEF": {
      "modelE": E
    },
    "optionalG": G,
    "mapH": {
      "mapKey": H
    },
    "tupleI": [
      I,
      "test"
    ]
  })
  const A = await createRecord(t, 'modelA', {
    "name": "modelA",
    "refB": B
  })
})

async function createRecord (t, tag, contextual) {
  const response = await karmaApi.tQuery(t, {
    "create": {
      "in": {
        "tag": tag
      },
      "value": {
        "contextual": contextual
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  return response.body
}

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

