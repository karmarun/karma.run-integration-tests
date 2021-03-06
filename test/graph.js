import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const recordIdRegex = /^[\S]{10,}$/
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
  const C1 = await createRecord(t, 'modelC', {
    "name": "modelC1"
  })
  const C2 = await createRecord(t, 'modelC', {
    "name": "modelC2"
  })
  const C3 = await createRecord(t, 'modelC', {
    "name": "modelC3"
  })
  const B = await createRecord(t, 'modelB', {
    "name": "modelB",
    "listC": [C1, C2, C3],
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

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test.serial('resolveRefs', async t => {
  let response = await karmaApi.tQuery(t, {
    "resolveRefs": {
      "value": {
        "resolveRefs": {
          "value": {
            "first": {
              "all": {
                "tag": "modelA"
              }
            }
          },
          "models": [
            {
              "tag": "modelB"
            }
          ]
        }
      },
      "models": [
        {
          "tag": "modelH"
        },
        {
          "tag": "modelD"
        },
        {
          "tag": "modelE"
        },
        {
          "tag": "modelI"
        }
      ]
    }
  })

  t.is(response.status, 200, JSON.stringify(response.body))
  t.truthy(response.body)
  t.is(response.body.name, 'modelA')
  t.truthy(response.body.refB)
  const refB = response.body.refB
  t.regex(refB.listC[0], recordIdRegex)
  t.deepEqual(refB.mapH, {"mapKey": {"name": "modelH"}})
  t.is(refB.name, 'modelB')
  t.regex(refB.optionalG, recordIdRegex)
  t.deepEqual(refB.setD, [{"name": "modelD"}])
  t.deepEqual(refB.tupleI, [{"name": "modelI"}, "test"])
  t.deepEqual(refB.unionEF, {"modelE": {"name": "modelE"}})
})

test.serial('resolveAllRefs', async t => {
  let response = await karmaApi.tQuery(t, {
    "resolveAllRefs": {
      "resolveAllRefs": {
        "first": {
          "all": {
            "tag": "modelA"
          }
        }
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body, {
      "name": "modelA",
      "refB": {
        "listC": [{"name": "modelC1"}, {"name": "modelC2"}, {"name": "modelC3"}],
        "mapH": {"mapKey": {"name": "modelH"}},
        "name": "modelB",
        "optionalG": {"name": "modelG"},
        "setD": [{"name": "modelD"}],
        "tupleI": [{"name": "modelI"}, "test"],
        "unionEF": {"modelE": {"name": "modelE"}}
      }
    }
  )
})

test.serial('graphFlow', async t => {
  let response = await karmaApi.tQuery(t, {
    "metarialize": {
      "first": {
        "all": {
          "tag": "modelB"
        }
      }
    }
  })
  response = await karmaApi.tQuery(t, {
    "graphFlow": {
      "start": {
        "newRef": {
          "model": {
            "tag": "modelB"
          },
          "id": response.body.id
        }
      },
      "flow": [
        {
          "from": {
            "tag": "modelB"
          },
          "backward": [
            {
              "tag": "modelA"
            }
          ],
          "forward": [
            {
              "tag": "modelC"
            },
            {
              "tag": "modelD"
            },
            {
              "tag": "modelE"
            },
            {
              "tag": "modelF"
            },
            {
              "tag": "modelG"
            },
            {
              "tag": "modelH"
            },
            {
              "tag": "modelI"
            }
          ]
        }
      ]
    }
  })
  const check = Object.entries(response.body).reduce((pref, model) => {
    const [modelId, resultList] = model
    t.regex(modelId, recordIdRegex)

    return Object.entries(resultList).reduce((_pref, entry) => {
      const [recordId, resultObject] = entry
      t.regex(recordId, recordIdRegex)
      _pref[resultObject.name] = true
      return _pref
    }, pref)
  }, {})
  t.deepEqual(check, {
      modelA: true,
      modelB: true,
      modelC1: true,
      modelC2: true,
      modelC3: true,
      modelD: true,
      modelE: true,
      modelG: true,
      modelH: true,
      modelI: true,
    }
  )
})

test.serial('referrers', async t => {
  let response = await karmaApi.tQuery(t, {
    "referrers": {
      "of": {
        "refTo": {
          "first": {
            "all": {
              "tag": "modelB"
            }
          }
        }
      },
      "in": {
        "tag": "modelA"
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body[0], recordIdRegex)
})

test.serial('referred', async t => {
  let response = await karmaApi.tQuery(t, {
    "referred": {
      "from": {
        "refTo": {
          "first": {
            "all": {
              "tag": "modelB"
            }
          }
        }
      },
      "in": {
        "tag": "modelC"
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
  t.regex(response.body[2], recordIdRegex)
})

//**********************************************************************************************************************
// Util Methods
//**********************************************************************************************************************

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