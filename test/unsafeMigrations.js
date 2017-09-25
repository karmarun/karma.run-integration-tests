import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaTools} = require('karma-tools-1-3')

const DB_NAME = 'db-api-test-unsafe-migrations'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaTools(KARMA_ENDPOINT)


test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200)
})

test.serial('create multiple models', async t => {
  const response = await karmaApi.query({
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
                  "myOptional": {
                    "optional": {
                      "string": {}
                    }
                  },
                  "myString": {
                    "string": {}
                  },
                  "myInt": {
                    "int": {}
                  },
                  "myFloat": {
                    "float": {}
                  },
                  "myUnion": {
                    "union": {
                      "caseA": {
                        "string": {}
                      }
                    }
                  },
                  "myStruct": {
                    "struct": {
                      "myKeyA": {
                        "string": {}
                      }
                    }
                  },
                  "myRef": {
                    "ref": "refTestModel"
                  }
                }
              }
            },
            "refTestModel": {
              "contextual": {
                "struct": {
                  "myString": {
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
  t.is(response.status, 200)
  t.regex(response.body.refTestModel, recordIdRegex)
  t.regex(response.body.testModel, recordIdRegex)
})

test.serial('create entries', async t => {
  const response = await karmaApi.query({
    "createMultiple": {
      "in": {
        "tag": "testModel"
      },
      "values": {
        "a": {
          "newStruct": {
            "myOptional": "optional string",
            "myString": {
              "newString": "foo"
            },
            "myInt": {
              "newInt": 555
            },
            "myFloat": {
              "newFloat": 5.55
            },
            "myUnion": {
              "newUnion": {
                "caseA": "myCaseAString"
              }
            },
            "myStruct": {
              "newStruct": {
                "myKeyA": {
                  "newString": "myStructKeyA"
                }
              }
            },
            "myRef": {
              "create": {
                "in": {
                  "tag": "refTestModel"
                },
                "value": {
                  "newStruct": {
                    "myString": {
                      "newString": "test reference"
                    }
                  }
                }
              }
            }
          }
        },
        "b": {
          "newStruct": {
            "myString": {
              "newString": "bar"
            },
            "myInt": {
              "newInt": 555
            },
            "myFloat": {
              "newFloat": 5.55
            },
            "myUnion": {
              "newUnion": {
                "caseA": "myCaseAString"
              }
            },
            "myStruct": {
              "newStruct": {
                "myKeyA": {
                  "newString": "myStructKeyA"
                }
              }
            },
            "myRef": {
              "create": {
                "in": {
                  "tag": "refTestModel"
                },
                "value": {
                  "newStruct": {
                    "myString": {
                      "newString": "test reference"
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
  t.is(response.status, 200)
  t.regex(response.body.a, recordIdRegex)
  t.regex(response.body.b, recordIdRegex)
})

test.serial('create unsafe migration', async t => {
  const response = await karmaApi.query({
    "unsafeMutateModel": {
      "model": {
        "tag": "testModel"
      },
      "expression": {
        "newStruct": {
          "myString": {
            "field": "myString"
          },
          "myRenamedString": {
            "field": "myString"
          },
          "myInt": {
            "field": "myInt"
          },
          "myNewInt": {
            "floatToInt": {
              "field": "myFloat"
            }
          },
          "myFloat": {
            "field": "myFloat"
          },
          "myNewFloat": {
            "add": [
              {
                "intToFloat": {
                  "field": "myInt"
                }
              },
              {
                "field": "myFloat"
              }
            ]
          },
          "myStruct": {
            "newStruct": {
              "myKeyA": {
                "field": {
                  "name": "myKeyA",
                  "value": {
                    "field": "myStruct"
                  }
                }
              },
              "myKeyB": {
                "newInt": 888
              }
            }
          },
          "myUnion": {
            "newUnion": {
              "caseA": {
                "assertCase": {
                  "case": "caseA",
                  "value": {
                    "field": "myUnion"
                  }
                }
              }
            }
          },
          "myRef": {
            "field": "myRef"
          },
          "myNewBool": {
            "newBool": true
          },
          "myNewString": {
            "newString": "Lorem ipsum"
          }
        }
      }
    }
  })
  t.is(response.status, 200)
})

test.serial('create unsafe migration', async t => {
  const response = await karmaApi.query({
    "first": {
      "filter": {
        "value": {
          "all": {
            "tag": "testModel"
          }
        },
        "expression": {
          "equal": [
            "foo",
            {
              "field": "myString"
            }
          ]
        }
      }
    }
  })
  t.is(response.status, 200)
  t.is(response.body.myFloat, 5.55)
  t.is(response.body.myInt, 555)
  t.is(response.body.myNewBool, true)
  t.is(response.body.myNewFloat, 560.55)
  t.is(response.body.myNewInt, 5)
  t.is(response.body.myNewString, 'Lorem ipsum')
  t.is(response.body.myRenamedString, 'foo')
  t.is(response.body.myString, 'foo')
  t.deepEqual(response.body.myStruct, {"myKeyA": "myStructKeyA", "myKeyB": 888})
  t.deepEqual(response.body.myUnion, {"caseA": "myCaseAString"})
})
